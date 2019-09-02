// pages/address/address.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    area: "",
    contact: "",
    setDefault: "",
    user: "",

    province: "请选择",
    provinceVal: "",
    cityVal: '',
    provinceId: '',
    cityId: '',
    provinceList: [],
    cityList: [],
    provinceIndex: '0',
    cityIndex: '0',

    condition: false,
    addressId: '',
    address: '',
    name: "",
    telephone: "",
    isDefault: '0',
    flager: false,
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let data = e.detail.value;
    let provinceId = this.data.provinceId
    let cityId = this.data.cityId
    let reg = /^1[34578]\d{9}$/;

    if (data.user == '') {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none',
      })
      return false;
    }
    if (data.contact == '') {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none',
      })
      return false;
    }

    if (!(reg.test(data.contact))) {
      wx.showToast({
        title: '电话不正确',
        icon: 'none',
      })
      return false;
    }
    if (data.address == '') {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
      })
      return false;
    }
    if (data.provinceId == '') {
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
      })
      return false;
    }
    if (data.cityId == '') {
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
      })
      return false;
    }
    this.addAddress(data)
  },
  addAddress(data) {
    // addAddressUrl
    let then = this;
    let isDefault = false;
    if (data.setDefault == '') {
      isDefault = false;
    }
    if (data.setDefault == '1') {
      isDefault = true;
    }

    let provinceId = then.data.provinceId
    let cityId = then.data.cityId

    wx.request({
      url: app.globalData.myhost + '/goods/consignee/addAddress',
      data: {
        consigneeName: data.user,
        consigneePhone: data.contact,
        provinceId: provinceId,
        cityId: cityId,
        consigneeDetail: data.address,
        isDefault: isDefault
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: '',
          })
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    })
  },
  open: function() {
    this.setData({
      condition: !this.data.condition
    })
  },
  provinceFn(e) {
    console.log(e.currentTarget.dataset)
    let data = e.currentTarget.dataset;
    this.setData({
      provinceId: data.id,
      provinceIndex: data.index,
      provinceVal: data.name,
      cityList: this.data.provinceList[data.index].cityList
    })
  },
  cityFn(e) {
    console.log(e.currentTarget.dataset)
    let data = e.currentTarget.dataset;
    this.setData({
      cityId: data.id,
      cityIndex: data.index,
      cityVal: data.name
    })
  },
  openFns() {
    let provinceVal = this.data.provinceVal
    let cityVal = this.data.cityVal
    this.setData({
      province: provinceVal + '-' + cityVal,
      condition: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.region()
  },
  region() {
    let thet = this;
    wx.request({
      url: app.globalData.myhost +'/user/region/list',
      data: {},
      header: {},
      method: 'GET',
      success: function(res) {
        console.log(res.data.result)
        let provinceIndex = thet.data.provinceIndex
        // cityIndex

        thet.setData({
          provinceList: res.data.result,
          cityList: res.data.result[thet.data.cityIndex].cityList,
          provinceVal: res.data.result[0].provinceName,
          cityVal: res.data.result[thet.data.cityIndex].cityList[0].cityName,
          provinceId: res.data.result[0].id,
          cityId: res.data.result[thet.data.cityIndex].cityList[0].id,
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})