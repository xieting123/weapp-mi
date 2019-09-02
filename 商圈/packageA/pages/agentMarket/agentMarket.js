// packageA/pages/agentMarket/agentMarket.js
var app = getApp()
import {
  getQuantime,
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: '',
    goodslistAgentData: [],
    agentProductId: '',
  },
  //获取代理市场商品分页列表: http://192.168.101.10:4000/goods/product/queryAgentMarket?createTime=&pageSize=&pageNum
  goodslistAgent() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/queryAgentMarket',
      data: {
        myStoreId: that.data.storeId,
        createTime: getQuantime(new Date().getTime()),
        pageNum: 1,
        pageSize: 10,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "GET",
      success(res) {
        console.log(res, 24)
        var data = res.data.result.list
        that.setData({
          goodslistAgentData: data,
        })
      }
    })
  },

  toagentDetial(e){
    var id = e.currentTarget.dataset.id;
wx.navigateTo({
  url: '../agentMarketdetial/agentMarketdetial?id='+`${id}`,
})
  },
  //发布代理商品(必传token, storeId为自己店铺id, agentProductId 为代理的商品id): http://192.168.101.10:4000/goods/product/createAgentProduct?storeId=&agentProductId=
  toagent(e) {
    console.log(e, 42)
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/createAgentProduct',
      data: {
        storeId: that.data.storeId,
        agentProductId: id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        if (res.data.code == 200) {
          that.goodslistAgent()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }

      }
    })
  },
  //删除商品(必传token 和 id): http://192.168.101.10:4000/goods/product/deleteById?id=
  tocancledetial(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/deleteById',
      data: {
        id: id,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        console.log(res, 24)
        if (res.data.code == 200) {
          that.goodslistAgent()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      storeId: options.storeId
    })
    this.goodslistAgent()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})