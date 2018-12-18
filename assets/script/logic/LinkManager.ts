import Core from "../../corelibs/Core";
import {EventID} from "../../corelibs/CoreDefine";
import {ENUMS} from "../common/Enum";
import {showToast} from "../../corelibs/util/Toast";


/**
 * 链接跳转管理器
 * @author zhouyulong
 * 2018年5月4日 10:28:11
 */
export enum LinkType
{
    /**群组排行*/
    GROUP_RANK = "100",
    /**邀请好友*/
    INVITE_FRIEND = "101",
    /**进入游戏大厅 */
    INVITE_DOOR = "102",
}

export class LinkManager
{
    constructor()
    {
        Core.EventMgr.BindEvent(EventID.SdkEvent.ENTER_GAME,this.onEnterGame,this);//进入游戏
    }

    /**
     * 跳转链接
     */
    public linkTo(showQuery: string): void
    {
        console.log("linkTo:" + showQuery);
        let key: string;
        let value: string;
        let tempArr: Array<string> = showQuery.split("|");
        if(tempArr.length < 2)
        {
            console.log("showQuery值异常!:" + showQuery);
            return;
        }
        key = tempArr[0];
        value = tempArr[1];
        console.log("key:" + key + " value:" + value);
        switch(key)
        {
            case LinkType.GROUP_RANK://群排行 
                Core.UIMgr.ShowUI("UIRank",ENUMS.RANK_TYPE.GROUP_RANK,Core.SdkHandleMgr.GetLaunchQuery().shareTicket);
                break;
            case LinkType.INVITE_FRIEND://邀请好友
                this.acceptInvite(value);
                break;
        }
    }

    /**
     * 接受好友邀请
     */
    private acceptInvite(value: string): void
    {
        let whoShared: number = parseInt(value);//分享者uid
        let groupFlag: number;//0好友  1群
        if(Core.SdkHandleMgr.GetLaunchQuery().scene == 1004)//好友
        {
            groupFlag = 0;
        }
        else if(Core.SdkHandleMgr.GetLaunchQuery().scene == 1044)//群组
        {
            groupFlag = 1;
        }
        if(whoShared == Core.ServerHandler.m_iUin)//自己不获得
        {
            return;
        }
        // //请求邀请好友
        // Core.EventMgr.BindEvent(GlobalProtoID.RSP_ACCEPTED_INVITATION,this.inviteFriendSuccess,this);
        // let reqProto: ReqAcceptedInvitation = ReqAcceptedInvitation.create();
        // reqProto.whoShared = whoShared;
        // reqProto.groupFlag = groupFlag;
        // let buff: Uint8Array = ReqAcceptedInvitation.encode(reqProto).finish();
        // //向服务器发送自己的请求，第一个参数为自己定义的协议号，第二个参数为pb生成的uint8array串
        // Core.ServerHandler.PlayerGlobalData(GlobalProtoID.REQ_ACCEPTED_INVITATION,buff);
    }

    /**
     * 邀请好友成功
     */
    private inviteFriendSuccess(): void
    {
        showToast("好友邀请成功!");
    }

    /**
     * 进入游戏
     */
    private onEnterGame(): void
    {
        console.log("=====进入游戏:",Core.SdkHandleMgr.GetLaunchQuery().GetValue());
        for(let key in Core.SdkHandleMgr.GetLaunchQuery().GetValue())
        {
            this.showHandler(key);
            break;
        }

    }

    /**
     * 小游戏回到前台
     */
    private showHandler(showQuery: string): void
    {
        this.linkTo(showQuery);
    }
}