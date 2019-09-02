// pages/inQuan/inQuan.js
var app = getApp()
import {
  getQuantime,
  beautifyTime,
  getChinese
} from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    circleId: '',
    createTime: "",
    dataInfo: '',
    quaninfoData: [],
    pageNum: 1, //动态
    totalpage: null, //合计
    pageNum2: 1,
    totalpage2: null,
    pageNum3: 1,
    totalpage3: null,//优品
    islongomg: '', //是否为长图
    playVideo: false, //视频播放方面的处理
    trendsId: '', //动态id
    zaninfoData: [],
    actionStatus: false,
    showStatus: false,
    playVideoSrc: "",
    topInfo: [], //置顶信息
    currentData: 0,
    articleList: [], //文章列表
    blockId:'',//自定义版块id
    blockrticleList:[],
    fixTop: '', //区域离顶部的高度
    scrollTop: 0, //滑动条离顶部的距离
    goodlist:[],//优品
    storeId:'',//店铺id
  },
//跳转到个人中心
  topersonal(e){
    var id = e.currentTarget.dataset.id
wx.navigateTo({
  url: '../../packageA/pages/personCenter/personCenter?uniqueId=' +`${id}`,
})
  },
  toagentDetial(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../packageA/pages/agentMarketdetial/agentMarketdetial?id=' + `${id}`,
    })
  },
  //获取指定店铺商品销售中分页列表: http://192.168.101.10:4000/goods/product/querySalesByStoreId?storeId=&createTime=&pageSize=&pageNum
  foodList() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/goods/product/querySalesByStoreId',
      data: {
        storeId: that.data.storeId,
        createTime: getQuantime(new Date().getTime()),
        pageNum: that.data.pageNum3,
        pageSize: 10,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        var data = res.data.result.list
        if (data.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (data.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < data.length; i++) {
          data[i].createTime = getQuantime(data[i].createTime)
        }
        that.setData({
          goodlist: that.data.goodlist.concat(res.data.result.list) ,
          totalpage3: res.data.result.pagination.totalPage
        })
      }
    })
  },
  toshoplist(){
wx.navigateTo({
  url: '../../packageA/pages/ShoppingCart/ShoppingCart',
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
          quaninfoData: [],
          pageNum: 1,
        })
        that.choosedynamics()

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
          quaninfoData: [],
          pageNum: 1
        })
        that.choosedynamics()
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
  //获取当前滑块的index  根据index找到对应的blockId
  bindchange: function(e) {
    var arytest = [{ id: 0, blockName: "主页" }, { id: 0, blockName: "文章" }, { id: 0, blockName: "优品" }]
     var ary=arytest.concat(this.data.dataInfo.blockList) 
    for(var i=0;i<ary.length;i++){
     var aryindex= ary[e.detail.current].id
    //  获取滑块改变的id   重点位置
    }
    const that = this;
    var index = e.detail.current
    that.setData({
      currentData: e.detail.current,
      blockId: aryindex
    })
    if (index == 1) {
      that.articleList()
    }else if(index==2){
      that.foodList()
    }else if(index>2){
      // blockArticleList, blockId
      that.blockArticleList()
    }

  },

  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;
    const blockid = e.target.dataset.blockid ? e.target.dataset.blockid:''
    console.log(e.target.dataset.current, e.target.dataset.blockid, 49)
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current,
        blockId: blockid
      })
    }
  },

  onActionHide: function() {
    console.log('ActionSheet关闭了')
  },
  //商圈内文章分页列表(必传circleId 商圈id, 有token 传token): http://192.168.101.10:4000/shangmiArticle/circleInQuery?circleId=&createTime=&pageNum=&pageSize=
  articleList() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/circleInQuery',
      data: {
        circleId: that.data.circleId,
        createTime: getQuantime(new Date().getTime()),
        pageNum: that.data.pageNum2,
        pageSize: 10,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        var data = res.data.result.list
        if (data.length === 0 && that.data.pageNum2 == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (data.length === 0 && that.data.pageNum2 > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < data.length ; i++) {
          data[i].createTime = beautifyTime(data[i].createTime)
        }
        that.setData({
          articleList: that.data.articleList.concat(res.data.result.list),
          totalpage2: res.data.result.pagination.totalPage
        })
      }
    })
  },
 //商圈指定版块文章分页列表(有token 传token, blockId为版块id): http://192.168.101.10:4000/shangmiArticle/circleInBlock?createTime=&pageNum=&pageSize=&blockId
  blockArticleList() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/shangmiArticle/circleInBlock',
      data: {
        // circleId: that.data.circleId,
        blockId: that.data.blockId,
        createTime: getQuantime(new Date().getTime()),
        pageNum: 1,
        pageSize: 30,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      method: "POST",
      success(res) {
        var data = res.data.result.list
        if (data.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (data.length === 0 && that.data.pageNum > 1) {
          wx.showToast({
            title: '到底啦~',
            icon: 'none'
          })
        }
        for (var i = 0; i < data.length ; i++) {
          data[i].createTime = beautifyTime(data[i].createTime)
        }
        that.setData({
          blockrticleList: res.data.result.list,
          // totalpage2: res.data.result.pagination.totalPage
        })
      }
    })
  },
  //跳转到文章详情
  toArticle(e){
    console.log(e.currentTarget.dataset.id,93)
    var id = e.currentTarget.dataset.id
wx.navigateTo({
  url: '../../packageA/pages/PublishingArticledetail/PublishingArticledetail?id=' + `${id}`,
})
  },
  //跳转到动态详情
  linktodetailfn(e){
    console.log(e.currentTarget.dataset.id, 93)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../PublishingDynamicsDetail/PublishingDynamicsDetail?id=' + `${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, 94)
    if (options.currentData) {
      this.setData({
        currentData: options.currentData
      })
    }
    this.setData({
      circleId: options.circleId,
    })
    this.settop()
    this.choosedynamics()

  },
  //商圈内置顶动态列表(必传circleId 为商圈id,  四条): http://192.168.101.10:4000/trendsAd/circleTopTrendsList?circleId=
  settop() {
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trendsAd/circleTopTrendsList',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      data: {
        circleId: that.data.circleId
      },
      success(res) {
        var contents = res.data.result
        for (var i = 0; i < contents.length; i++) {
          contents[i].content = getChinese(contents[i].content)
        }
        that.setData({
          topInfo: res.data.result,
        })
      }

    })
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
      var urlsimg = objimg.map(function(value, index) {
        return value.source
      })
    }
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urlsimg // 需要预览的图片http链接列表
    })

  },
  // 查询商圈内动态详情列表
  choosedynamics() {
    wx.showLoading({
      title: '加载中...'
    })
    var that = this;
    wx.request({
      url: app.globalData.myhost + '/trends/circleInQuery',
      method: 'GET',
      data: {
        circleId: that.data.circleId,
        createTime: getQuantime(new Date().getTime()),
        pageNum: that.data.pageNum,
        pageSize: 10,
      },
      header: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        token: `${JSON.parse(wx.getStorageSync('token'))}`,
      },
      success(res) {
        var arr = res.data.result.list;
        if (arr.length === 0 && that.data.pageNum == 1) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        } else if (arr.length === 0 && that.data.pageNum > 1) {
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

          if (arr[i].trUserForward && arr[i].trUserForward.composeType!==2) {
            arr[i].trUserForward.composeTrends.content = "<span style='color:#456693'> @" + `${arr[i].trUserForward.toUser.nickname}` + ":</span>" + getChinese(arr[i].trUserForward.composeTrends.content)
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
  //邀请按钮分享菜单弹出
  openActionsheet(e) {
    this.setData({
      showStatus: true
    })
  },
  openActionsheet2(e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['动态', '文章', '提问'],
      itemColor: '#4D4D4D',
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex === 0) {
          //动态
          wx.navigateTo({
            url: '../PublishingDynamics/PublishingDynamics?circleId=' + `${that.data.circleId}`
          })
          // that.onShareAppMessage()
        } else if (res.tapIndex === 1) {
          //文章
          wx.navigateTo({
            url: '../../packageA/pages/PublishingArticle/PublishingArticle?circleId=' + `${that.data.circleId}`
          })
        }
      }
    })
  },
  // 链接解析
  linkweb(e) {
    console.log(124, e)
    wx.navigateTo({
      url: '../out/out?url=' + encodeURIComponent(e.currentTarget.dataset.url),
    })
  },

  //进入商圈的信息
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
          dataInfo: res.data.result,
          storeId: res.data.result.storeId

        })
        wx.setNavigationBarTitle({
          title: res.data.result.circleName
        })
      }

    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('prew_video');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  //显示
  onShow: function() {
    this.quanview()
    let self = this;
    wx.createSelectorQuery().select('.static-news').boundingClientRect(function (rect) {
      self.setData({
        fixTop: rect.top,
      })
    }).exec()
  },
  // 高度
  onPageScroll: function (res) {
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
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
    this.onLoad(); //刷新页面
    setTimeout(function() {
      wx.hideNavigationBarLoading(); //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh(); //停止下拉动作
    }, 2000)
  },
  onReachBottom: function() {
    // 主页加载
    if (this.data.currentData == 0) {
      var p = this.data.pageNum;
      var totalpage = this.data.totalpage + 1;

      p++;
      if (p > totalpage) {
        return;
      }
      this.setData({
        pageNum: p

      })
      this.choosedynamics();
      // 文章加载
    } else if (this.data.currentData == 1) {
      var p = this.data.pageNum2;
      var totalpage = this.data.totalpage2 + 1;

      p++;
      if (p > totalpage) {
        return;
      }
      this.setData({
        pageNum2: p

      })
      this.articleList();
    } else if (this.data.currentData == 2) {
      var p = this.data.pageNum3;
      var totalpage = this.data.totalpage3 + 1;

      p++;
      if (p > totalpage) {
        return;
      }
      this.setData({
        pageNum3: p

      })
      this.foodList();
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})