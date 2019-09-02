// pages/PublishingDynamicsComment/PublishingDynamicsComment.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    content: '', //评论框内容
    imageList: [],
    datainfo: [], //缩略图
    dynamicsContent: '',
    dynamicsContentUser: '',
    trendsId: '',//动态id 发表评论
    id: '',//回复评论
    replyType: ''//没有实际意义的参数 为了判断这个评论是回复评论的还是回复动态的
  },

  //文本框内容的获得
  getInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
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
        // getApp().data.servsers,这是在app.js文件里定义的后端服务器地址 
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
            // console.log(datainfo, JSON.parse(res.data),60)
            that.setData({
              datainfo: datainfo
            })

            //do something  
          },
          fail: function (err) {
            console.log(err)
          }
        });
      }
    })
  },
  //删除照片
  clearImg() {
    this.setData({
      datainfo: []
    })
  },

  
  //评论文章(必传token, composeId: 文章id   ): http://192.168.101.10:4000/user/comment/createArticleComment?content=&image=&composeId=
  commentfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/createArticleComment',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        composeId: that.data.id,
        content: that.data.content,
        image: JSON.stringify(that.data.datainfo[0]),
      },
      success(res) {
        //返回上一级关闭当前页面
        wx.navigateBack({
          delta: 1
        })
      }

    })
  },
 // 回复文章评论(必传token, 必传 commentId为评论id): http://192.168.101.10:4000/user/reply/createToArticleComment?content=&image=&commentId=
  replyCommentfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/reply/createToArticleComment',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        commentId: that.data.id,
        content: that.data.content,
        image: JSON.stringify(that.data.datainfo[0]),
      },
      success(res) {
        //返回上一级关闭当前页面
        wx.navigateBack({
          delta: 1
        })
      }

    })
  },
  //回复文章回复(必传token, 必传 replyId为回复id): http://192.168.101.10:4000/user/reply/createToArticleReply?content=&image=&replyId=
  replyCommentreplyfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/reply/createToArticleReply',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        replyId: that.data.id,
        content: that.data.content,
        image: JSON.stringify(that.data.datainfo[0]),
      },
      success(res) {
        //返回上一级关闭当前页面
        wx.navigateBack({
          delta: 1
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 139)

    this.setData({
      dynamicsContentUser: options.nikename,
      dynamicsContent: options.content,
      trendsId: options.trendsId,
      id: options.id,
      replyType: options.replyType
    })
    console.log(this.data.replyType==2,176)
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