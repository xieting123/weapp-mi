// packageA/pages/ShopCertification/ShopCertification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: '',
    circleId:'',
    storeIntroduction: '',
    avatarInfo: {},
    name: '',
    mobile: '',
    consignmentIntroduction: '',
  },
  //店铺名称
  handleInput(e) {
    let value = e.detail.value
    this.setData({
      name: value
    })
  },
  //手机号
  handleInput2(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      mobile: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  handleInput3(e) {
    let value = e.detail.value
    this.setData({
      storeIntroduction: value
    })
  },
  handleInput5(e) {
    let value = e.detail.value
    this.setData({
      consignmentIntroduction: value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let value = e.detail.value;
    this.setData({
      seleted: "选中的value：" + value
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
    this.setData({
      circleId: options.circleId
    })
    this.storeInfo()
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
        console.log(res, 33)
        var shopInfo= res.data.result
        that.setData({
          storeId: shopInfo.id,
          storeIntroduction: shopInfo.storeIntroduction,
          avatarInfo: shopInfo.avatarInfo,
          name: shopInfo.name,
          mobile: shopInfo.mobile,
          consignmentIntroduction: shopInfo.consignmentIntroduction,
        })
      }
    })
  },
  //修改商铺头像
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        //缓存下 
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000,
          success: function (res) {
            console.log('成功加载动画');
          }
        })
        that.setData({
          imageList: res.tempFilePaths
        })
        //获取第一张图片地址 
        var filep = res.tempFilePaths[0]
        //向服务器端上传图片 
        // (店铺认证上传的图片使用这个接口)
        //上传单个图片, 返回图片url(必传token, 图片大小 不大于10M): http://192.168.101.10:4000/image/uploadToUrl?imgFile=
        wx.uploadFile({
          url: app.globalData.myhost + '/images/upload',
          filePath: filep,
          name: 'imgFiles',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data",
            token: `${JSON.parse(wx.getStorageSync('token'))}`,
          },
          success: function (res) {
            var datainfo = JSON.parse(res.data).result         
              that.setData({
                avatarInfo: datainfo[0]
              })
              console.log(res,135)
          },
          fail: function (err) {
            console.log(err)
          }
        });
      }
    })
  },
    //修改店铺设置(必传token, id  为店铺id): http://192.168.101.10:4000/goods/store/updateById?id=&name=&avatar=&mobile=&storeIntroduction&consignmentIntroduction=
  editorStore() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/store/updateById',
      method: 'POST',
      data: {
        id: that.data.storeId,
        name: that.data.name,
        avatar: JSON.stringify(that.data.avatarInfo),
        mobile: that.data.mobile,
        storeIntroduction: that.data.storeIntroduction,
        consignmentIntroduction: that.data.consignmentIntroduction,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        if(res.data.code===200){
          //返回上一级关闭当前页面
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
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