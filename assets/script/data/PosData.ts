import { RecycleAble } from "../../corelibs/util/Pool";
import { ENUMS } from "../common/Enum";
import { Enum } from "protobufjs";
import { IQuadRect } from "../../corelibs/util/QuadTree";
import { MyMath } from "../../corelibs/util/MyMath";

/**
 * 角色数据; 移动数据 初始需要改变的数据都在这里;
 */
export class PosData extends RecycleAble implements IQuadRect
{
    /**
     * IQuadRect 裁剪数据;
     */
    public width: number=110;
    public height:number=110;
    /**
     * Iposition 移动数据;
     */
    //半径
    protected _radius = 55;
    public set radius(value:number){
        this._radius=value;
        this.width=this._radius*2;
        this.height=this._radius*2;
     }
    public get radius():number{
        return this._radius;
    }
    public get scaleSize():number{
        return this.scale.x;
    }
    public set scaleSize(value:number){
        this.scale.x=value;
        this.scale.y=value;   
    }
    public scale: cc.Vec2=cc.Vec2.ONE;
    public faceToRotation:boolean=true;
    public angle:number=0;
    //对象正前方;
    public forwardDirection:cc.Vec2=cc.Vec2.ZERO;
    public position:cc.Vec2=cc.Vec2.ZERO;
   //body Url  
   public bodyUrl:string="prefabs/battle/char";
   //重量....体重...
   public weight:number = 1;
   //移动点数  改变这个只可以加速(buff 增加速度等)或减速(中毒,被重击慢速移动等) 只对使用移动点数有效...;
   public  movePoint:number = 1000;
   //扭矩 旋转速度 速度为0时立刻旋转 不计算转角速度;
   public rotateSpeed:number = 7;
    //移动速度1秒多少像素;
    public moveSpeed:number = 300;

    public zIndex:number=0;
    public inCamera:boolean=false;
    public isDead:boolean=false;
    public screenId:number=-1;

    get x():number{
        return this.position.x;
    }
    set x(value:number){
       this.position.x=value;
    }
    set y(value:number){
        this.position.y=value;
    }
    get y():number{
        return this.position.y;
    };

    /**
     * 计算目标距离;
     * @param Vec2 目標位置
     * @param Radius 目標半徑
     * @param subMyRadius 是否计算我的半径
     */
    public getDic(Vec2:cc.Vec2, radius: number,subMyRadius:boolean=true): number {
        let dic:number=0;
        if (subMyRadius)
        {
            dic = Vec2.sub(this.position).mag() - radius-this.radius;
        }else{
            dic = Vec2.sub(this.position).mag() - radius;
        }
        return dic;
    }

    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
     // this.resetForwardDirection();
      this.position=cc.Vec2.ZERO;
      this.forwardDirection=cc.Vec2.ZERO;
      this.screenId=-1;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        super.Release();
    }
    /**
     * 初始化数据;
     */
    public initData(){
        this.position=cc.Vec2.ZERO;
        this.isDead=false;
        this.inCamera=false;
        this.screenId=-1;
    }
}

export class MoveParam extends RecycleAble
{
     //    public string strRunAct;
        //只有Y轴角度;
        public dir:number;
        public target:cc.Vec2;
        public speed:number;
        public hasTarget:boolean;
        public AcceleratedSpeed:number;
        public ZeroSpeedStop:boolean;
        public useMovePoint:boolean;
        //是否计算重量;
        public useWeightPower:boolean;

        reset(){
            this.dir=0;
            this.target=null;
            this.speed=0;
            this.hasTarget=false;
            this.AcceleratedSpeed=0;
            this.ZeroSpeedStop=false;
            this.useMovePoint=false;
            this.useWeightPower=false;
        }
        /**
         * 释放 时候;
        **/ 
        onRecycle(): void {
        // this.resetForwardDirection();
          this.reset();
          super.onRecycle();
       }  
       /**
        *回收; 
        **/ 
       Release(): void {
           this.target=null;
           super.Release();
       }
}
