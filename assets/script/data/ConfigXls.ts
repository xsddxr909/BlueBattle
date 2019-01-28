export   class   t_s_char 
{
//id 
 public  CharId:number ;
//怪物ID(关联charModel表) 
 public  CharModelID:number ;
//怪物属性表(关联CharLevelProperty表) 
 public  CharLevelProperty:number ;
//品质数据id 
 public  charQualityId:number ;
//名字 
 public  name:string ;
//击杀行动力 
 public  KillPoint:number ;
public static Creat(CharId:number,CharModelID:number,CharLevelProperty:number,charQualityId:number,name:string,KillPoint:number ):t_s_char{
let data:t_s_char=new t_s_char(); 
data.CharId=CharId; 
data.CharModelID=CharModelID; 
data.CharLevelProperty=CharLevelProperty; 
data.charQualityId=charQualityId; 
data.name=name; 
data.KillPoint=KillPoint; 
return data; 
}
}
export   class   t_s_charAction 
{
//id 
 public  ActionId:number ;
//模型路径 
 public  Model:string ;
//站立 
 public  Stand:string ;
//移动 
 public  Run:string ;
//后退 
 public  BackOff:string ;
//攻击到盾 
 public  AtkShield:string ;
//死亡 
 public  Dead:string ;
//入场 
 public  InGame:string ;
public static Creat(ActionId:number,Model:string,Stand:string,Run:string,BackOff:string,AtkShield:string,Dead:string,InGame:string ):t_s_charAction{
let data:t_s_charAction=new t_s_charAction(); 
data.ActionId=ActionId; 
data.Model=Model; 
data.Stand=Stand; 
data.Run=Run; 
data.BackOff=BackOff; 
data.AtkShield=AtkShield; 
data.Dead=Dead; 
data.InGame=InGame; 
return data; 
}
}
export   class   t_s_heroLevelup 
{
//等级 
 public  Level:number ;
//升级所需经验 
 public  Exp:number ;
//武器长度 
 public  weaponSize:number ;
//体型 
 public  Scale:number ;
public static Creat(Level:number,Exp:number,weaponSize:number,Scale:number ):t_s_heroLevelup{
let data:t_s_heroLevelup=new t_s_heroLevelup(); 
data.Level=Level; 
data.Exp=Exp; 
data.weaponSize=weaponSize; 
data.Scale=Scale; 
return data; 
}
}
export   class   t_s_hitData 
{
//id 
 public  HitId:number ;
//霸体等级CantDoAnyAction=-1, Stand_Move=0 , roll attack  =3,  skill  =4, 
 public  superArmorLevel:number ;
//名称 
 public  name:string ;
//攻击者受击时不停止 
 public  BeHurtNotStop:boolean ;
////"碰撞次数上限"  //比如开始0 --11 伤害5次  每(11-0)/5 取整 2帧一次 如果第7帧开始命中..(11-7)/2 =2 命中两次 0+2*第4次 =8帧 0+2*5次=10帧 命中 
 public  life:number ;
//命中一次后销毁 （追踪弹） 
 public  hitAutoDestory:boolean ;
//相对于攻击者+弹开力-吸引力 
 public  powerDirTarget:boolean ;
//击飞力 
 public  power:number ;
//击飞力加速度(秒) 
 public  powerAspeed:number ;
//是否使用体重计算 
 public  useWeight:boolean ;
// 硬直表现类型  默认只有一个类型  
 public  numbType:number ;
// 攻击方停顿帧数动画停止 
 public  hitStopFrame:number ;
// 被击方停顿帧数动画停止 
 public  bearStopFrame:number ;
//定位点 Vect2 
 public  locator:string ;
//受击者抽筋帧 
 public  crampFrame:number ;
// 游戏对象连接打击停顿(当此项为true时，飞行道具也会触发本体对象的打击停顿) 
 public  ObjLinkHitStopFrame:boolean ;
//受击绑定的骨骼名称; 
 public  bingBoneName:string ;
//绑定骨骼帧数 
 public  bingBoneFrame:number ;
//减益ID 
 public  debufferID:number ;
//是否强制命中 
 public  IsForceHit:boolean ;
//摄像机 震动力度(60) 
 public  CameraShockPower:number ;
//摄像机/震动时间 1秒 30帧(1.86) 
 public  CameraShockTime:number ;
//摄像机震动的衰减力;(0.999) 
 public  CameraShockDecay:number ;
//击中特效Id 
 public  effectId:number ;
//击中音效Id 
 public  soundId:number ;
//判定点是否由承受方定位(如全屏攻击时的打击效果定位必须由承受方定位)（默认1） 
 public  hitPointByBearer:boolean ;
public static Creat(HitId:number,superArmorLevel:number,name:string,BeHurtNotStop:boolean,life:number,hitAutoDestory:boolean,powerDirTarget:boolean,power:number,powerAspeed:number,useWeight:boolean,numbType:number,hitStopFrame:number,bearStopFrame:number,locator:string,crampFrame:number,ObjLinkHitStopFrame:boolean,bingBoneName:string,bingBoneFrame:number,debufferID:number,IsForceHit:boolean,CameraShockPower:number,CameraShockTime:number,CameraShockDecay:number,effectId:number,soundId:number,hitPointByBearer:boolean ):t_s_hitData{
let data:t_s_hitData=new t_s_hitData(); 
data.HitId=HitId; 
data.superArmorLevel=superArmorLevel; 
data.name=name; 
data.BeHurtNotStop=BeHurtNotStop; 
data.life=life; 
data.hitAutoDestory=hitAutoDestory; 
data.powerDirTarget=powerDirTarget; 
data.power=power; 
data.powerAspeed=powerAspeed; 
data.useWeight=useWeight; 
data.numbType=numbType; 
data.hitStopFrame=hitStopFrame; 
data.bearStopFrame=bearStopFrame; 
data.locator=locator; 
data.crampFrame=crampFrame; 
data.ObjLinkHitStopFrame=ObjLinkHitStopFrame; 
data.bingBoneName=bingBoneName; 
data.bingBoneFrame=bingBoneFrame; 
data.debufferID=debufferID; 
data.IsForceHit=IsForceHit; 
data.CameraShockPower=CameraShockPower; 
data.CameraShockTime=CameraShockTime; 
data.CameraShockDecay=CameraShockDecay; 
data.effectId=effectId; 
data.soundId=soundId; 
data.hitPointByBearer=hitPointByBearer; 
return data; 
}
}
export   class   t_s_skill 
{
//技能编号（倒数第二位代表第几个技能，倒数第三位代表技能的段数） 
 public  SkillID:number ;
//名称 
 public  SkillName:string ;
//关联技能等级数组(取技能数组下标的第几个技能作为等级 1为第一个技能,2第二个技能,其他为0) 
 public  SkillIdx:number ;
//技能Icon编号 
 public  SkillIconID:string ;
//技能在技能列表中权重(AI用) 
 public  SkillWeight:number ;
//技能动作标识（飞行道具动作需与角色对应技能动作名称一致） 
 public  ActionLabel:string ;
//技能冷却时间,单位为毫秒 
 public  skillCD:number ;
//默认0不开启1开启计算公共CD(Boss专用) 
 public  useLinkCD:number ;
//公共CD单位为毫秒 
 public  LinkCD:number ;
//技能类型（1-普通技能(瞬发),2-方向技能,3-范围技能(选目标点释放),4-召唤技能,5-狂暴技能，6-冲锋技能，7-普通攻击前先转向，8-单体攻击选择目标，9-翻滚 0-其他） 
 public  SkillType:number ;
//是否普通攻击 
 public  isNormalAtk:number ;
//是否连携攻击(例如普通攻击2,3段连击)跳转攻击时勾选(勾选后不会加入AI释放) 
 public  isSecondLinkAtk:number ;
//1为单体攻击 N为多个目标 0为非单体攻击 默认0 
 public  atkTargetNum:number ;
//是否自动转向目标攻击true_1/false_0 
 public  isFaceToTargetAtk:number ;
//使用技能前是否需要重新找目标默认0 需要为1 
 public  IsNeedReFin:number ;
//0(最近目标不找目标) 1(兵种职业类型)2(英雄优先)3(生命上限最低)4(当前生命最高)5(范围内血最少)6(范围内没有该buffId)7(仇恨最大)8(有buff的最近目标)9(有DeBuff的最近目标) 
 public  NeedReFindTarget:number ;
//参数 一/二(0近战肉盾 1近战输出 2远程物理 3法师 4治疗辅助 5攻城部队 6建筑类  7空中部队 8地面部队 9BOSS 10所有兵种 11所有英雄 12克隆对象)  三/四(费用N) 
 public  NeedReFindTargetParam:number[] ;
//查找目标角度(小于90度或者180圆) 
 public  NeedFinAngle:number ;
//0敌方1友方 
 public  isMyCamp:number ;
//此技能不需要判断目标距离0需要判断1不需要判断(多用于滚,撤退,给自己上buff) 
 public  isNoUseSkillDic:number ;
//多目标可攻击范围(施法时多目标查找范围) 
 public  SkillTargetDis:number ;
//范围大小(到范围内可以施法) 
 public  SkillDistance:number ;
//额外攻击 (扩大100倍填表） 
 public  AttackNum:number ;
//攻击增长值 (扩大100倍填表） 
 public  AttackNumAdded:number ;
//攻击增长值的增长 (扩大100倍填表） 
 public  AttackNumDBAdd:number ;
//攻击力的百分比(万分率) 
 public  AttackPerNum:number ;
//持续时间(毫秒) 
 public  SkillTime:number ;
//仇恨值 
 public  Hatred:number ;
//打击力度(1到5等级)1_2_3_4_5 
 public  HitPowerData:number ;
//打击次数 
 public  HitCountData:number ;
//召唤兽怪物Id（随等级增长+1） 
 public  summonMonstersId:number[] ;
//召唤怪物的类型(0普通召唤兽,1克隆无攻击无护甲(1,生命值成长,存活时间),2克隆(2,生命值成长,存活时间) 
 public  summonType:number[] ;
//增益buff的ID(动作标签中增加) 
 public  BuffId:number ;
//技能DeBUFF标识(一个技能只有一次Debuff在技能框中勾选) 
 public  deBuffId:number ;
//技能解锁等级 
 public  UnlockLevel:number ;
//技能链接 
 public  SkillLink:number ;
//前端先行无受击表现攻击（命中多个对象效果全中，飞行道具必须为追踪单体，跳转攻击第二段不可勾选） 
 public  ClientHitSynFirst:number ;
//必中 
 public  isForceHit:number ;
//碰撞数据 
 public  HitDataId:number ;
public static Creat(SkillID:number,SkillName:string,SkillIdx:number,SkillIconID:string,SkillWeight:number,ActionLabel:string,skillCD:number,useLinkCD:number,LinkCD:number,SkillType:number,isNormalAtk:number,isSecondLinkAtk:number,atkTargetNum:number,isFaceToTargetAtk:number,IsNeedReFin:number,NeedReFindTarget:number,NeedReFindTargetParam:number[],NeedFinAngle:number,isMyCamp:number,isNoUseSkillDic:number,SkillTargetDis:number,SkillDistance:number,AttackNum:number,AttackNumAdded:number,AttackNumDBAdd:number,AttackPerNum:number,SkillTime:number,Hatred:number,HitPowerData:number,HitCountData:number,summonMonstersId:number[],summonType:number[],BuffId:number,deBuffId:number,UnlockLevel:number,SkillLink:number,ClientHitSynFirst:number,isForceHit:number,HitDataId:number ):t_s_skill{
let data:t_s_skill=new t_s_skill(); 
data.SkillID=SkillID; 
data.SkillName=SkillName; 
data.SkillIdx=SkillIdx; 
data.SkillIconID=SkillIconID; 
data.SkillWeight=SkillWeight; 
data.ActionLabel=ActionLabel; 
data.skillCD=skillCD; 
data.useLinkCD=useLinkCD; 
data.LinkCD=LinkCD; 
data.SkillType=SkillType; 
data.isNormalAtk=isNormalAtk; 
data.isSecondLinkAtk=isSecondLinkAtk; 
data.atkTargetNum=atkTargetNum; 
data.isFaceToTargetAtk=isFaceToTargetAtk; 
data.IsNeedReFin=IsNeedReFin; 
data.NeedReFindTarget=NeedReFindTarget; 
data.NeedReFindTargetParam=NeedReFindTargetParam; 
data.NeedFinAngle=NeedFinAngle; 
data.isMyCamp=isMyCamp; 
data.isNoUseSkillDic=isNoUseSkillDic; 
data.SkillTargetDis=SkillTargetDis; 
data.SkillDistance=SkillDistance; 
data.AttackNum=AttackNum; 
data.AttackNumAdded=AttackNumAdded; 
data.AttackNumDBAdd=AttackNumDBAdd; 
data.AttackPerNum=AttackPerNum; 
data.SkillTime=SkillTime; 
data.Hatred=Hatred; 
data.HitPowerData=HitPowerData; 
data.HitCountData=HitCountData; 
data.summonMonstersId=summonMonstersId; 
data.summonType=summonType; 
data.BuffId=BuffId; 
data.deBuffId=deBuffId; 
data.UnlockLevel=UnlockLevel; 
data.SkillLink=SkillLink; 
data.ClientHitSynFirst=ClientHitSynFirst; 
data.isForceHit=isForceHit; 
data.HitDataId=HitDataId; 
return data; 
}
}
export class ConfigXls{ 
private static m_pInstance: ConfigXls; 
public static Get(): ConfigXls{  
if(null == ConfigXls.m_pInstance){ ConfigXls.m_pInstance = new ConfigXls(); } return ConfigXls.m_pInstance; } 
private inited:boolean=false; 
t_s_char:Map<number,t_s_char>=new Map<number,t_s_char>();
t_s_charAction:Map<number,t_s_charAction>=new Map<number,t_s_charAction>();
t_s_heroLevelup:Map<number,t_s_heroLevelup>=new Map<number,t_s_heroLevelup>();
t_s_hitData:Map<number,t_s_hitData>=new Map<number,t_s_hitData>();
t_s_skill:Map<number,t_s_skill>=new Map<number,t_s_skill>();
public init(){ 
if(this.inited)return; 
//t_s_char 
this.t_s_char.set(201001,t_s_char.Creat(201001,201001,201001,201001,'女骑士',1.4)); 

//t_s_charAction 
this.t_s_charAction.set(1001,t_s_charAction.Creat(1001,'warrior','Stand','Run','BackOff','AtkShield','Dead','InGame')); 

//t_s_heroLevelup 
this.t_s_heroLevelup.set(1,t_s_heroLevelup.Creat(1,30,148,1)); 

this.t_s_heroLevelup.set(2,t_s_heroLevelup.Creat(2,30,154,1.03)); 

this.t_s_heroLevelup.set(3,t_s_heroLevelup.Creat(3,30,160,1.06)); 

this.t_s_heroLevelup.set(4,t_s_heroLevelup.Creat(4,30,166,1.09)); 

this.t_s_heroLevelup.set(5,t_s_heroLevelup.Creat(5,60,172,1.12)); 

this.t_s_heroLevelup.set(6,t_s_heroLevelup.Creat(6,60,178,1.15)); 

this.t_s_heroLevelup.set(7,t_s_heroLevelup.Creat(7,60,184,1.18)); 

this.t_s_heroLevelup.set(8,t_s_heroLevelup.Creat(8,240,190,1.21)); 

this.t_s_heroLevelup.set(9,t_s_heroLevelup.Creat(9,310,196,1.24)); 

this.t_s_heroLevelup.set(10,t_s_heroLevelup.Creat(10,900,202,1.27)); 

this.t_s_heroLevelup.set(11,t_s_heroLevelup.Creat(11,1090,208,1.3)); 

this.t_s_heroLevelup.set(12,t_s_heroLevelup.Creat(12,1170,214,1.33)); 

this.t_s_heroLevelup.set(13,t_s_heroLevelup.Creat(13,1480,220,1.36)); 

this.t_s_heroLevelup.set(14,t_s_heroLevelup.Creat(14,1620,226,1.39)); 

this.t_s_heroLevelup.set(15,t_s_heroLevelup.Creat(15,2050,232,1.42)); 

//t_s_hitData 
this.t_s_hitData.set(1001,t_s_hitData.Creat(1001,3,'backoff',false,1,false,false,1500,-2500,true,0,0,0,'',2,false,'',-1,0,false,0,0,0,1001,1001,true)); 

this.t_s_hitData.set(1002,t_s_hitData.Creat(1002,3,'bodyhit',false,1,false,true,150,-400,true,0,0,0,'',2,false,'',-1,0,false,0,0,0,1001,1001,true)); 

this.t_s_hitData.set(1003,t_s_hitData.Creat(1003,3,'atkbody',false,1,false,true,150,-400,true,0,0,0,'',2,false,'',-1,0,false,0,0,0,1001,1001,true)); 

//t_s_skill 
this.t_s_skill.set(0,t_s_skill.Creat(0,'填补空缺',0,'',1,'Attack_01',1000,0,0,1,0,0,0,0,0,0,[],180,0,1,1,1,0,0,0,0,0,0,1,1,[0],[0],0,0,0,0,0,0,1001)); 

this.t_s_skill.set(1001,t_s_skill.Creat(1001,'圣光骑士普攻1',0,'zd_pgnn',1,'Attack_01',2300,0,0,1,1,0,1,1,0,0,[],180,0,0,2.8,2.8,0,0,0,10000,1000,0,1,1,[0],[0],0,0,0,0,1,0,1001)); 

this.t_s_skill.set(1001,t_s_skill.Creat(1001,'圣光骑士撤退',0,'zd_pgnn',1,'Skill_RunBack',10000,0,0,1,0,1,0,0,0,0,[],180,0,1,13,13,0,0,0,0,1000,0,1,1,[0],[0],0,0,0,0,1,0,1001)); 


this.inited=true; 
} 
} 
