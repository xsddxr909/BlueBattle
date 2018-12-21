import { NodeType, NodeBase } from "./NodeTree";

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