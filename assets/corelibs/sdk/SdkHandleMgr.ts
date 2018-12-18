import ISdkHandle from "../interface/sdk/ISdkHandle";
import ISdkCallback from "../interface/sdk/ISdkCallback";
import {SdkType,AuthType,VibrateType,MessageType} from "./SdkType";
import SdkConfig from "./SdkConfig";
import WxSdkHandle from "./wxgame/WxSdkHandle";
import {ShareAppMsg,LaunchQuery,UserInfo,KVData,RankConfig,CanvasConfig,UserInfoButtonStyle} from "./wxgame/SdkObject";

export default class SdkHandleMgr
{
    private m_sLoginCode: string;

    private m_stSdkHandle: WxSdkHandle;

    public constructor()
    {
        this.m_stSdkHandle = new WxSdkHandle();
    }

    public Init(): void
    {
        this.m_stSdkHandle.Init();
    }

    public Login(): void
    {
        this.m_stSdkHandle.Login();
    }

    public Share(appMsg: ShareAppMsg): void
    {
        this.m_stSdkHandle.Share(appMsg);
    }

    public shareToGroup(confing: CanvasConfig): void
    {
        this.m_stSdkHandle.shareToGroup(confing);
    }

    public Pay(price: number): void
    {
        this.m_stSdkHandle.Pay(price);
    }

    public GetRankWidht(): number
    {
        return this.m_stSdkHandle.GetShareCanvasWidth();
    }

    public GetRankHeight(): number
    {
        return this.m_stSdkHandle.GetShareCanvasHegith();
    }

    public UploadDataToCloud(sKey: string,sValue: string): void
    {
        let stKVData: KVData = new KVData(sKey,sValue);
        this.m_stSdkHandle.UploadDataToCloud([stKVData]);
    }

    public UploadDataListToCloud(KVList: Array<KVData>): void
    {
        this.m_stSdkHandle.UploadDataToCloud(KVList);
    }

    public RemoveDataFromCloud(key: string): void
    {
        this.m_stSdkHandle.RemoveDataFromCloud([key]);
    }

    public RemoveDataListFromCloud(keyList: Array<string>): void
    {
        this.m_stSdkHandle.RemoveDataFromCloud(keyList);
    }

    public SetRankConfig(rankConfig: RankConfig): void
    {
        this.m_stSdkHandle.SetShareCanvasSize(rankConfig.canvasWidth,rankConfig.canvasHeight);
        this.m_stSdkHandle.PostOpenMessage(MessageType.SetRankConfig,rankConfig);
    }

    public ShowFriendRank(rankConfig: RankConfig): void
    {
        this.m_stSdkHandle.SetShareCanvasSize(rankConfig.canvasWidth,rankConfig.canvasHeight);
        this.m_stSdkHandle.PostOpenMessage(MessageType.ShowFriendRank,rankConfig);
    }

    public ShowGroupRank(shareTicket: string,rankConfig: RankConfig): void
    {
        this.m_stSdkHandle.SetShareCanvasSize(rankConfig.canvasWidth,rankConfig.canvasHeight);
        this.m_stSdkHandle.PostOpenMessage(MessageType.ShowGroupRank,rankConfig,shareTicket);
    }

    public ShowSelfRank(rankConfig: RankConfig): void
    {
        this.m_stSdkHandle.SetShareCanvasSize(rankConfig.canvasWidth,rankConfig.canvasHeight);
        this.m_stSdkHandle.PostOpenMessage(MessageType.ShowSelfRank,rankConfig);
    }

    public RankNextPage(stRankConfig: RankConfig,shareTicket?: string): void
    {
        this.m_stSdkHandle.PostOpenMessage(MessageType.NextPage,stRankConfig,shareTicket);
    }

    public RankPrePage(stRankConfig: RankConfig,shareTicket?: string): void
    {
        this.m_stSdkHandle.PostOpenMessage(MessageType.PrePage,stRankConfig,shareTicket);
    }

    public openOtherGame(appID: string): void
    {
        this.m_stSdkHandle.openOtherGame(appID);
    }

