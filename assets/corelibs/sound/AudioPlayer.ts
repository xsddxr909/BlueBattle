import ResourcesMgr,{ResStruct} from "../util/ResourcesMgr";
import {Music,ResType} from "../CoreDefine";
import Core from "../Core";

export default class AudioPlayer
{
    private MAX_SINGLE_SOUND_INSTANCE = 24;                     //同一个音效最多拥有多少个实例
    private static instance: AudioPlayer;

    private m_iMusicVolume: number;                             //背景音乐的音量(0 - 1) (全局)
    private m_iSoundVolume: number;                             //音效的音量(0 - 1) (全局)

    private m_iMusicID: number;                                 //当前正在播放的音乐ID
    private m_arrSoundID: number[];                             //音效ID数组 便于控制

    private m_sCurrentMusicName: string;                        //当前播放的背景音乐
    private m_bMusicMute: boolean = true;                       //是否背景音乐静音
    private m_bSoundMute: boolean = true;                       //是否音效静音

    constructor()
    {
        this.m_iMusicID = -1;
        this.m_arrSoundID = [];
    }

    //初始化,获取资源管理器和本地音量
    public Init(): void
    {
        let musicVolumeValue = cc.sys.localStorage.getItem(Music.MusicVolume);
        let soundVolumeValue = cc.sys.localStorage.getItem(Music.SoundVolume);
        let musicMute = cc.sys.localStorage.getItem(Music.MusicMute);
        let soundMute = cc.sys.localStorage.getItem(Music.SoundMute);

        this.MusicVolume = null != musicVolumeValue ? parseFloat(musicVolumeValue) : 1;
        this.SoundVolume = null != soundVolumeValue ? parseFloat(soundVolumeValue) : 0.75;
        this.MusicMute = null != musicMute ? (parseInt(musicMute) == 1) : false;
        this.SoundMute = null != soundMute ? (parseInt(soundMute) == 1) : false;

        cc.audioEngine.setMaxAudioInstance(this.MAX_SINGLE_SOUND_INSTANCE);
    }

    /**
     * 音乐音量设置[0-1]
     */
    public set MusicVolume(volume: number)
    {
        this.m_iMusicVolume = volume;
        if(this.m_iMusicID >= 0)
        {
            cc.audioEngine.setVolume(this.m_iMusicID,volume);
        }
    }

    public get MusicVolume(): number
    {
        return this.m_iMusicVolume;
    }
    /**
     * 音效音量设置[0-1]
     */
    public set SoundVolume(volume: number)
    {
        this.m_iSoundVolume = volume;
        this.m_arrSoundID.forEach((sid) =>
        {
            cc.audioEngine.setVolume(sid,volume);
        })
    }

    public get SoundVolume(): number
    {
        return this.m_iSoundVolume;
    }

    //设置静音
    public set MusicMute(mute: boolean)
    {
        this.m_bMusicMute = mute;
        if(this.m_iMusicID < 0)
        {
            if(!mute && this.m_sCurrentMusicName)
            {
                this.PlayMusic(this.m_sCurrentMusicName);
            }
            return;
        }
        if(mute)
        {
            cc.audioEngine.pause(this.m_iMusicID);
        }
        else
        {
            cc.audioEngine.resume(this.m_iMusicID);
        }
    }

    public get MusicMute(): boolean
    {
        return this.m_bMusicMute;
    }

    public set SoundMute(mute: boolean)
    {
        this.m_bSoundMute = mute;
        this.m_arrSoundID.forEach((sid) =>
        {
            if(mute)
            {
                cc.audioEngine.pause(sid);
            }
            else
            {
                cc.audioEngine.resume(sid);
            }
        })
    }

    public get SoundMute(): boolean
    {
        return this.m_bSoundMute;
    }

