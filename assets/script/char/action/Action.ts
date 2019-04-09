import { IUpdate } from "../../../corelibs/interface/IUpdate";
import { SkillPart } from "../part/SkillPart";
import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import {  RecycleAble } from "../../../corelibs/util/Pool";

/**
 * 动作;
 */
export class Action extends RecycleAble  implements IUpdate
{
    public name:string;
    //动作在SkillActionPool 中 存储的名称.. nan1@Skill_01 之类.
    public modelName:string;
    //当前使用技能对象;
    protected  skillPart:SkillPart;
    //技能类型; 1 攻击 2技能 0其他.. 3 roll 滚
    public actionType:number=0;
    //动作标签;
   // public  actionLabel:string;

    public lenght:number =0;
    public totalFrame:number =0;

    public currentFrame:number=0;
    //上次执行帧方法的帧索引
    protected  _previousFrameIndex:number = -1;

    //暂停;
    private _pause:boolean=false;
     //技能ID
    public skillActionId:number;
    /*
    * id
    */
    public  id:number;
    /*
     * 播放速度
     */
    public speed:number = 1;
    /**
     * 是否循环动作;
     */
    public _isLoop:boolean = false;
    // public aniCmdSpeed:number=1;

    /*
    * 取消优先级限制 可在动作 不同时间段调整取消优先级; 技能是否能被其他技能取消; -1为不能被打断;
    */
    public cancelPriorityLimit:ENUMS.CancelPriority=ENUMS.CancelPriority.Stand_Move;
    /**
     * 不变  默认 取消优先级;
     */
    public defultPriority:ENUMS.CancelPriority=ENUMS.CancelPriority.Stand_Move;

    constructor()
    {
        super();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(skillpart:SkillPart){
      this.skillPart =  skillpart;
    }
    
    //更新;
    Update(dt: number): void {
         //编辑器写死; 30帧;
         if (!this._pause)
        {
           this.currentFrame += 1;
            if (this.currentFrame > this.totalFrame) {
                this.currentFrame = this.totalFrame;
            }
            if(this._isLoop){
                if (this.currentFrame >= this.totalFrame) {
                    this.currentFrame=0;
                }
            }
        }
    }
  
    GetName?(): string {
        return 'Action-'+this.id;
    }
  
    public Begin(frame:number=0,param:any=null):void{

     //   this. cancelPriorityLimit = -1;
        //帧计数归0
        frame = frame == -1 ? 0 : frame;
        this.GotoFrame(frame,param);

    }

     public GotoFrame(frame:number=0,param:any=null):void{
         this.currentFrame = frame;

     }
     /**
      * 切换动作 处理逻辑;
      */
     public executeSwichAction():void{

     }
    /**
     *获取 时候;
     */
    onGet(){
        super.onGet();
        this.cancelPriorityLimit=this.defultPriority;
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
      this.skillPart=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.skillPart=null;
        super.Release();
    }
}