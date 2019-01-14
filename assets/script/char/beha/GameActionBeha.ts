import { ActionBeha } from "../../../corelibs/behaTree/ActionBeha";
import { ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
import Core from "../../../corelibs/Core";
import { CharData } from "../../data/CharData";
import { Character } from "../Character";
import { CharManager } from "../manager/CharManager";
import { ENUMS } from "../../common/Enum";

export  class CharActionBeha  extends ActionBeha
{
  protected char:Character;
  public initData(){
    this.char=null;
    let charD:CharData= this.behaTree.getData<CharData>();
    this.char=CharManager.Get().characterPool.getDataById(charD.characterId);
    super.initData();
  }
   /**
     *释放 时候;
    **/ 
   onRecycle(): void {
    this.char=null;
    super.onRecycle();
   }  
}

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
    public initData(){
        super.initData();
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
///  跟随目标
/// </summary>
export  class FollowTargetAct  extends CharActionBeha
{
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      if(this.char==null||!this.char.hasTarget()){
        this.char.charData.aiState=ENUMS.AIstate.Warning;
        if(this.char.getMovePart().IsFollowTarget()){
          this.char.getMovePart().stopMove();
        }
        this.lastResultType=ResultType.Fail;
        return ResultType.Fail;
      }
      if(!this.char.getMovePart().IsFollowTarget()){
          this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_FollowTarget,this.char.target);
      }
      //判断距离；
      if(this.char.charData.radius-this.char.getDicByTarget(this.char.target,false)<=3){
        this.char.getMovePart().stopMove();
        this.lastResultType=ResultType.Success;
        return ResultType.Success;
      }
      this.lastResultType=ResultType.Running;
      return ResultType.Running;
    }
    public reset(){
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
 //     this.con_State=behaData.properties['state'];
   }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        super.onRecycle();
    }  
}


 /// <summary>
///  使用技能;
/// </summary>
export  class UseSkillAct  extends CharActionBeha
{
    private skillName:string;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      switch (this.skillName) {
        case "Speed":
            //使用加速；后面实现；

          break;
      }

      this.lastResultType=ResultType.Success;
      return ResultType.Success;
    }
    public reset(){
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
        this.SetSkill(behaData.properties['skill']);
    }
    private SetSkill(str:string){
      this.skillName=str;
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.skillName="";
        super.onRecycle();
    }  
}