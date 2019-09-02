var app=getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const beautifyTime = function (timestamp) {
  var mistiming = Math.round(new Date() / 1000) - timestamp/1000;
  var postfix = mistiming > 0 ? '前' : '后'
  mistiming = Math.abs(mistiming)
  var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

  for (var i = 0; i < 7; i++) {
    var inm = Math.floor(mistiming / arrn[i])
    if (inm != 0) {
      return inm + arrr[i] + postfix
    }
  }
}
//正则提取 表情包 路径
const getChinese=function(strValue)  {
  var regex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/; //网页链接
  var regex2 = new RegExp(/\[(.+?)\]/g); // [] 中括号
  var arremjio = [];
  var imgemojin = app.data.emojibox; //表情包对应的图片及文字
  var str = strValue
  var str2 = ''
  var httpsinfo = str.match(regex)
  var reginfo = str.match(regex2)
  //如果匹配到http链接 
  if (regex.test(str)) {
    var indexhttp = httpsinfo[0]
    // < img style = "vertical-align: middle;"src = "../../image/icon_lianjiexuanzhong.png" ></img>
    str2 = str.replace(indexhttp, '<div class="exec-https-img" style=" color: rgba(69, 102, 147, 1)!important;"><a id="httpsid" href='+`${indexhttp}`+'style="padding:30rpx;display:inline-block">' + `${indexhttp}` + '</a></div>')
    str2 = '<div>' + `${str2}`+'<div>'
    //且匹配到表情
    if (regex2.test(str2)) {
      for (var i = 0; i < reginfo.length; i++) {
        var indeximg = imgemojin.indexOf(reginfo[i]) + 1
        indeximg = Number(indeximg) < 10 ? '00' + Number(indeximg) : Number(indeximg) < 100 ? '0' + Number(indeximg) : Number(indeximg)
        str2 = str2.replace(reginfo[i], '<img class="emojio-imgs-richtext" src="https://img.ishangmi.cn/group1/emoji/emoji_' + `${(indeximg)}` + '@2x.png" ></img>  ')
      }
    }
    return str2
  } else if (regex2.test(str)) {
    //匹配到表情 没匹配到http...
    for (var i = 0; i < reginfo.length; i++) {
      var indeximg = imgemojin.indexOf(reginfo[i]) + 1
      indeximg = Number(indeximg) < 10 ? '00' + Number(indeximg) : Number(indeximg) < 100 ? '0' + Number(indeximg) : Number(indeximg)
      str = str.replace(reginfo[i], '<img class="emojio-imgs-richtext" src="https://img.ishangmi.cn/group1/emoji/emoji_' + `${(indeximg)}` + '@2x.png" ></img>  ')
    }
    return str
  } else {
    return str
  }
}
const getDateStr = seconds =>{
  var date = new Date(seconds)
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  var currentTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  return currentTime
}
const getQuantime = seconds => {
  var date = new Date(seconds)
  var year = date.getFullYear();
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1;
  var day = date.getDate()  < 10 ? '0' + date.getDate() : date.getDate();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  var currentTime = year + "/" + month + "/" + day + "  " + hour + ":" + minute + ":" + second;
  return currentTime
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const config = (name) => {
  var obj = require('../config')
  if (name) {
    return obj.config()[name];
  } else {
    return obj.config();
  }
}


module.exports = {
  formatTime: formatTime,
  config: config,
  getDateStr: getDateStr,
  getQuantime: getQuantime,
  beautifyTime: beautifyTime,
  getChinese: getChinese
}
