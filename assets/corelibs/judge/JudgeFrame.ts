import { IJudge } from "../interface/IJudge";
/**
 * 判断帧时长;
 */
export class JudgeFrame implements IJudge
{
    private _frame:number;

    constructor(num:number)
    {
        this._frame = num;
    }

    public  judge():boolean
    {
        let bl:boolean = false;
        if (this._frame <= 0)
        {
            bl = false;
        }
        else
            bl = true;
       // this._frame -= Core.deltaTime * Core.FrameRate;
        //帧同步框架 判断都在帧上;
        this._frame -=1;
        return bl;
    }
//         //顿帧时候 要添加 判断帧;
//         public void delayFrame(int frame)
//         {
//             if (_frame > 0)
//             {
//                 _frame += frame;
//             }
//         }
    public  dispose():void
    {

    }
}