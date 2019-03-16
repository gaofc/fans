//app.js
App({
  onLaunch: function() {

    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    that.globalData = {
      userInfo: {},
      openid: '',
      logged: false,
      currentStar: {
        "hot_link": "https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D60%26q%3D%E5%BC%A0%E8%89%BA%E5%85%B4%26t%3D0\u0026page_type=searchall",
        "schecule_link": "https://idol001.com/xingcheng/list/star-zhangyixing-6618/",
        "star_id": "zhangyixing",
        "star_name": "张艺兴",
        "weibo_link": "https://m.weibo.cn/api/container/getIndex?uid=2706896955\u0026luicode=10000011\u0026lfid=100103type%3D1%26q%3D%E5%BC%A0%E8%89%BA%E5%85%B4\u0026featurecode=20000320\u0026type=uid\u0026value=2706896955\u0026containerid=1076032706896955",
        "avatar_url": "https://tvax2.sinaimg.cn/crop.0.0.1242.1242.180/a157f83bly8fkd2w04kl0j20yi0yi763.jpg"
      },
      starList: []
    }
  }
})