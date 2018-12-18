import NetMgr,{NetType} from "../../corelibs/net/NetMgr";
import {MsgHeader} from "../../corelibs/net/MsgHeader";
import Core from "../Core";
import CoreConfig from "../CoreConfig";
import {UserInfo} from "../sdk/wxgame/SdkObject";

export default class ServerHandler
{
    private m_pNetMgr: NetMgr;

    // 计时脚本
    private m_pComponent: cc.Component;

    //Auth
    private m_bIsAuth: boolean;


    // Gate Info
    public m_sURL: string;

    // Packge Head Info
    public m_iUin: number = 1000000 + ((Math.random() * 1000000) >> 0);
    public m_userInfo: UserInfo;
    public m_sSesskey: string = "longxianglongxianglongxiang";
    public m_iGameId: number;
    public m_iGroupId: number;
    public m_iSeqId: number;

    public constructor() 
    {
    }

    // 初始化
    public Init(): void
    {
        this.m_pComponent = Core.RootNode.addComponent(cc.Component);
        this.m_pComponent.name = "Net Tick";

        this.m_pNetMgr = Core.NetMgr;

        this.m_iGameId = CoreConfig.GAME_ID;
        this.m_iGroupId = CoreConfig.GROUP_ID;
        this.m_iSeqId = 0;
    }

    // 注册函数绑定
    public Register(): void
    {
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.RSP_PLAYER_TO_GATEWAYMGR,this.OnRspPlayerToGatewayMgr.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.RSP_PLAYER_LOGIN,this.OnRspPlayerLogin.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.RSP_PLAYER_TEAM_ACTION,this.OnRspPlayerTeamAction.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_TEAM_ACTION,this.OnInfPlayerTeamAction.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_START_GAME,this.OnInfPlayerStartGame.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_END_GAME,this.OnInfPlayerEndGame.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_STEP_LOCK,this.OnInfPlayerStepLock.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_MATCH,this.OnInfPlayerMatch.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_MATCH_SUCCESS,this.OnInfPlayerMatchSuccess.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.RSP_PING,this.OnRspPing.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_GLOBAL_DATA,this.OnInfPlayerGlobalData.bind(this));
        // this.m_pNetMgr.BindMessage2Function(CSProtoID.INF_PLAYER_GAME_DATA,this.OnInfPlayerGameData.bind(this));
    }

    private Emit(iMessageID: number,msg: any): void
    {
        Core.EventMgr.Emit(iMessageID,msg);
    }

    // int32 to string for ip
    public NumberToIp(iIp: number): string
    {
        let sIp: string = "";
        if(iIp <= 0)
        {
            iIp = iIp >>> 0;
        }
        for(let i: number = 3;i >= 0;i--)
        {
            let ip: number = (iIp << (8 * i)) >>> 24;
            sIp += ip.toString();
            if(i != 0)
            {
                sIp += ".";
            }
        }
        return sIp;
    }

    // req gateway manager
    public ReqGatewayMgr(): void
    {
        if(Core.NetMgr.m_iCurrentNetType == NetType.GateMgr)
        {
            // let req: ReqPlayerToGatewayMgr = ReqPlayerToGatewayMgr.create();
            // let buff: Uint8Array = ReqPlayerToGatewayMgr.encode(req).finish();
            // Core.NetMgr.sendBody(buff,CSProtoID.REQ_PLAYER_TO_GATEWAYMGR);
            // this.m_pComponent.scheduleOnce(this.ReqGatewayMgr.bind(this),5);
        }
    }
    private OnRspPlayerToGatewayMgr(msgHeader: MsgHeader): void
    {
        // let body: Uint8Array = msgHeader.m_stBody;
        // let rsp: RspPlayerToGatewayMgr = RspPlayerToGatewayMgr.decode(body);
        // cc.log("Gateway url:",rsp.url);
        // Core.ServerHandler.m_sURL = rsp.url;
        // // connet to gateway
        // Core.NetMgr.Connect(Core.ServerHandler.m_sURL,NetType.Gate);
    }


    // 玩家登录
    public Login(): void
    {
        // let req: ReqPlayerLogin = ReqPlayerLogin.create();
        // let buff: Uint8Array = ReqPlayerLogin.encode(req).finish();
        // Core.NetMgr.sendBody(buff,CSProtoID.REQ_PLAYER_LOGIN);
    }
    private OnRspPlayerLogin(msgHeader: MsgHeader): void
    {
        // let body: Uint8Array = msgHeader.m_stBody;
        // let rsp: RspPlayerLogin = RspPlayerLogin.decode(body);
        // this.Emit(msgHeader.m_iMessageID,rsp);
        // this.m_pComponent.schedule(this.HeartBeat,10);
    }

    // 心跳
    public HeartBeat(): void
    {
        // if(Core.NetMgr.m_iCurrentNetType == NetType.Gate)
        // {
        //     let buff: Uint8Array = new Uint8Array(0);
        //     Core.NetMgr.sendBody(buff,CSProtoID.REQ_HEARTBEAT);
        // }
    }

    

    public get IsAuth(): boolean {return this.m_bIsAuth;}
    public set IsAuth(value: boolean) {this.m_bIsAuth;}

    //public get NetMgr(): NetMgr {return this.m_pNetMgr;}
}