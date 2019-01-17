import { ObjBase } from "./ObjBase";
import { PosData } from "../data/PosData";
import { GemData } from "../data/GemData";
import { Action } from "./action/Action";
import { Character } from "./Character";
import { CharManager } from "./manager/CharManager";
import MapManager from "../map/MapManager";

/**
 * 宝石
 * 
 */
export class Gem extends ObjBase 
{
    public gemData:GemData;

    constructor()
    {
        super();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(data:PosData){
        this.gemData=data as GemData;
        this.gemData.GemId=this.id;
   //     console.log("gemData",this.gemData.position,this.gemData.width,this.gemData.height);
        CharManager.Get().GemQuadTree.put(this.gemData);
        MapManager.Get().getResMap().enterResScreen(this.gemData);
        super.init(data);
    }
    //更新;
    Update(dt: number): void {
       super.Update(dt);
    }
    GetName?(): string {
        return 'Gem'+this.id;
    }
    /**
     * 吸引;
     * @param char 
     */
    closeToTarget(char:Character){
    
    }
    /**
     * 已经吸到了;
     * @param char 
     */
    onAddTarget(char:Character){
       //给角色加经验；
        char.checkUpgrade(this.gemData.deadExp);
        CharManager.Get().removeObj(this);
    }

    /**
     *获取 时候;
     */
    onGet(){
        super.onGet();
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
      MapManager.Get().getResMap().leaveResScreen(this.gemData);
      CharManager.Get().GemQuadTree.remove(this.gemData);
      this.gemData=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        MapManager.Get().getResMap().leaveResScreen(this.gemData);
        CharManager.Get().GemQuadTree.remove(this.gemData);
        this.gemData=null;
        super.Release();
    }
}