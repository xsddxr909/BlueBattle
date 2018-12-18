import {UIType,UIShowMode} from "../../corelibs/uiframe/UIMgr";
import Core from "../../corelibs/Core";
import {EventType} from "../../corelibs/CoreDefine";
import LoadingWinBase from "../../corelibs/UI/LoadingWinBase";
import CoreConfig from "../../corelibs/CoreConfig";

/***
 *  LoadingScreen 场景加载界面
 */
export default class LoadingWin extends LoadingWinBase
{

    constructor()
    {
        super(UIType.PopUp,UIShowMode.Normal);
    }
    InitUI(): void
    {
        // 进度条;
     //  this.UINode.position =  Core.UIRoot.Canvas.position;
        this.m_loginBar = this.UINode.getChildByName('loginBar');
        this.m_progess = this.m_loginBar.getChildByName('progess');
        this.m_number =this.m_loginBar.getChildByName('number').getComponent(cc.Label);
        this.m_icon =this.m_loginBar.getChildByName('icon')
        this.m_iconBeginPos=this.m_icon.position.x;
    }

}