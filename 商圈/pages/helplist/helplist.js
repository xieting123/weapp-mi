// pages/helplist/helplist.js
import { getDateStr} from '../../utils/util.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewhelplist:[],
    pageNum:1
  },

helplist(){
  wx.showLoading({
    title: '加载中...'
  })
    var that=this;
    wx.request({
      url: app.globalData.myhost + '/noticeHelper/query',
      method:'GET',
      header:{
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data:{
        pageSize: 10,
        pageNum: that.data.pageNum
      },
      success(res){
        var arr = res.data.result.list;
        if (arr.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (arr.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for(var i=0;i<arr.length;i++){
          arr[i].createTime = getDateStr(arr[i].createTime)
        }
        that.setData({
          viewhelplist: that.data.viewhelplist.concat(res.data.result.list),
          totalpage: res.data.result.pagination.totalPage
        })
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.helplist()
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
    wx.showNavigationBarLoading();    //在当前页面显示导航条加载动画
    this.onLoad();    //刷新页面
    setTimeout(function () {
      wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh();    //停止下拉动作
    }, 2000)
  },
  onReachBottom: function () {
    var p = this.data.pageNum;
    var totalpage = this.data.totalpage + 1;
    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.helplist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})