// pages/settingcontrolQuan/settingcontrolQuan.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId: '',
    forbidUserFlag: '',
    inviteCodeFlag:'',  
    circleDistributionMoney:'',
    enterCircleFlag:'',  
    userVerifyFlag:'',   
    showNameFlag:'', 
    showMatchMakingFlag:'',
    inviteCodeFlags:"",//控制邀请码开关
    cost: '',//商圈费用
    thumb:'',//商圈图片
    circleName: ''//商圈名称
  },
  switch1Change: function(e) {
    this.setData({
      forbidUserFlag: e.detail.value
    })
    var arg = { forbidUserFlag: this.data.forbidUserFlag, circleId: this.data.circleId }
    this.switchtab(arg)
  },
  switch2Change: function(e) {
    this.setData({
      enterCircleFlag: e.detail.value
    })
    var arg = { enterCircleFlag: this.data.enterCircleFlag, circleId: this.data.circleId}
    this.switchtab(arg)
  },
  switch3Change: function(e) {
    this.setData({
      inviteCodeFlags: e.detail.value,
      inviteCodeFlag: e.detail.value
    })
    var arg = { inviteCodeFlag: this.data.inviteCodeFlag, circleId: this.data.circleId }
    this.switchtab(arg)
  },
  switch4Change: function(e) {
    this.setData({
      userVerifyFlag: e.detail.value
    })
    var arg = { userVerifyFlag: this.data.userVerifyFlag, circleId: this.data.circleId }
    this.switchtab(arg)
  },
  switch5Change: function(e) {
    this.setData({
      showNameFlag: e.detail.value
    })
    var arg = { showNameFlag: this.data.showNameFlag, circleId: this.data.circleId }
    this.switchtab(arg)
  },
  switch6Change: function(e) {
    this.setData({
      showMatchMakingFlag: e.detail.value
    })
    var arg = { showMatchMakingFlag: this.data.showMatchMakingFlag, circleId: this.data.circleId }
    this.switchtab(arg)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,66)

    this.setData({
      circleId: options.circleId,
      cost:options.cost,
      thumb:options.thumb,
      circleName: options.circleName
    })
    this.quanview()
  },
  //数据渲染
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
        var datainfo = res.data.result;
        that.setData({
          forbidUserFlag: datainfo.forbidUserFlag,
          inviteCodeFlag: datainfo.inviteCodeFlag,
          circleDistributionMoney: datainfo.circleDistributionMoney,
          enterCircleFlag: datainfo.enterCircleFlag,
          userVerifyFlag: datainfo.userVerifyFlag,
          showNameFlag: datainfo.showNameFlag,
          showMatchmakingFlag: datainfo.showMatchmakingFlag
        })
        console.log(res.data)
      }

    })
  },
  switchtab(pamarys) {
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/updateById',
      method: 'POST',
      data: { ...pamarys} ,
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
      //  wx.showToast({
      //    title: '设置成功',
      //  })
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