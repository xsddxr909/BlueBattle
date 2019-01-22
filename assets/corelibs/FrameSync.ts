import { RecycleAble } from "./util/Pool";
import Core from "./Core";
export default class FrameSync extends RecycleAble {
    /**
     * 是否单机;
     */
    public isPlayAlone=false;

    private _currRenderFrameId:number = 0;
    public get currRenderFrameId():number {
        return this._currRenderFrameId;
    }
    private _avgDelay:number = 0;
    private _delayCount = 30;  
     // 补帧系数，影响漂移感  60帧 1  30帧 2; 15帧 4;
    private _driftFactor = 2;
    private _endRenderFrameId:number = 0;
    private clientStartFrameTime:number = 0;
    private _serverFrameDelta = 66;
    /**
     * 帧同步定时回调
     */
    private _fixScheduleList:Function[] = [];
    ///1秒多少帧; 帧同步帧数 
    private _clientFrameDelta:number = 30;
    //每帧 间隔  秒;
    private _clientDeltaTime:number;
    //每帧 间隔 毫秒
    private delta1000:number;
    //帧同步更新方法;
    private _updateFun:Function;
    
    private frameSpeed:number=1;
    private MIN_FRAME_SPEED:number=1;
    private MAX_FRAME_SPEED:number=16;

    //单机统计dt
    private aloneDt:number;

    private _didRecFrame = false;
    private _laseRecTime = 0;

    /**
     * 录像回播 用 eg:10倍速度  没帧 模拟更新10次 每次输入 1次关键帧;
     */
    public get FrameSpeed(){
        return this.frameSpeed;
    }
    public set FrameSpeed(value:number)
    {
        this.frameSpeed = cc.misc.clampf(value, this.MIN_FRAME_SPEED, this.MAX_FRAME_SPEED);
   //     if (!this.isPlayAlone)
   //     {
            //帧同步下 重新 调整开始时间;
            this.ResetStartTime();
  //      }
    }
    //游戏开始时间;
    public  getStartTime(){
         return  this.clientStartFrameTime;
    }
    //游戏当前时间；
    public  getNowTime(){
        return  this.clientStartFrameTime+this._currRenderFrameId * this.delta1000;
   }
    public  ResetStartTime():void
    {
        // if (!this.isPlayAlone)
        // {
           
            this.clientStartFrameTime = (cc.sys.now() * this.frameSpeed - this._currRenderFrameId * this.delta1000 ) / this.frameSpeed;
        // }
        // else
        // {
        //     this.clientStartFrameTime = Time.time - LogicFrameTick * 0.001f + Time.deltaTime;
        // }
    }
    //初始化
    initialize(updateFun:Function) {
        this._updateFun = updateFun;
        this._currRenderFrameId=0;
        this._clientDeltaTime=1/this._clientFrameDelta;
        this._clientDeltaTime=(this._clientDeltaTime*1000 >>0)/1000;
        this.delta1000= this._clientDeltaTime*1000 ;
      //  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>!!!!!!!",this._clientDeltaTime,this.delta1000);
        Core.FrameSync=this;
        this.aloneDt=0;
        this._endRenderFrameId=0;
    }

    //解析包
    _parseReceiveFrameList() {
        // const delta = cc.sys.now() - this._laseRecTime;
        // if (this._ctrl && this._ctrl.notifyAvgDelay) this._ctrl.notifyAvgDelay(delta);
        // this._laseRecTime = cc.sys.now();

        // for(let frameData of frameList){
        //     let parseFrameData = this._receiveFrameData[frameData.FrameID];
        //     if(!parseFrameData) {
        //         parseFrameData = {} as FrameData;
        //         this._receiveFrameData.push(parseFrameData);
        //     }
        //     parseFrameData[frameData.UID] = frameData;
        //     let frameId = frameData.FrameID;
        //     this._endRenderFrameId = Math.max(this._endRenderFrameId,frameId);
        // }
       

        // if(this._didRecFrame == false) {
        //     this._didRecFrame = true;
        //     const firstReceiveFrameId = frameList[0].FrameID;
        //     this._currRenderFrameId = firstReceiveFrameId;
        //     this.clientStartFrameTime = cc.sys.now();
        // }
    }


   
    //逐帧更新 
    update(dt:number) {
        if (this.clientStartFrameTime==0) return;
        this._playAloneUpdate(dt);

        let frameDiff = (this._endRenderFrameId - this._currRenderFrameId) / this._driftFactor;

        let tryToExecFrameNum:number = cc.misc.clampf(frameDiff,1,100);

        //c端运行时间
        let clientCurrFrameTime = cc.sys.now() - this.clientStartFrameTime;

        //s端回包时间间隔
        let serverDelayFrameTime = clientCurrFrameTime - (this._endRenderFrameId + 1) * this.delta1000;
     //   cc.log('serverDelayFrameTime --- ',serverDelayFrameTime);
        //计算平均延时
        let avgDelay= this._calAvgDelay(serverDelayFrameTime);

     //   cc.log('avgDelay --- ',avgDelay);
        clientCurrFrameTime*=this.frameSpeed;
      //  cc.log('clientCurrFrameTime --- ',clientCurrFrameTime);

  
     //   cc.log('tryToExecFrameNum --- ', tryToExecFrameNum);
        while(tryToExecFrameNum > 0) {
            let preFrameTick = this._currRenderFrameId * this.delta1000;
            let delta = clientCurrFrameTime - preFrameTick;
            delta -= avgDelay;
     //       cc.log('tryToExecFrame delta --- ', delta,this.delta1000);
            if(delta >= this.delta1000) {
     //           cc.log('tryToExecFrame in --- ');
                if(this.currRenderFrameId > this._endRenderFrameId){
                    tryToExecFrameNum = 0;
                    continue;
                }
                this._execFrame(this._clientDeltaTime,this._currRenderFrameId);
                this._currRenderFrameId++;
                tryToExecFrameNum--;
            }else{
                tryToExecFrameNum = 0;
            }
        }
    }
    _playAloneUpdate(dt:number){
        if(this.isPlayAlone){
            this.aloneDt+=(dt*1000>>0);
        //    cc.log('this.aloneDt --- ',this.aloneDt);
            while(this.aloneDt>=this._serverFrameDelta){
                this.aloneDt-=this._serverFrameDelta;
                this._endRenderFrameId+=2;
            }
        }
    }
    //执行帧逻辑
    _execFrame(dt,currRenderFrameId) {
        this._execFrameForCtrl(dt,currRenderFrameId);
        this._execFrameForFixSchedule(currRenderFrameId);
    }

