import Ticker from "./tick/Ticker";
import AudioMgr from "./sound/AudioMgr";
import Random from "./util/Random";
import ResourcesMgr from "./util/ResourcesMgr";
import NetMgr from "./net/NetMgr";
import EventMgr from "./event/EventMgr";
import ServerHandler from "./net/ServerHandler";
import SceneMgr from "./scene/SceneMgr";
import SdkHandleMgr from "./sdk/SdkHandleMgr";
import UIRoot from "./uiframe/UIRoot";
import UIMgr from "./uiframe/UIMgr";
import DelayTimer from "./tick/DelayTimer";
import HttpMgr from "./net/HttpMgr";
import HttpHandler from "./net/HttpHandler";
import {Platform} from "./platform/Platform";
import { MultiplePool } from "./util/Pool";
import { ColorBoxManager } from "./obb/ColorBoxManager";
import FrameSync from "./FrameSync";


export default class Core
{
    private static m_pInstance: Core;
    private static m_pRootNode: cc.Node;

    private static m_pTicker: Ticker;
    private static m_pAudioMgr: AudioMgr;
    private static m_pRandom: Random;
    private static m_pResourcesMgr: ResourcesMgr;
    // Event
    private static m_pEventMgr: EventMgr;

    // UIRoot
    private static m_pUIRoot: UIRoot;

    // UIMgr
    private static m_pUIMgr: UIMgr;

    // Net
    private static m_pNetMgr: NetMgr;
    private static m_pServerHandler: ServerHandler;

    //loadingUI
    private static m_pSceneMgr: SceneMgr;

    //SDK
    private static m_pSdkHandleMgr: SdkHandleMgr;

    //Http
    private static m_pHttpMgr: HttpMgr;
    private static m_pHttpHandler: HttpHandler;

    private static m_pPlatform: Platform;

    //Pool
    private static m_objectPool:MultiplePool;

    //帧率
    public static FrameRate:number=30;
    //秒为单位;
    public static deltaTime:number;

    private static mFrameSyn:FrameSync;

    public constructor()
    {
    }

    public static Get(): Core
    {
        if(null == Core.m_pInstance)
        {
            Core.m_pInstance = new Core();
        }
        return Core.m_pInstance;
    }

    public Init(): void
    {
        //两种对象池里选一个
        // ObjectPool.Init();  //弱类型对象池
       //  AutoObjectPool.Init();  //强类型对象池

        // Event
        Core.m_pEventMgr || (Core.m_pEventMgr = new EventMgr());

        // UIRoot
        Core.m_pUIRoot || (Core.m_pUIRoot = new UIRoot());

        // UIMgr
        if(!Core.m_pUIMgr){
           Core.m_pUIMgr = new UIMgr();
           Core.m_pUIMgr.init();
        };

        // 永续节点
        Core.m_pRootNode = cc.find("CoreRoot");
        if(!Core.m_pRootNode)
        {
            Core.m_pRootNode = new cc.Node();
            Core.m_pRootNode.name = "CoreRoot";
            cc.game.addPersistRootNode(Core.m_pRootNode);
        }
        Core.m_pRootNode.anchorX = Core.m_pRootNode.anchorY = 0;
        Core.m_pRootNode.zIndex = 0;

        // Updater
        //let com = Core.m_pRootNode.addComponent("Updater");

        // Net
        // Core.m_pNetMgr || (Core.m_pNetMgr = new NetMgr());
        // Core.m_pServerHandler || (Core.m_pServerHandler = new ServerHandler());
        // Core.m_pServerHandler.Init();
        // Core.m_pServerHandler.Register();

      //  Core.m_pTicker || (Core.m_pTicker = new Ticker(CoreConfig.GAME_FPS,CoreConfig.FIXED_LENGTH));
        Core.m_pAudioMgr || (Core.m_pAudioMgr = Core.m_pRootNode.addComponent(AudioMgr));
        Core.m_pResourcesMgr || (Core.m_pResourcesMgr = new ResourcesMgr());
         Core.m_pRandom || (Core.m_pRandom = new Random());
         Core.m_pRandom.Init(Math.random()*10000>>0);
        //UI 
        Core.m_pSceneMgr || (Core.m_pSceneMgr = new SceneMgr());
        //对象池;
        Core.m_objectPool ||(Core.m_objectPool =new MultiplePool());
        Core.m_objectPool.name="objectPool";
        // Core.m_ploadingUI || (Core.m_ploadingUI = new LoadingUI());
        //StepLock _Input

        //Core.m_pInputHandleMgr || (Core.m_pInputHandleMgr = new InputHandle());

        // //SDK
        // Core.m_pSdkHandleMgr || (Core.m_pSdkHandleMgr = new SdkHandleMgr());

        // //Http
        // Core.m_pHttpMgr || (Core.m_pHttpMgr = new HttpMgr());
        // Core.m_pHttpHandler || (Core.m_pHttpHandler = new HttpHandler());
        // Core.m_pHttpHandler.Init();

        // Core.m_pRandom.Init();

        // //发布平台.
        // Core.m_pPlatform || (Core.m_pPlatform = new Platform());

        Core.deltaTime=1/Core.FrameRate;
    }
    public static Release(){
        if( this.m_pSceneMgr){
            this.m_pSceneMgr.Release();
            this.m_pSceneMgr=null;
        }
        if(this.m_pUIMgr){
            this.m_pUIMgr.Release();
            this.m_pUIMgr=null;
        }
        if( this.m_pAudioMgr){
            this.m_pAudioMgr.destroy();
            this.m_pAudioMgr=null;
        }
        if(this.m_objectPool){
            this.m_objectPool.clearAll();
            this.m_objectPool=null;
        }
        if(this.m_pEventMgr){
            this.m_pEventMgr.Release();
            this.m_pEventMgr=null;
        }
        if(this.m_pUIRoot){
            this.m_pUIRoot.destroy();
            this.m_pUIRoot=null;
        }
        if(this.m_pRootNode){
            this.m_pRootNode.destroy();
            this.m_pRootNode=null;
        }
        if(this.m_pResourcesMgr){
            this.m_pResourcesMgr.ReleaseAll();
            this.m_pResourcesMgr=null;
        }
        if( this.m_pRandom){
            this.m_pRandom=null;
        }
 
    }

