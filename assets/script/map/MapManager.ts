import Terrian from "./Terrian";
import { ResMap } from "./ResMap";
import Core from "../../corelibs/Core";

/**
 * 地图
 */
export default class MapManager
{

    private static m_pInstance: MapManager;
    public static Get(): MapManager
    {
        if(null == MapManager.m_pInstance)
        {
            MapManager.m_pInstance = new MapManager();
      //      MapManager.m_pInstance.init();
        }
        return MapManager.m_pInstance;
    }
    //游戏场景根节点;
    private m_stUINode: cc.Node;

    private m_stTerrainNode: cc.Node;
    private m_stCharNode: cc.Node;
    private m_stCoverNode: cc.Node;

    private terrian:Terrian;
    private resMap:ResMap;

    constructor()
    {
        this.init();
    }
    private init(){
        
        this.m_stUINode=cc.find('Canvas/Game');
        this.m_stUINode.addChild(this.m_stTerrainNode = new cc.Node());
        this.m_stUINode.addChild(this.m_stCharNode = new cc.Node());
        this.m_stUINode.addChild(this.m_stCoverNode = new cc.Node());
        this.m_stTerrainNode.name = "Terrain";
        this.m_stCharNode.name = "Char";
        this.m_stCoverNode.name = "Cover";
        this.terrian=new Terrian(this.m_stTerrainNode,this.m_stCoverNode);

    }
    /***
     *初始化；
     */
    reset(): void
    {
        this.terrian.init();
        this.resMap=Core.ObjectPoolMgr.get(ResMap,"ResMap");
        this.resMap.init(this.m_stCharNode);
    }
    public recycleAll():void{
        if(  this.terrian!=null){
            this.terrian.recycleAll();
        }
        if(  this.resMap!=null){
            this.resMap.recycleSelf();
        }
    }
    public static Release(): void {
        if(  MapManager.m_pInstance.terrian!=null){
            MapManager.m_pInstance.terrian.Release();
            MapManager.m_pInstance.terrian=null;
        }
        if(  MapManager.m_pInstance.resMap!=null){
            MapManager.m_pInstance.resMap.recycleSelf();
            MapManager.m_pInstance.resMap=null;
        }
        MapManager.m_pInstance.m_stTerrainNode.destroy();
        MapManager.m_pInstance.m_stCharNode.destroy();
        MapManager.m_pInstance.m_stCoverNode.destroy();
        MapManager.m_pInstance.m_stUINode.destroy();
        MapManager.m_pInstance.m_stTerrainNode=null;
        MapManager.m_pInstance.m_stCharNode=null;
        MapManager.m_pInstance.m_stCoverNode=null;
        MapManager.m_pInstance.m_stUINode=null;
        MapManager.m_pInstance=null;
    }
    Update(dt: number): void {
        this.terrian.Update(dt);
    }
    //帧同步逻辑更新;
    UpdateTask(dt: number): void {
        this.resMap.UpdateTask(dt);

    }
     public getCharNode():cc.Node{
         return this.m_stCharNode;
     }
     public getTerrainNode():cc.Node{
        return this.m_stTerrainNode;
    }
    public getCoverNode():cc.Node{
        return this.m_stCoverNode;
    }
    public getResMap():ResMap{
       return this.resMap;
    }

}