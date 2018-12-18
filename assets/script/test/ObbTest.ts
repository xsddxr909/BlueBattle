import { OBB } from "../../corelibs/obb/Obb";
import { GameEventID } from "../common/GameEventID";
import Core from "../../corelibs/Core";

const {ccclass, property} = cc._decorator;

@ccclass
export class ObbTest extends cc.Component {  

    @property(ObbTest)
    public target:ObbTest=null;
    @property(Boolean)
    public isCanMove:boolean=false;
    public obb:OBB;
    private poslab:cc.Label;
   // private texSpr:cc.Sprite = null;
    onLoad(){
      Core.Get().Init();
      this.obb=new OBB()
      this.obb.init(this.node.position,this.node.width,this.node.height,this.node.rotation);
      console.log("obb : "+this.node.position,this.node.width,this.node.height,this.node.rotation);
      this.poslab=this.getComponentInChildren(cc.Label);
      if(this.isCanMove){
        console.log("isCanMove: pos " + Core.EventMgr);
        Core.EventMgr.BindEvent(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.onJoystickMove,this);
      }
      this.poslab.string=this.node.position.toString();
    }
    update(dt:number){
       if(this.target!=null){
          if(this.obb.isCollision(this.target.obb)){
            console.log("碰撞: 成功");
          }
       }
    }
    onJoystickMove(dir:cc.Vec2){
       this.node.position=this.node.position.addSelf(dir.mul(8));
       this.obb.setCenter(this.node.position);
       this.poslab.string=this.node.position.toString();
    }
    onDestroy(){
      if(this.isCanMove){
        Core.EventMgr.UnbindEvent(GameEventID.KeyEvent.ON_JOYSTICK_MOVE,this.onJoystickMove,this);
      }
    }
}  