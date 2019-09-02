// pages/user/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: '',
    avatarUrl: '',
    iSidentify: false,
    hasuserinfo: true,
    availableAmount:'',//账户余额
    coinNum:'',//蜜币余额
    signFlag:'',//是否签到
    uniqueId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    var wxtoken = wx.getStorageSync("token")
    wx.getUserInfo({
      success: function(infores) {
        console.log(infores, 24)
        if (wxtoken) {
          that.setData({
            nickName: infores.userInfo.nickName,
            avatarUrl: infores.userInfo.avatarUrl,
            hasuserinfo: false
          })
        } else {
          that.setData({
            hasuserinfo: true
          })
        }
      }
    })
    that.capital()
    that.coinLog()
  },
  topersoncenter(){
    var uniqueId = wx.getStorageSync("uniqueId")
wx.navigateTo({
  url: '../../packageA/pages/personCenter/personCenter?uniqueId=' + `${uniqueId}`,
})
  },
  //签到(必传token): http://192.168.101.10:4000/user/coin/signUserCoin
  signUserCoinfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/coin/signUserCoin',
      method: 'GET',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res, 51)
        if (res.data.code == 200) {
          var signFlag = res.data.result.signFlag
          that.setData({
            signFlag: signFlag
          })
        }
      }
    })
  },
  //我的蜜币详情(必传token): http://192.168.101.10:4000/user/coin/getMyCoinInfo
  coinLog() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/coin/getMyCoinInfo',
      method: 'GET',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        that.setData({
          signFlag: res.data.result.signFlag
        })
      }
    })
  },
  //增加一个字段  coinNum   商蜜币余额
  //我的账户余额(必传token): http://192.168.101.10:4000/accounts/myself/capital
  capital() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/accounts/myself/capital',
      method: 'GET',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res, 70)
        var availableAmount= res.data.result.availableAmount.toFixed(2)
        var coinNum = res.data.result.coinNum.toFixed(2)
        that.setData({
          availableAmount: availableAmount,
          coinNum: coinNum
        })
      }
    })
  },
  bindGetUserInfo(e) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.setStorageSync('code', res.code)
          //发起网络请求
          wx.getUserInfo({
            success: function(infores) {
              var code2Session = app.globalData.myhost + '/mini/code2Session'
              wx.request({
                url: code2Session,
                data: {
                  code: res.code,
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',  
                },
                success(res) {
                  console.log(res, 60)
                  // 请求成功后获取openid 再将openid传至后台
                  var openid = res.data.result.openid;
                  wx.setStorageSync('openid', res.data.result.openid)
                  wx.setStorageSync('session_key', res.data.result.session_key)
                  var miniTripartiteLogin = app.globalData.myhost + '/user/accounts/miniTripartiteLogin'
                  wx.request({
                    url: miniTripartiteLogin,
                    data: {
                      nickname: infores.userInfo.nickName,
                      avatar: infores.userInfo.avatarUrl,
                      gender: infores.userInfo.gender == 1 ? '男' : '女',
                      type: 'wx',
                      openId: openid,
                    },
                    method: "POST",
                    header: {
                      // 'content-type': 'application/json'
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    success(userData) {
                      var token = JSON.stringify(userData.data.result.token)
                      var uniqueId = userData.data.result.uniqueId
                      wx.setStorageSync("token", token)
                      wx.setStorageSync("uniqueId", uniqueId)
                      var wxtoken = wx.getStorageSync("token")
                      if (wxtoken) {
                        that.setData({
                          nickName: infores.userInfo.nickName,
                          avatarUrl: infores.userInfo.avatarUrl,
                          hasuserinfo: false
                        })
                      } else {
                        that.setData({
                          hasuserinfo: true,
                        })

                      }
                    }

                  })
                },
                fail() {

                }
              })

            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: function(error) {
        console.log('用户拒绝了登录')
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})