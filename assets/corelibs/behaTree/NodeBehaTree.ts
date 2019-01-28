import { RecycleAble } from "../util/Pool";
import Core from "../Core";
import { MyMath } from "../util/MyMath";
import { BehaTree } from "./BehaTree";

//json 解析出来的 类;
export class BehaData{
    public id:string;
    public name:string;
    public title:string;
    public description:string;
    public properties:any;
    public children:Array<string>;
    public child:string;
}

/**
 * 不能实例基础类;
 */
export class NodeBase extends RecycleAble {  
    public md5Id:string;
    public childStr:string[];
    public behaTree:BehaTree;
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
    /// 执行节点抽象方法 重写后 开始   this.lastNode(); 结束 this.lastResultType 需要赋值  后续方便追踪;
    /// </summary>
    /// <returns>返回执行结果</returns>
    public Execute():ResultType{
        //重写后  this.lastResultType 需要赋值  后续方便追踪;
        this.lastNode();
        this.lastResultType = ResultType.Success;
        return this.lastResultType;
    }
    public lastNode(){
        if(this.behaTree){
            this.behaTree.lastNodeStep=this;
        }
    }
    
    public initProperties(behaData:BehaData):void{
        
    }
    public initData(){
        
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
        this.md5Id="";
        this.childStr=[];
        this.behaTree=null;
        super.onRecycle();
    }  
    /**
    *回收; 
    **/ 
    Release(): void {
        this.childStr=null;
        this.behaTree=null;
        super.Release();
    }
    toString():string{
        let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType;
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
    //初始化data 后初始化数据;
    public initData(){
        this.nodeChildList.forEach(element => {
            if(element!=null){
                element.initData();
            }
        });
        super.initData();
    }
    public reset(){
        this.nodeChildList.forEach(element => {
            if(element!=null){
                element.reset();
            }
        });
        super.reset();
    }
    public recycleChild(){
        let listTemp:Array<NodeBase>= this.nodeChildList;
        this.nodeChildList=[];
        listTemp.forEach(element => {
           if(element!=null){
               element.recycleSelf();
           }
       });
       listTemp=null;
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
       this.recycleChild();
       super.onRecycle();
    }  
    /**
    *回收; 
    **/ 
    Release(): void {
        this.recycleChild();
        this.nodeChildList=null;
        super.Release();
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
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("  选择 执行:"+node.poolname);
            }
            resultType = node.Execute();
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("Res>>    选择:"+resultType +" "+node.poolname);
            }
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
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("  顺序 执行:"+node.poolname);
            }
            resultType = node.Execute();
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("Res>>    顺序:"+resultType +" "+node.poolname);
            }
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
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("  随机 执行:"+node.poolname);
            }
            resultType = node.Execute();
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("Res>>    随机:"+resultType +" "+node.poolname);
            }
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
           // if(node.lastResultType!=ResultType.Success){
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("  并行 执行:"+node.poolname);
            }
                resultType = node.Execute();
         //   }else{
            //    resultType = ResultType.Success;
          //  }
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("Res>>  并行:"+node.poolname+" res:"+resultType);
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
/// condition ifelse条件节点(组合节点) 节点必须有3个子节点 0 条件判断  1成功执行 2 失败执行; 判断完成后会重置
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
        if(this.nodeChildList.length<2){
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

		//	if (conditionResult == ResultType.Defult) {
                // condition has not been checked
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("  ifelse 执行:"+node.poolname+" idx:"+this.m_activeChildIndex);
            }
            conditionResult = node.Execute();
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("Res>>  ifelse:"+node.poolname+" res:"+conditionResult+" idx:"+this.m_activeChildIndex);
            }
		//	}
            if (conditionResult == ResultType.Success) {
				// if
                this.m_activeChildIndex = 1;
            } else if (conditionResult == ResultType.Fail) {
                // else
                if(this.nodeChildList.length<3){
                    this.lastResultType=ResultType.Fail;
                    return ResultType.Fail;
                }
                this.m_activeChildIndex = 2;
            }
        }
        if (this.m_activeChildIndex != 0) {
            node = this.nodeChildList[this.m_activeChildIndex];
            conditionResult = node.Execute();
            if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("Res>> == ifelse:"+conditionResult +" "+node.poolname);
            }
            if(conditionResult==ResultType.Success||conditionResult==ResultType.Fail){
                //判断结束后需要 重新判断。
                this.m_activeChildIndex=0;
            }
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
/// 多条件选择节点(组合节点) 节点中 都是 case节点 ; switch…case 作用;  返回成功后重置所有子节点。
/// </summary>
export class SwitchNode extends NodeCombiner
{
    private caseIndex:number=-1;
    constructor()
    {
       super();
       this.nodeType=NodeType.IfElse;
    }

