var app = getApp()
// pages/Labelmanagement/Labelmanagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    modalMsg_placeholder: '请填写版块名称',
    modalMsg: '',//弹框input的内容
    blockName: [],
    tagId: '',//标签id
    results: {},
    objlist: [],
    btncase:1,//点击创建时只为1 添加时值为2
  },
  btnclick: function () {
// 判断是否含有此版块id，有就是编辑，没有就是创建
    this.setData({
      showModal: true,
      btncase: 1,
    })
  },
  //编辑
  btnclick2: function (e) {
console.log(e,26)
      this.setData({
        modalMsg: e.currentTarget.dataset.name,
        btncase:2,
        tagId: e.currentTarget.id
      })
    
    this.setData({
      showModal: true
    })
  },
  showCancelOrder: function () {
    this.setData({
      showModal: true
    })
  },
  modal_click_Hidden: function () {
    this.setData({
      showModal: false,
      modalMsg: ''
    })
  },
  // 确定
  Sure: function () {
    if (this.data.modalMsg == '') {
      wx.showToast({
        title: '请填写',
        icon: 'none'
      })
      return
    } else if (this.data.btncase===1){
      // 提交到后端创建版块
      this.cancelOrder();
    }else{
      //编辑标签
      this.editorById()
    }
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.setData({
      circleId: options.circleId
    })
  },
  changeCancelReason: function (e) {
    this.setData({
      modalMsg: e.detail.value
    })
  },
  //删除版块(id, token必传, id为版块id): http://192.168.101.10:4000/circleBlock/deleteById?id=
  deleteById(e) {
    console.log(e.currentTarget.id, 58)
    // this.setData({
    //   tagId: e.currentTarget.id
    // })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleBlock/deleteById',
      method: 'POST',
      data: {
        id: e.currentTarget.id,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        that.lable()
      }
    })
  },
  //新建商圈版块(必传token, blockName为版块名(最长20字符), circleId为商圈id): http://192.168.101.10:4000/circleBlock/create?blockName=&circleId=
  cancelOrder: function () {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleBlock/create',
      method: 'POST',
      data: {
        circleId: that.data.circleId,
        blockName: that.data.modalMsg
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }else{
          var blockName = res.data.result.blockName;
          var tagId = res.data.result.tagId;
          var obj = [{ blockName, tagId }];
          var objlist = that.data.objlist.concat(obj)
          that.setData({
            blockName: that.data.blockName.concat(blockName),
            objlist: that.data.objlist.concat(obj)
          })
        }       
      }
    })
    that.setData({
      showModal: false,
      modalMsg: ''
    })
    //   },
    //   fail: function () {

    //   }
    // })
  },
  //修改版块名(id, token必传, id为版块id, blockName为版块名(最长20字符)): http://192.168.101.10:4000/circleBlock/updateById?id=&blockName=
  editorById(){  
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleBlock/updateById',
      method: 'POST',
      data: {
        id: that.data.tagId,
        blockName: that.data.modalMsg
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res,138)
        var blockName = res.data.result.blockName;
        that.setData({
          blockName:blockName,
          showModal: false,
          modalMsg: ''
        })
        that.lable()
      }
         
    })
  
  },


  //循环标签列表 展示数据
  lable() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/getById',
      method: 'POST',
      data: {
        circleId: that.data.circleId,
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res,136)
        that.setData({
          objlist: res.data.result.blockList
        })
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
    this.lable()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})