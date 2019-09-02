// pages/viewQuan/viewQuan.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId:"",
    dataInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      circleId: options.circleId
        
    })


  },
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
        that.setData({
          dataInfo: res.data.result
        })
        console.log(res.data)
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.quanview()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})