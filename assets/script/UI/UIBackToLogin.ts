import BaseUI from "../../corelibs/uiframe/BaseUI";
import {UIType,UIShowMode} from "../../corelibs/uiframe/UIMgr";
import Core from "../../corelibs/Core";
import { SceneEnum } from "./UIenum";

/***
 *  UIBackToLogin 返回到登录界面
 */
export default class UIBackToLogin extends BaseUI
{
    constructor()
    {
        super(UIType.Normal,UIShowMode.Normal);
     //   this.needUpdate=true;
    }
    public Init(): void
    {
        super.Init();
       // let nodeSize = this.UINode.getContentSize();
     //   console.log("UISkillBtn: UINode getContentSize " +nodeSize.width,nodeSize.height);
        this.UINode.x = 80;
        this.UINode.y = Core.UIRoot.Canvas.height- 80;
        // 按钮点击
    }
    //注册事件；
    public RegisterEvent(): void
    {
        this.UINode.on(cc.Node.EventType.TOUCH_END,this.onBackTologin,this);
        super.RegisterEvent();
    }
     // 移除所有事件监听
     public UnRegisterEvent(): void
     {
        this.UINode.off(cc.Node.EventType.TOUCH_END,this.onBackTologin,this);
         super.UnRegisterEvent();
     }
    private onBackTologin(){
        //回到登录界面;
        Core.SceneMgr.SwitchScene(SceneEnum.LoginScene);
        console.log("onBackTologin: SwitchScene LoginScene " );
    }
    Display()
    {
      
        super.Display();
   
    }
    public Release():void{
        super.Release();
    }

}