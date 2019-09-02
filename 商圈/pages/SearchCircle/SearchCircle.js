// pages/SearchCircle/SearchCircle.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    show: "none",
    quanlist: [],
    totalpage: null,
    pageNum: 1
  },

  inputTyping(e) {
    console.log(e, 12)
    this.setData({
      content: e.detail.value
    })
    var that = this;
    if (this.data.content) {
      this.setData({
        show: "block"
      })
      this.obtainNews()
    } else {
      this.setData({
        show: "none",
        quanlist: [],
        pageNum: 1
      })
    }
  },
  //input监听事件
  obtainNews() {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: app.globalData.myhost + '/businessCircle/pageList',
      method: 'GET',
      data: {
        pageSize: 10,
        pageNum: that.data.pageNum,
        keyword: that.data.content
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`
      },
      success(res) {
        var arr = res.data.result.list
        if (arr.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (arr.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        that.setData({
          quanlist: that.data.quanlist.concat(res.data.result.list),
          totalpage: res.data.result.pagination.totalPage
        })
        console.log(res, 67)
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  //返回
  routerlink() {
    wx.switchTab({
      url: '../find/find',
    })
  },
  cancleContent() {
    this.setData({
      content: '',
      quanlist: [],
      pageNum: 1
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
    this.onLoad(); //刷新页面
    setTimeout(function() {
      wx.hideNavigationBarLoading(); //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh(); //停止下拉动作
    }, 2000)
  },
  onReachBottom: function() {
    var p = this.data.pageNum;
    var totalpage = this.data.totalpage + 1;
    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.obtainNews();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})