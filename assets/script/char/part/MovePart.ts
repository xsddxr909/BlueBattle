import { RecycleAble } from "../../../corelibs/util/Pool";
import Core from "../../../corelibs/Core";
import { IUpdate } from "../../../corelibs/interface/IUpdate";
import { PosData } from "../../data/PosData";
import { MyMath } from "../../../corelibs/util/MyMath";
import { GameEventID } from "../../common/GameEventID";
import { ObjBase } from "../ObjBase";
import { ColorBox, ColorBoxManager } from "../../../corelibs/obb/ColorBoxManager";
import { CharData } from "../../data/CharData";

/**
 * 移动部件; 目前只做了个2D平面移动部件 以后要做2.5D 再写个Z轴咯
 * 
 */
export class MovePart extends RecycleAble implements IUpdate
{
    public obj:ObjBase;
    public pos:PosData;
    //移动方向
   // private _forwardDirection:cc.Vec2 = cc.Vec2.ZERO;
    //移动的趋向（影响旋转）
    private _targetDirection:cc.Vec2 = null;
    
    private m_bMoving:boolean = false;
    
    /**单次运动数据*运动完会重置******************************************************************************************
     * 
     */
    private moveStartTime:number = 0;
    private _moveSpeed :cc.Vec2= cc.Vec2.ZERO;
    private _moveRoate :cc.Vec2=cc.Vec2.ZERO;
    //移动速度累计;
    private _currentSpeed:number=0;
    public targetPos:cc.Vec2;
    public speed:number;
    public hasTarget:boolean;
    public AcceleratedSpeed:number;
    public ZeroSpeedStop:boolean;
    public useMovePoint:boolean;
    //是否计算重量;
    public useWeightPower:boolean;
    //只对单次移动操作有效. 立刻转向目标;
    public ImmDir:boolean=false;
    //是否跟随目标;
    public targetData:PosData;
     //跟随目标偏移;
     public targetOffset:cc.Vec2=cc.Vec2.ZERO;
     private targetLastAngle:number;
     private targetVetOf:cc.Vec2=cc.Vec2.ZERO;

     /**单次运动数据***************************************************************************************************
     */

    public debug:boolean=true;
    private targetPosBox:ColorBox=null;

    //暂停
    public paush:boolean = false;

    constructor()
    {
        super();
    }

