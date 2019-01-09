import { Character } from "../Character";
import { ENUMS } from "../../common/Enum";
import { Controller } from "./Controller";
import { BehaTree } from "../../../corelibs/behaTree/BehaTree";
import { BehaviorTreeManager } from "../../../corelibs/behaTree/BehaviorTreeManager";

/**
 * 遥感控制器
 * 
 */
export class AIController extends Controller 
{ 
  //  private skill:SkillPart;
    private behaTree:BehaTree;
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
                }
            break;
            case ENUMS.ControllerCmd.Stop_AI:
                if(this.behaTree!=null){
                    this.behaTree.Stop();
                }
            break;
            case ENUMS.ControllerCmd.Paused_AI:
                if(this.behaTree!=null){
                    this.behaTree.Paused();
                }
            break;
            case ENUMS.ControllerCmd.Continue_AI:
                if(this.behaTree!=null){
                    this.behaTree.Continue();
                }
            break;
        }
        super.OnMessage(cmd,param);
    }


    //更新;
    Update(dt: number): void {
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
     //  this.skill=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.behaTree.recycleSelf();
        this.behaTree=null;
   //     this.skill=null;
        super.Release();
    }
}