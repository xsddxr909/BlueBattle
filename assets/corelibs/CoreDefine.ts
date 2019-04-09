

export enum ResType
{
    SpineRes = 0,
    BitmapRes = 1,
    Prefab = 2,
    AudioClip = 3,
    TextAsset = 4,
    JsonAsset =5,
    AnyUrl =6,
}


export enum Music
{
    MusicVolume = "MusicVolume",
    SoundVolume = "SoundVolume",
    MusicMute = "MusicMute",
    SoundMute = "SoundMute",
}

export enum AudioType
{
    Music = 0,
    Sound = 1,
}
export enum EventType
{
    LoadScene = 100000,
    LoadSceneOver = 100001,
    LoadProgress = 100002,
}
/**
 * 事件系统的ID
 */
export class EventID
{
    //                              >=1000000
    private static m_iNewID: number = 66666666;
    public static get CreateID(): number
    {
        return ++EventID.m_iNewID;
    }
    /**  */
    public static readonly LoadEvent = cc.Enum({
        /**加载进度事件 */
        LOAD_PROGRESS: EventID.CreateID,
        /**加载完成事件 */
        LOAD_COMPLETED: EventID.CreateID,
    })
    public static readonly SceneEvent = cc.Enum({
        /**加载场景 */
        LOAD_SCENE: EventID.CreateID,
        /**场景加载完成 */
        LOAD_SCENE_COMPLETED: EventID.CreateID,
    })
    public static readonly HttpEvent = cc.Enum({
        /**登录信息的回复 */
        RSP_LOGIN: EventID.CreateID,

        RSP_GETUSERINFO: EventID.CreateID,
    })
    public static readonly SdkEvent = cc.Enum({
        /**拉取用户信息成功 */
        CB_SUCCESS_USER_INFO: EventID.CreateID,
        /**拉取用户信息失败 */
        CB_FAIL_USER_INFO: EventID.CreateID,
        /**拉取用户信息完成 */
        CB_COMPLETE_USER_INFO: EventID.CreateID,

        /**微信登陆成功 */
        CB_SUCCESS_LOGIN: EventID.CreateID,
        /**微信登陆失败 */
        CB_FAIL_LOGIN: EventID.CreateID,
        /**微信登陆操作完成 */
        CB_COMPLETE_LOGIN: EventID.CreateID,

        /**分享操作完成 */
        CB_SHARE: EventID.CreateID,
        /**分享成功*/
        CB_SHARE_SUCCESS: EventID.CreateID,

        /**截图回调 */
        CB_SUCCESS_CAPTURESELF: EventID.CreateID,
        CB_FAIL_CAPTURESELF: EventID.CreateID,
        CB_COMPLETE_CAPTURESELF: EventID.CreateID,
        /**自定义图片回调 */
        CB_SUCCESS_CREATECANVAS: EventID.CreateID,
        CB_FAIL_CREATECANVAS: EventID.CreateID,
        CB_COMPLETE_CREATECANVAS: EventID.CreateID,

        /**游戏运行后，重新显示时的事件 */
        ON_SHOW: EventID.CreateID,

        /**进入游戏 */
        ENTER_GAME: EventID.CreateID,
        /**重连信号 */
        RECONNECT_SIGNAL: EventID.CreateID,
        /**断线重连 */
        RECONNECT_GAME: EventID.CreateID,
        /**重连成功 */
        RECONNECT_SUCCESS: EventID.CreateID,
        /**重连失败 */
        RECONNECT_FAIL: EventID.CreateID,

        /**更新金币成功 */
        UPDATEGOINCOIN_SUCCESS :  EventID.CreateID,
        /**更新金币失败 */
        UPDATEGOINCOIN_FAIL :  EventID.CreateID,
        /**更新复活币成功 */
        UPDATERESCURCOIN_SUCCESS : EventID.CreateID,
        /**更新复活币失败 */
        UPDATERESCURCOIN_FAIL : EventID.CreateID,
    })
}


export enum TickMode
{
    StepLockMode = 0,
    SyncMode = 1,
    StandAlone = 2,
}

export enum HTTP_ID
{
    LOGIN = "App.Auth_Login.Wechat",
    SAVEUSERINFO = "App.User_PlayerInfo.Update",
    GETUSERINFO = "App.User_PlayerInfo.Get",
}