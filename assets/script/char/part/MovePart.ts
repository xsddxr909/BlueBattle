import { RecycleAble } from "../../../corelibs/util/Pool";
import Core from "../../../corelibs/Core";
import { IUpdate } from "../../../corelibs/interface/IUpdate";
import { PosData, MoveParam } from "../../data/PosData";
import { MyMath } from "../../../corelibs/util/MyMath";
import { GameEventID } from "../../common/GameEventID";
import { ObjBase } from "../ObjBase";

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
     /**单次运动数据***************************************************************************************************
     */


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
        this.ImmDir=false;
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(pos:PosData,obj:ObjBase){
        this.reset();
        this.paush = false;
        this.pos=pos;
        this.obj=obj;
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
        this.changeDir(dt);
        //移动速度;
        this.moveSpeed(dt);
        this.pos.position.addSelf(this._moveSpeed);
        this.chkMove(dt);
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
    }
    stopMove(needEvent:boolean=false){
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
    IsFollowTarget(){
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
            this._targetDirection=this.targetData.position.sub(this.pos.position);
            this._targetDirection.normalizeSelf();
        }
        if(this.ImmDir||this.pos.rotateSpeed==0){
            if(this._targetDirection!=null&& !this.pos.forwardDirection.equals(this._targetDirection)){
                this.pos.forwardDirection = this._targetDirection;
                //旋转;
                if(this.pos.faceToRotation){
                    this.pos.angle= MyMath.vec2ToRotate(this.pos.forwardDirection);
                }
                this._targetDirection=null;
            }
        }else if(this._targetDirection && !this.pos.forwardDirection.equals(this._targetDirection)){
            this._moveRoate =this._targetDirection.sub(this.pos.forwardDirection);
            if(this._moveRoate.mag()<0.01){
                //最新方向;
                this.pos.forwardDirection = this._targetDirection;
                this._targetDirection=null;
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

    private chkMove(dt:number){
        if (this.hasTarget)
        {
            if (this.pos.forwardDirection.x > 0 && this.pos.x > this.targetPos.x)
            {
                this.pos.x = this.targetPos.x;
            }
            else if (this.pos.forwardDirection.x < 0 && this.pos.x < this.targetPos.x)
            {
                this.pos.x = this.targetPos.x;
            }
            if (this.pos.forwardDirection.y > 0 && this.pos.y > this.targetPos.y)
            {
                this.pos.y = this.targetPos.y;
            }
            else if (this.pos.forwardDirection.y < 0 && this.pos.y < this.targetPos.y)
            {
                this.pos.y = this.targetPos.y;
            }
            if(!this.IsFollowTarget()&&this.targetPos.equals(this.pos.position)){
                   this.stopMove(true);
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
     *释放 时候;
     **/ 
    onRecycle(): void {
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