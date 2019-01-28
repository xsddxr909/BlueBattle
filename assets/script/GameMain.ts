import Core from "../corelibs/Core";
import {ResStruct} from "../corelibs/util/ResourcesMgr";
import {ResType} from "../corelibs/CoreDefine";
import { UIEnum, SceneEnum } from "./UI/UIenum";
import UILogin from "./UI/UILogin";
import LoadingWin from "./UI/LoadingWin";
import { ConfigData } from "./ConfigData";
import LoginScene from "./Scene/LoginScene";
import GameScene from "./Scene/GameScene";
import UIJoystick from "./UI/UIJoystick";
import UISkillBtn from "./UI/UISkillBtn";
import { ConfigXls } from "./data/ConfigXls";
import { CharManager } from "./char/manager/CharManager";
import MapManager from "./map/MapManager";
import UIBackToLogin from "./UI/UIBackToLogin";
import { BehaviorTreeManager } from "../corelibs/behaTree/BehaviorTreeManager";
import { UseSkillAct, SetStateAct, FollowTargetAct, FinTargetAct, FinHateTargetAct, FinTargetBackFormMeAct, MoveToGemAct, RandomMoveAct, DelTargetAct } from "./char/beha/GameActionBeha";
import {  AiStateCondition, HasTargetCondition, SomeOneCloseMeCondition, ChkActionCondition } from "./char/beha/GameConditionBeha";

/**
 * 初始场景
 * @author xsddxr909
 */
const {ccclass} = cc._decorator;

@ccclass
export default class GameMain extends cc.Component
{
    private logLabel:cc.Label
    onLoad() 
    {
        // cc.director.setDisplayStats(false);
        //自适应
       // cc.find('Canvas').getChildByName("backGround").width = cc.view.getVisibleSize().width;
       // cc.find('Canvas').getChildByName("backGround").height = cc.view.getVisibleSize().height;
    }
    
    start()
    {
        // 初始化游戏核心库
        Core.Get().Init();
        ConfigData.init();
        
        this.getLog();
        this.Register();
        // this.linkManager = new LinkManager();
        // Core.SdkHandleMgr.Init();
        // Core.Platform.m_stPlatfrom.Login();
        this.initLoadingScreen();
    }
    getLog(){
        this.logLabel= cc.find('PoolLog').getComponent(cc.Label);
        this.logLabel.node.zIndex=1000;
    }
    /**
     * 需要注册的UI;
     */
    Register():void
    {
        //UI注册;
        Core.UIMgr.UnRegister(UIEnum.LoadingWin);
        Core.UIMgr.Register(UIEnum.LoadingWin,"prefabs/UI/LoadingWin",LoadingWin);
        Core.UIMgr.Register(UIEnum.UILogin,"prefabs/Scene/LoginScene",UILogin);
        Core.UIMgr.Register(UIEnum.UIJoystick,"prefabs/UI/joystick",UIJoystick);
        Core.UIMgr.Register(UIEnum.UISkillBtn,"prefabs/UI/SkillBtn",UISkillBtn);
        Core.UIMgr.Register(UIEnum.UIBackToLogin,"prefabs/UI/backBtn",UIBackToLogin);
        
        //Scene注册;
        Core.SceneMgr.Register(SceneEnum.LoginScene,new LoginScene());
        Core.SceneMgr.Register(SceneEnum.GameScene,new GameScene());

        //行为树注册;

        //condition
        BehaviorTreeManager.Get().Register("AiState",AiStateCondition);
        BehaviorTreeManager.Get().Register("HasTarget",HasTargetCondition);
        BehaviorTreeManager.Get().Register("SomeOneCloseMe",SomeOneCloseMeCondition);
        BehaviorTreeManager.Get().Register("chkAction",ChkActionCondition);
        
        //act
        BehaviorTreeManager.Get().Register("SetState",SetStateAct);
        BehaviorTreeManager.Get().Register("FollowTarget",FollowTargetAct);
        BehaviorTreeManager.Get().Register("UseSkill",UseSkillAct);
        BehaviorTreeManager.Get().Register("FinTarget",FinTargetAct);
        BehaviorTreeManager.Get().Register("FinHateTarget",FinHateTargetAct);
        BehaviorTreeManager.Get().Register("FinTargetBackFormMe",FinTargetBackFormMeAct);
        BehaviorTreeManager.Get().Register("MoveToGem",MoveToGemAct);
        BehaviorTreeManager.Get().Register("RandomMove",RandomMoveAct);
        BehaviorTreeManager.Get().Register("DelTarget",DelTargetAct);
    }
    /**
     * 加载动画
     */
    private initLoadingScreen(): void
    {
        ConfigXls.Get().init();
        //加载开始游戏时需要用到的资源
        let arr_str = new Array<ResStruct>();
        arr_str.push(ResStruct.CreateRes("prefabs/UI/LoadingText",ResType.Prefab));
        arr_str.push(ResStruct.CreateRes("prefabs/UI/LoadingWin",ResType.Prefab));
        
        Core.ResourcesMgr.LoadResArray(arr_str,() =>
        {
            //显示加载界面 
            Core.SceneMgr.SwitchScene(SceneEnum.LoginScene);
            //获取本地地址;
      //      this.getLocationAddress();
        });
    }



    /**
     * 全局update()
     */
    update(dt: number): void
    {
        Core.Get().Update(dt);
        if(ConfigData.debug&&this.logLabel!=null){
            this.logLabel.string="";
            CharManager.logUpdate(this.logLabel);
            this.logLabel.string+=Core.ObjectPoolMgr.toString();
    //      ConfigData.logUpdate(this.logLabel);
        }
    }



     /**
     * 获取本地地址
     */
    private getLocationAddress(): void
    {
        // if(cc.sys.platform != cc.sys.WECHAT_GAME)
        //     return ;
        let result: number;
        let httpReq: XMLHttpRequest = new XMLHttpRequest();
        httpReq.open("GET","https://pv.sohu.com/cityjson?ie=utf-8");
        httpReq.onload = () =>
        {
            if(httpReq.status == 200)
            {
                // for(let a: number = 0;a < ConfigData.shieldCityName.length;a++)
                // {
                //     result = httpReq.responseText.indexOf(ConfigData.shieldCityName[a]);
                //     if(result != -1)//模糊搜索
                //     {
                //       //  All.isCanResur = false;
                //         break;//只要找到一个就行了
                //     }
                // }
                ConfigData.Mylocal=httpReq.responseText;
            }
            else
            {
              //  All.isCanResur = false;
            }
            console.log("地理位置信息:",httpReq.responseText);
        }
        httpReq.onerror = () =>
        {
        //    All.isCanResur = false;
            console.log("网络连接失败!地理位置信息");
        }
        httpReq.send();
    }

    /**
     * 网络连接断开时弹出UI框;主动点击重新连接;
     */
    private DownConnect(): void 
    {
        Core.UIMgr.ShowUI('UINet');
    }
    onDestroy(){
        CharManager.Release();
        MapManager.Release();
        Core.Release();
    }

}
