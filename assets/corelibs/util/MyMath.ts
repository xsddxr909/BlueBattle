import { IWeight } from "../interface/IUpdate";
import Core from "../Core";

export class MyMath
{
    // calculate distance between two points
    public static distance(x1, y1, x2, y2):number {
        return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    }
    /**
     * 角度转向量 (rotation时切记 => vec2 = angleToVec2(-rotation))
     * @param angle 
     */
    public static  RotateToVec2(rotation:number):cc.Vec2 {
    //    return cc.pForAngle(cc.degreesToRadians(rotation)); 
         let angle:number=rotation*Math.PI/180;
        return cc.v2(Math.cos(angle),Math.sin(angle)); 
    }
    /**
     * 方向向量转角度 (rotation时切记 => angle = -vec2ToAngle(vec2))
     * @param angle 
     */
    public static  vec2ToRotate(vec2:cc.Vec2):number {
        return cc.misc.radiansToDegrees(Math.atan2(vec2.y,vec2.x)); 
      //  return vec2.angle(cc.Vec2.ZERO);
    }
      /**
     * 方向向量转角度 (rotation时切记 => angle = -vec2ToAngle(vec2))
     * @param angle 
     */
    public static  xyToRotate(x:number,y:number):number {
        return cc.misc.radiansToDegrees(Math.atan2(y,x)); 
      //  return vec2.angle(cc.Vec2.ZERO);
    }
    /**
     *  转换成360°;
     * @param angle 
     */
    public static  normalAngle(angle:number) {
        angle %= 360;
        if(angle < 0) {
            angle += 360;
        }
        return angle;
    }

    
    // public static GetRotation(forward: cc.Vec2): number
    // {
    //     if(forward.x < 0)
    //     {
    //         return 360 - ((forward.angle(cc.Vec2.UP)) / Math.PI) * 180;
    //     }
    //     return ((forward.angle(cc.Vec2.UP)) / Math.PI) * 180;
    // }
    
    
    public static VecRotate(vec: cc.Vec2,angle: number): cc.Vec2
    {
        return new cc.Vec2(vec.x * Math.cos(angle) - vec.y * Math.sin(angle),vec.y * Math.cos(angle) + vec.x * Math.sin(angle));
    }
    

    /// <summary>
    ///  选择权重....权重为10000时默认优先执行...
    /// </summary>
    /// <param name="list"></param>
    /// <returns></returns>
    public static getRulesWeight(list:Array<IWeight>):IWeight
    {
        if(list.length<=0){
            return null;
        }
        let totalW :number = 0;
        for (let j:number = 0; j < list.length; j++)
        {
            if (list[j].weight == 10000)
            {
                return list[j];
            }
            totalW += list[j].weight;
        }
        //当前最大刻度....
        let ran:number = (Core.Random.GetRandom()* totalW)>>0;
        let startNum:number = 0;
        for (let i1:number = 0; i1 < list.length; i1++)
        {
            let addNum:number = list[i1].weight;
            if (ran >= startNum && ran < startNum + addNum)
            {
                return list[i1];
            }
            startNum += addNum;
        }
        //      Debug.Log("selectIdx" + selectIdx);
        return list[0];
    }
    /// <summary>
    ///  选择权重....权重为10000时默认优先执行...
    /// </summary>
    /// <param name="list"></param>
    /// <returns></returns>
    public static getRulesWeightIdx(list:Array<number>):number
    {
        if(list.length<=0){
            return null;
        }
        let totalW :number = 0;
        for (let j:number = 0; j < list.length; j++)
        {
            if (list[j] == 10000)
            {
                return j;
            }
            totalW += list[j];
        }
        //当前最大刻度....
        let ran:number = (Core.Random.GetRandom()* totalW)>>0;
        let startNum:number = 0;
        for (let i1:number = 0; i1 < list.length; i1++)
        {
            let addNum:number = list[i1];
            if (ran >= startNum && ran < startNum + addNum)
            {
                return i1;
            }
            startNum += addNum;
        }
        //      Debug.Log("selectIdx" + selectIdx);
        return 0;
    }
}
