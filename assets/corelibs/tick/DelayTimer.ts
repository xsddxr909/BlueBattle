import ITick from "../interface/ITick";
import Core from "../Core";

export default class DelayTimer implements ITick
{
    private m_mapKeyTickEvent: Map<number,Array<IDelayCallback>>;
    private m_mapUpdateEvent: Map<number,Array<IDelayCallback>>;
    private m_mapFuncTick: Map<any,Map<Function,number>>;
    private m_mapFuncUpdate: Map<any,Map<Function,number>>;

    private m_iCurrentTick: number;
    private m_iTime: number;

    private m_iUpdateMin: number;
    private m_iUpdateTime: number;

    public constructor(updateMin: number = 1)
    {
        this.m_mapKeyTickEvent = new Map<number,Array<IDelayCallback>>();
        this.m_mapUpdateEvent = new Map<number,Array<IDelayCallback>>();
        this.m_mapFuncTick = new Map<any,Map<Function,number>>();
        this.m_mapFuncUpdate = new Map<any,Map<Function,number>>();
        this.m_iCurrentTick = 0;
        this.m_iTime = 0;
        //设置精度        
        this.m_iUpdateMin = updateMin;
        if(this.m_iUpdateMin > 0)
        {
            this.m_iUpdateTime = 1.0 / this.m_iUpdateMin;
        }
    }

    public Init(): void
    {
        this.m_iCurrentTick = 0;
        this.m_iTime = 0;
    }
    public ClearTargetDelayUpdate(bindObj: any): void
    {
        if(this.m_mapFuncUpdate.get(bindObj))
        {
            this.m_mapFuncUpdate.delete(bindObj);
        }
    }

    public ClearTargetDelayKeyTick(bindObj: any): void
    {
        if(this.m_mapFuncTick.get(bindObj))
        {
            this.m_mapFuncTick.delete(bindObj);
        }
    }

    /**
     * 
     * @param delayCallback 
     */
    public AddDelayKeyTick(bindObj: any,delayCallback: Function,delayTick: number,intervalTime?: number,repeatedTime?: number): void
    {
        console.log("add");
        if(delayTick < 0)
        {
            console.error("KeyTick Delay less than 0!!");
            return;
        }
        let mapFunc: Map<Function,number> = this.m_mapFuncTick.get(bindObj);
        if(!mapFunc)
        {
            mapFunc = new Map<Function,number>();
            this.m_mapFuncTick.set(bindObj,mapFunc);
        }
        this.m_mapFuncTick.get(bindObj).set(delayCallback,this.m_iCurrentTick + delayTick);
        let stDelayCb: IDelayCallback = {bindObject: bindObj,callback: delayCallback};
        if(typeof (intervalTime) != "undefined")
        {
            stDelayCb.intervalTime = intervalTime;
            if(typeof (repeatedTime) != "undefined")
            {
                stDelayCb.repeatedTime = repeatedTime;
            }
        }
        if(!this.m_mapKeyTickEvent.get(this.m_iCurrentTick + delayTick))
        {
            this.m_mapKeyTickEvent.set(this.m_iCurrentTick + delayTick,[]);
        }
        this.m_mapKeyTickEvent.get(this.m_iCurrentTick + delayTick).push(stDelayCb);
    }

    public RemoveDelayKeyTick(bindObj: any,delayCallback: Function): void
    {
        if(this.m_mapFuncTick.get(bindObj))
        {
            this.m_mapFuncTick.get(bindObj).delete(delayCallback);
            if(this.m_mapFuncTick.get(bindObj).size == 0)
            {
                this.m_mapFuncTick.delete(bindObj);
            }
        }
    }

