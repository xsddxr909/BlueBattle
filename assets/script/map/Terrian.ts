import IRelease from "../../corelibs/interface/IRelease";
import TerrainTexCtrl from "./TerrainTexCtrl";
import WallCtrl from "./WallCtrl";
import { DataPool } from "../../corelibs/util/Pool";
import Core from "../../corelibs/Core";
import { ConfigData } from "../ConfigData";
import QuadTree, { IQuadRect } from "../../corelibs/util/QuadTree";
import GroundCtrl from "./GroundCtrl";
import CameraCtrl from "../logic/CameraCtrl";

/**
 * 地图
 */
export default class Terrian implements IRelease
{
    //游戏地图地表层;
    private m_terrainNode: cc.Node;
    //游戏地图遮罩层
    private m_coverNode:cc.Node;
    //地形池子
    private _terrainTexPool:DataPool<TerrainTexCtrl> = null;
    //墙壁池子
    private _wallPool:DataPool<WallCtrl> = null;
    //四叉树
    private _quadTree:QuadTree<TerrainTexData> = null;
    //上一次四叉树查询时得到的地块信息列表
    private _preTerrainTexDataList:TerrainTexData[] = [];
    //当前地块控制类列表
    private _terrainTexCtrlList:TerrainTexCtrl[] = [];
    private  list = ['ground_tex_1',
                    'ground_tex_2',
                    'ground_tex_3',
                    'ground_tex_4',
                    'ground_tex_5',
                    'ground_tex_6',
                    'ground_tex_7',
                    'ground_tex_8' ];

    private groundCtrl:GroundCtrl;               
    constructor(terrain:cc.Node,cover:cc.Node)
    {
        this.m_terrainNode=terrain;
        this.m_coverNode=cover;
        //初始化地形池子
        this._terrainTexPool = new DataPool<TerrainTexCtrl>(() => cc.instantiate(Core.ResourcesMgr.getPrefab("prefabs/battle/TerrainTexCtrl")).getComponent(TerrainTexCtrl));
        this._terrainTexPool.prepare(10);
        //初始化墙壁池子
        this._wallPool = new DataPool<WallCtrl>(() => cc.instantiate(Core.ResourcesMgr.getPrefab("prefabs/battle/WallCtrl")).addComponent(WallCtrl));
        this._wallPool.prepare(4);

        let ground :cc.Node=cc.instantiate(Core.ResourcesMgr.getPrefab("prefabs/battle/GroundCtrl"));
        this.groundCtrl=ground.getComponent(GroundCtrl);
        this.m_terrainNode.addChild(ground);
        ground.active=false;
   //      this.init();
    }
    public init(){
        this.groundCtrl.node.active=true;
        this.groundCtrl.init();
        //初始化地形
        this._initTerrainTex();
        //初始化墙壁
        this._initWall(); 
    }

    /**
     * 地表特色小物件数据;
     */
    private _initTerrainTex(){
        //地块间隔
        let terrainTexUnit = 200;
        //地块x轴数目
        let lx = (ConfigData.gameMapSize.width/terrainTexUnit) >> 0;
        //地块y轴数目
        let ly = (ConfigData.gameMapSize.height/terrainTexUnit) >> 0;

      //  console.log("刷新用时地表 ms:  ",lx,ly);
        //初始化四叉树
        this._quadTree = new QuadTree<TerrainTexData>(0,0,ConfigData.gameMapSize.width,ConfigData.gameMapSize.height);
        //生成地形数据，插入四叉树
      //  console.log("刷新用时地表 GetRandom:  ",Core.Random.GetRandom());
        for(let x = 0;x < lx; x++) {
            for(let y = 0;y < ly; y++) {
               if(Core.Random.GetRandom() >0.3){
                     continue;
                 }
                let spfName = this.getRandomGroundSpfName();
                //中心点;
                let xPos = (x+0.5) * terrainTexUnit +Core.Random.GetRandom()*terrainTexUnit-terrainTexUnit/2;
                let yPos = (y+0.5) * terrainTexUnit +Core.Random.GetRandom()*terrainTexUnit-terrainTexUnit/2;
                let width = 180;
                let height = 180;
                let id = x * lx + y
                let groundTexData = new TerrainTexData(xPos,yPos,width,height,spfName,id);
         //       console.log("添加 ms:  ",groundTexData);
                this._quadTree.put(groundTexData);
            }
        }
    }
    //初始化墙壁 四个外框;
    private _initWall() {
        //初始化上方的墙壁
        //up
        let upPos = cc.v2(ConfigData.gameMapSize.width/2,ConfigData.gameMapSize.height);
        let upWall:WallCtrl = this._wallPool.get();
        this.m_coverNode.addChild(upWall.node);
        upWall.initialize(upPos,ConfigData.gameMapSize.width + WallCtrl.unitWidth);
        //初始化下方的墙壁
        //down
        let downPos = cc.v2(ConfigData.gameMapSize.width/2,- WallCtrl.unitHeight);
        let downWall = this._wallPool.get();
        this.m_coverNode.addChild(downWall.node);
        downWall.initialize(downPos,ConfigData.gameMapSize.width + WallCtrl.unitWidth);
        //初始化左侧的墙壁
        //left
        let leftPos = cc.v2( - WallCtrl.unitWidth, - WallCtrl.unitHeight);
        let leftWall = this._wallPool.get();
        this.m_coverNode.addChild(leftWall.node);
        leftWall.initialize(leftPos,null,ConfigData.gameMapSize.height + WallCtrl.unitHeight+WallCtrl.unitWidth);
        //初始化右侧的墙壁
        //right
        let rightPos = cc.v2(ConfigData.gameMapSize.width + WallCtrl.unitWidth,- WallCtrl.unitHeight);
        let rightWall = this._wallPool.get();
        this.m_coverNode.addChild(rightWall.node);
        rightWall.initialize(rightPos,null,ConfigData.gameMapSize.height + WallCtrl.unitHeight+WallCtrl.unitWidth);
    }


