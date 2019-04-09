import { IUpdate } from "../../../corelibs/interface/IUpdate";
import { EventDispatcher } from "../../../corelibs/event/EventDispatcher";
import { SkillPart } from "../part/SkillPart";
import { Skill } from "./Skill";
import { CharManager } from "../manager/CharManager";
import { MyMath } from "../../../corelibs/util/MyMath";
import Core from "../../../corelibs/Core";

/**
 * 技能列表;
 */
export class SkillList extends EventDispatcher implements IUpdate
{
    private skillTestId:number=0;
    protected skillpart:SkillPart;
    protected skillList:Array<Skill>;
    protected skillDic:Map<string, Skill>;
    public currentNoCDSkill :Skill;

    constructor()
    {
        super();
        this.skillList=[];
        this.skillDic=new Map<string, Skill>(); 
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(skillpart:SkillPart){
       // this.char=char;
       this.skillpart=skillpart;
      // this.skillpart.char.charData
       this.initSkill();
    }
    public initSkill(){
        this.reSet();
        if(this.skillpart.char.charData.Skills.length>0){
            for (let i = 0; i < this.skillpart.char.charData.Skills.length; i++) {
                const skill:Skill=Core.ObjectPoolMgr.get(Skill,"Skill");
                skill.init(this.skillpart);
                skill.initData(this.skillpart.char.charData.Skills[i]);
                this.skillList.push(skill);
                this.skillDic.set(skill.SkillData().ActionLabel,skill);
            }
        }else{
            let skill:Skill=Core.ObjectPoolMgr.get(Skill,"Skill");
            skill.init(this.skillpart);
            skill.initData(this.skillTestId);
            this.skillList.push(skill);
            this.skillDic.set(skill.SkillData().ActionLabel,skill);
        }
    }
    //更新;
    Update(dt: number): void {
        for (let i = 0; i < this.skillList.length; i++)
        {
            this.skillList[i].Update(dt);
        }
    }
    public getSkill(skillName:string):Skill
    {
        return this.skillDic.get(skillName);
    }
    public chkSkillisCding(action:string):boolean
    {
        if (this.skillDic.has(action))
        {
            return this.skillDic.get(action).isCDing;
        }
        else {
            return true;
        }      
    }
    public  chkSkillDic(action:string):boolean {
        if (this.skillDic.get(action).SkillData().isNoUseSkillDic)
        {
            return true;
        }
        let Dic:number = this.skillpart.char.getDicByTarget(this.skillpart.char.target, true);
       return this.skillDic.get(action).chkDic(Dic);       
    }
    public  useSkill( action:string):void
    {
        if (this.skillDic.has(action))
        {
            this.skillDic.get(action).UseSkill();
        }
    }
    public setLinkCD(liftLinkTime :number):void { 
        for (let i:number = 0; i < this.skillList.length; i++)
         {
             if (this.skillList[i].SkillData().useLinkCD && liftLinkTime > this.skillList[i].liftTime) {
                this.skillList[i].liftTime = liftLinkTime;
                this.skillList[i].isCDing = true;
              }
         }
     }

     public chkNoCdSkillByActionLabel( action:string):boolean
     {
         if (this.skillDic.has(action))
         {
             let sk:Skill = this.skillDic.get(action);
             if (!sk.isCDing)
             {
                 if (sk.SkillData().isNoUseSkillDic) {
                     return true;
                 }
                 let Dic:number = this.skillpart.char.getDicByTarget(this.skillpart.char.target,true);
                if (sk.chkDic(Dic))
                {
                    return true;
                }
             }
         }
         return false;
     }

     public getNoCDSkillId(justSkill:boolean = false,  myCamp:boolean = false,chkDic:boolean=false):Skill
     {
         //找出符合距离的技能  >1 随机权重.. 取出技能 使用....
         let noCdSkillList:Array<Skill>=[];
         let Dic:number = this.skillpart.char.getDicByTarget(this.skillpart.char.target, true);
         for (let i:number = 0; i < this.skillList.length; i++)
         {
             const sk:Skill=this.skillList[i];
             if (justSkill && sk.SkillData().isNormalAtk) {
                 continue;
             }
             if (sk.SkillData().isSecondLinkAtk) {
                 //携程攻击 跳过.
                 continue;
             }
             if (sk.SkillData().SkillType==9)
             {
                 //滚跳过不自动取..
                 continue;
             }
             if (myCamp && !sk.SkillData().isMyCamp)
             {
                 //非我方技能跳过;
                 continue;
             }
             if (!sk.isCDing) {
                 //判断距离.
                 //+目标半径...
                if (!chkDic)
                {
                    noCdSkillList.push(sk);
                }
                else if (sk.chkDic(Dic))
                {
                    noCdSkillList.push(sk);
                } 
             }
         }
         if (noCdSkillList.length == 1)
         {
             this.currentNoCDSkill = noCdSkillList[0];
         }
         else if (noCdSkillList.length > 1)
         {
            this.currentNoCDSkill = MyMath.getRulesWeight(noCdSkillList) as Skill;
         }
         else {
            this.currentNoCDSkill = null;
         }
         return this.currentNoCDSkill ;
     }



    GetName?(): string {
        return 'SkillList';
    }
    reSet(){
        let array:Array<Skill>= this.skillList;
        this.skillList=[];
        array.forEach((skill:Skill)=>{
            if(skill!=null){
                skill.recycleSelf();
            }
        })
        array=null;
        this.currentNoCDSkill=null;
        this.skillDic.clear(); 
        this.ClearAll();
    }
    /**
     *回收; 
     **/ 
    Release(): void {
        let array:Array<Skill>= this.skillList;
        this.skillpart=null;
        this.skillList=null;
        array.forEach((skill:Skill)=>{
            if(skill!=null){
                skill.recycleSelf();
            }
        })
        array=null;
        this.currentNoCDSkill=null;
       this.skillDic=null;
        super.Release();
    }
}