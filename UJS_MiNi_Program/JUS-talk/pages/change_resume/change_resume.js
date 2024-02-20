// pages/changeusername/changeusername.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        resume:''
    },
    resumeInputAction(options){
        this.data.resume=options.detail.value
        console.log(this.data.resume)
    },
    changeing:function (event) {
        let that=this
        
        wx.request({
            url:'http://124.222.22.227:8000/user/changename/', 
            data: {
                token:wx.getStorageSync('token'),
                resume:that.data.resume
            },
            method: 'put',
            success: function (res) {
                console.log("成功");
                console.log(res);
                if(res.data.Status==1){
                    wx.setStorageSync('resume', that.data.resume)
                    console.log(that.data.username)
                    let pages = getCurrentPages(); // 当前页面
                    let beforePage = pages[pages.length - 3]; // 上一页
                    wx.navigateBack({
                      success:res => {
                        beforePage.onLoad();//周期函数或者函数名
                      }
                  })
                }else{
                    wx.showToast({
                      title: '用户未登录',
                      icon: 'error'
                    })
                }
            }
           
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