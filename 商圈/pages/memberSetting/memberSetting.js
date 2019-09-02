var app = getApp()
Page({
  data: {
    circleId: '', //商圈id
    meberdataInfo: '', //获取成员信息
    uniqueId: '', //人员id
    adminflag: '', //是否设置成为管理员
    blackFlag: '',
    createFlag: '',
    adminFlag: '', //黑名单 入圈申请列表展示
    createFlagreally: '', //是否为商圈创建人
    num: '', //审核数
    user: {
      avatar: '',
      company: '',
      position: '',
      verifyStatus: '',
      name: '',
      nickname: '',
    },
  },

  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../packageA/pages/personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },
  openActionsheet(e) {
    console.log(e, 14)
    //adminflag createFlag是获取点击的人对应的信息 判断其身份 是否为创建者 管理员 或者 普通人
    this.setData({
      uniqueId: e.currentTarget.id,
      adminflag: e.currentTarget.dataset.item.adminFlag,
      blackFlag: e.currentTarget.dataset.item.blackFlag,
      user: e.currentTarget.dataset.item.user,
      createFlag: e.currentTarget.dataset.item.createFlag,
    })
    var that = this;
    //进来时判断圈主身份
    if (that.data.createFlagreally==='true') {
      console.log('圈主')
      //圈主就是创建者
      if (that.data.createFlag) {
        //如果是创建者本身
        wx.showActionSheet({
          itemList: ['设置标签'],
          itemColor: '#4D4D4D',
          success(res) {
            wx.navigateTo({
              url: '../Labelsettings/Labelsettings?circleId=' + `${that.data.circleId}` + '&uniqueId=' + `${that.data.uniqueId}` + '&avatar=' + `${that.data.user.avatar}` + '&company=' + `${that.data.user.company ? that.data.user.company : ''}` + '&position=' + `${that.data.user.position ? that.data.user.position : ''}` + '&verifyStatus=' + `${that.data.user.verifyStatus}` + '&name=' + `${that.data.user.name}` + '&nickname=' + `${that.data.user.nickname}`,
            })
          }
        })
      } else if (that.data.adminflag && that.data.createFlag === false) {
        //如果是管理员且不是创建者
        wx.showActionSheet({
          itemList: ['设置标签', '取消管理员', '转让商圈'],
          itemColor: '#4D4D4D',
          success(res) {
            if (res.tapIndex === 0) {
              wx.navigateTo({
                url: '../Labelsettings/Labelsettings?circleId=' + `${that.data.circleId}` + '&uniqueId=' + `${that.data.uniqueId}` + '&avatar=' + `${that.data.user.avatar}` + '&company=' + `${that.data.user.company ? that.data.user.company : ''}` + '&position=' + `${that.data.user.position ? that.data.user.position : ''}` + '&verifyStatus=' + `${that.data.user.verifyStatus}` + '&name=' + `${that.data.user.name}` + '&nickname=' + `${that.data.user.nickname}`,
              })
            } else if (res.tapIndex === 1) {
              //设为管理员

              wx.request({
                url: app.globalData.myhost + '/businessCircle/setAsAdmin',
                method: "POST",
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  token: `${JSON.parse(wx.getStorageSync('token'))}`,
                },
                data: {
                  circleId: that.data.circleId,
                  uniqueId: that.data.uniqueId,
                  adminFlag: false
                },
                success(res) {
                  that.members()
                },
                fail() {

                }
              })

            } else if (res.tapIndex === 2) {
              //商圈转让
              wx.showModal({
                title: '提示',
                content: '转让后你将不在拥有此商圈，确定要转让商圈给该成员吗？',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.request({
                      url: app.globalData.myhost + '/businessCircle/setAsManager',
                      method: "POST",
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        token: `${JSON.parse(wx.getStorageSync('token'))}`,
                      },
                      data: {
                        circleId: that.data.circleId,
                        uniqueId: that.data.uniqueId,
                      },
                      success(res) {
                        console.log(res, 23)
                        wx.showToast({
                          title: '转让成功',
                        })
                      },
                      fail() {

                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })

            }

          }
        })
      } else {
        //商圈创建者看到的 普通人
        wx.showActionSheet({
          itemList: ['设置标签', '设为管理员', '移除成员', '加入黑名单'],
          itemColor: '#4D4D4D',
          success(res) {
            if (res.tapIndex === 0) {
              wx.navigateTo({
                url: '../Labelsettings/Labelsettings?circleId=' + `${that.data.circleId}` + '&uniqueId=' + `${that.data.uniqueId}` + '&avatar=' + `${that.data.user.avatar}` + '&company=' + `${that.data.user.company ? that.data.user.company : ''}` + '&position=' + `${that.data.user.position ? that.data.user.position : ''}` + '&verifyStatus=' + `${that.data.user.verifyStatus}` + '&name=' + `${that.data.user.name}` + '&nickname=' + `${that.data.user.nickname}`,
              })
            } else if (res.tapIndex === 1) {
              wx.request({
                url: app.globalData.myhost + '/businessCircle/setAsAdmin',
                method: "POST",
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  token: `${JSON.parse(wx.getStorageSync('token'))}`,
                },
                data: {
                  circleId: that.data.circleId,
                  uniqueId: that.data.uniqueId,
                  adminFlag: !that.data.adminFlag
                },
                success(res) {
                  console.log(res, 23)
                  that.members()
                },
                fail() {

                }
              })
            } else if (res.tapIndex === 2) {
              wx.showModal({
                title: '提示',
                content: '确定要移除该成员吗？',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.request({
                      url: app.globalData.myhost + '/businessCircle/removeCircleUser',
                      method: "POST",
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        token: `${JSON.parse(wx.getStorageSync('token'))}`,
                      },
                      data: {
                        circleId: that.data.circleId,
                        uniqueId: that.data.uniqueId,
                      },
                      success(res) {
                        console.log(res, 23)
                        that.members()
                        wx.showToast({
                          title: '移除成功',
                        })

                      },
                      fail() {

                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })

            } else if (res.tapIndex === 3) {
              wx.request({
                url: app.globalData.myhost + '/businessCircle/changeCircleBlackList',
                method: "POST",
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  token: `${JSON.parse(wx.getStorageSync('token'))}`,
                },
                data: {
                  circleId: that.data.circleId,
                  uniqueId: that.data.uniqueId,
                  blackFlag: true
                },
                success(res) {
                  console.log(res, 23)
                  that.members()
                },
                fail() {

                }
              })
            }
          }
        })
      }
    } else {
      //如果圈主是管理员
      if (that.data.adminflag) {
        //创建者 或 创建者 都只有设置标签的菜单栏
        wx.showActionSheet({
          itemList: ['设置标签'],
          itemColor: '#4D4D4D',
          success(res) {
            wx.navigateTo({
              url: '../Labelsettings/Labelsettings?circleId=' + `${that.data.circleId}` + '&uniqueId=' + `${that.data.uniqueId}` + '&avatar=' + `${that.data.user.avatar}` + '&company=' + `${that.data.user.company ? that.data.user.company : ''}` + '&position=' + `${that.data.user.position ? that.data.user.position : ''}` + '&verifyStatus=' + `${that.data.user.verifyStatus}` + '&name=' + `${that.data.user.name}` + '&nickname=' + `${that.data.user.nickname}`,
            })
          }
        })
      } else {
        //普通人
        {
          //商圈创建者看到的 普通人
          wx.showActionSheet({
            itemList: ['设置标签', '移除成员', '加入黑名单'],
            itemColor: '#4D4D4D',
            success(res) {
              if (res.tapIndex === 0) {
                wx.navigateTo({
                  url: '../Labelsettings/Labelsettings?circleId=' + `${that.data.circleId}` + '&uniqueId=' + `${that.data.uniqueId}` + '&avatar=' + `${that.data.user.avatar}` + '&company=' + `${that.data.user.company ? that.data.user.company : ''}` + '&position=' + `${that.data.user.position ? that.data.user.position : ''}` + '&verifyStatus=' + `${that.data.user.verifyStatus}` + '&name=' + `${that.data.user.name}` + '&nickname=' + `${that.data.user.nickname}`,
                })
              } else if (res.tapIndex === 1) {
                wx.showModal({
                  title: '提示',
                  content: '确定要移除该成员吗？',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      wx.request({
                        url: app.globalData.myhost + '/businessCircle/removeCircleUser',
                        method: "POST",
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          token: `${JSON.parse(wx.getStorageSync('token'))}`,
                        },
                        data: {
                          circleId: that.data.circleId,
                          uniqueId: that.data.uniqueId,
                        },
                        success(res) {
                          console.log(res, 23)
                          that.members()
                          wx.showToast({
                            title: '移除成功',
                          })

                        },
                        fail() {

                        }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              } else if (res.tapIndex === 2) {
                wx.request({
                  url: app.globalData.myhost + '/businessCircle/changeCircleBlackList',
                  method: "POST",
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: `${JSON.parse(wx.getStorageSync('token'))}`,
                  },
                  data: {
                    circleId: that.data.circleId,
                    uniqueId: that.data.uniqueId,
                    blackFlag: true
                  },
                  success(res) {
                    console.log(res, 23)
                    that.members()
                  },
                  fail() {

                  }
                })
              }
            }
          })
        }
      }

    };


  },
  onLoad(e) {
console.log(e,298)
    
    this.setData({
      circleId: e.circleId,
      adminFlagreally: e.adminFlag,
      createFlagreally:e.createFlag,
    })
  },
  onShow() {
    this.SHMembers()
    this.members()
  },
  //请求成员列表
  //商圈成员列表展示
  members() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/circleUserPageList',
      method: 'POST',
      data: {
        circleId: that.data.circleId,
        pageSize: 10,
        pageNum: 1,
        blackFlag: false
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        that.setData({
          meberdataInfo: res.data.result.list
        })
      }
    })
  },
  //入圈审核数
  SHMembers() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleUserReview/getEnterReviewCount',
      method: 'POST',
      data: {
        circleId: that.data.circleId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        that.setData({
          num: res.data.result
        })
      }
    })
  },
})