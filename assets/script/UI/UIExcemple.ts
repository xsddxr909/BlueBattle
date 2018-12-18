import BaseUI from "../../corelibs/uiframe/BaseUI";
import {UIType,UIShowMode} from "../../corelibs/uiframe/UIMgr";
import Core from "../../corelibs/Core";
import CoreConfig from "../../corelibs/CoreConfig";
import {TickMode,EventID, ResType} from "../../corelibs/CoreDefine";
import {ENUMS} from "../common/Enum";

/***
 *  UI 例子
 */
export default class UIExcemple extends BaseUI
{
    private m_nbtnStart: cc.Node = null;

    constructor()
    {
        super(UIType.Normal,UIShowMode.Normal);
    }
    public Init(): void
    {
        super.Init();
     //   this.UINode.position =  Core.UIRoot.Canvas.position;
        // 按钮点击
        this.m_nbtnStart = this.UINode.getChildByName('btn_start');
    }
    
    // 自定义事件响应方法
    private OnBtn_Start(): void
    {
        
    }
    // 服务器事件绑定 
    public RegisterEvent(): void
    {
        this.m_nbtnStart.on(cc.Node.EventType.TOUCH_END,this.OnBtn_Start,this);
        super.RegisterEvent();
    }
    // 移除所有事件监听
    public UnRegisterEvent(): void
    {
        this.m_nbtnStart.off(cc.Node.EventType.TOUCH_END,this.OnBtn_Start,this);
        super.UnRegisterEvent();
    }
    Display()
    {
        super.Display();
    }

    /***
     * 若果需要更新 可以重写 this.needUpdate=true
     */
    public update(dt:number):void{


        super.update(dt);
     }
 
    public Release():void{
        super.Release();
        this.m_nbtnStart=null;
    }
}