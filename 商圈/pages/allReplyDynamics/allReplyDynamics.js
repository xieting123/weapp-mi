// pages/allReplyDynamics/allReplyDynamics.js
var app=getApp()
import {
  beautifyTime,
  getChinese
} from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "", //评论id
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}, //
    commenTotalCount:'',
    commentlist:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 15)
    this.setData({
      id: options.id
    })
    this.Dynamicsfn()
    this.Dynamicslist()
  },
  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../packageA/pages/personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },

  //获取指定评论详情(有token传token): http://192.168.101.10:4000/user/comment/getById?id=
  Dynamicsfn(e) {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/getById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        id: that.data.id,
      },
      success(res) {
        console.log(res, 213)
        res.data.result.createTime=beautifyTime(res.data.result.createTime)
        res.data.result.content = getChinese(res.data.result.content)
        that.setData({
          dynamicsinfo:res.data.result
        })
      }
    })
  },
//回复分页列表(有token传token , commentId 为评论id): http://192.168.101.10:4000/user/reply/query?commentId=
  Dynamicslist() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/reply/query',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        commentId: that.data.id,
      },
      success(res) {
        console.log(res,65)
        var commentdata = res.data.result
        var arr = res.data.result.list
        for (var i = 0; i < arr.length; i++) {
          arr[i].createTime = beautifyTime(arr[i].createTime)
          arr[i].content = getChinese(arr[i].content)
          arr[i].replyContent? arr[i].replyContent = getChinese(arr[i].replyContent):''
        }
        that.setData({
          commentlist: commentdata.list,
          commenTotalCount: commentdata.pagination.totalCount
        })
      }
    })
  },
 //删除动态回复(必传token, id为回复id): http://192.168.101.10:4000/user/reply/deleteTrendsReply?id=
  delDynamicReply(e) {
    var id = e.currentTarget.dataset.id
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/reply/deleteTrendsReply',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        id: id,
      },
      success(res) {
        console.log(res, 213)
      }
    })
  },
  //查看图片
  previewImage(e) {
    var current = e.currentTarget.dataset.source
    var url = []
    url.push(current)
    wx.previewImage({
      current: current,
      urls: url
    })
  },
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 620) //先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
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