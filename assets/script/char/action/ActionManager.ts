import { Action } from "./Action";
import { BackOff } from "./BackOff";
import { CmdAction } from "./CmdAction";
import { Dead } from "./Dead";
import { Run } from "./Run";
import { Stand } from "./Stand";


/**
 * 行为树;  加载json 解析 生成行为树; 
 */
export class ActionManager
{
    
    public constructor()
    {
    }
    private static m_pInstance: ActionManager;
    public static Get(): ActionManager
    {
        if(null == ActionManager.m_pInstance)
        {
            ActionManager.m_pInstance = new ActionManager();
            ActionManager.m_pInstance.init();
        }
        return ActionManager.m_pInstance;
    }
    public static debug:boolean=true;
 //   private nodeList:ListDataPool<BehaTree>=null; 
   
    public classMapping: Map<string, new () => Action>;

    private  inited:boolean=false;
 
    public  init():void
    {
        if(this.inited)return;
     //   this.nodeList=new ListDataPool<BehaTree>(()=>new BehaTree());
        this.classMapping=new  Map<string, new () => Action>();
        this.inited=true;      

            //Action
        this.Register("BackOff",BackOff);
        this.Register("CmdAction",CmdAction);
        this.Register("Dead",Dead);
        this.Register("Run",Run);
        this.Register("Stand",Stand);
        this.Register("Action",Action);
    }

    public Register(name: string,classFactory: new () => Action)
    {
        if(this.classMapping.get(name))
        {
            console.log("重复注册UI, name: " + name);
            return;
        }
        this.classMapping.set(name,classFactory);
    }

    public UnRegister(name: string): void
    {
        if(this.classMapping.get(name))
        {
            this.classMapping.delete(name);
        }
        else
        {
            console.log("Beha未被注册, name: " + name);
        }
    }
}

