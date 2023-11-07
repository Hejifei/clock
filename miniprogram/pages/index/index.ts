// index.ts
import Toast from '@vant/weapp/toast/toast';
import moment from 'moment'
// 获取应用实例
// const app = getApp<IAppOption>()

Page({
    data: {
        interval: 0,
        numberOfReminders: 3,
        leftNumberOfReminders: 3,
        time: 5 * 1000,
        timeData: {},
        timer: null,
        recordList: [],
        songPlaySeconds: 3,
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },
    onLoad() {
        console.log('onShow')
        const that = this;
        wx.getStorage({
            key: "timtConfig",
            success(res) {
                let resObj: {
                    interval?: number
                    numberOfReminders?: number
                    songPlaySeconds?: number
                } = {}
                try {
                    resObj = JSON.parse(res.data)
                } catch (err) {
                    console.log(err)
                }
                that.setData({
                    interval: resObj?.interval || 10,
                    numberOfReminders: resObj?.numberOfReminders || 10,
                    leftNumberOfReminders: resObj?.numberOfReminders || 10,
                    time: (resObj?.interval || 10) * 60 * 1000,
                    songPlaySeconds: resObj?.songPlaySeconds || 10,
                })
            },
            fail(res) {
                that.setData({
                    interval: 10,
                    numberOfReminders: 3,
                    leftNumberOfReminders: 3,
                    time: 10 * 60 * 1000,
                    songPlaySeconds: 10,
                })
            }
        })
    },
    onChange(e: any) {
        this.setData({
          timeData: e.detail,
        });
    },
    start() {
        console.log({
            leftNumberOfReminders: this.data.leftNumberOfReminders,
        })
        if (this.data.leftNumberOfReminders === 0) {
            return
        }
        const that = this;
        const countDown = this.selectComponent('.control-count-down');
        countDown.start();
    },

    pause() {
        const countDown = this.selectComponent('.control-count-down');
        countDown.pause();
    },

    reset() {
        const countDown = this.selectComponent('.control-count-down');
        countDown.reset();
        this.setData({
            recordList: [],
            leftNumberOfReminders: this.data.numberOfReminders,
        })
    },
    recordListAdd() {
        const recordList = this.data.recordList
        recordList.push({
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            num: recordList.length + 1,
        })
        this.setData({
            recordList,
        })
    },
    finished() {
        // Toast('倒计时结束');
        const that = this;
        this.recordListAdd()
        const leftTimes = that.data.leftNumberOfReminders - 1
        // console.log({
        //     leftNumberOfReminders: that.data.leftNumberOfReminders,
        //     leftTimes,
        //     time: this.data.time,
        //     newtime: this.data.interval * 60 * 1000,
        // })
        // this.setData({
        //     leftNumberOfReminders: leftTimes,
        // })
        if (leftTimes >= 0) {
            that.setData({
                // time: this.data.interval * 60 * 1000,
                leftNumberOfReminders: leftTimes,
            })
        }
        if (leftTimes > 0) {
            
            // setTimeout(() => {
                const countDown = this.selectComponent('.control-count-down');
                countDown.reset();
                countDown.start();
            // }, 1000);
        }
        
        this.playAudio()
    },
    playAudio() {
        // const innerAudioContext = wx.createInnerAudioContext({
        //     useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        //   })
        //   innerAudioContext.src = 'alis.ncm'
          
        //   innerAudioContext.play() // 播放
          
        //   innerAudioContext.pause() // 暂停
          
        //   innerAudioContext.stop() // 停止

        const innerAudioContext = wx.createInnerAudioContext();
        innerAudioContext.autoplay = true;
        // innerAudioContext.src = 'https://m701.music.126.net/20231107195255/557d60df41dfb6a27d532c9a5072db9a/jdyyaac/005c/005d/0558/76513378ae773cb1c43a226f40a1bc93.m4a'; // 请替换为你的音频文件路径
        innerAudioContext.src = 'https://webfs.hw.kugou.com/202311072005/94913d7c0a53381a92b4ef916e281876/v2/690fb99a871dbc14cbfdc43bef16a829/G209/M06/0C/17/EQ4DAF6wq0uAQkBrACTskSjWf6Y926.mp3'
        innerAudioContext.onPlay(() => {
            console.log('开始播放');
            // Toast('开始播放');
        });

        setTimeout(() => {
            innerAudioContext.stop()
        }, 1000 * this.data.songPlaySeconds);
        innerAudioContext.onError((res) => {
            // Toast('播放错误');
            console.log('播放错误', res.errMsg);
        });
    },
    onClickLeft() {
        wx.navigateTo({
            url: '/pages/setting/index',
        })
    },
})
