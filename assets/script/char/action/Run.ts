import { MovePart } from "../part/MovePart";
import { SkillPart } from "../part/SkillPart";
import { Action } from "./Action";
import { ENUMS } from "../../common/Enum";
import { Stand } from "./Stand";
import { GameEventID } from "../../common/GameEventID";

/**
 * 移动动作;
 */
export class Run extends Action 
{
    private move:MovePart;
    constructor()
    {
        super();
        this.defultPriority=ENUMS.CancelPriority.Stand_Move;
      //  this.actionLabel="Run";
    }
   
    public init(skillpart:SkillPart){
        this.skillPart = skillpart;
        this.move = this.skillPart.char.getMovePart();
    }
    //更新;
    Update(dt: number): void {
        super.Update(dt);
        if(this.move.IsFollowTarget()){
            if(!this.move.chkFollowTarget()){
                this.skillPart.doActionSkillByLabel(Stand,0,false);
                return;
            }
        }
    }
  
    GetName?(): string {
        return 'Run-'+this.id;
    }
  
     //目前游戏动画;
     public GotoFrame(frame:number=0,param:any=null):void{
         this.currentFrame = frame;
         if(param!=null){
             let part: ENUMS.ControllerCmd=param;
             switch(part){
                 case ENUMS.ControllerCmd.Char_FollowTarget:
                    this.move.followMyTarget();
                 break;
                 case  ENUMS.ControllerCmd.Char_MoveToPos:
                     this.move.startMoveTo(this.skillPart.targetPos);
                     this.skillPart.char.BindEvent(GameEventID.CharEvent.MOVE_END,this.onMoveToPosEnd,this);
                 break;
             }
         }else{
            if(!this.move.IsMove()){
                //  console.log("ControllerCmd: startMove  " +dir);
                  this.move.startMove(this.skillPart.targetDir);
              }else{
              //   console.log("ControllerCmd: setTargetDir  " +dir);
                  this.move.setTargetDir(this.skillPart.targetDir);
            }
         }
     }
     private onMoveToPosEnd(data?: any){
        this.skillPart.doActionSkillByLabel(Stand,0,false);
     }
     /**
      * 切换动作 处理逻辑;
      */
     public executeSwichAction():void{
           this.skillPart.char.UnbindEvent(GameEventID.CharEvent.MOVE_END,this.onMoveToPosEnd,this);
           this.move.stopMove();
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
      this.skillPart.char.UnbindEvent(GameEventID.CharEvent.MOVE_END,this.onMoveToPosEnd,this);
      this.move=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.move=null;
        super.Release();
    }
}