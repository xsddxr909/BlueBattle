import { CharData } from "../../data/CharData";
import { Character } from "../Character";
import { DataPool, ListDataPool } from "../../../corelibs/util/Pool";
import { ConfigData } from "../../ConfigData";
import QuadTree from "../../../corelibs/util/QuadTree";
import Core from "../../../corelibs/Core";
import { BackOff } from "../action/BackOff";
import { ConfigXls } from "../../data/ConfigXls";
import { Dead } from "../action/Dead";
import CameraCtrl from "../../logic/CameraCtrl";
import MapManager from "../../map/MapManager";
import { ResScreen } from "../../map/ResScreen";
import { Gem } from "../Gem";
import { ObjBase } from "../ObjBase";
import { GemData } from "../../data/GemData";
/**
 * 角色管理器
 */
export class CharManager
{
    
    public constructor()
    {
    }
    private static m_pInstance: CharManager;
    public static Get(): CharManager
    {
        if(null == CharManager.m_pInstance)
        {
            CharManager.m_pInstance = new CharManager();
            CharManager.m_pInstance.init();
        }
        return CharManager.m_pInstance;
    }
    public static debug:boolean=true;
    
   // public objectPool:MultiplePool;

    public  charDataPool:DataPool<CharData>;
    private  characterPool:ListDataPool<Character>;
    public CharQuadTree:QuadTree<CharData>;
    private hitArrayList:CharData[]=null;
    
    public  gemPool:ListDataPool<Gem>;
    public GemQuadTree:QuadTree<GemData>;
    private hitGemList:GemData[]=null;
    
    private removeList:Array<ObjBase>;
    //在摄像机的数组
    private  preCameraCharDataList:CharData[] = [];
    private  preCameraGemDataList:GemData[] = [];

    private  inited:boolean=false;
    public isHitTest:boolean=false;
 
    public  init():void
    {
        if(this.inited)return;
        
        
        this.charDataPool= new DataPool<CharData>(() => new CharData(),"CharData");

        this.characterPool= new ListDataPool<Character>(() => new Character(),"Character");

        this.gemPool= new ListDataPool<Gem>(() => new Gem(),"Gem");


        this.removeList=new Array<ObjBase>();
      
        this.CharQuadTree = new QuadTree<CharData>(0,0,ConfigData.gameMapSize.width,ConfigData.gameMapSize.height);

        this.GemQuadTree = new QuadTree<GemData>(0,0,ConfigData.gameMapSize.width,ConfigData.gameMapSize.height);

        this.preCameraCharDataList=[];
        this.preCameraGemDataList=[];
        // let tt:CmdAction =this.objectPool.get(CmdAction);
        // let cd:Action =this.objectPool.get(Action);
        // let cd2:Action=this.objectPool.get(Action);
        // let cd3:Action=this.objectPool.get(Action);


        // console.log(tt.GetName(),cd3.GetName());
        // tt.recycleSelf();
        // cd3.recycleSelf();
        // console.log("CmdAction: "+this.objectPool.getArrayLenth(CmdAction.name),"Action: "+this.objectPool.getArrayLenth(Action.name));
        // cd.recycleSelf();
        // cd2.recycleSelf();
        // console.log("CmdAction: "+this.objectPool.getArrayLenth(CmdAction.name),"Action: "+this.objectPool.getArrayLenth(Action.name));
        // let t2:CmdAction=this.objectPool.get(CmdAction);
        // let c2:Action =this.objectPool.get(Action);
        // console.log(t2.GetName(),c2.GetName());
        // console.log("CmdAction: "+this.objectPool.getArrayLenth(CmdAction.name),"Action: "+this.objectPool.getArrayLenth(Action.name));
        // t2.recycleSelf();
        // c2.recycleSelf();
        // console.log("CmdAction: "+this.objectPool.getArrayLenth(CmdAction.name),"Action: "+this.objectPool.getArrayLenth(Action.name));
        // this.objectPool.clearAll();
        // console.log("clearAll CmdAction: "+this.objectPool.getArrayLenth(CmdAction.name),"Action: "+this.objectPool.getArrayLenth(Action.name));

        this.inited=true;  
    }

