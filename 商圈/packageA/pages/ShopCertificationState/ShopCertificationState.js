// packageA/pages/ShopCertification/ShopCertification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    seleted: '',
    imageList: [],
    resultUrl: '',
    handlerType: "",
    organizationName: "",
    uniformCodeCertificate: "",
    uniformCodeCertificateImg: "",
    idCardName: '', //姓名
    idCardNum: '',
    idCardFrontPic: '',
    idCardBackPic: '',
    storeId: '',
    status:'',
  },


//获取当前店铺认证详情(必传token): http://192.168.101.10:4000/goods/storeCert/getByStoreId?storeId=
  getByStorefn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/storeCert/getByStoreId',
      method: 'POST',
      data: {
        storeId: that.data.storeId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var data=res.data.result;
        that.setData({
          handlerType: data.handlerType,
          idCardBackPic: data.idCardBackPic,
          idCardFrontPic: data.idCardFrontPic,
          idCardName: data.idCardName,
          idCardNum: data.idCardNum,
          organizationName: data.organizationName,
          uniformCodeCertificate: data.uniformCodeCertificate,
          uniformCodeCertificateImg: data.uniformCodeCertificateImg
        })
        console.log(res, 152)
      }
    })
  },
  goback() {
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,66)
this.setData({
  status: options.status,
  storeId: options.storeId
})
    this.getByStorefn()
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