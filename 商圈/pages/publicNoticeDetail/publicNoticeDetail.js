// pages/publicNoticeDetail/publicNoticeDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notifyId: '',
    circleId:'',
    dataInfo: '',
    imageLists: [],
    createTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      notifyId: options.notifyId,
      createTime: options.createTime

    })
    this.noticeDetail()
  },
  // 图片预览效果
  //展示图片
  showImg: function (e) {
    console.log(e, 135)
    var that = this;
    var imgAry = that.data.dataInfo.imageList
    var a = imgAry.map(function (value, index) {
      return value.thumb
    })
    console.log(a)
    wx.previewImage({
      urls: a,
      current: e.currentTarget.dataset.thumb
    })
  },
  //通告详情
  noticeDetail() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleNotify/getById',
      method: 'POST',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        notifyId: that.data.notifyId
      },
      success(res) {
        that.setData({
          dataInfo: res.data.result,
          imageLists: JSON.stringify(res.data.result.imageList)
        })
      }
    })
  },
  //删除通告
  delNotice(){
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/circleNotify/deleteById',
      method: 'POST',
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        notifyId: that.data.notifyId
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: '删除成功',
        })
        //返回上一级关闭当前页面
        wx.navigateBack({
          delta: 1
        })
        // circleId: options.circleId,
        //   createFlag: options.createFlag,
        //     adminFlag: options.adminFlag
        // wx.navigateTo({
        //   url: '../publicNotice/publicNotice?circleId=' + `${that.data.circleId}` +'&createFlag=true+adminFlag=true',
        // })

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