import * as CharData from "../data/CharData";
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
import CameraCtrl from "../logic/CameraCtrl";

/**
 * 角色对象 ;
 * 
 */
export class Character extends ObjBase
{
    //目前战斗没有状态机; 很少状态 不需要用状态机;
    //charData;
    public charData:CharData.CharData;
    //控制器;
    public ctrl:Controller;
    protected skill:SkillPart;

    constructor()
    {
        super();
        this.skill=Core.ObjectPoolMgr.get(SkillPart,"SkillPart");
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(charD:PosData){
        this.charData=charD as CharData.CharData; 
        this.charData.characterId=this.id;
        this.skill.init(this);
        //创建Ctrl;
        this.ctrl=CtrlManager.Get().getController(this.charData.ctrlType);
        this.ctrl.init(this);
        super.init(this.charData);
        MapManager.Get().getResMap().enterResScreen(this.charData);
        this.onLevelUp();
      //  CharManager.Get().CharQuadTree.put(this.charData);
        if(this.charData.myPlayer){
            this.charData.inCamera=true;
            this.inView();
        }
        this.charData.updateObb();
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
            this.inView();
        }else{
            if(this.view!=null){
                this.view.recycleSelf();
                this.view=null;
            }
        }
        //更新碰撞数据;
        this.charData.updateObb();
        this.updateScreen();
      //  CharManager.Get().CharQuadTree.update(this.charData);
    }
    public inView():void{
       if(this.view==null){
            this.view=Core.ObjectPoolMgr.get(ViewPart,"ViewPart");
            this.view.init(this.data.bodyUrl,this.data.id,this.data.zIndex);
            //初始化长度; size()
            this.checkView();
        }
        // if(this.view.body){
        //     this.view.body.getChildByName("label").getComponent(cc.Label).string=(this.data.x>>0)+","+(this.data.y>>0);
        // }
        this.view.getNode().position= this.data.position;
        this.view.body.angle=this.data.angle;
    }
    GetName?(): string {
        return 'Character: '+this.charData.pvpId;
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
        //    console.log(this.charData.pvpId+" char LevelUp lv: ",this.charData.Level,this.charData.Exp);
       //     console.log("getSeedIndex: ",Core.Random.getSeedIndex(),"frame:",Core.FrameSync.currRenderFrameId);
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
            //剑尖有透明区域 需要去掉；
            this.view.body.getChildByName("weapon").width=this.charData.WeaponSize/0.82;
            if(CameraCtrl.Instance.isFocusTarget(this.view.node)){
            //    CameraCtrl.Instance.cameraZoom(1/this.charData.scaleSize,0.3);
               //要看的武器杀人 所以要成缩放比例。
                CameraCtrl.Instance.cameraZoom(148/(this.charData.WeaponSize*this.charData.scaleSize),0.3);
            }
        }
    }

    /**
     * 回退一步;
     */
    backOneMove(dis?:number){
        this.move.backOneMove(dis);
        this.charData.updateObb();
        this.updateScreen();
    }
    /**
     * 更新所在 场景分块;
     */
    updateScreen(){
        MapManager.Get().getResMap().updateObjInScreen(this.charData);
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