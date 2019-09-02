//获取应用实例
const app = getApp()
import {
  getQuantime,
} from '../../../utils/util.js'
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [{
        text: '全部'
      },
      {
        text: '待付款'
      },
      {
        text: '待发货'
      },
      {
        text: '待收货'
      },
      {
        text: '待评价'
      },
    ],
    currentTab: 0,
    navScrollLeft: 0,
    pageNum: 1,
    totalpage: null,
    goodStatusList: []
  },

  //我的订单分页列表(必传token, orderStatus不传  查所有订单, 传指定状态, 查询指定状态的订单): http://192.168.101.10:4000/goods/productOrder/myOrders?createTime=&pageSize=&pageNum
  myOrderslist() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/productOrder/myOrders',
      data: {
        createTime: getQuantime(new Date().getTime()),
        pageNum: that.data.pageNum,
        pageSize: 10,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        console.log(res)
        var data = res.data.result.list
        if (data.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (data.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        that.setData({
          goodStatusList: that.data.goodStatusList.concat(data),
          totalpage: res.data.result.pagination.totalPage
        })
      }
    })
  },
  //跳转到
  //根据orderStatus判断跳转到哪个页面
  togoodsDetail(e) {
    var status = e.currentTarget.dataset.status
    console.log(e, 71)
  },
  //代发货
  todeliverdetial(e) {
    console.log(e, 74)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../ShoppingUndelivergoods/ShoppingUndelivergoods?id=' + `${id}`,
    })
  },
  //事件处理函数
  onLoad: function() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    this.myOrderslist()
  },
  // switchNav(event) {
  //   var cur = event.currentTarget.dataset.current;
  //   //每个tab选项宽度占1/5
  //   var singleNavWidth = this.data.windowWidth / 5;
  //   //tab选项居中                            
  //   this.setData({
  //     navScrollLeft: (cur - 2) * singleNavWidth
  //   })
  //   if (this.data.currentTab == cur) {
  //     return false;
  //   } else {
  //     this.setData({
  //       currentTab: cur
  //     })
  //   }
  // },
  // switchTab(event) {
  //   var cur = event.detail.current;
  //   var singleNavWidth = this.data.windowWidth / 5;
  //   this.setData({
  //     currentTab: cur,
  //     navScrollLeft: (cur - 2) * singleNavWidth
  //   });
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
    this.onLoad(); //刷新页面
    setTimeout(function() {
      wx.hideNavigationBarLoading(); //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh(); //停止下拉动作
    }, 2000)
  },
  onReachBottom() {
    // 主页加载
    var p = this.data.pageNum;
    var totalpage = this.data.totalpage + 1;

    p++;
    if (p > totalpage) {
      return;
    }
    this.setData({
      pageNum: p

    })
    this.myOrderslist();
  },
})