   //获取随机地块精灵帧
   getRandomGroundSpfName() {
        let randomIdx = (this.list.length * Core.Random.GetRandom()) >> 0;
        return this.list[randomIdx];
    }
    /**
     * 回收到池中;
     */
    recycleAll(){
        this._terrainTexPool.recycleAll();
        this._wallPool.recycleAll();
        this.groundCtrl.node.active=false;
        this._quadTree.clear();
        this._preTerrainTexDataList = [];
        //当前地块控制类列表
        this._terrainTexCtrlList = [];
    }
   /**
    * 回收;
    */
    Release(): void {
        this._terrainTexPool.clearAll();
        this._terrainTexPool= null;
        this._wallPool .clearAll();
        this._wallPool = null;
        this._quadTree.clear();
        this._quadTree=null;
        this._preTerrainTexDataList=null;
        this._terrainTexCtrlList= null;
        this.list=null;
        this.m_terrainNode=null;
        this.m_coverNode=null;
        this.groundCtrl=null;
    }

    Update(dt: number): void {
       this._updateTerrainCulling();
       this._updateGround();
    }

  //更新地形裁剪
    private _updateTerrainCulling() {
        //获取视口
        let rect = CameraCtrl.Instance.getBoundingBox();
    //   let nnnT = cc.sys.now();
        //四叉树查询地块列表
        let currTerrainTexDataList = this._quadTree.get(rect);
    //  nnnT=cc.sys.now()-nnnT;
     //   console.log("更新地形裁剪 ms:  ",rect,currTerrainTexDataList);
        //过滤应该增加的地块
        let addTerrainTexDataList = currTerrainTexDataList.filter(v => (this._preTerrainTexDataList.indexOf(v)<0));
        //过滤应该删除的地块
        let removeTerrainTexDataList = this._preTerrainTexDataList.filter(v => (currTerrainTexDataList.indexOf(v)<0));
        //循环删除地块渲染
        removeTerrainTexDataList.forEach(v => {
            let ctrl = this._terrainTexCtrlList.find(ctrl => ctrl.id === v.id);
            ctrl && ctrl.recycleSelf();
        })
        // if(addTerrainTexDataList.length>0||removeTerrainTexDataList.length>0){
        //     console.log("更新地形裁剪 ms:  ",rect,currTerrainTexDataList);
        // }
        //循环增加地块渲染
        addTerrainTexDataList.forEach(v => {
            let ctrl = this._terrainTexPool.get();
         //   ctrl.node.parent = this.m_terrainNode;
            this.m_terrainNode.addChild(ctrl.node);
            ctrl.id = v.id;
            ctrl.node.x = v.x + v.width/2;
            ctrl.node.y = v.y + v.height/2;
            ctrl.initialize(v.spName);
        //    console.log("_updateTerrainCulling 添加 ms:  ",ctrl.id,v);
           // ctrl.updateTexColor(this.terrainCt.color);
        })
        //记录本次查询的地块信息，供下次查询使用。
        this._preTerrainTexDataList = currTerrainTexDataList;
    }


    //更新墙壁外的地板颜色
    private _updateGround() {
        let rect = CameraCtrl.Instance.getBoundingBox();
      //  console.log("更新墙壁外的地板颜色 ms:  "+rect);
        this.groundCtrl.node.position=CameraCtrl.Instance.getNextPos();
        this.groundCtrl.UpdateRect(rect);
    }
    

    GetName?(): string {
        return "GameMap";
    }


}
//地块类
export class TerrainTexData implements IQuadRect {
    x: number;
    y: number;
    width: number;
    height: number;
    spName:string;
    id:number;

    constructor(x:number,y:number,w:number,h:number,spfName:string,id:number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.spName = spfName;
        this.id = id;
    }
}