// packageA/pages/ShopCertification/ShopCertification.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      type: '0',
      value: '企业法人'
    },
    {
      type: '1',
      value: '代办人'
    },
    ],
    storeId:'',
    uniformCodeCertificateImg:'',
    imageList:[],
    organizationName:'',
    uniformCodeCertificate:'',
    handlerType:'',
  },
  /**  机构名称  */
  // private String organizationName;
  // /**  统一代码证  */
  // private String uniformCodeCertificate;
  // /**  统一代码证图片 */
  // private String uniformCodeCertificateImg;
  // /**  0: 法人   1: 经办人  */
  // private Integer handlerType;
  // /**  姓名 */
  // private String idCardName;
  // /**  身份证号码 */
  // private String idCardNum;
  // /**  身份证正面 */
  // private String idCardFrontPic;
  // /**  身份证背面 */
  // private String idCardBackPic;
  // /**  认证状态  1: 待认证  2: 认证通过   3: 认证失败 */
  // private Integer status;
  // /**  认证失败原因 */
  // private String reason;
  //机构名称
  organizationNamefn(e) {
    console.log(e, 72)
    var value = e.detail.value
    this.setData({
      organizationName: value
    })
  },
  //代码证
  handleInput(e) {
    console.log(e,54)
    let value = this.validateNumber(e.detail.value)
    this.setData({
      uniformCodeCertificate:value
    })
  },
  validateNumber(val) {
    return val.replace(/[\u4e00-\u9fa5]/ig, '')
  },
  //经办人
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let value = e.detail.value;
    this.setData({
      handlerType: value
    })
  },
  //删除照片
  delImgfn(){
this.setData({
  uniformCodeCertificateImg:''
})
  },
  //下一步
  linktoNext(){
    var that=this
wx.navigateTo({
  url: '../ShopCertificationNext/ShopCertificationNext?uniformCodeCertificateImg=' + `${that.data.uniformCodeCertificateImg}` + '&organizationName=' + `${that.data.organizationName}` + '&uniformCodeCertificate=' + `${that.data.uniformCodeCertificate}` + '&handlerType=' + `${that.data.handlerType}` + '&storeId=' + `${that.data.storeId}`,
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
  storeId: options.storeId
})
  },
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
          success: function (res) {
            var datainfo = JSON.parse(res.data).result
            console.log(res,81)
            that.setData({
              uniformCodeCertificateImg: datainfo
            })
          },
          fail: function (err) {
            console.log(err)
          }
        });
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