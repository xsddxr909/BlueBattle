export interface IRecycleAble {
    id:number;
    //池的名字 这个最好不要改.会影响池；
    poolname:string;
    pool:IPool;
    isRecycled:boolean;
    //在获取时;
    onGet():void
    //在回收中;
    onRecycle():void;
    //自己回收;
    recycleSelf():void;
    //销毁方法;
    Release():void;
}
export interface IPool{
    recycle(item:IRecycleAble ); 
}
export class Pool< T extends IRecycleAble> implements IPool{
    public poolName:string;
    protected _list:Array<T>;
    private creator:() => T = null;
    constructor(creator:(() => T),poolName:string) {
        this.creator = creator;
        this.poolName=poolName;
        this._list=new Array<T>();
    }
    //回收一个对象;
    recycle(item:T ) {
        item.isRecycled = true;
        this._list.push(item);
    }
    get():T  {
        let item = this._list.pop();
        if(!item) {
            item = this._createItem();
        }
        item.pool=this;
        item.poolname=this.poolName;
        item.isRecycled = false;
        item.onGet();
        return item;
    }
    prepare(count:number):void {
        for(let i = 0,l = count;i < l;i++) {
            let item = this._createItem();
            this.recycle(item);
        }
    }
    private _createItem() {
        let item = (this.creator()) as T ;
        item.pool=this;
        item.isRecycled = false;
        return item;
    }
    clearAll(){
        let listTemp:Array<T >= this._list;
        this._list=[];
        listTemp.forEach(element => {
           if(element!=null){
               element.Release();
           }
       });
       listTemp=null;
    }
    getName(){
        return this.poolName;
    }
}

export class RecycleAbleComponent extends cc.Component implements IRecycleAble{
    id:number;
    poolname:string;
    pool: Pool<IRecycleAble>;
    isRecycled: boolean=false;
    
    recycleSelf(): void {
        this.onRecycle();
        this.pool.recycle(this);
    }
    onGet(): void {
      
    }
    /**
     *需要重写 不能外部调用;
     **/ 
    onRecycle(): void {
        this.node.removeFromParent();
    }  
    /**
     *需要重写 不能外部调用;
     **/ 
    Release(): void {
        this.pool=null;
    }
}
export class RecycleAble  implements IRecycleAble{
    poolname:string;
    id:number;
    pool: IPool;
    //是否被回收中 true为在Pool中;
    isRecycled: boolean=false;
    constructor(){
        this.id=0;
        this.isRecycled=false;
    }
    recycleSelf(): void {
        this.onRecycle();
        this.pool.recycle(this);
    }
    /**
     *需要重写 不能外部调用;
     **/ 
    onGet(): void {
      
    }
    /**
     *需要重写 不能外部调用;
     **/ 
    onRecycle(): void {
      
    }  
    /**
     *需要重写 不能外部调用;
     **/ 
    Release(): void {
        this.pool=null;
    }
}
/**
 * 带使用中的对象  带ID查询;
 */
export class DataPool< T extends IRecycleAble> extends Pool<T>{
    //包括在缓存中回收中的对象 和 现有使用中的对象 有时候需要用到被回收后的数据..
    private dataMap: Map<number,T>;
    private  m_iNewID: number = 1;
    public  get CreateID(): number
    {
        return ++this.m_iNewID;
    }
    constructor(creator:(() => T),poolName:string) {
        super(creator,poolName);
        this.dataMap =new Map<number,T>();
    }
    get():T  {
      let obj= super.get();
      if(obj.id==0){
          obj.id=this.CreateID;
          this.dataMap.set(obj.id,obj);
      }
      return obj;
    }
    /**
     * 回收所有数据对象;
     */
    recycleAll():void{
        this.dataMap.forEach(element => {
            if(element!=null&&!element.isRecycled){
                element.recycleSelf();
            }
        });
    }
    /**
     * 清空所有对象; 重写 不需要super
     */
    clearAll():void{
        let mapTemp: Map<number,T>= this.dataMap;
        this.dataMap=new Map<number,T>();
        mapTemp.forEach(element => {
            if(element!=null){
                element.Release();
            }
        });
        mapTemp=null;
        this._list=[];
        //重写 不需要super
    }
    getDataById(id:number){
        if(id!=0&&this.dataMap.has(id)){
            return this.dataMap.get(id);
        }else{
            return null;
        }
    }
    toString():string{
        let str:string=this.getName();
        str+=" dataMap count: "+this.dataMap.size;
        str+=" pool count: "+this._list.length+" \n";
      return str;
    }
}
/**
 *  带 使用中的对象数组 可以用于循环用;
 */
