import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import { Action } from "./Action";

/**
 * 命令动作; 继承AGEaction xml 解析器
 */
export class CmdAction extends Action 
{
   
    constructor()
    {
        super();
    }
   
    
    //更新;
    Update(dt: number): void {
        
    }
  
    GetName?(): string {
        return 'CmdAction-'+this.id;
    }
  

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