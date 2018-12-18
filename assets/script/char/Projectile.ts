import { ObjBase } from "./ObjBase";
import { PosData } from "../data/PosData";

/**
 * 飞行道具
 * 
 */
export class Projectile extends ObjBase 
{
    constructor()
    {
        super();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(data:PosData){
        super.init(data);
    }
    //更新;
    Update(dt: number): void {
       super.Update(dt);
    }
    GetName?(): string {
        return 'Item'+this.id;
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
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        super.Release();
    }
}