export default interface IStepLockInput
{
    OnKeyReceive(inputUserId: number,keyType: number,keyValue: number): void;
}