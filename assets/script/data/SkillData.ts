import { ENUMS } from "../common/Enum";
import { PosData } from "./PosData";
import { Enum } from "protobufjs";
import { RecycleAble } from "../../corelibs/util/Pool";

/**
 * 技能数据;
 */
export class SkillData extends RecycleAble
{
    constructor(){
        super();
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
    /**
     * 初始化数据;
     */
    public initData(){
        
    }
}