import BaseUI from "../../corelibs/uiframe/BaseUI";
import {UIType,UIShowMode} from "../../corelibs/uiframe/UIMgr";
import Core from "../../corelibs/Core";
import CoreConfig from "../../corelibs/CoreConfig";
import {TickMode,EventID, ResType} from "../../corelibs/CoreDefine";
import {ENUMS} from "../common/Enum";
import { SceneEnum } from "./UIenum";
import EventMgr from "../../corelibs/event/EventMgr";
import { GameEventID } from "../common/GameEventID";

/***
 *  UIJoystick 摇杆
 */
export default class UIJoystick extends BaseUI
{
    private movePoint:cc.Node;
  //  private movePointMoveRadius:number=100;
    private touchID:number;//触摸事件ID（多点触控）
    private touchArea:cc.Vec2;//触摸区域大小
    
    private fixedPointMoveCenterPos:cc.Vec2;//固定点移动中心
    private fixedPointMoveRadius:number;//固定点移动半径
  // private movePointMoveCenterPos:cc.Vec2;//移动点移动中心
    
 //   private joystickInputDir:cc.Vec2;
    constructor()
    {
        super(UIType.Normal,UIShowMode.Normal);
        this.needUpdate=true;
    }
    public Init(): void
    {
        super.Init();
        let nodeSize = this.UINode.getContentSize();
     //   console.log("UIJoystick: UINode getContentSize " +nodeSize.width,nodeSize.height);
        this.UINode.x = nodeSize.width/2+80;
        this.UINode.y = nodeSize.height/2+80;
        // 按钮点击
        this.movePoint = this.UINode.getChildByName('btn');
        this.touchArea = new cc.Vec2(nodeSize.width,nodeSize.height);
        
        //固定点位置范围
        this.fixedPointMoveCenterPos = cc.Vec2.ZERO;
        this.fixedPointMoveRadius = this.touchArea.x/2 - 20 ;
        this.reSet();
    }
    //注册事件；
    public RegisterEvent(): void
    {
        this.UINode.on(cc.Node.EventType.TOUCH_START,this.OnTouchStart,this);
        this.UINode.on(cc.Node.EventType.TOUCH_MOVE,this.OnTouchMove,this);
        this.UINode.on(cc.Node.EventType.TOUCH_END,this.OnTouchEnd,this);
        this.UINode.on(cc.Node.EventType.TOUCH_CANCEL,this.OnTouchEnd,this);
        super.RegisterEvent();
    }
     // 移除所有事件监听
     public UnRegisterEvent(): void
     {
        this.UINode.off(cc.Node.EventType.TOUCH_START,this.OnTouchStart,this);
        this.UINode.off(cc.Node.EventType.TOUCH_MOVE,this.OnTouchMove,this);
        this.UINode.off(cc.Node.EventType.TOUCH_END,this.OnTouchEnd,this);
        this.UINode.off(cc.Node.EventType.TOUCH_CANCEL,this.OnTouchEnd,this);
         super.UnRegisterEvent();
     }
    

    Display()
    {
        this.reSet();
        super.Display();
   
    }

    OnTouchStart(event:cc.Event.EventTouch){
        if (this.touchID==-1){
                //触摸位置
                let touchStartPos = event.getLocation()
                let _pos = new cc.Vec2(touchStartPos.x,touchStartPos.y)
              //  console.log("OnBtn_Start: touchStartPos " +touchStartPos.x,touchStartPos.y);
              //  console.log("OnBtn_Start: UINodePos " +this.UINode.position);
                _pos.subSelf(this.UINode.position)

              //   console.log("OnBtn_Start: _pos " +_pos);
                //控制位置
                let pos = this.clampPos(_pos,this.fixedPointMoveCenterPos,this.fixedPointMoveRadius)
              //    console.log("OnBtn_Start: pos " +pos);
              //  this.movePointMoveCenterPos = pos;
                //设置固定点位置
              //  this.setFixedPointPos(pos)
                this.setMovePointPos(pos)
                this.touchID = event.getID()
            //    Core.EventMgr.Emit(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.getInputDir());

        }
    }
    OnTouchMove(event:cc.Event.EventTouch){
        if (this.touchID==event.getID()){
                //触摸位置
                let nowPos = event.getLocation()
                let _pos = new cc.Vec2(nowPos.x,nowPos.y)
                _pos.subSelf(this.UINode.position)

                //控制位置
                let pos = this.clampPos(_pos,this.fixedPointMoveCenterPos,this.fixedPointMoveRadius);
              //  console.log("OnTouchMove: pos " +pos);
                //设置固定点位置
                this.setMovePointPos(pos)
              //  Core.EventMgr.Emit(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.getInputDir());
        }

    }
    update(dt):void{
       super.update(dt);
       let dir = this.movePoint.getPosition();
       if(dir.mag()>0.1){
          Core.EventMgr.Emit(GameEventID.KeyEvent.ON_JOYSTICK_MOVE, dir.normalizeSelf());
       }
    }
    OnTouchEnd(event:cc.Event.EventTouch){
       this.reSet();
       Core.EventMgr.Emit(GameEventID.KeyEvent.ON_JOYSTICK_STOP_MOVE);
    }
    public Release():void{
        super.Release();
        this.movePoint=null;
    }
    public reSet(){
        this.touchID = -1;
      //  this.joystickInputDir = new cc.Vec2();
        
      //  this.setFixedPointPos(this.fixedPointMoveCenterPos);
        this.setMovePointPos(this.fixedPointMoveCenterPos);

    }

    /**
     * 设置移动点位置
     */
    public setMovePointPos(pos:cc.Vec2){
        this.movePoint.setPosition(pos)
    }
 
 
    /**
     * 获取移动点位置
     */
    public getMovePointPos(){
        return this.movePoint.getPosition()
    }
 
 
    /**
     * 圆形限制，防止溢出
     * @param pos 需要固定位置
     * @param centerPos 限制中心位置
     * @param radius 限制半径
     */
    public clampPos(pos:cc.Vec2,centerPos:cc.Vec2,radius:number):cc.Vec2{
        let dpos = pos.sub(centerPos)
        if (dpos.mag()>radius){
            return dpos.normalize().mul(radius).add(centerPos)
        }else{
            return pos;
        }
    }
 
 
    /**
     * 获取摇杆输入方向
     */
    public getInputDir():cc.Vec2{
        let dir = this.movePoint.getPosition();
        if (dir.mag()>0){
            dir.normalizeSelf()
        }
        return dir;
    }
 

}