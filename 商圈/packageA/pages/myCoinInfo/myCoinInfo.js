// packageA/pages/myCoinInfo/myCoinInfo.js
var app = getApp();
import {
  getQuantime,
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    datainfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.coinLog()
  },
  //我的蜜币记录明细(必传token): http://192.168.101.10:4000/user/coinLog/myQuery?createTime=&pageNum=&pageSize=
  coinLog() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/coinLog/myQuery',
      method: 'GET',
      data: {
        createTime: getQuantime(new Date().getTime()),
        pageNum: that.data.pageNum,
        pageSize: 10,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var datainfo=res.data.result.list
        if (datainfo.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (datainfo.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < datainfo.length;i++){
          datainfo[i].createTime = getQuantime(datainfo[i].createTime)
        }
        that.setData({
          datainfo: that.data.datainfo.concat(datainfo),
          totalPage: res.data.result.pagination.totalPage
        })
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
  onReachBottom: function () {
    var p = this.data.pageNum;
    var totalpage = this.data.totalpage + 1;

    p++;
    if (p > totalpage || p == totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.coinLog()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})