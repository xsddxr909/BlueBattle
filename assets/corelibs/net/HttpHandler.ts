import HttpMgr from "./HttpMgr";
import {HTTP_ID,EventID} from "../CoreDefine";
import Core from "../Core";
import {HttpRspLogin,HttpReqLogin,HttpSaveUserInfo,HttpGetUserInfo,HttpRspGetUserInfo} from "./HttpMsg";
import {UserInfo} from "../sdk/wxgame/SdkObject";

export default class HttpHandler
{
    private m_stHttpMgr: HttpMgr;

    public constructor()
    {
        this.m_stHttpMgr = new HttpMgr();
    }

    public Init(): void
    {
        this.Register();
    }

    public Register(): void
    {
        this.m_stHttpMgr.BindMessage2Function(HTTP_ID.LOGIN,this.OnRspLogin.bind(this));
        this.m_stHttpMgr.BindMessage2Function(HTTP_ID.SAVEUSERINFO,this.OnRspSaveUserInfo.bind(this));
        this.m_stHttpMgr.BindMessage2Function(HTTP_ID.GETUSERINFO,this.OnRspGetUserInfo.bind(this));
    }

    public Login(request: HttpReqLogin)
    {
        let data = {
            code: request.code,
        }
        this.m_stHttpMgr.Send(HTTP_ID.LOGIN,data);
    }

    private OnRspLogin(retCode: number,data: any): void
    {
        let rspLogin = new HttpRspLogin();
        rspLogin.retCode = retCode;
        rspLogin.gateway_ip = data.gateway_ip;
        rspLogin.gateway_port = data.gateway_port;
        rspLogin.openid = data.openid;
        rspLogin.uid = data.uid;
        Core.EventMgr.Emit(EventID.HttpEvent.RSP_LOGIN,rspLogin);
    }

    public SaveUserInfo(userinfo: UserInfo,uid: number)
    {
        let data = {
            avatarUrl: userinfo.AvatarUrl,
            city: userinfo.City,
            country: userinfo.Country,
            gender: userinfo.Gender,
            language: userinfo.Language,
            nickName: userinfo.NickName,
            province: userinfo.Province,
            uid: uid,
            other_info: "",
        }
        this.m_stHttpMgr.Send(HTTP_ID.SAVEUSERINFO,data);
    }

    public OnRspSaveUserInfo(retCode: number,data: any): void
    {
    }

    public GetUserInfo(uid: number)
    {
        let data = {
            uid: uid,
        }
        this.m_stHttpMgr.Send(HTTP_ID.GETUSERINFO,data);
    }

    public OnRspGetUserInfo(retCode: number,data: any): void
    {
        let rspGetUserInfo = new HttpRspGetUserInfo();
        rspGetUserInfo.avatarUrl = data.avatarUrl;
        rspGetUserInfo.city = data.city;
        rspGetUserInfo.country = data.country;
        rspGetUserInfo.gender = data.gender;
        rspGetUserInfo.language = data.language;
        rspGetUserInfo.nickName = data.nickName;
        rspGetUserInfo.province = data.province;
        rspGetUserInfo.uid = data.uid;
        Core.EventMgr.Emit(EventID.HttpEvent.RSP_GETUSERINFO,rspGetUserInfo);
    }

}

