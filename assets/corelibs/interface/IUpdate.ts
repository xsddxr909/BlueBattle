export  interface IUpdate
{
    Update(dt: number): void;
    GetName?(): string;
}
export  interface IController
{
    id:number;
    OnMessage(code:number, param?:any):void;
    //回收;
    Release():void;
    //更新;
    Update(dt:number):void;
}
/**
 * 权重接口
 */
export  interface IWeight
{
    weight:number;
}
