import { ActionBeha } from "../../../corelibs/behaTree/ActionBeha";
import { ResultType, BehaData } from "../../../corelibs/behaTree/NodeBehaTree";
import { CharData } from "../../data/CharData";
import { Character } from "../Character";
import { CharManager } from "../manager/CharManager";
import { ENUMS } from "../../common/Enum";
import { GemData } from "../../data/GemData";
import Core from "../../../corelibs/Core";
import { Run } from "../action/Run";
import { Stand } from "../action/Stand";
import { ColorBox, ColorBoxManager } from "../../../corelibs/obb/ColorBoxManager";
import { ConfigData } from "../../ConfigData";

export  class CharActionBeha  extends ActionBeha
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
///  改变状态
/// </summary>
export  class SetStateAct  extends CharActionBeha
{
     private con_State:number=0;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      if(this.behaTree.debug&&this.behaTree.allStep){
         console.log("SetState: before: "+this.toStrState(this.char.charData.aiState)+" now: "+this.toStrState(this.con_State));
      }
      this.char.charData.aiState=this.con_State;
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
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType+"state:"+this.toStrState(this.con_State);
      return str;
    } 
    private toStrState(state:number):string{
      switch (state) {
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
///  跟随目标
/// </summary>
export  class FollowTargetAct  extends CharActionBeha
{
     private followOffset:boolean=false;
     private isfollowing:boolean=false;

     private atkCloseDic:number=0;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      if(this.isfollowing){
        if(!this.char.hasTarget()){
       //     console.log("目标死亡: ");
            this.char.charData.aiState=ENUMS.AIstate.Warning;
            this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_StopMove);
            this.isfollowing=false;
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }
        if(this.char.charData.currentActionLabel=="Stand"){
           if(this.behaTree.debug){
               console.log("继续跟随: "+this.char.charData.pvpId + " tag:"+(this.char.target as Character).charData.pvpId);
           }
           this.follow();
        }
      }else{
        if(!this.char.hasTarget()){
      //    console.log("没有目标跟随: ");
          this.char.charData.aiState=ENUMS.AIstate.Warning;
          this.isfollowing=false;
          this.lastResultType=ResultType.Fail;
          return ResultType.Fail;
        }
        if(this.behaTree.debug){
             console.log("开始跟随: "+this.char.charData.pvpId + " tag:"+(this.char.target as Character).charData.pvpId);
        }
          this.follow();
          this.isfollowing=true;
      }
      let atkDic: boolean=this.atkCloseDic==0?false:true;

      //判断距离；
      if(this.char.charData.getDic(this.char.target.data.position,this.char.target.data.radius,atkDic)<= this.atkCloseDic){
          if(this.behaTree.debug){
              console.log("跟随结束: "+this.char.charData.pvpId + " tag:"+(this.char.target as Character).charData.pvpId);
          }
        this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_StopMove);
        this.isfollowing=false;
        this.lastResultType=ResultType.Success;
        return ResultType.Success;
      }
      this.lastResultType=ResultType.Running;
      return ResultType.Running;
    }
    private follow(){
      if(this.followOffset){
         this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_FollowTargetOffset,this.char.target);
   //      console.log("offset跟随: ");
      }else{
         this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_FollowTarget,this.char.target);
      }
    }
    public reset(){
      this.isfollowing=false;
        super.reset();
    }
    public initData(){
      this.isfollowing=false;
      super.initData();
    }
    public initProperties(behaData:BehaData):void{
       this.followOffset=behaData.properties['followOffset'] == 1?true:false;
       this.atkCloseDic=behaData.properties['atkCloseDic'];
   }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.atkCloseDic=0;
        this.followOffset=false;
        super.onRecycle();
    }
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType;
      return str;
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
      this.lastNode();
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
      this.skillName=behaData.properties['skill'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.skillName="";
        super.onRecycle();
    }  
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" sk:"+this.skillName+" res: "+this.lastResultType;
      return str;
    }
}

 /// <summary>
