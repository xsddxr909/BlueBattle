export enum SdkType
{
    None = 0,
    WeChat = 1,
    Wanba = 2,

}

export enum AuthType
{
    /**用户信息 */
    USER_INFO = 'scope.userInfo',

    /**地理位置 */
    USER_LOACTION = 'scope.userLocation',

    /**录音功能 */
    RECORD = 'scope.record',

    /**摄像头 */
    CAMERA = 'scope.camera',

    /**保存图片到相册 */
    SAVE_PHOTOS = 'scope.writePhotosAlbum',
}

export enum DataType
{
    RankConfig = "rankConfig",
}

export enum ImageUrlType
{
    /**本地 */
    LOCAL = "share/",
    /**网络上获取 */
    NET = "",
}

export enum ShareCbType
{
    /**成功分享到群 */
    SUCCESS_GROUP = 0,
    /**成功分享给单独用户 */
    SUCCESS_SINGLE = 1,
    /**用户取消分享 */
    FAIL_CANCEL = 2,
    /**小游戏缺少权限（没填对appid） */
    FAIL_PERMISSION = 3,
    /**未知的失败原因 */
    FAIL_UNKNOWN = 4,
}

export enum Gender
{
    UNKNOWN = 0,
    MAN = 1,
    WOMEN = 2,
}

export enum AvatorIconSize
{
    Size640 = 0,
    Size46 = 46,
    Size64 = 64,
    Size96 = 96,
    SIze132 = 132,
}

export enum VibrateType
{
    SHORT = 0,
    LONG = 1,
}

export enum MessageType
{
    ShowFriendRank = 0,
    ShowGroupRank = 1,
    SetRankConfig = 2,
    ShowSelfRank = 3,
    PrePage = 100,
    NextPage = 101,
    RestCurrPage = 102,
    Horizontal = 200,
    Vertical = 201,
}

export enum UserInfoButtonType
{
    Text = "text",
    Image = "image",
}

export enum TextAlign
{
    Left = "left",
    Center = "center",
    Right = "right",
}