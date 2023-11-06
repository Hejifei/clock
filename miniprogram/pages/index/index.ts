// index.ts
import Toast from '@vant/weapp/toast/toast';
// 获取应用实例
const app = getApp<IAppOption>()

Page({
    data: {
        interval: 0.25,
        numberOfReminders: 3,
        leftNumberOfReminders: 3,
        time: 15 * 1000,
        timeData: {},
        timer: null,
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },
    onLoad() {
        const that = this;
        // wx.getStorage({
        //     key: "timtConfig",
        //     success(res) {
        //         let resObj: {
        //             interval?: number
        //             numberOfReminders?: number
        //         } = {}
        //         try {
        //             resObj = JSON.parse(res.data)
        //         } catch (err) {
        //             console.log(err)
        //         }
        //         that.setData({
        //             interval: resObj?.interval || 10,
        //             numberOfReminders: resObj?.numberOfReminders || 10,
        //             leftNumberOfReminders: resObj?.numberOfReminders || 10,
        //             time: (resObj?.interval || 10) * 60 * 1000,
        //         })
        //     },
        //     fail(res) {
        //         that.setData({
        //             interval: 10,
        //             numberOfReminders: 3,
        //             leftNumberOfReminders: 3,
        //             time: 10 * 60 * 1000,
        //         })
        //     }
        // })
    },
    onChange(e) {
        this.setData({
          timeData: e.detail,
        });
    },
    start() {
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
    },

    finished() {
        Toast('倒计时结束');
        const that = this;
        const leftTimes = that.data.leftNumberOfReminders - 1
        console.log({
            leftNumberOfReminders: that.data.leftNumberOfReminders,
            leftTimes,
            time: this.data.time,
            newtime: this.data.interval * 60 * 1000,
        })
        // this.setData({
        //     leftNumberOfReminders: leftTimes,
        // })
        if (leftTimes > 0) {
            this.setData({
                // time: this.data.interval * 60 * 1000,
                leftNumberOfReminders: leftTimes,
            }, () => {
                // setTimeout(() => {
                //     that.start()
                // }, 16);
            })
            const countDown = this.selectComponent('.control-count-down');
            countDown.reset();
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
        innerAudioContext.src = 'https://m801.music.126.net/20231106234303/36c09a91d6f5f106bffae42aa780caaf/jdyyaac/005c/005d/0558/76513378ae773cb1c43a226f40a1bc93.m4a'; // 请替换为你的音频文件路径
        innerAudioContext.onPlay(() => {
            console.log('开始播放');
        });

        setTimeout(() => {
            innerAudioContext.stop()
        }, 1000 * 10);
        innerAudioContext.onError((res) => {
            console.log('播放错误', res.errMsg);
        });
    }
})
