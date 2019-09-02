//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    quanlist: [],//商圈循环
    pageNum: 1,
    totalpage: null,
  },
  //去创建商圈
  toCreate() {
    wx.navigateTo({
      url: '../chooseCreatequan/chooseCreatequan'
    })
  },

  //事件处理函数
  onLoad: function () {
    this.obtainNews()
    this.pageRecommendList()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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

  },
  //跳转到推荐更多
  tomore(){
wx.navigateTo({
  url: '../morerecommend/morerecommend',
})
  },
  //路径跳转
  routerlink(e){
    console.log(e,56)
    var circleId = e.currentTarget.id
    var joinFlag = e.currentTarget.dataset.joinFlag
    if (joinFlag){
      wx.navigateTo({
        url: '../inQuan/inQuan?circleId=' + `${circleId}`
      })
    }else{
      wx.navigateTo({
        url: '../goingQuan/goingQuan?circleId=' + `${circleId}`
      }) 
    }


  },
  // 推荐商圈
  pageRecommendList(){
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/pageRecommendList',
      method: 'GET',
      data: {
        pageSize: 10,
        pageNum: 1,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`
      },
      success(res) {
        var arr = res.data.result.list
        that.setData({
          Recommendquanlist: res.data.result.list,
          Recommendtotalpage: res.data.result.pagination.totalPage
        })
        console.log(res, 67)
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  obtainNews: function () {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/pageList',
      method: 'GET',
      data: {
        pageSize: 10,
        pageNum: that.data.pageNum
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
          quanlist: (that.data.quanlist).concat(res.data.result.list),
          totalpage: res.data.result.pagination.totalPage
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
  },
  onReachBottom: function () {
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


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
