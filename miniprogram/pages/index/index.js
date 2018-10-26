var app = getApp();
Page({
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234
    }],
    tweets: [],
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    showSelect: false,
    page:1

  },
  onReachBottom: function(e) {
    var pa = this.data.page + 1
    var that = this
    wx.cloud.callFunction({
      name: 'getWeiboList',
      data: {page: pa},
      success: res => {
        console.log('getWeiboList suc', res)
        var tw = that.data.tweets.cont

        that.setData({
          tweets: res.result.tweets
        });
      },
      fail: err => {
        console.error('getWeiboList failed', err)
      },
      complete: res => {
      }
    })

    this.setData({
      page: pa
    })
  },

  selectStar: function(e) {
    this.setData({
      showSelect: !this.data.showSelect
    })
  },

  toDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },

  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 600
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    wx.cloud.callFunction({
      name: 'getWeiboList',
      data: {},
      success: res => {
        console.log('getWeiboList suc', res)
        that.setData({
          tweets: res.result.tweets
        });
      },
      fail: err => {
        console.error('getWeiboList failed', err)
      },
      complete: res => {
      }
    })
  }
})