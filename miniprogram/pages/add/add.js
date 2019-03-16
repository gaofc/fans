// miniprogram/pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    starUnfocus: [],
    starFocus: [],
    page: 0
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },

  cancelFocus: function(options) {
    var that = this
    var star_id = options.target.dataset.star
    console.log(star_id)

   

    wx.getStorage({
      key: 'starList',
      success: function(res) {
        var list = res.data
        for (var i = 0; i < list.length; i++) {
          if (list[i].star_id == star_id) {
            list.splice(i, 1)
            break
          }
        }
        wx.setStorage({
          key: 'starList',
          data: list,
        })
        wx.reLaunch({
          url: '../index/index',
        })

      }
    })
  },

  focus: function(options) {
    var that = this
    var star_id = options.target.dataset.star
    console.log(star_id)

    var foucsStar = {}
    for (var i = 0; i < that.data.starUnfocus.length; i++) {
      if (that.data.starUnfocus[i].star_id == star_id)
        foucsStar = that.data.starUnfocus[i]
    }

    wx.setStorage({
      key: 'star',
      data: foucsStar,
    })

    wx.getStorage({
      key: 'starList',
      success: function(res) {
        var list = res.data
        list.unshift(foucsStar)
        wx.setStorage({
          key: 'starList',
          data: list,
        })
      },
      fail: function(res) {
        wx.setStorage({
          key: 'starList',
          data: [foucsStar],
        })
      }
    })

    wx.reLaunch({
      url: '../index/index',
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.cloud.callFunction({
      name: 'getStarList',
      data: {
        page: that.data.page
      },
      success: res => {
        console.log('get starlist success', res)
        var allStar = res.result.data

        wx.getStorage({
          key: 'starList',
          success: function (res) {
            var focus = res.data

            for (var i=0; i<focus.length;i++) {
              for (var j = 0; j < allStar.length; j++) {
                if (focus[i].star_id == allStar[j].star_id) {
                  allStar[j].hasFocus = true
                }
              }
            }

            that.setData({
              starFocus: focus,
              starUnfocus: allStar
            })
          }
        })


        that.setData({
          
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