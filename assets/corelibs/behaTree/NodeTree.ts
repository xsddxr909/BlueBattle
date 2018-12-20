import { RecycleAble } from "../util/Pool";
import Core from "../Core";

/**
 * 不能实例基础类;
 */
export class NodeBase extends RecycleAble {  
    public md5Id:string;
    /// <summary>
    /// 节点类型
    /// </summary>
    protected nodeType:NodeType;
    /// <summary>
    /// 节点序列
    /// </summary>
    public  nodeIndex:number;
    //是否叶节点;
    public isLeaf:boolean=false;

    public lastResultType:ResultType= ResultType.Defult;

    constructor()
    {
      super();
    }  
    /// <summary>
    /// 执行节点抽象方法 重写后  this.lastResultType 需要赋值  后续方便追踪;
    /// </summary>
    /// <returns>返回执行结果</returns>
    public Execute():ResultType{
        //重写后  this.lastResultType 需要赋值  后续方便追踪;
        this.lastResultType= ResultType.Fail;
        return this.lastResultType;
    }
    /**
     * 重置.不包括树结构重置;
     */
    public reset(){
        this.lastResultType= ResultType.Defult;
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.lastResultType= ResultType.Defult;
        super.onRecycle();
    }  
    /**
    *回收; 
    **/ 
    Release(): void {
        super.Release();
    }
    toString():string{
        let str:string=this.poolname+" lastResultType: "+this.lastResultType;
        return str;
    }
}

 /// <summary>
/// 组合节点
/// </summary>
export  class NodeCombiner extends NodeBase
{
    // 保存子节点
    protected nodeChildList :Array<NodeBase>;
    constructor()
    {
      super();
      this.nodeChildList  = new Array<NodeBase>();
    }
    // 添加子节点
    public  AddNode(nodeRoot:NodeBase):void
    {
        nodeRoot.nodeIndex = this.nodeChildList.length;
        this.nodeChildList.push(nodeRoot);
    }
    public reset(){
        this.nodeChildList.forEach(element => {
            if(element!=null){
                element.reset();
            }
        });
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        let listTemp:Array<NodeBase>= this.nodeChildList;
        this.nodeChildList=[];
        listTemp.forEach(element => {
           if(element!=null){
               element.recycleSelf();
           }
       });
       listTemp=null;
       super.onRecycle();
    }  
    /**
    *回收; 
    **/ 
    Release(): void {
        this.nodeChildList=null;
        super.Release();
    }
}
 /// <summary>
/// 条件节点(叶节点)
/// </summary>
export  class ConditionNode extends NodeBase
{
    constructor()
    {
      super();
       this.nodeType=NodeType.Condition;
       this.isLeaf=true;
    }
}
 /// <summary>
///  行为节点(叶节点)
/// </summary>
export  class ActionNode  extends NodeBase
{
    constructor()
    {
      super();
       this.nodeType=NodeType.Action;
       this.isLeaf=true;
    }
}

/// <summary>
/// 选择节点(组合节点)
/// </summary>
export class SelectNode extends NodeCombiner
{
    private lastRunningNodeIdx:number;
    constructor()
    {
      super();
       this.nodeType=NodeType.Select;
       this.lastRunningNodeIdx=-1;
    }

    /// <summary>
    /// 选择节点依次遍历所有子节点，如果都返回 Fail，则向父节点返回 Fail
    /// 直到一个节点返回 Success 或者 Running，停止后续节点的执行，向父节点
    /// 返回 Success 或者 Running
    /// 注意：如果节点返回 Running 需要记住这个节点，下次直接从此节点开始执行
    /// </summary>
    /// <returns></returns>
    public Execute():ResultType
    {
        let index:number = 0;
        if (this.lastRunningNodeIdx != -1)
        {
            index = this.lastRunningNodeIdx;
        }
        this.lastRunningNodeIdx = -1;

        let resultType:ResultType  = ResultType.Fail;
        for (let i:number = index; i < this.nodeChildList.length; ++i)
        {
            const node:NodeBase = this.nodeChildList[i];
            resultType = node.Execute();
            if (resultType == ResultType.Fail)
            {
                continue;
            }
            if (resultType == ResultType.Success)
            {
                break;
            }
            if (resultType == ResultType.Running)
            {
                this.lastRunningNodeIdx = node.nodeIndex;
                break;
            }
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        this.lastRunningNodeIdx=-1;
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.lastRunningNodeIdx=-1;
       super.onRecycle();
    }  
}

/// <summary>
/// 顺序节点(组合节点)
/// </summary>
export class SequenceNode extends NodeCombiner
{
    private lastRunningNodeIdx:number;
    constructor()
    {
      super();
       this.nodeType=NodeType.Sequence;
       this.lastRunningNodeIdx=-1;
    }

