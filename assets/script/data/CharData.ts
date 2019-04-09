import { ENUMS } from "../common/Enum";
import { PosData } from "./PosData";
import { OBB } from "../../corelibs/obb/Obb";
import Core from "../../corelibs/Core";
import { ColorBoxManager, ColorBox, IObbBox } from "../../corelibs/obb/ColorBoxManager";

/**
 * 角色数据;
 */
export class CharData extends PosData implements IObbBox
{
   //用户Id;
   public userId:number;
   //pvpId;
   public pvpId:number;
    //Character ID;
   public characterId:number;

   public myPlayer:Boolean = false;

   //角色类型;
   public charType:ENUMS.CharType=ENUMS.CharType.Character;
   public ctrlType:ENUMS.CtrlType=ENUMS.CtrlType.JoyCtrl;

    //行为树数据；
    public aiUrl: string="behavior/char/charAi.json";
    public autoStartAi:boolean=true;
    public aiState:ENUMS.AIstate=ENUMS.AIstate.Idle;

   public  birthPoint:cc.Vec2;
   public  birthDir:number;
   public  isAttacking:Boolean = false;
   //阵营 camp=-1 各自为队;
   public  camp:number=-1;
   //是否无敌....
   public  bearEnabled:Boolean;
   //是否静音
   public  isMute :Boolean = false;
   //隐身
   public  isHideBody :Boolean = false;
   //被眩晕；
   public isSwoon :Boolean = false;
   //被抓住被控制；
   public  isLink:Boolean = false;
      
   //名字;
   public TemplateName:string;
   //称号 (注:等于0的话会被销毁)
   public Title:number;
   //性别;
   public SEX:ENUMS.Sex=ENUMS.Sex.boy;
   /************************************************************************/
   /*天生霸体等级 移动待机等 均带霸体等级加成                              */
   /************************************************************************/
   public bornSuperArmLevel:number;
   //血条数;
   public LiveGroove:number=1;
   /************************************************************************/
   /*SecondaryAttribute二级属性;                                       */
   /************************************************************************/
   public HpMax:number=10;
   public HpCur:number=10;
   /**
    * 加速能量最大值;
    */
   public SpeedPowMax:number=1000;
   /**
    * 加速能量当前值;
    */
   public SpeedPowCur:number=1000;
   //加速能量消耗  200/每秒
   public SpeedPowCost:number=200;
   //加速能量恢复; 50/每秒
   public SpeedPowReply:number=50;

   public Attack:number=10;
   public Defend:number=0;
   //等级;
   public Level:number=1;
   //经验;
   public Exp:number=0;
   //技能速度;
   public skillSpeed:number=1;
    //角色的4个技能;
    public Skills:Array<number>=[];

     /**
      *  穿透 破甲....
      */
     public  Sunder :number=0;
    /** 
     * 暴击  修改成固定值...暴击率 = 暴击值/（暴击值 + 1000）
     */
    public  Crit :number=0;
    /***  
     * 闪避  修改成固定值 命中率=1-(闪避-命中)/(闪避-命中+100) 
     */
    public  Dodge :number=0;
    /***  
     * 命中 固定值
     */
    public  Hit :number=0;
    /***  
     * 吸血增加 百分比 万分率 10000 为1
     */
    public Suckblood:number=0;

    //动作数据;
    public currentActionType:number=0;
    public currentActionLabel:string="";

     //碰撞数据;
     public shieldBox:OBB=null;
     public weaponBox:OBB=null;
     public bodyBox:OBB=null;
     private weaponSize=148;
    // public attackRadius=55+148;
    private lastPos:cc.Vec2=cc.Vec2.ZERO;
    private lastRot:number=99999;

     private testBody:ColorBox; 

     //临时变量；
     public vvalue:number;
     
     constructor()
     {
       super();
       this.shieldBox=Core.ObjectPoolMgr.get(OBB,"OBB");
       this.shieldBox.offsetRotation=true;
       this.weaponBox=Core.ObjectPoolMgr.get(OBB,"OBB");
       this.weaponBox.offsetRotation=true;
       this.bodyBox=Core.ObjectPoolMgr.get(OBB,"OBB");
       this.bodyBox.offsetRotation=true;
     }

