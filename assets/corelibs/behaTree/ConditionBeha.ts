import { NodeType, NodeBase, ResultType, NodeCombiner } from "./NodeBehaTree";

 /// <summary>
/// 条件节点(叶节点)
/// </summary>
export  class ConditionBeha extends NodeCombiner
{
    constructor()
    {
      super();
       this.nodeType=NodeType.Condition;
       this.isLeaf=true;
    }
}
/** 或 判断  a || b  */
export  class OrCondition extends ConditionBeha
{
    constructor()
    {
      super();   
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
export  class AndCondition extends ConditionBeha
{
    constructor()
    {
      super();   
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