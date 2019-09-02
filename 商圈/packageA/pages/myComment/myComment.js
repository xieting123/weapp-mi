// packageA/pages/myComment/myComment.js
import {
  getQuantime, beautifyTime, getChinese
} from '../../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentlist:[],
    pageNum:1,
    totalPage:null

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
  onLoad: function (options) {
    this.commentlist()
  },

//跳转到详情
  todetail(e){
    console.log(e)
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if(type==1){
      wx.navigateTo({
        url: '../../../pages/PublishingDynamicsDetail/PublishingDynamicsDetail?id='+`${id}`,
      })
    }else{
      wx.navigateTo({
        url: '../PublishingArticledetail/PublishingArticledetail?id=' + `${id}`,
      })
    }

  },

 // 评论我的评论分页列表(必传token): http://192.168.101.10:4000/user/comment/toMyCommentQuery?pageNum=&pageSize=&createTime=
  commentlist() {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/toMyCommentQuery',
      method: 'GET',
      data: {
        pageSize: 10,
        pageNum: that.data.pageNum,
        createTime: getQuantime(new Date()),
        smallFlag :true
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`
      },
      success(res) {
        // beautifyTime
        var commentlist = res.data.result.list
        if (commentlist.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (commentlist.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < commentlist.length; i++) {
          commentlist[i].createTime = beautifyTime(commentlist[i].createTime)
          commentlist[i].content = getChinese(commentlist[i].content)
          if (commentlist[i].composeTrends){
         commentlist[i].composeTrends.content = getChinese(commentlist[i].composeTrends.content )
          } 
          if (commentlist[i].trUserForward) {
            commentlist[i].trUserForward.composeTrends.content = "<span style='color:#456693'> @" + `${commentlist[i].trUserForward.toUser.nickname}` + ":</span>" + getChinese(commentlist[i].trUserForward.composeTrends.content)
          }
        }
        that.setData({
          commentlist: that.data.commentlist.concat(res.data.result.list),
          totalPage: res.data.result.pagination.totalPage
        })
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
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
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
    this.onLoad(); //刷新页面
    setTimeout(function () {
      wx.hideNavigationBarLoading(); //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh(); //停止下拉动作
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
    this.commentlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})