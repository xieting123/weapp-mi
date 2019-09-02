var app=getApp()
// pages/Labelmanagement/Labelmanagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    modalMsg_placeholder:'请填写商圈用户标签',
    modalMsg:'',
    tagName:[],
    tagId:'',//标签id
    results:{},
    objlist:[]
  },
  btnclick: function () {
    this.setData({
      showModal:true
    })
  },

  showCancelOrder: function () {
    this.setData({
      showModal: true
    })
  },
  modal_click_Hidden: function () {
    this.setData({
      showModal: false,
      modalMsg:''
    })
  },
  // 确定
  Sure: function () {
    if (this.data.modalMsg == '') {
      wx.showToast({
        title: '请填写商圈用户标签',
        icon: 'none'
      })
      return
    } else {
      // 提交到后端
      this.cancelOrder();
    }
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
  this.setData({
    circleId: options.circleId
  })
  },
  changeCancelReason: function (e) {
    this.setData({
      modalMsg: e.detail.value
    })
  },
  //删除标签
  deleteById(e){
    console.log(e.currentTarget.id,58)
    this.setData({
      tagId: e.currentTarget.id
    })
    var that = this;
wx.request({
  url: app.globalData.myhost +'/circleTag/deleteById',
  method: 'POST',
  data: {
    tagId: that.data.tagId,
  },
  header: {
    token: `${JSON.parse(wx.getStorageSync('token'))}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  success(res) {
console.log(res)
    that.lable()
  }
})
  },
  //新增标签
  cancelOrder: function () {
    var that = this;
    wx.request({
      url: app.globalData.myhost +'/circleTag/create',
      method:'POST',
      data:{
        circleId: that.data.circleId,
        tagName:that.data.modalMsg
      },
      header:{
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res){
        var tagName = res.data.result.tagName;
        var tagId = res.data.result.tagId;
        var obj = [{tagName, tagId}];
        var objlist = that.data.objlist.concat(obj)
      that.setData({
        tagName: that.data.tagName.concat(tagName),
        objlist: that.data.objlist.concat(obj)
      })  
      }
    })
        that.setData({
          showModal: false,
          modalMsg:''
        })
    //   },
    //   fail: function () {

    //   }
    // })
  },
//循环标签列表 展示数据
  lable() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleTag/selectList',
      method: 'POST',
      data: {
        circleId: that.data.circleId,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        that.setData({
          objlist:res.data.result
        })
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
    this.lable()
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