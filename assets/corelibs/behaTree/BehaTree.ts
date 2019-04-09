import { NodeCombiner, ResultType, BehaData, NodeBase } from "./NodeBehaTree";
import Core from "../Core";
import { ResStruct } from "../util/ResourcesMgr";
import { ResType } from "../CoreDefine";
import { BehaviorTreeManager } from "./BehaviorTreeManager";
/// <summary>
/// 行为树  只有一个子节点； 开始节点;
/// </summary>
export class BehaTree extends NodeCombiner {
    //jason Url 行为树地址;
    public debug:boolean=false;
    //每个步骤打印;
    public allStep:boolean=false;

    private url: string;
    private inited: boolean = false;
    private dataList:Array<BehaData>;
    //黑板 数据对象;
    private data:any=null;
    public lastNodeStep:NodeBase;
    //节点信息；
    public strStep:string="";

    private isPaused:boolean=false;
    constructor() {
        super();
        this.dataList=new Array<BehaData>();
    }
    public init(url: string,data:any=null) {
        this.inited = false;
        this.isPaused=false;
        this.data=data;
        this.lastNodeStep=null;
        if (this.url != url) {
            this.dataList=[];
            this.recycleChild();
            this.url = url;
            //加载jason 并初始化序列;
            Core.ResourcesMgr.LoadRes(ResStruct.CreateRes(url,ResType.JsonAsset),this.onload.bind(this));
        }
        else {
            this.reset();
            this.initData();
            this.inited = true;
        }
    }
    public getData<T>():T{
        if(this.data!=null){
            return this.data as T;
        }
        return null;
    }
    private onload(res:any) {
        //  "root": "877d0820-bd1a-49f8-82f3-8d59ac8bda33",
          //"name": "Select",
          //"properties": {
         //   "maxTime": 0
         // },
        // "children": [
       //     "6ea3bb67-eb96-4f1f-855a-81c0f873f351"
        //  ]
      //  console.log("res ："+res);
        let rootStr:string = res.json['root'];

        const objs:[] = res.json['nodes'];
        for (let id in objs) {
            const spec = objs[id];
        //    const t = objs[index];
            const b:BehaData = <BehaData>spec;
            this.dataList.push(b);
        }
        let nodeList:Array<NodeBase>=new Array<NodeBase>();
        for (let i = 0; i < this.dataList.length; i++) {
            const b:BehaData = this.dataList[i];
          //  console.log("get type: "+b.name);
            if(!BehaviorTreeManager.Get().classMapping.has(b.name)){
                console.log("No >>>= BehaviorTree type: "+b.name);
                continue;
            }
            const  nodes:NodeBase=Core.ObjectPoolMgr.get(BehaviorTreeManager.Get().classMapping.get(b.name),b.name);
            nodes.md5Id=b.id;
            if(b.children){
                nodes.childStr=b.children;
            }else if(b.child!=null){
                nodes.childStr=[b.child];
            }

            nodes.behaTree=this;
            nodes.initProperties(b);
            if(b.id==rootStr){
                //添加根节点;
                this.AddNode(nodes);
            }
            nodeList.push(nodes);
        }
        for (let i = 0; i < nodeList.length; i++) {
            const nodes:NodeBase = nodeList[i];
            if(nodes.childStr!=null&&nodes.childStr.length>0){
                for (let j = 0; j < nodes.childStr.length; j++) {
                    for (let q = 0; q < nodeList.length; q++) {
                        if(nodeList[q].md5Id==nodes.childStr[j]){
                            const nodeComb:NodeCombiner = nodeList[i] as NodeCombiner;
                            nodeComb.AddNode(nodeList[q]);
             //               console.log(nodeComb.id+" "+ nodeComb.poolname+" child:"+nodeList[q].poolname);
                        }
                    }
                }
            }
        }
        nodeList=[];
        if(this.data==null){
            return;
        }
        this.initData();
        this.inited = true;
    }
    public Update(dt:number) {
        if (!this.inited) {
            return;
        }
        if(this.isPaused){
            return;
        }
        this.Execute();
        //我想要知道目前走到哪一步。
        if(this.debug){
            this.strStep = this.lastNodeStep.toString();
            if(this.allStep){
                console.log(this.data.pvpId+" 树执行 id: " + this.id + " res:"+this.lastResultType);
            }
        }
        if (this.lastResultType == ResultType.Success||this.lastResultType == ResultType.Fail)
        {
            if(this.debug&&this.allStep){
                console.log(this.data.pvpId+"树执行>>>>>完毕 id: " + this.id + " res:"+this.lastResultType);
            }
            this.reset();
        }
    }
    public isPause():boolean{
        return this.isPaused;
    }
    public Paused(){
        this.isPaused=true;
    }
    public Continue(){
        this.isPaused=false;
    }
    public Stop(){
        this.isPaused=true;
        this.reset();
    }

    public Execute():ResultType
    {
        if( this.nodeChildList.length<1){
            console.log("BehaTree 节点长度错误");
            this.lastResultType=ResultType.Fail;
            return ResultType.Fail;
        }
        let resultType:ResultType = this.nodeChildList[0].Execute();
        this.lastResultType=resultType;
        return resultType;
    }

    public reset() {
        super.reset();
    }
    /**
     *释放 时候;
     **/
    onRecycle(): void {
        this.lastNodeStep=null;
        this.inited = false;
        this.data=null;
        this.isPaused=false;
        this.lastResultType= ResultType.Defult;
        this.debug=false;
        //这里回收只想回收一层  树结构不回收。 不继承；
  //      super.onRecycle();
    }
    /**
    *回收;
    **/
    Release(): void {
        this.inited = false;
        this.dataList=[];
        this.data=null;
        this.isPaused=false;
        super.Release();
    }
}