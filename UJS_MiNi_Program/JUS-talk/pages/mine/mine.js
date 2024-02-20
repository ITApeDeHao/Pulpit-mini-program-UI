// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token:'游客登录',
        resume:''
       
    },
    change(e){
        //console.log(this.data.token)
        if(this.data.token=='游客登录'){
          wx.navigateTo({
          url: '/pages/register/register',
        })  
        }else{
          //进入用户信息管理界面
        }

      },
    change_feedback(e){
        wx.navigateTo({
          url: '/pages/feedback/feedback',
        })
      },
    change_set(e){
        wx.navigateTo({
          url: '/pages/set/set',
        })
    },
    change_vip(e){
        wx.navigateTo({
          url: '/pages/vip/vip',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try{
            // 同步接口立即写入
            // console.log(that.phoneNumber)
            // console.log(that.data.token)
            var str=wx.getStorageSync('UserName')
            if(str==null){
                var resume = wx.getStorageSync('resume')
              this.setData({
                resume:'',
                token:'游客登录'

              })
            }
            //console.log(str)
            else if(str!=null){
                var resume = wx.getStorageSync('resume')
                this.setData({
                    token:str,
                    resume:resume
                })
            }
          }catch (e) {
            console.log('获取value2发生错误')
          }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})