    public GetRankTexture(texture: cc.Texture2D): void
    {
        texture.initWithElement(this.m_stSdkHandle.GetShareCanvas());
        texture.handleLoadedTexture();
    }

    public Vibrate(vbType: VibrateType,callback?: ISdkCallback): void
    {
        this.m_stSdkHandle.Vibrate(vbType,callback);
    }

    public GetUserInfo(): void
    {
        // this.m_stSdkHandle.GetAuthorize(AuthType.USER_INFO);
        this.m_stSdkHandle.GetUserInfo(false);
    }

    public CreateTextUserInfoButton(sText: string,stStyle: UserInfoButtonStyle): void
    {
        this.m_stSdkHandle.CreateTextUserInfoButton(sText,stStyle);
    }

    public ShowTextUserInfoButton(): void
    {
        this.m_stSdkHandle.ShowTextUserInfoButton();
    }

    public HideTextUserInfoButton(): void
    {
        this.m_stSdkHandle.HideTextUserInfoButton();
    }

    public DestroyTextUserInfoBUtton(): void
    {
        this.m_stSdkHandle.DestroyTextUserInfoButton();
    }

    public SetTextOfTextUserInfoButton(sText: string): void
    {
        this.m_stSdkHandle.SetTextOfTextUserInfoButton(sText);
    }

    public SetStyleOfTextUserInfoButton(stStyle: UserInfoButtonStyle): void
    {
        this.m_stSdkHandle.SetStyleOfTextUserInfoButton(stStyle);
    }

    public CreateImageUserInfoButton(sImageUrl: string,stStyle: UserInfoButtonStyle): void
    {
        this.m_stSdkHandle.CreateImageUserInfoButton(sImageUrl,stStyle);
    }

    public ShowImageUserInfoButton(): void
    {
        this.m_stSdkHandle.ShowImageUserInfoButton();
    }

    public HideImageUserInfoButton(): void
    {
        this.m_stSdkHandle.HideImageUserInfoButton();
    }

    public DestroyImageUserInfoButton(): void
    {
        this.m_stSdkHandle.DestoryImageUserInfoButton();
    }

    public SetStyleOfImageUserInfoButton(stStyle: UserInfoButtonStyle): void
    {
        this.m_stSdkHandle.SetStyleOfImageUserInfoButton(stStyle);
    }

    public SetImageOfImageUserInfoButton(sImageUrl: string): void
    {
        this.m_stSdkHandle.SetImageOfImageUserInfoButton(sImageUrl);
    }

    /**自定义生成截图 */
    public CreatCustomCapture(canvasConfig: CanvasConfig): void
    {
        this.m_stSdkHandle.CreatCustomCapture(canvasConfig);

    }

    /**截图 */
    public Capture(x: number,y: number,width: number,height: number): void
    {
        this.m_stSdkHandle.Capture(x,y,width,height);
    }

    public GetLaunchQuery(): LaunchQuery
    {
        return this.m_stSdkHandle.GetLaunchQuery();
    }

    /**
     * 微信请求
     */
    public wx_request(url: string,method: string,data: object,header: object,success?: Function,fail?: Function): void
    {
        this.m_stSdkHandle.wx_request(url,method,data,header,success,fail);
    }

    /**
     * 识别图片中的二维码
     */
    public wx_previewImage(urls: Array<string>): void
    {
        this.m_stSdkHandle.wx_previewImage(urls);
    }

    /**
     * 右上角转发分享
     */
    public wx_onShareAppMessage(title: string): void
    {
        this.m_stSdkHandle.wx_onShareAppMessage(title);
    }

  /**
   * 添加右上角转发分享 图片数组 ImgArr
   * @param ImgArr IMG数组;
   */
    public addShareContextImg(ImgArr:Array<string>): void{
        this.m_stSdkHandle.addShareContextImg(ImgArr);
    }
    /**
     * 重置右上角转发分享 图片数组;
     */
    public resetShareContextImg():void{
        this.m_stSdkHandle.resetShareContextImg();
    }



}