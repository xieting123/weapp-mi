
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId:'',//商品id
    product:{},
    totalMoney: '',
    quantity: '',
    proviceInfo:'',//地址信息
  },

  //获取默认收货地址(必传token): http://192.168.101.10:4000/goods/consignee/getDefault
  getDefaultaddress() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/consignee/getDefault',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        that.setData({
          proviceInfo: res.data.result
        })
      }
    })
  },

  //获取直接购买指定商品详情(必传token): http://192.168.101.10:4000/goods/productOrder/getOneCartItemInfo?productId=&quantity=
  getOneCartItemInfo() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/productOrder/getOneCartItemInfo',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        productId:that.data.productId,
        quantity:1
      },
      method: "POST",
      success(res) {
        that.setData({
          product: res.data.result.product,
          totalMoney: res.data.result.totalMoney,
          quantity: res.data.result.quantity,
        })
      }
    })
  },
  //提交订单
  payfn() {
    wx.navigateTo({
      url: '../orderDetails/orderDetails?productId=' + `${this.data.productId}`,
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDefaultaddress()
    this.setData({
      productId: options.productId
    })
    this.getOneCartItemInfo()
  },
  //新建地址
  toaddress() {
    wx.navigateTo({
      url: '../shipAddress/shipAddress',
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