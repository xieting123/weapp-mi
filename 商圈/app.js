//app.js
App({
  data: {
    userInfo: '',
    emojibox: ["[微笑]", "[微微笑]", "[开心]", "[中二笑]", "[眯眼笑]", "[大笑]", "[天使]", "[鬼脸]", "[笑哭]", "[嘻嘻]", "[捂脸]", "[愉快]", "[喜欢]", "[飞吻]", "[奋斗]", "[懵]", "[琢磨]", "[白眼]", "[难过]", "[悲伤]", "[委屈]", "[大哭]", "[流泪]", "[睡觉]", "[害怕]", "[惊慌]", "[惊讶]", "[惊恐]", "[衰]", "[愤怒]", "[拜年]", "[再见]", "[书呆]", "[超酷]", "[嘘]", "[闭嘴]", "[流汗]", "[大汗]", "[擦汗]", "[暗中观察]", "[问号]", "[励志]", "[右手棒]", "[赞]", "[胜利]", "[耶]", "[OK左]", "[OK右]", "[喝倒彩右]", "[喝倒彩左]", "[握手]", "[作揖]", "[拳头右]", "[拳头左]", "[勾引右]", "[勾引左]", "[六加一右]", "[六加一左]", "[加油左]", "[加油右]", "[比心左]", "[比心右]", "[抱歉]", "[安慰]", "[老罗]", "[猴]", "[猫]", "[熊猫]", "[狗]", "[鸡]", "[青蛙]", "[外星人]", "[猪]", "[鱼]", "[中国]", "[香港]", "[美国]", "[日本]", "[韩国]", "[英国]", "[大便]", "[苹果]", "[树叶]", "[王冠]", "[音乐]", "[星星]", "[闪电]", "[金牌]", "[雪花]", "[气球]", "[月亮]", "[百分]", "[云]", "[叹号]", "[足球]", "[篮球]", "[错]", "[缎带]", "[爆炸]", "[红旗]", "[飞快]", "[太阳]", "[水滴]", "[警告]", "[情书]", "[相机]", "[钱]", "[眼睛]", "[中国心]", "[心动]", "[票]", "[啤酒]", "[麻将]", "[扑克]", "[游戏]", "[手机]", "[嘴唇]", "[飞机]", "[火车]", "[玫瑰]", "[花]", "[药丸]", "[骷髅]", "[耸肩男]", "[耸肩女]", "[捂脸男]", "[捂脸女]"],


  },
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


  globalData: {
    myhost: 'http://39.96.161.80:4000',
    // myhost:' http://192.168.101.10:4000',
    imgs: '', //裁剪默认图
    token: wx.getStorageSync('token'),
    imgurl: [],
    x: [],
  }
})