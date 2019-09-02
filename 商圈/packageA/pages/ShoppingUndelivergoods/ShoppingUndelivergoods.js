// packageA/pages/orderDetails/orderDetails.js
var app = getApp()
import { getDateStr } from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proviceInfo: {},
    orderInfo: {},
    orderList: [],
    sn: '',//如果有商品id则为直接支付
  },


  //查看指定订单详情(必传token, 如果从我的订单查看只需传 sn, 如果从店铺查看 必传 sn 和 storeId): http://192.168.101.10:4000/goods/productOrder/getById?sn=
  todeliverdetial() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/productOrder/getById',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data:{
        sn:that.data.sn
      },
      method: "POST",
      success(res) {
        console.log(res, res.data.result.list ,33)
        var data = res.data.result;
        data.createTime = getDateStr(data.createTime)
        data.expiredTime = getDateStr(data.expiredTime)
        that.setData({
          orderInfo:res.data.result          
        })
      }
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDefaultaddress()
    if (options.id) {
      this.setData({
        sn: options.id,
      })
    }
    this.todeliverdetial()
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