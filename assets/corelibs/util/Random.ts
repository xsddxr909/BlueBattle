export default class Random
{
    private  m_arrIntNumbers:Array<number>;
    private  m_arrNumbers:Array<number>;
    private m_iCurrentIndex: number = 0;
    private m_beginSeed:number;
    //随机种子;
    private m_iSeedNumber: number;
    private m_iLength: number;
    private max:number;
    constructor()
    {

    }
    /**
     * 
     * @param iSeede 种子
     * @param iLength 缓存长度; 
     * @param max  最大值;
     */
    public Init(iSeede: number = 19,iLength: number = 4000,max:number=10000): void
    {
        cc.log("random.Init iSeede",iSeede);
        this.m_arrNumbers = new Array<number>();
        this.m_arrIntNumbers= new Array<number>();
        this.m_iSeedNumber = iSeede;
        this.m_beginSeed=iSeede;
        this.max=max;

       for (let i = 0; i <iLength; i++) {
           const num:number=this.SeedeRandom();
          this.m_arrNumbers.push(num);
          this.m_arrIntNumbers.push((num * this.max) >> 0);
       }
       this.m_iCurrentIndex=0;
  //     cc.log("arr:",this.m_arrNumbers,Date.now());
 //      cc.log("m_arrIntNumbers:",this.m_arrIntNumbers,Date.now());
    }

    public SetSeedIndex(index: number): void
    {
        this.m_iCurrentIndex = index;
    }

    /**
     * 获得一个随机数;
     * @param num 是否小数类型(否返回 max 整数); true 0.8468 false 8468
     */
    public GetRandom(num:boolean=true): number
    {
        if(num){
            if(this.m_iCurrentIndex>this.m_arrNumbers.length){
                this.m_iCurrentIndex=0;
            }
            return  this.m_arrNumbers[this.m_iCurrentIndex++];
        }else{
            if(this.m_iCurrentIndex>this.m_arrIntNumbers.length){
                this.m_iCurrentIndex=0;
            }
            return  this.m_arrIntNumbers[this.m_iCurrentIndex++];
        }
    }

    public GetLength(): number
    {
        return this.m_iLength;
    }

    public GetRandomByIndex(index: number): number
    {
        return this.m_arrNumbers[index];
    }
     public GetRandomIntByIndex(index: number): number
    {
        return this.m_arrIntNumbers[index];
    }

    private SeedeRandom(): number
    {
        this.m_iSeedNumber = (this.m_iSeedNumber * 9301 + 49297) % 233280;
        let rnd = this.m_iSeedNumber / 233280.0;
        return rnd;
    }
    public getSeedNumber(){
        return this.m_iSeedNumber;
    }
    public getBeginSeed(){
        return this.m_beginSeed;
    }
    public getSeedIndex(){
        return this.m_iCurrentIndex;
    }
}
