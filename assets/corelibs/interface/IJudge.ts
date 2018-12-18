//判定接口..所有判定 都继承此接口 返回true 成功 flase失败
export  interface IJudge
{
    //返回true 条件成立 false 条件不成立 不成立时执行操作.
    judge():boolean;
    dispose():void;
}
export  interface ILinker
{
    doLink():boolean;
    dispose():void;
}