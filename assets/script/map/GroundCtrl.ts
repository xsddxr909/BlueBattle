import CameraCtrl from "../logic/CameraCtrl";
import WallCtrl from "./WallCtrl";
import { ConfigData } from "../ConfigData";

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

    private oldWidth:number;
    private oldHeight:number
    init(){
        let size:cc.Size=CameraCtrl.Instance.getBoundingBox().size;
        this.oldWidth=this.ground.width=size.width;
        this.oldHeight=this.ground.height=size.height;
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
    public UpdateRect(rect:cc.Rect){
        if(this.oldWidth!=rect.width||this.oldHeight!=rect.height){
            this.oldHeight= this.ground.height=rect.height;
            this.oldWidth= this.ground.width=rect.width;
            this.outerLeft.height=rect.height;
            this.outerLeft.x=-rect.width/2;
            this.outerRight.height=rect.height;
            this.outerRight.x=rect.width/2;
            this.outerUp.width=rect.width;
            this.outerUp.y=rect.height/2;
            this.outerDown.width=rect.width;
            this.outerDown.y=-rect.height/2;
        }
        // //更新四个方向的地板颜色宽度
         this.outerLeft.width = Math.max(0, -WallCtrl.unitWidth/2 - rect.xMin);
         this.outerRight.width = Math.max(0, rect.xMax -ConfigData.gameMapSize.width- WallCtrl.unitWidth/2);
         this.outerDown.height = Math.max(0, - WallCtrl.unitHeight -  rect.yMin) ;
         this.outerUp.height = Math.max(0, rect.yMax  -ConfigData.gameMapSize.height - WallCtrl.unitHeight/2 );
    }

}
