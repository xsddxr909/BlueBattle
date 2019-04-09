import { RecycleAble } from "../../corelibs/util/Pool";
import { CharManager } from "../char/manager/CharManager";
import Core from "../../corelibs/Core";
import { ResMap } from "./ResMap";
import { PosData } from "../data/PosData";
import { ConfigData } from "../ConfigData";
import { CharData } from "../data/CharData";
import { type } from "os";
import { GemData } from "../data/GemData";
import { ENUMS } from "../common/Enum";
import { Gem } from "../char/Gem";


/**
 *  资源区域模块;
 *  
 */
export class ResScreen extends RecycleAble
{
    private screenId:number;
    //显示对象根节点;
    private resMap: ResMap;
    
    private gemList:Array<PosData>;
    
    private charList:Array<PosData>;
    private x:number;
    private z:number;
    private gemReflushTime:number;

    constructor()
    {
        super();
        this.gemList=new Array<PosData>();
        this.charList=new Array<PosData>();
    }
    /**
     * 层级;
     */
    public init(resMap:ResMap,x:number,z:number){
        this.resMap=resMap;
        this.x=x;
        this.z=z;
        this.gemList.length=0;
        this.charList.length=0;
        this.screenId = z * resMap.gridWidth + x + 1;
        this.gemReflushTime=ConfigData.gemReflushTime;
    }
    
    enterScreen(data: PosData): any {
        let idx:number=-1;
        switch(data.poolname){
            case "CharData":
             idx =this.charList.indexOf(data);
             if(idx<0){
                this.charList.push(data);
                data.screenId=this.screenId;
             }
            break;
            case "GemData":
             idx =this.gemList.indexOf(data);
             if(idx<0){
                this.gemList.push(data);
                data.screenId=this.screenId;
             }
            break;
        }
    }
    leaveScreen(data: PosData): any {
        let idx:number=-1;
        switch(data.poolname){
            case "CharData":
             idx =this.charList.indexOf(data);
             if(idx>=0){
                this.charList.splice(idx,1);
                data.screenId=-1;
             }
            break;
            case "GemData":
             idx =this.gemList.indexOf(data);
             if(idx>=0){
                this.gemList.splice(idx,1);
                data.screenId=-1;
             }
            break;
        }
    }
    private addGemCount:number=0;
    private leftTime:number=0;
    UpdateTask(nowTime:number){
        this.leftTime=nowTime-this.gemReflushTime;
    //    console.log("UpdateTask leftTime",this.leftTime);
        if( this.leftTime>ConfigData.gemReflushTime){
            //刷新；
            this.addGemCount=ConfigData.map_max_Gem-this.gemList.length;
      //      console.log("UpdateTask addGemCount",this.addGemCount,ConfigData.map_max_Gem,this.gemList.length);
            if(this.addGemCount>=1){
         //       console.log("UpdateTask creatGem");
                this.creatGem();
                this.gemReflushTime+=ConfigData.gemReOneflushTime;
            }else if( this.addGemCount<=0){
                this.gemReflushTime=nowTime;
            }
        }
    }
    private creatGem(){
        let gemD:GemData=Core.ObjectPoolMgr.get(GemData,"GemData");
        //  console.log("gemD position",gemD.position);
        gemD.initData();
        if(Core.Random.GetRandom()>0.9){
             gemD.itemType=2;
         }else{
            gemD.itemType=1;
        }
        gemD.position=this.getGemBrothPoint(gemD.radius);
        let gem:Gem=CharManager.Get().gemPool.get();
        gem.init(gemD);
    }
    public  getScreenCharCount():number {
		return this.charList.length;
	}
	public  getScreenGemCount():number {
		return this.gemList.length;
    }
    /**
     * 这个对象是否在该场景上;
     * @param pos 
     */
    public inHere(pos:PosData):boolean{
        let idx:number=-1;
        switch(pos.poolname){
            case "CharData":
             idx =this.charList.indexOf(pos);
            break;
            case "GemData":
             idx =this.gemList.indexOf(pos);
            break;
        }
       if(idx>=0){
           return true;
        }
       return false;
    }
    /***
     * 这个位置上是否有东西；
     */
    public posHasChar(Vec2:cc.Vec2,radius:number):boolean{
        this.charList.forEach( char=>{
            if(char.getDic(Vec2,radius)<=0){
                return true;
            }
        })
      return false;
    }

    public posHasObjBase(Vec2:cc.Vec2,radius:number):boolean{
        this.charList.forEach( char=>{
            if(char.getDic(Vec2,radius,false)<=0){
                return true;
            }
        })
        this.gemList.forEach( gem=>{
            if(gem.getDic(Vec2,radius)<=0){
                return true;
            }
        })
      return false;
    }


    /**
     * 用到随机数 只能在帧同步里用; 随机位置生成一个宝石
     * @param resScreen 
     * @param radio 
     */
	public  getRandomPoint():cc.Vec2 {
        let  pos: cc.Vec2=cc.Vec2.ZERO;
        //半径范围内的随机点;
        pos.x = (this.x * ConfigData.map_AreaSize + ConfigData.map_AreaSize * Core.Random.GetRandom()  )>>0;
        pos.y = (this.z * ConfigData.map_AreaSize + ConfigData.map_AreaSize * Core.Random.GetRandom()  )>>0;
		return pos;
	}
     /**
      *  找出宝石生点;
      * @param radius 
      */
     public getGemBrothPoint(radius:number):cc.Vec2{
        //获取随机场景;
        let  Vec2:cc.Vec2= this.getRandomPoint();
        if(!this.posHasObjBase(Vec2,radius)){
            return Vec2;
        }
        return this.getGemBrothPoint(radius);
    }
    /**
     *在获取时;
    **/ 
    onGet(){
      super.onGet();
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
        this.gemList.length=0;
        this.charList.length=0;
        this.resMap=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.gemList=null;
        this.charList=null;
        this.resMap=null;
        super.Release();
    }
}