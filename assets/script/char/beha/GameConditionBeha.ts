import { NodeBase, NodeType, ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
import { ConditionBeha } from "../../../corelibs/behaTree/ConditionBeha";
import { CharData } from "../../data/CharData";
import { CharManager } from "../manager/CharManager";
import { Character } from "../Character";


export  class CharConditionBeha  extends ConditionBeha
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
/// 判断AI状态;
/// </summary>
export  class AiStateCondition extends ConditionBeha
{
    private con_State:number=0;
    constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      let charD:CharData= this.behaTree.getData<CharData>();
      if(this.con_State==charD.aiState){
        this.lastResultType=ResultType.Success;
        return ResultType.Success;
      }
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
/// 判断目标距离;
/// </summary>
export  class HasTargetCondition extends CharConditionBeha
{
    constructor()
    {
      super();
    }
    public Execute():ResultType
    {
        if(this.char.hasTarget()){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
        }
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
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


 /// <summary>
/// 判断目标距离;
/// </summary>
export  class TargetDicCondition extends CharConditionBeha
{
    constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      let charD:CharData= this.behaTree.getData<CharData>();
      
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
