// pages/forget_pswd/forget_pswd.js
// pages/register/register.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      current:1,
      codeText:'获取验证码',
      counting:false,
      phoneNumber:'',
      username:'',
      code:'',
      token:''
         //判断两次输入的密码是否一致
    },
    // 登陆注册监听
    click(e){
      let index = e.currentTarget.dataset.code;
      this.setData({
        current:index
      })
    },
    //获取验证码 
    getCode(){
      var that = this;

      if (!that.data.counting) {
        wx.request({
            url: 'http://124.222.22.227:8000/user/register/phoneCode/?Phone='+this.phoneNumber, //接口地址
            data: {
                Phone: this.data.phoneNumber,// 参数：值
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
    
      

      codeInputAction:function(options) {
        //获取输入框输入的内容
        this.data.code = options.detail.value;
        //console.log("输入输入的内容是 " + this.value)
        
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
        }else{
          let that=this
            wx.request({
                url:'http://124.222.22.227:8000/user/login/phone/', 
                data: {
                    Phone: that.data.phoneNumber,
                    Code:that.data.code,
                },
                method: 'post',
                success: function (res) {
                    console.log("成功");
                    console.log(res);
                    that.setData({
                        token: res.data.token,
                        username:res.data.UserName
                    })
                    try{
                        // 同步接口立即写入
                        // console.log(that.phoneNumber)
                        // console.log(that.data.token)
                        wx.setStorageSync('token',that.data.token)
                        wx.setStorageSync('UserName',that.data.username)
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
  