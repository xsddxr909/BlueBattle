import Core from "../../corelibs/Core";

import {IUpdate} from "../../corelibs/interface/IUpdate";
import { GameEventID } from "../common/GameEventID";

export default class CameraCtrl  implements IUpdate
{
    // 单例模式
    private static m_pInstance: CameraCtrl = null;

    public static get Instance(): CameraCtrl
    {
        if(this.m_pInstance == null)
        {
            this.m_pInstance = new CameraCtrl();
        }
        return this.m_pInstance;
    }

    // cameraNode
    private m_CameraNode: cc.Node = null;
     //目标点
     private startposition: cc.Vec2 = cc.Vec2.ZERO; //相机初始位置
    //下一帧更新的位置;
     private NextPos:cc.Vec2 =cc.Vec2.ZERO;
    //关注对象;
     private _target:cc.Node=null;
     private _targetPos:cc.Vec2=null;
     //剩余缓动时间
     private _remainingTime:number;
      
     private _ZoomNum:number=1;
     private _ZoomOffset:number=0;
     private _ZoomTime:number;
 
     private dir:cc.Vec2=null;
     private dic:number =0;
     private _prePos:cc.Vec2=null;
     private _rectView:cc.Rect=null;

     private _camera:cc.Camera=null;
    constructor()
    {
       
    }
    public getCamera():cc.Camera{
        return this._camera;
    }
    /***
     *初始化；
     */
    init(): void
    {
        this.m_CameraNode=cc.find('Canvas/Main Camera');
        this._camera=this.m_CameraNode.getComponent(cc.Camera);
        
        let len_x = Core.UIRoot.Canvas.width /this._camera.zoomRatio/ 2;
        let len_y = Core.UIRoot.Canvas.height /this._camera.zoomRatio/ 2;
        this.startposition = new cc.Vec2(len_x,len_y); //相机初始位置

        
        this.NextPos=this.startposition.clone();
        this._target=null;
        this._remainingTime=0;
        this._ZoomTime=0;
        //TODO:  这里应该不对  应该改成屏幕宽高。
        this._rectView=cc.rect(0,0,Core.UIRoot.Canvas.width/this._camera.zoomRatio,Core.UIRoot.Canvas.height/this._camera.zoomRatio);
    }
    /**
     * 
     * @param dt 预渲染更新;
     */
    PreUpdate(dt:number){
        if(this._remainingTime>0){
            if(this._target!=null){
                this._prePos=this._target.position;
            }else if(this._targetPos!=null){
                this._prePos=this._targetPos.clone();
            }
            if(this._prePos!=null){
                this.dir =this._target.position.sub(this.NextPos);
                this.dic =this.dir.mag();
      //          console.log("PreUpdate: dic " ,this.dic,this.dir);
                if(this.dic<=1){
                    this.NextPos.x=this._target.position.x;
                    this.NextPos.y=this._target.position.y;
                    this._remainingTime=0;
                    this._prePos=null;
                }else{
        //            console.log("PreUpdate: dt " ,this._remainingTime,dt);
                    this.NextPos.addSelf(this.dir.mul(dt/this._remainingTime));
                }
            }
            this._remainingTime-=dt;
      }else if(this._remainingTime<=0){
            this._remainingTime=0;
            this._prePos=null;
            if(this._target!=null){
                this.NextPos.x=this._target.position.x;
                this.NextPos.y=this._target.position.y;
            }else if(this._targetPos!=null){
                this.NextPos.x=this._targetPos.x;
                this.NextPos.y=this._targetPos.y;
                this._targetPos=null;
            }
      }
      //摄像机缩放;
      if(this._ZoomTime>0){
        if(this._camera!=null){
      //      console.log("_ZoomTime : ",dt);
       //     console.log("this._camera.zoomRatio += ", dt*this._ZoomOffset);
            if(this._ZoomTime<=dt){
                this._camera.zoomRatio=this._ZoomNum;
            }else{
                this._camera.zoomRatio += dt*this._ZoomOffset;
            }
        }
        this._ZoomTime-=dt;
      }else {
        this._ZoomTime=0;
        if(this._camera!=null&&this._camera.zoomRatio!=this._ZoomNum){
            this._camera.zoomRatio = this._ZoomNum;
        }
      }

      
      this._rectView.width=Core.UIRoot.Canvas.width/this._camera.zoomRatio;
      this._rectView.height=Core.UIRoot.Canvas.height/this._camera.zoomRatio
      this._rectView.x=this.NextPos.x-this._rectView.width/2;
      this._rectView.y=this.NextPos.y-this._rectView.height/2;
    }
    getNextPos():cc.Vec2{
       return this.NextPos;
    }
    //返回 可视区域
    getBoundingBox():cc.Rect{
         return this._rectView;
    }
    isFocusTarget(node:cc.Node):boolean{
        if(!this._target){
            return false;
        }
        if(this._target==node){
            return true;
        }
        return false;
    }

    /***
     * 更新; 如果需要 就override
     */
    Update(dt: number): void {
      //摄像机跟随目标;
     // cc.moveTo 
     // console.log(this.NextPos);
      this.m_CameraNode.setPosition(this.NextPos);
    }
    GetName?(): string {
      return "MainCamera"
    }
  /**
   *  关注某个坐标;
   * @param targetPos 
   * @param duration 0立即切换  1 秒;
   */
    public LookAt(targetPos:cc.Vec2, duration:number = 0){
       this.lostTarget();
       if(duration==0){
            this.NextPos=targetPos.clone();
       }else{
           this._targetPos=targetPos;
           this._remainingTime=duration;
       }

    }
    /**
     * 摄像机切换跟随目标
     * @param node 节点; 
     * @param duration 0立即切换  1 秒;
     */
    public changeTarget(node:cc.Node, duration:number = 0):void
    {
        this.lostTarget();
        this._target=node;
        if(duration!=0){
            this._remainingTime=duration;
        }
    }

    private lostTarget(){
        if(this._target!=null){
            this._target=null;
            Core.EventMgr.Emit(GameEventID.CameraEvent.CAMERA_LOST_TARGET_FOCUS,this._target);
        }
        this._targetPos=null;
        this._remainingTime=0;
    }
 /**
     * 摄像机缩放
     * @param num 目标size; 
     * @param duration 0立即切换  1 秒;
     */
    public cameraZoom(num:number,duration:number = 0){
        if(this._ZoomNum!=num){
            this._ZoomOffset=num-this._ZoomNum;
            this._ZoomNum=num;
            if(duration!=0){
                this._ZoomTime=duration;
                this._ZoomOffset=  (this._ZoomOffset/duration);
            }
        }
        if(duration==0){
            this._ZoomTime=0;
        }
    }

    public reSet(){
        this.cameraZoom(1);
        this.lostTarget();
    }
}   