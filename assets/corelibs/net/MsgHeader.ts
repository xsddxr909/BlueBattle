import {CodeEngine} from "../util/CodeEngine";
import Core from "../Core";

export class MsgHeader
{
    // 包头固定长度 
    private static CONST_HEADLEN: number = 20;
    // MessageID
    public m_iMessageID: number;
    //FrameID iSubMessageID
    public m_FrameID: number;
    public m_stBody: Uint8Array;

    // 构造方法
    public constructor()
    {
        this.m_iMessageID = 0;
        this.m_FrameID = 0;
    }

    // 初始化
    public Init(): void
    {
    }

    public Encode(bys: Uint8Array): ArrayBuffer
    {
        let buffer: ArrayBuffer = new ArrayBuffer(MsgHeader.CONST_HEADLEN  + bys.length);
        let headBys: Uint8Array = new Uint8Array(buffer);

        let index: number = 0;

        index = CodeEngine.encode_int32(headBys,index,buffer.byteLength);                           // packge len
        index = CodeEngine.encode_int32(headBys,index,this.m_iMessageID);                           // msg Id  cmd Id
     //   index = CodeEngine.encode_int32(headBys,index,Core.ServerHandler.m_iGameId);                // game Id
     //   index = CodeEngine.encode_int32(headBys,index,Core.ServerHandler.m_iGroupId);               // group Id
        index = CodeEngine.encode_int32(headBys,index,Core.ServerHandler.m_iSeqId);                 // seq Id
        index = CodeEngine.encode_int32(headBys,index,this.m_FrameID);                              // FrameId 或者 sub msg Id
        index = CodeEngine.encode_int32(headBys,index,bys.length);                                  // body len

        headBys.set(bys,index);
        return buffer;
    }

    public Decode(bys: Uint8Array): void
    {
        let index: number = 0;
        let msgLen: number = CodeEngine.decode_int32(bys,index); index += 4;
        this.m_iMessageID = CodeEngine.decode_int32(bys,index); index += 4;
     //   let gameId: number = CodeEngine.decode_int32(bys,index); index += 4;
     //   let groupId: number = CodeEngine.decode_int32(bys,index); index += 4;
        let seqId: number = CodeEngine.decode_int32(bys,index); index += 4;
        this.m_FrameID = CodeEngine.decode_int32(bys,index); index += 4;
        let bodyLen: number = CodeEngine.decode_int32(bys,index); index += 4;

         //Core.Log('msgLen: ' + msgLen);
        // Core.Log('uin: ' + uin);
        // Core.Log('sessLen: ' + sessLen);
        // Core.Log('sessKey: ' + sessKey);
        // Core.Log('msgId: ' + this.m_iMessageID);
        // Core.Log('gameId: ' + gameId);
        // Core.Log('groupId: ' + groupId);
        // Core.Log('seqId: ' + seqId);
        // Core.Log('subMsgId: ' + this.m_iSubMessageID);
        // Core.Log('bodyLen: ' + bodyLen);

        this.m_stBody = bys.slice(index);
    }

}