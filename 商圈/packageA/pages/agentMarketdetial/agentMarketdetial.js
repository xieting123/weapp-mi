// packageA/pages/agentMarketdetial/agentMarketdetial.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    goodsData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 15)
    this.setData({
      id: options.id
    })
    this.goodDetail()
  },
  //获取指定商品详情(): http://192.168.101.10:4000/goods/product/getById?id=
  goodDetail() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/getById',
      data: {
        id: that.data.id,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "GET",
      success(res) {
        console.log(res, 24)
        var data = res.data.result
        that.setData({
          goodsData: data,
        })
      }
    })
  },
  toAgentlist(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var storeId = e.currentTarget.dataset.storeid
    var avatarinfo = e.currentTarget.dataset.avatarinfo
    var storename = e.currentTarget.dataset.storename
    var productcount = e.currentTarget.dataset.productcount
    var agentstorecount = e.currentTarget.dataset.agentstorecount
    wx.navigateTo({
      url: '../agentMarketdetialList/agentMarketdetialList?id=' + `${id}` + '&storeId=' + `${storeId}` + '&avatarinfo=' + `${avatarinfo}` + '&storename=' + `${storename}` + '&productcount=' + `${productcount}` + '&agentstorecount=' + `${agentstorecount}`,
    })
  },
  //添加商品到购物车(必传token, productId  商品id, quantity  大于0 小于100  商品数量): http://192.168.101.10:4000/goods/cart/add?productId=&quantity=
  addshop() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/cart/add',
      data: {
        productId: that.data.id,
        quantity: 1,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        if (res.data.code === 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },

  topay() {
    wx.navigateTo({
      url: '../ShoppingCartDirectPay/ShoppingCartDirectPay?productId=' + `${this.data.id}`,
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