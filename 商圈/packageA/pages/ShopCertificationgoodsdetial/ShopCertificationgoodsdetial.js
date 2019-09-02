// packageA/pages/ShopCertificationgoodsdetial/ShopCertificationgoodsdetial.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '', //id是事件id
    goodsData:{},//商品信息
    storeId:'',//店铺id
    shelfFlag:'',//上下架
  },

  //获取指定商品详情(): http://192.168.101.10:4000/goods/product/getById?id=
  goodDetail() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/getById',
      data: {
        id: that.data.id,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "GET",
      success(res) {
        console.log(res, 24)
        var data = res.data.result
        that.setData({
          goodsData:data,
          storeId: data.storeId,
          shelfFlag: data.shelfFlag
        })
      }
    })
  },
  //编辑
  toeditor(){
    console.log(this.data.id,35)
    //需传两个id  商品id和店铺storeId
wx.navigateTo({
  url: '../selfGood/selfGood?storeId=' + `${this.data.storeId}`+'&id='+`${this.data.id}`,
})
  },
  //上架下架
  ////如要设置代销   必传allowConsignmentFlag 和 costPrice 
  // 修改商品(必传token 和 id  为商品id): http://192.168.101.10:4000/goods/product/updateById?id=&name=&price=&allowConsignmentFlag=&costPrice=&introduction=&coverImages=&detailImages&shelfFlag=
  toeditorgoods() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/updateById',
      data: {
        id: that.data.id,
        name: that.data.goodsData.name,
        price: that.data.goodsData.price,
        allowConsignmentFlag: that.data.allowConsignmentFlag ? that.data.allowConsignmentFlag:'',
        costPrice: that.data.goodsData.costPrice ? that.data.goodsData.costPrice:'',
        introduction: that.data.goodsData.introduction,
        coverImages: JSON.stringify(that.data.goodsData.coverImagesInfo),
        detailImages: JSON.stringify(that.data.goodsData.detailImagesInfo),
        shelfFlag: !that.data.shelfFlag,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success(res) {
        console.log(res, 92)
        if (res.data.code == 200) {
          console.log(res.data.result.shelfFlag, 94)
          that.setData({
            shelfFlag: res.data.result.shelfFlag
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  //查看商品页面
  togoodsdetial() {
    //需传两个id  
    wx.navigateTo({
      url: '../agentMarketdetial/agentMarketdetial?id=' + `${this.data.id}`,
    })
  },
  //推广设置
  todistributionMoneysetting(){
    wx.navigateTo({
      url: '../distributionMoneysetting/distributionMoneysetting?id=' + `${this.data.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.goodDetail()
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