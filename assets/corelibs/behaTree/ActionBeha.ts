import { NodeType, NodeBase, ResultType } from "./NodeBehaTree";

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
///  总是成功节点(叶节点)
/// </summary>
export  class SuccessAct  extends NodeBase
{
    public  Execute():ResultType
    {
        this.lastResultType=ResultType.Success;
        return ResultType.Success;
    }
    public reset(){
        super.reset();
    }
}