// pages/Labelsettings/Labelsettings.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId: '',
    datainfo: [],
    circleId: "",
    avatar: "",
    company: "",
    name: "",
    nickname: "",
    position: "",
    uniqueId: "",
    verifyStatus: "",
    currentTab: null,
    tagId: '',
    tagFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      circleId: options.circleId,
      avatar: options.avatar,
      company: options.company,
      name: options.name,
      nickname: options.nickname,
      position: options.position,
      uniqueId: options.uniqueId,
      verifyStatus: options.verifyStatus,
    })
  },
  //设置标签
  settingLable(e) {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleTag/selectList',
      method: 'POST',
      data: {
        circleId: that.data.circleId,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res, 34)
        that.setData({
          datainfo: res.data.result
        })
      }
    })
  },
  sureBtn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/circleUserModifyTag',
      method: 'POST',
      data: {
        tagId: that.data.tagId,
        uniqueId: that.data.uniqueId,
        tagFlag: that.data.tagFlag
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res, 68)
        wx.showToast({
          title: '设置成功',
        })
      }
    })
  },
  //改变字体样式
  changeStyle(e) {
    var that = this;
    this.setData({
      currentTab: e.currentTarget.id,
      tagId: e.currentTarget.dataset.tagid,
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
    this.settingLable()
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