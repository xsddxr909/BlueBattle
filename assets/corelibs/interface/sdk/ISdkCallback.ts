export default interface ISdkCallback
{
    /**成功时的回调函数 */
    OnSuccess?(): void;
    /**失败时的回调函数 */
    OnFail?(): void;
    /**完成时的回调函数（无论成功失败都会执行） */
    OnComplete?(): void;
}