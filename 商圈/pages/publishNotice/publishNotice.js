var app = getApp()
// pages/publishNotice/publishNotice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailPics: [], //上传的结果图片集合
    imgs: [], //上传照片
    uploaderNum: 0,
    showUpload: true,
    notifyContent: '',
    images: '',
    circleId: '',
    imgurl: [], //后台返回的数据
    btncolor: "background: rgba(232, 232, 232, 1)",
    notifyId:'',//通告id
    oimgs:[],
    imgslist:[],//编辑时图片的回显
    nowList:[]//点击删除后会返回一个新数组
  },
  //选取图片
  uploadDetailImage: function(e) { //这里是选取图片的方法
    var that = this;
    var pics = [];
    var detailPics = that.data.detailPics;
    if (detailPics.length >= that.data.count) {
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
          imgs: that.data.imgs.concat(res.tempFilePaths),
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.notifyId){
      this.setData({
        notifyId: options.notifyId,
        notifyContent: options.notifyContent,
        imgurl: JSON.parse(options.imageLists)
      })  
      var arr = this.data.imgslist    
      var y=arr.map(function(value,index){
        return value.thumb
      }
      )
      this.setData({
        imgs: y
      })
     } 
    this.setData({
      circleId: options.circleId,
    })
  },
  //多张图片上传
  uploadimg: function (data) {
    
      var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'imgFiles',//这里根据自己的实际情况改
      header: {
        "Content-Type": "multipart/form-data",
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      formData: {
      },//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        var imgurlData = JSON.parse(resp.data).result
        console.log(imgurlData,100)
        that.setData({
          imgurl: that.data.imgurl.concat(imgurlData)
        })
          // 将选择的图片返回的json格式转化成路径格式
        var arr = that.data.imgurl
        console.log(that.data.imgurl,106)
        var x = arr.map(function (value, index) {
          return value.thumb
        })
        console.log(x, 66)
        that.setData({
          imgs:that.data.imgs.concat(x) 
        })
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张            
        if (i == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数                
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  //展示图片
  showImg: function (e) {
    console.log(e,135)
    var that = this;
    var imgAry = that.data.imgurl
    var a=imgAry.map(function(value,index){
      return value.thumb
    })
    console.log(a)
    wx.previewImage({
      urls: a,
      current: e.currentTarget.dataset.thumb
    })
  },
  // 删除图片
  clearImg: function (e) {
    let newData = [];
    console.log(this.data.imgurl, e.currentTarget.dataset.index)
    this.data.imgurl.map((item, index)=>{
      if (e.currentTarget.dataset.index !==index) {
        newData.push(item)
      }
    })
    console.log(newData, 173)
    //删除成功之后返回的新数组赋值给imgurl
    //此时 删除后 发布或者编辑传给后台的数据则相应的减少对应的图片
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      imgurl:newData,
      showUpload: true
    })
  },
  //监听textarea值
  notifyfn(e) {
    this.setData({
      notifyContent: e.detail.value
    })
    console.log(this.data.notifyContent,91)
    if (this.data.notifyContent!=''){
      this.setData({
        btncolor:'background:linear-gradient(90deg,rgba(255,170,128,1) 0%,rgba(255,76,76,1) 100%);'
      })
    }
  },
  //发布通告
  publishBtn() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/circleNotify/create',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        notifyContent: that.data.notifyContent,
        images: JSON.stringify(that.data.imgurl),
        circleId: that.data.circleId,
      },
      method: 'POST',
      success(res) {
        // wx.showToast({
        //   title: '发布通告成功',
        // })
        //返回上一级关闭当前页面
        wx.navigateBack({
          delta: 1
        })
        that.setData({
          imgs:[]
        })
      }
    })
  },
//编辑通告
editorPublish(){
  var that = this;
  wx.request({
    url: app.globalData.myhost + '/circleNotify/updateById',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: `${JSON.parse(wx.getStorageSync('token'))}`,
    },
    data: {
      notifyContent: that.data.notifyContent,
      images: JSON.stringify(that.data.imgurl),
      notifyId: that.data.notifyId,
    },
    method: 'POST',
    success(res) {
      console.log(res, 107)
      // wx.showToast({
      //   title: '编辑通告成功',
      // })
      //返回上一级关闭当前页面
      wx.navigateBack({
        delta: 2
      })
      that.setData({
        imgs: []
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