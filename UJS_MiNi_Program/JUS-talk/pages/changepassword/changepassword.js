// pages/changepassword/changepassword.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
      current:1,
      codeText:'获取验证码',
      counting:false,
      phoneNumber:'',
      oldpassword:'',
      password:'',
      cf_password:'',
      token:'',
      passwd:0,
      flag_pswd:0
         //判断两次输入的密码是否一致
    },
    // 登陆注册监听
    click(e){
      let index = e.currentTarget.dataset.code;
      this.setData({
        current:index
      })
    },
    // //获取验证码 
    // getCode(){
    //   var that = this;

    //   if (!that.data.counting) {
    //     wx.request({
    //         url: 'http://192.168.1.104:8000/user/register/phoneCode/?Phone='+this.phoneNumber, //接口地址
    //         data: {
    //             Phone: this.phoneNumber,// 参数：值
    //         },
    //         success(res) {
    //                 // 返回值
    //                 console.log(res.data)
    //         }
    //     })
    //     wx.showToast({
    //       title: '验证码已发送',
    //     })
    //     //开始倒计时60秒
    //     that.countDown(that, 60);
    //   } 
    // },
    // //倒计时60秒
    // countDown(that,count){
    //   if (count == 0) {
    //     that.setData({
    //       codeText: '获取验证码',
    //       counting:false
    //     })
    //     return;
    //   }
    //   that.setData({
    //     counting:true,
    //     codeText: count + '秒后重新获取',
    //   })
    //   setTimeout(function(){
    //     count--;
    //     that.countDown(that, count);
    //   }, 1000);
    // },

    phoneNumberInputAction: function (options) {
        //获取输入框输入的内容
        // this.setData({
        //     phoneNumber:options.detail.value
        // })
        
        this.data.phoneNumber = options.detail.value;
        console.log(this.data.phoneNumber)
        //console.log("输入的内容是 " + this.phone)
        
      },
    
      

    //   codeInputAction:function(options) {
    //     //获取输入框输入的内容
    //     this.code = options.detail.value;
    //     //console.log("输入输入的内容是 " + this.value)
        
    //   },
    oldpasswordInputAction: function (options) {
        //获取输入框输入的内容
        // this.setData({
        //     oldpassword:options.detail.value
        // })
        this.data.oldpassword=options.detail.value
        //console.log("输入输入的内容是 " + this.password)
        
      },
      passwordInputAction: function (options) {
        //获取输入框输入的内容
        // this.setData({
        //     password:options.detail.value
        // })
       this.data.password=options.detail.value
       console.log(this.data.password)
        //console.log("输入输入的内容是 " + this.password)
        
      },
      confirm_passwordInputAction: function (options) {
        //获取输入框输入的内容
        // this.setData({
        //     cf_password:options.detail.value
        // })
        this.data.cf_password=options.detail.value
        console.log(this.data.cf_password)

        //console.log("输入输入的内容是 " + this.cf_password)
        
      },
      confirm_password:function(){
        //console.log('we')
        if(this.data.password==this.data.cf_password){
            // this.setData({
            //     flag_pswd:1   
            // })
            this.data.flag_pswd=1
            console.log(this.data.flag_pswd)
        }
      },
        /**
       * 输入手机号
       */
      logining: function (event) {
        // console.log('username', event.detail.value)
        this.confirm_password()
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
            console.log(this.data.flag_pswd)
            if(this.data.flag_pswd==1){
            console.log(1)
              wx.request({
                url:'http://124.222.22.227:8000/user/change/', 
                data: {
                    Phone: this.data.phoneNumber,
                    OldPassWord:this.data.oldpassword,
                    NewPassWord:this.data.password,
                },
                method: 'put',
                success: function (res) {
                    console.log("成功");
                    console.log(res);
                    this.setData({
                        token: res.data.token
                    })
                    // try{
                    //     // 同步接口立即写入
                    //     // console.log(that.phoneNumber)
                    console.log(that.data.token)
                    wx.setStorageSync('token',that.data.token)
                    //     console.log('写入value2成功')
                    //   }catch (e) {
                    //     console.log('写入value2发生错误')
                    //   }
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
  