import { NodeCombiner, NodeType, ResultType } from "./NodeTree";

/// <summary>************************************************************************************************************************************/
/// 修饰节点(组合节点) 过滤器
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
    private nowCount:number=0;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
    public Execute():ResultType
    {
        if( this.nodeChildList.length<1){
            console.log("LoopDec 节点长度错误");
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }
        let resultType:ResultType = this.nodeChildList[0].Execute();
        if (this.maxLoop==-1||resultType ==ResultType.Running)
        {
            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }else {
            this.nowCount++;
            if(this.nowCount>=this.maxLoop){
                this.lastResultType=ResultType.Success;
                return ResultType.Success;
            }  

            this.lastResultType=ResultType.Running;
            return ResultType.Running;
        }
    }
    public SetMaxLoop(loopTime:number):void
    {
        this.maxLoop = loopTime;
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
        this.nodeChildList[0].Execute();
        if(cc.sys.now()-this.startTime>=this.overTime){
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

//未完成；
export class LoopUntilDec extends NodeCombiner
{
    /// 希望的结果
    private untilResultType:ResultType = ResultType.Fail;
    private maxLoop:number=-1;
    private nowCount:number=0;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
   
    public Execute():ResultType
    {
        if(this.maxLoop!=-1){
            this.nowCount++;
        }

        let resultType:ResultType = this.nodeChildList[0].Execute();
        if (resultType != this.untilResultType)
        {
            return ResultType.Running;
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        this.nowCount=0;
        super.reset();
    }
    public SetMaxLoop(loopTime:number):void
    {
        this.maxLoop = loopTime;
    }
    public SetResultType(resultType:ResultType):void
    {
        this.untilResultType = resultType;
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.untilResultType = ResultType.Fail;
        this.nowCount=0;
        this.maxLoop=-1;
        super.onRecycle();
    }  
}

/////修饰器节点*************************************************************************************************************************************************/