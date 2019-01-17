/**
 * 动作管理器
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
    

    private  inited:boolean=false;
 
    public  init():void
    {
        if(this.inited)return;
        

        this.inited=true;  
    }
  
    public  update(){
          
    }
    /**
     * 全部回收到池;
     */
    public static recycleAll(){
        //Part 在character中不用回收 ,减少开销; data 已经回收;
       

    }
    /**
     * 清理池; 有顺序;
     */
    public static ClearAll(){
       
    }
    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(){
        if(ActionManager.debug){
     //     label.string+=CharManager.Get().actionPool.toString();
        }
    }
}


