// pages/post_list/post_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        is_attention:'',
        text:1,
        func:1,
        neirong:'已关注',
        UserName:'',
        attentionlist:[{}],
        i:0,
        j:0,
        n:'',
        flag:0,
        user_id:'',
        result:'',
  },
  goto_detailPeople(e){
    var user_id=e.currentTarget.dataset.index;
    wx.setStorageSync('attention_id', user_id)
    console.log(user_id)
    wx.navigateTo({
      url: '/pages/detailed_people/detailed_people',
    })
  },
  isattention(e){
    if(wx.getStorageSync("token")==null){
        wx.showToast({
          title: '请先登录！',
          icon:'error'
        })
    }
    else{
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/?token='+wx.getStorageSync("token"), 
      method: 'get',
      success: function (res) {
          console.log("获取关注列表成功");
          console.log(res);
          that.setData({
              attentionlist:res.data.message,
              text: 0
          })
          if(that.data.attentionlist=="该用户无关注"){
            that.setData({
              text:1,
            })
          }
      }
      })
    }
      //console.log("1mmm"+that.data.attentionlist)
    
  },
 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isattention()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isattention()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})