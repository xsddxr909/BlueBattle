import { IUpdate, IWeight } from "../../../corelibs/interface/IUpdate";
import { EventRecycleAble } from "../../../corelibs/event/EventDispatcher";
import { SkillPart } from "../part/SkillPart";
import { CharData } from "../../data/CharData";
import { t_s_skill, ConfigXls } from "../../data/ConfigXls";
import { GameEventID } from "../../common/GameEventID";

/**
 * 单个技能;
 */
export class Skill extends EventRecycleAble implements IUpdate,IWeight
{
    protected charD:CharData;
    protected skillpart:SkillPart;
    protected skillData:t_s_skill;
    private skillId:number;

    public liftTime:number;
    public maxTime:number;
    public isCDing:boolean=false;
     //权重......释放权重.
    public weight:number = 1;

    constructor()
    {
        super();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(skillpart:SkillPart){
       // this.char=char;
       this.skillpart=skillpart;
       this.charD=skillpart.char.charData;
    }
    public initData(skillID:number){
       this.skillId=skillID;
       this.skillData=ConfigXls.Get().t_s_skill.get(this.skillId);
       if(this.skillData!=null){
           this.weight=this.skillData.SkillWeight;
           this.maxTime = this.skillData.skillCD / 1000; 
       }
    }
    //使用技能;
    public UseSkill():boolean
    {
        if (this.liftTime <= 0)
        {
            this.liftTime = (this.skillData.skillCD / 1000) /this.charD.skillSpeed;
            //检测是否使用公共CD;
            if (this.skillData.useLinkCD==1) {
                let liftLinkCD:number = (this.skillData.LinkCD / 1000) /this.charD.skillSpeed;
                if (liftLinkCD > this.liftTime) {
                    this.liftTime = liftLinkCD + 0.1;
                }
                this.skillpart.getSkillList().setLinkCD(liftLinkCD);
            }
          //  this.liftTime = this.maxTime;
          //使用技能;
            this.skillpart.doActionSkillByLabel(this.skillData.ActionLabel);
            this.isCDing = true;
            return true;
        }
        return false;
    }
    public chkDic(Dic:number):boolean {
        if (this.charD != null) {
            return Dic <= (this.skillData.SkillDistance * this.charD.scaleSize);
        }
        return Dic <= this.skillData.SkillDistance;
    }
    //更新;
    Update(dt: number): void {
        if (!this.isCDing) return;
            this.liftTime -= dt;
            if (this.liftTime <= 0)
            {
                this.liftTime = 0;
                this.isCDing = false;
                this.finish();
        }
    }
    
    //完成;
    public  finish():void
    {
        this.dispatchEvent(GameEventID.CharEvent.SKILL_CD_COMPLETE, this);
    }
    GetName?(): string {
        return 'Skill: '+this.id+' skillId:'+this.skillId;
    }
   public SkillData():t_s_skill{
      return this.skillData;
   }

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
       this.charD=null;
       this.skillpart=null;
       this.skillData=null;
       this.skillId=0;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.charD=null;
       this.skillpart=null;
       this.skillData=null;
       this.skillId=0;
        super.Release();
    }
}