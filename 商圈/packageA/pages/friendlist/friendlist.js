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
    uniqueId:'',
    toFriendlist:[],
    pageNum:1,
    totalPage:null,
    type:'',//个人主页点击进来的时候判断是粉丝还是关注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uniqueId: options.id,
      type:options.type
    })
    if(options.type==1){
      wx.setNavigationBarTitle({
        title: '关注列表'
      })
      this.toFriendslistfn()
    } else if(options.type == 2){
      this.fanslistfn()
      wx.setNavigationBarTitle({
        title: '粉丝列表'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '我的关注'
      })
    }
   
  },
  // 指定用户关注列表(有token传token): http://192.168.101.10:4000/user/accounts/getToFriendsList?uniqueId=
  toFriendslistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/getToFriendsList',
      method: 'GET',
      data: {
        uniqueId: that.data.uniqueId,
        pageNum: that.data.pageNum,
        pageSize:20
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
        that.setData({
          toFriendlist: that.data.toFriendlist.concat(datainfo),
          totalPage: res.data.result.pagination.totalPage
        })

      }
    })
  },
  // 指定用户粉丝列表(有token传token): http://192.168.101.10:4000/user/accounts/getToFansList?uniqueId=
  fanslistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/getToFansList',
      method: 'GET',
      data: {
        uniqueId: that.data.uniqueId,
        pageNum: that.data.pageNum,
        pageSize: 20
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res.data.result, 349)
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
        that.setData({
          toFriendlist:[]
        })
        if(that.data.type==1){
          that.toFriendslistfn()
        }else{
          that.fanslistfn()
        }
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
        console.log(res,161)
        if (that.data.type == 1) {
          that.setData({
            toFriendlist: []
          })
          that.toFriendslistfn()
        } else {
          that.setData({
            toFriendlist: []
          })
          that.fanslistfn()
        }  
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var p = this.data.pageNum;
    var totalpage = this.data.totalpage + 1;

    p++;
    if (p > totalpage || p == totalpage ) {
      return;
    }
    this.setData({
      pageNum: p

    })
    if(this.data.type==1){
      this.toFriendslistfn();
    } else if (this.data.type == 2){
      this.fanslistfn()
    }

   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})