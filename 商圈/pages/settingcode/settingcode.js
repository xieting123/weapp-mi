// pages/settingcode/settingcode.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId: '',
    inviteCode: '',
    inviteCodeFlag: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      circleId: options.circleId
    })
    this.quanview()
  },
  //数据渲染
  quanview() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/getById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        circleId: that.data.circleId
      },
      success(res) {
        var datainfo = res.data.result;
        console.log(res.data)
        that.setData({
          inviteCode: datainfo.inviteCode,
        })

      }

    })
  },
  // 设置邀请码
  settingcode() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/updateById',
      method: 'POST',
      data: {
        inviteCodeFlag: true,
        circleId: that.data.circleId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        //  wx.showToast({
        //    title: '设置成功',
        //  })
        that.setData({
          inviteCode: res.data.result.inviteCode
        })
      }
    })
  },

  // 复制按钮
  onClick: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.inviteCode,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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