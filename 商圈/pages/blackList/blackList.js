// pages/blackList/blackList.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId:'',
    meberdataInfo:'',
    uniqueId: '', //人员id
    adminflag: '', //是否设置成为管理员
    blackFlag: '',
    pageNum:1,
    totalPage:null,
    
  },
  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../packageA/pages/personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      circleId: options.circleId
    })
  },
 
  //黑名单列表
  blacklist() {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: app.globalData.myhost + '/businessCircle/circleUserBlackList',
      methods: 'GET',
      data: {
        pageSize: 10,
        pageNum: that.data.pageNum,
        circleId: that.data.circleId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
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
          meberdataInfo: res.data.result.list,
          totalPage: res.data.result.pagination.totalPage
        })
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  //黑名单菜单
  openActionsheet(e){
    this.setData({
      uniqueId: e.currentTarget.id,
      adminflag: e.currentTarget.dataset.item.adminFlag,
      blackFlag: e.currentTarget.dataset.item.blackFlag,
    })
    var that = this;
    wx.showActionSheet({
      itemList: ['移除成员','移除黑名单'],
      itemColor: '#4D4D4D',
      success(res){
        console.log(res.tapIndex);
        if (res.tapIndex===0){
          wx.showModal({
            title: '提示',
            content: '确定要移除该成员吗？',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.request({
                  url: app.globalData.myhost + '/businessCircle/removeCircleUser',
                  method: "POST",
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: `${JSON.parse(wx.getStorageSync('token'))}`,
                  },
                  data: {
                    circleId: that.data.circleId,
                    uniqueId: that.data.uniqueId,
                  },
                  success(res) {
                    console.log(res, 23)
                    wx.showToast({
                      title: '移除成功',
                    })

                  },
                  fail() {

                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.request({
            url: app.globalData.myhost + '/businessCircle/changeCircleBlackList',
            method: "POST",
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              token: `${JSON.parse(wx.getStorageSync('token'))}`,
            },
            data: {
              circleId: that.data.circleId,
              uniqueId: that.data.uniqueId,
              blackFlag: false
            },
            success(res) {
              that.blacklist()
            },
            fail() {

            }
          })
        }
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
    this.blacklist()
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
    var totalpage = this.data.totalpage + 1;
    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.blacklist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})