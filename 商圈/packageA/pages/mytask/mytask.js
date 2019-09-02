// packageA/pages/mytask/mytask.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signFlag: '',
    coinNumData: {}
  },
  //返回上一页面去完成
  goback() {
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.coinLog()
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
        console.log(res, 48)
        that.setData({
          coinNumData: res.data.result,
          signFlag: res.data.result.signFlag
        })
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