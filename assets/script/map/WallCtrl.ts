import { RecycleAbleComponent } from "../../corelibs/util/Pool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WallCtrl extends RecycleAbleComponent {
    //墙壁顶部的精灵
    wallTopSpr:cc.Sprite = null;
    //墙壁身体的精灵
    wallBottomSPr:cc.Sprite = null;
    //墙壁阴影的精灵
    wallShadowSpr:cc.Sprite = null;

    onLoad()
    {
         //创建资源;
         this.wallTopSpr=this.node.getChildByName('wall_top').getComponent(cc.Sprite);
         this.wallBottomSPr=this.node.getChildByName('wall_bottom').getComponent(cc.Sprite);
         this.wallShadowSpr= this.wallBottomSPr.node.getChildByName('wall_shadow').getComponent(cc.Sprite);
    }

    //设置墙壁落地尺寸
    public static get unitWidth() {
        return 66;
    }
    public static get unitHeight() {
        return 112;
    }


    //初始化
    initialize(pos:cc.Vec2,width?:number,height?:number) {
        //使用uv tiled的方式来设置墙壁纹理。
        this.node.position = pos;
        this.node.zIndex = -pos.y;
        this.wallShadowSpr.node.parent = this.node.parent;
        this.wallShadowSpr.node.position = pos;
        this.wallShadowSpr.node.zIndex = 2;
        if(width !== null && width !== undefined){
            this.wallTopSpr.node.width = width;
        }
        if(height !== null && height !== undefined){
            this.wallTopSpr.node.height = height;
        }
        this.wallShadowSpr.node.width = this.wallTopSpr.node.width;
        this.wallBottomSPr.node.width = this.wallTopSpr.node.width;
    }

     /**
     *需要重写 
     **/ 
    onRecycle(): void {
       super.onRecycle();
    }  
    /**
     *需要重写 
     **/ 
    Release(): void {
        this.wallTopSpr=null;
        this.wallShadowSpr=null;
        this.wallBottomSPr=null;
        super.Release();
    }
}
