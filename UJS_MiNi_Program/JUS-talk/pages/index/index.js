//Page Object
// import {request } from "../../request/index.js";
Page({
  data: {
   swiperList:[],
   i:'',
   j:0,
   n:'',
   index:"0",
   attention_people:[{}],
   lecture:[{}],
    //   帖子进入详细页面需要将id传入后端，根据返回数据显示具体内容
    post:[{}],
    func:'',
    attentionlist:[{}],
    flag:0,
    user_id:'',
    user_name:'',
    text:[],
    offset:0,
    limit:5,
    offset1:0,
    limit1:5,
    offset2:0,
    limit2:5,
    num:'',
    num1:'',
    num2:'',
   tabs:[
    {
        id:0,
        value:"学术讲座",
        isActive:true
      },
     {
       id:1,
       value:"小帖子",
       isActive:false
      },
      {
        id:2,
        value:"优秀生",
        isActive:false
      }
   ]
  },
  isattention(e){
    let that=this
    if(wx.getStorageSync("token")==null){
    }
    else{
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/?token='+wx.getStorageSync("token"), 
      method: 'get',
      success: function (res) {
          that.setData({
              attentionlist:res.data.message
          })
          for(that.data.i=0;that.data.i<that.data.attention_people.length;that.data.i++){
            that.data.flag=0
            for(that.data.j=0;that.data.j<that.data.attentionlist.length;that.data.j++){
            if(that.data.attention_people[that.data.i].user_name==that.data.attentionlist[that.data.j].UserName){
                that.setData({
                  flag:1,
                })
                that.data.attention_people[that.data.i].is_attention='已关注'
            }
            else if(that.data.flag==0){
              that.data.attention_people[that.data.i].is_attention='关注'
            }
          }
          }
          let temp=that.data.attention_people
               that.setData({
            attention_people:temp
          })
      }
      })
    }
  },
  clicktoattention(e){
    if(wx.getStorageSync('token')!=null){
    this.data.user_id=e.currentTarget.dataset.index;
    let that=this
    that.isattention()
    for(that.data.i=0;that.data.i<that.data.attention_people.length;that.data.i++){
      if(that.data.attention_people[that.data.i].user_id==that.data.user_id){
          that.setData({
            n:that.data.i
          })
          break;
      }
    }
    that.data.flag=0
      for(that.data.j=0;that.data.j<that.data.attentionlist.length;that.data.j++){
      if(that.data.attention_people[that.data.n].user_name==that.data.attentionlist[that.data.j].UserName){
          that.setData({
            func:1,
            flag:1
          })
      }
      else if(that.data.flag==0){
        that.setData({
            func:0
          })
      }
    }
    if(this.data.func==0){
      let that=this
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/', 
      method: 'post',
      data:{
        func:1,
        token:wx.getStorageSync("token"),
        attention_id:that.data.user_id
      },
      success: function (res) {
         that.setData({
            result:res.data.message,
         })
         if(res.data.Status==true){
             console.log('1111')
            wx.showToast({
           title: '关注成功！',
         })
         that.data.attention_people[that.data.n].is_attention='已关注'
         let temp=that.data.attention_people
          that.setData({
            attention_people:temp
          })
         that.setData({
          func:1,
        })
         }
         else if(that.data.status==false)
         {
          wx.showToast({
            title: that.data.result,
            icon:"error"
          })
          that.setData({
            func:1, 
          })
         }
      }
      })
    }
    else if(this.data.func==1){
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/user/Attention/', 
      method: 'post',
      data:{
        func:0,
        token:wx.getStorageSync("token"),
        attention_id:that.data.attention_people[that.data.n].user_id
      },
      success: function (res) {
          console.log("成功");
          console.log(res);
          that.data.attention_people[that.data.n].is_attention='关注'
          let temp=that.data.attention_people
          that.setData({
            attention_people:temp
          })
         that.setData({
            result:res.data.message,
            func:0,
         })
         wx.showToast({
          title: '取消关注成功',
        }) 
      }
      })
    }}
    else{
      wx.showToast({
        title: '请先登录！',
      icon:'error'
      })
    }
  },
  getConcernedPeople(e){
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/user/recommand/?offset='+that.data.offset1+'&limit='+that.data.limit1, 
      method: 'get',
      success: function (res) {
          that.setData({
            attention_people:res.data.result,
            num1:res.data.num
          })
          for(that.data.i=0;that.data.i>=0&&that.data.i<that.data.   attention_people.length;that.data.i++){
            that.data.attention_people[that.data.i].is_attention="关注"
          }  
          let temp=that.data.attention_people
          that.setData({
            attention_people:temp
          })
      }
      })
      if(that.data.num1>=that.data.offset1){
        that.setData({
          offset1:that.data.offset1+that.data.limit1
        })
       }
       else{
        that.setData({
            offset1:that.data.num1,
          })
        }
    
  },
  goto_detailpost(e){
    var forum_id=e.currentTarget.dataset.index;
    wx.setStorageSync('forum_id', forum_id)
    console.log(forum_id)
    wx.navigateTo({
      url: '/pages/detailed_post/detailed_post',
    })
  },
  get_postInfor(e){
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/forum/intro/?offset='+that.data.offset+'&limit='+that.data.limit, 
      method: 'get',
      success: function (res) {
          that.setData({
              post:res.data.message,
              num:res.data.num
          })
          for(that.data.i=0;that.data.i>=0&& that.data.i<that.data.post.length;){
            let temp='post['+that.data.i+'].time'
            that.setData({
              [temp]:new Date(res.data.message[that.data.i].time*1000).toLocaleString(),
             i:that.data.i+1
          })
           } 
      }
      })
      if(that.data.num>that.data.limit){
        let t=5
        that.setData({
          limit:that.data.limit+t
        })
       }
       else{
        
        }
     
      console.log("11111")
      console.log(that.data.limit)
      
  },
  get_lecture(e){
    let that=this
    wx.request({
      url:'http://124.222.22.227:8000/lecture/?offset='+that.data.offset2+'&limit='+that.data.limit2, 
      method: 'get',
      success: function (res) {
          console.log("获取讲座");
          console.log(res); 
          that.setData({
            lecture:res.data.message,
            num2:res.data.num
          })  
          for(that.data.i=0;that.data.i>=0&& that.data.i<that.data.lecture.length;){
            let temp='lecture['+that.data.i+'].course_data'
            that.setData({
              [temp]:new Date(res.data.message[that.data.i].course_data*1000).toLocaleString(),
            i:that.data.i+1
          })
             } 
      }

      })
   if(that.data.num2>that.data.limit2){
    let t=5
    that.setData({
      limit2:that.data.limit2+t
    })
   }
   else{
    
    }
    
  },
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs,
      index:index,
    })
    if(this.data.index==0){
        this.get_lecture();
        this.setData({
          i:0
        })
      }
    if(this.data.index==1){
      this.get_postInfor();
      this.setData({
        i:1
      })
    }
    if(this.data.index==2){
      this.getConcernedPeople()
      this.isattention();
      this.setData({
        i:2
      })
    }
  },
  //options(Object)
  onLoad: function(options) {
    this.isattention()
    this.get_lecture()
  },
  onReady: function() {
    
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  