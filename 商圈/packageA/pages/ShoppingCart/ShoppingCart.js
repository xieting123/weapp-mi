// packageA/pages/ShoppingCart/ShoppingCart.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowConsignmentFlag: false,
    shoplist: [],
    chooseFlag: '',
    chooseAllFlag: '', //是否全选
    totalMoney: '', //金额合计
    deleteBtn: true,
    disabled:true,//下架商品禁止选中
  },
  showdeleteBtn(){
this.setData({
  deleteBtn: !this.data.deleteBtn
})
  },
  //店铺的全选按钮 控制
  //全选或全不选指定店铺(必传token, chooseAllFlag  true: 全选  false: 全不选): http://192.168.101.10:4000/goods/cart/setChooseByStore?storeId=&chooseAllFlag=
  radioChange(e) {
    var that = this;
    var id = e.currentTarget.dataset.storeid
    var chooseAllFlag = e.currentTarget.dataset.chooseallflag
    wx.request({
      url: app.globalData.myhost + '/goods/cart/setChooseByStore',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        storeId: id,
        chooseAllFlag: !chooseAllFlag
      },
      method: "POST",
      success(res) {
        that.shoplist()
        that.getTotalMoneyfn()
      }
    })
    that.shoplist()
  },
  //底部全选按钮
  radioChange2() {
    var chooseAllFlag = this.data.chooseAllFlag
    var that = this;
    //全选全不选(必传token): http://192.168.101.10:4000/goods/cart/chooseAll?chooseAllFlag=
    wx.request({
      url: app.globalData.myhost + '/goods/cart/chooseAll',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        chooseAllFlag: !chooseAllFlag
      },
      method: "POST",
      success(res) {
        console.log(res, 76)
        that.shoplist()
        that.getTotalMoneyfn()
      }
    })


  },
  //选中或取消购物车项(必传token, 购物车项id, chooseFlag: 是否选中): http://192.168.101.10:4000/goods/cart/setChoose?id=&chooseFlag=
  //单个商品的选中或选不中
  chooseFlagfn(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var chooseFlag = e.currentTarget.dataset.chooseflag
    wx.request({
      url: app.globalData.myhost + '/goods/cart/setChoose',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id,
        chooseFlag: !chooseFlag
      },
      method: "POST",
      success(res) {
        that.shoplist()
        that.getTotalMoneyfn()
      }
    })
  },
  //获取购物车中选中商品的金额(必传token): http://192.168.101.10:4000/goods/cart/getTotalMoney
  //全选按钮控制
  getTotalMoneyfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/cart/getTotalMoney',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        that.setData({
          totalMoney: res.data.result.totalMoney,
          chooseAllFlag: res.data.result.chooseAllFlag
        })
      }
    })
  },
  //删除指定购物车项(必传token): http://192.168.101.10:4000/goods/cart/deleteCartItemById?id=
  deleteBtnfn(){
    var that = this;
    var id = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.myhost + '/goods/cart/deleteCartItemById',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id,
      },
      method: "POST",
      success(res) {
        that.shoplist()
      }
    })
  },
  //修改订单项商品数量(必传token): http://192.168.101.10:4000/goods/cart/updateCartItemById?id=&quantity=
  updateCartItemById(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var quantity = e.currentTarget.dataset.quantity
    wx.request({
      url: app.globalData.myhost + '/goods/cart/updateCartItemById',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: id,
        quantity: quantity
      },
      method: "POST",
      success(res) {
        that.shoplist()
      }
    })
  },
  //删除所有选中购物车项(必传token): http://192.168.101.10:4000/goods/cart/delete
  deleteBtnfn2() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/cart/delete',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        that.shoplist()
      }
    })
  },
  //清空购物车(必传token): http://192.168.101.10:4000/goods/cart/clearCart
  deleteBtnfn3() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/cart/clearCart',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        that.shoplist()
      }
    })
  },

//购物车列表
  shoplist() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/cart/myCart',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        console.log(res, 30)
        if (res.data.code === 200) {
          that.setData({
            shoplist: res.data.result
          })
        }
      }
    })
  },
  //返回上一页面
  goback() {
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })
  },
  // 去结算页面
  toshoppingCartPay(){
    wx.navigateTo({
      url: '../ShoppingCartPay/ShoppingCartPay',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.shoplist()
    this.getTotalMoneyfn()
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