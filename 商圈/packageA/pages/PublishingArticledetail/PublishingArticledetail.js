// packageA/pages/PublishingArticledetail/PublishingArticledetail.js
var WxParse = require('../../../wxParse/wxParse.js'); 
var app = getApp()
import {
  beautifyTime,
  getQuantime,
  getChinese
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zanFlag: '', //本人是否点赞
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    id:'',//文章id
    commentlist:[],//评论列表
    commenTotalCount: "",
    contentinfo:'',//编辑功能需传递的内容
    articleData:'',
    
  },
  routerToeditor(){
wx.showToast({
  title: '前往app修改',
  icon:"none"
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
          articleData: [],
          pageNum: 1,
        })
        that.articleDetail()

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
          articleData: [],
          pageNum: 1
        })
        that.articleDetail()
      }
    })
  },
  //去点赞列表
  toZanlist(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../zanList/zanList?id=' + `${id}`+'&type=2',
    })
  },
  //去打赏列表
  torewardlist(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../rewardList/rewardList?id=' + `${id}` +'&type=2',
    })
  },
  //不能关注自己
  myselffn() {
    wx.showToast({
      title: '不能关注自己哟',
      icon: 'none',
    })
  },
  //跳转到个人中心
  topersonal(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../personCenter/personCenter?uniqueId=' + `${id}`,
    })
  },
  //删除文章(必传token): http://192.168.101.10:4000/shangmiArticle/deleteById?id=
  delarticlefn(e) {
    var id = e.currentTarget.dataset.id
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/deleteById',
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
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })

      }
    })
  },
 // 删除文章评论(必传token 和评论 id): http://192.168.101.10:4000/user/comment/deleteArticleCommentById?id=
  delDynamicsfn(e) {
    var id = e.currentTarget.dataset.id
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/deleteArticleCommentById',
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
        that.commentlistfn()
      }
    })
  },
  //查看文章详情(有token传token, id为文章id): http://192.168.101.10:4000/shangmiArticle/getById?id=
  articleDetail(e) {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/getById',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        id: that.data.id
      },
      success(res) {
        console.log(res,28)
        var articleData = res.data.result
        var content=articleData.content      
        that.setData({
          articleData: articleData,
          contentinfo: JSON.stringify(content),
        })
        WxParse.wxParse('article', 'html', content, that, 0);
      }
    })
  },
//指定文章 评论分页列表(有token传token,  composeId  为文章id): http://192.168.101.10:4000/user/comment/articleCommentQuery?composeId=&createTime=&pageNum=&pageSize=
  commentlistfn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/user/comment/articleCommentQuery',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        composeId: that.data.id,
        createTime: getQuantime(new Date())
      },
      success(res) {
        var commentdata = res.data.result
        var arr = res.data.result.list
        if (arr.length){
          for (var i = 0; i < arr.length; i++) {
            arr[i].createTime = beautifyTime(arr[i].createTime)
            arr[i].content = getChinese(arr[i].content)
          }
        }       
        that.setData({
          commentlist: commentdata.list,
          commenTotalCount: commentdata.pagination.totalCount
        })

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
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 620) //先执行下滑动画，再隐藏模块

  },
  //点赞或取消点赞文章(必传token  和  articleId 文章id): http://192.168.101.10:4000/trendsZan/changeArticleZan?articleId=
  changeZanfn(e) {
    this.setData({
      trendsId: e.currentTarget.dataset.id
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsZan/changeArticleZan',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        articleId: that.data.trendsId
      },
      success(res) {
        var dataInfo = res.data.result
        that.setData({
          dataInfo: dataInfo,
          zanFlag: !that.data.zanFlag,
          zanList: dataInfo.zanList,
          detailinfoData: dataInfo,
        })
      }
    })
  },


  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  //   //**
  //   * WxParse.wxParse(bindName, type, data, target, imagePadding)
  // * 1.bindName绑定的数据名(必填)
  // * 2.type可以为html或者md(必填)
  // * 3.data为传入的具体数据(必填)
  // * 4.target为Page对象, 一般为this(必填)
  // * 5.imagePadding为当图片自适应是左右的单一padding(默认为0, 可选)
  // */
  //   let that = this;
  // WxParse.wxParse('引用的时候的名字,如courseDetail', 'html', '你需要解析的数据,如courseDetailContent', that, 5)
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 15)
    this.setData({
      id: options.id
    })
    this.articleDetail()
    this.commentlistfn()
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