export class ListDataPool< T extends IRecycleAble> extends DataPool<T>{
    //包括在缓存中回收中的对象 和 现有使用中的对象 有时候需要用到被回收后的数据..
    private onList:Array<T>;
    constructor(creator:(() => T),poolName:string) {
        super(creator,poolName);
        this.onList=new Array<T>();
    }
    get():T  {
      let obj= super.get();
      this.onList.push(obj);
      return obj;
    }
    //回收一个对象;
    recycle(item:T ) {
        super.recycle(item);
        if(this.onList.length>0){
            let idx:number=this.onList.indexOf(item);
            if(idx>=0){
                this.onList.splice(idx,1);
            }
        }
    }
    /**
     * 获得在使用中的数组;
     */
    getOnList():Array<T>{
      return this.onList;
    }
    /**
     * 回收所有数据对象;
     */
    recycleAll():void{
        let listTemp:Array<T >= this.onList;
        this.onList=[];
        listTemp.forEach(element => {
           if(element!=null){
               element.recycleSelf();
           }
       });
       listTemp=null;
    }
    /**
     * 清空所有对象;
     */
    clearAll():void{
        this.onList=new Array<T>();
        super.clearAll();
    }
    
    toString():string{
        let str:string=super.toString();
        str+=" onList count: "+this.onList.length +" \n";
      return str;
    }
} 
/***
 * 多对象通用池; 
 */
export class MultiplePool implements IPool{
    public name:string;
    protected map:Map<string,Array<RecycleAble>>;
    private  m_iNewID: number = 1;
    constructor() {
        this.map=new Map<string,Array<RecycleAble>>();
    }
    public  get CreateID(): number
    {
        return this.m_iNewID++;
    }
    //回收一个对象;
    recycle(item:RecycleAble ) {
        item.isRecycled = true;
        this.map.get(item.poolname).push(item);
    }
    getArrayLenth(classname:string):number{
        if(!this.map.has(classname)){
            return 0;
        }
        return this.map.get(classname).length;
    }
    public get<T extends RecycleAble>(classFactory: new () => T,poolname:string):T  {
        if(!this.map.has(poolname)){
             this.map.set(poolname,new Array<RecycleAble>());
        }
        let array: Array<RecycleAble>=this.map.get(poolname);
        let item:T = array.pop() as T;
     //   console.log("Pool get",poolname);
        if(!item) {
            item = new classFactory();
            item.pool=this;
            item.poolname=poolname;
            item.isRecycled = false;
            item.id=this.CreateID;
        }
        item.pool=this;
        item.isRecycled = false;
        item.onGet();
        return item;
    }
    /**清除一个池 */
    public clear(classname:string):void{
        if(this.map.has(classname)){
            let array: Array<RecycleAble>=this.map.get(classname);
            this.map.set(classname,new Array<RecycleAble>());
            array.forEach(element => {
               if(element!=null){
               }
           });
           array.length=0;
           array=null;
       }
    }
    /**
     * 清空所有对象;
     */
    public clearAll():void{
        this.map.forEach(element => {
            if(element!=null){
                element.forEach(recyleable => {
                    recyleable.Release();
                });
                element.length=0;
            }
        });
    }
    getName(){
        return this.name;
    }

    toString():string{
        let str:string="";
        this.map.forEach((element,key) => {
            if(element!=null){         
                str+=key+" onPool count: "+element.length +" \n";
            }
        });
      return str;
    }
}


