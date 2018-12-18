import {UI_LAYER} from "../uiframe/BaseUI";
import Core from "../Core";

/**
 * 系统提示框(全局方法)
 * @author zhouyulong
 * 2018年5月16日 11:02:18
 */
export function showToast(context: string): void
{
    new Toast().show(context);
}

/**
 * 系统提示框
 * @author zhouyulong
 * 2018年5月16日 11:02:18
 */
export class Toast
{
    /**透明度 */
    private readonly OPACITY_VALUE: number = 4;
    /**起始高度*/
    private readonly BEGIN_Y = 0.4;
    /**文本*/
    private label: cc.Label;
    /**容器*/
    private root: cc.Node;
    /**舞台宽度 */
    private stageWidth: number;
    /**舞台高度 */
    private stageHeight: number;

    constructor()
    {
        //初始化
        this.root = new cc.Node();
        this.label = this.root.addComponent("cc.Label");
        this.stageWidth = cc.view.getFrameSize().width;
        this.stageHeight = cc.view.getFrameSize().height;
    }

    /**
     * 显示
     */
    public show(context: string): void
    {
        this.root.y = 0;
        this.root.opacity = 255;
        this.label.string = context;
        this.root.zIndex=UI_LAYER.TOAST;
        Core.UIRoot.PopUp.addChild(this.root);
        this.root.x = 0;
        this.root.y = this.stageHeight * this.BEGIN_Y;
        let repeat: number = Math.ceil(255 / this.OPACITY_VALUE);

        let tempValue: number = 0;
        this.label.schedule(() =>
        {
            tempValue++;
            this.root.y += 3;
            if(this.root.opacity - this.OPACITY_VALUE > 0)
            {
                this.root.opacity -= this.OPACITY_VALUE;
            }
            if(tempValue + 1 >= repeat)
            {
                this.hide();
            }
        },0.03,repeat,1.5);
    }

    /**
     * 隐藏
     */
    public hide(): void
    {
        if(this.root.parent != null)
        {
            this.root.parent.removeChild(this.root);
        }
    }
}