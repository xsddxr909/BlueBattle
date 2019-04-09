import {ResType,EventType} from "../CoreDefine";
import Core from "../Core";
import { UIEnumBase } from "../uiframe/UIMgr";
export default class ResourcesMgr
{
    private m_arrRes: Map<ResType,Map<string,any>>;
    private m_mapLoadInfo: Map<ResType,Map<string,Array<Function>>>;
    /**场景预加载资源,key：sceneName */
    private m_mapScenePreloadRes: Map<string,Array<ResStruct>>;
    private m_fnLoadScene: Function;
    private m_setAutoRelease: Set<string>;

    public constructor() 
    {
        this.m_arrRes = new Map<ResType,Map<string,any>>();
        this.m_mapLoadInfo = new Map<ResType,Map<string,Array<Function>>>();
        this.m_mapScenePreloadRes = new Map<string,Array<ResStruct>>();
        this.m_setAutoRelease = new Set<string>();
    }

    /**
     * 获取资源
     */
    public getRes(type: ResType,url: string): any
    {
        return this.m_arrRes.get(type).get(url);
    }
    /**
     * 获取资源
     */
    public getPrefab(url: string): any
    {
        return this.m_arrRes.get(ResType.Prefab).get(url);
    }

  /**
     * 加载单个文件
     * @param res 需要加载的资源
     * @param fnCallback 回调函数里会带上资源 
     */
    public LoadAny(res: ResStruct,fnCallback: Function): void
    {
        let that = this;
        let type = res.m_iResType;
        let url = res.m_sUrl;
        let auto = res.m_bAutoRelease;

        if(!that.m_arrRes.get(type))
        {
            that.m_arrRes.set(type,new Map<string,any>());
            that.m_mapLoadInfo.set(type,new Map<string,Array<Function>>());
        }
        //如果已经加载过的直接返回资源
        let mapRes: any = that.m_arrRes.get(type).get(url);
        if(mapRes)
        {
            // cc.log(url,'is loaded');
            fnCallback(mapRes);
            return;
        }
        let arrCallback: Array<Function> = that.m_mapLoadInfo.get(type).get(url);
        if(arrCallback)
        {
            arrCallback.push(fnCallback);
        }
        else                                                                                                                                                              
        {
            arrCallback = new Array<Function>();
            that.m_mapLoadInfo.get(type).set(url,arrCallback);
            arrCallback.push(fnCallback);
            console.log("cc.url.raw(url)",cc.url.raw("resources/"+url));
            cc.loader.load(cc.url.raw("resources/"+url),function(err,res)
            {
                if(err)
                {
                    cc.log(err);
                    return;
                }
                if(!res)
                {
                    cc.log(url + " is Error URL! type:",type);
                    return;
                }
                that.m_arrRes.get(type).set(url,res);
                that.OnCompleteCallback(url,type,res);
                if(auto)
                {
                    cc.loader.setAutoReleaseRecursively(url,auto);
                }
            });
        }
    }

