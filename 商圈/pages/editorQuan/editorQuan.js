const app = getApp()
Page({
  data: {
    image: app.globalData.imgs,
    inputvalue: '',
    textvalue: '',
    cost: '',
    payFlag: false,
    circleAvatar: '',//存储后台返回来的数据
    circleId:''//商圈id
  },
  onLoad(options) {
    this.setData({
      circleId: options.circleId

    })
    this.quanview()
  },
  //商圈名称
  formName: function (e) {
    this.setData({
      inputvalue: e.detail.value
    })
  },
  //商圈介绍
  textformName: function (e) {
    this.setData({
      textvalue: e.detail.value
    })
  },
  //编辑商圈
  editorqunaData() {
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/updateById',
      method: 'POST',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        circleId: that.data.circleId,
        circleName: that.data.inputvalue,
        circleAvatar: that.data.circleAvatar,
        circleInfo: that.data.textvalue
      },
      success(res) {
        console.log(res, 32)
        wx.showToast({
          title: '修改成功',
        })
      },
      fail() {

      }
    })
  },
  quanview() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/getById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        circleId: that.data.circleId
      },
      success(res) {
        that.setData({
          dataInfo: res.data.result,
          inputvalue: res.data.result.circleName,
          textvalue: res.data.result.circleInfo
        })
      }

    })
  },
  chooseImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        var imgs = app.globalData.imgs;//这里获取到全局变量
        wx.navigateTo({
          url: "/pages/upload/upload?src=" + tempFilePaths
        });
        that.setData({
          image: app.globalData.imgs
        })
      }
    })
  },
  onShow() {
    this.setData({
      image: app.globalData.imgs
    });
    this.upLoad(app.globalData.imgs)
  },
  upLoad(e) {
    // wx.showLoading({
    //   title: '上传中...',

    // })
    // var demo = this;
    // return
    var that = this;
    wx.uploadFile({
      url: app.globalData.myhost + '/image/upload',
      filePath: e,
      name: 'imgFile',
      formData: {
        // 'user': 112
      },
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success: function (res1) {
        console.log(res1,125)
        var data = JSON.parse(res1.data)
        var circleAvatar = JSON.stringify(data.result)
        that.setData({
          circleAvatar: circleAvatar
        })
        console.log(that.data.circleAvatar, 125)
        wx.hideLoading();
      },
      fail: function () {

      }
    })
  },


})