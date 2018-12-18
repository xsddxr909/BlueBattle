export class CodeEngine
{
    public static encode_int64(bfView: Uint8Array,index: number,value: number): number
    {
        if(value < 0) value += Math.floor(Math.pow(256,8));
        for(var i = 7;i >= 0;i--)
        {
            bfView[index + i] = value % 256;
            value /= 256;
        }
        return index + 8;
    }

    public static decode_int64(bfView: Uint8Array,index: number): number
    {
        let res: number = 0;
        for(let i = 0;i < 8;i++)
        {
            res = res * 256 + bfView[index + i];
        }
        return res;
    }
    public static encode_int32(bfView: Uint8Array,index: number,value: number): number
    {
        if(value < 0) value += Math.floor(Math.pow(256,4));
        for(var i = 3;i >= 0;i--)
        {
            bfView[index + i] = value % 256;
            value /= 256;
        }
        return index + 4;
    }

    public static decode_int32(bfView: Uint8Array,index: number): number
    {
        let res: number = 0;
        for(let i = 0;i < 4;i++)
        {
            res = res * 256 + bfView[index + i];
        }
        return res;
    }

    public static encode_int16(bfView: Uint8Array,index: number,value: number): number
    {
        if(value < 0) value += Math.floor(Math.pow(256,2));
        for(var i = 1;i >= 0;i--)
        {
            bfView[index + i] = value % 256;
            value /= 256;
        }
        return index + 2;
    }

    public static decode_int16(bfView: Uint8Array,index: number): number
    {
        let res: number = 0;
        for(let i = 0;i < 2;i++)
        {
            res = res * 256 + bfView[index + i];
        }
        return res;
    }

    public static encode_int8(bfView: Uint8Array,index: number,value: number): number
    {
        if(value < 0) value += Math.floor(Math.pow(256,1));
        for(var i = 0;i >= 0;i--)
        {
            bfView[index + i] = value % 256;
            value /= 256;
        }
        return index + 1;
    }

    public static decode_int8(bfView: Uint8Array,index: number): number
    {
        let res: number = 0;
        for(let i = 0;i < 1;i++)
        {
            res = res * 256 + bfView[index + i];
        }
        return res;
    }

    public static encode_string(bfView: Uint8Array,index: number,value: string): number
    {
        for(var i = 0;i < value.length;i++)
        {
            bfView[index + i] = value.charCodeAt(i);
        }
        return index + value.length;
    }

    public static decode_string(bfView: Uint8Array,slen: number,index: number): string
    {
        let res: string = "";
        for(let i = 0;i < slen;i++)
        {
            res += String.fromCharCode(bfView[index + i]);
        }
        return res;
    }

}