    /**
     * 加载单个资源
     * @param res 需要加载的资源
     * @param fnCallback 回调函数里会带上资源 
     */
    public LoadRes(res: ResStruct,fnCallback: Function): void
    {
        let that = this;
        let type = res.m_iResType;
        let url = res.m_sUrl;
        let auto = res.m_bAutoRelease;

        if(!that.m_arrRes.get(type))
        {
            that.m_arrRes.set(type,new Map<string,any>());
            that.m_mapLoadInfo.set(type,new Map<string,Array<Function>>());
        }
        //如果已经加载过的直接返回资源
        let mapRes: any = that.m_arrRes.get(type).get(url);
        if(mapRes)
        {
            // cc.log(url,'is loaded');
            fnCallback(mapRes);
            return;
        }
        let arrCallback: Array<Function> = that.m_mapLoadInfo.get(type).get(url);
        if(arrCallback)
        {
            arrCallback.push(fnCallback);
        }
        else                                                                                                                                                              
        {
            arrCallback = new Array<Function>();
            that.m_mapLoadInfo.get(type).set(url,arrCallback);
            arrCallback.push(fnCallback);
            cc.loader.loadRes(url,this.GetResType(type),function(err,res)
            {
                if(err)
                {
                    cc.log(err);
                    return;
                }
                if(!res)
                {
                    cc.log(url + " is Error URL! type:",type);
                    return;
                }
                that.m_arrRes.get(type).set(url,res);
                that.OnCompleteCallback(url,type,res);
                if(auto)
                {
                    cc.loader.setAutoReleaseRecursively(url,auto);
                }
            });
        }
    }
    /**
     * 批量加载资源
     * @param arrResStruct 加载队列
     * @param fnCallBack 加载回调函数，返回的数据类型是`Array<ResStruct>`*
     */
    public LoadResArray(arrResStruct: Array<ResStruct>,fnCallBack?: Function): void
    {
        let that = this;
        let mapQueue: Map<ResType,Array<string>> = new Map<ResType,Array<string>>();
        let iCallbackTime: number = 0;

        let mapCompleted: Map<ResType,number> = new Map<ResType,number>();
        let mapTotal: Map<ResType,number> = new Map<ResType,number>();

        for(let resStruct of arrResStruct)
        {
            if(!this.m_arrRes.has(resStruct.m_iResType))
            {
                this.m_arrRes.set(resStruct.m_iResType,new Map<string,any>());
                this.m_mapLoadInfo.set(resStruct.m_iResType,new Map<string,Array<Function>>());
            }
            if(this.m_arrRes.has(resStruct.m_iResType))
            {
                if(this.m_arrRes.get(resStruct.m_iResType).has(resStruct.m_sUrl))
                {
                    continue;
                }
            }
            let arrQueue: Array<string>;
            if(!mapQueue.has(resStruct.m_iResType))
            {
                arrQueue = new Array<string>();
                mapQueue.set(resStruct.m_iResType,arrQueue);
                iCallbackTime++;
            }
            else
            {
                arrQueue = mapQueue.get(resStruct.m_iResType);
            }
            if(resStruct.m_bAutoRelease){
                that.m_setAutoRelease.add(resStruct.m_iResType + resStruct.m_sUrl); //???
            }
            arrQueue.push(resStruct.m_sUrl);

        }
        let arrResData: Array<ResStruct> = new Array<ResStruct>();
        if(iCallbackTime == 0)
        {
            if(fnCallBack)
            {
                fnCallBack(arrResData);
            }
            return;
        }
        mapQueue.forEach(function(arrQueue,resType)
        {
            cc.loader.loadResArray(arrQueue,that.GetResType(resType),function(cnt,total,item)
            {
                mapCompleted.set(resType,cnt);
                mapTotal.set(resType,total)
                let completedCount: number = 0;
                let totalCount: number = 0;
                mapCompleted.forEach(value =>
                {
                    completedCount += value;
                });
                mapTotal.forEach(value =>
                {
                    totalCount += value;
                });
                that.OnProgressCallback(completedCount,totalCount);
            },
                function(err,arrRes)
                {
                    iCallbackTime--;
                    if(err || !arrRes)
                    {
                        cc.log(err);
                        if(fnCallBack && iCallbackTime == 0)
                        {
                            fnCallBack(arrResData);
                        }
                        if(!arrRes)
                        {
                            cc.log(arrQueue + " is Error URL! type:",resType);
                        }
                        return;
                    }

                    for(let i: number = 0;i < arrRes.length;i++)
                    {
                        if(arrRes[i])
                        {
                            let url: string = arrQueue[i];
                            if(that.m_setAutoRelease.has(resType + url))
                            {
                                that.m_setAutoRelease.delete(resType + url);
                                cc.loader.setAutoReleaseRecursively(url,true);
                            }
                            that.m_arrRes.get(resType).set(url,arrRes[i]);
                            let res: ResStruct = ResStruct.CreateRes(url,resType);
                            res.m_stData = arrRes[i];
                            arrResData.push(res);
                        }
                        else
                        {
                            cc.log(arrQueue[i] + " is Error URL! type:",resType);
                        }
                    }
                    //只剩一次时回调
                    if(fnCallBack && iCallbackTime == 0)
                    {
                        fnCallBack(arrResData);
                    }
                });
        });
    }