    reset(){
        this.m_bMoving = false;
        this.moveStartTime = 0;
        this._currentSpeed = 0;
        this.targetData=null;

        this.targetPos=null;
        this.speed=0;
        this.hasTarget=false;
        this.AcceleratedSpeed=0;
        this.ZeroSpeedStop=false;
        this.useMovePoint=false;
        this.useWeightPower=false;

        this.targetOffset=cc.Vec2.ZERO;
        this.targetLastAngle=9999;
        this.targetVetOf=cc.Vec2.ZERO;

        this.ImmDir=false;
        if(this.debug&&this.targetPosBox){
                this.targetPosBox.recycleSelf();
                this.targetPosBox=null;
        }
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(pos:PosData,obj:ObjBase){
        this.reset();
        this.paush = false;
        this.pos=pos;
        this.obj=obj;
        this._moveSpeed= cc.Vec2.ZERO;
        this._moveRoate =cc.Vec2.ZERO;

        this.targetOffset=cc.Vec2.ZERO;
        this.targetLastAngle=9999;
        this.targetVetOf=cc.Vec2.ZERO;

        if(this.pos.faceToRotation){
            this.pos.forwardDirection= MyMath.RotateToVec2(this.pos.angle);
     //       console.log("this.pos.forwardDirection ",this.pos.forwardDirection,this.pos.angle);
     //      let angle= MyMath.vec2ToRotate(this.pos.forwardDirection);
     //      console.log("this.pos.angle ",this.pos.forwardDirection,angle);
        }else{
            this.pos.forwardDirection=cc.Vec2.ZERO;
        }
    }
    //更新;
    Update(dt: number): void {
        if (this.paush)return;
        if(!this.m_bMoving)return;
        //跟随对象检测;
        if(this.targetData!=null){
            if(this.targetData.isDead){
                console.log("跟随完毕  ");
                this.stopMove(true);
                return;
            }
        }
        this.changeDir(dt);
        //移动速度;
        this.moveSpeed(dt);
        this.pos.position.addSelf(this._moveSpeed);
        // if((this.pos as CharData).pvpId==12||(this.pos as CharData).pvpId==23){
        //     console.log("_moveSpeed ",(this.pos as CharData).pvpId+""+this._moveSpeed);
        //     console.log("position ", (this.pos as CharData).pvpId+""+this.pos.position);
        // }
        this.chkMove();
    }
    GetName?(): string {
        return 'MovePart'+this.id;
    }
    
    /**********************************************************
     * 行为
     * 移动; 
     */

     initSpeed(){
         if(this.speed==0&&this.AcceleratedSpeed==0){
             this.speed=this.pos.moveSpeed;
         }
     }
     /**
      * 向某个方向一直移动;
      */
    startMove(dir:cc.Vec2){
        this.hasTarget=false;
        this._targetDirection = dir;
        this.targetPos=null;
        this.targetData=null;
        this.moveStartTime = 0;
        this.initSpeed();
        this.m_bMoving=true;
    }
    /**
     * 回退一步;
     */
    backOneMove(dis?:number){
        if(dis!=null&&dis!=0){
            if(this._moveSpeed.mag()<dis){
    //            console.log("inside -=>>>>>>>>>>>>>>>>>>>>>>>>",dis);
                this.pos.position.subSelf(this._moveSpeed.normalize().mul(dis));
                return;
            }
        }
        this.pos.position.subSelf(this._moveSpeed);
    }
    /**
     * 移动到某个点上;
     */
    startMoveTo(targetPos:cc.Vec2){
        this.hasTarget=true;
        this._targetDirection=targetPos.sub(this.pos.position);
        this._targetDirection.normalizeSelf();
        this.targetPos=targetPos;
        this.targetData=null;
        this.moveStartTime = 0;
        this.initSpeed();
        this.m_bMoving=true;
        if(this.debug){
            if( this.targetPosBox){
                this.targetPosBox.recycleSelf();
            }
            this.targetPosBox= ColorBoxManager.Get().showColorPos(targetPos,cc.Color.RED,50);
        }
    }
    stopMove(needEvent:boolean=false){
        //  if((this.pos as CharData).pvpId==12||(this.pos as CharData).pvpId==23){
        //      console.log("Move_End",(this.pos as CharData).pvpId);
        //  }
        this.reset();
        if(needEvent){
            this.obj.dispatchEvent(GameEventID.CharEvent.MOVE_END);
  //         console.log("Move_End");
        }
    }
    /**
     * 是否正在移动;
     */
    IsMove():boolean{
        return this.m_bMoving;
    }
    //是否跟随目标;
    IsFollowTarget():boolean{
        return this.targetData!=null?true:false;
    }
    getNextMoveSpeedDic():cc.Vec2
    {
        return this._moveSpeed.mul(Core.deltaTime);
    }
    //设置移动趋向
    setTargetRotation(rotation:number) {
        this._targetDirection = MyMath.RotateToVec2(rotation);
        
    }
    //设置移动趋向
    setTargetDir(dir:cc.Vec2) {
        this._targetDirection = dir;
      
    }
    followMyTarget(){
        if(this.obj!=null&&this.obj.target!=null&&this.obj.target.data!=null){
            this.startFollowTarget(this.obj.target.data);
        }
    }
    chkFollowTarget():boolean{
        if(this.targetData.isDead||this.obj==null||this.obj.target==null||this.obj.target.data==null){
             this.cancelFollowTarget();
            return false;
        }
        if(this.obj.target.data!=this.targetData){
            this.setFollowTarget(this.obj.target.data);
        }
        return true;
    }
    startFollowTarget(targetData:PosData){
        if(targetData!=null&&!targetData.isDead){
            this.stopMove();
            this.setFollowTarget(targetData);
            this.m_bMoving=true;
         }
    }

    setFollowTarget(targetData:PosData){
        this.targetData=targetData;
        this.hasTarget=true;
        this.initSpeed();
    }
    cancelFollowTarget(){
        this.stopMove();
    }
     /***
      * 立刻改变方向;
      */
    private changeDir(dt:number):void{
        if(this.targetData!=null){
            if(this.targetOffset.equals(cc.Vec2.ZERO)){
                this._targetDirection=this.targetData.position.sub(this.pos.position);
                this._targetDirection.normalizeSelf();
            }else{
                if(this.targetLastAngle!=this.targetData.angle){
                    let _anlgel:number=this.targetData.angle*Math.PI/180;
                    let axisXx:number = Math.cos(_anlgel);  
                    let axisXy:number = Math.sin(_anlgel);  
                    this.targetVetOf.x= this.targetOffset.x*axisXx-this.targetOffset.y*axisXy;
                    this.targetVetOf.y= this.targetOffset.x*axisXy+this.targetOffset.y*axisXx;
                    this.targetLastAngle=this.targetData.angle
                }
                this._targetDirection=this.targetData.position.add(this.targetVetOf).sub(this.pos.position);
         //       console.log(this.targetData.position,this.targetVetOf);
                this._targetDirection.normalizeSelf();
            }

        }else if(this.targetPos!=null){
            this._targetDirection=this.targetPos.sub(this.pos.position);
            this._targetDirection.normalizeSelf();
        }
        if(this.ImmDir||this.pos.rotateSpeed==0){
            if(!this.pos.forwardDirection.equals(this._targetDirection)){
                this.pos.forwardDirection = this._targetDirection;
                //旋转;
                if(this.pos.faceToRotation){
                    this.pos.angle= MyMath.vec2ToRotate(this.pos.forwardDirection);
                }
    //            this._targetDirection=null;
            }
        }else if(this._targetDirection && !this.pos.forwardDirection.equals(this._targetDirection)){
            this._moveRoate =this._targetDirection.sub(this.pos.forwardDirection);
            if(this._moveRoate.mag()<0.01){
                //最新方向;
                this.pos.forwardDirection = this._targetDirection;
        //        this._targetDirection=null;
        //        console.log("rotation End");
            }else{
                   this._moveRoate = this._targetDirection.mul(this.pos.rotateSpeed * dt);
                    //最新方向;
                    this.pos.forwardDirection.addSelf(this._moveRoate).normalizeSelf();//.normalize();
            }
            //旋转;
            if(this.pos.faceToRotation){
                this.pos.angle= MyMath.vec2ToRotate(this.pos.forwardDirection);
            }
        }
    }
    private moveSpeed(dt:number){
        this.moveStartTime += dt;

        if (this.ZeroSpeedStop)
        {
            let zeroTime:number = (-this.speed / this.AcceleratedSpeed);
         //   console.log("this.moveStartTime",this.moveStartTime);
         //   console.log("this.zeroTime",zeroTime);
            if (this.moveStartTime > zeroTime)
            {
                this.stopMove();
                return;
            }
        }

        this._currentSpeed=this.speed+this.AcceleratedSpeed*this.moveStartTime;
        if (this.useMovePoint)
        {
            this._currentSpeed *= (this.pos.movePoint / 1000);
        }
        if (this.useWeightPower)
        {
            this._currentSpeed = this._currentSpeed / this.pos.weight;
        }
        this._moveSpeed=this.pos.forwardDirection.mul(this._currentSpeed * dt);
       // console.log("this._moveSpeed",this._moveSpeed);
    }

    private chkMove(){
        if (this.hasTarget)
        {
            if(this.targetPos){
                //    console.log("chkMove",this.targetPos,this.pos.position);
                if(this.pos.rotateSpeed==0){
                    if(this._targetDirection){                    
                        if (this._targetDirection.x > 0 && this.pos.x > this.targetPos.x)
                        {
                            this.pos.x = this.targetPos.x;
                        }
                        else if (this._targetDirection.x < 0 && this.pos.x < this.targetPos.x)
                        {
                            this.pos.x = this.targetPos.x;
                        }
                        if (this._targetDirection.y > 0 && this.pos.y > this.targetPos.y)
                        {
                            this.pos.y = this.targetPos.y;
                        }
                        else if (this._targetDirection.y < 0 && this.pos.y < this.targetPos.y)
                        {
                            this.pos.y = this.targetPos.y;
                        }
                        if(this.targetPos.equals(this.pos.position)){
                 //           console.log("moveCom",this.targetPos);
                            this.stopMove(true);
                        }
                    }
                }else{
                    //有转角速度就判断半径是否碰到了 碰到了就到目标点了 不能精确移动到位置上因为；
                    if(this.pos.getDic(this.targetPos,0,false)<=0){
               //         console.log("moveCom",this.targetPos);
                        this.stopMove(true);
                    }
                }
            }
        }

    }

    /********************************************************* */
    
    /**
     *获取 时候;
     */
    onGet(){
        super.onGet();
    }
    /**
     *释放 时候; 因为只回收主体 所以 回收后需要重置的变量 在init 方法里面写;
     **/ 
    onRecycle(): void {
      this._moveSpeed= cc.Vec2.ZERO;
      this._moveRoate =cc.Vec2.ZERO;
      this.reset();
      this.pos=null;
      this.obj=null;
      this.paush = false;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.reset();
        this.obj=null;
        this.pos=null;
        super.Release();
    }
}