    /**
     * 重写(我方半径改成 攻击半径)  计算目标距离;
     * @param Vec2 目標位置
     * @param Radius 目標半徑
     * @param subAtkRadius 是否计算我的攻击半径 否 只计算我的半径；
     */
    public getDic(Vec2:cc.Vec2, radius: number,subAtkRadius:boolean=true): number {
        let dic:number=0;
        if (subAtkRadius)
        {
            dic = Vec2.sub(this.position).mag() - radius-this.getAttackRadius();
        }else{
            dic = Vec2.sub(this.position).mag() - radius-this.radius;
        }
        return dic;
    }

    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
     // this.resetForwardDirection();
     this.myPlayer=false;
     this.ShowHitBox(false);
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.Skills=null;
        this.shieldBox.recycleSelf();
        this.shieldBox=null;
        this.bodyBox.recycleSelf();
        this.bodyBox=null;
        this.weaponBox.recycleSelf();
        this.weaponBox=null;
        if(this.testBody!=null){
            this.testBody.recycleSelf();
            this.testBody=null;
        }
        super.Release();
    }
    /**
     * 初始化数据;
     */
    public initData(){
        super.initData();
        this.myPlayer=false;
        this.isHideBody  = false;
        this.isSwoon  = false;
        this.isLink = false;
        this.weaponSize=148;
        this.Skills=[];
        this.shieldBox.init(cc.Vec2.ZERO,120,30,0,7,73);
        this.bodyBox.init(cc.Vec2.ZERO,this._radius*2,this._radius*2,0);
        this.weaponBox.init(cc.Vec2.ZERO,148,38,0,60+130/2,-58);
        this.zIndex=1;
        this.Exp=0;
        this.Level=1;
        this.currentActionType=0;
        this.currentActionLabel="";
        this.aiState=ENUMS.AIstate.Idle;
        this.lastPos=cc.Vec2.ZERO;
        this.lastRot=99999;
        this.scaleSize=1;
    }
    
    public updateObb(){
        this.updateObb_Rotate();
        this.updateObb_Pos();
    }

     /**
      * 更新碰撞数据坐标;
      */
    private updateObb_Pos(){
        if(!this.lastPos.equals(this.position)){
            this.bodyBox.setCenter(this.position);
            this.shieldBox.setCenter(this.position);
            this.weaponBox.setCenter(this.position);
            this.lastPos.x=this.x;
            this.lastPos.y=this.y;
        }
    }
    private updateObb_Rotate(){
        if(this.lastRot!=this.angle){
       //     console.log('setAngle~~',this.angle);
            this.bodyBox.setRotation(this.angle);
            this.shieldBox.setRotation(this.angle);
            this.weaponBox.setRotation(this.angle);
            this.lastRot=this.angle;
        }
    }
    public set WeaponSize(width:number){
          this.weaponSize=width;
          this.weaponBox.width=width;
          this.weaponBox.setOffset(60+width/2,-58);
    }

    public get WeaponSize():number{
          return this.weaponSize;
    }
     /**
      * 体型 重写; 重写 set get 两个需要一起重写不然会报错;
      */
    public set radius(value:number){
        this._radius=value;
        this.bodyBox.width=this._radius*2;
        this.bodyBox.height=this._radius*2;

        this.width=this.getAttackRadius()*2;
        this.height=this.getAttackRadius()*2;
    }
    public get radius():number{
        return this._radius;
    }
    
    public get scaleX():number{
        return this.scale.x;
    }
    public get scaleY():number{
        return this.scale.y;
    }
    public getAttackRadius():number{
        return (this.radius+this.weaponSize)*this.scaleSize;
    }
    /**
     * 能获取的经验;
     */
    getDeadExp():number{
        return this.Level*30;
     }

    /**
     * 缩放;
     */ 
    public set scaleSize(value:number){
        this.scale.x=value;
        this.scale.y=value;   
        this.bodyBox.setScale(value,value);
        this.weaponBox.setScale(value,value);
        this.shieldBox.setScale(value,value);
        this.width=this.getAttackRadius()*2;
        this.height=this.getAttackRadius()*2;
    }
    public get scaleSize():number{
        return this.scale.x;
    }

    public ShowHitBox(b:boolean){
        this.ShowOpenTest(b,cc.Color.GRAY);
        this.bodyBox.ShowOpenTest(b,cc.Color.RED);
        this.shieldBox.ShowOpenTest(b,cc.Color.RED);
        this.weaponBox.ShowOpenTest(b);
    }

      /**
     * 打开碰撞测试
     * @param b 
     */
    ShowOpenTest(b:boolean , color:cc.Color=cc.Color.GREEN){
        if(b){
          if(this.testBody==null){
              this.testBody = ColorBoxManager.Get().showColorBox(this,color,true,50);
          }
        }else{
            if(this.testBody!=null){
                this.testBody.recycleSelf();
                this.testBody=null;
            }
        }
    }

}