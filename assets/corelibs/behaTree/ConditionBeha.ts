import { NodeType, NodeBase } from "./NodeBehaTree";

 /// <summary>
/// 条件节点(叶节点)
/// </summary>
export  class ConditionBeha extends NodeBase
{
    constructor()
    {
      super();
       this.nodeType=NodeType.Condition;
       this.isLeaf=true;
    }
}