    /**
     * 播放背景音乐
     * @param file 文件名 
     * @param loop 是否循环
     */
    public PlayMusic(file: string,loop: boolean = true): void
    {
        if(0 <= this.m_iMusicID)
        {
            this.StopMusic();
        }

        let path = AudioPlayer.GetUrl(file,AudioType.Music);
        this.m_sCurrentMusicName = file;

        if(this.m_bMusicMute)
        {
            console.log("AudioMgr: music is mute!");
            return;
        }

        Core.ResourcesMgr.LoadRes(ResStruct.CreateRes(path,ResType.AudioClip),function(res)
        {
            this.PlayClip(res,loop,AudioType.Music);
        }.bind(this));
        return;
    }

    /** 
     * 停止音乐
    */
    public StopMusic(): void
    {
        if(this.m_iMusicID < 0)
        {
            return;
        }
        cc.audioEngine.stop(this.m_iMusicID);
        this.m_iMusicID = -1;
    }

    //暂停背景音乐
    public PauseMusic(): void
    {
        if(this.m_iMusicID >= 0)
        {
            cc.audioEngine.pause(this.m_iMusicID);
        }
        return;
    }

    //恢复播放音乐
    public ResumeMusic(): void
    {
        if(this.m_iMusicID >= 0)
        {
            cc.audioEngine.resume(this.m_iMusicID);
        }
        return;
    }

    /**
     * 播放音效
     * @param file 音效名
     */
    public PlaySound(file: string): void
    {
        if(this.m_bSoundMute)
        {
            console.log("AudioMgr: sound is mute!");
            return;
        }
        let path = AudioPlayer.GetUrl(file,AudioType.Sound);
        Core.ResourcesMgr.LoadRes(ResStruct.CreateRes(path,ResType.AudioClip),function(res)
        {
            this.PlayClip(res,false,AudioType.Sound);
        }.bind(this));
    }

    public StopSound(): void
    {
        this.m_arrSoundID.forEach((sid) =>
        {
            cc.audioEngine.stop(sid);
        });
        this.m_arrSoundID.length = 0;
    }

    //暂停音效
    public PauseSound(): void
    {
        this.m_arrSoundID.forEach((sid) =>
        {
            cc.audioEngine.pause(sid);
        });
    }

    //恢复播放音效
    public ResumeSound(): void
    {
        this.m_arrSoundID.forEach((sid) =>
        {
            cc.audioEngine.resume(sid);
        });
    }

    public PlayClip(url: cc.AudioClip,loop: boolean,type: AudioType)
    {
        if(type == AudioType.Music)
        {
            let mid = cc.audioEngine.play(url,loop,this.m_iMusicVolume);
            this.m_iMusicID = mid;
        }
        else if(type == AudioType.Sound)
        {
            let sid = cc.audioEngine.play(url,loop,this.m_iSoundVolume);
            this.m_arrSoundID.push(sid);
            cc.audioEngine.setFinishCallback(sid,() =>
            {
                this.OnSoundFinished(sid);
            });
        }
    }

    //音效播放完成后删除音效
    private OnSoundFinished(aid: number)
    {
        let idIndex = this.m_arrSoundID.findIndex((sid) =>
        {
            return (sid == aid);
        });
        if(idIndex != -1)
        {
            this.m_arrSoundID.splice(idIndex,1);
        }
    }

    //暂停所有音乐
    public PauseAll(): void
    {
        cc.audioEngine.pauseAll();
        return;
    }

    //重新播放音乐
    public ResumeAll(): void
    {
        cc.audioEngine.resumeAll();
        return;
    }

    /**
     * 卸载音频缓存
     */
    public ClearCache(): void
    {
        cc.audioEngine.uncacheAll();
    }

    //获取播放路径
    private static GetUrl(name: string,type: number = 0): string
    {
        if(type == AudioType.Music)
        {
            return ("/sound/music/" + name);
        }
        else
        {
            return ("sound/sound/" + name);
        }
    }
}


//音频类型 Music音乐, Sound音效
enum AudioType 
{
    Music = 1,
    Sound = 2,
}
