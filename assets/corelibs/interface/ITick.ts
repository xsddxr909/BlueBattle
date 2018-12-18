export default interface ITick
{
    Tick(tickCount: number): void;
    GetName?(): string;
}