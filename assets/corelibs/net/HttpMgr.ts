import Core from "../Core";
import CoreConfig from "../CoreConfig";
import {HTTP_ID,EventID} from "../CoreDefine";
import {Md5} from "../util/md5";
declare var wx;
export default class HttpMgr
{
    private m_mapFnCallback: Map<number,Function>;

    public constructor()
    {
        this.m_mapFnCallback = new Map<number,Function>();
    }

    public BindMessage2Function(iMessageID: any,FnCallback: Function): void
    {
        let callback: Function = this.m_mapFnCallback.get(iMessageID);
        if(callback == null)
        {
            this.m_mapFnCallback.set(iMessageID,FnCallback);
        }
    }

    public Send(msgId: any,data: any): void
    {
        if(cc.sys.platform == cc.sys.WECHAT_GAME)
        {
            let self = this;
            data.service = "App.Auth_Login.Wechat";
            data.gameid = CoreConfig.GAME_ID;
            data.serverid = CoreConfig.GROUP_ID;
            let myDate = new Date();
            data.timekey = myDate.getTime();
            let result: string = "?&code=" + data.code + "&gameid=" + data.gameid + "&serverid=" + data.serverid + "&service=" + data.service + "&timekey=" + data.timekey;
            data.sign = Md5.hashStr(data.code + data.gameid + data.serverid + data.service + data.timekey + CoreConfig.API_SECRET);
            result += "&sign=" + data.sign;
            console.log("url:" + CoreConfig.WeCat_URL + result);
            wx.request({
                url: CoreConfig.WeCat_URL, //仅为示例，并非真实的接口地址
                data: result,
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res)
                {
                    if(res.data.ret == 200 && res.data.data.code == 0)//只有ret=200&&code=0是登陆成功
                    {
                        console.log("登陆游戏服务器成功:" + res.data.service);
                        let fnCallback: Function = self.m_mapFnCallback.get(res.data.service);
                        if(fnCallback)
                        {
                            fnCallback(Number(res.data.data.code),res.data.data.data);
                        }
                    }
                    else//登陆失败
                    {
                        console.log("登陆游戏服务器失败:" + res.data.ret,res.data.data.info);
                    }
                },
                fail: function()
                {
                    console.log("登陆游戏服务器失败!:");
                }
            })
            return;
        }
        else
        {
            let xhr = new XMLHttpRequest();
            xhr.timeout = 3000;
            xhr.responseType = "json";     //设置为json则浏览器会自动将返回消息设置为json
            let url = CoreConfig.WeCat_URL;
            xhr.open('POST',url,true);
            xhr.onload = function(e)
            {
                if(this.status == 200 || this.status == 304)
                {
                    let data = xhr.response;      //data为一个json对象
                    let fnCallback: Function = this.m_mapFnCallback.get(data.msgid);
                    if(fnCallback)
                    {
                        fnCallback(data);
                    }
                }
            }.bind(this);
            xhr.onerror = function(e)
            {
                console.log("http请求出错");
            };
            data.msgid = msgId;
            data.gameid = CoreConfig.GAME_ID;
            data.serverid = 1;
            try
            {
                xhr.send(data)
            } catch(e)
            {
                console.log("断网状态下不能发送");
            };
        }
    }

    /**
     * sign排序
     */
    private signSort(...args: string[]): string
    {
        let tempArr: Array<string> = args;
        tempArr.sort();
        let result = "";
        return result;
    }
}
