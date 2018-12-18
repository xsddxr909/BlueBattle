
import AudioPlayer from "./AudioPlayer";
import ITick from "../interface/ITick";

export default class AudioMgr extends cc.Component
{
    public static MAX_SAME_SOUND: number = 5;                       //相同的音效最多有多少个在队列中  同 player中的MAX_SINGLE_SOUND_INSTANCE
    private m_stAudioPlayer: AudioPlayer;                           //音频播放器
    private m_mapSoundQue: Map<string,Array<number>>;               //根据ID获取音效名称
    private m_iTickCount: number;

    public onLoad()
    {
        if(this.m_stAudioPlayer)
        {
            return;
        }
        this.m_stAudioPlayer = new AudioPlayer();
        this.m_stAudioPlayer.Init();
        this.m_mapSoundQue = new Map<string,Array<number>>();
        this.m_iTickCount = 0;
    }


    public update(dt: number): void
    {
        this.m_iTickCount++;
        //this.TestFunction(this.m_iTickCount);
        let mimTick: number = (0x3fffffff);
        let playurl: string = "";
        let that = this;
        this.m_mapSoundQue.forEach(function(value,key)
        {
            let len = value.length;
            for(let i = 0;i < len;i++)
            {
                if(-1 == value[i])
                {
                    value[i] = that.m_iTickCount;
                }
            }
            //各队列按序(tick)进队, 比较各队列首元素取最小者播放
            if(value.length > 0 && value[0] < mimTick)
            {
                mimTick = value[0];
                playurl = key;
            }
        });
        if("" != playurl)
        {
            this.m_mapSoundQue.get(playurl).shift();
            this.m_stAudioPlayer.PlaySound(playurl);
        }
    }
    /**
     * 音效音量设置
     */
    public set SoundVolume(volume: number)
    {
        this.m_stAudioPlayer.SoundVolume = volume;
    }

    public get SoundVolume(): number
    {
        return this.m_stAudioPlayer.SoundVolume;
    }

    /**
     * 音乐音量设置
     */
    public set MusicVolume(volume: number)
    {
        this.m_stAudioPlayer.MusicVolume = volume;
    }

    public get MusicVolume(): number
    {
        return this.m_stAudioPlayer.MusicVolume;
    }

    /**
     * 播放音乐
     * @param file 文件名
     */
    public PlayMusic(file: string): void
    {
        this.m_stAudioPlayer.PlayMusic(file,true);
    }

    /**
     * 播放音效
     * @param file 
     */
    public PlaySound(file: string): void
    {
        if(false == this.m_mapSoundQue.has(file))
        {
            this.m_mapSoundQue.set(file,new Array());
        }
        if(this.m_mapSoundQue.get(file).length < AudioMgr.MAX_SAME_SOUND)
        {
            this.m_mapSoundQue.get(file).push(-1);
        }
    }

    //清空音效
    public Clear(): void
    {
        this.m_mapSoundQue.forEach(arrSounds =>
        {
            arrSounds.length = 0;
        });
        this.m_mapSoundQue.clear();
        this.m_stAudioPlayer.ClearCache();
    }

    onDestroy(){
        this.Clear();
         this.m_mapSoundQue=null;
         this.m_stAudioPlayer=null;
    }
    //测试用
    private TestFunction(tickCount: number): void
    {
        if(parseInt((Math.random() * 5).toString()) % 5 == 0)
        {
            for(let i = 0;i < 5;i++)
            {
                this.PlaySound("card_fire");//(parseInt(((Math.random() * 24) % 5 + 1).toString()).toString());
            }
        }
        this.ToString(tickCount);
    }

    //暂停音效
    public PauseSound(): void
    {
        this.m_stAudioPlayer.PauseSound();
    }

    //恢复播放音效
    public ResumeSound(): void
    {
        this.m_stAudioPlayer.ResumeSound();
    }

    //停止音效
    public StopSound(): void
    {
        this.m_stAudioPlayer.StopSound();
    }

    //暂停音乐
    public PauseMusic(): void
    {
        this.m_stAudioPlayer.PauseMusic();
    }

    //恢复播放音乐
    public ResumeMusic(): void
    {
        this.m_stAudioPlayer.ResumeMusic();
    }

    //停止音乐
    public StopMusic(): void
    {
        this.m_stAudioPlayer.StopMusic();
    }

    //暂停所有正在播放的音乐
    public PauseAll(): void
    {
        cc.audioEngine.pauseAll();
    }

    //重新播放之前所有暂停的音乐
    public ResumeAll(): void
    {
        cc.audioEngine.resumeAll();
    }

    private ToString(tickCount: number = 0): void
    {
        cc.log("sound queue info: ",tickCount);
        this.m_mapSoundQue.forEach(function(value,key)
        {
            cc.log(value);
        });
    }
}