    /// <summary>
    /// 顺序节点一次执行子节点，只要节点返回Success，就继续执行后续节点，直到一个节点
    /// 返回 Fail 或者 Running，停止执行后续节点，向父节点返回 Fail 或者 Running，如果
    /// 所有节点都返回 Success，则向父节点返回 Success
    /// 和选择节点一样，如果一个节点返回 Running，则需要记录该节点，下次执行时直接从该
    /// 节点开始执行
    /// </summary>
    /// <returns></returns>
    public  Execute():ResultType
    {
        let index:number = 0;
        if (this.lastRunningNodeIdx != -1)
        {
            index = this.lastRunningNodeIdx;
        }
        this.lastRunningNodeIdx = -1;

        let resultType:ResultType = ResultType.Fail;
        for (let i:number = index; i < this.nodeChildList.length; ++i)
        {
            const node:NodeBase = this.nodeChildList[i];
            resultType = node.Execute();
            if (resultType == ResultType.Fail)
            {
                break;
            }
            if (resultType == ResultType.Success)
            {
                continue;
            }
            if (resultType == ResultType.Running)
            {
                this.lastRunningNodeIdx = node.nodeIndex;
                break;
            }
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        this.lastRunningNodeIdx=-1;
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
       this.lastRunningNodeIdx=-1;
       super.onRecycle();
    }  
}

 /// <summary>
/// 随机节点(组合节点)
/// </summary>
export class RandomNode extends NodeCombiner
{
    private lastRunningNodeIdx:number;
    private  randomList:Array<number>;
    constructor()
    {
      super();
       this.nodeType=NodeType.Random;
       this.lastRunningNodeIdx=-1;
    }

    public Execute():ResultType
    {
        let index:number = -1;
        if (this.lastRunningNodeIdx != -1)
        {
            index = this.lastRunningNodeIdx;
        }
        this.lastRunningNodeIdx = -1;

        let resultType:ResultType = ResultType.Fail;
        if (index < 0)
        {
            this.randomList= Core.Random.GetRandomList(this.nodeChildList.length);
            index=0;
        }
        
        for (let i:number = index; i < this.randomList.length; ++i)
        {
            const node:NodeBase = this.nodeChildList[this.randomList[i]];
            resultType = node.Execute();
            if (resultType == ResultType.Fail)
            {
                continue;
            }
            if (resultType == ResultType.Success)
            {
                this.lastRunningNodeIdx=-1;
                break;
            }
            if (resultType == ResultType.Running)
            {
                this.lastRunningNodeIdx = node.nodeIndex;
                break;
            }
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        this.lastRunningNodeIdx=-1;
        this.randomList=[];
        super.reset();
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
          this.lastRunningNodeIdx=-1;
          this.randomList=[];
          super.onRecycle();
    }  
}

/// <summary>
/// 修饰节点(组合节点) 过滤器
/// </summary>
export class DecoratorNode extends NodeCombiner
{
    /// <summary>
    /// 希望的结果
    /// </summary>
    private untilResultType:ResultType = ResultType.Fail;
    constructor()
    {
      super();
       this.nodeType=NodeType.Decorator;
    }
    /// <summary>
    /// 修饰节点只有一个子节点，执行子节点直到 执行结果 = untilResultType,将 结果返回给父节点
    /// 如果执行结果 != untilResultType 则返回 Running
    /// </summary>
    /// <returns></returns>
    public Execute():ResultType
    {
        let resultType:ResultType = this.nodeChildList[0].Execute();
        if (resultType != this.untilResultType)
        {
            return ResultType.Running;
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        super.reset();
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
        super.onRecycle();
    }  
}

 /// <summary>
/// 并行节点(组合节点) 目前并行节点做了些修改 返回 成功 的下帧 不会再运行；直到全部 成功 或者 一个 失败
/// </summary>
export class ParallelNode extends NodeCombiner
{
    constructor()
    {
       super();
       this.nodeType=NodeType.Parallel;
    }

    /// <summary>
    /// 并行节点同时执行所有节点，直到一个节点返回 Fail 或者全部节点都返回 Success
    /// 才向父节点返回 Fail 或者 Success，并终止执行其他节点
    /// 其他情况向父节点返回 Running
    /// </summary>
    /// <returns></returns>
    public  Execute():ResultType
    {
        let resultType: ResultType  = ResultType.Running;

        let successCount:number = 0;
        for (let i:number = 0; i < this.nodeChildList.length; ++i)
        {
            const node:NodeBase = this.nodeChildList[i];
            if(node.lastResultType!=ResultType.Success){
                resultType = node.Execute();
            }else{
                resultType = ResultType.Success;
            }

            if (resultType == ResultType.Fail)
            {
                break;
            }

            if (resultType == ResultType.Success)
            {
                ++successCount;
                continue;
            }

            if (resultType == ResultType.Running)
            {
                continue;
            }
        }

        if (resultType != ResultType.Fail)
        {
            resultType = (successCount >= this.nodeChildList.length) ? ResultType.Success : ResultType.Running;
        }
        // if(resultType==ResultType.Success||resultType==ResultType.Fail){
        //     for (let i:number = 0; i < this.nodeChildList.length; ++i)
        //     {
        //         this.nodeChildList[i].lastResultType=ResultType.Defult;
        //     }
        // }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        super.reset();
    }
}
 /// <summary>
/// condition ifelse条件节点(组合节点) 节点必须有3个子节点 0 条件判断  1成功执行 2 失败执行;
/// </summary>
export class IfElseNode extends NodeCombiner
{
    private m_activeChildIndex:number=0;
    constructor()
    {
       super();
       this.nodeType=NodeType.IfElse;
    }

