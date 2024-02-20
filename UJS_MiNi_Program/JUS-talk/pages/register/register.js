// pages/register/register.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      current:1,
      codeText:'获取验证码',
      counting:false,
      password:'',
      phoneNumber:'',
      code:'',
      cf_password:'',
      token:'',
      id:'',
      status:'',
      UserName:'',
      user_id:'',
      flag_pswd:0,     //判断两次输入的密码是否一致
      resume:''
    },
    // 登陆注册监听
    click(e){
      let index = e.currentTarget.dataset.code;
      console.log(index)
      this.setData({
          current:index
      })
      console.log(this.data.current)
    },
    //获取验证码 
    getCode(){
      var that = this;
      if (!that.data.counting) {
        wx.request({
            url: 'http://124.222.22.227:8000/user/register/phoneCode/?Phone='+that.data.phoneNumber, //接口地址
            data: {
                Phone: that.data.phoneNumber,// 参数：值
            },
            success(res) {
                    // 返回值
                    console.log(res.data)
            }
        })
        wx.showToast({
          title: '验证码已发送',
        })
        //开始倒计时60秒
        that.countDown(that, 60);
      } 
    },
    //倒计时60秒
    countDown(that,count){
      if (count == 0) {
        that.setData({
          codeText: '获取验证码',
          counting:false
        })
        return;
      }
      that.setData({
        counting:true,
        codeText: count + '秒后重新获取',
      })
      setTimeout(function(){
        count--;
        that.countDown(that, count);
      }, 1000);
    },

    phoneNumberInputAction: function (options) {
        //获取输入框输入的内容
        this.data.phoneNumber = options.detail.value;
        //console.log("输入的内容是 " + this.phone)
        
      },
    
      passwordInputAction: function (options) {
        //获取输入框输入的内容
        this.data.password = options.detail.value;
        //console.log("输入输入的内容是 " + this.password)
        
      },
      resumeInputAction: function(options){
          this.setData({
              resume:options.detail.value
          })
      },
      codeInputAction:function(options) {
        //获取输入框输入的内容
        this.data.code = options.detail.value;
        //console.log("输入输入的内容是 " + this.code)
        
      },
      confirm_passwordInputAction: function (options) {
        //获取输入框输入的内容
        this.data.cf_password = options.detail.value;
        //console.log("输入输入的内容是 " + this.cf_password)
        
      },

      confirm_password:function(){
        //console.log('we')
        if(this.data.password==this.data.cf_password){
            this.setData({
                flag_pswd:1   
            })
        }
      },

      change_forgetpswd:function(e){
          wx.navigateTo({
            url: '/pages/forget_pswd/forget_pswd',
          })
      },
        /**
       * 输入手机号
       */
      logining: function (event) {
        // console.log('username', event.detail.value)
        const regex =  /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (this.data.phoneNumber.length !== 0 && this.data.phoneNumber.length !== 11) {
          wx.showToast({
            title: '手机号长度不对',
            icon:"error"
          })
        } else if (this.data.phoneNumber.length !== 0 && !regex .test(this.data.phoneNumber)) {
            wx.showToast({
              title: '手机号格式不对',
              icon:'error'
            })
        }else {
            this.confirm_password()
            // console.log(this.data.current)
            // console.log(this.data.flag_pswd)
            // console.log(this.phoneNumber)
            // console.log(this.password)
            // console.log(this.code)
            if(this.data.flag_pswd==1 && this.data.current==0){
                //注册界面的样子 不知道对不对
              console.log('we')
              let that=this
              wx.request({
                url:'http://124.222.22.227:8000/user/register/phoneCode/', 
                data: {
                    Phone: that.data.phoneNumber,
                    PassWord: that.data.password,
                    Code: that.data.code,
                    Resume: that.data.resume
                 },
                 method: 'post',
                 success: function (res) {
                    console.log("成功");
                    console.log(res);
                    wx.request({
                        url:'http://124.222.22.227:8000/user/login/password/', 
                        data: {
                            Phone: that.data.phoneNumber,
                            PassWord: that.data.password,
                         },
                         method: 'post',
                         fail:function(res){
                           console.log(res)
                         },
                         success: function (res) {
                            console.log("成功");
                            console.log(res);
                            that.setData({
                                token:res.data.token,
                                user_id:res.data.user_id,
                                UserName:res.data.UserName,
                                resume:res.data.resume
                            })
                            console.log(that.data.token)
                            try{
                                // 同步接口立即写入
                                wx.setStorageSync('token',that.data.token)
                                wx.setStorageSync('user_id',that.data.user_id)
                                wx.setStorageSync('UserName', that.data.UserName)
                                wx.setStorageSync('resume',that.data.resume )
                              }catch (e) {
                                console.log('写入value2发生错误')
                              }
                              let pages = getCurrentPages(); // 当前页面
                              let beforePage = pages[pages.length - 2]; // 上一页
                              setTimeout(() => {
                                wx.navigateBack({
                                  success:res => {
                                    beforePage.onLoad();//周期函数或者函数名
                                  }
                              })
                              },200)
                              
                        }
                    })  
                },
            })  
            }else if(this.data.current==1){   //登录界面访问后台
              
                let that=this
                // wx.setStorageSync('UserName','that.data.UserName')
                // wx.redirectTo({
                //   url: '/pages/mine/mine',
                // })
                wx.request({
                    url:'http://124.222.22.227:8000/user/login/password/', 
                    data: {
                        Phone: that.data.phoneNumber,
                        PassWord: that.data.password,
                     },
                     method: 'post',
                     fail:function(res){
                       console.log(res)
                     },
                     success: function (res) {
                        wx.showToast({
                          title: '登录成功',
                        })
                        console.log(res);
                        that.setData({
                            token:res.data.token,
                            user_id:res.data.user_id,
                            UserName:res.data.UserName,
                            resume: res.data.resume
                        })
                        console.log(that.data.token)
                        try{
                            // 同步接口立即写入
                            // console.log(that.phoneNumber)
                            // console.log(that.data.token)
                            wx.setStorageSync('token',that.data.token)
                            wx.setStorageSync('user_id',that.data.user_id)
                            wx.setStorageSync('UserName',that.data.UserName)
                            wx.setStorageSync('resume', that.data.resume)
                            console.log('写入value2成功')
                          }catch (e) {
                            console.log('写入value2发生错误')
                          }
                          let pages = getCurrentPages(); // 当前页面
                          let beforePage = pages[pages.length - 2]; // 上一页

                          wx.navigateBack({
                            success:res => {
                              beforePage.onLoad();//周期函数或者函数名
                            }
                        })
                    }
                })  
                
            }
           
        }
        
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
  