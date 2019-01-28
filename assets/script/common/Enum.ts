export module ENUMS
{
    export const enum SYNC_MODE
    {
        SYNC_MODE_LOCAL,
        SYNC_MODE_STEPLOCK,
    }
    export const enum INPUT_TYPE
    {
        SCREEN_CLICK,
        TEST_UID
    }

    export const enum RANK_TYPE
    {
        FRIEND_RANK,
        GROUP_RANK
    }

    export enum CharType
    {
        Character = 0,
        Monster = 1,
        Item = 2,
        ArmorBoss = 3,
        OnlyXmoveBoss = 4,
        Projectile = 5,
        SUMMONER=6,
        Building = 7,
    }
    export enum Sex
    {
        boy = 0,
        girl = 1,
    }
     // 实体状态
     export enum CharState
     {
         Char_Normal = 0, //正常
         Char_Attack=1,   // 攻击
         Char_Hurt=2, // 受伤
         Char_Dead=3, //死亡
         Char_Freeze=4, //冰冻;
  //       Char_HurtBingBone=5, //受击跟地方骨骼走...
         Char_HurtLie=6,    //受击躺下..躺地..
         Char_DropItem=7,      //物品掉落状态.
         Char_Swoon=8,     //眩晕;
         Char_Polymorph = 9,       //变羊;
         Char_Link=10           //链接状态.
     }
     export enum ControllerCmd
     {
         Char_Move=1,
         Char_StopMove=2,
         Start_AI =3,
         Stop_AI=4,
         Paused_AI=5,
         Continue_AI=6,
         Char_FollowTarget=7,
         Char_MoveToPos=8,
        //本游戏，特殊做，跟随带偏移
        Char_FollowTargetOffset=9,
     }
       //控制类型...
    export enum CtrlType
    {
        JoyCtrl = 0,
        AiCtrl = 1,
        HalfAiCtrl = 2,
        NetCtrl = 3,
        TouchCtrl = 4
    }
    /**
     * 取消优先级 高的可以断底的 技能 技能取消用;
     */
    export enum CancelPriority{
        //什么动作都不能切换;
        CantDoAnyAction=-1,
        Stand_Move=0,
        //roll attack
        NormalAction=3,
        //skill
        SkillAction=4,
     //   Can 

    }
    export enum AIstate
    {
        //空闲
        Idle = 0,
        //追击
        Follow = 1,
        //警戒 查找目标;
        Warning = 2,
        //攻击 
        Attack = 3,
        //躲避
        Dodge = 4,
    }

}