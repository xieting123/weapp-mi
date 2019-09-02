// packageA/pages/myZanlist/myZanlist.js
//获取应用实例
import {
  getQuantime, beautifyTime
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanlist: [],
    pageNum: 1,
    zantotalPage: null
  },
  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },
  todetial(e){
    var composetype = e.currentTarget.dataset.composetype;
    var id = e.currentTarget.dataset.id;
    if (composetype == 1) {
      wx.navigateTo({
        url: '../../../pages/PublishingDynamicsDetail/PublishingDynamicsDetail?id=' + `${id}`,
      })
    } else {
      wx.navigateTo({
        url: '../PublishingArticledetail/PublishingArticledetail?id=' + `${id}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.zanlist()
  },

  //点赞我的点赞分页列表(必传token): http://192.168.101.10:4000/trendsZan/toMyZanQuery?pageNum=&pageSize=&createTime=

  zanlist() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsZan/toMyZanQuery',
      method: 'GET',
      data: {
        pageSize: 10,
        pageNum: that.data.pageNum,
        createTime: getQuantime(new Date()),
        smallFlag: true
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`
      },
      success(res) {
        // beautifyTime
        var zanlist= res.data.result.list
        if (zanlist.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (zanlist.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < zanlist.length;i++){
          zanlist[i].createTime = beautifyTime(zanlist[i].createTime)
        }
        that.setData({
          zanlist: that.data.zanlist.concat(res.data.result.list) ,
          zantotalPage: res.data.result.pagination.totalPage
        })
        console.log(that.data.zanlist,42)
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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
    this.onLoad(); //刷新页面
    setTimeout(function () {
      wx.hideNavigationBarLoading(); //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh(); //停止下拉动作
    }, 2000)
  },
  onReachBottom: function () {
    var p = this.data.pageNum;
    var totalpage = this.data.zantotalPage + 1;
    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.zanlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})