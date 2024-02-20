// pages/release/vote/vote.js
var app = getApp();
import Api from '../../../api/api.js';
const api = new Api();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionList:[{"index":"1","text":""}],
    toolList: ["一天", "一周", "一个月"],
    typeSelectIndex: 0,
    zdyTime:"自定义",
    voteTitle:"",
    voteDes:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  typeClick(e) {
    var index = e.currentTarget.dataset.key;
    this.setData({
      typeSelectIndex: index
    })
    if (index != 3) {
      this.setData({
        zdyTime: "自定义"
      })
    } 
  },
  juYDateChange(e){
    var value = e.detail.value;
    this.setData({
      zdyTime: value
    })
  },
  addOptionClick(){
    var dict = {};
    dict.text = "";
    dict.index = this.data.optionList.length + 1;
    var list = this.data.optionList;
    list.push(dict);
    this.setData({
      optionList:list
    });
    console.log(this.data.optionList);
  },
  voteDesinput(e){
    this.data.voteDes = e.detail.value;;
  },
  optionInput(e){
    var value = e.detail.value;
    var index = parseInt(e.currentTarget.dataset.key+"");
    var dict = this.data.optionList[index];
    dict.text = value;
  },
  deleteOptionClick(e){
    var index = parseInt(e.currentTarget.dataset.key+"");
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这个选项吗?',
      success: function (res) {
        if (res.confirm) {
          _this.beginDelete(index);
        } else if (res.cancel) {
        }
      }
    });
  },
  beginDelete(index){
    var list = this.data.optionList;
    list.splice(index, 1); 
    this.setData({
      optionList:list
    });
  },
  voteTitleInput(e){
    this.data.voteTitle = e.detail.value;
  },
  beginSave(){
    // if (this.data.voteDes.length == 0){
    //   app.alert("请输入投票描述~");
    //   return;
    // }
    if (this.data.voteTitle.length == 0){
      app.alert("请输入投票题目~");
      return;
    }
    var list = this.data.optionList;
    var isHaveText = false;
    for (var i = 0;i < list.length;i++){
      var data = list[i];
      if (data.text.length > 0){
        isHaveText = true;
        break;
      }
    }
    if (!isHaveText){
      app.alert("请输入投票选项~");
      return;
    }
    var voteList = [];
    for (var i = 0;i < list.length;i++){
      var data = list[i];
      if (data.text.length > 0){
        voteList.push(data.text);
      }
    }
    var dataDict = {};
    dataDict.title = this.data.voteTitle;
    dataDict.options = voteList;
    var timestamp = (new Date()).getTime();
    if (this.data.typeSelectIndex == 0){
      timestamp = timestamp + 24 * 60 * 60 * 1000;
    } else if (this.data.typeSelectIndex == 1) {
      timestamp = timestamp + 7 * 24 * 60 * 60 * 1000;
    } else if (this.data.typeSelectIndex == 2) {
      timestamp = timestamp + 30 * 24 * 60 * 60 * 1000;
    } else if (this.data.typeSelectIndex == 3) {
      var date = this.data.zdyTime +" "+ '00:00:00';
      var date = new Date(date);
      // 有三种方式获取
      var time = date.getTime();
      if (time <= timestamp){
        app.alert("时间选择有误~");
        return;
      }
      if (time - timestamp < 24 * 60 * 60 * 1000){
        time = timestamp + 24 * 60 * 60 * 1000;
      }
      timestamp = time;
    }
    dataDict.endTime = timestamp + "";
    dataDict.endDate = this.getTime(timestamp+"");
    var page = getCurrentPages();
    var upPage = page[page.length - 2];
    upPage.setData({
      voteDict: dataDict
    });
    wx.removeStorageSync('bfList');
    wx.removeStorageSync('zcList');
    wx.navigateBack({
     
    });
  },
  getTime(nS) {
    var date=new Date(parseInt(nS));
    var year=date.getFullYear();
    var mon = date.getMonth()+1;
    if (mon < 10){
      mon = "0"+mon;
    }
    var day = date.getDate();
    if (day < 10){
      day = "0"+day;
    }
    var hours = date.getHours();
    if (hours < 10){
      hours = "0"+hours;
    }
    var minu = date.getMinutes();
    if (minu < 10){
      minu = "0"+minu;
    }
    var sec = date.getSeconds();
    if (sec < 10){
      sec = "0"+sec;
    }
    return year+'-'+mon+'-'+day+' '+hours+':'+minu+':'+sec;
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