    /// <summary>
    /// 条件执行节点的“条件”分支，还可以挂上动作节点甚至是一棵子树。比如挂上动作节点时，
    /// 如果该动作节点返回Running，则条件执行节点也返回Running，并且该条件一直持续执行，
    //// 直到动作节点返回Success或Failure，则继续相应的执行“真时执行”或“假时执行”分支。
    /// </summary>
    /// <returns></returns>
    public  Execute():ResultType
    {
        if(this.nodeChildList.length<3){
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }

        let conditionResult:ResultType=ResultType.Defult;
        if(this.lastResultType==ResultType.Success||this.lastResultType==ResultType.Fail){
            conditionResult=this.lastResultType;
        }
        let node:NodeBase=null;
        if (this.m_activeChildIndex== 0) {
                node = this.nodeChildList[0];

			if (conditionResult == ResultType.Defult) {
				// condition has not been checked
				conditionResult = node.Execute();
			}
            if (conditionResult == ResultType.Success) {
				// if
                this.m_activeChildIndex = 1;
            } else if (conditionResult == ResultType.Fail) {
				// else
                this.m_activeChildIndex = 2;
            }
        }
		else {
			return this.lastResultType;
		}
        if (this.m_activeChildIndex != 0) {
            node = this.nodeChildList[this.m_activeChildIndex];
            conditionResult = node.Execute();
            this.lastResultType=conditionResult;
            return conditionResult;
        }

        this.lastResultType=ResultType.Running;
        return ResultType.Running;
    }
    public reset(){
         this.m_activeChildIndex=0;
        super.reset();
    }
}
 /// <summary>
/// 多条件选择节点(组合节点) 节点中 都是 case节点 ; switch…case 作用; 
/// </summary>
export class SwitchNode extends NodeCombiner
{
    constructor()
    {
       super();
       this.nodeType=NodeType.IfElse;
    }

    public  Execute():ResultType
    {
         

        this.lastResultType=ResultType.Running;
        return ResultType.Running;
    }
    public reset(){
        super.reset();
    }
}
 /// <summary>
/// case节点 ; switch…case  中的case作用; 只有两个节点 一个condition (没有running状态) 一个action 
/// </summary>
export class CaseNode extends NodeCombiner
{
    private m_activeChildIndex:number=0;
    constructor()
    {
       super();
       this.nodeType=NodeType.Case;
    }

    public  Execute():ResultType
    {
        if(this.nodeChildList.length<2){
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }
        let node:NodeBase=null;
        let conditionResult:ResultType=ResultType.Defult;
        if(this.m_activeChildIndex==0){
            node = this.nodeChildList[0];
            conditionResult = node.Execute();
            if (conditionResult == ResultType.Fail) {
                this.lastResultType=ResultType.Fail;
                return ResultType.Fail;
            }else if (conditionResult == ResultType.Success) {
                this.m_activeChildIndex = 1;
            } 
        }
        if(this.m_activeChildIndex==1){
            //执行 action；
            node = this.nodeChildList[1];
           conditionResult = node.Execute();
        }
        this.lastResultType=conditionResult;
        return conditionResult;
    }
    public reset(){
        this.m_activeChildIndex=0;
        super.reset();
    }
}


 /// <summary>
 /// 行为树节点类型
 /// </summary>
export enum NodeType
{
    /// <summary>
    /// 选择节点
    /// </summary>
    Select = 0,

    /// <summary>
    /// 顺序节点
    /// </summary>
    Sequence = 1,

    /// <summary>
    /// 修饰节点
    /// </summary>
    Decorator = 2,

    /// <summary>
    /// 随机节点   参数带权重  //权重选择节点; 参数 多个权重，
    /// </summary>
    Random = 3,

    /// <summary>
    /// 并行节点
    /// </summary>
    Parallel = 4,

    /// <summary>
    /// 条件节点
    /// </summary>
    Condition = 5,

    /// <summary>
    /// 行为节点
    /// </summary>
    Action = 6,

    /// 条件3条执行节点;
    IfElse =7,
    
    /// 多条件选择行节点; 
    Switch =8,

    /// 多条件选择行节点; 里面有两个节点 Condition + Action
    Case = 9,

   
}
/// <summary>
/// 节点执行结果
/// </summary>
export enum ResultType
{
    /// <summary>
    /// 失败
    /// </summary>
    Fail        = 0,

    /// <summary>
    /// 成功
    /// </summary>
    Success     = 1,

    /// <summary>
    /// 执行中
    /// </summary>
    Running     = 2,
   /// <summary>
    /// 默认 未开始;
    /// </summary>
    Defult      = 3,
}