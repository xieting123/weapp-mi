// pages/PublishingDynamicslink/PublishingDynamicslink.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    circleId: ''
  },
  urlfn(e) {
    this.setData({
      url: e.detail.value
    })
  },
  linkcancle() {
    this.setData({
      url: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 56)
    this.setData({
      circleId: options.circleId
    })
  },

  linkcontent() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/url/parsingInfo',
      method: 'GET',
      data: {
        url: that.data.url
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        if (res.data.code !== 200) {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        } else {
          var datainfo = JSON.stringify(res.data.result)
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面

          //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            linkurltitle: res.data.result.title, //上传链接地址解析title内容
            linkimageUrl: res.data.result.imageUrl, //解析图片
            linksrc: res.data.result.url, //链接地址
            weblink: datainfo
          });
          wx.navigateBack({
            delta: 1
          })
        }

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