    public Update(dt: number): void
    {
        Core.m_pUIMgr.update(dt);
        Core.m_pSceneMgr.update(dt);
        ColorBoxManager.Get().update(dt);
    //    Core.m_pTicker.Signal(dt);
       

    }

    /**
     * 对外暴露
     */
    public static get EventMgr(): EventMgr
    {
        return Core.m_pEventMgr;
    }
    public static get UIRoot(): UIRoot
    {
        return Core.m_pUIRoot;
    }
    public static get UIMgr(): UIMgr
    {
        return Core.m_pUIMgr;
    }
    public static get NetMgr(): NetMgr
    {
        return Core.m_pNetMgr;
    }
    public static get FrameSync(): FrameSync
    {
        return Core.mFrameSyn;
    }
    public static set FrameSync(value:FrameSync)
    {
        Core.mFrameSyn=value;
    }
    public static get ServerHandler(): ServerHandler
    {
        return Core.m_pServerHandler;
    }
    public static get RootNode(): cc.Node
    {
        return Core.m_pRootNode;
    }
    public static get ResourcesMgr(): ResourcesMgr
    {
        return Core.m_pResourcesMgr;
    }
    public static get ObjectPoolMgr(): MultiplePool
    {
        return Core.m_objectPool;
    }
    // public static get InputHandleMgr(): InputHandle
    // {
    //     return Core.m_pInputHandleMgr;
    // }

    // public static get Ticker(): Ticker
    // {
    //     return Core.m_pTicker;
    // }
    //音效管理者
    public static get AudioMgr(): AudioMgr
    {
        return Core.m_pAudioMgr;
    }
    //场景管理者 切换场景  登陆场景 加载中场景 
    public static get SceneMgr(): SceneMgr
    {
        return Core.m_pSceneMgr;
    }
    public static get Random(): Random
    {
        return Core.m_pRandom;
    }
    public static get SdkHandleMgr(): SdkHandleMgr
    {
        return Core.m_pSdkHandleMgr;
    }
    public static get DelayTimer(): DelayTimer
    {
        return Core.m_pTicker.DelayTimer;
    }
    public static get HttpMgr(): HttpMgr
    {
        return Core.m_pHttpMgr;
    }
    public static get HttpHandler(): HttpHandler
    {
        return Core.m_pHttpHandler;
    }

    public static get Platform(): Platform
    {
        return Core.m_pPlatform;
    }
}