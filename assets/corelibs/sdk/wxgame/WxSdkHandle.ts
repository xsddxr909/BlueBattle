import ISdkHandle from "../../interface/sdk/ISdkHandle";
import ISdkCallback from "../../interface/sdk/ISdkCallback";
import IShareAppMsg from "../../interface/sdk/IShareAppMsg";
import {AuthType,DataType,ShareCbType,VibrateType,MessageType,UserInfoButtonType,ImageUrlType} from "../SdkType";
import {EventType,HTTP_ID,EventID} from "../../CoreDefine";
import HttpMgr from "../../net/HttpMgr";
import CoreConfig from "../../CoreConfig";
import Core from "../../Core";
import {UserInfo,ShareAppMsg,LoginMsg,ShareCbMsg,LaunchQuery,RankConfig,KVData,CanvasConfig,UserInfoButtonStyle,UserInfoTextButton,UserInfoImageButton} from "./SdkObject";
import {HttpReqLogin} from "../../net/HttpMsg";
import SdkConfig from "../SdkConfig";
import Capture from "./Capture";

declare var wx;
declare var canvas;

export default class WxSdkHandle implements ISdkHandle
{
    private m_arrShareTicket: Array<string>;
    private m_arrGroupMsgInfo: Array<any>;

    private m_bHasLogined: boolean = false;

    private m_stInfo: UserInfo;

    private m_stInfoTextButton: UserInfoTextButton;
    private m_stInfoImageButton: UserInfoImageButton;

    private m_stOpendataContext: any;
    /**启动时的查询参数 */
    private m_stLaunchQuery: LaunchQuery;
    /**重新被展示时的查询参数 */
    private m_stShowQuery: LaunchQuery;

    /**截图模块 */
    private m_stCapture: Capture;

    /**分享内容对象 */
    private confing: CanvasConfig;
    /**分享内容信息对象 */
    private shareMsg: ShareAppMsg;

    private tempArr: Array<string>;



    public constructor()
    {
        this.m_arrShareTicket = new Array<string>();
        this.m_arrGroupMsgInfo = new Array<any>();
        this.m_stLaunchQuery = new LaunchQuery();
        this.m_stCapture = new Capture();
        this.m_stShowQuery = new LaunchQuery();
        this.shareMsg = new ShareAppMsg();
        this.tempArr = new Array<string>();
        this.m_stInfoTextButton = null;
        this.m_stInfoImageButton = null;
    }

    /**微信小游戏sdk初始化 */
    public Init(): void
    {
        if(this.HasSdk())
        {
            this.ShowShare(true);
            if(SdkConfig.USE_OPEN_DATA)
            {
                this.m_stOpendataContext = wx.getOpenDataContext();//开放数据域画布
                this.m_stOpendataContext.canvas.height = CoreConfig.GAME_HEIGHT * 3;
                this.m_stOpendataContext.canvas.width = CoreConfig.GAME_WIDTH;
                // this.PostOpenMessage(MessageType.SetRankConfig,new RankConfig()); 暂时注释zhouyulong
            }
            let self = this;
            wx.onShow(function(res)
            {
                //设置小游戏重现显示的监听
                self.m_stShowQuery.SetQuery(res.query);
                Core.EventMgr.Emit(EventID.SdkEvent.ON_SHOW,self.m_stShowQuery);
            });
        }
    }

    /**获取小游戏的启动参数，用于做邀战等操作 */
    public GetLaunchQuery(): LaunchQuery
    {
        if(this.HasSdk())
        {
            this.m_stLaunchQuery.SetQuery(wx.getLaunchOptionsSync().query);
            this.m_stLaunchQuery.shareTicket = wx.getLaunchOptionsSync().shareTicket;
            this.m_stLaunchQuery.scene = wx.getLaunchOptionsSync().scene;
        }
        return this.m_stLaunchQuery;
    }

