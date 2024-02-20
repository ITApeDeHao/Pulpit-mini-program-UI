// pages/vip/vip.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeIndex: 0, //默认选中第一个
        numArray: [20, 30, 50, 80, 100,'m']
      },
      activethis: function(event) { //点击选中事件
        var thisindex = event.currentTarget.dataset.thisindex; //当前index
        this.setData({
          activeIndex: thisindex
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
  /**
   * 页面的初始数据
   */
  
  