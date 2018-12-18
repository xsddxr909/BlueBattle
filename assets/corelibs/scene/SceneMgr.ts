import Core from "../Core";
import Scene from "./Scene";
import { EventType } from "../CoreDefine";

export default class SceneMgr
{
    private m_sLastScene: string;
    private m_sCurrentScene: string;
    private currentScene:Scene;
    private m_mapScene: Map<string,Scene>;
    public constructor()
    {
        this.m_mapScene=new Map<string,Scene>();
        Core.EventMgr.BindEvent(EventType.LoadSceneOver,this.OnLoadSceneCompleted,this);
    }


    public Register(SceneName: string,Script:Scene )
    {
        if(this.m_mapScene.get(SceneName))
        {
            console.log("重复注册Scene,SceneName: " + SceneName);
            return;
        }
        this.m_mapScene.set(SceneName,Script);
    }

    public UnRegister(SceneName: string): void
    {
        let scene:Scene=this.m_mapScene.get(SceneName);
        if(scene)
        {
            scene.Release();
            this.m_mapScene.delete(SceneName);
        }
        else
        {
            console.log("Scene未被注册, SceneName: " + SceneName);
        }
    }



    /***
     * 切换场景
     */
    public SwitchScene(sceneName: string,callBack?: Function): void
    {
        if(sceneName == this.m_sCurrentScene)
        {
            cc.log("场景已加载，无需重复加载,scene name:",sceneName);
            return;
        }
        if(this.m_mapScene.get(sceneName)){
            this.m_mapScene.get(sceneName).RegisterEvent();
        }else{
            cc.log("场景不存在,scene name:",sceneName);
            return;
        }
        if(this.m_sCurrentScene){
            this.m_mapScene.get(this.m_sCurrentScene).Release();
        }
        this.currentScene=null;
        Core.ResourcesMgr.LoadScene(sceneName,callBack);

    }
    /**
     * 返回上一个场景
     */
    public BackToLastScene(callBack?: Function){
        if(this.m_sLastScene!=null){
            this.SwitchScene(this.m_sLastScene,callBack)
        }else{
            cc.log("上一个场景不存在,m_sCurrentScene name:",this.m_sCurrentScene);
        }
    }

    /**
     * 获取上一个场景名字
     */
    public GetLastScene(): string
    {
        return this.m_sLastScene;
    }


    /**
     * 当前场景
     */
    public GetCurrentScene(): string
    {
        return this.m_sCurrentScene;
    }

    // 场景切换完成
    private OnLoadSceneCompleted(scene:string): void
    {
        this.m_sLastScene = this.m_sCurrentScene;
        this.m_sCurrentScene = scene;
        this.currentScene=this.m_mapScene.get(this.m_sCurrentScene);
        cc.log(this.m_sCurrentScene,'scene loaded!');
    }

    /**
     * update()
     */
    update(dt: number): void
    {
      if(this.currentScene){
        this.currentScene.update(dt);
      }
    }

    Release(): void {
        this.m_mapScene.forEach(element => {
            if(element!=null){
                element.Release();
            }
        });
        this.m_mapScene=null;
        this.currentScene=null;
    }

}   