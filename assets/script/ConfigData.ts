import UserData from "./data/UserData";

export declare var wx;
/**
 * 所有数据类; 业务逻辑缓存数据类;
 */
export class ConfigData
{
    public static debug:boolean=false;
    
    /**复活屏蔽城市列表 */
    public static readonly shieldCityName: Array<string> = ["北京","上海","深圳","广州"];

    //我的位置;
    public static Mylocal :string;
 
    public static gameMapSize = cc.size(4000,4000);
    public static map_AreaSize =800;
    public static map_max_Gem=13;
    public static map_max_char=3;
    //毫秒；
    public static gemReflushTime=20*1000;
    public static gemReOneflushTime=1000;

    //玩家信息
    public static userData :UserData;


    private static inited:boolean=false;
    public static init():void
    {
        if(ConfigData.inited)return;
        // ConfigData.charPool= new DataPool<CharData>(() => new CharData());
        // ConfigData.charPool.name="charPool";

        ConfigData.inited=true;
        
    }
    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(label:cc.Label){
        if(ConfigData.inited&&ConfigData.debug){
        //   label.string+=ConfigData.charPool.toString();
        //   label.string+=ConfigData.objViewPool.toString();
        }
    }
    // public static PoolTest():void{
    //     let num:number=Core.Random.GetRandom();
    //     //  console.log("Random:"+num);
    //       if(num>950){
    //           ConfigData.charList.forEach((charD:CharData)=>{
    //               charD.recycleSelf();
    //           });
    //           ConfigData.charList=[];
    //           console.log("ResetAllData");
    //       }else if(400<num&&num<=950){
    //           let charD:CharData= ConfigData.charPool.get()
    //           ConfigData.charList.push(charD);
    //           console.log("charPool get"+charD.id);
    //       }else if(ConfigData.charList.length>0){
    //           let charD:CharData=  ConfigData.charList.pop();
    //           console.log("charPool recycleSelf"+charD.id);
    //           charD.recycleSelf();
    //           console.log("charPool recycleSelfOver");
    //       }
    // }

}


