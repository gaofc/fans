// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifShowComment: false,
    data: {}
  },
  onShowComment: function(e) {
    this.setData({
      ifShowComment: true
    })
  },
  onHideComment: function(e) {
    this.setData({
      ifShowComment: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var data = JSON.parse(decodeURIComponent(options.item))
    console.log(data)
    that.setData({
      data: data
    });

    var ifDetail = false;
    var ifRetweetDetail = false;
    var id = ""
    if (data.text.lastIndexOf('全文') >= 0) {
      id = data.id
      ifDetail = true
    } else if (data.retweet != undefined && data.retweet.text.indexOf('全文') >= 0) {
      id = data.retweet.id
      ifRetweetDetail = true
    }
    if (ifDetail || ifRetweetDetail) {
      wx.cloud.callFunction({
        name: 'getWeiboDetail',
        data: {
          id: id
        },
        success: res => {
          console.log('getWeiboDetail suc', res)
          var longTextContent = res.result.longTextContent
          if(ifDetail) {
            data.text = longTextContent
          }
          else if (ifRetweetDetail) {
            data.retweet.text = longTextContent
          }
          that.setData({
            data: data
          });
        },
        fail: err => {
          console.error('getWeiboDetail failed', err)
        },
        complete: res => {}
      })
    }

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