/**
 * UIMgr
 * 
 * ui管理器
 * Register,UnRegister,ShowUI,CloseUI
 */
import BaseUI from "./BaseUI";
import Core from "../Core";
import {ResType} from "../CoreDefine";
import {ResStruct} from "../util/ResourcesMgr";
import { LoadingTextBase } from "../UI/LoadingTextBase";
import LoadingWinBase from "../UI/LoadingWinBase";

export default class UIMgr
{
    private m_mapUIPool: Map<string,BaseUI>;
     //正在显示的队列
    private m_mapShowingUI: Map<string,BaseUI>;
    //需要反向的队列；
    private m_arrReverseChangeUI: Array<BaseUI>;

    private m_mapUIMapping: Map<string,UIConfig>;
     //需要更新的队列；
     private m_updateUIList: Array<BaseUI>;
    constructor()
    {
        this.m_mapUIPool = new Map<string,BaseUI>();
        this.m_mapShowingUI = new Map<string,BaseUI>();
        this.m_arrReverseChangeUI = new Array<BaseUI>();
        this.m_mapUIMapping = new Map<string,UIConfig>();
        this.m_updateUIList =new Array<BaseUI>();
    }
    public init(){
        //如果需要重写 先UnRegister();
        Core.UIMgr.Register(UIEnumBase.LoadingWin,"prefabs/UI/LoadingWin",LoadingWinBase);
        Core.UIMgr.Register(UIEnumBase.LoadingText,"prefabs/UI/LoadingText",LoadingTextBase);

    }

    public Register(uiName: string,uiUrl: string,uiScript: new () => BaseUI)
    {
        if(this.m_mapUIMapping.get(uiName))
        {
            console.log("重复注册UI, UIName: " + uiName);
            return;
        }
        let uiConfig: UIConfig = new UIConfig();
        uiConfig.UIName = uiName;
        uiConfig.UIUrl = uiUrl;
        uiConfig.UIScript = uiScript;
        this.m_mapUIMapping.set(uiName,uiConfig);
    }

    public UnRegister(UIName: string): void
    {
        if(this.m_mapUIMapping.get(UIName))
        {
            this.m_mapUIMapping.delete(UIName);
        }
        else
        {
            console.log("UI未被注册, UIName: " + UIName);
        }
    }
    /**
     * 獲取UI面板
     * @param uiName 
     */
    public getUI(uiName: string): BaseUI
    {
        if(this.m_mapUIPool == null)
        {

            return null;
        }
        return this.m_mapUIPool.get(uiName);
    }

    public ShowUI(uiName: string,...args: any[]): BaseUI
    {
        let uiScript: BaseUI;
        // 已经加载
        if(this.m_mapUIPool.get(uiName))
        {
            uiScript = this.m_mapUIPool.get(uiName);
            if(uiScript.UINode != null)//资源没有加载完成
            {
                this.AddUIToRoot(this.m_mapUIPool.get(uiName),args);
            }
            return uiScript;
        }
        let uiConfig: UIConfig = this.m_mapUIMapping.get(uiName);
        if(!uiConfig) 
        {
            console.log("UI未被注册, UIName: " + uiConfig.UIName);
            return;
        }
        this.m_mapUIPool.set(uiName,new uiConfig.UIScript());
        uiScript = this.m_mapUIPool.get(uiName);
        uiScript.UIName = uiName;
        let isUIloading:Boolean=false;
        if(uiName==UIEnumBase.LoadingText){
            isUIloading=true;
        }else{
            Core.UIMgr.ShowUI(UIEnumBase.LoadingText);//打开loading界面
        }
        Core.ResourcesMgr.LoadRes(ResStruct.CreateRes(uiConfig.UIUrl,ResType.Prefab),function(res)
        {
            uiScript.UINode = cc.instantiate(res);
            uiScript.Init();
            this.AddUIToRoot(uiScript,args);
            Core.UIMgr.CloseUI(UIEnumBase.LoadingText);//关闭loading界面
        }.bind(this));

        return uiScript;
    }

    public CloseUI(uiName: string): void
    {
        let ui: BaseUI = this.m_mapUIPool.get(uiName);
        if(!ui) return;
        switch(ui.ShowMode)
        {
            case UIShowMode.Normal:
                if(this.m_mapShowingUI.get(uiName))
                {
                    ui.Hiding();
                    this.m_mapShowingUI.delete(ui.UIName);
                }
                break;
            case UIShowMode.ReverseChange:
              // Hiding();    (本UI窗体) 隐藏
             // Redisplay(); (上一个UI窗体) 重新显示
                let arrLen: number = this.m_arrReverseChangeUI.length;
                if(this.m_arrReverseChangeUI[arrLen - 1].UIName != uiName) return;
                if(arrLen >= 2)
                {
                    this.m_arrReverseChangeUI[arrLen - 1].Hiding();
                    this.m_arrReverseChangeUI.length = arrLen - 1;
                    this.m_arrReverseChangeUI[arrLen - 2].Redisplay();
                }
                else if(arrLen == 1)
                {
                    this.m_arrReverseChangeUI[0].Hiding();
                    this.m_arrReverseChangeUI.length = 0;
                }
                break;
            case UIShowMode.HideOther:
                if(this.m_mapShowingUI.get(uiName))
                {
                    ui.Hiding();
                    this.m_mapShowingUI.delete(ui.UIName);
                    this.m_mapShowingUI.forEach(function(baseUI: BaseUI)
                    {
                        baseUI.Redisplay();
                    });
                    this.m_arrReverseChangeUI.forEach(function(baseUI: BaseUI)
                    {
                        baseUI.Redisplay();
                    });
                }
                break;
        }
    }

