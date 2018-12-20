import { RecycleAble, ListDataPool } from "../util/Pool";
import Core from "../Core";
import { ResStruct } from "../util/ResourcesMgr";
import { ResType } from "../CoreDefine";
import { NodeBase, NodeCombiner } from "./NodeTree";

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
    public nodeList:ListDataPool<NodeCombiner>=null; 

    private  inited:boolean=false;
 
    public  init():void
    {
        if(this.inited)return;
        this.nodeList=new ListDataPool<NodeCombiner>(()=>new NodeCombiner());
        this.inited=true;  
    }
    public creatNodeTree(url:string){
           //下载一个ai json;

           //解析;
    }
    public  update(dt:number){
        for (let i = 0, len:number=this.nodeList.getOnList().length; i < len; i++) {
     //       this.nodeList.getOnList()[i].Update();
        }
    }
 
    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(){
        if(BehaviorTreeManager.debug){
     //     label.string+=CharManager.Get().actionPool.toString();
        }
    }
}