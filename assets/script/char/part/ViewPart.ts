import { RecycleAble } from "../../../corelibs/util/Pool";
import Core from "../../../corelibs/Core";
import { CharManager } from "../manager/CharManager";
import MapManager from "../../map/MapManager";

/**
 * 显示部件;
 *  
 */
export class ViewPart extends RecycleAble
{
    //显示对象根节点;
    public node: cc.Node;
    public parent: cc.Node;
    public body:cc.Node;
    private oldUrl:string;
    constructor()
    {
        super();
        //创建根节点;   添加到角色层上;
        this.node=new cc.Node();
         MapManager.Get().getCharNode().addChild(this.node);
    }
    /**
     * 可重构;只执行一次;
     */
    public init(url:string,id:number,idx:number){
        this.changBody(url,id);
        this.node.zIndex=idx;
    }
    /**
     *  更换造型; 
     * @param url 
     */
    changBody(url:string,id:number){
        if(url==this.oldUrl){
            // if(this.body!=null){
            //     this.body.getChildByName("label").getComponent(cc.Label).string=""+id;
            //  }
             return;
         }
         if(this.body!=null){
            this.body.destroy();
            this.body=null;
         }
         this.body=cc.instantiate(Core.ResourcesMgr.getPrefab(url));
    //     this.body.getChildByName("label").getComponent(cc.Label).string=""+id;
         this.node.addChild(this.body);
         this.oldUrl=url;
    }
    getNode():cc.Node{
        return this.node;
    }
    getBody():cc.Node{
        return this.body;
    }
    /**
     *在获取时;
    **/ 
    onGet(){
      this.node.active=true;
      super.onGet();
    }
    /**
     *释放 时候;
     **/ 
    onRecycle(): void {
  //不一定要从父节点移除;  this.m_Node.removeFromParent();
      this.node.active=false;
    //   //场景之外
    //   this.m_Node.position.x=99999;
    //   this.m_Node.position.y=99999;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this.body.destroy();
        this.body=null;
        this.node.destroy();
        this.node=null;
        super.Release();
    }
}