    public getAllCharList():Array<Character>{
          return this.characterPool.getOnList();
    }
    public getCharById(characterId:number):Character{
        return this.characterPool.getDataById(characterId);
    }
    public getNewChar():Character{
        return this.characterPool.get();
    }
    /**
     * 用到随机数 只能在帧同步里用;
     * @param resScreen 
     * @param radio 
     */
	private  getRandomPoint(radius:number):cc.Vec2 {
        let  pos: cc.Vec2=cc.Vec2.ZERO;
        //半径范围内的随机点;
        pos.x =  ((ConfigData.gameMapSize.width-radius/2) * Core.Random.GetRandom()+ radius/2) >>0;
        pos.y =   ((ConfigData.gameMapSize.height-radius/2) * Core.Random.GetRandom()+ radius/2) >>0;
		return pos;
    }
     /**
      *  找出生点;
      * @param radius 
      */
    public getBrothPoint(radius:number):cc.Vec2{
        //获取随机场景;
        let  Vec2:cc.Vec2= this.getRandomPoint(radius);
        let resScreen:ResScreen= MapManager.Get().getResMap().getResScreenXZ(Vec2.x,Vec2.y);
        if(resScreen){
           if(!resScreen.posHasChar(Vec2,radius)){
     //          console.log("Vec2 getBrothPoint",Vec2);
                return Vec2;
           }
        }
        return this.getBrothPoint(radius);
    }
    /**
     * 移除显示对象；
     * @param char 
     */
    public removeObj(char:ObjBase){
        if( char.data.isDead)return;
        char.data.isDead=true;
        char.data.inCamera=false;
 //       console.log("Be removeChar",char.id);
        if(this.removeList.indexOf(char)<0){
   //         console.log("removeChar",char.id);
            this.removeList.push(char);
        }

    }
    public removeCharById(id:number){
        const  character:Character = this.characterPool.getDataById(id);
        if(character!=null){
            this.removeObj(character);
        }
    }
    public removeGemById(id:number){
        const  gem:Gem = this.gemPool.getDataById(id);
        if(gem!=null){
            this.removeObj(gem);
        }
    }
    /**
     * 每帧更新；
     */
    public  update(dt:number){
        if(this.isHitTest){
           this.CharQuadTree.clear();
        }
    //    console.log("this.charOnlist: ",this.charOnlist.length);
        for (let i = 0, len:number= this.gemPool.getOnList().length; i < len; i++) {
            this.gemPool.getOnList()[i].Update(dt);
        }
        for (let i = 0, len:number= this.characterPool.getOnList().length; i < len; i++) {
           const char:Character= this.characterPool.getOnList()[i];
             char.Update(dt);
             if(this.isHitTest){
                this.GemHitTest(char);
                this.CharQuadTree.put(char.charData);
             }
        }

        if(this.isHitTest){
            for (let i = 0, len:number=this.characterPool.getOnList().length; i < len; i++) {
                const bear:Character= this.characterPool.getOnList()[i];
                this.hitArrayList=this.CharQuadTree.get(this.characterPool.getOnList()[i].charData);        
                // if(bear.charData.id==2){
                    // }
               //     console.log(" hitTest>>>>>> :",bear.charData.pvpId, bear.charData.bodyBox.x, bear.charData.bodyBox.x,bear.charData.bodyBox.y,"lens: "+this.hitArrayList.length);
                    for (let x = 0; x < this.hitArrayList.length; x++) {
                        // 使用合适的碰撞检测算法和每一个可能碰撞的物体进行碰撞检测...
                    const  hitterCharD:CharData=this.hitArrayList[x] as CharData;
                 //   console.log(" hitTest ",hitterCharD.pvpId);
                    const  character:Character = this.characterPool.getDataById(hitterCharD.characterId);
                    if(hitterCharD.isDead||hitterCharD.id==bear.charData.id){
                        continue;
                    }
                  //  bear.charData.bodyBox
                    // 武器碰到了身体;攻击命中;
                    if(hitterCharD.weaponBox!=null&&bear.charData.bodyBox!=null&&hitterCharD.weaponBox.isCollision(bear.charData.bodyBox)){
                        //TODO: 每次碰撞的位置不对。
                   //     console.log(hitterCharD.pvpId+" 武器碰到了身体  "+bear.charData.pvpId,hitterCharD.position,bear.charData.position,"getSeedIndex: ",Core.Random.getSeedIndex(),"frame:",Core.FrameSync.currRenderFrameId);
                      
                   //     console.log("getSeedIndex: ",Core.Random.getSeedIndex(),"frame:",Core.FrameSync.currRenderFrameId);
                     //   this.CalculateHit(character,bear);
                     
                        character.onAttack();
                        character.backOneMove();
                        character.getSkillPart().targetDir=bear.charData.position.sub(hitterCharD.position);
                        character.getSkillPart().hitdata=ConfigXls.Get().t_s_hitData.get(1003);
                        character.getSkillPart().doActionSkillByLabel("BackOff");
                        character.checkUpgrade(bear.charData.getDeadExp());
                        
                        //死亡换 杀你的人的视角。
                        if(bear.charData.inCamera && bear.view!=null && CameraCtrl.Instance.isFocusTarget(bear.view.node)){
                            character.charData.inCamera=true;
                            character.inView();
                            CameraCtrl.Instance.changeTarget(character.view.node,0.5);
                        }
                        
                        bear.onBeaten();
                        bear.getSkillPart().targetDir=hitterCharD.position.sub(bear.charData.position);
                        bear.getSkillPart().hitdata=ConfigXls.Get().t_s_hitData.get(1003);
                        bear.getSkillPart().doActionSkillByLabel("Dead");

                        continue;
                         //播放特效;
                    }
                    // 武器碰到了盾
                    if(hitterCharD.currentActionLabel!="BackOff"&&hitterCharD.weaponBox!=null&&bear.charData.shieldBox!=null&&hitterCharD.weaponBox.isCollision(bear.charData.shieldBox)){
                    //    console.log(hitterCharD.id+" 武器碰到了盾  "+bear.charData.id);
                        character.backOneMove();
                        character.getSkillPart().hitdata=ConfigXls.Get().t_s_hitData.get(1001);
                        character.getSkillPart().doActionSkillByLabel("BackOff");
                    }
                    // //身体相碰; 算半径碰撞;
                     if(hitterCharD.currentActionLabel!="BackOff"){
                         let dis:number=hitterCharD.radius-character.getDicByTarget(bear,true);
                        if(dis>=0){
                      //      console.log(hitterCharD.id+" 身体相碰  "+bear.charData.id);
                            character.backOneMove(dis);
                            character.getSkillPart().targetDir=bear.charData.position.sub(hitterCharD.position);
                 //           console.log(hitterCharD.id+" vec2ToRotate  "+MyMath.vec2ToRotate( character.getSkillPart().targetDir));
                            character.getSkillPart().hitdata=ConfigXls.Get().t_s_hitData.get(1002);
                            character.getSkillPart().doActionSkillByLabel("BackOff");

                            bear.getSkillPart().targetDir=hitterCharD.position.sub(bear.charData.position);
                            bear.getSkillPart().hitdata=ConfigXls.Get().t_s_hitData.get(1002);
                            bear.getSkillPart().doActionSkillByLabel("BackOff");
                        }
                     }
                }
            }
        }

        //删除对象；
        if(this.removeList.length>0){
            this.removeList.forEach(obj => {
                obj.recycleSelf();
            });
     //       console.log("removeListCount: ",this.removeList.length);
            this.removeList.length=0;
        }

        this.updateGemCamera();
        this.updateCharCamera();
    }
   /**
    * 宝石碰撞检测;
    * @param char 
    */
    private GemHitTest(char:Character){
        this.hitGemList=this.GemQuadTree.get(char.charData);     
        for (let x = 0; x < this.hitGemList.length; x++) {
            const  GemD:GemData=this.hitGemList[x] as GemData;
            const  gem:Gem = this.gemPool.getDataById(GemD.GemId);
            //判断是否碰撞;
            if(GemD.isDead){
                continue;
            }
            if(GemD.getDic(char.charData.position,char.charData.radius)<0){
                gem.onAddTarget(char);
                continue;
            }
            //非吸引动作 判断是否需要被吸引 到距离开始吸引;
            if(GemD.state!=2&&GemD.getDic(char.charData.position,char.charData.radius)<30){
                GemD.state=2;
                gem.closeToTarget(char);
            }
        }
    }
   

