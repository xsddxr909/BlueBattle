import CameraCtrl from "../logic/CameraCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundCtrl extends cc.Component {
    //地板节点
    @property(cc.Node)
    ground:cc.Node = null;

    //左侧地板节点
    @property(cc.Node)
    outerLeft:cc.Node = null;

    //右侧地板节点
    @property(cc.Node)
    outerRight:cc.Node = null;

    //上方地板节点
    @property(cc.Node)
    outerUp:cc.Node = null;

    //下方地板节点
    @property(cc.Node)
    outerDown:cc.Node = null;

    @property(cc.Color)
    //墙壁外的颜色
    defultColor:cc.Color = cc.color(155,155,155,255);
    @property(cc.Color)
    //墙壁外的颜色
    defultOutColor:cc.Color = cc.color(10,7,31,255);

    init(){
        let size:cc.Size=CameraCtrl.Instance.getBoundingBox().size;
        this.ground.width=size.width;
        this.ground.height=size.height;
    }

    //地板变黑
    showDark() {
        this.ground.color = this.defultColor;
        this.outerLeft.color= this.defultColor;
        this.outerRight.color= this.defultColor;
        this.outerUp.color= this.defultColor;
        this.outerDown.color= this.defultColor;
    }

    //隐藏变黑
    hideDark() {
        this.ground.color = cc.Color.WHITE;
        this.outerLeft.color= this.defultOutColor;
        this.outerRight.color= this.defultOutColor;
        this.outerUp.color= this.defultOutColor;
        this.outerDown.color= this.defultOutColor;
    }

}