///  查找目标; type 0 最近\n        1 等级最弱\n        2 等级最强
/// </summary>
export  class FinTargetAct  extends CharActionBeha
{
    //type 0 最近\n        1 等级最弱\n        2 等级最强
    private finType:number;
    private dic:number;
    private dicCharList:Array<Character>;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      this.dicCharList=[];
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
             if(otherChar.charData.camp==this.char.charData.camp){
               continue;
             }
          }
          const cDic=otherChar.charData.getDic(this.char.charData.position,this.char.charData.radius,false);
          if(cDic<=this.dic){
              switch (this.finType) {
                case 0:
                  otherChar.charData.vvalue=cDic;
                break;
                case 1:
                case 2:
                  otherChar.charData.vvalue=otherChar.charData.Level;
                break;
              }
              if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("找到目标: "+this.char.charData.pvpId + " target:"+otherChar.charData.pvpId);
              }
            this.dicCharList.push(otherChar);
          }
      }
      switch (this.finType) {
        case 0:
            //最近的；
        case 1:
          //最弱的；等级;
          if(this.getTarget(false)){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
          }
        break;
        case 2:
          //最强的；等级;
          if(this.getTarget(true)){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
          }
        break;
      }
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
    }
    //数值越大越前...
    private CompareMaxFunc(a:Character, b:Character):number
    {
        if (a != b && a != null && b != null)
        {
            if (a.charData.vvalue > b.charData.vvalue)
            {
                return -1;
            }
            else {
                return 1;
            }
        }
        return 0;
    }
     //数值越小越前...
    private CompareMinFunc(a:Character, b:Character):number
    {
        if (a != b && a != null && b != null)
        {
            if (a.charData.vvalue < b.charData.vvalue)
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 范围内 最强 最弱 目标；最近的目标;
     * @param max 
     */
    private getTarget(max:boolean=false):boolean{
        if(this.dicCharList.length<1){
          return false;
        }
        if(this.dicCharList.length==1){
          this.char.setTarget(this.dicCharList[0]);
          if(this.behaTree.debug&&this.behaTree.allStep){
            console.log("选择 目标: "+this.char.charData.pvpId + " target:"+this.dicCharList[0].charData.pvpId);
         }
          return true;
        }
        //超过1个;
        if(max){
          this.dicCharList.sort(this.CompareMaxFunc);
        }else{
          this.dicCharList.sort(this.CompareMinFunc);
        }
        if(this.behaTree.debug&&this.behaTree.allStep){
            console.log("选择 目标: "+this.char.charData.pvpId + " target:"+this.dicCharList[0].charData.pvpId);
         }
        this.char.setTarget(this.dicCharList[0]);
        return true;
    }
    public reset(){
        super.reset();
    }
    public initData(){
      this.dicCharList=null;
      super.initData();
    }
    public initProperties(behaData:BehaData):void{
       this.finType=behaData.properties['type'];
       this.dic=behaData.properties['dic'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.finType=0;
        this.dic=0;
        this.dicCharList=null;
        super.onRecycle();
    }
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" type:"+this.finType+" res: "+this.lastResultType;
      return str;
    }  
}
 /// <summary>
///  查找仇家目标; Top 0 默认最近仇家\n        1 最高仇家
/// </summary>
export  class FinHateTargetAct  extends CharActionBeha
{
    //type  0 默认最近仇家\n        1 最高仇家
    private finType:number;
    private dic:number;
    private dicCharList:Array<Character>;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      this.dicCharList=[];
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
             if(otherChar.charData.camp==this.char.charData.camp){
               continue;
             }
          }
          //TODO:仇恨值大于0 目标；

          const cDic=otherChar.charData.getDic(this.char.charData.position,this.char.charData.radius,false);
          if(cDic<=this.dic){
              switch (this.finType) {
                case 0:
                  otherChar.charData.vvalue=cDic;
                break;
                case 1:
                  //TODO: 保存仇恨值；
                  otherChar.charData.vvalue=otherChar.charData.Level;
                break;
              }
              if(this.behaTree.debug&&this.behaTree.allStep){
                console.log("找到 仇恨 目标: "+this.char.charData.pvpId + " tag:"+otherChar.charData.pvpId);
              }
            this.dicCharList.push(otherChar);
          }
      }
      switch (this.finType) {
        case 0:
            //最近的；
          if(this.getTarget(false)){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
          }
        break;
        case 1:
          //仇恨最高
          if(this.getTarget(true)){
            this.lastResultType=ResultType.Success;
            return ResultType.Success;
          }
        break;
      }
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
    }
    //数值越大越前...
    private CompareMaxFunc(a:Character, b:Character):number
    {
        if (a != b && a != null && b != null)
        {
            if (a.charData.vvalue > b.charData.vvalue)
            {
                return -1;
            }
            else {
                return 1;
            }
        }
        return 0;
    }
     //数值越小越前...
    private CompareMinFunc(a:Character, b:Character):number
    {
        if (a != b && a != null && b != null)
        {
            if (a.charData.vvalue < b.charData.vvalue)
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 范围内 最强 最弱 目标；最近的目标;
     * @param max 
     */
    private getTarget(max:boolean=false):boolean{
        if(this.dicCharList.length<1){
          return false;
        }
        if(this.dicCharList.length==1){
          if(this.behaTree.debug&&this.behaTree.allStep){
            console.log("选择 仇恨 目标: "+this.char.charData.pvpId + " tag:"+this.dicCharList[0].charData.pvpId);
          }
          this.char.setTarget(this.dicCharList[0]);
          return true;
        }
        //超过1个;
        if(max){
          this.dicCharList.sort(this.CompareMaxFunc);
        }else{
          this.dicCharList.sort(this.CompareMinFunc);
        }
        if(this.behaTree.debug&&this.behaTree.allStep){
          console.log("选择 仇恨 目标: "+this.char.charData.pvpId + " tag:"+this.dicCharList[0].charData.pvpId);
        }
        this.char.setTarget(this.dicCharList[0]);
        return true;
    }
    public reset(){
        super.reset();
    }
    public initData(){
      this.dicCharList=null;
      super.initData();
    }
    public initProperties(behaData:BehaData):void{
       this.finType=behaData.properties['top'];
       this.dic=behaData.properties['dic'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.finType=0;
        this.dic=0;
        this.dicCharList=null;
        super.onRecycle();
    }  
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" type:"+this.finType+" res: "+this.lastResultType;
      return str;
    }  
}
 /// <summary>
///  查找 范围内 背对我的目标，
/// </summary>
export  class FinTargetBackFormMeAct  extends CharActionBeha
{
    private dic:number;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
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
             if(otherChar.charData.camp==this.char.charData.camp){
               continue;
             }
          }
          const cDic=otherChar.charData.getDic(this.char.charData.position,this.char.charData.radius,false);
          if(cDic<=this.dic){
             const dir:cc.Vec2 = otherChar.charData.position.sub(this.char.charData.position);
             dir.normalizeSelf();
             const angle:number= dir.angle(otherChar.charData.forwardDirection)*180/Math.PI;
             if(angle<80){
                if(this.behaTree.debug&&this.behaTree.allStep){
                  console.log("找到 背对我的 目标: "+this.char.charData.pvpId + " tag:"+otherChar.charData.pvpId);
                }
                this.char.setTarget(otherChar);
                this.lastResultType=ResultType.Success;
                return ResultType.Success;
             }
          }
      }
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
    }
    public reset(){
        super.reset();
    }
    public initData(){
      super.initData();
    }
    public initProperties(behaData:BehaData):void{
       this.dic=behaData.properties['dic'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.dic=0;
        super.onRecycle();
    }  
}


 /// <summary>
