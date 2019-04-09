import Scene from "../../corelibs/scene/Scene";
import Core from "../../corelibs/Core";
import { ResStruct } from "../../corelibs/util/ResourcesMgr";
import { ResType } from "../../corelibs/CoreDefine";
import { SceneEnum } from "../UI/UIenum";
import GameLogic from "../logic/GameLogic";

/**
 * 游戏场景
 */
export default class GameScene extends Scene
{
    //游戏逻辑类;
    private logic:GameLogic;

    constructor()
    {
        super();
        this.m_sCurrentScene="GameScene";
    }
    /**
     * 初始化; 需要override
     */
    preloadPrefab():void{
        cc.log("GameScene preloadPrefab");
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/battle/WallCtrl",ResType.Prefab,true),SceneEnum.GameScene);
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/battle/TerrainTexCtrl",ResType.Prefab,true),SceneEnum.GameScene);
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/battle/GroundCtrl",ResType.Prefab,true),SceneEnum.GameScene);
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/battle/char",ResType.Prefab,true),SceneEnum.GameScene);
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/battle/baoshi",ResType.Prefab,true),SceneEnum.GameScene);
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/battle/baoshi2",ResType.Prefab,true),SceneEnum.GameScene);
       //ai
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("behavior/char/charAi.json",ResType.JsonAsset,false),SceneEnum.GameScene);
    }
    /***
     * 创建UI; 创建场景;
     */
    init(): void
    {
      cc.log("GameScene begin init");
      this.logic=new GameLogic();
    }

    
    /***
     * 游戏内更新
     */
    update(dt: number){
  //   cc.log("GameScene update");
      super.update(dt);
      this.logic.Update(dt);
    }

    public Release(){
      if(this.logic!=null){
          this.logic.Release();
          this.logic=null;
      }
      super.Release();
    }
}   