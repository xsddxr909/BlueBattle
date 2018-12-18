import CoreConfig from "../CoreConfig";
import {UI_LAYER} from "./BaseUI";

/**
 * UI总结点
 */
export default class UIRoot extends cc.Node
{
    private m_stNormalNode: cc.Node;
    private m_stFixedNode: cc.Node;
    private m_stPopUpNode: cc.Node;
   
    private m_stToastNode: cc.Node;
    private m_stCanvasNode: cc.Node;
    
    constructor()
    {
        super();
        this.Init();
    }

    private Init(): void
    {
        cc.game.addPersistRootNode(this);
        this.group="UI";
        this.addChild(this.m_stNormalNode = new cc.Node());
        this.addChild(this.m_stFixedNode = new cc.Node());
        this.addChild(this.m_stPopUpNode = new cc.Node());
        this.addChild(this.m_stToastNode = new cc.Node());
        this.m_stCanvasNode= cc.find('Canvas');
      //  this.m_stCanvasNode.addChild(this);
        // 添加mask
       // this.m_stPopUpNode.addChild(this.m_stMaskNode = new cc.Node());
        // this.m_stMaskNode.addComponent(cc.BlockInputEvents);
        // this.m_stMaskNode.width = CoreConfig.GAME_WIDTH;
        // this.m_stMaskNode.height = CoreConfig.GAME_HEIGHT;
        // this.m_stMaskNode.setLocalZOrder(UI_LAYER.MASK);
        // this.m_stMaskNode.active = false;

        // this.x = CoreConfig.GAME_WIDTH / 2;
        // this.y = CoreConfig.GAME_HEIGHT / 2;

      //  this.position =  this.m_stCanvasNode.position; // add 

        this.name = "UIRoot";
        this.m_stNormalNode.name = "Normal";
        this.m_stFixedNode.name = "Fixed";
        this.m_stPopUpNode.name = "PopUp";
        this.m_stToastNode.name = "Toast";
    }
    //画布
    public get Canvas():cc.Node{return this.m_stCanvasNode;}

    public get Normal(): cc.Node {return this.m_stNormalNode;}
    public get Fixed(): cc.Node {return this.m_stFixedNode;}
    public get PopUp(): cc.Node {return this.m_stPopUpNode;}
    public get Toast(): cc.Node {return this.m_stToastNode;}

}