    //执行代理帧逻辑
    _execFrameForCtrl(dt:number,currRenderFrameId:number) {
     //   let frameData = this._receiveFrameData[currRenderFrameId];
        //处理命令逻辑 业务逻辑更新;
        if(this._updateFun!=null){
            this._updateFun(dt);
        } 
       // && this._updateFun.exec(dt,currRenderFrameId,frameData);
    }

    //执行帧同步定时器
    _execFrameForFixSchedule(currRenderFrameId:number) {
        let shouldDeleteFuncList:Function[] = [];
        for(let i = this._fixScheduleList.length - 1,l = 0;i>=l;i--) {
            const func = this._fixScheduleList[i];
            const keyFrame = func[`_$keyFrame`] as number;
            const delayFrame = func[`_$startFrame`] as number;
            let repeat = func[`_$repeat`] as number;
            const diffFrame = (currRenderFrameId - delayFrame);
            if(diffFrame >= 0 && (keyFrame === 0 || diffFrame % keyFrame === 0)) {
                if(repeat > 0) {
                    repeat--;
                    if(repeat === 0){
                        shouldDeleteFuncList.push(func);
                    }
                    func[`_$repeat`] = repeat;
                }
                func();
            }
        }
        for(let shouldDeleteFunc of shouldDeleteFuncList) {
            this.syncUnschedule(shouldDeleteFunc);
        }
    }

    //计算平均延时
    _calAvgDelay(delayMs:number) {
        let currPackDelay = Math.max(0,delayMs);
        let avgDelay = this._avgDelay;
        let delayCount = this._delayCount;
        if (avgDelay < 0){
            avgDelay = currPackDelay;
        }
        else{
            avgDelay = ((delayCount - 1) * avgDelay + currPackDelay) / delayCount;
        }
        this._avgDelay = avgDelay;
        return avgDelay;
    }

    syncSchedule(func:Function,time:number = 0,delay:number = 0,repeat:number = -1) {
        if(repeat === 0) {
            return;
        }
        const keyFrame = (time * this._clientFrameDelta) >> 0;
        const delayFrame = (delay * this._clientFrameDelta) >> 0;
        func[`_$keyFrame`] = keyFrame
        func[`_$startFrame`] = this._currRenderFrameId + keyFrame + delayFrame;
        func[`_$repeat`] = repeat;
        if(this._fixScheduleList.indexOf(func) === -1) {
            this._fixScheduleList.push(func);
        }
    }

    syncScheduleOnce(func:Function,time:number = 0) {
        this.syncSchedule(func, time, 0, 1);
    }

    syncUnschedule(func) {
        let idx = this._fixScheduleList.indexOf(func);
        if(idx !== -1){
            this._fixScheduleList.splice(idx,1);
            delete func[`$keyFrame`]
            delete func[`$startFrame`]
            delete func[`$repeat`]
        }
    }

    syncUnscheduleAll() {
        for(let i = this._fixScheduleList.length-1,l=0;i>=l;i--) {
            let func = this._fixScheduleList[i];
            this.syncSchedule(func);
        }
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
      Core.FrameSync=null;
      this._updateFun=null;
      super.onRecycle();
    }  
    /**
     *回收; 
     **/ 
    Release(): void {
        this._updateFun=null;
        super.Release();
    }
}



