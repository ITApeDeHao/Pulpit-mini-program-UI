// pages/set/set.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },
    loginOut() {
        // 清除用户缓存
        wx.setStorageSync('token', null)
        wx.setStorageSync('UserName', null)
        wx.setStorageSync('user_id', null)
        wx.setStorageSync('resume', null)
        console.log(wx.getStorageSync('token'))
        console.log(wx.getStorageSync('UserName'))
        let pages = getCurrentPages(); // 当前页面
        let beforePage = pages[pages.length - 2]; // 上一页
        wx.navigateBack({
          success:res => {
            beforePage.onLoad();//周期函数或者函数名
          }
        })
      

    },
    change_changepassword(e){
        wx.navigateTo({
          url: '/pages/changepassword/changepassword',
        })
    },
    change_username(e){
        wx.navigateTo({
          url: '/pages/changeusername/changeusername',
        })
    },
    change_resume(e){
        wx.navigateTo({
            url: '/pages/change_resume/change_resume',
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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