///  找宝石 找到移动到宝石去;  小宝石数量多 不找最近 只找随机就好;
 ///  0 小宝石\n         1 大宝石 
/// </summary>
export  class MoveToGemAct  extends CharActionBeha
{
    //type  1 小宝石\n         2 大宝石
    private finType:number;
    private dic:number;
    private rect:cc.Rect;
    private dicCharList:Array<GemData>;
    private isMoving:boolean;
   
    //显示范围;
    public debug:boolean=false;
    private targetPosBox:ColorBox=null;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      if(!this.isMoving){
        this.dicCharList=[];    
        let dic2=(this.char.charData.radius+this.dic);
        if(this.debug){
          if( this.targetPosBox){
              this.targetPosBox.recycleSelf();
          }
          this.targetPosBox= ColorBoxManager.Get().showColorPos(this.char.charData.position,cc.Color.CYAN,30,dic2*2,dic2*2);
        }
        this.rect=cc.rect(this.char.charData.x-dic2,this.char.charData.y-dic2,dic2*2,dic2*2);
        this.inMap();
        let gemlist:GemData[] = CharManager.Get().GemQuadTree.get(this.rect);
        for (let index = 0; index < gemlist.length; index++) {
           const gemD:GemData = gemlist[index];
           if(gemD==null||gemD.isDead){
                continue;
            }
            if(this.finType!=gemD.itemType){
               continue;
            }
            const cDic=gemD.getDic(this.char.charData.position,this.char.charData.radius,true);
        //    console.log(this.char.charData.id,"找宝石 距离: "+gemD.itemType,"dic",cDic,"pos",gemD.position);
          //  if(cDic<=this.dic){
               gemD.vvalue=cDic;
               if(this.behaTree.debug&&this.behaTree.allStep){
                   console.log("找到宝石: dic"+cDic,this.char.charData.pvpId ,gemD.position);
              }
               this.dicCharList.push(gemD);
          // }
        }
        if(this.getTarget()){
          this.isMoving=true;
          this.lastResultType=ResultType.Running;
          return ResultType.Running;
        }else{
    //      console.log(this.char.charData.pvpId,"找不到宝石 移动 完毕");
          this.lastResultType=ResultType.Fail;
          return ResultType.Fail;
        }
      }else{
        //检测移动到没
        if(this.char.charData.currentActionLabel=="Run"){
          this.lastResultType=ResultType.Running;
          return ResultType.Running;
        }
        if(this.char.charData.currentActionLabel=="Stand"){
          //移动到了
          if(this.behaTree.debug&&this.behaTree.allStep){
             console.log(this.char.charData.pvpId,"找宝石>>> 移动 完毕");
          }
          this.lastResultType=ResultType.Success;
          return ResultType.Success;
        }
      }
    }
    private inMap(){
      if( this.rect.x<= 0){
          this.rect.x=0;
      }
      if(this.rect.x>= ConfigData.gameMapSize.width){
        this.rect.x=ConfigData.gameMapSize.width;
      }
      if( this.rect.y<= 0){
        this.rect.y=0;
        }
        if(this.rect.y>= ConfigData.gameMapSize.height){
          this.rect.y=ConfigData.gameMapSize.height;
        }
    }

     //数值越小越前...
    private CompareMinFunc(a:GemData, b:GemData):number
    {
        if (a != b && a != null && b != null)
        {
            if (a.vvalue < b.vvalue)
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
        return 0;
    }
    /**
     * 范围内 最强 最弱 目标；最近的目标;
     * @param max 
     */
    private getTarget():boolean{
        if(this.dicCharList.length<1){
          return false;
        }
        if(this.dicCharList.length==1){
          //设置移动目标点;
          this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_MoveToPos,this.dicCharList[0].position);
      //    console.log(this.char.charData.id,"找到宝石 开始移动: "+this.dicCharList[0].position);
         // this.char.setTarget(this.dicCharList[0]);
          return true;
        }
        //超过1个;
        if(this.finType==1){
          //小宝石 太多  只找随机。 
         // let pos:cc.Vec2=this.dicCharList[Core.Random.GetRandomMax(this.dicCharList.length-1)].position;
         //找最近的。
         this.dicCharList.sort(this.CompareMinFunc);
          this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_MoveToPos,this.dicCharList[0].position);
    //      console.log(this.char.charData.id,"找小宝石 开始移动: "+this.dicCharList[0].position);
        }else{
          this.dicCharList.sort(this.CompareMinFunc);
          this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_MoveToPos,this.dicCharList[0].position);
    //      console.log(this.char.charData.id,"找大宝石 开始移动: "+this.dicCharList[0].position);
        }
        //设置移动目标点;
      //  this.char.setTarget(this.dicCharList[0]);
        return true;
    }
    public reset(){
        this.isMoving=false;
        if( this.targetPosBox){
          this.targetPosBox.recycleSelf();
          this.targetPosBox=null;
        }
        super.reset();
    }
    public initData(){
      this.dicCharList=null;
      this.isMoving=false;
      if( this.targetPosBox){
        this.targetPosBox.recycleSelf();
        this.targetPosBox=null;
      }
      super.initData();
    }
    public initProperties(behaData:BehaData):void{
       this.finType=behaData.properties['type'];
       this.dic=behaData.properties['dic'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.isMoving=false;
        this.finType=0;
        this.dic=0;
        this.dicCharList=null;
        this.rect=null;
        if( this.targetPosBox){
          this.targetPosBox.recycleSelf();
          this.targetPosBox=null;
        }
        super.onRecycle();
    }  
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" type:"+this.finType+" res: "+this.lastResultType;
      return str;
    }  
}

