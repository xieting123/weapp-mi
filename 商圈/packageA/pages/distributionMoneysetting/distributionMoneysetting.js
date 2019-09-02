// packageA/pages/distributionMoneysetting/distributionMoneysetting.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData: '',
    id: '',
    distributionMoney:'',//设置佣金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.goodDetail()
  },
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
          storeId: data.storeId
        })
      }
    })
  },
  //请输入金额
  handleInputOne(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      distributionMoney: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //如果设置分销佣金  传distributionMoney > 0   取消分销佣金  传distributionMoney = 0
  //修改分销佣金(必传token 和 id, ): http://192.168.101.10:4000/goods/product/updateDistributionMoneyById?id=&distributionMoney=
  distributionMoneyfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/updateDistributionMoneyById',
      data: {
        id: that.data.id,
        distributionMoney: that.data.distributionMoney
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        console.log(res, 24)
        // var data = res.data.result
        that.setData({
          // goodsData: data,
          // storeId: data.storeId
        })
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