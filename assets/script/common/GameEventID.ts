import { EventID } from "../../corelibs/CoreDefine";

/**
 * 事件系统的ID
 */
export class GameEventID
{
    public static readonly KeyEvent = cc.Enum({
        /**摇杆移动*/
        ON_JOYSTICK_MOVE: EventID.CreateID, 
        ON_JOYSTICK_STOP_MOVE: EventID.CreateID, 
        ON_SPEED_UP_KEY_DOWN:EventID.CreateID, 
        ON_SPEED_UP_KEY_UP:EventID.CreateID, 
    })
    public static readonly CameraEvent = cc.Enum({
        /**摄像机取消关注对象*/
        CAMERA_LOST_TARGET_FOCUS: EventID.CreateID, 
    })
    public static readonly CharEvent = cc.Enum({
        /**移动完毕*/
        MOVE_END: EventID.CreateID, 
        /**
         * 技能完毕;
         */
        SKILL_CD_COMPLETE:EventID.CreateID,
        /**
         * 死亡;
         */
        ON_DEAD:EventID.CreateID,
    })
}