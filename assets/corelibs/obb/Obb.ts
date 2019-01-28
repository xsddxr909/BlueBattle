import { RecycleAble } from "../util/Pool";
import Core from "../Core";
import { ResStruct } from "../util/ResourcesMgr";
import { ResType } from "../CoreDefine";
import { IObbBox, ColorBox, ColorBoxManager } from "./ColorBoxManager";

export class OBB extends RecycleAble implements IObbBox{  
      
    private  centerPoint:cc.Vec2=cc.Vec2.ZERO;  
    
    //原始偏移;
    private RoffsetX:number=0;
    private RoffsetY:number=0; 
    private offsetX:number;
    private offsetY:number;
    
    public offsetRotation:boolean=false;

    private  _width:number;  
      
    private  _height:number; 
   // private  extents:number[];
    // unit vector of x axis  
    private  axisX:cc.Vec2=cc.Vec2.ZERO;   
    // unit vector of y axis  
    private  axisY:cc.Vec2=cc.Vec2.ZERO;    
      

    // 0 -360  
    private rotation:number;   
    //弧度
    private _anlgel:number;   
    public scaleX:number=1;    
    public scaleY:number=1;    
      
    private isShowOpenTest:boolean=false;
    private testBody:ColorBox; 
    
   // private offsetAxisPointDistance:number;    
    
    /** 
    * Create default OBB 
    *  
    * @param x bornCenterX x 
    * @param y bornCenterY Y 
    * @param width 
    * @param height 
    */  
    public init(bornCenter:cc.Vec2, width:number, height:number,rotation:number,offsetX:number=0,offsetY:number=0):OBB{
        this._width  = width;  
        this._height = height;  
      //  this.extents=[this.width / 2, this.height / 2];
        this.scaleX = 1;  
        this.scaleY = 1;  
        this.RoffsetX=offsetX;
        this.RoffsetY=offsetY;
        this.setOffset(offsetX,offsetY);
        this.setRotation(rotation);  
        this.setCenter(bornCenter);  
        return this;
    }
      
      
    /** 
     * Get axisX and axisY projection radius distance on axis 
     */  
    public  getProjectionRadius(axis :cc.Vec2):number {  
        let nu:number=this._width / 2 * this.scaleX* Math.abs(axis.dot(this.axisX)) +this._height / 2  * this.scaleY* Math.abs(axis.dot(this.axisY));
        return nu;
    }  
    private  nv:cc.Vec2=cc.Vec2.ZERO;
    /** 
     * OBB is collision with other OBB 
     */  
    public  isCollision(obb:OBB):boolean {  
        // two OBB center distance vector  
        this.nv.x=this.x-obb.x;
        this.nv.y=this.y-obb.y;
    //    let nv:cc.Vec2 = this.centerPoint.sub(obb.centerPoint);
        if (this.getProjectionRadius(this.axisX) + obb.getProjectionRadius(this.axisX) <= Math.abs(this.nv.dot(this.axisX))) return false;
        if (this.getProjectionRadius(this.axisY) + obb.getProjectionRadius(this.axisY) <= Math.abs(this.nv.dot(this.axisY))) return false;
        if (this.getProjectionRadius(obb.axisX) + obb.getProjectionRadius(obb.axisX) <= Math.abs(this.nv.dot(obb.axisX))) return false;
        if (this.getProjectionRadius(obb.axisY) + obb.getProjectionRadius(obb.axisY) <= Math.abs(this.nv.dot(obb.axisY))) return false;
        return true;
    }  
      
      
    /** 
     * Set axis x and y by rotation 
     *  
     * @param rotation float 0 - 360  
     */  
    public  setRotation(rotation: number):OBB {  
        this.rotation = rotation;  
        //creator 新版本 旋转改成正的了;
        this._anlgel=rotation*Math.PI/180;
        this.axisX.x = Math.cos(this._anlgel);  
        this.axisX.y = Math.sin(this._anlgel);  
          
        this.axisY.x = - this.axisX.y;  
        this.axisY.y = this.axisX.x;  
        
        if(this.offsetRotation){
            this.RoffsetX= (this.offsetX*this.axisX.x-this.offsetY*this.axisX.y)*this.scaleX;
            this.RoffsetY= (this.offsetX*this.axisX.y+this.offsetY*this.axisX.x)*this.scaleY;
      //      console.log('RoffsetXy~~',this.RoffsetX,this.RoffsetY);
       //     console.log('anlgel~~',this.anlgel);
        }
     //   this.setCenter(this.centerPoint);  
  
        return this;  
    }  
      
    public get x(){
      return this.centerPoint.x+ this.RoffsetX;  
    }
    public get y(){
        return this.centerPoint.y+ this.RoffsetY;  
    }
    /** 
     * Set OBB center point and will add offsetAxis value 
     */  
    public  setCenter(piont:cc.Vec2):OBB {  
        this.centerPoint.x = piont.x ;  
        this.centerPoint.y = piont.y ;  
        return this;  
    }  

    /** 
     * Set OBB scale x, y 
     */  
    public setScale(scaleX:number, scaleY:number):OBB {  
        this.scaleX = scaleX;  
        this.scaleY = scaleY;           
        return this;  
    }  
     public setOffset(x:number,y:number){
       this.offsetX=x;
       this.offsetY=y;
     } 
      
    public  get angle():number {  
        return this.rotation;  
    }  
      
    public  getCenterX():number {  
        return this.centerPoint.x;  
    }  
      
    public  getCenterY():number {  
        return this.centerPoint.y;  
    }  
      
    public  get width():number {  
        return this._width * this.scaleX;  
    }  
      
    public  get height():number {  
        return this._height * this.scaleY;  
    }  
    public set width(value:number){
        this._width=value;
    }
    public set height(value:number){
        this._height=value;
    }
    /**
     * 打开碰撞测试
     * @param b 
     */
    ShowOpenTest(b:boolean , color:cc.Color=cc.Color.GREEN){
        if(b){
          if(this.testBody==null){
              this.testBody = ColorBoxManager.Get().showColorBox(this,color);
          }
        }else{
            if(this.testBody!=null){
                this.testBody.recycleSelf();
                this.testBody=null;
            }
        }
    }
    /**
     *释放 时候;
    **/ 
    onRecycle(): void {
        if(this.isShowOpenTest){
            if(this.testBody!=null){
                this.testBody.recycleSelf();
                this.testBody=null;
            }
            this.isShowOpenTest=false;
        }
        super.onRecycle();
    }  
    /**
    *回收; 
    **/ 
    Release(): void {
        if(this.testBody!=null){
            this.testBody.recycleSelf();
            this.testBody=null;
        }
        super.Release();
    }
}  