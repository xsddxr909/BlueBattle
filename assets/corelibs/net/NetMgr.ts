import {CodeEngine} from "../util/CodeEngine";
import {MsgHeader} from "./MsgHeader";
import Core from "../Core";
import CoreConfig from "../CoreConfig";
import {EventID} from "../CoreDefine";

export default class NetMgr
{
    private m_stWebSoket: WebSocket = null;
    private reconnectTimer: number = null;
    private reconnectTimes: number = 0;
    private m_mapFnCallback: Map<number,Function>;
    private m_stMsgHeader: MsgHeader;

    private m_sSaveUrl: string;
    public m_iCurrentNetType: NetType;
    private m_fnConnected: Function;
    public static isLoging: boolean = false;//是否登陆

    public constructor()
    {
        this.m_mapFnCallback = new Map<number,Function>();
        this.m_stMsgHeader = null;
        this.m_iCurrentNetType = NetType.Null;
    }

    /**
     * 是否连网
     */
    public isconnect(): boolean
    {
        if(!this.m_stWebSoket || this.m_stWebSoket.readyState != WebSocket.OPEN || NetMgr.isLoging == false)
        {
            return false;
        }

        return true;
    }

    private RegiesterEvent(): void
    {
    }

    public Connect(url: string,netType: NetType,callback?: Function): void
    {
        console.log("Connect url:",url);
        if(url == "")
        {
            console.log("please input server ip and port in url !!!!");
            return;
        }
        let that = this;
        if(this.m_stWebSoket)
        {
            this.m_stWebSoket.onclose = function()
            {
                that.m_stWebSoket = null;
                that.m_stMsgHeader = null;
                that.Connect(url,netType,callback);
                //Core.EventMgr.BindEvent(EventID.SdkEvent.RECONNECT_SIGNAL,that.Reconnect,that);
                //Core.EventMgr.Emit(EventID.SdkEvent.RECONNECT_GAME,null);//需要重连信号
            };
            this.m_stWebSoket.close();
            return;
        }
        if(!url)
        {
            return;
        }
        this.m_sSaveUrl = url;
        this.m_iCurrentNetType = netType;
        this.m_stWebSoket = new WebSocket(url);
        console.log("try connect to " + this.m_stWebSoket.url);
        this.m_stWebSoket.binaryType = 'arraybuffer';
        switch(this.m_stWebSoket.readyState)
        {
            case WebSocket.CONNECTING:
                console.log("net connecting.");
                break;
            case WebSocket.OPEN:
                console.log("net connected.");
                break;
            case WebSocket.CLOSING:
                console.log("net closing");
                break;
            case WebSocket.CLOSED:
                console.log("net closed");
                break;
        }
        this.m_fnConnected = callback;
        this.m_stWebSoket.onopen = this.onOpen.bind(this);
        this.m_stWebSoket.onerror = this.onError.bind(this);
        this.m_stWebSoket.onclose = this.onClose.bind(this);
        this.m_stWebSoket.onmessage = this.onMessage.bind(this);
    }
    private Reconnect(): void
    {
        this.Connect(this.m_sSaveUrl,this.m_iCurrentNetType,this.ReconnectSuccess.bind(this));
    }
    private ReconnectSuccess(): void
    {
        Core.EventMgr.Emit(EventID.SdkEvent.RECONNECT_SUCCESS,null);
        //Core.EventMgr.Emit(EventID.SdkEvent.RECONNECT_FAIL,null);
    }
    private send(message: ArrayBuffer): void
    {
        if(!this.m_stWebSoket || this.m_stWebSoket.readyState != WebSocket.OPEN)
        {
            console.log("send message Error! Host: " + Core.ServerHandler.m_sURL);
            return;
        }
        this.m_stWebSoket.send(message);
        // console.log("Send MsgLen = " + message.byteLength);
    }

    public sendBody(msgBody: Uint8Array,iMessageID: number,iFrameID?: number): void
    {
        if(!this.m_stMsgHeader) this.m_stMsgHeader = new MsgHeader();
        this.m_stMsgHeader.m_iMessageID = iMessageID;
        if(!iFrameID)
        {
            this.m_stMsgHeader.m_FrameID = 0;
        }
        else
        {
            this.m_stMsgHeader.m_FrameID = iFrameID;
        }
        this.send(this.m_stMsgHeader.Encode(msgBody));
        console.log("--send msgID:" + iMessageID);
    }

    private onOpen(): void
    {
        console.log("net connect success.");

        Core.ServerHandler.Login(); // 连接服务器

        switch(this.m_iCurrentNetType)
        {
            case NetType.Auth:
                break;
            case NetType.GateMgr:
                // 请求网关 ip、port
                Core.ServerHandler.ReqGatewayMgr();
                break;
            case NetType.Gate:
                break;
        }
        if(this.m_fnConnected != null)
        {
            this.m_fnConnected();
        }
    }

    private onClose(): void
    {
        console.log("onClose.");
        NetMgr.isLoging = false;
        this.m_stWebSoket = null;
        this.m_stMsgHeader = null;
        this.Connect(Core.ServerHandler.m_sURL,NetType.Gate);
    }

    private onError(): void
    {
        console.log("net connect error.");
    }

    private onMessage(event: MessageEvent): void
    {
        let bysData: Uint8Array = new Uint8Array(event.data);
        console.log("Received MsgLen = " + bysData.byteLength);
        if(bysData.byteLength == 0)
        {
            throw new Error("数据为空！");
        }
        this.m_stMsgHeader.Decode(bysData);
        console.log("--received msgID: " + this.m_stMsgHeader.m_iMessageID);
        // if(this.m_stMsgHeader.m_iMessageID == CSProtoID.INF_PLAYER_GAME_DATA
        //     || this.m_stMsgHeader.m_iMessageID == CSProtoID.INF_PLAYER_GLOBAL_DATA)
        // {
        //     this.m_stMsgHeader.m_iMessageID = this.m_stMsgHeader.m_iSubMessageID;
        // }
        let fnCallback: Function = this.m_mapFnCallback.get(this.m_stMsgHeader.m_iMessageID);
        if(fnCallback)
        {
            fnCallback(this.m_stMsgHeader);
        }
    }

    public BindMessage2Function(iMessageID: number,FnCallback: Function): void
    {
        let callback: Function = this.m_mapFnCallback.get(iMessageID);
        if(callback)
        {
            console.log("重复注册！MessageID:" + iMessageID.toString());
        }
        else
        {
            this.m_mapFnCallback.set(iMessageID,FnCallback);
        }
    }

}

export enum NetType
{
    Null = 0,
    Auth = 1,
    GateMgr = 2,
    Gate = 3,
}