import BaseUI from "../../corelibs/uiframe/BaseUI";
import {UIType,UIShowMode} from "../../corelibs/uiframe/UIMgr";
import Core from "../../corelibs/Core";
import CoreConfig from "../../corelibs/CoreConfig";
import {TickMode,EventID, ResType} from "../../corelibs/CoreDefine";
import {ENUMS} from "../common/Enum";
import { SceneEnum } from "./UIenum";

/***
 *  UISkillBtn 技能按钮UI
 */
export default class UISkillBtn extends BaseUI
{
    private skill_1:cc.Node;
    private normal_Btn:cc.Node;
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
        this.UINode.x = Core.UIRoot.Canvas.width -80;
        this.UINode.y = 80;
        // 按钮点击
        this.skill_1 =this.UINode.getChildByName("skill_1");
        this.normal_Btn =this.UINode.getChildByName("normal_Btn");
    }
    //注册事件；
    public RegisterEvent(): void
    {
        this.skill_1.on(cc.Node.EventType.TOUCH_END,this.onUseSKill,this);
        this.normal_Btn.on(cc.Node.EventType.TOUCH_START,this.onSpeedUp,this);
        this.normal_Btn.on(cc.Node.EventType.TOUCH_END,this.onCloseSpeedUp,this);
        super.RegisterEvent();
    }
     // 移除所有事件监听
     public UnRegisterEvent(): void
     {
        this.skill_1.off(cc.Node.EventType.TOUCH_END,this.onUseSKill,this);
        this.normal_Btn.off(cc.Node.EventType.TOUCH_START,this.onSpeedUp,this);
        this.normal_Btn.off(cc.Node.EventType.TOUCH_END,this.onCloseSpeedUp,this);
         super.UnRegisterEvent();
     }
    private onSpeedUp(event:cc.Event.EventTouch){

        console.log("UISkillBtn: UINode onSpeedUp " );
    }
    private onCloseSpeedUp(event:cc.Event.EventTouch){

        console.log("UISkillBtn: UINode onSpeedUp " );
    }
    private onUseSKill(event:cc.Event.EventTouch){

        console.log("UISkillBtn: UINode onUseSKill " );
    }
    Display()
    {
      
        super.Display();
   
    }
    public Release():void{
        super.Release();
        this.skill_1=null;
        this.normal_Btn=null;
    }

}