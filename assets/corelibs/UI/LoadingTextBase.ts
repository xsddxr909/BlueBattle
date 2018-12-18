import BaseUI from "../uiframe/BaseUI";
import {UIType,UIShowMode} from "../uiframe/UIMgr";
import Core from "../Core";

/**
 * 资源加载界面  以后做多语言 可以替换上面文字 label
 * @author xsddxr909
 * 2018年11月21日 11:37:05
 */
export class LoadingTextBase extends BaseUI
{
    constructor()
    {
        super(UIType.PopUp,UIShowMode.Normal);
    }

    Init(): void
    {
        super.Init();
    }

    Display(): void
    {
        super.Display();
    }

    public Release():void{
        super.Release();
    }
}