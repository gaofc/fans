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
    weiboPage: 1,
    schedulePage: 0,
    schedules: [],
    userInfo: {},
    discussPage: 0,
    discusses: [],
    hotPage: 1,
    hotTweets: []
  },

  onRefresh: function(e) {
    wx.showToast({
      title: '正在刷新',
      icon: 'loading'
    })
    var type = e.currentTarget.dataset.type
    var that = this
    if(type == 0) {
      that.setData({
        tweets: [],
        weiboPage: 1
      });
    }
    else if (type == 1) {
      that.setData({
        hotTweets: [],
        hotPage: 1
      });
    }
    else if (type == 2) {
      that.setData({
        discusses: [],
        discussPage: 0
      });
    }
  },

  previewImg: function(e) {
    console.log(e)
    var current = e.currentTarget.dataset.src
    var url = e.currentTarget.dataset.urls

    wx.previewImage({
      current: current,
      urls: url
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
    var agr = encodeURIComponent(JSON.stringify(data))
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

    this.weibo_observer = wx.createIntersectionObserver(this)
    this.weibo_observer
      .relativeTo('#weibo')
      .observe('#weibo_load', (res) => {
        console.log(res)
        if (res.intersectionRatio > 0) {
          wx.cloud.callFunction({
            name: 'getWeiboList',
            data: {
              page: that.data.weiboPage
            },
            success: res => {
              console.log('getWeiboList suc', res)
              var newTw = res.result.tweets
              var newNum = res.result.num
              for (var i = 0; i < newNum.length; i++) {
                for (var j = 0; j < newTw.length; j++) {
                  if (newTw[j].id == newNum[i]._id) {
                    newTw[j].comment_num = newNum[i].comment_num
                    newTw[j].like_num = newNum[i].like_num
                    break
                  }
                }
              }
              for (var i = 0; i < newTw.length; i++) {
                if (newTw[i].comment_num == undefined) {
                  newTw[i].comment_num = 0
                  newTw[i].like_num = 0
                }
              }
              var tw = that.data.tweets.concat(newTw)
              that.setData({
                tweets: tw,
                weiboPage: that.data.weiboPage + 1
              });
            },
            fail: err => {
              console.error('getWeiboList failed', err)
            },
            complete: res => {}
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
            data: {
              page: that.data.discussPage
            },
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
            complete: res => {}
          })
        }
      });


    this.hot_observer = wx.createIntersectionObserver(this)
    this.hot_observer
      .relativeTo('#hot')
      .observe('#hot_load', (res) => {
        console.log(res)
        if (res.intersectionRatio > 0) {
          wx.cloud.callFunction({
            name: 'getHot',
            data: {
              page: that.data.hotPage
            },
            success: res => {
              console.log('getHot suc', res)
              if (res.result != undefined) {
                var newTw = res.result.tweets
                var newNum = res.result.num
                for (var i = 0; i < newNum.length; i++) {
                  for (var j = 0; j < newTw.length; j++) {
                    if (newTw[j].id == newNum[i]._id) {
                      newTw[j].comment_num = newNum[i].comment_num
                      newTw[j].like_num = newNum[i].like_num
                      break
                    }
                  }
                }
                for (var i = 0; i < newTw.length; i++) {
                  if (newTw[i].comment_num == undefined) {
                    newTw[i].comment_num = 0
                    newTw[i].like_num = 0
                  }
                }
                var tw = that.data.hotTweets.concat(newTw)
                that.setData({
                  hotTweets: tw,
                  hotPage: that.data.hotPage + 1
                });
              }
            },
            fail: err => {
              console.error('getHot failed', err)
            },
            complete: res => {}
          })
        }
      });

    this.schedule_observer = wx.createIntersectionObserver(this)
    this.schedule_observer
      .relativeTo('#recommend')
      .observe('#schedule_load', (res) => {
        console.log(res)
        if (res.intersectionRatio > 0) {
          wx.cloud.callFunction({
            name: 'getSchedule',
            data: {
              star_id: app.globalData.currentStar,
              page: that.data.schedulePage
            },
            success: res => {
              console.log('getSchedule suc', res)
              if (res.result.schedules.length < 1) {
                wx.showToast({
                  title: '没有更多行程了',
                  image: '../../images/dislike.png'
                })
              }
              var sch = that.data.schedules.concat(res.result.schedules)
              var openid = res.result.openid
              app.globalData.openid = openid
              that.setData({
                schedules: sch,
                schedulePage: that.data.schedulePage + 1
              });
            },
            fail: err => {
              console.error('getSchedule failed', err)
            },
            complete: res => {}
          })
        }
      });
  },

  onShow: function() {
    var that = this
    wx.getStorage({
      key: 'hasLike',
      success(res) {
        console.log(res.data)
        var id = res.data
        for (var i = 0; i < that.data.discusses.length; i++) {
          if (id == that.data.discusses[i]._id) {
            that.data.discusses[i].hasLike = true
            that.data.discusses[i].like_num += 1
            that.setData({
              discusses: that.data.discusses
            })
            wx.removeStorage({
              key: 'hasLike'
            })
            break
          }
        }
        for (var i = 0; i < that.data.tweets.length; i++) {
          if (id == that.data.tweets[i].id) {
            that.data.tweets[i].hasLike = true
            that.data.tweets[i].like_num += 1
            that.setData({
              tweets: that.data.tweets
            })
            wx.removeStorage({
              key: 'hasLike'
            })
            break
          }
        }
        for (var i = 0; i < that.data.hotTweets.length; i++) {
          if (id == that.data.hotTweets[i].id) {
            that.data.hotTweets[i].hasLike = true
            that.data.hotTweets[i].like_num += 1
            that.setData({
              hotTweets: that.data.hotTweets
            })
            wx.removeStorage({
              key: 'hasLike'
            })
            break
          }
        }
      }
    })
    wx.getStorage({
      key: 'hasComment',
      success(res) {
        console.log(res.data)
        var id = res.data
        for (var i = 0; i < that.data.tweets.length; i++) {
          if (id == that.data.tweets[i].id) {
            that.data.tweets[i].comment_num += 1
            that.setData({
              tweets: that.data.tweets
            })
            wx.removeStorage({
              key: 'hasComment'
            })
            break
          }
        }
        for (var i = 0; i < that.data.discusses.length; i++) {
          if (id == that.data.discusses[i]._id) {
            that.data.discusses[i].comment_num += 1
            that.setData({
              discusses: that.data.discusses
            })
            wx.removeStorage({
              key: 'hasComment'
            })
            break
          }
        }
        for (var i = 0; i < that.data.hotTweets.length; i++) {
          if (id == that.data.hotTweets[i].id) {
            that.data.hotTweets[i].comment_num += 1
            that.setData({
              hotTweets: that.data.hotTweets
            })
            wx.removeStorage({
              key: 'hasComment'
            })
            break
          }
        }
      }
    })
    wx.getStorage({
      key: 'hasPost',
      success(res) {
        console.log(res.data)
        that.setData({
          discusses: [],
          discussPage: 0
        });
        wx.removeStorage({
          key: 'hasPost'
        })
      }
    })
  }
})