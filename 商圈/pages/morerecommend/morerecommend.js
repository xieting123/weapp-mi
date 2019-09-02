// pages/morerecommend/morerecommend.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum:1,
    quanlist:[],
    Recommendtotalpage:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageRecommendList()
  },
  // 推荐商圈
  pageRecommendList() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/pageRecommendList',
      method: 'GET',
      data: {
        pageSize: 10,
        pageNum: that.data.pageNum,
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
          Recommendtotalpage: res.data.result.pagination.totalPage
        })
        console.log(res, 67)
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
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
    wx.showNavigationBarLoading();    //在当前页面显示导航条加载动画
    this.onLoad();    //刷新页面
    setTimeout(function () {
      wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh();    //停止下拉动作
    }, 2000)
  },
  onReachBottom: function () {
    var p = this.data.pageNum;
    var totalpage = this.data.Recommendtotalpage + 1;
    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.pageRecommendList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})