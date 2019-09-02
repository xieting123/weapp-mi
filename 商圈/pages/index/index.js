//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    quanlist:[],//商圈循环
    pageNum:1,
    totalpage: null,
  },
  //去创建商圈
  toCreate(){
    wx.navigateTo({
      url: '../chooseCreatequan/chooseCreatequan'
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {

  },

  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.obtainNews()
  },
  obtainNews: function(){
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/myList',
      method: 'GET',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`
      },
      success(res) {
        that.setData({
          quanlist: res.data.result,
        })
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })

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
    this.obtainNews();
  },
  onReachBottom: function () {
  },


  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
