import {CanvasConfig} from "./SdkObject";
import Core from "../../Core";
import {EventID} from "../../CoreDefine";

declare var canvas;
declare var wx;
export default class Capture
{
    constructor() {}

    /**
     * @param x 截取 canvas 的左上角横坐标
     * @param y 截取 canvas 的左上角纵坐标
     * @param width 截取 canvas 的宽度
     * @param height 截取 canvas 的高度
     */
    public CaptureSelf(iX: number,iY: number,iWidth: number,iHeight: number): void
    {
        if(this.HasSdk())
        {
            var testContext = canvas.getContext('webgl');
            var FilePath: string = "";
            canvas.toTempFilePath({
                x: iX,
                y: iY,
                width: iWidth,
                height: iHeight,
                destWidth: iWidth,
                destHeight: iHeight,
                fileType: 'png',
                quality: 1.0,
                success: function(res)
                {
                    Core.EventMgr.Emit(EventID.SdkEvent.CB_SUCCESS_CAPTURESELF,res.tempFilePath);
                },
                fail: function(err)
                {
                    Core.EventMgr.Emit(EventID.SdkEvent.CB_FAIL_CAPTURESELF,err);
                },
                complete: function(err)
                {
                    Core.EventMgr.Emit(EventID.SdkEvent.CB_COMPLETE_CAPTURESELF,err);
                }
            })
        }
    }
    public CreateCanvas(canvasConfig: CanvasConfig): void
    {
        if(this.HasSdk())
        {
            var testCanvas = wx.createCanvas();
            testCanvas.width = canvasConfig.m_iCanvasWidth;
            testCanvas.height = canvasConfig.m_iCanvasHeight;
            var testContext = testCanvas.getContext('2d');

            var img = wx.createImage();
            img.src = canvasConfig.m_shareUrlType + canvasConfig.m_sBGImgurl;
           
            img.onload = function()
            {
                testContext.drawImage(img,0,0,testCanvas.width,testCanvas.height);
                //游戏得分标题
                testContext.fillStyle = canvasConfig.m_sTitleStyle;
                testContext.font = canvasConfig.m_sTitleFont;
                testContext.fillText(canvasConfig.m_sTitleText,canvasConfig.m_iTitleX,canvasConfig.m_iTitleY);
                //游戏得分
                testContext.fillStyle = canvasConfig.m_sScoreStyle;
                testContext.font = canvasConfig.m_sScoreFont;
                testContext.fillText(canvasConfig.m_sScoreText,canvasConfig.m_iScoreX,canvasConfig.m_iScoreY);
                var self = this;
                testCanvas.toTempFilePath({
                    // x: 0,
                    // y: 0,
                    // width: canvasConfig.m_iCanvasWidth,
                    // height: canvasConfig.m_iCanvasHeight,
                    // destWidth: canvasConfig.m_iCanvasWidth,
                    // destHeight: canvasConfig.m_iCanvasHeight,
                    // fileType: 'png',
                    // quality: 1.0,
                    success: function(res)
                    {
                        Core.EventMgr.Emit(EventID.SdkEvent.CB_SUCCESS_CREATECANVAS,res.tempFilePath);
                    },
                    fail: function(err)
                    {
                        Core.EventMgr.Emit(EventID.SdkEvent.CB_FAIL_CREATECANVAS,err);
                    },
                    complete: function(err)
                    {
                        Core.EventMgr.Emit(EventID.SdkEvent.CB_COMPLETE_CAPTURESELF,err);
                    }
                });
            }


        }
    }
    private HasSdk(): boolean
    {
        return cc.sys.platform == cc.sys.WECHAT_GAME;
    }
}
