// packageA/pages/PublishingArticlepreview/PublishingArticlepreview.js
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    circleId: '',
    titlecontent: '',
    content: '',
    title: '',
    contentinfo: [], //传参用的
    blockList:[],
    index: 0, //默认下标
    mingcheng: [], //选择器中的选项  
    blockFlag:'',//是否是文章 false
    blockId:'',//版块id
  },
  //返回上一页面
  cancleArticle() {
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.detail.value
    var mingchenglist = this.data.mingcheng
    this.setData({
      index: index
    })
    console.log(this.data.mingcheng,25)
    //点击确认按钮发送给后台
    var id = mingchenglist[index].id
    console.log(id,30)
    if(id===0){
      console.log(id, 30)
      this.setData({
        blockFlag: false,//是否是文章 false
        blockId: '',//版块id
      })
      this.publishArticle()
    }else{
      this.setData({
        blockFlag: true,//是否是自定义版块
        blockId: id,//版块id
      })
      this.publishblockArticle()
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var contentinfo = JSON.parse(options.contentboxstring)
    this.setData({
      content: this.contentboxtag(contentinfo),
      title: options.titlecontent,
      contentinfo: contentinfo,
      circleId: options.circleId
    })
    this.quanview()
    WxParse.wxParse('article', 'html', this.data.content, this, 0);
  },

  //商圈的信息
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
        var ary = [{ id: 0, name: "文章" }]
        var block = res.data.result.blockList
        for(let i=0;i<block.length;i++){
          var id = block[i].id
          var name = block[i].blockName
          ary.push({ id, name}) 
        }
        that.setData({
          dataInfo: res.data.result,
          blockList: res.data.result.blockList,
          mingcheng:ary
        })
        console.log(that.data.mingcheng,80)
      }

    })
  },

  //给content增加标签
  contentboxtag(e) {
    var arr = e
    var newcontentbox = []
    arr.forEach((e) => {
      if (e.thumb != undefined) {
        var e2 = '<img src=' + '"' + `${e.thumb}` + '"' + '></img>'
        newcontentbox.push(e2)
      } else {
        var e2 = '<p>' + `${e}` + '</p>'
        newcontentbox.push(e2)
      }
    })
    var stringNewcontentbox = newcontentbox.join('')
    return stringNewcontentbox
  },
  //商圈内发布文章(必传token): http://192.168.101.10:4000/shangmiArticle/createInCircle?circleId=&outsideCircleFlag=&title=&content=
  publishArticle() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/createInCircle',
      data: {
        circleId: that.data.circleId,
        outsideCircleFlag: false,
        blockFlag: false,//是否为版块文章
        blockId: that.data.blockId,//版块id
        title: that.data.title,
        content: that.contentboxtag(that.data.contentinfo)
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        console.log(res, 57)
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '../../../pages/inQuan/inQuan?circleId=' + `${that.data.circleId}` + '&currentData=1',
          })
        }

      }
    })
  },
  //http://192.168.101.10:4000/shangmiArticle/createInBlock?blockId=&outsideCircleFlag=&title=&content=
  publishblockArticle() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/createInBlock',
      data: {
        circleId: that.data.circleId,
        outsideCircleFlag: false,
        blockFlag: true,//是否为版块文章
        blockId: that.data.blockId,//版块id
        title: that.data.title,
        content: that.contentboxtag(that.data.contentinfo)
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        console.log(res, 57)
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '../../../pages/inQuan/inQuan?circleId=' + `${that.data.circleId}` + '&currentData=1',
          })
        }

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