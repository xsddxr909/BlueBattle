import { RecycleAbleComponent } from "../../corelibs/util/Pool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TerrainTexCtrl extends RecycleAbleComponent {
    //纹理图集
    @property(cc.SpriteAtlas)
    public  atlas:cc.SpriteAtlas = null;
    texSpr:cc.Sprite = null;

    onLoad()
    {
         //创建资源;
         this.texSpr=this.node.getChildByName('TexSpr').getComponent(cc.Sprite);
         this.node.zIndex=1;
    }

    //初始化
    initialize(spName:string) {
        //设置地块的纹理
        this.texSpr.spriteFrame = this.atlas.getSpriteFrame(spName);
    }

    //设置地块的颜色
    updateTexColor(color:cc.Color) {
        this.texSpr.node.color = color;
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
        this.atlas=null;
        this.texSpr=null;
        super.Release();
    }

}
