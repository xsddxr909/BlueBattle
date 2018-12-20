import { RecycleAble } from "../../../corelibs/util/Pool";
import { IUpdate } from "../../../corelibs/interface/IUpdate";
import { Character } from "../Character";
import { SkillList } from "../skill/SkillList";
import { CharManager } from "../manager/CharManager";
import { Action } from "../action/Action";
import { Run } from "../action/Run";
import Core from "../../../corelibs/Core";
import { t_s_hitData } from "../../data/ConfigXls";

/**
 * 技能部件;
 * 
 */
export class SkillPart extends RecycleAble 
{
    public char:Character;
    private skillList:SkillList;
    public currentAction:Action;
    //遥杆 或者 目标 要去的方向;
    public targetDir:cc.Vec2;
    //受击 与攻击表现；
    public  hitdata:t_s_hitData;
    //当前动作类型 1普通攻击 2技能 0其他
  //  public currentActionType:number=0;
 //   public currentActionLabel:string="";
    constructor()
    {
        super();
        this.skillList=new SkillList();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(char:Character){
        this.char=char;
        this.skillList.init(this);
    }
    //更新;
    Update(dt: number): void {
        this.skillList.Update(dt);
        if(this.currentAction!=null){
            this.currentAction.Update(dt);
        }
    }
    GetName?(): string {
        return 'SkillPart:'+this.id;
    }
    
    getSkillList(): SkillList {
      return this.skillList;
    }
    public doActionSkillByLabel(actionLabel: any,frame:number=0,chkCencelLV:boolean=true): void {
        if(this.currentAction!=null&&this.currentAction.poolname==actionLabel.name){
           return;
        }
        let tempAction:Action=Core.ObjectPoolMgr.get(actionLabel);
        if(chkCencelLV&&!this.chkCancelLvActionSkill(actionLabel,tempAction)){
            tempAction.recycleSelf();
            tempAction=null;
            return ;
        }
        if(this.currentAction!=null){
            this.currentAction.executeSwichAction();
            this.currentAction.recycleSelf();
            this.currentAction=null;
        }
        this.currentAction=tempAction;
        this.currentAction.init(this);
        this.currentAction.Begin(frame);
        this.char.charData.currentActionType=this.currentAction.actionType;
        this.char.charData.currentActionLabel=this.currentAction.poolname;
    }
    public chkCancelLvActionSkill(actionLabel: any,linkAction?:Action):boolean{
        if(this.currentAction==null){
            return true;
        }
        if(this.char.charData.currentActionType == 0){
            return true;
        }
         //各种状态不能切换动作；
         if(this.char.charData.isSwoon){
             return false
         }else if(this.char.charData.isLink){
             return false;
         }
     //    console.log("currentAction.cancelPriorityLimit  ",this.currentAction.cancelPriorityLimit,this.currentAction.actionLabel);
         if (this.currentAction.cancelPriorityLimit >= 0)
         {
             if (actionLabel != Run &&this.skillList.chkSkillisCding(actionLabel.name))
             {
                 return false;
             }
             let needrecycle:boolean=false;
             if(linkAction == null){
                linkAction=Core.ObjectPoolMgr.get(actionLabel);
                needrecycle=true;
             } 
       //      console.log("linkAction.cancelPriorityLimit  ",linkAction.cancelPriorityLimit,linkAction.actionLabel);
            if (linkAction.cancelPriorityLimit > this.currentAction.cancelPriorityLimit)
            {
                if(needrecycle){
                linkAction.recycleSelf();
                }else{
                linkAction=null;
                }
                return true;
            }
            if(needrecycle){
                linkAction.recycleSelf();
            }else{
                linkAction=null;
            }
         }
         return false;
    }
    /**********************************************************
     * 动作技能
     * 
     */


    /********************************************************* */
    /**
     *获取 时候;
     */
    onGet(){
        super.onGet();
    }
    clearAction(){
        if( this.currentAction!=null){
            this.currentAction.recycleSelf();
            this.currentAction=null;
        }
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
      this.char=null;
      this.hitdata=null;
      this.skillList.reSet();
      this.clearAction();
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.char=null;
        this.hitdata=null;
        this.skillList.Release();
        this.skillList=null;
        this.clearAction();
        super.Release();
    }
}