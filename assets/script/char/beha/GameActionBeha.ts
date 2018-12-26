import { ActionBeha } from "../../../corelibs/behaTree/ActionBeha";
import { ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
import Core from "../../../corelibs/Core";


 /// <summary>
///  使用技能;
/// </summary>
export  class UseSkillAct  extends ActionBeha
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