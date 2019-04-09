import { BehaTree } from "./BehaTree";
import { NodeBase, SelectNode, SequenceNode, RandomNode, ParallelNode, IfElseNode, SwitchNode ,CasesNode, WeightRandomNode, OrNode, AndNode } from "./NodeBehaTree";
import { NotDec, LoopDec, TimeDec, TimeSynDec, InFramesSynDec, AlwaysSuccessDec, AlwaysFailDec, CountLimitDec, SuccessResetDec } from "./DecoratorBeha";
import { WaitTimesAct, WaitFrameAct, NullAct } from "./ActionBeha";
import Core from "../Core";

/**
 * 行为树;  加载json 解析 生成行为树; 
 */
export class BehaviorTreeManager
{
    
    public constructor()
    {
    }
    private static m_pInstance: BehaviorTreeManager;
    public static Get(): BehaviorTreeManager
    {
        if(null == BehaviorTreeManager.m_pInstance)
        {
            BehaviorTreeManager.m_pInstance = new BehaviorTreeManager();
            BehaviorTreeManager.m_pInstance.init();
        }
        return BehaviorTreeManager.m_pInstance;
    }
    public static debug:boolean=true;
 //   private nodeList:ListDataPool<BehaTree>=null; 
   
    public classMapping: Map<string, new () => NodeBase>;

    private  inited:boolean=false;
 
    public  init():void
    {
        if(this.inited)return;
     //   this.nodeList=new ListDataPool<BehaTree>(()=>new BehaTree());
        this.classMapping=new  Map<string, new () => NodeBase>();
        this.inited=true;      

            //Composite
        this.Register("Select",SelectNode);
        this.Register("Sequence",SequenceNode);
        this.Register("Random",RandomNode);
        this.Register("Paralle",ParallelNode);
        this.Register("IfElse",IfElseNode);
        this.Register("Switchs",SwitchNode);
        this.Register("Cases",CasesNode);
        this.Register("WeightRandom",WeightRandomNode);
        this.Register("ORs",OrNode);
        this.Register("Ands",AndNode);

           //Decorator
        this.Register("Not",NotDec);
        this.Register("Loops",LoopDec);
        this.Register("Times",TimeDec);
        this.Register("SynTimes",TimeSynDec);
        this.Register("InFrames",InFramesSynDec);
        this.Register("Succeeder",AlwaysSuccessDec);
        this.Register("Failer",AlwaysFailDec);
        this.Register("CountLimit",CountLimitDec);
        this.Register("SuccessReset",SuccessResetDec);
        

          //action
        this.Register("Null",NullAct);
        this.Register("WaitFrame",WaitFrameAct);
        this.Register("WaitTimes",WaitTimesAct);

          //Condition
    }

    public Register(name: string,classFactory: new () => NodeBase)
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

    public creatNodeTree(url:string,data:any=null):BehaTree{
           //下载一个ai json;
       let behaTree:BehaTree = Core.ObjectPoolMgr.get(BehaTree,"BehaTree");
       //this.nodeList.get();
       behaTree.init(url,data);
       return behaTree;
    }
    //可以不统一走update 不同的树可以自己走update
    // public  Update(dt:number){
    //     for (let i = 0, len:number=this.nodeList.getOnList().length; i < len; i++) {
    //         this.nodeList.getOnList()[i].Update(dt);
    //     }
    // }
 
    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(){
        if(BehaviorTreeManager.debug){
     //     label.string+=CharManager.Get().actionPool.toString();
        }
    }
}

