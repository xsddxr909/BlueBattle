import { RecycleAble } from "../../../corelibs/util/Pool";
import { IController } from "../../../corelibs/interface/IUpdate";
import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import { Stand } from "../action/Stand";
import { Run } from "../action/Run";
import { PosData } from "../../data/PosData";
import { ObjBase } from "../ObjBase";

/**
 * 控制器
 * 
 */
export class Controller extends RecycleAble implements IController
{
    //charData;
    public char:Character;
    
    constructor()
    {
        super();
  //      this.name='Controller';
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(char:Character){
        this.char=char;
    }
    
    OnMessage(cmd:ENUMS.ControllerCmd, param?: any): void {
        switch(cmd){
            case ENUMS.ControllerCmd.Char_Move:
                if(param!=null){
                    let dir= param as cc.Vec2;
                    this.char.getSkillPart().targetDir=dir;
                    if(this.char.charData.currentActionLabel!=Run.name){
                   //     console.log("ControllerCmd: MoveAction  ");
                         this.char.getSkillPart().doActionSkillByLabel(Run);
                    }
                }
            break;
            case ENUMS.ControllerCmd.Char_StopMove:
             //  console.log("ControllerCmd: Char_StopMove  ");
             if(this.char.charData.currentActionLabel!=Stand.name){
         //       console.log("ControllerCmd: StandAction  ");
                this.char.getSkillPart().doActionSkillByLabel(Stand);
             }
            break;
            case ENUMS.ControllerCmd.Char_FollowTarget:
            if(param!=null){
                let obj:ObjBase= param as ObjBase;
                this.char.target=obj;
                if(this.char.charData.currentActionLabel!=Run.name){
               //     console.log("ControllerCmd: MoveAction  ");
                     this.char.getSkillPart().doActionSkillByLabel(Run);
                }
                this.char.getMovePart().followMyTarget();
            }
            break;
            case ENUMS.ControllerCmd.Char_MoveToPos:
            if(param!=null){
                let pos:cc.Vec2= param as cc.Vec2;
                if(this.char.charData.currentActionLabel!=Run.name){
               //     console.log("ControllerCmd: MoveAction  ");
                     this.char.getSkillPart().doActionSkillByLabel(Run);
                }
                this.char.getMovePart().startMoveTo(pos);
            }
            break;
        }
    }


    //更新;
    Update(dt: number): void {
        
    }
    GetName?(): string {
      return 'Controller'+this.id;
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