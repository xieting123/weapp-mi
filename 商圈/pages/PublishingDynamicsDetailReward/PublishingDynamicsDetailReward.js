// pages/PublishingDynamicsDetailReward/PublishingDynamicsDetailReward.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    nickname: '',
    trendsId: '',
    payOrderNo:'',//订单编号
    list: [{
        id: 0,
        title: "5元",
      },
      {
        id: 1,
        title: "8元",
      },
      {
        id: 2,
        title: "10元",
      },
      {
        id: 3,
        title: "20元",
      },
      {
        id: 4,
        title: "50元",
      },
      {
        id: 5,
        title: "100元",
      },
      {
        id: 6,
        title: "200元",
      },
      {
        id: 7,
        title: "其他金额",
      },
    ],
    activetag: 7,
    disabled: false,
    cost: '',
    costmoney:'',//需要支付的钱
  },
  //打赏动态小程序支付(必传token, othBiId 为动态id, amount为打赏金额): http://192.168.101.10:4000/accounts/Small/WeChatPay/prepay?amountSource=20&amount=1&othBiId=10
  paymoney() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/accounts/Small/WeChatPay/prepay',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        amountSource: 20,
        amount: that.data.costmoney,
        othBiId: that.data.trendsId,
        openid: wx.getStorageSync('openid')
      },
      success(res) {
        console.log(res,64)
        that.setData({
          payOrderNo: res.data.result.payOrderNo
        })
        that.wxPay(res.data.result)
      }

    })
  },
  //打赏文章小程序支付(必传token, othBiId 为文章id, amount为打赏金额): http://192.168.101.10:4000/accounts/Small/WeChatPay/prepay?amountSource=21&amount=1&othBiId=10
  paymoney2() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/accounts/Small/WeChatPay/prepay',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        amountSource: 21,
        amount: that.data.costmoney,
        othBiId: that.data.trendsId,
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
  //自定义金额
  valuefn(e){
    this.setData({
      costmoney: e.detail.value
    })
console.log(this.data.cost,144)
  },
  //选择金额
  clickedBtn(e) {
    console.log(e,143)
    var index = e.currentTarget.dataset.id;
    var id = e.currentTarget.id;
    var cost = parseInt(e.currentTarget.dataset.title)
    console.log(cost,147)
    this.setData({
      activetag: id,
      costmoney:cost
    })
    if (this.data.activetag == 7) {
      this.setData({
        disabled: false,
        costmoney:this.data.cost
      })
    } else {
      this.setData({
        disabled: true,
        cost: ''
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 94)
    this.setData({
      avatar: options.avatar,
      nickname: options.nickname,
      trendsId: options.trendsId
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