    // 关闭所有ui
    public CloseAllUI(): void
    {
        if(this.m_arrReverseChangeUI.length)
        {
            for(let i: number = this.m_arrReverseChangeUI.length - 1;i >= 0;i--)
            {
                this.m_arrReverseChangeUI[i].Hiding();
            }
        }
        this.m_arrReverseChangeUI.length = 0;

        this.m_mapShowingUI.forEach(function(baseUI: BaseUI)
        {
            baseUI.Hiding();
        });
        this.m_mapShowingUI.clear();
    }
    public Release(){
        this.CloseAllUI();
        this.m_mapUIPool.forEach(function(baseUI: BaseUI)
        {
            baseUI.Release();
        });
        this.m_mapUIPool=null;
        this.m_mapShowingUI=null;
        this.m_arrReverseChangeUI=null;
        this.m_mapUIMapping=null;
        this.m_updateUIList=null;
    }
    
    public update(dt:number){
     //   console.log("UIMgr: update ");
        this.m_updateUIList.forEach(function(baseUI: BaseUI)
        {
            if(baseUI!=null){
    //            console.log("UIMgr: update  baseUI",baseUI);
                baseUI.update(dt);
            }
        });
    }
    public addUpdate(ui: BaseUI){
        if(this.m_updateUIList.indexOf(ui)<0){
            this.m_updateUIList.push(ui);
        }
    }
    public removeUpdate(ui: BaseUI){
        let idx= this.m_updateUIList.indexOf(ui);
        if(idx>=0){
            this.m_updateUIList.splice(idx,1);
        }
    }

    // 添加ui到ui根节点
    private AddUIToRoot(ui: BaseUI,args: any[] = null): void
    {
        cc.log("AddUIToRoot: "+ui.UIName);
        switch(ui.ShowMode)
        {
            case UIShowMode.Normal:
                if(!this.m_mapShowingUI.get(ui.UIName))
                {
                    this.m_mapShowingUI.set(ui.UIName,ui);
                    ui.Display(args);
                }
                break;
            case UIShowMode.ReverseChange:
                let arrLen: number = this.m_arrReverseChangeUI.length;
                //（上一个UI窗体）冻结
                if(arrLen > 0)
                {
                    this.m_arrReverseChangeUI[arrLen - 1].Freeze();
                }
                //（本UI窗体）显示
                ui.Display(args);
                this.m_arrReverseChangeUI.push(ui);
                break;
            case UIShowMode.HideOther:
                if(!this.m_mapShowingUI.get(ui.UIName))
                {
                    this.m_mapShowingUI.forEach(function(baseUI: BaseUI)
                    {
                        baseUI.Hiding();
                    });
                    this.m_arrReverseChangeUI.forEach(function(baseUI: BaseUI)
                    {
                        baseUI.Hiding();
                    });
                    this.m_mapShowingUI.set(ui.UIName,ui);
                    ui.Display(args);
                }
                break;
        }
    }
}

export class UIConfig
{
    public UIName: string;
    public UIUrl: string;
    public UIScript: new () => BaseUI;
}

export enum UIType
{
    //普通窗体
    Normal = 1,
     //固定窗体   
    Fixed = 2,
     //弹出窗体
    PopUp = 3,
    //系统提示弹框
    Toast =4,
}

export enum UIShowMode
{
    //开关自己
    Normal = 1,
      //反向切换 一般都大量引用于“弹出窗体”中。此类窗体的特点是：显示弹出窗体时不完全覆盖底层窗体，一般在屏幕的四周会露出底层窗体
    ReverseChange = 2,
    //隐藏其他界面
    HideOther = 3,
}

//TODO:缓存时间;
export enum UISaveTime
{
   //隐藏后 下次检测立刻销毁
    Imm = 0,
    //1mins
    Normal = 1,
      //5mins
    LONG = 5,
    //永不销毁; 一直缓存;
    Never = 9999,
}

export class UIEnumBase
{
    //场景切换界面
    public static  LoadingWin:string = 'LoadingWin';
    //UI加载文字 进度
    public static LoadingText:string  = 'LoadingText';
}