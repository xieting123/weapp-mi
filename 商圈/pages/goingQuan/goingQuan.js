// pages/goingQuan/goingQuan.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display: "none", //第一次点击时判断是否需要申请加入  是  则显示
    display2: 'none', //判断是否需要邀请码 邀请码弹框显示
    circleId: '', //商圈id
    dataInfo: '', //返回回来的商圈数据
    reviewContent: '', //input框中的值
    inviteCode: '', //邀请码
    meberdataInfo:'',//成员数据展示
    payOrderNo:'',
  },
  // 申请理由提交
  wxSearchInput(e) {
    this.setData({
      reviewContent: e.detail.value
    })
  },
  // 邀请码内容
  yqmInput(e) {
    this.setData({
      inviteCode: e.detail.value
    })
  },
  //支付金额 免费申请加入
  toPay() {
    var that = this;
    if (that.data.dataInfo.payFlag){
      wx.request({
        url: app.globalData.myhost + '/accounts/Small/WeChatPay/prepay',
        method: 'POST',
        data: {
          circleId: that.data.circleId,
          amountSource: 19,
          reviewContent:'',
          openid: wx.getStorageSync('openid')

        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          token: `${JSON.parse(wx.getStorageSync('token'))}`,
        },
        success(res) {
          console.log(res.data.result)
          that.setData({
            payOrderNo: res.data.result.payOrderNo
          })
          that.wxPay(res.data.result)
        },
        fail() {

        }
      })
    }else{
      if (that.data.dataInfo.enterCircleFlag) {
        wx.request({
          url: app.globalData.myhost + '/circleUserReview/create',
          method: 'POST',
          data: {
            circleId: that.data.circleId,
            reviewContent: that.data.reviewContent
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: `${JSON.parse(wx.getStorageSync('token'))}`,
          },
          success(res) {
            wx.showToast({
              title: '加入成功',
            })
            setTimeout(
              wx.navigateTo({
                url: '../inQuan/inQuan?circleId=' + `${that.data.circleId}`

              })
              , 2000)
          },
          fail() {

          }
        })
      } else {
        wx.request({
          url: app.globalData.myhost + '/circleUserReview/joinCircle',
          method: 'POST',
          data: {
            circleId: that.data.circleId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: `${JSON.parse(wx.getStorageSync('token'))}`,
          },
          success(res) {
            wx.showToast({
              title: '加入成功',
            })
            setTimeout(
              wx.navigateTo({
                url: '../inQuan/inQuan?circleId=' + `${that.data.circleId}`

              })
              , 2000)
          },
          fail() {

          }
        })
      }
    }
 
  },

  wxPay(data) {
    var that=this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success(res) {
        console.log(res,112)
        wx.request({
          url: app.globalData.myhost + '/accounts/Small/WeChatPay/notify',
          method: 'POST',
          data: {
            payOrderNo: that.data.payOrderNo,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: `${JSON.parse(wx.getStorageSync('token'))}`,
          },
          success(res) {
            wx.showToast({
              title: '支付成功',
            })
            setTimeout(
              wx.navigateTo({
                url: '../inQuan/inQuan?circleId='+`${that.data.circleId}`

            })
            ,2000)

          },
          fail() {

          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  openModal() {
    if (this.data.dataInfo.inviteCodeFlag) {
      this.setData({
        display2: 'block'
      })
    } else {
      this.setData({
        display: 'block'
      })
    }

  },
  closeModal() {
    this.setData({
      display: 'none',
      display2: 'none'
    })
  },
  //需填写邀请码
  toyz() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleUserReview/checkInviteCode',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        inviteCode: that.data.inviteCode,
        circleId: that.data.circleId
      },
      success(res) {
        if (res.data.code !== 200) {
          wx.showToast({
            title: "邀请码错误",
            image: '../../image/警告.png'
          })
        } else {
          // 验证码正确
          wx.showToast({
            title: '验证成功',
          })
          setTimeout(
            function() {
              that.setData({
                display2: 'none',
                display: 'block'
              })
            }, 2000)

        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 100)
    var quanId = options.circleId;
    this.setData({
      circleId: quanId
    })
    this.quanview()
    this.members()
  },

  quanview() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/getById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        circleId: that.data.circleId
      },
      success(res) {
        that.setData({
          dataInfo: res.data.result
        })
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: res.data.result.circleName
        })
      }

    })
  },
  //商圈成员列表展示
  members() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/circleUserPageList',
      method: 'GET',
      data: {
        circleId: that.data.circleId,
        pageSize: 10,
        pageNum: 1,
      },
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        that.setData({
          meberdataInfo:res.data.result.list
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