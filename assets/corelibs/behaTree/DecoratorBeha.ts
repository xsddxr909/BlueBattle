import { NodeCombiner, NodeType, ResultType, BehaData } from "./NodeBehaTree";
import Core from "../Core";

/// <summary>************************************************************************************************************************************/
/// 修饰节点(组合节点) 过滤器  只能有一个子节点
/// </summary>

//非 ！ 取反; 子节点只有一个;
export class NotDec extends NodeCombiner
{
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
    public Execute():ResultType
    {
        if( this.nodeChildList.length<1){
            console.log("NotDecorator 节点长度错误");
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }
        let resultType:ResultType = this.nodeChildList[0].Execute();
        if (resultType ==ResultType.Success)
        {
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }else if(resultType ==ResultType.Fail){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        super.onRecycle();
    }  
}
//循环节点; -1为无限循环 总是返回运行;否则循环执行子节点指定的次数然后返回成功，在指定次数之前则返回 运行中。 只有一个节点; 
export class LoopDec extends NodeCombiner
{
    private maxLoop:number=-1;
    //是否失败时候返回失败。
    private failReturn:boolean=false;
    private nowCount:number=0;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
    public Execute():ResultType
    {
        // if( this.nodeChildList.length<1){
        //     console.log("LoopDec 节点长度错误");
        //     this.lastResultType=ResultType.Fail;
        //     return ResultType.Fail;
        // }
        if (this.maxLoop==-1)
        {
            this.nodeChildList[0].Execute();
            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }else {
            if(this.nowCount>=this.maxLoop){
        //        console.log("Loop>>>>>Finish");
                this.lastResultType=ResultType.Success;
                return ResultType.Success;
            }  
            let resType:ResultType=this.nodeChildList[0].Execute();
            if(resType==ResultType.Success||resType==ResultType.Fail){
                this.nowCount++;
        //        console.log("res:"+resType,this.nodeChildList[0].toString(),"Loop>>>>>>>>>>>>>>>>>>>",this.nowCount );
                if(this.failReturn && resType==ResultType.Fail){
         //           console.log("Fail",this.nodeChildList[0].toString(),"Loop>>>>>>>>>>>>>>>>>>>",this.nowCount );
                    this.lastResultType=ResultType.Fail;
                    return ResultType.Fail;
                }
                this.nodeChildList[0].reset();
                if(this.nowCount>=this.maxLoop){
         //           console.log("Loop>>>>>Finish");
                    this.lastResultType=ResultType.Success;
                    return ResultType.Success;
                }  
            }
       //     console.log("LoopIng>>>>>",this.nowCount);
            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }
    }
    public initProperties(behaData:BehaData):void{
        this.maxLoop =behaData.properties['maxLoop'];
        this.failReturn =behaData.properties['failReturn']==1?true:false;
    }
    public reset(){
        this.nowCount=0;
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.maxLoop=-1;
        this.nowCount=0;
        super.onRecycle();
    }  
}

//时间节点；时间节点用于在指定的时间内，持续调用其子节点 子节点只有一个; 不能用于帧同步;毫秒;
export class TimeDec extends NodeCombiner
{
    private overTime:number=0;
    private startTime:number=0;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
   
