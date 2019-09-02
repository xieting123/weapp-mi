// packageA/pages/selfGood/selfGood.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        name: true,
        value: '立即上架'
      },
      {
        name: false,
        value: '暂不售卖，放入仓库'
      },
    ],
    seleted: "",
    value: '', //销售价
    showStatus: false,
    showModal: false,
    modalMsg: '经过店铺认证方可发布自营商品',
    name: '', //商品名称
    price: '', //销售价
    allowConsignmentFlag: false, //是否允许代销
    costPrice: '', //成本价
    introduction: '',
    coverImages: [],
    detailImages: [],
    shelfFlag: '', //是否上架
    tips: '',
    storeId: '',
    id:'',//编辑时的商品id
    distributionFlag: '', //是否分销
    uploaderNum: '', //上传数量
  },
  //商品名称
  handleInputOne(e) {
    let value = e.detail.value;
    this.setData({
      name: value
    })
  },
  //销售价格
  handleInput(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      price: value
    })
  },
  //成本价格
  handleInput2(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      costPrice: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //上架设置
  radioChange: function(e) {
    let value = e.detail.value;
    this.setData({
      shelfFlag: value
    })
  },
  //平台代销
  radioChange2() {
    var allowConsignmentFlag = this.data.allowConsignmentFlag
    this.setData({
      allowConsignmentFlag : !allowConsignmentFlag
    })

  },
  //文字介绍
  textHandleInput(e) {
    console.log(e, 76)
    let value = e.detail.value;
    this.setData({
      introduction: value
    })
  },
  //选填
  textHandleInput2(e) {
    console.log(e, 84)
    let value = e.detail.value;
    this.setData({
      tips: value
    })
  },
  btnclick: function() {
    this.setData({
      showModal: true
    })
  },
  //点击取消 弹框关闭
  modal_click_Hidden: function() {
    this.setData({
      showModal: false,
    })
  },
  tankuangShow() {
    this.setData({
      showModal: true
    })
  },
  //点击确认  跳转认证页
  Sure() {
    wx.navigateTo({
      url: '../ShopCertification/ShopCertification',
    })
  },
  choosesheet() {
    this.setData({
      showStatus: true
    })
  },

  //如要设置代销   必传costPrice   
  //自营商品(必传token, name, price, allowConsignmentFlag, introduction, coverImages, detailImages, shelfFlag): http://192.168.101.10:4000/goods/product/createSelfOperatedProduct?storeId=&name=&price=&allowConsignmentFlag=&costPrice=&introduction=&coverImages=&detailImages=&shelfFlag=&tips=
  addProduct() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/createSelfOperatedProduct',
      method: 'POST',
      data: {
        storeId: that.data.storeId,
        name: that.data.name,
        price: that.data.price,
        allowConsignmentFlag: that.data.allowConsignmentFlag,
        costPrice: that.data.costPrice, //如果允许代销  即allowConsignmentFlag=true
        introduction: that.data.introduction,
        coverImages: JSON.stringify(that.data.coverImages),
        detailImages: JSON.stringify(that.data.detailImages),
        shelfFlag: that.data.shelfFlag, //是否上架
        tips: that.data.tips
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res, 152)
      }
    })
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
        // var name = 'items[' + index + '].name'
        // that.setData({
        //   [name]: res.data.result.shelfFlag
        // })
        that.setData({
          name: data.name,
          price: data.price,
          allowConsignmentFlag: data.allowConsignmentFlag,
          costPrice: data.costPrice, //如果允许代销  即allowConsignmentFlag=true
          introduction: data.introduction,
          coverImages: data.coverImagesInfo,
          detailImages: data.detailImagesInfo,
          shelfFlag: data.shelfFlag, //是否上架
          tips: data.tips,
        })
        console.log(that.data.shelfFlag,174)
        if (data.shelfFlag){
          var items=that.data.items;
          for(var i=0;i<i.length;i++){
            items[i].name = true
          }
        }
      }
    })
  },
  //展示图片
  showImg: function(e) {
    console.log(e, 123)
    var that = this;
    var type = e.currentTarget.dataset.type
    var imgAry = type == '1' ? that.data.coverImages : that.data.detailImages
    var a = imgAry.map(function(value, index) {
      return value.thumb
    })
    console.log(a)
    wx.previewImage({
      urls: a,
      current: e.currentTarget.dataset.thumb
    })
  },
  // 删除图片
  clearImg: function(e) {
    console.log(e, 137)
    let newData = [];
    var type = e.currentTarget.dataset.type
    var imgAry = type == 1 ? this.data.coverImages : this.data.detailImages
    imgAry.map((item, index) => {
      if (e.currentTarget.dataset.index !== index) {
        newData.push(item)
      }
    })
    //删除成功之后返回的新数组赋值给imgurl
    //此时 删除后 发布或者编辑传给后台的数据则相应的减少对应的图片
    if (type == 1) {
      this.setData({
        uploaderNum: this.data.uploaderNum - 1,
        coverImages: newData,
      })
    } else {
      this.setData({
        uploaderNum: this.data.uploaderNum - 1,
        detailImages: newData,
      })
    }

  },
  //通过传入的参数判断 是封面还是详情 图片
  uploadDetailImage1() {
    this.uploadDetailImage(1)
  },
  uploadDetailImage2() {
    this.uploadDetailImage(2)
  },
  //多图上传图片选取
  //选取图片
  uploadDetailImage: function(e) { //这里是选取图片的方法
    var that = this;
    var pics = [];
    var imgurl = e == 1 ? that.data.detailImages : that.data.detailImages;
    if (imgurl.length > 12) {
      wx.showToast({
        title: '最多选择12张！',
      })
      return;
    }
    wx.chooseImage({
      count: 12 - that.data.uploaderNum, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgs = res.tempFilePaths; //选择的图片
        for (var i = 0; i < imgs.length; i++) {
          pics.push(imgs[i])
        }
        that.uploadimg({
          url: app.globalData.myhost + '/images/upload', //这里是你图片上传的接口
          path: pics, //这里是选取的图片的地址数组
          e: e, //通过传入的参数判断 是封面还是详情 图片
        })
      },
    })

  },
  //多张图片上传
  uploadimg: function(data) {
    console.log(data, 190)
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'imgFiles', //这里根据自己的实际情况改
      header: {
        "Content-Type": "multipart/form-data",
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      formData: {}, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        var imgurlData = JSON.parse(resp.data).result
        if (data.e == 1) {
          that.setData({
            coverImages: that.data.coverImages.concat(imgurlData)
          })
        } else {
          that.setData({
            detailImages: that.data.detailImages.concat(imgurlData)
          })
        }
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张            
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else { //若图片还没有传完，则继续调用函数                
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 277)
    this.setData({
      storeId: options.storeId
    })
    if (options.id){
      this.setData({
        id: options.id
      }) 
      this.goodDetail()
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