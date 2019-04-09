import { Action } from "./Action";
import { ENUMS } from "../../common/Enum";

/**
 * 动作;
 */
export class Stand extends Action 
{
    constructor()
    {
        super();
        this.defultPriority=ENUMS.CancelPriority.Stand_Move;
        this.name="Stand";
    }

    //更新;
    Update(dt: number): void {
        super.Update(dt);

    }
  
    GetName?(): string {
        return 'Stand-'+this.id;
    }
  
     //目前游戏动画;
     public GotoFrame(frame:number=0,param:any=null):void{
         this.currentFrame = frame;
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
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        super.Release();
    }
}