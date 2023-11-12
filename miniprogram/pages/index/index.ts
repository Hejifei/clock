// index.ts
import Toast from '@vant/weapp/toast/toast';
import moment from 'moment'
// 获取应用实例
// const app = getApp<IAppOption>()

Page({
    data: {
        show: false,
        time: 0,
        timeData: {},
        timer: null,
        recordList: [],
        songPlaySeconds: 3,
        dataList: [{
            name: '',
            timeListStr: '',
            remark: '',
        }],
        columns: [],
        activeIndex: 0,
        targetMinuteList: [0],
        restMinuteList: [0],
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
                    songPlaySeconds?: number
                    dataList?: {
                        name: string
                        timeListStr: string
                        remark: string
                    }[]
                } = {}
                try {
                    resObj = JSON.parse(res.data)
                } catch (err) {
                    console.log(err)
                }
                const dataList = resObj?.dataList || []
                const columns = dataList.map(item => ({
                    text: `${item.name} 时间间隔:(${item.timeListStr})`
                }))
                that.setData({
                    songPlaySeconds: resObj?.songPlaySeconds || 10,
                    dataList,
                    columns,
                }, () => {
                    that.getInitCountDownValue()
                })
            },
            fail(res) {
                that.setData({
                    songPlaySeconds: 10,
                    dataList: [],
                    columns: [],
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
        const that = this;
        const countDown = this.selectComponent('.control-count-down');
        countDown.start();
    },

    pause() {
        const countDown = this.selectComponent('.control-count-down');
        countDown.pause();
    },
    skip() {
        this.pause()
        this.recordListAdd('skip')

        const {
            restMinuteList,
        } = this.data
        let time = 0
        if (restMinuteList.length > 0) {
            time = restMinuteList.shift()

            this.setData({
                restMinuteList,
                time: time * 60 * 1000,
                // time: time * 1000,
            })

            const countDown = this.selectComponent('.control-count-down');
            countDown.reset();
            countDown.start();
        }
    },
    reset() {
        const countDown = this.selectComponent('.control-count-down');
        countDown.reset();
        this.setData({
            recordList: [],
        })
    },
    recordListAdd(status?: string = 'finish') {
        const recordList = this.data.recordList
        recordList.push({
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            num: recordList.length + 1,
            minute: this.data.time / 60 / 1000,
            status,
            // minute: this.data.time / 1000,
        })
        this.setData({
            recordList,
        })
    },
    finished() {
        this.recordListAdd()

        const {
            restMinuteList,
        } = this.data
        let time = 0
        if (restMinuteList.length > 0) {
            time = restMinuteList.shift()

            this.setData({
                restMinuteList,
                time: time * 60 * 1000,
                // time: time * 1000,
            })

            const countDown = this.selectComponent('.control-count-down');
            countDown.reset();
            countDown.start();
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
    getInitCountDownValue() {
        const {
            dataList,
            activeIndex: index,
        } = this.data
        const targetMinuteList = (dataList[index].timeListStr || '')
            .replace(/，/gi, ',')
            .split(',')
            .filter(e => e)
            .map(item => +item)
        const restMinuteList = [...targetMinuteList]
        let time = 0
        if (restMinuteList.length > 0) {
            time = restMinuteList.shift()
        }
        this.setData({
            targetMinuteList,
            restMinuteList,
            time: time * 60 * 1000,
            // time: time * 1000,
            recordList: [],
        })
        console.log({
            targetMinuteList: this.data.targetMinuteList,
        })
    },
    onConfirm(event) {
        const that = this;
        const { picker, value, index } = event.detail;

        this.setData({
            activeIndex: index,
        }, () => {
            that.getInitCountDownValue();
        })
        this.onPopupClose();
    },
    
    onCancel() {
        Toast('取消');
        this.onPopupClose();
    },
    showPopup() {
        this.setData({ show: true });
    },
    onPopupClose() {
        this.setData({ show: false });
    },
})
