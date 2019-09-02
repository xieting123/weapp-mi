// packageA/pages/myalbum/myalbum.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    uploaderNum: 0,
    imgurl: [],
    imginfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.albumlist()
  },
  // 上传相册album / uploadAbubms  //不太重要的功能
  // publishAlbum() {
  //   var that = this;
  //   that.albumlist()
  // },

  //指定用户相册分页列表(有token传token): http://192.168.101.10:4000/album/selectListLim?uniqueId=
  albumlist() {
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/album/selectListLim', //服务器接口,
      data: {
        uniqueId: wx.getStorageSync('uniqueId')
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res, 29)
        that.setData({
          imginfo: res.data.result.list.reverse()
        })
      }
    })
  },
  //多图上传图片选取
  //选取图片
  uploadDetailImage: function(e) { //这里是选取图片的方法
    var that = this;
    var pics = [];
    var imgurl = that.data.imgurl;
    if (imgurl.length >= that.data.count) {
      wx.showToast({
        title: '最多选择' + that.data.count + '张！',
      })
      return;
    }
    wx.chooseImage({
      count: 9 - that.data.uploaderNum, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgs = res.tempFilePaths; //选择的图片
        that.setData({
          imgs: that.data.imgs.concat(res.tempFilePaths),
          uploaderNum: res.tempFilePaths.length,
        })
        for (var i = 0; i < imgs.length; i++) {
          pics.push(imgs[i])
        }
        that.uploadimg({
          url: app.globalData.myhost + '/album/uploadAbubms', //这里是你图片上传的接口
          path: pics, //这里是选取的图片的地址数组
        })
      },
    })

  },
  //多张图片上传
  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'albumFiles', //这里根据自己的实际情况改
        method:'POST',
        header: {
          "Content-Type": "multipart/form-data",
          token: `${JSON.parse(wx.getStorageSync('token'))}`,
        },
        formData: {}, //这里是上传图片时一起上传的数据
        success: (resp) => {
          if (resp.statusCode==200){
            that.albumlist()
          }
        },
        fail: (res) => {
          fail++; //图片上传失败，图片上传失败的变量+1
          console.log('fail:' + i + "fail:" + fail);
        },
      });
    

  },
  // 删除图片
  clearImg: function(e) {
    let newData = [];
    console.log(this.data.imginfo, e.currentTarget.dataset.id,130)
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/album/delAbubms', //服务器接口,
      data: {
        albumIds: e.currentTarget.dataset.id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        if(res.data.code==200){
          that.albumlist()
        }
      }
    })
  },
  //展示图片
  showImg: function(e) {
    console.log(e, 135)
    var that = this;
    var imgAry = that.data.imginfo
    var a = imgAry.map(function(value, index) {
      return value.imgUrl
    })
    console.log(a)
    wx.previewImage({
      urls: a,
      current: e.currentTarget.dataset.thumb
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