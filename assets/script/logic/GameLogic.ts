import IRelease from "../../corelibs/interface/IRelease";
import { Character } from "../char/Character";
import Core from "../../corelibs/Core";
import CameraCtrl from "./CameraCtrl";
import MapManager from "../map/MapManager";
import { UIEnum } from "../UI/UIenum";
import { CharManager } from "../char/manager/CharManager";
import { CharData } from "../data/CharData";
import { ENUMS } from "../common/Enum";
import FrameSync from "../../corelibs/FrameSync";
import { ResStruct } from "../../corelibs/util/ResourcesMgr";
import { ResType } from "../../corelibs/CoreDefine";
import { AIController } from "../char/controller/AIController";




export default class GameLogic implements IRelease
{
    //临时;
    private char:Character; 
    private frameSync:FrameSync;


    //游戏逻辑类;
    GetName?(): string
    {
        return "GameLogic";
    }
 
    constructor()
    {
  //      Core.ResourcesMgr.LoadRes(ResStruct.CreateRes("behavior/char/charAi.json",ResType.JsonAsset),this.onload.bind(this));
        this.Init();
    }
    // private onload(){
    // }
    public Init()
    {
        Core.Random.Init(2);  //468
        this.frameSync=Core.ObjectPoolMgr.get(FrameSync,"FrameSync");
        this.frameSync.initialize(this.FrameSyncUpdate.bind(this));
        this.frameSync.isPlayAlone=true;
        this.frameSync.FrameSpeed=1;

        CameraCtrl.Instance.init();

        //初始化地图数据;
        MapManager.Get().reset();

        this.creatMyPlayer();

        this.creatOther();

        //显示UI;
        Core.UIMgr.ShowUI(UIEnum.UIJoystick);
        Core.UIMgr.ShowUI(UIEnum.UISkillBtn);
        Core.UIMgr.ShowUI(UIEnum.UIBackToLogin);

        CharManager.Get().isHitTest=true;
        console.log("GameLogic  Inited RandomSeed: ",Core.Random.getBeginSeed(),"getSeedIndex: ",Core.Random.getSeedIndex());
    }
    /**
     * 创建玩家;
     */
    creatMyPlayer(){
        let charD:CharData=CharManager.Get().charDataPool.get();
        charD.initData();
        charD.myPlayer=true;
        charD.angle=90;
        charD.radius=55;
        charD.ctrlType=ENUMS.CtrlType.JoyCtrl;
        charD.autoStartAi=false;
        charD.pvpId=1;
        charD.position=CharManager.Get().getBrothPoint(charD.radius);
        this.char=CharManager.Get().getNewChar();
        this.char.init(charD);
     // (this.char.ctrl as AIController).setDebug(true);
        CameraCtrl.Instance.changeTarget(this.char.view.node);

        //碰撞测试;
    //    this.char.charData.ShowHitBox(true);
    }
    creatOther(){
        for (let index = 0; index < 20; index++) {
            let charD:CharData=CharManager.Get().charDataPool.get();
            charD.initData();
            charD.radius=55;
            charD.angle=360*Core.Random.GetRandom();
            charD.ctrlType=ENUMS.CtrlType.AiCtrl;
            charD.autoStartAi=true;
            charD.pvpId=index+2;
            charD.position=CharManager.Get().getBrothPoint(charD.radius);
            let charOther:Character=CharManager.Get().getNewChar();
            charOther.init(charD);
    //        (charOther.ctrl as AIController).setDebug(true);
            //碰撞测试;
       //     charOther.charData.ShowHitBox(true);
        }
    }

    Update(dt: number)
    {
        //帧同步计算帧;
        if(this.frameSync){
            this.frameSync.update(dt);
            //摄像机算位置;
            CameraCtrl.Instance.PreUpdate(dt);
            //地图更新位置;
            MapManager.Get().Update(dt);
            //摄像机移动;
            CameraCtrl.Instance.Update(dt);
        }
    }
    FrameSyncUpdate(dt:number){
        //角色更新; 每次只处理一帧
     //   console.log("do FrameSyncUpdate");
        CharManager.Get().update(dt);
        MapManager.Get().UpdateTask(dt);
     //   console.log("getSeedIndex: ",Core.Random.getSeedIndex(),"frame:",Core.FrameSync.currRenderFrameId);
    }
    

    Release(): void {
       this.char=null;
      Core.UIMgr.CloseUI(UIEnum.UIJoystick);
      Core.UIMgr.CloseUI(UIEnum.UISkillBtn);
      Core.UIMgr.CloseUI(UIEnum.UIBackToLogin);

      CameraCtrl.Instance.reSet();

      this.frameSync.recycleSelf();
      this.frameSync=null;
      //回收所有对象;
      CharManager.recycleAll();
      MapManager.Get().recycleAll();
    }
}