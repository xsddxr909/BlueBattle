import ISdkCallback from "./ISdkCallback";

export default interface IShareAppMsg
{
    /**分享的题目 */
    Title: string;
    /**分享的封面图片url */
    ImageUrl?: string;
    /**查询字段（仅微信可用） */
    Query?: string;

}

export enum SdkShareType
{
    QQ_FRIEND = 0,
    QQ_ZONE = 1,
    WX_FRIEND = 2,
    WX_MOMENTS = 3,
}