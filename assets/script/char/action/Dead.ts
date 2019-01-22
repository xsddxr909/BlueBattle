import { MovePart } from "../part/MovePart";
import { SkillPart } from "../part/SkillPart";
import { Action } from "./Action";
import { ENUMS } from "../../common/Enum";
import { Stand } from "./Stand";
import { CharManager } from "../manager/CharManager";
import { Character } from "../Character";
import { GameEventID } from "../../common/GameEventID";
import CameraCtrl from "../../logic/CameraCtrl";

/**
 * 死亡动作;
 */
export class Dead extends Action 
{
    private char:Character;
    constructor()
    {
        super();
        this.defultPriority=ENUMS.CancelPriority.CantDoAnyAction;
    //    this.actionLabel="Dead";
        this.actionType=1;
    }
   
    public init(skillpart:SkillPart){
        this.skillPart = skillpart;
        this.char=this.skillPart.char;
    }
    //更新;
    Update(dt: number): void {
        super.Update(dt);
    //    console.log("Update"+this.GetName());
    }
  
    GetName?(): string {
        return 'BackOff-'+this.id;
    }
  
     //目前游戏动画;
     public GotoFrame(frame:number=0,param:any=null):void{
         this.currentFrame = frame;
      
        //播放死亡动画;
        if(!this.char.data.isDead){
    //        this.char.charData.isDead=true;
    
            this.char.dispatchEvent(GameEventID.CharEvent.ON_DEAD);
        }
        //TODO: 创建钻石;

        //移除
        if(this.char.charData.myPlayer&& CameraCtrl.Instance.isFocusTarget(this.char.view.node)){
            CameraCtrl.Instance.changeTarget(null);
        }
        CharManager.Get().removeObj(this.char);
     }
     /**
      * 切换动作 处理逻辑;
      */
     public executeSwichAction():void{
      
       
     }
    /**
     *获取 时候;
     */
    onGet(){
        super.onGet();
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
        this.char=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.char=null;
        super.Release();
    }
}