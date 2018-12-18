import { MovePart } from "../part/MovePart";
import { SkillPart } from "../part/SkillPart";
import { Action } from "./Action";
import { ENUMS } from "../../common/Enum";

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
        this.actionLabel="Run";
    }
   
    public init(skillpart:SkillPart){
        this.skillPart = skillpart;
        this.move=this.skillPart.char.getMovePart();
    }
    //更新;
    Update(dt: number): void {
        super.Update(dt);
        if(!this.move.IsMove()){
            //  console.log("ControllerCmd: startMove  " +dir);
              this.move.startMove(this.skillPart.targetDir);
          }else{
          //   console.log("ControllerCmd: setTargetDir  " +dir);
              this.move.setTargetDir(this.skillPart.targetDir);
        }
    }
  
    GetName?(): string {
        return 'Run-'+this.id;
    }
  
     //目前游戏动画;
     public GotoFrame(frame:number=0):void{
         this.currentFrame = frame;
     }
     /**
      * 切换动作 处理逻辑;
      */
     public executeSwichAction():void{
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