    public  Execute():ResultType
    {
        let index:number = 0;
        if (this.caseIndex != -1)
        {
            index = this.caseIndex;
        }
        this.caseIndex = -1;

        let resultType:ResultType=ResultType.Defult;
        for (let i:number = index; i < this.nodeChildList.length; ++i)
        {
            const node:NodeBase = this.nodeChildList[i] ;
            resultType=node.Execute();
            // if(this.behaTree.debug){
            //     console.log("  switch res:"+resultType +" "+node.poolname);
            // }
            if (resultType == ResultType.Fail)
            {
                if((node as CasesNode).actIdx()!=0){
                    //已经完成判断。直接返回结果。
                   break;
                }else{
                    continue;
                }
            }

            if (resultType == ResultType.Success)
            {
                //成功了直接返回;
                break;
            }
            if (resultType == ResultType.Running)
            {
                //证明选择成功了;
                this.caseIndex=i;
                break;
            }
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        this.caseIndex=-1;
        super.reset();
    }
}
 /// <summary>
/// case节点 ; switch…case  中的case作用; 只有两个节点 一个condition (没有running状态) 一个action 
/// </summary>
export class CasesNode extends NodeCombiner
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
    public actIdx():number{
        //执行 action；
        return  this.m_activeChildIndex;
    }
    public reset(){
        this.m_activeChildIndex=0;
        super.reset();
    }
}


/// <summary>
/// 权重随机选择节点(组合节点) 权重只能整型;   权值越大，被选到的机会越大，权值为0，则其分支不会被执行
/// </summary>
export class WeightRandomNode extends NodeCombiner
{
    private lastRunningNodeIdx:number;
    private  weightList:Array<number>;
    constructor()
    {
      super();
       this.nodeType=NodeType.WeightRandom;
       this.lastRunningNodeIdx=-1;
       this.weightList=new Array<number>();
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
            index= MyMath.getRulesWeightIdx(this.weightList);
        }
        
        const node:NodeBase = this.nodeChildList[index];
        if(this.behaTree.debug&&this.behaTree.allStep){
            console.log("  权重选择 "+ node.poolname);
        }
        resultType = node.Execute();
        if(this.behaTree.debug&&this.behaTree.allStep){
            console.log("Res>>    权重选择:"+resultType +" "+node.poolname);
        }
        if (resultType == ResultType.Running)
        {
            this.lastRunningNodeIdx = node.nodeIndex;
        }
        
        this.lastResultType=resultType;
        return resultType;
    }
    public initProperties(behaData:BehaData):void{
        this.setWeight(behaData.properties['power']);
    }
    public setWeight(str:string){
        let tempArr: Array<string> =str.split(",");
        this.weightList=[];
        for (let index = 0; index < tempArr.length; index++) {
            this.weightList.push(parseInt(tempArr[index]));            
        }
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
          this.weightList=[];
          super.onRecycle();
    }  
}


/** 或 判断  a || b  */
export  class OrNode extends NodeCombiner
{
    constructor()
    {
      super();   
       this.nodeType=NodeType.Or;
    }
    public Execute():ResultType
    {
        let resultType:ResultType = ResultType.Fail;
        for (let i:number = 0; i < this.nodeChildList.length; ++i)
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
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        super.reset();
    }
    public onRecycle(): void {
        super.onRecycle();
    }  
}
/** 与 判断  a && b  */
export  class AndNode extends NodeCombiner
{
    constructor()
    {
      super();   
      this.nodeType=NodeType.And;
    }
    public Execute():ResultType
    {
        let resultType:ResultType = ResultType.Fail;
        for (let i:number = 0; i < this.nodeChildList.length; ++i)
        {
            const node:NodeBase = this.nodeChildList[i];
            resultType = node.Execute();
            if (resultType == ResultType.Fail||resultType == ResultType.Running)
            {
                resultType=ResultType.Fail;
                break;
            }
        }
        this.lastResultType=resultType;
        return resultType;
    }
    public reset(){
        super.reset();
    }
    public onRecycle(): void {
        super.onRecycle();
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

    /// 条件3条执行节点; 子节点 必须是3个 Condition + true Action + false Action;
    IfElse =7,
    
    /// 多条件选择行节点; 
    Switch =8,

    /// 多条件选择行节点; 里面有两个节点 Condition + Action
    Case = 9,
    
    //权重随机选择 节点 权值越大，被选到的机会越大，权值为0，则其分支不会被执行
    WeightRandom =10,

     // 或 判断  a || b 
    Or =11,

      // 与 判断  a && b 
    And =12,
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