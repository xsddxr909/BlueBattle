import {TickMode} from "./CoreDefine";

export default class CoreConfig
{
    // Debug Log
    public static DEBUG: boolean = true;        // 是否开启Debug模式
    public static IS_ONLY_CLIENT: boolean = false;  // 是否单机

    // Game
    public static GAME_ID: number = 7;          // 游戏标识ID
    public static GAME_WIDTH: number =1280; //720;     // 客户端宽度
    public static GAME_HEIGHT: number =720;// 1280;   // 客户端长都

    // Group
    public static GROUP_ID: number = 1;


    public static readonly GAME_FPS: number = 60;
    public static TICK_MODE: TickMode = TickMode.StandAlone;
    public static readonly FIXED_LENGTH: number = 10;
    public static TICK_SPEED: number = 10;//每次信号最多追帧

    public static API_SECRET = "jsl3JKL380934LO)21mhjs#@!JU";

    public static H5_URL: string = "ws://42.62.22.164:11000";//H5地址
    //public static H5_URL: string = "ws://10.0.128.146:11000";
    public static WeCat_URL: string = 'https://thktest.123u.com/index.php';//微信地址
    // public static WeCat_URL: string = 'https://h5auth.123u.com/index.php';//微信地址   
}

