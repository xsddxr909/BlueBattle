import { RecycleAble } from "../../corelibs/util/Pool";
import { ResScreen } from "./ResScreen";
import Core from "../../corelibs/Core";
import { ConfigData } from "../ConfigData";
import { PosData } from "../data/PosData";


/**
 * 资源地图
 *  
 */
export class ResMap extends RecycleAble
{
    //显示对象根节点;
    private node: cc.Node;
    /** 世界资源区域 */
    private resScreens:ResScreen[][];
    //区域总数;
    private totalScCount:number;
    private reflushIdx:number;
	/** 地图切成资源网格大小 */
	public  gridWidth:number;
    public  gridHeight:number;
    private isDead:boolean=false;
    
    constructor()
    {
        super();
    }
    /**
     * 初始化
     */
    public init(node: cc.Node){
        this.node=node;

        this.gridHeight = ConfigData.gameMapSize.height / ConfigData.map_AreaSize;
        this.gridWidth =  ConfigData.gameMapSize.width  / ConfigData.map_AreaSize;

        this.resScreens=[];
        for  ( let i = 0; i < this.gridWidth; i++ ) {
            this.resScreens[i] = new Array(this.gridHeight);
        }
        //new ResScreen[this.gridWidth][this.gridHeight];

        this.totalScCount = this.gridHeight * this.gridWidth;
        this.reflushIdx = 1;
        

    }
    getNode():cc.Node{
        return this.node;
    }
    /**
     * 更新是否需要创建; 资源 减少创建压力;
     **/
    UpdateTask(dt:number){
        let nowTime:number= Core.FrameSync.getNowTime();
        for (let i = 0; i < 2; i++) {
            const resSc:ResScreen = this.getResScreenById(this.reflushIdx);
        //    console.log("resSc",resSc,this.reflushIdx,this.totalScCount)
			resSc.UpdateTask(nowTime);
			this.reflushIdx++;
			if (this.reflushIdx > this.totalScCount) {
				this.reflushIdx = 1;
			}
		}

    }
    /**
     * 更新 场景元素所在场景分块;
     */
    public updateObjInScreen(data:PosData){
        if(data.screenId==-1){
            return;
        }
        let curScreen:ResScreen=this.getResScreen(data);
        let oldScreen:ResScreen=this.getResScreenById(data.screenId);
        if(curScreen!=null&&curScreen!=oldScreen){
            oldScreen.leaveScreen(data);
            curScreen.enterScreen(data);
        }
    }

    /**
	 * 根据对象当前坐标计算 获取该单位所在的场景
	 *
	 * @param spire
	 * @return
	 */
	public  getResScreen(data:PosData):ResScreen {
		return this.getResScreenXZ(data.x, data.y);
    }
    /**
	 * 根据坐标 获取地图场景
	 *
	 * @param x
	 * @param z
	 * @return
	 */
	public  getResScreenXZ(x:number, z:number):ResScreen {
		if (x < 0 || z < 0 || x > ConfigData.gameMapSize.width || z > ConfigData.gameMapSize.height) {
			// if (x != -1 && z != -1) {
			// 	console.error("resScreen不存在, x:[" + x + "], y:[" + z + "]");
			// }
			return null;
		}
		if (this.resScreens == null) {
			return null;
		}
		let xIndex:number = x / ConfigData.map_AreaSize>>0;
		let zIndex:number = z / ConfigData.map_AreaSize>>0;
		return this.getResScreenByIdx(xIndex, zIndex);

	}
    public getResScreenById(id:number):ResScreen {
		let xIndex:number = ((id - 1) % this.gridWidth)>>0;
		let zIndex:number = ((id - 1) / this.gridWidth)>>0;
		return this.getResScreenByIdx(xIndex, zIndex);
    }
    
    public getResScreenByIdx(xIndex:number, zIndex:number):ResScreen {
        let resScreen:ResScreen = this.resScreens[xIndex][zIndex];
        if (resScreen == null) {
            resScreen = Core.ObjectPoolMgr.get(ResScreen,"ResScreen");
            resScreen.init(this, xIndex, zIndex);
            this.resScreens[xIndex][zIndex] = resScreen;
        }
        return resScreen;
    }
    
    /**
	 * 进入地图
	 *
	 * @param data
	 */
	public  enterResScreen(data:PosData) {
        if(this.isDead)return;
		if (data != null) {
            if(data.screenId!=-1){
                this.leaveResScreen(data);
            }
			let resScreen:ResScreen = this.getResScreen(data);
			if (resScreen != null) {
                resScreen.enterScreen(data);
			}
			// gameScreen.enterScreen(spire);
			// spire.recordScreen(gameScreen);
		}
	}

	/**
	 * 进入地图
	 *
	 * @param data
	 */
	public  leaveResScreen(data:PosData) {
        if(this.isDead)return;
		if (data != null&&data.screenId!=-1) {
			let resScreen:ResScreen=this.getResScreenById(data.screenId);
			if (resScreen != null) {
				resScreen.leaveScreen(data);
			}
		}
	}

    /**
	 * 是否阻挡格;
	 *
	 * @param data 玩家当前z坐标
	 * @return true 可以通过 false 不可以通过
	 */
	public  isPathPass(x:number,y:number,radius:number):boolean {
        if (x < 0 || y < 0 || (x + radius ) >= ConfigData.gameMapSize.width || (y + radius) >= ConfigData.gameMapSize.height) {
            return false;
        }
        let resScreen:ResScreen=this.getResScreenXZ(x,y);
        if (resScreen != null) {
             //查找附近9个位置;场景位置
             //如果没有阻挡;
             return true;
        }
        return false;
    }
   
    
    /**
     *在获取时;
    **/ 
    onGet(){
      super.onGet();
      this.isDead=false;
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
        this.node=null;
        this.isDead=true;
        for  ( let i = 0; i < this.resScreens.length; i++ ) {
            this.resScreens[i].forEach(resS=>{
                     resS.recycleSelf();
            });
        }
        this.resScreens=[];
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        for  ( let i = 0; i < this.resScreens.length; i++ ) {
            this.resScreens[i].forEach(resS=>{
                     resS.recycleSelf();
            });
        }
        this.resScreens=[];
        this.node=null;
        this.isDead=true;
        super.Release();
    }
}