import { NodeType, NodeBase, ResultType, BehaData } from "./NodeBehaTree";
import Core from "../Core";

 /// <summary>
///  行为节点(叶节点)
/// </summary>
export  class ActionBeha  extends NodeBase
{
    constructor()
    {
      super();
       this.nodeType=NodeType.Action;
       this.isLeaf=true;
    }
}
 /// <summary>
///  空节点;
/// </summary>
export  class NullAct  extends ActionBeha
{
    private info:string;
    public  Execute():ResultType
    {
        this.lastNode();
        this.lastResultType=ResultType.Success;
        return ResultType.Success;
    }
    public initProperties(behaData:BehaData):void{
        this.info=behaData.properties['maxTime'];
    }
    public reset(){
        super.reset();
    }
     /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.info="";
        super.onRecycle();
    }
    toString():string{
        let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType+"info:"+this.info;
        return str;
    }  
}
 /// <summary>
///  等待时间节点；
/// </summary>
export  class WaitTimesAct  extends ActionBeha
{
    private overTime:number=0;
    private startTime:number=0;
    public  Execute():ResultType
    {
        this.lastNode();
        if(this.startTime==0){
            this.startTime=cc.sys.now();
        }
        let dic:number=cc.sys.now()-this.startTime;
        if(dic>=this.overTime){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }else{
            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }
    }
    public reset(){
        this.startTime=0;
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
        this.SetOverTime(behaData.properties['maxTime']);
    }
    public SetOverTime(overTime:number):void
    {
        this.overTime = overTime;
    }
    toString():string{
        let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType+"overTime:"+this.overTime;
        return str;
    }  
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.startTime=0;
        this.overTime=0;
        super.onRecycle();
    }  
}

 /// <summary>
///  等待帧节点；
/// </summary>
export  class WaitFrameAct  extends ActionBeha
{
    private overFrame:number=0;
    private startFrame:number=0;

    public Execute():ResultType
    {
        this.lastNode();
        if(Core.FrameSync==null){
            console.log("FrameSync 未初始化");
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        } 
        if(this.startFrame==0){
            this.startFrame=Core.FrameSync.currRenderFrameId;
        }
        if(Core.FrameSync.currRenderFrameId-this.startFrame>=this.overFrame){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }else{
            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }
    }
    public reset(){
        this.startFrame=0;
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
        this.SetOverFrame(behaData.properties['frameCount']);
    }
    public SetOverFrame(overFrame:number):void
    {
        this.overFrame = overFrame;
    }
    toString():string{
        let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType+"overTime:"+this.overFrame;
        return str;
    } 
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.startFrame=0;
        this.overFrame=0;
        super.onRecycle();
    }  
}