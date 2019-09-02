// packageA/pages/shopManagement/shopManagement.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatus: false,
    circleId: '',
    storeId: '', //店铺id
    enabledFlag:'',//店铺启用禁用
  },
  showtankuang() {
    this.setData({
      showStatus: true
    })
  },
  toShopSetting() {
    wx.navigateTo({
      url: '../shopSetting/shopSetting?circleId=' + `${this.data.circleId}`,
    })
  },
  //订单状态管理
  toorderStatus(){
wx.navigateTo({
  url: '../mystoreOrderstatusList/mystoreOrderstatusList?storeId=' + `${this.data.storeId}`
})
  },
  toShopCertification() {
    /**  认证状态  0: 未认证  1: 待认证   2: 认证通过   3: 认证失败 */
    //private Integer status;
    var status = this.data.status
    if (status == 0) {
      wx.navigateTo({
        url: '../ShopCertification/ShopCertification?storeId=' + `${this.data.storeId}` + '&status=' + `${status}`,
      })
    } else {
      wx.navigateTo({
        url: '../ShopCertificationState/ShopCertificationState?storeId=' + `${this.data.storeId}` + '&status=' + `${status}`,
      })
    }

  },
  shopCertificationgoods() {
    wx.navigateTo({
      url: '../ShopCertificationgoods/ShopCertificationgoods?storeId=' + `${this.data.storeId}`,
    })
  },
  // 根据商圈id获取店铺详情(有token, 传token): http://192.168.101.10:4000/goods/store/getByCircleId?circleId=
  storeInfo() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/store/getByCircleId',
      method: 'GET',
      data: {
        circleId: that.data.circleId
      },
      success(res) {
        console.log(res, 38)
        var data = res.data.result
        that.setData({
          storeId: res.data.result.id,
          status: res.data.result.status,
          enabledFlag: res.data.result.enabledFlag
        })
      }
    })
  },
  //启用/禁用 店铺(必传token, id 为店铺id ): http:/ / 192.168.101.10: 4000/goods/store/ changeEnabled ? id =
  controlfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/store/changeEnabled',
      method: 'POST',
      data: {
        id: that.data.storeId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.setData({
          enabledFlag: !that.data.enabledFlag
        })
      }
    })
  },
  handleBtn() {
    wx.navigateTo({
      url: '../agentMarket/agentMarket?storeId=' + `${this.data.storeId}`,
    })
  },
  handleBtn2() {
    wx.navigateTo({
      url: '../selfGood/selfGood?storeId=' + `${this.data.storeId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 31)
    this.setData({
      circleId: options.circleId
    })
    this.storeInfo()
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