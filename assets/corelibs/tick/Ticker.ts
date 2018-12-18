import ITick from "../interface/ITick";
import CoreConfig from "../CoreConfig";
import {TickMode} from "../CoreDefine";
import DelayTimer from "./DelayTimer";
import { IUpdate } from "../interface/IUpdate";
/**
 * 更新列表，逻辑帧
 */
export default class Ticker
{
    /**是否在同步 */
    private m_bIsRuning: boolean;
    /**已运行帧数 */
    private m_iTickCount: number;
    /**需要延迟添加的keytick */
    private m_vBeAddKeyTickList: Array<ITick>;  //延迟添加
    /**需要延迟删除的keytick */
    private m_vBeRemoveKeyTickList: Array<ITick>;   //延迟移除
    /**帧同步逻辑（帧同步相关的） */
    private m_vKeyTickList: Array<ITick>;   //同步逻辑的处理

    /**需要更新的类注册的tick（跟帧同步无关的） */
    private m_vUpdateList: Array<IUpdate>;
    /**定长的tick列表，整个程序周期都需要tick的类注册在这里 */
    private m_vFixedTickList: Array<ITick>;
    /**ticker已运行的时间 */
    private m_iRunTime: number;
    /**帧率(FPS) */
    private m_iFrameRate: number;
    /**每一帧的时间长度 */
    private m_iFrameTime: number;
    /**暂停帧数 */
    private m_iBePauseTick: number;

    /**最后一帧 */
    private m_iTerminalTick: number;

    /**追帧速度 */
    private m_iSpeed: number;

    /**计划任务 */
    private m_stDelayTimer: DelayTimer;

    public constructor(frameRate: number,fixedTickLength: number)
    {
        this.m_iTickCount = 0;
        this.m_iRunTime = 0;
        this.m_iFrameRate = frameRate;
        this.m_iFrameTime = (1000 / frameRate) >> 0;
        this.m_vUpdateList = new Array<IUpdate>();
        this.m_vFixedTickList = new Array<ITick>();
        this.m_vBeAddKeyTickList = new Array<ITick>();
        this.m_vBeRemoveKeyTickList = new Array<ITick>();
        this.m_vKeyTickList = new Array<ITick>();
        this.m_bIsRuning = false;
        this.m_iBePauseTick = 0;
        this.m_stDelayTimer = new DelayTimer();
        this.m_stDelayTimer.Init();
    }

    public set TerminalTick(tickCount: number)
    {
        this.m_iTerminalTick = tickCount;
    }

    /**
     * 第几帧
     */
    public get TickCount(): number
    {
        return this.m_iTickCount;
    }

    /**
     * 运行的时间
     */
    public get RunTime(): number
    {
        return this.m_iRunTime;
    }

    /**
     * 暂停一定逻辑帧后继续运行
     * @param numTick 
     */
    public Pause(numTick: number): void
    {
        this.m_iBePauseTick = numTick;

    }

    /**
     * 继续同步
     */
    public Continue(): void
    {
        this.m_bIsRuning = true;
    }

    /**
     * 立即暂停同步
     */
    public Stop(): void
    {
        this.m_bIsRuning = false;
    }

    /**
     * 开始同步
     */
    public Start(): void
    {
        this.m_iTickCount = 0;
        this.m_iRunTime = 0;
        this.m_iBePauseTick = 0;
        this.m_iTerminalTick = -1;
        this.m_bIsRuning = true;
    }
    /**
     * 不需要同步的操作注册于此（重复添加只保留一个，不会被ClearAllKeyTick清除）
     * @param tick 实现了IUpdate接口的类
     */
    public AddUpdate(tick: IUpdate): void
    {
        if(this.m_vUpdateList.indexOf(tick) >= 0)
        {
            return;
        }
        this.m_vUpdateList.push(tick);
    }

    /**
     * 移除通过AddUpdate注册的类
     * （请勿在AddTick添加的Tick中调用，否则有可能出现Tick顺序错误）
     * @param tick 实现了IUpdate接口的类并且用AddTick所注册的
     */
    public RemoveUpdate(tick: IUpdate): void
    {
        let iIndex = this.m_vUpdateList.indexOf(tick);
        let iLength = this.m_vUpdateList.length;
        if(-1 == iIndex || iLength == 0)
        {
            return;
        }
        this.m_vUpdateList[iIndex] = this.m_vUpdateList[iLength - 1];
        this.m_vUpdateList.length = iLength - 1;
    }


    /**
     * 添加同步操作（重复添加只保留一个，keyTick内可以调用RemoveKeyTick）
     * @param tick 实现了ITick接口的类
     */
    public AddKeyTick(tick: ITick): void
    {
        if(this.m_vBeAddKeyTickList.indexOf(tick) >= 0)
        {
            return;
        }
        this.m_vBeAddKeyTickList.push(tick);
    }

