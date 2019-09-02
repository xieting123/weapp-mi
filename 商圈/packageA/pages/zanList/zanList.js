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
    trendsId: '',
    toFriendlist: [],
    pageNum: 1,
    totalPage: null,
    type: '',//个人主页点击进来的时候判断是动态还是文章  type=1动态2文章
  },
  //不能关注自己
  myselffn() {
    wx.showToast({
      title: '不能关注自己',
      icon: 'none',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,23)
    this.setData({
      trendsId: options.id,
      type: options.type
    })
    wx.setNavigationBarTitle({
      title: '点赞列表'
    })
    if (this.data.type==1){
      this.trendsZan()
    }else{
      this.articleZan()
    }
    

  },
  //查询指定动态点赞列表(有token 传token): http://192.168.101.10:4000/trendsZan/trendsQuery?trendsId=
  trendsZan() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsZan/trendsQuery',
      method: 'GET',
      data: {
        trendsId: that.data.trendsId,
        pageNum: that.data.pageNum,
        pageSize: 20
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
  //获得指定文章的点赞列表(有token, 传token  composeId  为文章id 必传): http://192.168.101.10:4000/trendsZan/articleQuery?composeId=&createTime&=pageNum=&pageSize=
  articleZan() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsZan/articleQuery',
      method: 'GET',
      data: {
        composeId: that.data.trendsId,
        pageNum: that.data.pageNum,
        pageSize: 20,
        createTime: getQuantime(new Date().getTime()),
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
          toFriendlist: []
        })
        if (that.data.type == 1) {
          that.trendsZan()
        } else {
          that.articleZan()
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
        that.setData({
          toFriendlist: []
        })
        if (that.data.type == 1) {
          that.trendsZan()
        } else {
          that.articleZan()
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
    if (p > totalpage || p == totalpage) {
      return;
    }
    this.setData({
      pageNum: p

    })
    if (this.data.type == 1) {
      this.trendsZan()
    } else {
      this.articleZan()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})