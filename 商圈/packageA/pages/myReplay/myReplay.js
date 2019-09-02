// packageA/pages/myReplay/myReplay.js
import {
  getQuantime,
  beautifyTime,
  getChinese
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    replaylist: [],
    pageNum: 1,
    replaytotalPage: null

  },
  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.replaylist()
  },

  //回复我的回复分页列表(必传token): http://192.168.101.10:4000/user/reply/toMyReplyQuery?createTime=&pageNum=&pageSize=
  replaylist() {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/reply/toMyReplyQuery',
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
        var replaylist = res.data.result.list
        if (replaylist.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (replaylist.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        console.log(replaylist, 45)
        for (var i = 0; i < replaylist.length; i++) {
          replaylist[i].createTime = beautifyTime(replaylist[i].createTime)
          replaylist[i].content = getChinese(replaylist[i].content)
          if (replaylist[i].trUserComment) {
            replaylist[i].trUserComment.content = getChinese(replaylist[i].trUserComment.content)
            if (replaylist[i].trUserComment.composeTrends){
            replaylist[i].trUserComment.composeTrends.content = getChinese(replaylist[i].trUserComment.composeTrends.content)
              if (replaylist[i].trUserComment.composeTrends.type == 4) {
              replaylist[i].trUserComment.composeTrends.trUserForward.composeTrends.content = getChinese(replaylist[i].trUserComment.composeTrends.trUserForward.composeTrends.content)
            }
            }
          }
        }
        that.setData({
          replaylist: that.data.replaylist.concat(res.data.result.list),
          replaytotalPage: res.data.result.pagination.totalPage
        })
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
//跳转到详情
  todetail(e){
    console.log(e,77)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    if (type == 1) {
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
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
    this.onLoad(); //刷新页面
    setTimeout(function() {
      wx.hideNavigationBarLoading(); //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh(); //停止下拉动作
    }, 2000)
  },
  onReachBottom: function() {
    var p = this.data.pageNum;
    var totalpage = this.data.replaytotalPage + 1;
    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p
    })
    this.replaylist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})