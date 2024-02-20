// pages/detailed_post/detailed_post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      post:[{}],
      content:'',//文本类容
      attentionlist:'',
      comment:[{}],
      forum_id:'',
      func:'',
      text:'关注',
      result:'',
      i:0,
      flag:0,
      like:0,
      spot:'',
    hasChange: false,
    show:false,
    favor_img2: "../../icons/爱心.png",
    favor_img: "../../icons/full.png",
    offset:0,
    limit:5,
    num:''

  },
  // 点赞
  praiseThis: function (e) {
    var that = this;
    var hasChange = that.data.hasChange;
    wx.request({
      url: 'http://124.222.22.227:8000/forum/spot/',//这里写后台点赞接口的url
      //定义传到后台的数据
      data: {
        forum_id: that.data.forum_id,//文章ID,
        user_id: wx.getStorageSync('user_id')//我的ID
      },
      method: 'post',//定义传到后台接受的是post方法还是get方法
      success: function (res) {
        that.setData({
            spot: res.data.data,
            show: !that.data.show
        })
        console.log(that.data)
      },
      fail: function (res) {
        console.log("失败");
      }
    });

  },
  
// 关注列表
  isattention(e){
    if(wx.getStorageSync('token')==null){}
    else{
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/?token='+wx.getStorageSync("token"), 
      method: 'get',
      success: function (res) {
          console.log("成功");
          console.log(res);
          that.setData({
              attentionlist:res.data.message
          })
          for(that.data.i=0;that.data.i<that.data.attentionlist.length;that.data.i++){
            if(that.data.attentionlist[that.data.i].UserName==that.data.post.UserName){
                that.setData({
                  flag:1,
                  func:1,
                  text:"已关注"

                })
                break;
            }
          }
          // 这里还要加上获取关注列表后，列表中没有改userid的条件时
          if(that.data.attentionlist=="该用户无关注"||that.data.flag==0){
            console.log("hhhhh")
            setTimeout(() => {
              that.setData({
                func:0,
                text:"关注"
              })
            },30)
            
          }
       
      }
      })
    }
      //console.log("1mmm"+that.data.attentionlist)
    
  },
  // 点击关注
  clicktoattention(e){
    if(wx.getStorageSync('token')==null){
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
    }
    else{
    if(this.data.func==0){
      let that=this
      console.log(wx.getStorageSync("token"))
      console.log(that.data.post.user_id)
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/', 
      method: 'post',
      data:{
        func:1,
        token:wx.getStorageSync("token"),
        attention_id:that.data.post.user_id
      },
     
      success: function (res) {
          console.log("成功");
          console.log(res);
          
         that.setData({
            result:res.data.message,
         })
         if(that.data.result=="关注成功"){
           wx.showToast({
           title: '关注成功！',
         })
         that.setData({
          func:1,
          text:"已关注"
        })
         }
         else if(that.data.result=="请勿重复关注")
         {
          wx.showToast({
            title: '请勿重复关注',
            icon:"error"
          })
          that.setData({
            func:1,
            text:"已关注"
          })

         }
      }
      })
    }
    else if(this.data.func==1){

      let that=this
      console.log(wx.getStorageSync("token"))
      console.log(that.data.post.user_id)
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/', 
      method: 'post',
      data:{
        func:0,
        token:wx.getStorageSync("token"),
        attention_id:that.data.post.user_id
      },
     
      success: function (res) {
          console.log("成功");
          console.log(res);
          
         that.setData({
            result:res.data.message,
            func:0,
            text:"关注"
         })
         wx.showToast({
          title: '取消关注成功',
        })
        
        
      }
      })
    }
  }
  },
  // 获取焦点 唤起软键盘
  bindfocus(e){
    console.log(e, '键盘弹起')
    console.log(e)
    this.setData({
      bottomHeight:e.detail.height //将键盘的高度设置为comment容器与page容器下边界之间的距离。
    })
   
    },
    // 输入内容
    bindinput(e){
      this.setData({
        content:e.detail.value
      })
    },
    // 失去焦点 
    bindblur(e){
      console.log(e, '收起键盘')
      this.setData({
        bottomHeight:0
      })
    },
    //发送评论
    sendOut(e){
      if(wx.getStorageSync('token')==null){
        wx.showToast({
          title: '请先登录！',
          icon:'error'
        })
      }
      else{
      let that=this 
       console.log(that.data.forum_id)
       console.log(wx.getStorageSync('user_id'))
       console.log(that.data.content)
    wx.request({
      url:'http://124.222.22.227:8000/forum/comment/',
      data:{
        parent_id:"",
        forum_id:that.data.forum_id,
        user_id:wx.getStorageSync('user_id'),
        content:that.data.content
      },
      method: 'post',
      success: function (res) {
          console.log("评论成功");
          console.log(res);
          wx.showToast({
            title: '评论成功',
          })
       
      }
      })
      that.setData({
        content:''
      })
      that.getcomment()
    }
      
    },
    //获取评论
    getcomment(e){
      let that=this 
      console.log("zheshiformuid")
      console.log(that.data.forum_id)
   wx.request({
     url:'http://124.222.22.227:8000/forum/comment/?limit='+that.data.limit+'&offset='+that.data.offset+'&forum_id='+that.data.forum_id,
     method: 'get',
     success: function (res) {
         console.log("获取评论成功");
         console.log(res);
         that.setData({
            comment:res.data.message,
            num:res.data.num
         })
         for(that.data.i=0;that.data.i>=0&& that.data.i<that.data.comment.length;){
          let temp='comment['+that.data.i+'].time'
          that.setData({
            [temp]:new Date(res.data.message[that.data.i].time*1000).toLocaleString(),
            i:that.data.i+1
        })
       } 
       console.log(that.data.comment)
       if(that.data.num>that.data.limit){
        let t=5
        that.setData({
          limit:that.data.limit+t
        })
       }
       else{
        
        }
     }
     })
     let t=5
     that.setData({
       limit:that.data.limit+t
     })
    },
  // 加载页面
  loading(e){
  let that=this
  wx.request({
    url:'http://124.222.22.227:8000/forum/forum/?forum_id='+that.data.forum_id, 
    method: 'get',
    success: function (res) {
        console.log(res)
        that.setData({
            post:res.data.message,
            spot:res.data.message.spot
        })
        let temp='post.time'
          that.setData({
            [temp]:new Date(res.data.message.time*1000).toLocaleString(),
          })
        console.log(that.data.post)
        
       
    
  }
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.forum_id=wx.getStorageSync('forum_id')
    console.log(this.data.forum_id)
    this.loading()
    this.isattention()
    this.getcomment()

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