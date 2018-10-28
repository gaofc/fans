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
    weiboPage:1,
    schedules:[],
    userInfo: {},
    discussPage :0,
    discusses: []
  },

  onPullDownRefresh :function(e) {
    var that = this
    wx.cloud.callFunction({
      name: 'getWeiboList',
      data: { page: 1 },
      success: res => {
        console.log('getWeiboList suc', res)
        that.setData({
          tweets: res.result.tweets,
          weiboPage: 1
        });
      },
      fail: err => {
        console.error('getWeiboList failed', err)
      },
      complete: res => {
      }
    })

    wx.cloud.callFunction({
      name: 'getDiscuss',
      data: { page: that.data.discussPage },
      success: res => {
        console.log('getDiscuss suc', res)
        that.setData({
          discusses: res.result.data,
          discussPage: 0
        });
      },
      fail: err => {
        console.error('getDiscuss failed', err)
      },
      complete: res => {
      }
    })
  },

  selectStar: function(e) {
    this.setData({
      showSelect: !this.data.showSelect
    })
  },

  toDetail: function(e) {
    var data = {
      type: e.currentTarget.dataset.type,
      item: e.currentTarget.dataset.item
    }
    var agr = encodeURIComponent(JSON.stringify(data) )
    wx.navigateTo({
      url: '../detail/detail?item=' + agr,
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

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              app.globalData.userInfo = res.userInfo
              app.globalData.logged = true
            }
          })
        }
      }
    })

    wx.cloud.callFunction({
      name: 'getSchedule',
      data: { star_id: '' },
      success: res => {
        console.log('getSchedule suc', res)
        var sch = res.result.schedules
        var openid = res.result.openid
        app.globalData.openid = openid
        that.setData({
          schedules: sch
        });
      },
      fail: err => {
        console.error('getSchedule failed', err)
      },
      complete: res => {
      }
    })

    this.weibo_observer = wx.createIntersectionObserver(this)
    this.weibo_observer
      .relativeTo('#weibo')
      .observe('#weibo_load', (res) => {
        console.log(res)
        if (res.intersectionRatio > 0) {
          wx.cloud.callFunction({
            name: 'getWeiboList',
            data: { page: that.data.weiboPage },
            success: res => {
              console.log('getWeiboList suc', res)
              var tw = that.data.tweets.concat(res.result.tweets)
              that.setData({
                tweets: tw,
                weiboPage: that.data.weiboPage+1
              });
            },
            fail: err => {
              console.error('getWeiboList failed', err)
            },
            complete: res => {
            }
          })
        }
      });



    this.discuss_observer = wx.createIntersectionObserver(this)
    this.discuss_observer
      .relativeTo('#discuss')
      .observe('#discuss_load', (res) => {
        console.log(res)
        if (res.intersectionRatio > 0) {
          wx.cloud.callFunction({
            name: 'getDiscuss',
            data: { page: that.data.discussPage },
            success: res => {
              console.log('getDiscuss suc', res)
              var dis = that.data.discusses.concat(res.result.data)
              that.setData({
                discusses: dis,
                discussPage: that.data.discussPage + 1
              });
            },
            fail: err => {
              console.error('getDiscuss failed', err)
            },
            complete: res => {
            }
          })
        }
      });
  }
})

