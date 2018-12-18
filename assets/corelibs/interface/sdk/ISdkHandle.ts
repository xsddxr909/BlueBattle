import {ShareAppMsg} from "../../sdk/wxgame/SdkObject";
import {VibrateType} from "../../sdk/SdkType";


export default interface ISdkHandle
{
    Login(): void;
    Init(): void;
    Share(appMsg: ShareAppMsg): void;
    Pay(price: number): void;
    Vibrate(vbType: VibrateType): void;
}

