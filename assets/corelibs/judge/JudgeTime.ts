import { IJudge } from "../interface/IJudge";
import Core from "../Core";
/**
 * 判断帧时长;
 */
export class JudgeTime implements IJudge
{
    private m_fLiftTime:number;

    constructor(fLiftTime:number)
    {
        this.m_fLiftTime = fLiftTime;
    }

    public  judge():boolean
    {
        let bl:boolean = false;
        if (this.m_fLiftTime <= 0)
        {
            bl = false;
        }
        else
            bl = true;
        //帧同步框架 判断都在帧上;
        this.m_fLiftTime -= Core.deltaTime;
        return bl;
    }
    public  dispose():void
    {

    }
}