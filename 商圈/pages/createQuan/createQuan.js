const app = getApp()
const util = require('../../utils/util.js')
var createQuan = util.config('createQuan')
Page({
  data: {
    image: app.globalData.imgs,
    inputvalue: '',
    textvalue: '',
    cost: 0,
    payFlag: false,
    circleAvatar: '', //存储后台返回来的数据
  },
  onLoad(e) {
    console.log(e.payFlag,14)
    if (e.payFlag==="true"){
      console.log(16)
      this.setData({
        cost: e.cost,
        payFlag: e.payFlag
      })
    }else{
      this.setData({
        payFlag: e.payFlag
      })
    }

  },
  //商圈名称
  formName: function(e) {
    this.setData({
      inputvalue: e.detail.value
    })
  },
  //商圈介绍
  textformName: function(e) {
    this.setData({
      textvalue: e.detail.value
    })
  },
  //创建商圈
  createQuans: function() {
    var that = this;
    var token = wx.getStorageSync('token')
    var data = {
      // token: token,
      payFlag: that.data.payFlag,
      cost: that.data.cost,
      circleInfo: that.data.textvalue,
      circleName: that.data.inputvalue,
      circleAvatar: that.data.circleAvatar
    };
    if (that.data.circleAvatar){
      wx.request({
        url: app.globalData.myhost + `/businessCircle/create`,
        // url: createQuan,
        method: 'POST',
        dataType: 'text',
        data,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: `${JSON.parse(wx.getStorageSync('token'))}`,
        },
        success: (res) => {
          wx.switchTab({
            url: '../index/index',
          })
        },
        fail: () => {

        }
      })
    }
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
        var imgs = app.globalData.imgs; //这里获取到全局变量
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
        "Content-Type": "multipart/form-data",
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success: function(res1) {
        var data = JSON.parse(res1.data)
        var circleAvatar = JSON.stringify(data.result)
        that.setData({
          circleAvatar: circleAvatar
        })

        wx.hideLoading();
      },
      fail: function() {

      }
    })
  },


})