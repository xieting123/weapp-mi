// pages/shipAddress/shipAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getAddressListLim: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getAddressListLim() {
    let then = this;
    wx.request({
      url: app.globalData.myhost + '/goods/consignee/getAddressListLim',
      data: {
        pageSize: '30'
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        then.setData({
          getAddressListLim: res.data.result.list
        })
      }
    })
  },
  radioChange(e){
    console.log(e.detail.value)
    let thet =this;
    wx.request({
      url: app.globalData.myhost + '/goods/consignee/setDefault',
      data: {
        addressId: e.detail.value
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  addAddressFn() {
    wx.navigateTo({
      url: '../address/address',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  modAddressFn(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../modAddress/modAddress?id=' + e.currentTarget.dataset.id,
    })
  },
  deltAddress(e) {
    console.log(e.currentTarget.dataset.id)
    console.log(app.globalData.token)
    let thet = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除此条地址吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#6f6f6f',
      confirmText: '確定',
      confirmColor: '#e70012',
      success: function (res) {
        console.log(res.confirm)
        if (res.confirm) {
          // delAddressUrl
          wx.request({
            url: app.globalData.myhost + '/goods/consignee/delAddress',
            data: {
              addressId: e.currentTarget.dataset.id
            },
            header: {
              token: `${JSON.parse(wx.getStorageSync('token'))}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) { 
              console.log(res)
              if(res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                })
                setTimeout(() => {
                  thet.getAddressListLim()
                }, 1500)
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getAddressListLim()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressListLim()
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