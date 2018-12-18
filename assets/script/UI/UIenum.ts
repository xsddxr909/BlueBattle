import {UIEnumBase} from "../../corelibs/uiframe/UIMgr";

/***
 *  UI 枚举 UIEnumBase
 */
export  class UIEnum 
{
    //场景切换界面
    public static  LoadingWin:string = UIEnumBase.LoadingWin;
    //UI加载文字 进度
    public static LoadingText:string  = UIEnumBase.LoadingText;
    //UI登录界面
    public static UILogin:string  ='UILogin';
     //UI 摇杆
     public static UIJoystick:string  ='UIJoystick';
     //UI 技能按钮
     public static UISkillBtn:string ='UISkillBtn';
     //返回登录按钮 
     public static UIBackToLogin: string ='UIBackToLogin';
}

/***
 *  Scene 枚举 
 */
export  class SceneEnum 
{
    //登录场景
    public static  LoginScene:string = 'LoginScene';
    //游戏场景
    public static GameScene:string  =  'GameScene';
 
}