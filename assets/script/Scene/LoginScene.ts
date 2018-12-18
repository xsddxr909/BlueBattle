import Scene from "../../corelibs/scene/Scene";
import Core from "../../corelibs/Core";
import { ResStruct } from "../../corelibs/util/ResourcesMgr";
import { ResType } from "../../corelibs/CoreDefine";
import { SceneEnum, UIEnum } from "../UI/UIenum";

/**
 * 登录场景
 */
export default class LoginScene extends Scene
{
    constructor()
    {
        super();
        this.m_sCurrentScene="LoginScene";
    }
    /**
     * 初始化; 需要override
     */
    preloadPrefab():void{
        cc.log("LoginScene preloadPrefab");
       Core.ResourcesMgr.AddLoadResByScene(ResStruct.CreateRes("prefabs/Scene/LoginScene",ResType.Prefab,true),SceneEnum.LoginScene);

    }
    /***
     * 创建UI; 创建场景;
     */
    init(): void
    {
       Core.UIMgr.ShowUI(UIEnum.UILogin);

    }
    /***
     * 更新; 如果需要 就override
     */
    update(dt: number){
//        cc.log("LoginScene update");
      super.update(dt);


    }
   

    public Release(){
      Core.UIMgr.CloseUI(UIEnum.UILogin);
      super.Release();
    }
}   