import ISdkCallback from "./ISdkCallback";

export default interface ISdkUserInfoCb
{
    WithCredentials?: boolean;
    Language?: string;
    Callback?: ISdkCallback;
}