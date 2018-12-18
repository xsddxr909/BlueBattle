import {ResType,EventType} from "../CoreDefine";
import Core from "../Core";
import {ResStruct} from "../util/ResourcesMgr";

export default class Scene
{
    protected m_sCurrentScene: string;
    public constructor()
    {
        this.preloadPrefab();
    }
    public RegisterEvent():void{
        Core.EventMgr.BindEvent(EventType.LoadSceneOver,this.OnLoadSceneCompleted,this);
    }
    /**
     * 初始化; 需要override
     */
    preloadPrefab():void{
      // Core.ResourcesMgr.AddLoadResByScene()

    }
    /***
     * 创建UI; 需要override
     */
    init(): void
    {
       

    }
    /***
     * 更新; 如果需要 就override
     */
    update(dt: number){


    }
   
    /**
     * 当前场景
     */
    public GetSceneName(): string
    {
        return this.m_sCurrentScene;
    }

    // 场景切换完成
    private OnLoadSceneCompleted(scene: string): void
    {
        cc.log(scene,'scene init!');
        this.init();
    }

    public Release(){
        Core.EventMgr.UnBindTarget(this);

    }
}   