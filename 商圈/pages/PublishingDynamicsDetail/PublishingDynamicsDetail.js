// pages/PublishingDynamicsDetail/PublishingDynamicsDetail.js
var app = getApp()
import {
  beautifyTime,
  getQuantime,
  getChinese
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trendsId: '',
    detailinfoData: '',
    canvasdetailinfoData: '', //生成图片的数据 因为不需要转化content内容格式 所以单独区分
    islongomg: '', //是否为长图
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}, //
    zaninfoData: [],
    dataInfo: '',
    zanFlag: '', //本人是否点赞
    zanList: [], //点赞人员列表
    oldcreateTime: '', //毫秒值
    commentlist: "", //评论列表
    commenTotalCount: "",
    visible: false, //判断显示隐藏canvas
  },
  // 链接解析
  linkweb(e) {
    console.log(124, e)
    wx.navigateTo({
      url: '../out/out?url=' + encodeURIComponent(e.currentTarget.dataset.url),
    })
  },
  //事件处理函数
  show: function() {
    this.setData({
      visible: true
    })
  },
  close: function() {
    this.setData({
      visible: false
    })
  },
  followbtnFn(e) {
    console.log(e.currentTarget.dataset.id, 126)
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
        console.log(res, 71)
        that.setData({
          detailinfoData: [],
          pageNum: 1,
        })
        that.getData()

      }
    })
  },
  //取消关注(必传token): http://192.168.101.10:4000/user/accounts/unFollow?uniqueId=
  unfollowbtnFn(e) {
    console.log(e.currentTarget.dataset.id, 145)
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
        that.setData({
          detailinfoData: [],
          pageNum: 1
        })
        that.getData()
      }
    })
  },
  //不能关注自己
  myselffn() {
    wx.showToast({
      title: '不能关注自己哟',
      icon: 'none',
    })
  },
  //设置商圈内动态  置顶或取消置顶(必传token, 必传trendsId  动态id): http://192.168.101.10:4000/trendsAd/setTop?trendsId=
  setTop() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsAd/setTop',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        trendsId: that.data.trendsId
      },
      success(res) {
        console.log(res.data, 51)
        wx.showToast({
          title: res.data.msg,
        })
        console.log(res, 51)
        // var zaninfoData = res.data.result.list
        // that.setData({
        //   zaninfoData: zaninfoData
        // })
      }
    })
  },

  //点击预览图片
  topic_preview(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var url = e.currentTarget.dataset.url;
    var previewImgArr = [];
    //通过循环在数据链里面找到和这个id相同的这一组数据，然后再取出这一组数据当中的图片
    var data = type !== 4 ? that.data.detailinfoData.imagesInfo : that.data.detailinfoData.trUserForward.composeTrends.imagesInfo;
    var a = data.map(function(value, index) {
      return value.source
    })
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: a // 需要预览的图片http链接列表
    })
  },
  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../packageA/pages/personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },
  //查看动态详情(有token传token): http://192.168.101.10:4000/trends/getById?trendsId=
  getData() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trends/getById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        trendsId: that.data.trendsId
      },
      success(res) {
        var detailinfoData = res.data.result
        var canvasdetailinfoData = JSON.parse(JSON.stringify(res.data.result))
        console.log(canvasdetailinfoData, 74)
        var imagesInfo = res.data.result.imagesInfo ? res.data.result.imagesInfo : ''
        var oldcreateTime = res.data.result.createTime
        res.data.result.createTime = beautifyTime(res.data.result.createTime)
        detailinfoData.content = getChinese(detailinfoData.content)
        console.log(detailinfoData.trUserForward, 102)
        if (detailinfoData.trUserForward && detailinfoData.trUserForward.composeType !== 2) {
          detailinfoData.trUserForward.composeTrends.content = "<span style='color:#456693'> @" + `${detailinfoData.trUserForward.toUser.nickname}` + ":</span>" + getChinese(detailinfoData.trUserForward.composeTrends.content)
        }
        if (imagesInfo.length) {
          for (var i = 0; i < imagesInfo.length; i++) {
            var des = imagesInfo[i].height / imagesInfo[i].width > 3 ? '长图' : imagesInfo[i].suffix == "gif" ? '动图' : ''
            imagesInfo[i].islongomg = des

          }
        }
        that.setData({
          detailinfoData: detailinfoData,
          zanList: detailinfoData.zanList,
          zanFlag: detailinfoData.zanFlag,
          oldcreateTime: getQuantime(oldcreateTime),
          canvasdetailinfoData: canvasdetailinfoData
        })
      }
    })
  },
  //去点赞列表
  toZanlist(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../packageA/pages/zanList/zanList?id=' + `${id}` + '&type=1',
    })
  },
  //去打赏列表
  torewardlist(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../packageA/pages/rewardList/rewardList?id=' + `${id}` + '&type=1',
    })
  },

  // 动态点赞或取消(必传token): http://192.168.101.10:4000/trendsZan/changeTrendsZan?trendsId=
  changeZanfn(e) {
    this.setData({
      trendsId: e.currentTarget.dataset.id
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsZan/changeTrendsZan',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        trendsId: that.data.trendsId
      },
      success(res) {
        var dataInfo = res.data.result
        that.setData({
          dataInfo: dataInfo,
          zanFlag: !that.data.zanFlag,
          zanList: dataInfo.zanList,
          detailinfoData: dataInfo
        })
      }
    })
  },

  // 指定动态 评论分页列表(有token传token, compostId  为动态id): http://192.168.101.10:4000/user/comment/trendsCommentQuery?composeId=&createTime=
  commentlistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/trendsCommentQuery',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        composeId: that.data.trendsId,
        createTime: getQuantime(new Date())
      },
      success(res) {
        var commentdata = res.data.result
        var arr = res.data.result.list
        for (var i = 0; i < arr.length; i++) {
          arr[i].createTime = beautifyTime(arr[i].createTime)
          arr[i].content = getChinese(arr[i].content)
        }
        that.setData({
          commentlist: commentdata.list,
          commenTotalCount: commentdata.pagination.totalCount
        })

      }
    })


  },


  //删除评论
  // 删除动态评论(必传token): http://192.168.101.10:4000/user/comment/deleteTrendsCommentById?id=
  delDynamicsfn(e) {
    var id = e.currentTarget.dataset.id
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/deleteTrendsCommentById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        id: id,
      },
      success(res) {
        console.log(res, 213)
      }
    })
  },
  //查看图片
  previewImage(e) {
    var current = e.currentTarget.dataset.source
    var url = []
    url.push(current)
    wx.previewImage({
      current: current,
      urls: url
    })
  },

  // 显示遮罩层
  showModal: function() {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 620) //先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function() {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 288)
    //获取用户设备信息，屏幕宽度
    var that = this;
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth
        })
        console.log(that.data.screenWidth)
      }
    })
    this.setData({
      trendsId: options.id
    })
    this.getData()
    this.commentlistfn()
    // this.zanfn()
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

  },
  /**
   * 预览视频
   */
  bindPlayVideo: function(e) {
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
  bindVideoScreenChange: function(e) {
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
  onShareAppMessage: function(res) {
    return {
      title: '我分享了动态,你也来看吧',
      path: 'pages/PublishingDynamicsDetail/PublishingDynamicsDetail?id=' + this.data.trendsId
    }
  }
})