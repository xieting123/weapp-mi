// pages/chooseCreatequan/chooseCreatequan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: "none",
    btnDisplay: 'block',
    payFlag: false , //是否付费 默认免费
    isSure:true, //是否同意条款
  },
  closeModal() {
    this.setData({
      display: "none",
      btnDisplay: 'block'
    })
  },
  openModal() {
    this.setData({
      display: 'block',
      btnDisplay: 'none'
    })
  },
  choosefree() {
    this.setData({
      payFlag: !this.data.payFlag
    })
  },
  choosemoney() {
    this.setData({
      payFlag: !this.data.payFlag
    })
  },
  torouter(){
    if (this.data.payFlag){
      wx.navigateTo({
        url: '../CreatequanMoney/CreatequanMoney?payFlag=' + (this.data.payFlag),
      })
    }else{
      wx.navigateTo({
        url: '../createQuan/createQuan?payFlag=' + (this.data.payFlag),
      })
    }

  },
  ischoose(){
this.setData({
  isSure: !this.data.isSure
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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