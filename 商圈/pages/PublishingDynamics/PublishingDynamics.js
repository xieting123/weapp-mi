// pages/PublishingDynamics/PublishingDynamics.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createTime:'',//发布完成后的最新时间
    circleId: '',
    linkurltitle: '', //上传链接地址解析title内容
    linkimageUrl: '', //解析图片
    linksrc: '', //链接地址
    content: "", //评论框的内容
    "maxlength": -1, // 最大输入长度，设置为 -1 的时候不限制最大长度
    detailPics: [], //上传的结果图片集合
    imgurl: [],
    imgs: [], //上传照片
    uploaderNum: 0,
    address: '',
    isShow: false, //控制emoji表情是否显示
    isLoad: true, //解决初试加载时emoji动画执行一次
    isLoading: true, //是否显示加载数据提示
    disabled: true,
    cfBg: false,
    src: '', //发布视频的路径
    photoShow: false, //发布图片显示隐藏
    videoShow: false,
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😟-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "625", "623", "624", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojiChar2: '',
    emojis: [], //qq、微信原始表情
    playVideo: false, //视频播放方面的处理
    videoimageUrl: '', //视频封面
    videoUrl: '', //视频路径
    locationinfo: "", //地理位置
    supplyInfo: '',
    demandInfo: '',
    videodata: '', //视频
    weblink: '',
    bb: [], //新表情包
    trendsId:'',//动态id
    detailinfoData:'',//编辑回显数据
    dynamicstype:'',//发布动态的类型

  },
  linkto() {
    wx.navigateTo({
      url: '../PublishingDynamicslink/PublishingDynamicslink?circleId=' + `${this.data.circleId}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('prew_video');
  },
  //删除链接
  closelink() {
    this.setData({
      linksrc: '',
      linkInfo: '',
      weblink:''
    })
  },
  //图片菜单控制
  photoShowfn() {
    this.setData({
      photoShow: !this.data.photoShow
    })
  },
  //供需菜单控制
  gongxufn() {
    wx.navigateTo({
      url: '../PublishingDynamics/supplydemand/supplydemand',
    })
  },
  //视频菜单控制
  viedoShowfn() {
    this.setData({
      videoShow: !this.data.videoShow
    })
  },
  /**
   * 删除视频
   */
  bindDeleteVideo: function(e) {
    this.setData({
      videoUrl: '',
      videodata:''
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
          imgurl: that.data.imgurl.concat(imgurlData)
        })
        // 将选择的图片返回的json格式转化成路径格式
        var arr = that.data.imgurl
        var x = arr.map(function(value, index) {
          return value.thumb
        })
        that.setData({
          imgs: that.data.imgs.concat(x)
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
  // 视频上传
  uploadvideo: function() {
    wx.showLoading({
      title: '视频上传中...',
      icon: 'loading',
    })
    var that = this;
    var src = this.data.src;
    wx.uploadFile({
      url: app.globalData.myhost + '/video/uploadVideoInfo', //服务器接口
      method: 'POST', //这行好像可以不用
      filePath: src,
      header: {
        'content-type': 'multipart/form-data',
        token: `${JSON.parse(wx.getStorageSync('token'))}`
      },
      name: 'videoFile', //服务器定义key字段名称
      success: function(res) {
        console.log('视频上传成功')
        wx.hideLoading()
        var videodata = JSON.parse(res.data).result;
        var videoinfo = JSON.parse(res.data).result;
        that.setData({
          videodata: videodata,
          videoimageUrl: videoinfo.imageUrl,
          videoUrl: videoinfo.videoUrl
        })
      },
      fail: function() {
        console.log('接口调用失败')
      }

    })

  },
  //视频上传
  chooseVideo: function() {
    var that = this
    wx.chooseVideo({
      success: function(res) {
        that.setData({
          src: res.tempFilePath,
        })
        that.uploadvideo()
      }
    })
  },

  //文本框内容的获得
  getInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  //展示图片
  showImg: function(e) {
    console.log(e, 135)
    var that = this;
    var imgAry = that.data.imgurl
    var a = imgAry.map(function(value, index) {
      return value.thumb
    })
    console.log(a)
    wx.previewImage({
      urls: a,
      current: e.currentTarget.dataset.thumb
    })
  },
  // 删除图片
  clearImg: function(e) {
    let newData = [];
    console.log(this.data.imgurl, e.currentTarget.dataset.index)
    this.data.imgurl.map((item, index) => {
      if (e.currentTarget.dataset.index !== index) {
        newData.push(item)
      }
    })
    //删除成功之后返回的新数组赋值给imgurl
    //此时 删除后 发布或者编辑传给后台的数据则相应的减少对应的图片
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      imgurl: newData,
    })
  },

  // 打开地图选择位置
  btnClick: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        that.setData({
          locationinfo: JSON.stringify(res),
          latitude2: res.latitude,
          longitude2: res.longitude,
          name: res.name,
          address: res.address
        })

      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  cancleQuan(){
    //返回上一级关闭当前页面
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,301)
    if (options.trendsId) {
      this.setData({
        trendsId: options.trendsId
      })
      this.getData()
      wx.setNavigationBarTitle({
        title: '修改动态'
      })
    }
    if (options.circleId) {
      this.setData({
        circleId: options.circleId,
      })
    }
    if (options.url) {
      var urldata = JSON.parse(options.url)
      this.setData({
        weblink: options.url,
        linkurltitle: urldata.title,
        linksrc: urldata.url,
        linkimageUrl: 'https://' + urldata.imageUrl,
      })
    }

    //表情加载
    var em = {},
      that = this,
      emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function(v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })

    //bb
    //实现方法一：循环赋值
    // var bb={};
    // var bbs=[];
    // var arr1 = new Array(125);
    // for (let i = 0; i < arr1.length; i++) {
    //   arr1[i] = i;  
    // }
    // this.data.emojibox.forEach(function (v, i) {
    //   bb = {
    //     imgindex: arr1[i],
    //     emojistr: v
    //   }
    //   bbs.push(bb)
    // })
    // this.setData({
    //  bb: bbs
    // })
  },

  //创建动态
  createInCircle() {
    var that = this;
    var types = '';
    if (that.data.imgurl.length) {
      types = 1
    } else
    if (that.data.videodata) {
      types = 2
    } else if (that.data.weblink) {
      types = 3
    } else {
      types = 0
    }
    wx.request({
      url: app.globalData.myhost + '/trends/createInCircle', //服务器接口
      data: {
        circleId: that.data.circleId,
        matchmakingFlag: 0,
        outsideCircleFlag: 0,
        content: that.data.content,
        type: types,
        location: that.data.locationinfo,
        supplyInfo: that.data.supplyInfo,
        demandInfo: that.data.demandInfo,
        images: JSON.stringify(that.data.imgurl),
        video: JSON.stringify(that.data.videodata),
        link: that.data.weblink,
        // forward: '',//是否转发
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: 'POST',
      success(res) {
        console.log(res, 98)

        if (res.data.code === 200) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            createTime: res.data.result.createTime
          });
          wx.navigateBack({
            delta: 1
          })
          
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "null"
          })
        }

      }
    })
  },
  //编辑时信息回显 查看动态详情(有token传token): http://192.168.101.10:4000/trends/getById?trendsId=
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
        console.log(detailinfoData,427)
        var imagesInfo = res.data.result.imagesInfo
        var linkInfo = res.data.result.linkInfo
        var videoUrl = res.data.result.videoInfo.videoUrl
        var videoimageUrl = res.data.result.videoInfo.imageUrl 
        if (detailinfoData.type==1){
          that.setData({
            imgurl: imagesInfo,
            photoShow:true
          })
        }
        if (detailinfoData.type == 2){
          that.setData({
            videoUrl: videoUrl,
            videoimageUrl: videoimageUrl,
            videoShow:true,
            videodata:res.data.result.videoInfo
          })
        }
        if (detailinfoData.type == 3){
          console.log(linkInfo)
          that.setData({
            linkInfo: linkInfo,
            weblink:linkInfo,
            linkurltitle: linkInfo.title,
            linksrc: linkInfo.url,
            linkimageUrl: 'https://' + linkInfo.imageUrl,
          })
        }
        console.log(detailinfoData.type,460)
        that.setData({
          supplyInfo: detailinfoData.supplyInfo,
          demandInfo: detailinfoData.demandInfo,
          content: detailinfoData.content,
          dynamicstype: detailinfoData.type,
          locationinfo: JSON.stringify(detailinfoData.locationInfo) ,
          address: detailinfoData.locationInfo ? detailinfoData.locationInfo.address : '' 
        })
      }
    })
  },
  //修改动态(必传token, id, 转发的动态不能修改(即type = 4)): http://192.168.101.10:4000/trends/updateById?id=&content=&type=&images&video=&link&forward=&supplyInfo=&demandInfo=&location=   (商圈内动态额外参数:outsideCircleFlag(是否同步圈外),matchmakingFlag(相亲论坛讨论区)  )
  editordynamis() {
    var that = this;
    //判断type是否为0
    console.log(that.data.weblink, 1,that.data.imgurl,2, that.data.videoimageUrl,475)
    if (!that.data.weblink && !that.data.imgurl.length && !that.data.videodata){
      that.setData({
        dynamicstype: 0
      })
    } else if (that.data.imgurl.length){
      that.setData({
        dynamicstype: 1
      })
    }
    else if (that.data.weblink) {
      that.setData({
        dynamicstype: 3
      })
    }
    else if (that.data.videodata) {
      that.setData({
        dynamicstype: 2
      })
    }
    console.log(that.data.dynamicstype,494)
    wx.request({
      url: app.globalData.myhost + '/trends/updateById', //服务器接口
      data: {
        id: that.data.trendsId,
        matchmakingFlag: 0,
        outsideCircleFlag: 0,
        content: that.data.content,
        type: that.data.dynamicstype,
        location: that.data.locationinfo,
        supplyInfo: that.data.supplyInfo,
        demandInfo: that.data.demandInfo,
        images: JSON.stringify(that.data.imgurl),
        video: JSON.stringify(that.data.videodata),
        link: that.data.weblink,
        // forward: '',//是否转发
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: 'POST',
      success(res) {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          createTime: res.data.result.createTime
        });
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },

  //链接外部view
  linktoweb() {
    wx.navigateTo({
      url: '../out/out?url=' + encodeURIComponent(this.data.linksrc),
    })
  },
  //解决滑动穿透问题
  emojiScroll: function(e) {
    // console.log(e)
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function() {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  //表情选择
  emojiChoose: function(e) {
    //当前输入内容和表情合并
    console.log(e.currentTarget.dataset, 206)
    this.setData({
      content: this.data.content.concat(e.currentTarget.dataset.emoji)
    })
  },
  //bb
  //表情选择
  emojiChoose2: function(e) {
    //当前输入内容和表情合并
    console.log(e.currentTarget.dataset, 442, this.data.content.concat(e.currentTarget.dataset.emojistr))
    content: this.data.content.concat(e.currentTarget.dataset.emojistr)
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function() {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },

  /**
   * 预览视频
   */
  bindPreviewVideo: function(e) {
    console.log(e, 86)
    var videoContext = this.videoContext;
    videoContext.seek(0);
    videoContext.play();
    videoContext.requestFullScreen();
  },
  /**
   * 全屏改变
   */
  bindVideoScreenChange: function(e) {
    var status = e.detail.fullScreen;
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



  //supplyInfo
  changeData: function(supplyInfo) {
    this.setData({
      supplyInfo: supplyInfo
    })
  },
  //demandInfo
  changeData2: function(demandInfo) {
    this.setData({
      demandInfo: demandInfo
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
let pages=getCurrentPages(),
currpage = pages[pages.length-1];
    console.log(currpage,609)
    this.setData({

    })
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