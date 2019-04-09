import { ViewPart } from "./part/ViewPart";
import { IUpdate } from "../../corelibs/interface/IUpdate";
import { MovePart } from "./part/MovePart";
import { CharManager } from "./manager/CharManager";
import { PosData } from "../data/PosData";
import { EventRecycleAble } from "../../corelibs/event/EventDispatcher";
import { MyMath } from "../../corelibs/util/MyMath";
import Core from "../../corelibs/Core";

/**
 * 游戏元素基类;
 * 
 */
export class ObjBase extends EventRecycleAble implements IUpdate
{
    public data:PosData;
    //显示对象;
    public view:ViewPart;
    //移动对象;
    protected move:MovePart;
     //目标;
     public target:ObjBase;

    constructor()
    {
        super();
        this.move=Core.ObjectPoolMgr.get(MovePart,"MovePart");
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(data:PosData){
    //    console.log("initData",this.id);
        this.data=data;
        this.move.init(data,this);
    }
    //更新;
    Update(dt: number): void {
        this.move.Update(dt);
        if(this.data.inCamera){
            if(this.view==null){
                this.view=Core.ObjectPoolMgr.get(ViewPart,"ViewPart");
                this.view.init(this.data.bodyUrl,this.data.id,this.data.zIndex);
            }
            this.view.getNode().position= this.data.position;
            this.view.body.angle=this.data.angle;
        }else{
            if(this.view!=null){
                this.view.recycleSelf();
                this.view=null;
            }
        }
    }
    GetName?(): string {
        return 'ObjBase'+this.id;
    }


    setTarget(target: ObjBase){
         this.target=target;
    }

    hasTarget():boolean{
        if(!this.target||!this.target.data||this.target.data.isDead){
            this.target=null;
           return false;
        }
       return true;
    }

    /**
     * 计算目标距离;
     * @param target 目标;
     * @param subTargetRadius 是否减去目标半径;
     */
    getDicByTarget(target: ObjBase, subTargetRadius: boolean): number {
        let dic:number=0;
        let radio:number=0;
        if (subTargetRadius)
        {
            radio=target.data.radius*target.data.scaleSize;
        }
        dic = target.data.position.sub(this.data.position).mag() - radio;
        return dic;
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
      this.move.stopMove();
      if(this.view!=null){
        this.view.recycleSelf();
        this.view=null;
      }
      this.data.recycleSelf();
      this.data=null;
      this.target=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.view.recycleSelf();
        this.view=null;

        this.move.recycleSelf();
        this.move=null;
        
        this.data.recycleSelf();
        this.data=null;
        this.target=null;
        super.Release();
    }
}