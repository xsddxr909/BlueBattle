import { IJudge, ILinker } from "../interface/IJudge";
/**
 * 位置跟随;
 */
export class Linker_Pos implements ILinker
{
    private _linker:cc.Node;
    private _target:cc.Node;
    private  _offset:cc.Vec2;
    
    constructor(linker:cc.Node,target:cc.Node,offset:cc.Vec2)
    {
        this._linker = linker;
        this._target = target;
        this._offset = offset;
    }
    
    public doLink(): boolean {
        if (this._linker == null || this._target == null) return true;
        this._linker.position = this._target.position.add(this._offset);
        return false;

    }
    public  dispose():void
    {
        this._linker =null;
        this._target =null;
        this._offset =null;
    }
}