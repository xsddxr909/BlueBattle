import { CharData } from "../data/CharData";
import { MovePart } from "./part/MovePart";
import { SkillPart } from "./part/SkillPart";
import { Controller } from "./controller/Controller";
import { ObjBase } from "./ObjBase";
import { PosData } from "../data/PosData";
import { CtrlManager } from "./manager/CtrlManager";
import Core from "../../corelibs/Core";
import MapManager from "../map/MapManager";
import { ConfigXls, t_s_heroLevelup } from "../data/ConfigXls";
import { ViewPart } from "./part/ViewPart";

/**
 * 角色对象 ;
 * 
 */
export class Character extends ObjBase
{
    //目前战斗没有状态机; 很少状态 不需要用状态机;
    //charData;
    public charData:CharData;
    //控制器;
    protected ctrl:Controller;
    protected skill:SkillPart;

    constructor()
    {
        super();
        this.skill=Core.ObjectPoolMgr.get(SkillPart);
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(charD:PosData){
        this.charData=charD as CharData; 
        this.charData.characterId=this.id;
        this.skill.init(this);
        //创建Ctrl;
        this.ctrl=CtrlManager.Get().CreatController(this.charData.ctrlType);
        this.ctrl.init(this);
        super.init(this.charData);
        MapManager.Get().getResMap().enterResScreen(this.charData);
      //  CharManager.Get().CharQuadTree.put(this.charData);
        if(this.charData.myPlayer){
            this.charData.inCamera=true;
            super.Update(0);
        }
    }
    //更新; 重写;
    Update(dt: number): void {
        //这里分帧补间运行 保证帧同步;
        if(this.ctrl){
            this.ctrl.Update(dt);
        }
        if(this.skill){
            this.skill.Update(dt);
        }
        this.move.Update(dt);
        if(this.data.inCamera){
            if(this.view==null){
                this.view=Core.ObjectPoolMgr.get(ViewPart);
                this.view.init(this.data.bodyUrl,this.data.id,this.data.zIndex);
                //初始化长度; size()
                this.checkView();
            }
            this.view.getNode().position= this.data.position;
            this.view.body.angle=this.data.angle;
        }else{
            if(this.view!=null){
                this.view.recycleSelf();
                this.view=null;
            }
        }
        //更新碰撞数据;
        this.charData.updateObb();
      //  CharManager.Get().CharQuadTree.update(this.charData);
    }
    GetName?(): string {
        return 'Character'+this.id;
    }
    
    
     getMovePart() :MovePart{
      return this.move;
    }
    getSkillPart() :SkillPart{
        return this.skill;
    }
    /**
     * hitBody
     */
    public onAttack(){
        
        
    }
    /**
     * 受击
     */
    public onBeaten(){
        
    }
    /**
     * 击杀 或者 获得宝石后 可以获得经验 提升等级;
     */
    public checkUpgrade(exp:number){
        if(this.charData.Level>=ConfigXls.Get().t_s_heroLevelup.size)return;
        let lvUp:boolean=false;
        for (let i = this.charData.Level; i < ConfigXls.Get().t_s_heroLevelup.size; i++) {
           const upgradeInfo:t_s_heroLevelup=ConfigXls.Get().t_s_heroLevelup.get(i);
            // 如果可以升级
			if (this.charData.Exp + exp >= upgradeInfo.Exp) {
				// 等级大于玩家等级就现在最大经验
				if (this.charData.Level >= ConfigXls.Get().t_s_heroLevelup.size) {
					this.charData.Exp=upgradeInfo.Exp;
					break;
				} else {
                    // 升级并且减去经验
                    this.charData.Level+=1;
                    //	getCardChar(card.getCardId()).updateLevel();
                    lvUp=true;
					exp = exp - (upgradeInfo.Exp - this.charData.Exp);
					this.charData.Exp=0;
				}
			} else {
                this.charData.Exp+=exp;
				break;
			}
        }
        if(lvUp){
            console.log(this.charData.characterId+" char LevelUp lv: ",this.charData.Level,this.charData.Exp);
            this.onLevelUp();
        }
    }
    public onLevelUp(){
        const upgradeInfo:t_s_heroLevelup=ConfigXls.Get().t_s_heroLevelup.get(this.charData.Level);
         this.charData.scaleSize=upgradeInfo.Scale;
         this.charData.WeaponSize=upgradeInfo.weaponSize;
         this.checkView();
    }
    public checkView(){
        if(this.view!=null){
            this.view.body.scale=this.charData.scaleSize;
            this.view.body.getChildByName("weapon").width=this.charData.WeaponSize;
        }
    }

    /**
     * 回退一步;
     */
    backOneMove(dis?:number){
        this.move.backOneMove(dis);
        this.charData.updateObb();
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
    //  CharManager.Get().CharQuadTree.remove(this.charData);
      MapManager.Get().getResMap().leaveResScreen(this.charData);
      this.ctrl.recycleSelf();
      this.ctrl=null;
      this.charData=null;
      this.skill.clearAction();
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
   //     CharManager.Get().CharQuadTree.remove(this.charData);
       MapManager.Get().getResMap().leaveResScreen(this.charData);
        this.ctrl.recycleSelf();
        this.ctrl=null;

        this.skill.recycleSelf();
        this.skill=null;
        this.charData=null;
        super.Release();
    }
}