import { ActionBeha } from "../../../corelibs/behaTree/ActionBeha";
import { ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
import Core from "../../../corelibs/Core";
import { CharData } from "../../data/CharData";


 /// <summary>
///  改变状态
/// </summary>
export  class SetStateAct  extends ActionBeha
{
     private con_State:number=0;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      let charD:CharData= this.behaTree.getData<CharData>();
      charD.aiState=this.con_State;
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
    }
    public reset(){
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
      this.con_State=behaData.properties['state'];
  }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.con_State=0;
        super.onRecycle();
    }  
}

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