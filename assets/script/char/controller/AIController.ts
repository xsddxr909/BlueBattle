import Core from "../../../corelibs/Core";
import { GameEventID } from "../../common/GameEventID";
import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import { Controller } from "./Controller";
import { MovePart } from "../part/MovePart";
import { MyMath } from "../../../corelibs/util/MyMath";
import { SkillPart } from "../part/SkillPart";
import { Run } from "../action/Run";
import { Stand } from "../action/Stand";

/**
 * 遥感控制器
 * 
 */
export class AIController extends Controller 
{ 
    private skill:SkillPart;
    constructor()
    {
        super();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(char:Character){
       super.init(char);
       this.skill=char.getSkillPart();
    }
    OnMessage(cmd:ENUMS.ControllerCmd, param?: any): void {
       
        super.OnMessage(cmd,param);
    }


    //更新;
    Update(dt: number): void {
        super.Update(dt);
    }
    GetName?(): string {
      return 'AIController'+this.id;
    }
   

    onBeginSpeedUp(){


    }
    onEndSpeedUp(){


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

       this.skill=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {

        this.skill=null;
        super.Release();
    }
}