    /**登陆获取code */
    public Login(): void
    {
        if(this.HasSdk())
        {
            let stLoginObj: any = {};
            let self = this;
            stLoginObj.success = function(res)
            {
                console.log("平台登陆成功!:" + res.code);
                let stLoginMsg = new LoginMsg();
                stLoginMsg.m_sCode = res.code;
                Core.EventMgr.Emit(EventID.SdkEvent.CB_SUCCESS_LOGIN,stLoginMsg);
                self.m_bHasLogined = true;
            }
            stLoginObj.fail = function(errMsg)
            {
                Core.EventMgr.Emit(EventID.SdkEvent.CB_FAIL_LOGIN,errMsg);
            }
            stLoginObj.complete = function(res)
            {
                Core.EventMgr.Emit(EventID.SdkEvent.CB_COMPLETE_LOGIN,res);
            }
            wx.login(stLoginObj);
        }

    }


    /**获取授权，需重构为事件派发 */
    public GetAuthorize(authType: AuthType,sdkCallback?: ISdkCallback): void
    {
        if(this.HasSdk())
        {
            let stAuthObj: any = {};
            stAuthObj.scope = authType;
            if(!sdkCallback)
            {
                sdkCallback = {};
            }
            stAuthObj.success = function()
            {
                if(sdkCallback.OnSuccess)
                {
                    sdkCallback.OnSuccess();
                }
            }
            stAuthObj.fail = function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                if(sdkCallback.OnFail)
                {
                    sdkCallback.OnFail();
                }
            }
            sdkCallback.OnComplete && (stAuthObj.complete = sdkCallback.OnComplete);
            wx.authorize(stAuthObj);
        }
    }


    /**分享设置，与查询参数配套，可以完成邀战、群排行等操作
     * 目前有个坑：ShareTickets还不知道会在什么时候返回一个数组
     */
    public Share(appMsg: ShareAppMsg): void
    {
        if(this.HasSdk())
        {
            let stShareObj: any = {};
            if(appMsg.Title)
            {
                stShareObj.title = appMsg.Title;
            }
            if(appMsg.ImageUrl)
            {
                stShareObj.imageUrl = appMsg.ImageUrl;
            }
            if(appMsg.Query)
            {
                stShareObj.query = appMsg.Query;
            }
            let self = this;
            let stShareResult: ShareCbMsg = new ShareCbMsg();
            stShareObj.success = function(res)
            {
                /**通过ShareTickets的长度来判断分享的对象是群聊还是个人，可能有坑；
                 * 若正式版发布后发现不符，请尝试结合onshow的res.scence，来进行判断*/
                if(res.shareTickets)
                {
                    stShareResult.eCallbackType = ShareCbType.SUCCESS_GROUP;
                    stShareResult.sShareTickets = res.shareTickets;
                }
                else
                {
                    stShareResult.eCallbackType = ShareCbType.SUCCESS_SINGLE;
                }
                Core.EventMgr.Emit(EventID.SdkEvent.CB_SHARE_SUCCESS,stShareResult);
            }
            stShareObj.fail = function(err)
            {
                let sMsg: string = err.errMsg;
                /**用户取消操作时错误信息内容 */
                if(sMsg.indexOf("cancel") >= 0)
                {
                    stShareResult.eCallbackType = ShareCbType.FAIL_CANCEL;
                }
                else if(sMsg.indexOf("permission") >= 0)
                {
                    stShareResult.eCallbackType = ShareCbType.FAIL_PERMISSION;
                }
                else
                {
                    stShareResult.eCallbackType = ShareCbType.FAIL_UNKNOWN;
                }
            }
            stShareObj.complete = function(res)
            {
                Core.EventMgr.Emit(EventID.SdkEvent.CB_SHARE,stShareResult);
            }

            wx.updateShareMenu({
                withShareTicket: true
            })
            wx.shareAppMessage(stShareObj);
        }
    }

    /**往开放数据域内传递信息；
     * 注意：开放数据域在现在微信开放的接口中，不能回传信息，只能从主域单方面传递信息；
     * 开放数据域不能对游戏进行任何修改，包括公用画布SharedCanvas的大小；
     * @param msgType 数据类型
     * @param data 数据内容
     */
    public PostOpenMessage(msgType: MessageType,data: any,shareTicket: string = ""): void
    {
        if(this.HasSdk() && SdkConfig.USE_OPEN_DATA)
        {
            let msgData: any = {};
            msgData.msgType = msgType;
            if(data)
            {
                msgData.data = data;
                msgData.shareTicket = shareTicket;
            }
            this.m_stOpendataContext.postMessage(msgData);
        }
    }

    /**获取开放数据域画布的宽度 */
    public GetShareCanvasWidth(): number
    {
        if(this.HasSdk() && SdkConfig.USE_OPEN_DATA)
        {
            return this.m_stOpendataContext.canvas.width;
        }
        return 0;
    }

    /**获取开放数据域画布的高度 */
    public GetShareCanvasHegith(): number
    {
        if(this.HasSdk() && SdkConfig.USE_OPEN_DATA)
        {
            return this.m_stOpendataContext.canvas.height;
        }
        return 0;
    }

    /**获取开放数据域的画布，可将其当成贴图渲染到webgl类型的canvas上，即cocos的Sprite上
     * 必须要在配置中 将USE_OPEN_DATA置为true才可正常使用
     */
    public GetShareCanvas(): any
    {
        if(this.HasSdk() && SdkConfig.USE_OPEN_DATA)
        {
            return this.m_stOpendataContext.canvas;
        }
        return canvas;
    }

    /**尚未实现的支付接口 */
    public Pay(price: number): void
    {

    }

    /**尚未实现的录音接口 */
    public Record(): void
    {

    }

    /**尚未实现的选择图片接口，有拍照的可能存在 */
    public ChooseImage(): void
    {
        if(this.HasSdk())
        {
            wx.chooseImage({
                success: function(res)
                {
                    console.log("Choose Image Success!");
                },
                fail: function(res)
                {
                    console.log("Choose Image Fail");
                }
            })
        }
    }

    /**手机振动，短的15ms，长的400ms */
    public Vibrate(vbType: VibrateType,sdkCallback?: ISdkCallback): void
    {
        if(this.HasSdk())
        {
            if(!sdkCallback)
            {
                sdkCallback = {};
            }
            let stVibrateObj: any = {};
            sdkCallback.OnSuccess && (stVibrateObj.success = sdkCallback.OnSuccess);
            sdkCallback.OnFail && (stVibrateObj.fail = sdkCallback.OnFail);
            sdkCallback.OnComplete && (stVibrateObj.complete = sdkCallback.OnComplete);
            switch(vbType)
            {
                case VibrateType.SHORT:
                    wx.vibrateShort(stVibrateObj);
                    break;
                case VibrateType.LONG:
                    wx.vibrateLong(stVibrateObj);
                    break;
                default:
                    break;
            }
        }
    }

    /**获取玩家信息
     * @param withDelicate 敏感数据开关，尚未知道用途
     */
    public GetUserInfo(withDelicate: boolean = false): void
    {
        if(this.HasSdk())
        {
            let infoObj: any = {};
            /**这个参数需要登陆之后才能使用 */
            if(this.m_bHasLogined)
            {
                infoObj.withCredentials = withDelicate;
            }
            let self = this;
            infoObj.success = function(res)
            {
                self.m_stInfo = res.userInfo;
                let stUserInfo: UserInfo = new UserInfo(res.userInfo);
                Core.EventMgr.Emit(EventID.SdkEvent.CB_SUCCESS_USER_INFO,stUserInfo);
            }
            infoObj.fail = function(err)
            {
                Core.EventMgr.Emit(EventID.SdkEvent.CB_FAIL_USER_INFO,err);
            }
            infoObj.complete = function()
            {
                Core.EventMgr.Emit(EventID.SdkEvent.CB_COMPLETE_USER_INFO,null);
            }
            wx.getUserInfo(infoObj);
        }
    }

    /**创建唯一的文本类获取用户信息的按钮 */
    public CreateTextUserInfoButton(sText: string,stStyle: UserInfoButtonStyle): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoTextButton != null)
            {
                this.m_stInfoTextButton.Destroy();
            }
            let buttonObject: any = {};
            buttonObject.type = UserInfoButtonType.Text;
            buttonObject.text = sText;
            buttonObject.style = stStyle;
            buttonObject.image = "";
            this.m_stInfoTextButton = new UserInfoTextButton(this.CreateUserInfoButton(buttonObject));
        }
    }

    public SetTextOfTextUserInfoButton(sText: string): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoTextButton != null)
            {
                this.m_stInfoTextButton.Text = sText;
            }
        }
    }

    public SetStyleOfTextUserInfoButton(stStyle: UserInfoButtonStyle): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoTextButton != null)
            {
                this.m_stInfoTextButton.Style = stStyle;
            }
        }
    }

    public ShowTextUserInfoButton(): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoTextButton != null)
            {
                this.m_stInfoTextButton.Show();
            }
        }
    }

    public HideTextUserInfoButton(): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoTextButton != null)
            {
                this.m_stInfoTextButton.Hide();
            }
        }
    }

    public DestroyTextUserInfoButton(): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoTextButton != null)
            {
                this.m_stInfoTextButton.Destroy();
                this.m_stInfoTextButton = null;
            }
        }
    }

    /**创建唯一的图像类获取用户信息的按钮 */
    public CreateImageUserInfoButton(sImageUrl: string,stStyle: UserInfoButtonStyle): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoImageButton != null)
            {
                this.m_stInfoImageButton.Destroy();
            }
            let buttonObject: any = {};
            buttonObject.type = UserInfoButtonType.Image;
            buttonObject.image = sImageUrl;
            buttonObject.style = stStyle;
            this.m_stInfoImageButton = new UserInfoImageButton(this.CreateUserInfoButton(buttonObject));
        }
    }

    public SetImageOfImageUserInfoButton(sImageUrl: string): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoImageButton != null)
            {
                this.m_stInfoImageButton.Image = sImageUrl;
            }
        }
    }

    public SetStyleOfImageUserInfoButton(stStyle: UserInfoButtonStyle): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoImageButton != null)
            {
                this.m_stInfoImageButton.Style = stStyle;
            }
        }
    }

    public ShowImageUserInfoButton(): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoImageButton != null)
            {
                this.m_stInfoImageButton.Show();
            }
        }
    }

    public HideImageUserInfoButton(): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoImageButton != null)
            {
                this.m_stInfoImageButton.Hide();
            }
        }
    }

    public DestoryImageUserInfoButton(): void
    {
        if(this.HasSdk())
        {
            if(this.m_stInfoImageButton != null)
            {
                this.m_stInfoImageButton.Destroy();
                this.m_stInfoImageButton = null;
            }
        }
    }

    /**设置开放数据域画布的大小 */
    public SetShareCanvasSize(iWidth: number,iHeight: number): void
    {
        if(this.HasSdk() && SdkConfig.USE_OPEN_DATA)
        {
            this.m_stOpendataContext.canvas.width = iWidth;
            this.m_stOpendataContext.canvas.height = iHeight;
        }
    }

    /**
     * 托管数据的限制 
     *   1、每个openid所标识的微信用户在每个游戏上托管的数据不能超过128个key-value对。
     *   2、上报的key-value列表当中每一项的key+value长度都不能超过1K(1024)字节。
     *   3、上报的key-value列表当中每一个key长度都不能超过128字节。
     * @param key 
     * @param value 
     */
    public UploadDataToCloud(KVList: Array<KVData>): void
    {
        if(this.HasSdk())
        {
            wx.setUserCloudStorage({
                KVDataList: KVList,
            })
        }
    }

    /**创建自定义截图 */
    public CreatCustomCapture(canvasConfig: CanvasConfig): void
    {
        if(this.HasSdk())
        {
            this.m_stCapture.CreateCanvas(canvasConfig);
        }
    }

    /**直接截取canvas，cocosCreator构建后的游戏是一个只有一个主Canvas的游戏 */
    public Capture(x: number,y: number,width: number,height: number): void
    {
        if(this.HasSdk())
        {
            this.m_stCapture.CaptureSelf(x,y,width,height);
        }
    }

    /**移除本用户的某些托管数据 */
    public RemoveDataFromCloud(keys: Array<string>): void
    {
        if(this.HasSdk())
        {
            wx.removeUserCloudStorage({
                keyList: keys,
            })
        }
    }


    /**
     * 打开其它游戏
     */
    public openOtherGame(appID: string): void
    {

        wx.navigateToMiniProgram(
            {

                appId: appID,
                success: (data) =>
                {

                    console.log(data);
                },
                fail: (data) =>
                {

                    console.log(data);
                }
            });
    }

    /**
     * 微信request
     */
    public wx_request(url: string,method: string,data: object,header: object,success?: Function,fail?: Function): void
    {
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res)
            {
                if(success != null)
                {
                    success(res);
                }
            },
            fail: function()
            {
                if(fail != null)
                {
                    fail();
                }
            }
        });
    }

    /**
     * 分享到群
     */
    public shareToGroup(confing: CanvasConfig): void
    {
        this.confing = confing;
        Core.EventMgr.BindEvent(EventID.SdkEvent.CB_FAIL_CREATECANVAS,this.onJieTuFail,this);
        Core.EventMgr.BindEvent(EventID.SdkEvent.CB_SUCCESS_CREATECANVAS,this.onJieTuSuccess,this);
        Core.SdkHandleMgr.CreatCustomCapture(confing);
    }

    /**
     * 识别图片中的二维码
     */
    public wx_previewImage(urls: Array<string>): void
    {
        wx.previewImage({
            urls: urls
        })
    }

    /**
     * 右上角转发分享
     */
    public wx_onShareAppMessage(title: string): void
    {
        let that: any = this;
        let imageUrl: string;
        wx.onShareAppMessage(function()
        {
            imageUrl = that.tempArr[Math.floor(Math.random() * that.tempArr.length)];
            return {
                title: title,
                imageUrl: "share/" + imageUrl,
            }
        })
    }

    public addShareContextImg(ImgArr:Array<string>): void{
        this.tempArr = this.tempArr.concat(ImgArr);
    }
    public resetShareContextImg():void{
        this.tempArr =new Array<string>();
    }

    /**显示转发按钮，必须打开才可以分享 */
    private ShowShare(withTicket = true,sdkCallback?: ISdkCallback)
    {
        if(this.HasSdk())
        {
            let showShareObj: any = {};
            showShareObj.withShareTicket = withTicket;
            if(sdkCallback)
            {
                sdkCallback.OnSuccess && (showShareObj = sdkCallback.OnSuccess);
                sdkCallback.OnFail && (showShareObj = sdkCallback.OnFail);
                sdkCallback.OnComplete && (showShareObj = sdkCallback.OnComplete);
            }
            wx.showShareMenu(showShareObj);
        }
    }

    /**判断是否有对应的sdk；
     * 不能直接用typeof(wx)=="undefined"，因为微信的浏览器下运行时会为true；
     */
    private HasSdk(): boolean
    {
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }


    private onJieTuFail(): void
    {
        Core.EventMgr.UnbindEvent(EventID.SdkEvent.CB_FAIL_CREATECANVAS,this.onJieTuFail,this);
        Core.EventMgr.UnbindEvent(EventID.SdkEvent.CB_SUCCESS_CREATECANVAS,this.onJieTuSuccess,this);
    }

    private onJieTuSuccess(): void
    {
        Core.EventMgr.UnbindEvent(EventID.SdkEvent.CB_FAIL_CREATECANVAS,this.onJieTuFail,this);
        Core.EventMgr.UnbindEvent(EventID.SdkEvent.CB_SUCCESS_CREATECANVAS,this.onJieTuSuccess,this);
        if(this.confing != null)
        {
            this.shareMsg.Title = this.confing.m_sTitleText;
            this.shareMsg.SetQueryKV(this.confing.m_shareKey,this.confing.m_shareValue);
            this.shareMsg.SetImageUrlType(this.confing.m_shareUrlType);
            this.shareMsg.ImageUrl = this.confing.m_sBGImgurl;
            Core.SdkHandleMgr.Share(this.shareMsg);
        }
        else
        {
            console.log("onJieTuSuccess this.confing == null");
        }
    }

    /**创建获取用户信息的按钮 */
    private CreateUserInfoButton(buttonObject: any): any
    {
        if(this.HasSdk())
        {
            // console.log(wx);
            // console.log(wx.createUserInfoButton.arguments);
            return wx.createUserInfoButton(buttonObject);
        }
        return null;
    }

}

/**
 * 当前有些坑点可能需要维护
 * 1、分享的ShareTickets，目前还没有发现会同时返回数量大于等于两个的情况；
 * 2、分享拿到的ShareTicket并不能传递给群排行（可能是因为接口还不能使用）；
 */