const {
  appid,
  APIURL,
} = require('config.js');
let app = getApp();
var AES = '';
class Api {
  constructor() {}
  wxlogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res.code)
        }
      })
    })
  }
  wxGetUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: function(res) {
          resolve(res)
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  }
  authorizationCheck() {
    return new Promise((resolve, reject) => {
      var userJson = {};
      this.wxlogin().then(res => {
        userJson.code = res;
        return this.wxGetUserInfo()
      }).then(res => {
        userJson.iv = res.iv;
        userJson.encryptedData = res.encryptedData;
        this.loginToApp(userJson).then(res => {

          resolve(res);

        })
      })
    })
  }
  loginToApp(userJson) {
    if (!userJson.code) {
      throw new Error('loginToApp 缺少参数:code');
    }
    if (!userJson.iv) {
      throw new Error('loginToApp 缺少参数:iv');
    }
    if (!userJson.encryptedData) {
      throw new Error('loginToApp 缺少参数:encryptedData');
    }
    var sessionKey = wx.getStorageSync('SESSION_KEY');
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'POST',
        url: `${APIURL}/common/wechat/app/decrypt`,
        header: {
          'content-type': 'application/json'
        },
        data: {
          appId:`${appid}`,
          code: userJson.code,
          iv: userJson.iv,
          sessionKey:sessionKey,
          encryptedData: userJson.encryptedData
        },
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  }
  getRequestData(url,params,isNeedPullFresh,methond) {
    console.log("params =====", JSON.stringify(params));
    if (!url) {
      throw new Error('缺请求地址参数:url');
    }
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
      if (!methond){
        methond = "POST";
      }
      var token = wx.getStorageSync("token");
      params.appId = `${appid}`;
      wx.request({
        url: `${APIURL}/`+url,
        method: methond,
        header: {
          'content-type': 'application/json',
          'autoken': token
        },
        data: params,
        success: (res) => {
          wx.hideLoading();
          if (isNeedPullFresh) {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
          }
          resolve(res);
        },
        fail: function (err) {
          wx.hideLoading();
          if (isNeedPullFresh) {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
          }
          wx.showToast({
            title: "请求失败",
            icon: 'none',
            duration: 1500
          });
          reject(err);
        }
      })
    })
  }
  getRequestDataNoLoading(url, params, isNeedPullFresh,methodName) {
    if (!url) {
      throw new Error('缺请求地址参数:url');
    }
    return new Promise((resolve, reject) => {
      var token = wx.getStorageSync("token");
      if (!methodName && methodName.length == 0){
        methodName = "POST";
      }
      params.appId = `${appid}`
      wx.request({
        url: `${APIURL}/` + url,
        method: methodName,
        header: {
          'content-type': 'application/json',
          'autoken': token
        },
        data: params,
        success: (res) => {
          if (isNeedPullFresh) {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
          }
          if (res.data.errorCode == 0){
            resolve(res.data.model);
          } else {
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none',
              duration: 1500
            });
          }
        },
        fail: function (err) {
          if (isNeedPullFresh) {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
          }
          reject(err);
        }
      })
    })
  }
  getRequestDataNormal(url, params) {
    if (!url) {
      throw new Error('缺请求地址参数:url');
    }
    return new Promise((resolve, reject) => {
      var token = wx.getStorageSync("token");
      wx.request({
        url: `${APIURL}/` + url,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'autoken': token

        },
        data: params,
        success: (res) => {
          var strings = res.data.res;
          var jsonString = AES.Decrypt(res.data.res + '');
          var dic = JSON.parse(jsonString);
          var dataDic = {};
          dataDic.data = dic;
          if (dataDic.data.flag) {
            resolve(dataDic);
          } else {
            if (dataDic.data.code == '000009') {
              this.authorizationCheck().then(res => {
                this.getRequestDataNormal(url, params).then(res => {
                  resolve(res);
                });
              })
            } else {
              // wx.showToast({
              //   title: dataDic.data.msg,
              //   icon: 'none',
              //   duration: 1500
              // });
            }

          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  }
  getToken() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${APIURL}/` + url,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: params,
        success: (res) => {
          var strings = res.data.res;
          var jsonString = AES.Decrypt(res.data.res + '');
          var dic = JSON.parse(jsonString);
          var dataDic = {};
          dataDic.data = dic;
          resolve(dataDic);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  }
  getRequestDataNotSafe(url, params, isNeedPullFresh) {
    console.log("params =====", JSON.stringify(params));
    if (!url) {
      throw new Error('缺请求地址参数:url');
    }
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var token = wx.getStorageSync("token");
      wx.request({
        url: `${APIURL}/` + url,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'autoken': token

        },
        data: params,
        success: (res) => {
          wx.hideLoading();
          if (isNeedPullFresh) {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
          }
          // var strings = res.data.res;

          // var jsonString = AES.Decrypt(res.data.res + '');
          // var dic = JSON.parse(jsonString);
          var dataDic = {};
          dataDic.data = res.data;
          if (dataDic.data.flag) {
            resolve(dataDic);
          } else {
            if (dataDic.data.code == '000009') {
              this.authorizationCheck().then(res => {
                this.getRequestDataNotSafe(url, params, isNeedPullFresh).then(res => {
                  resolve(res);
                });
              })
            } else {
              wx.showToast({
                title: dataDic.data.msg,
                icon: 'none',
                duration: 1500
              });
            }

          }
        },
        fail: function (err) {
          wx.hideLoading();
          if (isNeedPullFresh) {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
          }
          wx.showToast({
            title: "请求失败",
            icon: 'none',
            duration: 1500
          });
          reject(err);
        }
      })
    })
  }
  
}
module.exports = Api