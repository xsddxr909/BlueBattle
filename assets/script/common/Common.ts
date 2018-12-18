export module Common {
    const EPS : number = 1e-5;
    export function IsZero(n : number) : boolean {
        return n < EPS && n > -EPS;
    }
    export function GreatOrEqualZero(n : number) : boolean {
        return n > -EPS;
    }
    export function LessOrEqualZero(n : number) : boolean {
        return n < EPS;
    }
    export function GreatZero(n : number) : boolean {
        return n >= EPS;
    }
    export function LessZero(n : number) : boolean {
        return n <= -EPS;
    }

    /**
     * 加速度公式，算出在dt的间隔中运动的距离。
     * @param v0 初速度
     * @param a  加速度
     * @param t  已经运动的时间
     * @param dt 经过的时间差
     */
    export function GetDistance(v0 : number, a : number, t : number, dt : number) : number {
        return (v0 - 0.5 * a * dt - a * t) * dt;
    }
}
