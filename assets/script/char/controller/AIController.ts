import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import { Controller } from "./Controller";
import { BehaTree } from "../../../corelibs/behaTree/BehaTree";
import { BehaviorTreeManager } from "../../../corelibs/behaTree/BehaviorTreeManager";
import { BackOff } from "../action/BackOff";
import { Dead } from "../action/Dead";

/**
 * 遥感控制器
 * 
 */
export class AIController extends Controller 
{ 
  //  private skill:SkillPart;
    private behaTree:BehaTree;
    private isStartAI:boolean=false;
    constructor()
    {
        super();
    }
    /**
     * 初始化数据; 创建显示对象;
     */
    public init(char:Character){
       super.init(char);
    //   this.skill=char.getSkillPart();
       this.behaTree=BehaviorTreeManager.Get().creatNodeTree(char.charData.aiUrl,char.charData);
       if(!char.charData.autoStartAi){
          this.behaTree.Paused();
       }
    }
    OnMessage(cmd:ENUMS.ControllerCmd, param?: any): void {
        switch(cmd){
            case ENUMS.ControllerCmd.Start_AI:
                if(this.behaTree!=null){
                    this.behaTree.Stop();
                    this.behaTree.Continue();
                    this.isStartAI=true;
                }
            break;
            case ENUMS.ControllerCmd.Stop_AI:
                if(this.behaTree!=null){
                    this.isStartAI=false;
                    this.behaTree.Stop();
                }
            break;
            case ENUMS.ControllerCmd.Paused_AI:
                if(this.behaTree!=null){
                    this.isStartAI=false;
                    this.behaTree.Paused();
                }
            break;
            case ENUMS.ControllerCmd.Continue_AI:
                if(this.behaTree!=null){
                    this.isStartAI=true;
                    this.behaTree.Continue();
                }
            break;
        }
        super.OnMessage(cmd,param);
    }

 
    //更新;
    Update(dt: number): void {
        if(this.isStartAI&&this.behaTree!=null){
            //规避 不能执行AI思考状态; 因为没有受击状态 所以临时这里写。
            if(this.behaTree.isPause()){
                if(this.char.charData.currentActionLabel!=BackOff.name&&this.char.charData.currentActionLabel!=Dead.name){
                    this.behaTree.Continue();
                    this.behaTree.Update(dt);
                }
            }else{
               if(this.char.charData.currentActionLabel==BackOff.name||this.char.charData.currentActionLabel==Dead.name){
                   this.behaTree.Paused();
               }
               this.behaTree.Update(dt);
            }
        }
        super.Update(dt);
    }
    GetName?(): string {
      return 'AIController'+this.id;
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
        this.behaTree.recycleSelf();
       this.behaTree=null;
       this.isStartAI=false;
     //  this.skill=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.behaTree.recycleSelf();
        this.behaTree=null;
        this.isStartAI=false;
   //     this.skill=null;
        super.Release();
    }
}