/// <summary>
///  随机移动 range 随机范围;
/// </summary>
export  class RandomMoveAct  extends CharActionBeha
{
    //随机范围
    private range:number;
    //范围
    private minDic:number;
    private isMoving:boolean;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      if(!this.isMoving){
         //找个随机位置点

         let rdic:number = (this.range-this.minDic)* Core.Random.GetRandom() +this.minDic;
         let angle:number = Core.Random.GetRandom() * 360;
         let pos:cc.Vec2=cc.Vec2.ZERO;
         pos.x = (this.char.charData.position.x+rdic * Math.cos(angle * Math.PI / 180))>>0 ;
         pos.y = (this.char.charData.position.y+rdic * Math.sin(angle * Math.PI / 180))>>0 ;
        this.inMap(pos);
    //     console.log("随机移动 : "+this.char.charData.id ,"Dic： "+rdic,pos);
         if(this.behaTree.debug){
           
        }
         this.char.ctrl.OnMessage(ENUMS.ControllerCmd.Char_MoveToPos,pos);
         this.isMoving=true;    
         this.lastResultType=ResultType.Running;
         return ResultType.Running;
      }
      if(this.isMoving){
        //检测移动到没
        if(this.char.charData.currentActionLabel=="Run"){
         // if(this.behaTree.debug){
        //  console.log("随机移动 >>>  中: "+this.char.charData.id,this.char.charData.position);
         // }
          this.lastResultType=ResultType.Running;
          return ResultType.Running;
        }
        if(this.char.charData.currentActionLabel=="Stand"){
          //移动到了
          if(this.behaTree.debug){
              console.log("随机移动 >>>  完毕: "+this.char.charData.id,this.char.charData.position);
          }
          this.lastResultType=ResultType.Success;
          return ResultType.Success;
        }
      }
      this.lastResultType=ResultType.Fail;
      return ResultType.Fail;
    }
    private inMap(pos:cc.Vec2){
      if( pos.x<= 0){
        pos.x=0;
      }
      if(pos.x>= ConfigData.gameMapSize.width){
        pos.x=ConfigData.gameMapSize.width;
      }
      if( pos.y<= 0){
        pos.y=0;
        }
        if(pos.y>= ConfigData.gameMapSize.height){
          pos.y=ConfigData.gameMapSize.height;
        }
    }

    public reset(){
        this.isMoving=false;
        super.reset();
    }
    public initData(){
      this.isMoving=false;
      super.initData();
    }
    public initProperties(behaData:BehaData):void{
      this.minDic=behaData.properties['minDic'];
      this.range=behaData.properties['range'];
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        this.minDic=0;
        this.isMoving=false;
        super.onRecycle();
    }  
}
/// <summary>
///  删除目标
/// </summary>
export  class DelTargetAct  extends CharActionBeha
{
     private con_State:number=0;
     constructor()
    {
      super();
    }
    public Execute():ResultType
    {
      this.lastNode();
      this.char.setTarget(null);
      this.lastResultType=ResultType.Success;
      return ResultType.Success;
    }
    public initData(){
        super.initData();
    }
    public reset(){
        super.reset();
    }
    public initProperties(behaData:BehaData):void{

    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        super.onRecycle();
    }  
    toString():string{
      let str:string="treeId:"+this.behaTree.id+" "+this.poolname+" res: "+this.lastResultType;
      return str;
    } 
}