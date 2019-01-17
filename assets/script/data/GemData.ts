import { ENUMS } from "../common/Enum";
import { PosData } from "./PosData";

/**
 * 宝石数据;
 */
export class GemData extends PosData
{
    // ID;
     public GemId:number;
    //这里不想做状态机 目前类已经够多了 不想用SKillPart 所以用了小学生状态机
     // 0正常 1飞出 2吸引;
    public state:number=0;
    public deadExp:number=0;
    private _itemType:number=1;

    //临时变量；
    public vvalue:number;
    
    public get itemType(){
      return this._itemType;
    }
    public set itemType(value:number){
        this._itemType=value;
        switch(value){
            case 1:
              //小宝石
              this.radius=22;
              this.deadExp=10;
              this.bodyUrl="prefabs/battle/baoshi";
            break;
            case 2:
              //大宝石
              this.radius=60;
              this.deadExp=80;
              this.bodyUrl="prefabs/battle/baoshi2";
            break;
        }
    }
    /**
     * 能获取的经验;
     */
    getDeadExp():number{
       return this.deadExp;
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
     // this.resetForwardDirection();
      this.state=0;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        super.Release();
    }
    /**
     * 初始化数据;
     */
    public initData(){
        this.state=0;
        this.zIndex=0;
        super.initData();
    }
}