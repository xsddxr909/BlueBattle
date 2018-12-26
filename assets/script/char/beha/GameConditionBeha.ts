import { NodeBase, NodeType, ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
import { ConditionBeha } from "../../../corelibs/behaTree/ConditionBeha";


 /// <summary>
/// 判断目标距离;
/// </summary>
export  class TargetDicCondition extends ConditionBeha
{
    constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastResultType=ResultType.Success;
      return ResultType.Success;
    }
    public reset(){
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
//        this.SetOverFrame(behaData.properties['frameCount']);
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        super.onRecycle();
    }  
}
