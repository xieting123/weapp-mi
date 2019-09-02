// packageA/pages/ShopCertificationgoods/ShopCertificationgoods.js
var app = getApp()
import {
  getQuantime,
  beautifyTime,
  getChinese
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    currentData: 0,
    goodlist:[],
    showStatus:false,
    storeId:'',//店铺id
    pageNum:1,
    totalpage:null,
    pageNum2: 1,
    totalpage2: null,
  },
  showtankuang() {
    this.setData({
      showStatus: true
    })
  },
  handleBtn() {
    wx.navigateTo({
      url: '../agentMarket/agentMarket?storeId=' + `${this.data.storeId}`,
    })
  },
  handleBtn2() {
    wx.navigateTo({
      url: '../selfGood/selfGood?storeId=' + `${this.data.storeId}`,
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current,
      })
    }
  },
  //获取当前滑块的index  根据index找到对应的blockId
  bindchange: function (e) {
    var ary = [{ id: 0, blockName: "销售中" }, { id: 0, blockName: "仓库" }]
    for (var i = 0; i < ary.length; i++) {
      var aryindex = ary[e.detail.current].id
      //  获取滑块改变的id   重点位置
    }
    const that = this;
    var index = e.detail.current
    that.setData({
      currentData: e.detail.current,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeId: options.storeId
    })
  },
  //获取指定店铺商品销售中分页列表: http://192.168.101.10:4000/goods/product/querySalesByStoreId?storeId=&createTime=&pageSize=&pageNum
  foodList() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/querySalesByStoreId',
      data: {
        storeId: that.data.storeId,
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
        for (var i = 0; i < data.length; i++) {
          data[i].createTime = getQuantime(data[i].createTime)
        }
        if (that.data.pageNum > 1) {
          that.setData({
            goodlist: that.data.goodlist.concat(res.data.result.list),
            totalpage: res.data.result.pagination.totalPage
          })
        } else {
          that.setData({
            goodlist: res.data.result.list,
            totalpage: res.data.result.pagination.totalPage
          })
        }
      }
    })
  },
  //获取指定店铺商品仓库中分页列表(必传token): http://192.168.101.10:4000/goods/product/querySkuByStoreId?storeId=&createTime=&pageSize=&pageNum
 querySkuByStoreList() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/querySkuByStoreId',
      data: {
        storeId: that.data.storeId,
        createTime: getQuantime(new Date().getTime()),
        pageNum2: that.data.pageNum2,
        pageSize: 10,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        var data = res.data.result.list
        if (data.length === 0 && that.data.pageNum2 == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (data.length === 0 && that.data.pageNum2 > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < data.length; i++) {
          data[i].createTime = getQuantime(data[i].createTime)
        }
        if (that.data.pageNum2 > 1){
          that.setData({
            querySkuByStoreList: that.data.querySkuByStoreList.concat(res.data.result.list),
            totalpage2: res.data.result.pagination.totalPage
          })
        }else{
          that.setData({
            querySkuByStoreList: res.data.result.list,
            totalpage2: res.data.result.pagination.totalPage
          })
        }

      }
    })
  },
  //跳转到商品管理
  todetial(e){
    console.log(e, e.currentTarget.dataset.producttype,132)
    var id = e.currentTarget.dataset.id
    var productType = e.currentTarget.dataset.producttype
    var controlid = e.currentTarget.dataset.controlid
    if (productType==0){
      wx.navigateTo({
        url: '../ShopCertificationgoodsdetial/ShopCertificationgoodsdetial?id=' + `${id}` + '&controlid=' + `${controlid}`,
      })
    }else{
      wx.navigateTo({
        url: '../ShopCertificationAgentgoodsdetial/ShopCertificationAgentgoodsdetial?id=' + `${id}` + '&controlid=' + `${controlid}`,
      })
    }

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
    this.foodList()
    this.querySkuByStoreList()
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
    // 主页加载
    if (this.data.currentData == 0) {
      var p = this.data.pageNum;
      var totalpage = this.data.totalpage + 1;

      p++;
      if (p > totalpage) {
        return;
      }
      this.setData({
        pageNum: p

      })
      this.foodList()
      // 文章加载
     }
    else if (this.data.currentData == 1) {
      console.log(this.data.currentData ,240)
      var p = this.data.pageNum2;
      var totalpage = this.data.totalpage2 + 1;

      p++;
      if (p > totalpage) {
        return;
      }
      this.setData({
        pageNum2: p

      })
      this.querySkuByStoreList()
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})