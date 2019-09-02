// packageA/pages/orderDetails/orderDetails.js
var app = getApp()
import {getDateStr} from'../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proviceInfo: {},
    orderInfo: {},
    orderList:[],
    allMoney:'',//合计
    productId:'',//如果有商品id则为直接支付
    expiredTime: '',//截止时间
  },
  //通过购物车生成订单(必传token): http://192.168.101.10:4000/goods/productOrder/createCartOrder?consigneeId=
  payfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/productOrder/createCartOrder',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        consigneeId: that.data.proviceInfo.id,
      },
      method: "POST",
      success(res) {
        that.setData({
          orderInfo: res.data.result,
          orderList: res.data.result.orderList,
          allMoney: res.data.result.allMoney,
          expiredTime: getDateStr(res.data.result.expiredTime)
        })
      }
    })
  },
  //直接购买指定商品下单(必传token, consigneeId 为地址id): http://192.168.101.10:4000/goods/productOrder/createOrder?productId=&quantity=&consigneeId=
  easyPayOrderfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/productOrder/createOrder',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        productId: that.data.productId,
        quantity: 1,
        consigneeId: that.data.proviceInfo.id,
      },
      method: "POST",
      success(res) {
        that.setData({
          orderInfo: res.data.result,
          orderList: res.data.result.orderList,
          allMoney: res.data.result.allMoney,
          expiredTime: getDateStr(res.data.result.expiredTime)
        })
      }
    })
  },

  //商品订单小程序支付(必传token, othBiId 为文章id, amount为打赏金额): http://192.168.101.10:4000/accounts/Small/WeChatPay/prepay?amountSource=22&elStId=
  payOrderfn() {
    var that = this;
    var orderList = that.data.orderList;
    var elStIds=[];
    orderList.forEach((value,index)=>{
      elStIds.push(value.sn)
      console.log(elStIds, 25)
    })
    wx.request({
      url: app.globalData.myhost + '/accounts/Small/WeChatPay/prepay',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        amountSource: 22,
        amount: that.data.allMoney,
        elStId: elStIds.join(','),
        openid: wx.getStorageSync('openid')
      },
      success(res) {
        console.log(res, 64)
        that.setData({
          payOrderNo: res.data.result.payOrderNo
        })
        that.wxPay(res.data.result)
      }

    })
  },
  wxPay(data) {
    var that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success(res) {
        console.log(res, 112)
        wx.request({
          url: app.globalData.myhost + '/accounts/Small/WeChatPay/notify',
          method: 'POST',
          data: {
            payOrderNo: that.data.payOrderNo,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: `${JSON.parse(wx.getStorageSync('token'))}`,
          },
          success(res) {
            wx.showToast({
              title: '支付成功',
            })
            //返回上一级关闭当前页面
            wx.navigateBack({
              delta: 1
            })

          },
          fail() {

          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //商品订单小程序支付回调(必传token): http://39.96.161.80:4000/accounts/Small/WeChatPay/notify?payOrderNo=


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDefaultaddress()
    console.log(options,146)
    if (options.productId){
      this.setData({
        productId: options.productId,
      })
    }
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
        if(that.data.productId){
          that.easyPayOrderfn()
        }else{
          that.payfn()
        }
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