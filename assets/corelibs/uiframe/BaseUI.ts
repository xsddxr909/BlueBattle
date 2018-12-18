import Core from "../Core";
import {UIType,UIShowMode} from "./UIMgr";
import IRelease from "../interface/IRelease";

export const enum UI_LAYER
{
    UI = 10,
    MASK = 15,
    PopUp = 20,
    TOAST = 25,
}

export default class BaseUI implements IRelease
{
    private m_stUINode: cc.Node;
    private m_sUIName: string;

    private m_iUIType: UIType;
    private m_iUIShowMode: UIShowMode;
    private _showHandlerOnce: Function;
    private _closeHandlerOnce: Function;
    private _mask: cc.Graphics;
    private _bgColor: cc.Color;

    //是否需要update
    protected needUpdate:boolean=false;

    constructor(type: UIType,showMode: UIShowMode)
    {
        this.m_iUIType = type;
        this.m_iUIShowMode = showMode;
        this.m_stUINode = null;
    }

    /**
     * 设置UI显示回调(回调只执行一次 每次打开要重新设置)
     */
    public showHandlerOnce(handler: Function)
    {
        this._showHandlerOnce = handler;
    }

    /**
     * 设置UI关闭回调(回调只执行一次 每次关闭后要重新设置)
     */
    public closeHandlerOnce(handler: Function)
    {
        this._closeHandlerOnce = handler;
    }

    // 用于子类添加监听等初始化操作
    public Init(): void
    {
        // add
        if(this.m_iUIType == UIType.PopUp||this.m_iUIType == UIType.Toast)
        {
            this.m_stUINode.height =Core.UIRoot.Canvas.height;
            this.m_stUINode.width = Core.UIRoot.Canvas.width;
            this._bgColor = new cc.Color(0,32,54,180);
            this._mask = this.m_stUINode.addComponent(cc.Graphics);
        }

        this.m_stUINode.active = false;
        switch(this.m_iUIType)
        {
            case UIType.Normal:
                Core.UIRoot.Normal.addChild(this.m_stUINode);
                break;
            case UIType.Fixed:
                Core.UIRoot.Fixed.addChild(this.m_stUINode);
                break;
            case UIType.PopUp:
                Core.UIRoot.PopUp.addChild(this.m_stUINode);
                break;
            case UIType.Toast:
            Core.UIRoot.Toast.addChild(this.m_stUINode);
                break;
            default:
                console.log("can not find the UIType: " + this.m_iUIType + "in" + this.UIName);
                return;
        }
    }

    /***
     * 需要 override 重写
     * 添加网络事件
     * */ 
    public RegisterEvent(): void {
      if(this.needUpdate){
          Core.UIMgr.addUpdate(this);
      }
    }
    public update(dt:number):void{

    }

    // 移除所有事件监听
    public UnRegisterEvent(): void
    {
        if(this.needUpdate){
            Core.UIMgr.removeUpdate(this);
        }
        Core.EventMgr.UnBindTarget(this);
    }
     /***
     * 需要 override 重写
     * 销毁  需要放空对象引用 node  等
     * */ 
    public Release():void{
        this.Hiding();
        this.m_stUINode.removeComponent(this._mask);
        this.m_stUINode.destroy();
        this.m_stUINode=null;
    }

    // 显示
    public Display(args: any[] = null): void
    {
        this.RegisterEvent();
        this.m_stUINode.active = true;
        if(this.m_iUIType == UIType.PopUp)
        {
            this.m_stUINode.zIndex=UI_LAYER.PopUp;
            this.showMask();
        }else if (this.m_iUIType == UIType.Toast)
        {
            this.m_stUINode.zIndex=UI_LAYER.TOAST;
            this.showMask();
        }
        if(this._showHandlerOnce != null)
        {
            this._showHandlerOnce();
        }
        this._showHandlerOnce = null;
    }

    // 隐藏，不留在显示栈中
    public Hiding(): void
    {
        this.UnRegisterEvent();
        this.m_stUINode.active = false;
        if(this.m_iUIType == UIType.PopUp)
        {
            this.hideMask();
            this.m_stUINode.zIndex=0;
        }
        if(this._closeHandlerOnce != null)
        {
            this._closeHandlerOnce();
        }
        this._closeHandlerOnce = null;
    }

    // 重新显示
    public Redisplay(): void
    {
        this.RegisterEvent();
        this.m_stUINode.active = true;
        if(this.m_iUIType == UIType.PopUp)
        {
            this.showMask();
            this.m_stUINode.zIndex=UI_LAYER.PopUp;
        }
    }

    // 冻结，留在显示栈中
    public Freeze(): void
    {
        this.UnRegisterEvent();
        this.m_stUINode.active = true;
        if(this.m_iUIType == UIType.PopUp)
        {
            this.hideMask();
            this.m_stUINode.zIndex=0;
        }
    }

    private showMask(): void
    {
        this._mask.fillColor = this._bgColor;
        this._mask.rect(0,0,cc.view.getVisibleSize().width,cc.view.getVisibleSize().height);
        this._mask.fill();
        this._mask.node.on(cc.Node.EventType.TOUCH_END,this.touchHandler,this);//防止穿透  好弱鸡,居然连个禁止点击的属性都没有 反正我是没找到
    }

    private hideMask(): void
    {
        this._mask.clear(true);
        this._mask.node.off(cc.Node.EventType.TOUCH_END,this.touchHandler,this);//防止穿透  好弱鸡,居然连个禁止点击的属性都没有 反正我是没找到
    }

    public get UIName(): string 
    {
        return this.m_sUIName;
    }
    public get UINode(): cc.Node 
    {
        return this.m_stUINode;
    }

    public get Type(): UIType 
    {
        return this.m_iUIType;
    }
    public get ShowMode(): UIShowMode 
    {
        return this.m_iUIShowMode;
    }

    public set UIName(uiName: string) 
    {
        this.m_sUIName = uiName;
    }
    public set UINode(uiNode: cc.Node) 
    {
        this.m_stUINode = uiNode;
    }

    //防止穿透  好弱鸡,居然连个禁止点击的属性都没有 反正我是没找到
    private touchHandler(): void
    {

    }
}
