import Core from "../corelibs/Core";
import { EventID } from "../corelibs/CoreDefine";

declare var wx;
export default class Reconnection 
{
    private static m_pInstance: Reconnection = null;
    public static get Instance(): Reconnection
    {
        if(this.m_pInstance == null)
        {
            this.m_pInstance = new Reconnection();
        }
        return this.m_pInstance;
    }
    public Init(): void
    {
        Core.EventMgr.BindEvent(EventID.SdkEvent.RECONNECT_SUCCESS,this.reconnecting,this);
    }
    private reconnecting(): void
    {
        //真正的同步

    }
}