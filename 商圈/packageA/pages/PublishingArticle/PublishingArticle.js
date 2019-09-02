// packageA/pages/PublishingArticle/PublishingArticle.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: [],
    titlecontent:'',
    uploaderNum: 0,
    imgs: [],
    content: '', //文字部分
    contentbox: [] ,//内容盒子
    circleId:''
  },
  //跳转到预览文章
  previewArticle(){
    var contentboxs = this.contentboxtag(this.data.contentbox)
    var contentboxstring = JSON.stringify(this.data.contentbox) 
wx.navigateTo({
  url: '../PublishingArticlepreview/PublishingArticlepreview?contentboxstring=' + `${contentboxstring}` + '&titlecontent=' + `${this.data.titlecontent}` + '&circleId=' + `${this.data.circleId}`,
})
  },
  //返回上一页面
  cancleArticle(){
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })
  },
  //给content增加标签
  contentboxtag(e){
    var arr = e
    var newcontentbox=[]
    arr.forEach((e)=>{
      if (e.thumb!=undefined){
        var e2 = '<img src=' + '"' + `${e.thumb}` + '"'+'></img>'
        newcontentbox.push(e2)
      }else{
       var  e2='<p>'+`${e}`+'</p>'
        newcontentbox.push(e2)
      }
    })
    var stringNewcontentbox = newcontentbox.join('')
    return stringNewcontentbox
  },
  // 跳转到文章详情
  textRouterfn() {
    wx.navigateTo({
      url: 'PublishingArticle/PublishingArticletext',
    })
  },
  //监听标题信息
  titlevaluefn(e){
this.setData({
  titlecontent:e.detail.value
})
  },
  //获取要删除的那一项
  contentboxfn(e) {
    var index = e.currentTarget.dataset.index
    var del = this.data.contentbox.splice(index, 1)
    this.setData({
      contentbox: this.data.contentbox
    })
  },

  //content文字部分
  changeData: function(content) {
    this.setData({
      content: content,
      contentbox: content == '' ? this.data.contentbox : this.data.contentbox.concat(content)
    })
  },

  //商圈内发布文章(必传token): http://192.168.101.10:4000/shangmiArticle/createInCircle?circleId=&outsideCircleFlag=&title=&content=
  publishArticle() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/createInCircle',
      data: {
        circleId: that.data.circleId,
        outsideCircleFlag: false,
        title: that.data.titlecontent,
        content: that.contentboxtag(that.data.contentbox)
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        console.log(res, 57)
      }
    })
  },


  //多图上传图片选取
  //选取图片
  uploadDetailImage: function(e) { //这里是选取图片的方法
    var that = this;
    var pics = [];
    var imgurl = that.data.imgurl;
    if (imgurl.length >= that.data.count) {
      wx.showToast({
        title: '最多选择' + that.data.count + '张！',
      })
      return;
    }
    wx.chooseImage({
      count: 9 - that.data.uploaderNum, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgs = res.tempFilePaths; //选择的图片
        that.setData({
          imgs: res.tempFilePaths,
          uploaderNum: res.tempFilePaths.length,
        })
        for (var i = 0; i < imgs.length; i++) {
          pics.push(imgs[i])
        }
        that.uploadimg({
          url: app.globalData.myhost + '/images/upload', //这里是你图片上传的接口
          path: pics, //这里是选取的图片的地址数组
        })
      },
    })

  },
  //多张图片上传
  uploadimg: function(data) {
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
        that.setData({
          imgurl: imgurlData,
          contentbox: that.data.contentbox.concat(imgurlData)
        })
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
    console.log(options, 180)
    if (options.content){
      var content = decodeURIComponent(options.content)
      this.setData({
        circleId: options.circleId,
        content: JSON.parse(content)
      })
    }
    this.setData({
      circleId: options.circleId
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