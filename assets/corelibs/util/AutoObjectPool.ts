import IPoolObject from "../interface/IPoolObject";

/**
 * 带自动释放功能的对象池，需要实现IPoolObject接口
 */

export default class AutoObjectPool
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
        AutoObjectPool.m_arrPool = new Array<Array<any>>();
        AutoObjectPool.m_arrObject = new Array<Array<any>>();
        AutoObjectPool.m_arrNameLog = new Array<string>();
    }
    /**
     * 
     * @param classFactory 传入的类
     */
    public static CheckOut<T extends IPoolObject>(classFactory: new () => T): T
    {
        let result: T = AutoObjectPool.AutoCheckOut(classFactory);
        return result;
    }

    public static CheckIn<T extends IPoolObject>(obj: T): void
    {
        if(AutoObjectPool.AutoCheckIn(obj))
        {
            obj.Release();
        }
    }


    private static AutoCheckOut<T extends IPoolObject>(classFactory: new () => T): T
    {
        let result: T;
        let iPoolKey: number = classFactory['pool_key'];//检查是否有pool_key的属性，没有就在原型链中加入
        if(isNaN(iPoolKey))
        {
            iPoolKey = AutoObjectPool.TotalKey;
            classFactory['pool_key'] = iPoolKey;
            AutoObjectPool.TotalKey++;
            AutoObjectPool.m_arrNameLog[iPoolKey] = classFactory['name'];
        }
        if(!AutoObjectPool.m_arrPool[iPoolKey])
        {
            AutoObjectPool.m_arrPool[iPoolKey] = [];
        }
        if(!AutoObjectPool.m_arrObject[iPoolKey])
        {
            AutoObjectPool.m_arrObject[iPoolKey] = [];
        }
        let arr = AutoObjectPool.m_arrPool[iPoolKey];
        if(arr.length)
        {
            result = arr.shift();
        }
        else
        {
            result = new classFactory();
        }
        result['pool_key'] = iPoolKey;
        AutoObjectPool.m_arrObject[iPoolKey].push(result);
        // cc.log("CheckOut:",classFactory.name);
        return result;
    }

    private static AutoCheckIn(obj: any): boolean
    {
        let iPoolKey: number = obj.constructor.pool_key;
        if(isNaN(iPoolKey))
        {
            iPoolKey = AutoObjectPool.TotalKey;
            obj.constructor.pool_key = iPoolKey;
            AutoObjectPool.TotalKey++;
            AutoObjectPool.m_arrNameLog[iPoolKey] = obj.constructor.name;
        }
        if(!AutoObjectPool.m_arrPool[iPoolKey])
        {
            AutoObjectPool.m_arrPool[iPoolKey] = [];
        }
        if(!AutoObjectPool.m_arrObject[iPoolKey])
        {
            AutoObjectPool.m_arrObject[iPoolKey] = [];
        }
        let index = AutoObjectPool.m_arrPool[iPoolKey].indexOf(obj);
        if(index != -1)
        {
            return false;
        }
        AutoObjectPool.m_arrPool[iPoolKey].push(obj);
        index = AutoObjectPool.m_arrObject[iPoolKey].indexOf(obj);
        if(index != -1)
        {
            AutoObjectPool.m_arrObject[iPoolKey][index] = AutoObjectPool.m_arrObject[AutoObjectPool.m_arrObject[iPoolKey].length - 1];
            AutoObjectPool.m_arrObject[iPoolKey].pop();
            return true;
        }
        // cc.log("CheckIn:",obj.constructor.name);
        return false;
    }
}