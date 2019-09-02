// pages/personCenter/personCenter.js
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
    carouselList: [{
        "id": "101",
        "imgUrl": "https://hbimg.huabanimg.com/fcefb101236c24c1289d026b1ce4174738fb82cf14b07-Icn5Wr_fw658",
        "title": "",
        "url": "https://www.baidu.com/"
      },
    ],
    fixTop: '', //区域离顶部的高度
    scrollTop: 0, //滑动条离顶部的距离
    currentData: 0,
    pageNum: 1, //动态
    totalpage: null,
    videopageNum: 1, //视频
    videototalpage: null,
    articlepageNum: 1, //文章
    articletotalpage: null,
    quanpageNum: 1, //商圈
    quantotalpage: null,
    quaninfoData: [], //动态列表
    videolist: [], //视频列表
    articlelist: [], //文章列表
    quanlist: [], //商圈列表
    profileinfo: '', //个人信息
    uniqueId: '', //指定任务id
    toFriendlist:[],//关注列表
    finsList:[],//粉丝列表
  },
//跳转到我的关注和我的粉丝
  personlist(e){
console.log(e,50)
    var type = e.currentTarget.dataset.type
wx.navigateTo({
  url: '../friendlist/friendlist?id=' + `${this.data.uniqueId}`+'&type='+`${type}`,
})
  },


  //获取当前滑块的index  
  bindchange: function(e) {
    const that = this;
    var index = e.detail.current
    that.setData({
      currentData: e.detail.current,
    })
    if (index==1){
    this.choosedynamics()
    }else if(index==2){
    this.videolistfn()
    }else if(index==3){
    this.myArticlelist()
    }else if(index==4){
    this.myquanlistfn()
    }

  },

  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
      })
    }
    console.log(e.target.dataset.current, 67)
  },
  //点击预览图片
  topic_preview(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var dynimacId = e.currentTarget.dataset.dynimacid;
    var url = e.currentTarget.dataset.url;
    var type = e.currentTarget.dataset.type;
    var previewImgArr = [];
    var previewImgArr2 = [];
    var imgsObj = [];
    //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
    // var datalist = type !== 4 ? that.data.detailinfoData : that.data.detailinfoData.trUserForward.composeTrends;
    var datalist = that.data.quaninfoData;
    for (var i = 0; i < datalist.length; i++) {
      if (datalist[i].id == dynimacId) {
        if (type != 4) {
          previewImgArr.push(datalist[i].imagesInfo)
        } else {
          previewImgArr.push(datalist[i].trUserForward.composeTrends.imagesInfo)
        }

      }
    }

    for (var i in previewImgArr) {
      var objimg = previewImgArr[i]
      var urlsimg = objimg.map(function (value, index) {
        return value.source
      })
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urlsimg // 需要预览的图片http链接列表
    })

  },
  onLoad: function(options) {
    console.log(options, 90)
    this.setData({
      uniqueId: options.uniqueId
    })
    this.profilefn()
    this.toFriendslistfn()
    this.fanslistfn()
  },

  toPersonfn(e) {
    console.log(e.currentTarget.dataset.id, 58)
    this.setData({
      uniqueId: e.currentTarget.dataset.id
    })
    wx.navigateTo({
      url: './personCenter?uniqueId=' + `${this.data.uniqueId}`,
    })
  },
  //跳转到文章详情
  toArticle(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../PublishingArticledetail/PublishingArticledetail?id=' + `${id}`,
    })
  },
  //跳转到动态详情
  linktodetailfn(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../../pages/PublishingDynamicsDetail/PublishingDynamicsDetail?id=' + `${id}`,
    })
  },
  //指定用户详情(有token传token): http://192.168.101.10:4000/user/accounts/newProfile?uniqueId=
  profilefn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/newProfile',
      method: 'GET',
      data: {
        // uniqueId: that.data.uniqueId,
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var datainfo = res.data.result
        that.setData({
          profileinfo: datainfo
        })

      }
    })
  },
  //指定用户动态分页列表(有token传token, 小程序增加一个参数(smallFlag = true)): http://192.168.101.10:4000/trends/toUserTrendsQuery?createTime=&pageSize=&pageNum=&uniqueId=
  // 查询商圈内动态详情列表
  choosedynamics() {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trends/toUserTrendsQuery',
      method: 'GET',
      data: {
        createTime: getQuantime(new Date().getTime()),
        pageNum: that.data.pageNum,
        pageSize: 10,
        smallFlag: true,
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var arr = res.data.result.list;
        if (arr.length === 0 && that.data.pageNum==1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (arr.length === 0 && that.data.pageNum > 1){
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        var imagesInfo = [];
        var imageUrlobj = []
        for (var i = 0; i < arr.length; i++) {
          imagesInfo = arr[i].imagesInfo ? arr[i].imagesInfo : '';
          arr[i].createTime = beautifyTime(arr[i].createTime);
          arr[i].content = getChinese(arr[i].content)
          //转发的动态里的内容
          if (arr[i].trUserForward) {
            if (arr[i].trUserForward.composeType === 1) {
              arr[i].trUserForward.composeTrends.content = "<span style='color:#456693'> @" + `${arr[i].trUserForward.toUser.nickname}` + ":</span>" + getChinese(arr[i].trUserForward.composeTrends.content)
            }
          }
          // imageUrlobj.push(arr[i].linkInfo);
          if (imagesInfo.length) {
            for (var z = 0; z < imagesInfo.length; z++) {
              var islongomg = imagesInfo[z].height / imagesInfo[z].width > 3 ? '长图' : imagesInfo[z].suffix == "gif" ? '动图' : ''
              imagesInfo[z].islongomg = islongomg
            }
          }

        }
        that.setData({
          quaninfoData: (that.data.quaninfoData).concat(res.data.result.list),
          totalpage: res.data.result.pagination.totalPage,
          islongomg: islongomg,
        })
        wx.hideLoading()
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  //指定用户视频分页列表(有token传token, 小程序增加一个参数(smallFlag = true)): http://192.168.101.10:4000/trends/toUserVideoQuery?createTime=&pageSize=&pageNum=&uniqueId=
  videolistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trends/toUserVideoQuery',
      method: 'GET',
      data: {
        createTime: getQuantime(new Date().getTime()),
        videopageNum: that.data.videopageNum,
        pageSize: 10,
        smallFlag: true,
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var arr = res.data.result.list;
        if (arr.length === 0 && that.data.videopageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (arr.length === 0 && that.data.videopageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        that.setData({
          videolist: (that.data.videolist).concat(res.data.result.list) ,
          videototalpage: res.data.result.pagination.totalPage,
        })

      }
    })
  },
  //指定用户商圈分页列表(有token 传token): http://192.168.101.10:4000/businessCircle/toUserPageList?createTime=&pageSize=&pageNum=&uniqueId=
  myquanlistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/businessCircle/toUserPageList',
      method: 'GET',
      data: {
        createTime: getQuantime(new Date().getTime()),
        quanpageNum: that.data.quanpageNum,
        pageSize: 10,
        smallFlag: true,
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var arr = res.data.result.list
        if (arr.length === 0 && that.data.quanpageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (arr.length === 0 && that.data.quanpageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        that.setData({
          quanlist: (that.data.quanlist).concat(res.data.result.list),
          quantotalpage: res.data.result.pagination.totalPage,
        })

      }
    })
  },
  //指定用户文章分页列表(有token 传token): http://192.168.101.10:4000/shangmiArticle/toUserArticleQuery?createTime=&pageSize=&pageNum=&uniqueId=
  myArticlelist() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/toUserArticleQuery',
      method: 'GET',
      data: {
        createTime: getQuantime(new Date().getTime()),
        articlepageNum: that.data.articlepageNum,
        pageSize: 10,
        smallFlag: true,
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var data = res.data.result.list
        if (data.length === 0 && that.data.articlepageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (data.length === 0 && that.data.articlepageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < data.length; i++) {
          data[i].createTime = beautifyTime(data[i].createTime)
        }
        that.setData({
          articlelist: (that.data.articlelist).concat(res.data.result.list),
          articletotalpage: res.data.result.pagination.totalPage,
        })

      }
    })
  },

  //点击了轮播图
  chomeCarouselClick: function(event) {
    var urlStr = event.currentTarget.dataset.url;
    console.log("点击了轮播图：" + urlStr);
    // wx.navigateTo({
    //   url: 'test?id=1'
    // })
  },


  // 参数介绍  之前的userId , friendId 去掉了,  现在返回:   friendUniqueId  为跟friendId对应的
 // 指定用户关注列表(有token传token): http://192.168.101.10:4000/user/accounts/getToFriendsList?uniqueId=
  toFriendslistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/getToFriendsList',
      method: 'GET',
      data: {
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res.data.result, 327)
        var datainfo = res.data.result.list
        that.setData({
          toFriendlist: datainfo
        })

      }
    })
  },
 // 指定用户粉丝列表(有token传token): http://192.168.101.10:4000/user/accounts/getToFansList?uniqueId=
  fanslistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/accounts/getToFansList',
      method: 'GET',
      data: {
        uniqueId: that.data.uniqueId
      },
      header: {
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        console.log(res.data.result, 349)
        var datainfo = res.data.result.list
        that.setData({
          finsList: datainfo
        })

      }
    })
  },

  /**
 * 预览视频
 */
  bindPlayVideo: function (e) {
    console.log(e, 185)
    var videoSrc = e.currentTarget.dataset.videoSrc;
    var videoContext = this.videoContext;
    this.setData({
      playVideoSrc: videoSrc
    })
    videoContext.seek(0);
    videoContext.play();
    videoContext.requestFullScreen();
  },
  /**
   * 全屏改变
   */
  bindVideoScreenChange: function (e) {
    var status = e.detail.fullScreen;
    console.log(status)
    var play = {
      playVideo: false
    }
    if (status) {
      play.playVideo = true;
    } else {
      this.videoContext.pause();
    }
    this.setData(play);
  },
  //关注(必传token): http://192.168.101.10:4000/user/accounts/follow?uniqueId=
  //type=0未关注 2 已关注 4相互关注
  followbtnFn(e) {
    console.log(e.currentTarget.dataset.id,391)
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
        that.toFriendslistfn()
        that.fanslistfn()
        if (e.currentTarget.dataset.id == that.data.uniqueId) {
          that.profilefn()
        }
      }
    })
  },

  //取消关注(必传token): http://192.168.101.10:4000/user/accounts/unFollow?uniqueId=
  unfollowbtnFn(e) {
    console.log(e.currentTarget.dataset.id, 391)
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
        that.toFriendslistfn()
        that.fanslistfn()
        if (e.currentTarget.dataset.id == that.data.uniqueId){
          that.profilefn()
        }
      }
    })
  },
  liuyanBtn(){
wx.showToast({
  title: '前往app留言',
  icon:'none'
})
  },
  //不能关注自己
  myselffn() {
    wx.showToast({
      title: '不能关注自己',
      icon: 'none',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('prew_video');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    wx.createSelectorQuery().select('.static-news').boundingClientRect(function(rect) {
      console.log(rect, 270)
      self.setData({
        fixTop: rect.top,
      })
    }).exec()

  },
  // 高度
  onPageScroll: function(res) {
    let self = this;
    let top = res.scrollTop;
    self.setData({
      scrollTop: top
    });
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
    // 动态加载
    if (this.data.currentData == 1) {
      var p = this.data.pageNum;
      var totalpage = this.data.totalpage + 1;

      p++;
      if (p > totalpage || p == totalpage) {
        return;
      }
      this.setData({
        pageNum: p

      })
      this.choosedynamics();
      // 视频加载
    } else if (this.data.currentData == 2) {
      var p = this.data.videopageNum;
      var totalpage = this.data.videototalpage + 1;

      p++;
      console.log(p, totalpage, 539)
      if (p > totalpage || p == totalpage) {
        console.log(p, totalpage,540)
        return;
      }
      this.setData({

        videopageNum: p

      })
      this.videolistfn();
      // 文章加载
    } else if (this.data.currentData == 3) {
      var p = this.data.articlepageNum;
      var totalpage = this.data.articletotalpage + 1;

      p++;
      if (p > totalpage || p == totalpage) {
        return;
      }
      this.setData({
        articlepageNum: p

      })
      this.myArticlelist();
      // 文章加载
    } else if (this.data.currentData == 4) {
      var p = this.data.quanpageNum;
      var totalpage = this.data.quantotalpage + 1;

      p++;
      if (p > totalpage || p == totalpage) {
        return;
      }
      this.setData({
        quanpageNum: p

      })
      this.myquanlistfn();
      // 文章加载
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})