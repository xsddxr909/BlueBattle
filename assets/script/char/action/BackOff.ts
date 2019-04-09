import { MovePart } from "../part/MovePart";
import { SkillPart } from "../part/SkillPart";
import { Action } from "./Action";
import { ENUMS } from "../../common/Enum";
import { Stand } from "./Stand";

/**
 * 后退动作;
 */
export class BackOff extends Action 
{
    private move:MovePart;
    constructor()
    {
        super();
        this.defultPriority=ENUMS.CancelPriority.NormalAction;
    //    this.actionLabel="BackOff";
        this.actionType=1;
    }
   
    public init(skillpart:SkillPart){
        this.skillPart = skillpart;
        this.move=this.skillPart.char.getMovePart();
    }
    //更新;
    Update(dt: number): void {
        super.Update(dt);
    //    console.log("Update"+this.GetName());
        if(!this.move.IsMove()){
                this.skillPart.doActionSkillByLabel("Stand",0,false);
        }
    }
  
    GetName?(): string {
        return 'BackOff-'+this.id;
    }
  
     //目前游戏动画;
     public GotoFrame(frame:number=0,param:any=null):void{
         this.currentFrame = frame;
         this.move.stopMove();
         this.move.speed=-this.skillPart.hitdata.power;
         this.move.AcceleratedSpeed=-this.skillPart.hitdata.powerAspeed;
         this.move.ZeroSpeedStop=true;
         this.move.useWeightPower=this.skillPart.hitdata.useWeight;
         this.skillPart.char.data.faceToRotation=false;
         if(this.skillPart.hitdata.powerDirTarget){
            this.move.startMove(this.skillPart.targetDir);
         }else{
             this.move.startMove(this.skillPart.char.data.forwardDirection);
         }
     }
     /**
      * 切换动作 处理逻辑;
      */
     public executeSwichAction():void{
           this.skillPart.char.data.faceToRotation=true;
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
        if( this.skillPart!=null){
            this.skillPart.char.data.faceToRotation=true;
        }
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