    /**
     * 移除同步操作
     * @param tick 实现了ITick接口的类
     */
    public RemoveKeyTick(tick: ITick): void
    {
        this.m_vBeRemoveKeyTickList.push(tick);
    }


    private DelayAddKeyTick(): void
    {
        for(let i in this.m_vBeAddKeyTickList)
        {
            this.m_vKeyTickList.push(this.m_vBeAddKeyTickList[i]);
        }
        this.m_vBeAddKeyTickList.length = 0;
    }

    private DelayRemoveKeyTick(): void
    {
        while(this.m_vBeRemoveKeyTickList.length > 0)
        {
            let tick: ITick = this.m_vBeRemoveKeyTickList.pop();
            let iIndex: number = this.m_vKeyTickList.indexOf(tick);
            let iLength: number = this.m_vKeyTickList.length;
            if(iIndex != -1 && iLength > 0)
            {
                this.m_vKeyTickList[iIndex] = this.m_vKeyTickList[iLength - 1];
                this.m_vKeyTickList.length = iLength - 1;
            }
        }
    }

    /**
     * 跟同步无关的，按顺序执行的操作
     * @param index 执行的顺序下标(从0开始计数)
     * @param tick 实现了ITick的类
     */
    public AddFixedTickAt(index: number,tick: ITick): void
    {
        this.m_vFixedTickList[index] = tick;
    }

    /**
     * 清除所有同步逻辑（清除所有keyTick）
     */
    public ClearAllKeyTick(): void
    {
        this.m_vKeyTickList.length = 0;
        this.m_vBeAddKeyTickList.length = 0;
        this.m_vBeRemoveKeyTickList.length = 0;
    }

    /**
     * 清空所有表现逻辑（清空所有Update）
     */
    public ClearAllUpdate(): void
    {
        this.m_vUpdateList.length = 0;
    }

    /**
     * 清空 m_vKeyTickList和m_vUpdateList,
     * 不清空m_vFixedTickList
     */
    public ClearAll(): void
    {
        this.ClearAllKeyTick();
        this.ClearAllUpdate();
    }

    /**
     * 同步信号
     * @param dt 
     */
    public Signal(dt: number): void 
    {
        this.m_stDelayTimer.Update(dt);
        if(!this.m_bIsRuning || 0 == dt || isNaN(dt))
        {
            return;
        }
        this.DoTick(dt);
        this.m_iRunTime += dt;
        if(CoreConfig.TICK_MODE == TickMode.StepLockMode && this.m_iTickCount > this.m_iTerminalTick)
        {
            return;
        }
        if(this.m_iBePauseTick > 0)
        {
            this.m_iBePauseTick--;
            return;
        }
        let iTickTime: number = CoreConfig.TICK_SPEED;
        switch(CoreConfig.TICK_MODE)
        {
            case TickMode.StepLockMode:
                while(this.m_bIsRuning
                    && this.m_iTickCount <= this.m_iTerminalTick
                    && iTickTime > 0)
                {
                    this.DelayAddKeyTick();
                    this.DoKeyTick();
                    this.DelayRemoveKeyTick();
                    iTickTime--;
                }
                break;
            case TickMode.StandAlone:
                while(this.m_bIsRuning
                    && this.m_iRunTime * 1000 >= this.m_iTickCount * this.m_iFrameTime
                    && iTickTime > 0)
                {
                    this.DelayAddKeyTick();
                    this.DoKeyTick();
                    this.DelayRemoveKeyTick();
                    iTickTime--;
                }
            default:
                break;
        }
    }

    private DoTick(dt: number): void
    {
        if(false == this.m_bIsRuning)
        {
            return;
        }

        for(let tick of this.m_vFixedTickList)
        {
            tick.Tick(this.m_iTickCount);
        }
        for(let tick of this.m_vUpdateList)
        {
            tick.Update(dt);
        }
    }

    private DoKeyTick(): void
    {
        if(false == this.m_bIsRuning)
        {
            return;
        }
        this.m_stDelayTimer.Tick();
        for(let tick of this.m_vKeyTickList)
        {
            tick.Tick(this.m_iTickCount);
        }
        ++this.m_iTickCount;
    }

    public GetTickerDetail(): string
    {
        let sDetail: string = "Ticker::";
        let iLength = this.m_vFixedTickList.length;
        sDetail += "\n" + "每一帧执行：FixedTickList:lenght:" + iLength;
        for(let tick of this.m_vFixedTickList)
        {
            sDetail += "\n    " + tick.GetName();
        }
        return sDetail;
    }

    public get DelayTimer(): DelayTimer
    {
        return this.m_stDelayTimer;
    }

}


