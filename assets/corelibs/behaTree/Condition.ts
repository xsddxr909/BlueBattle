import { NodeType, NodeBase } from "./NodeTree";

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