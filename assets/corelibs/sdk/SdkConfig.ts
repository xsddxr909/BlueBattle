import {SdkType} from "./SdkType";

export default class SdkConfig
{
    public static readonly SDK_TYPE: SdkType = SdkType.WeChat;
    public static readonly DEFAULT_SHARE_TITLE: string = "史莱姆躲躲躲";
    public static readonly DEFAULT_SHARE_PIC_URL: string = undefined;
    public static readonly USE_OPEN_DATA: boolean = true;
}