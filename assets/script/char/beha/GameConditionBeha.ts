import { ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
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
    if(charD){
        this.char=CharManager.Get().getCharById(charD.characterId);
    }
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
      this.lastNode();
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
    toString():string{
        let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" state:"+this.toStrState()+" res: "+this.lastResultType;
        return str;
    } 
    private toStrState():string{
        switch (this.con_State) {
             case 0:
               return "Idle";
             case 1:
               return "Follow";
             case 2:
               return "Warning";
             case 3:
               return "Attack";
             case 4:
               return "Dodge";
        }
        return "null";
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
      this.lastNode();
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
/// //判断动作 
/// </summary>
export  class ChkActionCondition extends CharConditionBeha
{
    private actionName:string;
    constructor()
    {
      super();
    }
    public Execute():ResultType
    {
        this.lastNode();
       if(this.char.charData.currentActionLabel==this.actionName){
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
        this.actionName=behaData.properties['action'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.actionName="";
        super.onRecycle();
    } 
    toString():string{
        let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" act:"+this.actionName+" res: "+this.lastResultType;
        return str;
    }   
}



 /// <summary>
/// 有人(敌人/队友)靠近我; 减去敌方攻击半径
/// </summary>
export  class SomeOneCloseMeCondition extends CharConditionBeha
{
    private dic:number;
    private Mycamp:boolean;
    constructor()
    {
      super();
    }
    public Execute():ResultType
    {
        this.lastNode();
        //因为同时在线最多30-50人 所以不做分区了。没用
      let charlist:Array<Character> = CharManager.Get().getAllCharList();
      for (let index = 0; index < charlist.length; index++) {
          const otherChar:Character = charlist[index];
          if(otherChar.charData==null||otherChar.charData.isDead){
                  continue;
          }
          if(otherChar==this.char){
              continue;
          }
          if(otherChar.charData.camp!=-1){
              //有队伍 判断敌方 友方；
              if(this.Mycamp){
                  //找友方
                if(otherChar.charData.camp!=this.char.charData.camp){
                      continue;
                  }
                }else{
                  //找敌方
                  if(otherChar.charData.camp==this.char.charData.camp){
                      continue;
                  }
              }
          }
          const cDic=otherChar.charData.getDic(this.char.charData.position,this.char.charData.radius);
          if(cDic<=this.dic){
          //      console.log("someOneCloseMe");
                this.lastResultType=ResultType.Success;
                return ResultType.Success;
          }
      }
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
    }
    public reset(){
        super.reset();
    }
    public initProperties(behaData:BehaData):void{
        this.dic=behaData.properties['dic'];
        this.Mycamp=behaData.properties['Camp']==0?true:false;
    }
    
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.Mycamp=false;
        this.dic=0;
        super.onRecycle();
    }  
}