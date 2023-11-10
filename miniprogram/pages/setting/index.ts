// index.ts
import Toast from '@vant/weapp/toast/toast';
// 获取应用实例
const app = getApp<IAppOption>()

Page({
    data: {
        interval: 0,
        numberOfReminders: 0,
        songPlaySeconds: 0,
        dataList: [
            {
                name: '1',
                timeListStr: '',
                remark: '',
            },
        ]
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },
    onLoad() {
        const that = this;
        wx.getStorage({
            key: "timtConfig",
            success(res) {
                let resObj: {
                    interval?: number
                    numberOfReminders?: number
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
                that.setData({
                    interval: resObj?.interval || 10,
                    numberOfReminders: resObj?.numberOfReminders || 10,
                    songPlaySeconds: resObj?.songPlaySeconds || 10,
                    dataList: resObj?.dataList || [{
                        name: '',
                        timeListStr: '',
                        remark: '',
                    }]
                })
            },
            fail(res) {
                that.setData({
                    interval: 10,
                    numberOfReminders: 3,
                    songPlaySeconds: 10,
                })
            }
        })
    },
    onClickLeft() {
        // wx.showToast({ title: '点击返回', icon: 'none' });
        wx.navigateBack();
        // wx.reLaunch({
        //     url: '/pages/index/index',
        // })
    },
    onInputChange(event: any) {
        const { index, name } = event.currentTarget.dataset
        const value = event.detail.toString()
        const dataList = this.data.dataList
        dataList[index][name] = value
        // this.setData({
        //     dataList: [...dataList],
        // })
    },
    onDeleteClick(event: any) {
        const { index } = event.currentTarget.dataset
        const dataList = this.data.dataList
        dataList.splice(index, 1)
        this.setData({
            dataList: [...dataList],
        })
    },
    handleAddClick() {
        this.setData({
            dataList: [
                ...this.data.dataList,
                {
                    name: '',
                    timeListStr: '',
                    remark: '',
                }
            ]
        })
    },
    handleSave() {
        wx.setStorage({
            key:"timtConfig",
            data: JSON.stringify({
                // interval: +this.data.interval,
                // numberOfReminders: +this.data.numberOfReminders,
                songPlaySeconds: +this.data.songPlaySeconds,
                dataList: this.data.dataList
            })
        })
        Toast.success('保存成功');
        wx.reLaunch({
            url: '/pages/index/index',
        })
    }
})
