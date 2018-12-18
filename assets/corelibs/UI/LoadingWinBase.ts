import BaseUI from "../uiframe/BaseUI";
import {UIType,UIShowMode} from "../uiframe/UIMgr";
import Core from "../Core";
import {EventType} from "../CoreDefine";
import CoreConfig from "../CoreConfig";

/***
 *  LoadingWinBase 场景加载界面 
 * 需要重写 
 * 
 */
export default class LoadingWinBase extends BaseUI
{
    protected m_loginBar: cc.Node = null;
    //百分比
    protected m_progess :cc.Node =null;
    //数字
    protected m_number:cc.Label =null;
    //图标
    protected m_icon:cc.Node =null;
    protected m_iconBeginPos:number=0;
    public nowVal: number = 0;
    public allVal: number = 1;
    public isUpdate: boolean = false;

    constructor(type: UIType=UIType.PopUp,showMode: UIShowMode=UIShowMode.Normal)
    {
        super(type,showMode);
    }
    public Init(): void
    {
        super.Init();
        this.InitUI();
        this.update();
    }
    /**
     * 初始化绑定UI方法 有需要可以重写初始化UI;
     */
    InitUI(){
        // 进度条;
   //     this.UINode.position =  Core.UIRoot.Canvas.position;
        this.m_loginBar = this.UINode.getChildByName('loginBar');
        this.m_progess = this.m_loginBar.getChildByName('progess');
        this.m_number =this.m_loginBar.getChildByName('number').getComponent(cc.Label);
        this.m_icon =this.m_loginBar.getChildByName('icon')
        this.m_iconBeginPos=this.m_icon.position.x;
    }
    // 服务器事件绑定 
    public RegisterEvent(): void
    {
        Core.EventMgr.BindEvent(EventType.LoadProgress,this.OnLoadProgress,this);
        super.RegisterEvent();
    }
    // 移除所有事件监听
    public UnRegisterEvent(): void
    {
        super.UnRegisterEvent();
    }
    private OnLoadProgress(progress: Array<number>): void
    {
        this.nowVal = progress[0];
        this.allVal = progress[1];
        this.update();
    }
    private lastProgress: number = 0.0;
    /***
     * 更新方法 有需要可以重写;
     */
    update() 
    {
        if(this.UINode == null || this.UINode.active == false) return;

        let nowProgress: number = 1.0 * this.nowVal / this.allVal;

        if(nowProgress < this.lastProgress) nowProgress = this.lastProgress;

        this.m_progess.width = 600.0 * nowProgress;
        if(this.m_icon!=null){
            this.m_icon.x=this.m_iconBeginPos + 600 * nowProgress;
        }
        this.m_number.getComponent(cc.Label).string = Math.floor(100 * nowProgress + 0.5) + "%";

        if(this.nowVal >= this.allVal)
        {
            this.isUpdate = false;
        }
        this.lastProgress = nowProgress;
    }


    Display()
    {
        super.Display();

    }
    Release(){
         this.m_loginBar = null;
         this.m_progess  =null;
         this.m_number =null;
         this.m_icon =null;
        super.Release();
    }
 
}