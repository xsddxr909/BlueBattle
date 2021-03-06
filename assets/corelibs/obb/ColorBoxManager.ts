import { RecycleAble, ListDataPool } from "../util/Pool";
import Core from "../Core";
import { ResStruct } from "../util/ResourcesMgr";
import { ResType } from "../CoreDefine";
import { IQuadRect } from "../util/QuadTree";

/**
 * 碰撞数据显示管理器
 */
export class ColorBoxManager
{
    
    public constructor()
    {
    }
    private static m_pInstance: ColorBoxManager;
    public static Get(): ColorBoxManager
    {
        if(null == ColorBoxManager.m_pInstance)
        {
            ColorBoxManager.m_pInstance = new ColorBoxManager();
            ColorBoxManager.m_pInstance.init();
        }
        return ColorBoxManager.m_pInstance;
    }
    public static debug:boolean=true;
    public boxList:ListDataPool<ColorBox>=null;
    private onList:Array<ColorBox>=null;    

    private  inited:boolean=false;
 
    public  init():void
    {
        if(this.inited)return;
        this.boxList=new ListDataPool<ColorBox>(()=>new ColorBox());
        this.onList=this.boxList.getOnList();
        this.inited=true;  
    }
    public showColorBox(target:IObbBox, color:cc.Color=cc.Color.GREEN,noRot:boolean=false,opacity:number=100):ColorBox{
       let box: ColorBox =  this.boxList.get();
       box.noRot=noRot;
       box.opacity=opacity;
       box.ShowOpenTest(true,target,color);
       return box;
    }
    public  update(dt:number){
        for (let i = 0, len:number=this.onList.length; i < len; i++) {
            this.onList[i].Update(dt);
        }
    }
 
    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(label:cc.Label){
        if(ColorBoxManager.debug){
     //     label.string+=CharManager.Get().actionPool.toString();
        }
    }
}

export class ColorBox extends RecycleAble{  
      
    private isShowOpenTest:boolean=false;
    private testBody:cc.Node; 
    private color:cc.Color;
    private target:IObbBox;
    public noRot:boolean=false;
    public opacity:number=100;
    /**
     * 打开碰撞测试
     * @param b 
     */
    ShowOpenTest(b:boolean , target:IObbBox=null, color:cc.Color=cc.Color.GREEN){
        if(b){
          if(this.isShowOpenTest){
              return;
          }
          if(target!=null){
            this.target=target;
          }
          this.color=color;
          this.isShowOpenTest=true;
          Core.ResourcesMgr.LoadRes(ResStruct.CreateRes("core/Obb_Box",ResType.Prefab),this.onload.bind(this));
        }else{
            this.noRot=false;
            this.isShowOpenTest=false;
            if(this.testBody!=null){
                this.testBody.destroy();
                this.testBody=null;
            }
        }
    }
    private onload(res:any){
        if(this.isShowOpenTest==false){
            return;
        }
        this.testBody=cc.instantiate(res);
        this.testBody.x=this.target.x;
        this.testBody.y=this.target.y;
        this.testBody.width=this.target.width;
        this.testBody.height=this.target.height;
        if(!this.noRot){
            this.testBody.angle=this.target.angle;
        }
         this.testBody.color=this.color;
         this.testBody.scaleX=this.target.scaleX;
         this.testBody.scaleY=this.target.scaleY;
         this.testBody.opacity=100;
         //临时测试用
         cc.find('Canvas/Test').addChild(this.testBody);
    }
    Update(dt:number){
        if(!this.isShowOpenTest){
            return;
        }
        if( this.testBody==null){
          return;
        }
        this.testBody.x=this.target.x;
        this.testBody.y=this.target.y;
        this.testBody.width=this.target.width;
        this.testBody.height=this.target.height;
        if(!this.noRot){
            this.testBody.angle=this.target.angle;
        }
   //     this.testBody.color=this.color;
        this.testBody.scaleX=this.target.scaleX;
        this.testBody.scaleY=this.target.scaleY;
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        if(this.isShowOpenTest){
            this.ShowOpenTest(false);
        }
        super.onRecycle();
    }  
    /**
    *回收; 
    **/ 
    Release(): void {
        if(this.testBody!=null){
            this.testBody.destroy();
            this.testBody=null;
        }
        this.noRot=false;
        this.isShowOpenTest=false;
        super.Release();
    }
}  
export  interface IObbBox
{
    x:number;
    y:number;
    width:number;
    height:number;
    angle:number;
    scaleX:number;
    scaleY:number;
}