    //暴击率；
    private Crit:number;
    private atkI:number;
    private updateGemCamera(){
        this.hitGemList=this.GemQuadTree.get(CameraCtrl.Instance.getBoundingBox());        
        //过滤应该增加的地块
        let addCameraDataList:GemData[] =  this.hitGemList.filter(v => (this.preCameraGemDataList.indexOf(v)<0));
        //过滤应该删除的地块
        let removeCameraDataList:GemData[] = this.preCameraGemDataList.filter(v => ( this.hitGemList.indexOf(v)<0));
        //循环删除地块渲染
        removeCameraDataList.forEach(v => {
           v.inCamera=false;
        })
        //循环增加地块渲染
        addCameraDataList.forEach(v => {
            v.inCamera=true;
        })
        //记录本次查询的地块信息，供下次查询使用。
        this.preCameraGemDataList = this.hitGemList;
    }

    private updateCharCamera(){
        this.hitArrayList=this.CharQuadTree.get(CameraCtrl.Instance.getBoundingBox());        
        //过滤应该增加的地块
        let addCameraDataList:CharData[] =  this.hitArrayList.filter(v => (this.preCameraCharDataList.indexOf(v)<0));
        //过滤应该删除的地块
        let removeCameraDataList:CharData[] = this.preCameraCharDataList.filter(v => ( this.hitArrayList.indexOf(v)<0));
        //循环删除地块渲染
        removeCameraDataList.forEach(v => {
            if(!v.myPlayer){
                v.inCamera=false;
            }
        })
        //循环增加地块渲染
        addCameraDataList.forEach(v => {
            v.inCamera=true;
        })
        //记录本次查询的地块信息，供下次查询使用。
        this.preCameraCharDataList = this.hitArrayList;
    }
    /**
     * 全部回收到池;
     */
    public static recycleAll(){
        //Part 在character中不用回收 ,减少开销; data 已经回收;
        CharManager.Get().characterPool.recycleAll();
        CharManager.Get().gemPool.recycleAll();
        CharManager.Get().removeList.length=0;
        CharManager.Get().CharQuadTree.clear();
    }
    /**
     * 清理池; 有顺序;
     */
    public static ClearAll(){
        CharManager.Get().characterPool.clearAll();
        CharManager.Get().charDataPool.clearAll();
        CharManager.Get().gemPool.clearAll();
        Core.ObjectPoolMgr.clearAll();
        CharManager.Get().removeList.length=0;
        CharManager.Get().CharQuadTree.clear();
        CharManager.Get().preCameraCharDataList=[];
        CharManager.Get().preCameraGemDataList=[];
    }

    public static Release(){
        this.ClearAll();
        CharManager.m_pInstance.preCameraCharDataList=[];
        CharManager.m_pInstance.preCameraGemDataList=[];
        CharManager.m_pInstance.charDataPool=null;
        CharManager.m_pInstance.characterPool=null;      
        CharManager.m_pInstance.gemPool=null;      
        CharManager.m_pInstance.CharQuadTree=null;
        CharManager.m_pInstance.hitArrayList=null;
        CharManager.m_pInstance.removeList=null;
        CharManager.m_pInstance=null;
    }
    /**
     * 需要打印查看内存数据 
     */
    public static logUpdate(label:cc.Label){
        if(CharManager.debug){
          label.string+=CharManager.Get().charDataPool.toString();
          label.string+=CharManager.Get().characterPool.toString();
          label.string+=CharManager.Get().gemPool.toString();
          if(CharManager.Get().hitGemList!=null){
          label.string+="hitGemList:count "+CharManager.Get().hitGemList.length;
           }
        //   if(CharManager.Get().hitArrayList!=null){
        //       label.string+="hitArrayList:count "+CharManager.Get().hitArrayList.length;
        //   }
        }
    }
}


