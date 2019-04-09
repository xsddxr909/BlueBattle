import { DataPool } from "../../../corelibs/util/Pool";
import { JoyController } from "../controller/JoyController";
import { ENUMS } from "../../common/Enum";
import { Controller } from "../controller/Controller";
import { CharManager } from "./CharManager";
import { AIController } from "../controller/AIController";
import Core from "../../../corelibs/Core";
/**
 * 角色 控制器 管理者;
 *  回收再charManager中 一起回收, 清除调用clearAll();
 */
export class CtrlManager
{
    
    public constructor()
    {
    }
    private static m_pInstance: CtrlManager;
    public static Get(): CtrlManager
    {
        if(null == CtrlManager.m_pInstance)
        {
            CtrlManager.m_pInstance = new CtrlManager();
            CtrlManager.m_pInstance.init();
        }
        return CtrlManager.m_pInstance;
    }
    public static debug:boolean=false;

    
    private  inited:boolean=false;

    public  init():void
    {
        if(this.inited)return;


        this.inited=true;
        
    }
    public getController(type:ENUMS.CtrlType):Controller{
            switch(type){
                case ENUMS.CtrlType.JoyCtrl:
                  return  Core.ObjectPoolMgr.get(JoyController,"JoyController");
                  case ENUMS.CtrlType.AiCtrl:
                  return  Core.ObjectPoolMgr.get(AIController,"AIController");
            }
    }


    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(label:cc.Label){
        label.string="";
        if(this.debug){
         // label.string+=CtrlManager.Get().joyCtrlPool.toString();
        }
    }
}


