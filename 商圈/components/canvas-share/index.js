import {
  getChinese
} from '../../utils/util.js'

function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}

function createRpx2px() {
  const {
    windowWidth
  } = wx.getSystemInfoSync()
  return function(rpx) {
    return windowWidth / 750 * rpx
  }
}

const rpx2px = createRpx2px()

function canvasToTempFilePath(option, context) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      ...option,
      success: resolve,
      fail: reject,
    }, context)
  })
}

function saveImageToPhotosAlbum(option) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      ...option,
      success: resolve,
      fail: reject,
    })
  })
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(visible) {
        if (visible && !this.beginDraw) {
          this.draw()
          this.beginDraw = true
        }
      }
    },
    canvasdetailinfoData: {
      type: Object,
      value: false
    }
  },

  data: {
    beginDraw: false,
    isDraw: false,
    canvasWidth: 843,
    canvasHeight: 1500,
    imageFile: '',
    responsiveScale: 1,
  },

  lifetimes: {
    ready() {
      const designWidth = 375
      const designHeight = 603 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度

      // 以iphone6为设计稿，计算相应的缩放比例
      const {
        windowWidth,
        windowHeight
      } = wx.getSystemInfoSync()
      const responsiveScale =
        windowHeight / ((windowWidth / designWidth) * designHeight)
      if (responsiveScale < 1) {
        this.setData({
          responsiveScale,
        })
      }
    },
  },

  methods: {
    handleClose() {
      this.triggerEvent('close')
    },
    handleSave() {
      const {
        imageFile
      } = this.data

      if (imageFile) {
        saveImageToPhotosAlbum({
          filePath: imageFile,
        }).then(() => {
          wx.showToast({
            icon: 'none',
            title: '分享图片已保存至相册',
            duration: 2000,
          })
        })
      }
    },
//canvas单行文本自动省略
    fittingString(_ctx, str, maxWidth) {
      let strWidth = _ctx.measureText(str).width;
      const ellipsis = '…';
      const ellipsisWidth = _ctx.measureText(ellipsis).width;
      if (strWidth <= maxWidth || maxWidth <= ellipsisWidth) {
        return str;
      } else {
        var len = str.length;
        while (strWidth >= maxWidth - ellipsisWidth && len-- > 0) {
          str = str.slice(0, len);
          strWidth = _ctx.measureText(str).width;
        }
        return str + ellipsis;
      }
    },
    draw() {
      var that = this;
      wx.showLoading()
      const {
        canvasdetailinfoData,
        canvasWidth,
        canvasHeight
      } = this.data
      const detailinfoDatamsg = canvasdetailinfoData.user
      const {
        avatar,
        nickname
      } = detailinfoDatamsg
      const {
        content,
        imagesInfo,
        type,
        businessCircle
      } = canvasdetailinfoData
      const {
        circleName,
        circleInfo,
        circlePhoto
      } = businessCircle
      const {
        thumb
      } = circlePhoto
      const imagetype = type==1 ? imagesInfo[0].thumb : ''
      //将内容做多行文本折行处理
      const ctx = wx.createCanvasContext('share', this)
      var text = content;
      const str = '长按扫码预览商圈内容'
      var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
      var temp = "";
      var row = [];
      // 商圈说明的省略号问题
      const circleInfos = that.fittingString(ctx, circleInfo,200)
      
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < 200) {
          temp += chr[a];
        } else {
          a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp);
          temp = "";
        }
      }
      row.push(temp);
      //如果数组长度大于2 则截取前两个
      if (row.length > 3) {
        var rowCut = row.slice(0, 3);
        var rowPart = rowCut[2];
        var test = "";
        var empty = [];
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < 220) {
            test += rowPart[a];
          } else {
            break;
          }
        }
        empty.push(test);
        var group = empty[0] + "..." //这里只显示两行，超出的用...表示
        rowCut.splice(2, 1, group);
        row = rowCut;
      }

      //头像
      const avatarPromise = getImageInfo(avatar)
      //发布的图片
      const imagesInfoPromise = getImageInfo(imagetype)
      const circlePromise = getImageInfo(thumb)
   if(type==1){
     Promise.all([avatarPromise, imagesInfoPromise, circlePromise])
       .then(([avatar, imagesInfo, thumb]) => {
         const canvasW = rpx2px(canvasWidth * 2)
         const canvasH = rpx2px(canvasHeight * 2)
         ctx.setFillStyle('#fff') //这里是绘制白底，让图片有白色的背景
         ctx.fillRect(0, 0, 1000, 1650)

         // 绘制头像
         const radius = rpx2px(90 * 2)
         const y = rpx2px(120 * 2)

         ctx.save()
         ctx.beginPath()
         ctx.arc(canvasW / 2, y - radius + radius, radius, 0, Math.PI * 2, false);
         ctx.stroke()
         ctx.clip()
         ctx.drawImage(avatar.path, canvasW / 2 - radius, y - radius, radius * 2, radius * 2);
         ctx.restore()
         // 绘制用户名
         ctx.setFontSize(28)
         ctx.setTextAlign('center')
         ctx.setFillStyle('#4D4D4D')
         ctx.fillText(
           nickname,
           canvasW / 2,
           y + rpx2px(150 * 2),
         )
         //内容
         ctx.setFontSize(28)
         ctx.setTextAlign('center')
         ctx.setFillStyle('#4D4D4D')
         ctx.lineWidth = 1;
         for (var b = 0; b < row.length; b++) {
           ctx.fillText(row[b], canvasW / 2, 360 + b * 60, y + rpx2px(500 * 2));
         }
         //类型type=1  图片
         //计算图片的宽高
         const scale1 = imagesInfo.width / imagesInfo.height;
         const scale2 = 600 / 600;
         let drawW = 0,
           drawH = 0,
           mt = 0,
           ml = 0;
         if (scale1 > scale2) {
           drawH = 600;
           drawW = 600 * scale1;
           ml = (600 - drawW) / 2;
         } else {
           drawW = 600;
           drawH = drawW / scale1;
           mt = (600 - drawH) / 2;
         }
         console.log(imagesInfo, 240)
         ctx.save();
         ctx.beginPath();
         ctx.strokeStyle = "rgba(0,0,0,0)";
         ctx.rect(120, 460, 600, 600);
         ctx.closePath();
         ctx.stroke();
         ctx.clip();
         // // 画图片
         ctx.drawImage(imagesInfo.path, ml + 120, mt + 460, drawW, drawH);
         ctx.restore();
         //底部二维码信息
         //底部商圈头像
         ctx.drawImage(
           thumb.path,
           canvasW / 10,
           y + rpx2px(1030 * 2),
           120,
           120,
         )
         // 绘制商圈姓名
         ctx.setFontSize(28)
         ctx.setTextAlign('left')
         ctx.setFillStyle('#333333')
         ctx.fillText(
           circleName,
           canvasW / 10,
           y + rpx2px(1200 * 2),
         )
         // 绘制商圈信息
         ctx.setFontSize(24)
         ctx.setTextAlign('left')
         ctx.setFillStyle('#4D4D4D')
         ctx.fillText(
           circleInfos,
           canvasW / 10,
           y + rpx2px(1260 * 2),
         )
         // 绘制提示
         ctx.setFontSize(22)
         ctx.setTextAlign('left')
         ctx.setFillStyle('#456693')
         ctx.fillText(
           str,
           canvasW / 10,
           y + rpx2px(1340 * 2),
         )
         ctx.stroke()
         ctx.draw(false, () => {
           canvasToTempFilePath({
             canvasId: 'share',
           }, this).then((res) =>
             this.setData({
               imageFile: res.tempFilePath
             }),
           )
         })
         wx.hideLoading()
         this.setData({
           isDraw: true
         })
       })
       .catch(() => {
         this.setData({
           beginDraw: false
         })
         wx.hideLoading()
       })
   }else{
     Promise.all([avatarPromise, circlePromise])
       .then(([avatar, thumb]) => {
         const canvasW = rpx2px(canvasWidth * 2)
         const canvasH = rpx2px(canvasHeight * 2)
         ctx.setFillStyle('#fff') //这里是绘制白底，让图片有白色的背景
         ctx.fillRect(0, 0, 1000, 1650)

         // 绘制头像
         const radius = rpx2px(90 * 2)
         const y = rpx2px(120 * 2)

         ctx.save()
         ctx.beginPath()
         ctx.arc(canvasW / 2, y, radius , 0, Math.PI * 2, false);
         ctx.stroke();
         ctx.clip()
         ctx.drawImage(avatar.path, canvasW / 2 - radius, y - radius, radius * 2, radius * 2);
         ctx.restore()


         // 绘制用户名
         ctx.setFontSize(28)
         ctx.setTextAlign('center')
         ctx.setFillStyle('#4D4D4D')
         ctx.fillText(
           nickname,
           canvasW / 2,
           y + rpx2px(150 * 2),
         )
         //内容
         ctx.setFontSize(28)
         ctx.setTextAlign('center')
         ctx.setFillStyle('#4D4D4D')
         ctx.lineWidth = 1;
         for (var b = 0; b < row.length; b++) {
           ctx.fillText(row[b], canvasW / 2, 360 + b * 60, y + rpx2px(500 * 2));
         }
         // ctx.drawImage(
         //   imagesInfo.path,
         //   canvasW / 2 - radius * 2.5,
         //   y + rpx2px(440 * 2),
         //   radius * 5,
         //   radius * 5,
         // )
         //底部二维码信息
         //底部商圈头像
         ctx.drawImage(
           thumb.path,
           canvasW / 10,
           y + rpx2px(1050 * 2),
           120,
           120,
         )
         // 绘制商圈姓名
         ctx.setFontSize(28)
         ctx.setTextAlign('left')
         ctx.setFillStyle('#333333')
         ctx.fillText(
           circleName,
           canvasW / 10,
           y + rpx2px(1200 * 2),
         )
         // 绘制商圈信息
         ctx.setFontSize(24)
         ctx.setTextAlign('left')
         ctx.setFillStyle('#4D4D4D')
         ctx.fillText(
           circleInfos,
           canvasW / 10,
           y + rpx2px(1260 * 2),
         )
         // 绘制提示
         ctx.setFontSize(22)
         ctx.setTextAlign('left')
         ctx.setFillStyle('#456693')
         ctx.fillText(
           str,
           canvasW / 10,
           y + rpx2px(1340 * 2),
         )
         ctx.stroke()
         ctx.draw(false, () => {
           canvasToTempFilePath({
             canvasId: 'share',
           }, this).then((res) =>
             this.setData({
               imageFile: res.tempFilePath
             }),
           )
         })
         wx.hideLoading()
         this.setData({
           isDraw: true
         })
       })
       .catch(() => {
         this.setData({
           beginDraw: false
         })
         wx.hideLoading()
       })
   }
        //不是图片的情况
    }
  }
})