    /**
     * 添加一个预加载资源到队列中
     * @param res 资源描述
     * @param sceneName 绑定的场景名
     */
    public AddLoadResByScene(res: ResStruct,sceneName: string): void
    {
        let arrRes: Array<ResStruct>;
        arrRes = this.m_mapScenePreloadRes.get(sceneName);
        if(!arrRes)
        {
            arrRes = new Array<ResStruct>();
            this.m_mapScenePreloadRes.set(sceneName,arrRes);
        }
        let arrNewRes: Array<ResStruct> = new Array<ResStruct>();
        let isNew: boolean = true;
        arrRes.forEach(function(testRes)
        {
            if(testRes.m_sUrl == res.m_sUrl && testRes.m_iResType == res.m_iResType)
            {
                isNew = false;
                return;
            }
        })
        if(isNew)
        {
            arrRes.push(res);
        }
    }

    /**
     * 场景预加载单个文件
     * 该文件在切换场景前加载
     * @param arrResStruct 资源的描述
     * @param sceneName 绑定的场景名
     */
    public AddLoadResArrayByScene(arrResStruct: Array<ResStruct>,sceneName: string): void
    {
        let that = this;
        arrResStruct.forEach(function(res)
        {
            that.AddLoadResByScene(res,sceneName);
        })
    }


    private OnProgressCallback(completedCount: number,totalCount: number)
    {
        // cc.log("loading... ",completedCount,"/",totalCount);
        // add  编译不通过暂时注释zhouyulong
        // loadingText.nowVal = completedCount;
        // loadingText.allVal = totalCount;
        // add
        Core.EventMgr.Emit(EventType.LoadProgress,[completedCount,totalCount]);
    }

    public Release(url: string,type: ResType)
    {
        if(this.m_arrRes.get(type).get(url) == null)
        {
            console.log("资源已释放");
        }
        else
        {
            this.m_arrRes.get(type).delete(url);
            this.m_mapLoadInfo.get(type).delete(url);
            console.log("资源释放成功");
            var deps = cc.loader.getDependsRecursively(url);
            cc.loader.release(deps);
        }
    }

    public ReleaseAll(){
        this.m_mapLoadInfo=null;
        this.m_mapScenePreloadRes=null;
        this.m_fnLoadScene=null;
        this.m_setAutoRelease=null;
        this.m_arrRes.forEach(element => {
            if(element!=null){
               element.forEach(function(value,key)
               {
                    var deps = cc.loader.getDependsRecursively(key);
                    if(deps){
                        cc.loader.release(deps);
                    }
               });
               element.clear();
            }
        });
        this.m_arrRes=null;
    }

    public RelaseLastSceneRes(){
        for(let resStruct of this.m_arrRes)
        {
            // if(!this.m_arrRes.has(resStruct.SpineRes))
            // {

            // }
        }

    }

