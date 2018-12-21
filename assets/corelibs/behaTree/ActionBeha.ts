import { NodeType, NodeBase } from "./NodeBehaTree";

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