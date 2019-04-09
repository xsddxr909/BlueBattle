import Core from "../../../corelibs/Core";
import { GameEventID } from "../../common/GameEventID";
import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import { Controller } from "./Controller";
import { MyMath } from "../../../corelibs/util/MyMath";
import { SkillPart } from "../part/SkillPart";
import { Run } from "../action/Run";
import { Stand } from "../action/Stand";

/**
 * 遥感控制器
 * 
 */
export class JoyController extends Controller 
{ 
    private skill:SkillPart;
    private _lastAngle:number=99999;
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
        switch(cmd){
            // case ENUMS.ControllerCmd.Char_Move:
            
            // break;
            // case ENUMS.ControllerCmd.Char_StopMove:
           
            // break;
        }
        super.OnMessage(cmd,param);
    }


    //更新;
    Update(dt: number): void {
        super.Update(dt);
    }
    GetName?(): string {
      return 'JoyController'+this.id;
    }
   
    onJoystickMove(dir:cc.Vec2){
    //    console.log("onJoystickMove: pos " +dir);
 //   this.char.charData.position.addSelf(dir.mul(5));
 //   this.posXy.string=this.char.position.toString();
        let angle=MyMath.vec2ToRotate(dir);
 //     console.log("onJoystickMove: currentActionType " +this.char.charData.currentActionType);
        if(this._lastAngle!= 99999 &&this.char.charData.currentActionType!=0){
            this._lastAngle=99999;
  //          console.log("change Type currentActionType===============>");
        }
        if(this.char.charData.currentActionType==0 && (this._lastAngle == 99999 || Math.abs(angle-this._lastAngle) > 5)){
      //            console.log("onJoystickMove: 大于5° " +dir);
            this._lastAngle=angle;
            //派发事件 帧同步;
            
           this.OnMessage(ENUMS.ControllerCmd.Char_Move,dir);
       }
       
    }
    onJoystickStopMove(){
        //派发事件 帧同步;

        this._lastAngle=99999;
        this.OnMessage(ENUMS.ControllerCmd.Char_StopMove);
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
        console.log("JoyController: onGet ");
        Core.EventMgr.BindEvent(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.onJoystickMove,this);
        Core.EventMgr.BindEvent(GameEventID.KeyEvent.ON_JOYSTICK_STOP_MOVE,this.onJoystickStopMove,this);
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
        console.log("JoyController: onRecycle " );
        Core.EventMgr.UnbindEvent(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.onJoystickMove,this);  
        Core.EventMgr.UnbindEvent(GameEventID.KeyEvent.ON_JOYSTICK_STOP_MOVE,this.onJoystickStopMove,this);  
       this.skill=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        Core.EventMgr.UnbindEvent(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.onJoystickMove,this);  
        Core.EventMgr.UnbindEvent(GameEventID.KeyEvent.ON_JOYSTICK_STOP_MOVE,this.onJoystickStopMove,this);  
        this.skill=null;
        super.Release();
    }
}