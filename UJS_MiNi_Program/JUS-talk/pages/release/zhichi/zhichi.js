// pages/release/zhichi/zhichi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [1, 5, 10, 20, 50, 100, 200, 500, 1000],
    selectedIndex:6,
    dsText:'确定支持(200斤)',
    money:"200",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  itemClick(e){
    var index = e.currentTarget.dataset.key;
    var text = this.data.dataList[index];
    this.data.money = text+"";
    text = '确定打赏(' + text+'元)';
    this.setData({
      selectedIndex: index,
      dsText: text
    });
  },
  otherClick(){
    this.setData({
      selectedIndex: -1
    });
  },
  inputMoney(e){
    var value = e.detail.value;
    var money = this.isPositiveInteger(value);
    if (money){
      this.data.money = money+"";
      var text = '确定支持(' + value + '斤)';
      this.setData({
        dsText: text
      });
    } else {
      this.data.money = "";
    }
    console.log(money);
  },
  isPositiveInteger(s) {
    var re = /^[0-9]+$/;
    return re.test(s)
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