    public Execute():ResultType
    {
        if(this.startTime==0){
            this.startTime=cc.sys.now();
        }
        let dic:number=cc.sys.now()-this.startTime;
        if(dic>=this.overTime){
            // if(dic=this.overTime){
            //     this.nodeChildList[0].Execute();
            // }
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }else{
            this.nodeChildList[0].Execute();
            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }
    }
    public initProperties(behaData:BehaData):void{
        this.SetOverTime(behaData.properties['maxTime']);
    }
    public reset(){
        this.startTime=0;
        super.reset();
    }
    public SetOverTime(overTime:number):void
    {
        this.overTime = overTime;
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
//帧同步时间节点；时间节点用于在指定的时间内，持续调用其子节点 子节点只有一个;
export class TimeSynDec extends NodeCombiner
{
    private overTime:number=0;
    private startTime:number=0;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
   
    public Execute():ResultType
    {
        // if(Core.FrameSync==null){
        //     console.log("FrameSync 未初始化");
        //     this.lastResultType=ResultType.Fail;
        //     return ResultType.Fail;
        // } 
        if(this.startTime==0){
            this.startTime=Core.FrameSync.getNowTime();
        }
        if(Core.FrameSync.getNowTime()-this.startTime>=this.overTime){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }else{
            this.nodeChildList[0].Execute();
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
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.startTime=0;
        this.overTime=0;
        super.onRecycle();
    }  
}

//帧同步 帧间隔节点；用于在指定的帧范围内，持续调用其子节点， 子节点只有一个;
export class InFramesSynDec extends NodeCombiner
{
    private overFrame:number=0;
    private startFrame:number=0;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
   
    public Execute():ResultType
    {
        // if(Core.FrameSync==null){
        //     console.log("FrameSync 未初始化");
        //     this.lastResultType=ResultType.Fail;
        //     return ResultType.Fail;
        // } 
        if(this.startFrame==0){
            this.startFrame=Core.FrameSync.currRenderFrameId;
        }
        if(Core.FrameSync.currRenderFrameId-this.startFrame>=this.overFrame){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }else{
            this.nodeChildList[0].Execute();
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
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.startFrame=0;
        this.overFrame=0;
        super.onRecycle();
    }  
}


 /// <summary>
///  总是成功节点 进行中也返回成功；
/// </summary>
export  class AlwaysSuccessDec  extends NodeCombiner
{
    public  Execute():ResultType
    {
        this.nodeChildList[0].Execute();
        this.lastResultType=ResultType.Success;
        return ResultType.Success;
    }
    public reset(){
        super.reset();
    }
}


 /// <summary>
///  总是失败节点 进行中也返回失败；
/// </summary>
export  class AlwaysFailDec  extends NodeCombiner
{
    public  Execute():ResultType
    {
        this.nodeChildList[0].Execute();
        this.lastResultType=ResultType.Fail;
        return ResultType.Fail;
    }
    public reset(){
        super.reset();
    }
}

 /// <summary>
///  计数节点； 不同于循环节点，它在指定的循环次数到达前返回子节点返回的状态，无论成功、失败还是正在执行
/// </summary>
export  class CountLimitDec  extends NodeCombiner
{
    private maxCount:number=-1;
    private nowCount:number=0;
    public  Execute():ResultType
    {
        if (this.maxCount==-1)
        {
            this.lastResultType=this.nodeChildList[0].Execute();
            return this.lastResultType;
        }else {
            if(this.nowCount>=this.maxCount){
                this.lastResultType=ResultType.Success;
                return ResultType.Success;
            }else
            {
                this.nowCount++;
                this.lastResultType=this.nodeChildList[0].Execute();
                return this.lastResultType;
            }  
        }
    }
    public initProperties(behaData:BehaData):void{
        this.SetMaxCount(behaData.properties['maxCount']);
    }
    public SetMaxCount(maxCount:number):void
    {
        this.maxCount = maxCount;
    }
    public reset(){
        this.nowCount=0;
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.maxCount=-1;
        this.nowCount=0;
        super.onRecycle();
    }  
}


 /// <summary>
///  总是返回成功，子节点成功失败 会重置子节点 进行中也返回进行中；
/// </summary>
export  class SuccessResetDec  extends NodeCombiner
{
    public  Execute():ResultType
    {
        this.lastResultType= this.nodeChildList[0].Execute();
        if(this.lastResultType==ResultType.Success){
            this.reset();
        }
        return this.lastResultType;
    }
    public reset(){
        super.reset();
    }
}

/////修饰器节点*************************************************************************************************************************************************/