    /**
     * 
     * 1、打开LoadingScence
     * 2、加载预加载资源
     * 3、加载场景
     * @param sceneName 
     * @param fnCallback 
     */
    public LoadScene(sceneName: string,fnCallback: Function): void
    {
        Core.UIMgr.ShowUI(UIEnumBase.LoadingWin);
        //清除上一个场景的资源;
        
        if(this.m_mapScenePreloadRes.has(sceneName))
        {
            let arrResList: Array<ResStruct> = this.m_mapScenePreloadRes.get(sceneName);
            if(arrResList.length > 0)
            {
                this.LoadResArray(arrResList,()=>
                {
                    this.SwitchScene(sceneName,fnCallback);
                });
            }
            else
            {
                this.SwitchScene(sceneName,fnCallback);
            }
        }
        else
        {
            this.SwitchScene(sceneName,fnCallback);
        }
    }
    private SwitchScene(sceneName: string,fnCallback: Function): void
    {
        cc.log("SwitchScene");
        if(this.m_fnLoadScene)
        {
            this.m_fnLoadScene();
        }
        Core.EventMgr.Emit(EventType.LoadSceneOver,sceneName);
        cc.log("ResourcesMgr 切换场景");
        Core.UIMgr.CloseUI(UIEnumBase.LoadingWin);
    }
    /**
     * 
     * 1、预加载场景
     * 2、加载预加载资源
     * 3、加载场景
     * @param sceneName 
     * @param fnCallback 
     */
    public LoadTrueScene(sceneName: string,fnCallback: Function): void
    {
        this.m_fnLoadScene = fnCallback;
        let that = this;
        cc.director.preloadScene(sceneName,function()
        {
            that.LoadTrueScenePreloadRes(sceneName);
        });
    }

    private LoadTrueScenePreloadRes(sceneName: string): void
    {
        //加载完场景后设置一下
        Core.EventMgr.Emit(EventType.LoadProgress,[1,1]);
        let that = this;
        if(this.m_mapScenePreloadRes.has(sceneName))
        {
            let arrResList: Array<ResStruct> = this.m_mapScenePreloadRes.get(sceneName);
            if(arrResList.length > 0)
            {
                this.LoadResArray(arrResList,function()
                {
                    that.SwitchTrueScene(sceneName);
                });
            }
            else
            {
                that.SwitchTrueScene(sceneName);
            }
        }
        else
        {
            that.SwitchTrueScene(sceneName);
        }
    }
    private SwitchTrueScene(sceneName: string): void
    {
        let that = this;
        cc.log("SwitchScene");
        cc.director.loadScene(sceneName,function()
        {
            if(that.m_fnLoadScene)
            {
                that.m_fnLoadScene();
            }
            cc.log("切换场景");
            Core.EventMgr.Emit(EventType.LoadSceneOver,sceneName);
        });
    }

    private OnCompleteCallback(url: string,type: ResType,res:any): void
    {
        let arrCallback: Array<Function> = this.m_mapLoadInfo.get(type).get(url);
        arrCallback.forEach(fnCallback =>
        {
            fnCallback(res);
        });
        arrCallback.length = 0;
    }

    private GetResType(type: ResType): any
    {
        switch(type)
        {
            case ResType.SpineRes:
                return sp.SkeletonData;
            case ResType.BitmapRes:
                return cc.SpriteFrame;
            case ResType.Prefab:
                return cc.Prefab;
            case ResType.AudioClip:
                return cc.AudioClip;
            case ResType.TextAsset:
                return cc.TextAsset;
            case ResType.JsonAsset:
                return cc.JsonAsset;
            default:
                throw new Error("Error! type Not Found! type:" + type);
        }
    }
}

/**
 * 资源描述
 */
export class ResStruct
{
    public m_iResType: ResType;
    public m_sUrl: string;
    public m_bAutoRelease: boolean;
    /**返回的资源 */
    public m_stData: any;
    constructor()
    {
        this.m_bAutoRelease = false;
        this.m_sUrl = "";
    }

    /**
     * 
     * @param url 路径
     * @param type `ResType`类型
     * @param auto 是否在场景切换时销毁，默认不销毁
     */
    public static CreateRes(url: string,type: ResType,auto: boolean = false): ResStruct
    {
        let res = new ResStruct();
        res.m_sUrl = url;
        res.m_iResType = type;
        res.m_bAutoRelease = auto;
        return res;
    }
}

