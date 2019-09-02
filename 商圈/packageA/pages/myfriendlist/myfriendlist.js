// packageA/pages/friendlist/friendlist.js
var app = getApp()
import {
  getQuantime,
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uniqueId: '',
    toFriendlist: [],
    pageNum: 1,
    totalPage: null,
    type: '', //个人主页点击进来的时候判断是粉丝还是关注
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
    this.friendslistfn()
  },

  //  参数介绍 type  1:  关注  2 : 取消关注   展示的数据为里面的  user
  //关注的消息分页列表(必传token): http://192.168.101.10:4000/userLikeLog/toMyQuery?createTime=&pageNum=&pageSize=
  friendslistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/userLikeLog/toMyQuery',
      method: 'GET',
      data: {
        pageNum: that.data.pageNum,
        pageSize: 20,
        createTime: getQuantime(new Date().getTime())
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res.data.result, 327)
        var datainfo = res.data.result.list
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
        for (var i = 0; i < datainfo.length; i++) {
          datainfo[i].createTime = getQuantime(datainfo[i].createTime)
        }
        that.setData({
          toFriendlist: that.data.toFriendlist.concat(datainfo),
          totalPage: res.data.result.pagination.totalPage
        })

      }
    })
  },

  //关注(必传token): http://192.168.101.10:4000/user/accounts/follow?uniqueId=
  //type=0未关注 2 已关注 4相互关注
  followbtnFn(e) {
    console.log(e.currentTarget.dataset.id, 126)
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/follow',
      method: 'GET',
      data: {
        uniqueId: e.currentTarget.dataset.id
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res,71)
        that.setData({
          toFriendlist:[],
          pageNum:1,
        })
        that.friendslistfn()

      }
    })
  },
  //取消关注(必传token): http://192.168.101.10:4000/user/accounts/unFollow?uniqueId=
  unfollowbtnFn(e) {
    console.log(e.currentTarget.dataset.id, 145)
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/unFollow',
      method: 'GET',
      data: {
        uniqueId: e.currentTarget.dataset.id
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        that.setData({
          toFriendlist: [],
          pageNum:1
        })
        that.friendslistfn()
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
    var p = this.data.pageNum;
    var totalpage = this.data.totalpage + 1;

    p++;
    if (p > totalpage || p == totalpage) {
      return;
    }
    this.setData({
      pageNum: p

    })

    this.friendslistfn()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})