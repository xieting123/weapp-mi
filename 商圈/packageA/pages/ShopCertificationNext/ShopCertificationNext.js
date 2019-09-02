// packageA/pages/ShopCertification/ShopCertification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: 'USA',
        value: '企业法人'
      },
      {
        name: 'CHN',
        value: '代办人'
      },
    ],
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
    storeId:'',
  },
  idCardNamefn(e) {
    console.log(e, 28)
    var value = e.detail.value
    this.setData({
      idCardName: value
    })
  },
  handleInput(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      idCardNum: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let value = e.detail.value;
    this.setData({
      seleted: "选中的value：" + value
    })
  },
  goback(){
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })

  },
  //删除正面照片
  delImgfn() {
    this.setData({
      idCardFrontPic: ''
    })
  },
  //删除反面照片
  delbackImgfn() {
    this.setData({
      idCardBackPic: ''
    })
  },
  //下一步
  linktoNext() {
    wx.navigateTo({
      url: '../ShopCertificationNext/ShopCertificationNext',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,76)
    this.setData({
      handlerType: options.handlerType,
      organizationName: options.organizationName,
      uniformCodeCertificate: options.uniformCodeCertificate,
      uniformCodeCertificateImg: options.uniformCodeCertificateImg,
      storeId: options.storeId
    })
  },

  chooseImage: function(type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        //缓存下 
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000,
          success: function(res) {
            console.log('成功加载动画');
          }
        })

        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
        //获取第一张图片地址 
        var filep = res.tempFilePaths[0]
        //向服务器端上传图片 
        // (店铺认证上传的图片使用这个接口)
        //上传单个图片, 返回图片url(必传token, 图片大小 不大于10M): http://192.168.101.10:4000/image/uploadToUrl?imgFile=
        wx.uploadFile({
          url: app.globalData.myhost + '/image/uploadToUrl',
          filePath: filep,
          name: 'imgFile',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data",
            token: `${JSON.parse(wx.getStorageSync('token'))}`,
          },
          success: function(res) {
            var datainfo = JSON.parse(res.data).result
            console.log(res, type, 81)
            if (type == 1) {
              that.setData({
                idCardFrontPic: datainfo
              })
            } else if (type == 2) {
              that.setData({
                idCardBackPic: datainfo
              })
            }

          },
          fail: function(err) {
            console.log(err)
          }
        });
      }
    })
  },
  //根据传入的值判断 是正面还是反面1 2
  chooseImage1() {
    this.chooseImage(1)
  },
  chooseImage2() {
    this.chooseImage(2)
  },
  //申请店铺认证(必传token,  storeId为店铺id , handlerType  0: 法人 1: 经办人): http://192.168.101.10:4000/goods/storeCert/create?storeId=&organizationName=&uniformCodeCertificate=&uniformCodeCertificateImg=&handlerType=&idCardName=&idCardNum=&idCardFrontPic=&idCardBackPic=
  storeCert() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/storeCert/create',
      method: 'POST',
      data: {
        storeId: that.data.storeId,
        organizationName: that.data.organizationName,
        uniformCodeCertificate: that.data.uniformCodeCertificate,
        uniformCodeCertificateImg: that.data.uniformCodeCertificateImg,
        handlerType: that.data.handlerType,
        idCardName: that.data.idCardName,
        idCardNum: that.data.idCardNum,
        idCardFrontPic: that.data.idCardFrontPic,
        idCardBackPic: that.data.idCardBackPic
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res, 152)
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