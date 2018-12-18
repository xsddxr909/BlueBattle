import { RecycleAble } from "../../../corelibs/util/Pool";
import { CharData } from "../../data/CharData";
import { IController } from "../../../corelibs/interface/IUpdate";
import Core from "../../../corelibs/Core";
import { GameEventID } from "../../common/GameEventID";
import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";

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
        this.name='Controller';
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(char:Character){
        this.char=char;
    }
    
    OnMessage(cmd:ENUMS.ControllerCmd, param?: any): void {
        // switch(cmd){
        //     case ENUMS.ControllerCmd.Char_Move:

        //     break;
        //     case ENUMS.ControllerCmd.Char_StopMove:
            
        //     break;
        // }
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