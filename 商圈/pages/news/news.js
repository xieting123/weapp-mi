// pages/news/news.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewmember: '',
    viewhelp: '',
    circleReviewCount: '',
    datainfo:''
  },
  //通知助手
  viewHelp() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/noticeHelper/getAllCount',
      method: 'GET',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res, 20)
        var datainfo = res.data.result
        that.setData({
          viewhelp: res.data.result.noticeHelperCount,
          circleReviewCount: res.data.result.circleReviewCount,
          datainfo: res.data.result
          // circleReviewCount: 0
          // noticeHelperCount: 0
          // toMyCommentQueryCount: 11
          // toMyLeaveMessageCount: 8
          // toMyReplyQueryCount: 11
          // toMyRewardQueryCount: 0
          // toMyUserLikeLogCount: 0
          // toMyZanQueryCount: 4
          // totalCount: 34
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.viewmember()
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
    this.viewHelp()
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