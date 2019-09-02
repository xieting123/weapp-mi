// pages/reviewQuanApplication/reviewQuanApplication.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "",
    circleName: "",
    name: "",
    reviewContent: "",
    reviewId: "",
    reviewStatus: "",
    createTime: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      avatar: options.avatar,
      circleName: options.circleName,
      name: options.name,
      reviewContent: options.reviewContent,
      reviewId: options.reviewId,
      reviewStatus: options.reviewStatus,
      createTime: options.createTime,
    })
  },
  //通过申请
  Pass() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleUserReview/updatePass',
      method: 'POST',
      data: {
        reviewId: that.data.reviewId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        that.setData({
          reviewStatus: res.data.result.reviewStatus
        })
      }
    })
  },
  updateNotPass() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleUserReview/updateNotPass',
      method: 'POST',
      data: {
        reviewId: that.data.reviewId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
      that.setData({
        reviewStatus: res.data.result.reviewStatus
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