    public Tick(): void
    {
        if(this.m_mapKeyTickEvent.has(this.m_iCurrentTick))
        {
            let vCallback: Array<IDelayCallback> = this.m_mapKeyTickEvent.get(this.m_iCurrentTick);
            for(let i = 0;i < vCallback.length;i++)
            {
                let mapFunc: Map<Function,number> = this.m_mapFuncTick.get(vCallback[i].bindObject);
                if((!mapFunc)
                    || (!mapFunc.get(vCallback[i].callback)
                        || mapFunc.get(vCallback[i].callback) != this.m_iCurrentTick)
                )
                {
                    continue;
                }
                vCallback[i].callback.call(vCallback[i].bindObject);
                if(vCallback[i].repeatedTime)
                {
                    if(vCallback[i].repeatedTime > 0)
                    {
                        vCallback[i].repeatedTime--;
                    }
                    if(!this.m_mapKeyTickEvent.get(this.m_iCurrentTick + vCallback[i].intervalTime))
                    {
                        this.m_mapKeyTickEvent.set(this.m_iCurrentTick + vCallback[i].intervalTime,[]);
                    }
                    this.m_mapKeyTickEvent.get(this.m_iCurrentTick + vCallback[i].intervalTime).push(vCallback[i]);
                    if(mapFunc.get(vCallback[i].callback))
                    {
                        mapFunc.set(vCallback[i].callback,this.m_iCurrentTick + vCallback[i].intervalTime);
                    }
                }
                else
                {
                    this.m_mapFuncTick.get(vCallback[i].bindObject).delete(vCallback[i].callback);
                }
            }
            this.m_mapKeyTickEvent.delete(this.m_iCurrentTick);
        }
        this.m_iCurrentTick++;
    }

    public AddDelayUpdate(bindObj: any,delayCallback: Function,delayTime: number,intervalTime?: number,repeatedTime?: number): void
    {
        if(delayTime < 0)
        {
            console.error("Update Delay less than 0!!");
            return;
        }
        let mapFunc: Map<Function,number> = this.m_mapFuncUpdate.get(bindObj);
        if(!mapFunc)
        {
            mapFunc = new Map<Function,number>();
            this.m_mapFuncUpdate.set(bindObj,mapFunc);
        }
        let iNow = (this.m_iTime * this.m_iUpdateTime) >> 0;
        let iDelay = (delayTime * this.m_iUpdateTime) >> 0;
        mapFunc.set(delayCallback,iNow + ((delayTime * this.m_iUpdateTime) >> 0))
        let stDelayCb: IDelayCallback = {bindObject: bindObj,callback: delayCallback};
        if(typeof (intervalTime) != "undefined")
        {
            stDelayCb.intervalTime = (intervalTime * this.m_iUpdateTime) >> 0;
            if(typeof (repeatedTime) != "undefined")
            {
                stDelayCb.repeatedTime = (repeatedTime * this.m_iUpdateTime) >> 0;
            }
        }
        if(!this.m_mapUpdateEvent.get(iNow + iDelay))
        {
            this.m_mapUpdateEvent.set(iNow + iDelay,[]);
        }
        this.m_mapUpdateEvent.get(iNow + iDelay).push(stDelayCb);
    }
    public RemoveDelayUpdate(bindObj: any,delayCallback: Function): void
    {
        if(this.m_mapFuncUpdate.get(bindObj))
        {
            if(this.m_mapFuncUpdate.get(bindObj).get(delayCallback))
            {
                this.m_mapFuncUpdate.get(bindObj).delete(delayCallback);
            }

        }
    }

    public Update(dt: number): void
    {
        this.m_iTime += dt;
        let iNow: number = this.m_iTime * this.m_iUpdateTime >> 0;
        if(this.m_mapUpdateEvent.get(iNow))
        {
            let vCallback: Array<IDelayCallback> = this.m_mapUpdateEvent.get(iNow);
            for(let i = 0;i < vCallback.length;i++)
            {
                let mapFunc: Map<Function,number> = this.m_mapFuncUpdate.get(vCallback[i].bindObject);
                if((!mapFunc)
                    || (!mapFunc.get(vCallback[i].callback)
                        || mapFunc.get(vCallback[i].callback) != iNow)
                )
                {
                    continue;
                }
                vCallback[i].callback.call(vCallback[i].bindObject);
                if(vCallback[i].repeatedTime)
                {
                    if(vCallback[i].repeatedTime > 0)
                    {
                        vCallback[i].repeatedTime--;
                    }
                    if(!this.m_mapUpdateEvent.get(iNow + vCallback[i].intervalTime))
                    {
                        this.m_mapUpdateEvent.set(iNow + vCallback[i].intervalTime,[]);
                    }
                    this.m_mapUpdateEvent.get(iNow + vCallback[i].intervalTime).push(vCallback[i]);
                    if(mapFunc.get(vCallback[i].callback))
                    {
                        mapFunc.set(vCallback[i].callback,iNow + vCallback[i].intervalTime);
                    }
                }
                else
                {
                    this.m_mapFuncUpdate.get(vCallback[i].bindObject).delete(vCallback[i].callback);
                }
            }
            this.m_mapUpdateEvent.delete(iNow);
        }
    }


}

export interface IDelayCallback
{
    bindObject: any;
    callback: Function;
    intervalTime?: number;
    repeatedTime?: number;
}