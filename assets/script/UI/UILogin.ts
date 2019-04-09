import BaseUI from "../../corelibs/uiframe/BaseUI";
import {UIType,UIShowMode} from "../../corelibs/uiframe/UIMgr";
import Core from "../../corelibs/Core";
import CoreConfig from "../../corelibs/CoreConfig";
import {TickMode,EventID, ResType} from "../../corelibs/CoreDefine";
import {ENUMS} from "../common/Enum";
import { SceneEnum } from "./UIenum";

/***
 *  UILogin 登陆界面
 */
export default class UILogin extends BaseUI
{
    private m_nbtnLogin: cc.Node = null;

    constructor()
    {
        super(UIType.Normal,UIShowMode.Normal);
    }
    public Init(): void
    {
        super.Init();
       // this.UINode.position =  Core.UIRoot.Canvas.position;
       this.UINode.getChildByName('bg').width =Core.UIRoot.Canvas.width;
       this.UINode.getChildByName('bg').height =Core.UIRoot.Canvas.height;
       
        // 按钮点击
        this.m_nbtnLogin = this.UINode.getChildByName('login_Btn');
        this.m_nbtnLogin.x=Core.UIRoot.Canvas.width/2;
    }
    
    //开始游戏
    private OnBtn_Start(event:cc.Event.EventTouch): void
    {
        console.log("OnBtn_Start: click " );
        //进入游戏
        Core.SceneMgr.SwitchScene(SceneEnum.GameScene)
    }
    // 服务器事件绑定 
    public RegisterEvent(): void
    {
        console.log("UILogin RegisterEvent "+this.m_nbtnLogin );
        this.m_nbtnLogin.on(cc.Node.EventType.TOUCH_END,this.OnBtn_Start,this);
        super.RegisterEvent();
    }
     // 移除所有事件监听
     public UnRegisterEvent(): void
     {
         this.m_nbtnLogin.off(cc.Node.EventType.TOUCH_END,this.OnBtn_Start,this);
         super.UnRegisterEvent();
     }
    Display()
    {
        super.Display();
   
    }
    public Release():void{
        super.Release();
        this.m_nbtnLogin=null;
    }
}