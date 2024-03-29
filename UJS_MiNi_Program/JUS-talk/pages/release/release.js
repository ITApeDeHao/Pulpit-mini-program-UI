//index.js
//获取应用实例
var app = getApp();
import Api from '../../api/api.js';
const api = new Api();
Page({
  data: {
    toolList:[{"title":"添加图片","img":"/images/release/addImag.png"},{"title":"发起投票","img":"/images/release/touPiao.png"},{"title":"帮扶","img":"/images/release/bangFu.png"},{"title":"添加种草","img":"/images/release/zhongCao.png"}],
    typeList: ["提问", "救助", "领养", "帮扶","种草"],
    typeSelectIndex:0,
    isShowSave:false,
    textareaHide:false,
    canSave:true,
    textareaText:"",
    inputText:"",
    imageList:[],
    cityName:"添加地点",
    title:"添加简介",
    chooseTye:"video",
    videoUrl:"",
    showMedia:false,
    topIndex:0,
    zcDict:null,
    bfDict:null,
    voteDict:null,
    textList:[],
    headHeigt:44,
    headTop:26,
    headWidht:317,
    navBarHeight:64,
    needToHome:true,
    post_id:"",
    postid:'',
    isChanged:false,
  },
 
  onLoad: function () {
    wx.removeStorageSync('zcList');
    wx.removeStorageSync('bfList');
    var height = wx.getMenuButtonBoundingClientRect().height;
    var top = wx.getMenuButtonBoundingClientRect().top;
    var statausBarHeight = wx.getSystemInfoSync().statusBarHeight;
    var h =  statausBarHeight + height + (top - statausBarHeight) * 2;
    this.setData({
      navBarHeight:h,
      headHeigt: height,
      headTop:top,
    });
    var post_id = wx.getStorageSync('token');
    console.log("======",post_id);
    if (post_id && post_id.length > 0){
      this.data.post_id = post_id;
      // 有缓存的帖子 需恢复数据
      this.getDetailData();
    }

  },
  onShow(){
    var zcString = wx.getStorageSync('zcList');
    console.log(zcString);
    if (zcString && zcString.length > 0){
      var zcDict = JSON.parse(zcString);
      this.data.isChanged = true;
      this.setData({
        bfDict:null,
        voteDict:null,
        typeSelectIndex:4,
        zcDict:zcDict
      });
    }
    var bfString = wx.getStorageSync('bfList');
    if (bfString && bfString.length > 0){
      var bfDict = JSON.parse(bfString);
      this.data.isChanged = true;
      this.setData({
        zcDict:null,
        voteDict:null,
        typeSelectIndex:3,
        bfDict:bfDict
      });
    }
    if (this.data.voteDict){
      this.data.isChanged = true;
      this.setData({
        zcDict:null,
        voteDict:this.data.voteDict,
        typeSelectIndex:0,
        bfDict:null
      });
    }
  },
  textareaClick(e){
    var value = e.detail.value;
    if (value.length > 500){
      value = value.substring(0,500);
    }
    // this.data.textareaText = value;
    // this.data.inputText = this.data.textareaText;
    var list = value.split("#");
    this.setData({
      textareaText:value,
      inputText:value,
      textList: list
    });
    this.data.isChanged = true;


  },
  typeClick(e){
    var index = e.currentTarget.dataset.key;
    this.setData({
      typeSelectIndex:index
    })
  },

  inputTextClick(){
    this.setData({
      textareaHide:false,
      textareaText:this.data.inputText

    });
  },
  toolClick(e){
    if (this.data.textareaText.length > 0){
      this.setData({
        textareaHide:true,
        inputText:this.data.textareaText
      });
    }
    var index = e.currentTarget.dataset.key;
    this.data.topIndex = index;
    if (index == 0) {
      this.goToChooseImages();
    } else if (index == 1) {
      this.goToTouPiao();
    } else if (index == 2) {
      this.goToBangFuJiDi();
    } else if (index == 3) {
      this.goToZhongCao();
    }
  },
  goToTouPiao(){
    wx.navigateTo({
      url: '/pages/release/vote/vote',
    })
  },
  goToBangFuJiDi(){
    wx.navigateTo({
      url: '/pages/index/bangfu/bangfu',
    })
  },
  goToZhongCao(){
    wx.navigateTo({
      url: '/pages/index/bfZhongCao/bfZhongCao',
    })
  },
  goToChooseImages(){
    this.chooseImages();
    // this.chosseMedia();
  },
  beginBack(){
    if (this.data.isChanged){
      this.setData({
        isShowSave: true
      });
    } else {
      this.backHome();
    }
   
  },
  checkNeedSave(){
    if (this.data.inputText.length > 0){
      return true;
    }
    if (this.data.imageList.length > 0){
      return true;
    }
    if (this.data.cityName.length > 0 && this.data.cityName != '添加地点'){
      return true;
    }
    if (this.data.title.length > 0 && this.data.title != '添加标题'){
      return true;
    }
    if (this.data.zcDict){
      return true;
    }
    if (this.data.bfDict){
      return true;
    }
    if (this.data.voteDict){
      return true;
    }
    return false;
  },
  floatClick(){
    this.setData({
      isShowSave:false
    });
  },
  saveClick(e){
    var index = parseInt(e.currentTarget.dataset.key);
    this.setData({
      isShowSave:false
    });
    if (index == 0) {
      this.data.needToHome = true;
      this.savePostClick(-1);
    } else if (index == 1){
      wx.removeStorageSync('POST_ID');
      this.backHome();
    }
  },
  saveDraft(){
    if(wx.getStorageSync('token')==null){
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
    }
    else{
    // this.data.needToHome = false;
    // this.savePostClick(-1);
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/forum/forum/', 
      data: {
          forum: that.data.textareaText,
          intro:that.data.title,
          token:wx.getStorageSync("token")
      },
      method: 'post',
      success: function (res) {
          console.log("成功");
          console.log(res);
          // that.setData({
          //     postid: res.data.postid
          // })
          wx.showToast({
            title: '发布成功！'
          })
          that.setData({
            title:'添加简介',
            textareaText:''
          })
           
      }
      })
    }
  },
  beginSave(){
    // this.data.needToHome = true;
    // this.savePostClick(1);
  },
  goToSelectCity(){
    wx.navigateTo({
      url: '/pages/release/selectCity/selectCity',
    })
  },
  goToAddTitle(){
    var title = this.data.title;
    if (title == '添加标题'){
      title = "";
    }
    wx.setStorageSync('post_title', title);
    wx.navigateTo({
      url: '/pages/release/title/title',
    })
  },
 
  postDidWorkSave(draft){
    if (this.data.inputText.length == 0) {
      app.alert("请输入正文~");
      return;
    }
    var title = this.data.title;
    if (title == "添加标题") {
      title = "";
    }
    var cityName = this.data.cityName;
    if (cityName == "添加地点") {
      cityName = "";
    }
    var type = 1;
    if (this.data.zcDict) {
      type = 4;
    }
    if (this.data.voteDict) {
      type = 2;
    }
    if (this.data.bfDict) {
      type = 3;
    }
    if (!this.data.canSave) return;
    this.data.canSave = false;
    var _this = this;
    var map = {};
    map.address = "";
    if (this.data.bfDict) {
      if (this.data.bfDict.id) {
        map.baseId = this.data.bfDict.id;
      } else {
        map.baseId = this.data.bfDict.basesId;
      }
    }
    if (this.data.zcDict) {
      map.productId = this.data.zcDict.productId;
      map.skuId = this.data.zcDict.skuId;
    }
    if (this.data.voteDict) {
      map.votes = this.data.voteDict.options;
      map.voteTitle = this.data.voteDict.title;
      map.endTime = this.data.voteDict.endTime + "";
    }
    map.city = cityName;
    map.content = this.data.inputText;
    map.draft = draft;
    map.imgs = JSON.stringify(this.data.imageList);
    map.kind = this.data.typeSelectIndex + 1;
    map.title = title;
    map.type = type;
    // map.userId = app.USER_ID();
    map.videoUrl = this.data.videoUrl;

    console.log(JSON.stringify(map));
    // api.getRequestData("http://124.222.22.227:8000/forum/forum/", map, false, "POST").then(res => {
    //   _this.data.canSave = true;
    //   app.HOMENEEDFRESH = true;
    //   if (res.data.errorCode == 0) {
    //     if (draft == -1) {
    //       var data = res.data.model;
    //       wx.setStorageSync('POST_ID', data.id + '');
    //       _this.data.isChanged = false;
    //       app.showToasts("保存成功～");
    //     } else {
    //       _this.data.isChanged = false;
    //       wx.removeStorageSync('POST_ID');
    //       app.showToasts("发布成功～");
    //     }
    //     setTimeout(function () {
    //       if (_this.data.needToHome) {
    //         _this.backHome();
    //       }
    //     }, 1400);
    //   } else {
    //     wx.showToast({
    //       title: res.data.errorMsg,
    //       icon: 'none',
    //       duration: 1500
    //     });
    //   }

    // }).catch(err => {
    //   _this.data.canEvaluate = true;
    // });
  },
  backHome(){
    wx.navigateBack({
      complete: (res) => {},
    })
    // wx.switchTab({
    //   url: '/pages/index/index',
    // })
  },
  // 上传图片
  chosseMedia() {
    this.setData({
      showMedia:true
    });
  },
  hideShareClickView(){
    this.setData({
      showMedia:false
    });
  },
  chooseVideo(){
    this.data.chooseTye = "video";
    this.hideShareClickView();
    var _this = this;
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
        var path = res.tempFilePath;
         _this.upLoadimage(path);     

      }
    })
  },
  chooseImages(){
    this.data.chooseTye = "images";
    this.hideShareClickView();
    var _this = this;
    var count = 9 - this.data.imageList.length;
    if (count <= 0){
      app.alert("最多上传9张图片~");
      return;
    }
    wx.chooseImage({
      count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          var tempPaths = res.tempFilePaths;
          var count = _this.data.imageList.length;
          for (var i = 0;i < tempPaths.length;i++){
            var path = tempPaths[i];
            _this.upLoadimage(path);     
          }
        },
      })
  },
  upLoadimage(tempPath) {
    var _this = this;
    wx.showLoading({
      title: '上传中...',
    })

    wx.uploadFile({
      url: app.host + app.upLoadImageUrl,
      filePath: tempPath,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (response) {
        wx.hideLoading();
        if (response.statusCode == 200){
          var string = response.data;
          var dict = JSON.parse(string);
          if (dict.errorMsg){
            app.alert(dict.errorMsg);
          } else {
            var url = dict.model.fileFullUrl;
            console.log(url);
            if (_this.data.chooseTye == "video"){
              _this.setData({
                isChanged:true,
                videoUrl:url
              });
            } else {
              _this.data.imageList.push(url)
              _this.setData({
                isChanged: true,
                imageList:_this.data.imageList
              });
            }
          }
        }
      },
      fail: function (res) {
        wx.hideLoading();
      }
    })
  },
  
  previewImages(e) {
    var index = parseInt(e.currentTarget.dataset.key);
    var url = this.data.imageList[index];
    wx.previewImage({
      current: url,
      urls: this.data.imageList,
    })
  },
  deleteImage(e){
    var _this = this;
    var index = parseInt(e.currentTarget.dataset.key);
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗?',
      success: function (res) {
        if (res.confirm) {
          _this.beginDelete(index);
        } else if (res.cancel) {
        }
      }
    });
  },

  beginDelete (index) {
    var _this = this;
    var list = [];
    for (var i = 0; i < _this.data.imageList.length; i++) {
      if (i != index) {
        var url = _this.data.imageList[i];
        list.push(url);
      }
    }
    _this.setData({
      imageList: list
    });
  },
  onUnload: function () {
    wx.removeStorageSync('zcList');
    wx.removeStorageSync('bfList');
  },
  getDetailData() {
    var _this = this;
    var map = {};
    map.id = this.data.post_id;
    // map.userId = app.USER_ID();

    // api.getRequestData(app.postDetailtUrl, map, false, "GET").then(res => {
    //   if (res.data.errorCode == 0) {
    //     _this.formatData(res.data.model);
    //   } else {
    //     app.alert(res.data.errorMsg);
    //   }
    // });
  },
  formatData(dataDict){
    var _this = this;
    var postDict = dataDict.post;
    var kind = postDict.kind;
    if (kind == 4) {
      // 帮扶
      var bangFuDict = dataDict.bases;
      console.log("========", bangFuDict);
      wx.setStorageSync('bfList', JSON.stringify(bangFuDict))
      _this.setData({
        zcDict:null,
        voteDict:null,
        typeSelectIndex:3,
        bfDict:bangFuDict
      });
    } else if (kind == 5) {
      // 种草
      var productId = postDict.productId;
      var skuId = postDict.skuId;
      _this.getGoodDetail(productId,skuId);
    } else {
      var voteList = dataDict.votes;
      if (voteList){
        var voteDict = {};
        voteDict.title = postDict.voteTitle;
        var endTime = postDict.endTime;
        voteDict.endDate = endTime;
        var optionsList = [];
        for(var i = 0;i < voteList.length;i++){
          var dict = voteList[i];
          optionsList.push(dict.vote.content);
        }
        voteDict.options = optionsList;
        _this.setData({
          voteDict:voteDict
        });
      }
    }
    var imgString = postDict.imgs;
    if (imgString){
      if (imgString.length > 0){
        var list = JSON.parse(imgString);
        _this.setData({
          imageList:list
        });
      }
    }
    var videoUrl = postDict.videoUrl;
    if (videoUrl){
      if (videoUrl.length > 0){
        _this.setData({
          videoUrl:videoUrl
        });
      }
    }
    var content = postDict.content;
    if (content){
      var list = content.split("#");
      this.setData({
        textList: list
      });
    }
    _this.setData({
      title:postDict.title.length > 0 ?postDict.title:'添加标题',
      cityName:postDict.city.length > 0 ? postDict.city:'添加地点',
      textareaText:postDict.content,
      inputText:postDict.content,
      detailData: dataDict
    });
  },
  getGoodDetail(productId,skuId) {
    var _this = this;
    var map = {};
    map.productId = productId;
    api.getRequestData(app.goodsDetailUrl, map, true, "GET").then(res => {
      if (res.data.errorCode == 0) {
        var list = res.data.model.skus;
        var skuDict = null;
        for(var i = 0;i < list.length;i++){
          var dict = list[i];
          if (dict.id == skuId){
            skuDict = dict;
            break;
          }
        }
       _this.setData({
        bfDict:null,
        voteDict:null,
        typeSelectIndex:4,
        zcDict: skuDict
       });
      } 
    });
  },
})
