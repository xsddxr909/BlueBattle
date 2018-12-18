/**
 * 通用对象池，用来生成简单数据、类
**/

export default class ObjectPool 
{
    private static m_arrPool: Array<Array<any>>;
    private static m_arrObject: Array<Array<any>>;
    private static m_arrNameLog: Array<string>;
    private static TotalKey: number = 0;
    constructor()
    {

    }

    public static Init(): void
    {
        ObjectPool.m_arrPool = new Array<Array<any>>();
        ObjectPool.m_arrObject = new Array<Array<any>>();
        ObjectPool.m_arrNameLog = new Array<string>();
    }
    /**
     * 
     * @param classFactory 传入的类
     */
    public static CheckOut(classFactory: any): any
    {
        let result;
        let iPoolKey: number = classFactory.pool_key;//检查是否有pool_key的属性，没有就在原型链中加入
        if(isNaN(iPoolKey))
        {
            iPoolKey = ObjectPool.TotalKey;
            classFactory.pool_key = iPoolKey;
            ObjectPool.TotalKey++;
            ObjectPool.m_arrNameLog[iPoolKey] = classFactory.name;
        }
        if(!ObjectPool.m_arrPool[iPoolKey])
        {
            ObjectPool.m_arrPool[iPoolKey] = [];
        }
        if(!ObjectPool.m_arrObject[iPoolKey])
        {
            ObjectPool.m_arrObject[iPoolKey] = [];
        }
        let arr = ObjectPool.m_arrPool[iPoolKey];
        if(arr.length)
        {
            result = arr.shift();
        }
        else
        {
            result = new classFactory();
        }
        result.pool_key = iPoolKey;
        ObjectPool.m_arrObject[iPoolKey].push(result);
        // cc.log("CheckOut:",classFactory.name);
        return result;
    }

    public static CheckIn(obj: any): void
    {
        let iPoolKey: number = obj.constructor.pool_key;
        if(isNaN(iPoolKey))
        {
            iPoolKey = ObjectPool.TotalKey;
            obj.constructor.pool_key = iPoolKey;
            ObjectPool.TotalKey++;
            ObjectPool.m_arrNameLog[iPoolKey] = obj.constructor.name;
        }
        if(!ObjectPool.m_arrPool[iPoolKey])
        {
            ObjectPool.m_arrPool[iPoolKey] = [];
        }
        if(!ObjectPool.m_arrObject[iPoolKey])
        {
            ObjectPool.m_arrObject[iPoolKey] = [];
        }
        let index = ObjectPool.m_arrPool[iPoolKey].indexOf(obj);
        if(index != -1)
        {
            return;
        }
        ObjectPool.m_arrPool[iPoolKey].push(obj);
        index = ObjectPool.m_arrObject[iPoolKey].indexOf(obj);
        if(index != -1)
        {
            ObjectPool.m_arrObject[iPoolKey][index] = ObjectPool.m_arrObject[ObjectPool.m_arrObject[iPoolKey].length - 1];
            ObjectPool.m_arrObject[iPoolKey].pop();
        }
        // cc.log("CheckIn:",obj.constructor.name);
    }

}
