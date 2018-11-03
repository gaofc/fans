// miniprogram/pages/detail/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifShowComment: false,
    data: {},
    page: 0,
    comments: [],
    commentInfo: {},
    conmmentType: 0
  },
  onShowComment: function(e) {
    var commentInfo = {}
    if (e.currentTarget.dataset.type == 1) {
      commentInfo.commentId = e.currentTarget.dataset.commentId
      commentInfo.commentOpeind = e.currentTarget.dataset.commentOpeind
    }
    this.setData({
      ifShowComment: true,
      commentInfo: commentInfo,
      conmmentType: e.currentTarget.dataset.type
    })
  },
  onHideComment: function(e) {
    this.setData({
      ifShowComment: false
    })
  },
  toComment: function (e) {
    console.log(e)
    var agr = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item))
    wx.navigateTo({
      url: '../comment/comment?comment=' + agr,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var res = JSON.parse(decodeURIComponent(options.item))
    var data = res.item
    console.log(data)
    if (res.type == 'weibo') {
      data.update_date = data.created_at
      data._id = data.id
      data.pics = data.page_pics
      data.avatar_url = data.profile_image_url
      data.nick_name = data.screen_name
      data.content = data.text
      that.setData({
        data: data
      })

      var ifDetail = false;
      var ifRetweetDetail = false;
      var id = ""
      if (data.content.lastIndexOf('全文') >= 0) {
        id = data.id
        ifDetail = true
      } else if (data.retweet != undefined && data.retweet.text.lastIndexOf('全文') >= 0) {
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
            if (ifDetail) {
              data.content = longTextContent
            } else if (ifRetweetDetail) {
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

    } else if (res.type == 'discuss') {
      that.setData({
        data: data
      });
    }

    wx.cloud.callFunction({
      name: 'getCommentList',
      data: {
        discuss_id: data._id,
        page: that.data.page
      },
      success: res => {
        console.log('getCommentList suc', res)
        that.setData({
          comments: res.result.data
        });
      },
      fail: err => {
        console.error('getCommentList failed', err)
      },
      complete: res => { }
    })


  },

  formSubmit: function(e) {
    console.log(e)
    var com = e.detail.value.com
    var that = this
    if (that.data.conmmentType == 0) {
      wx.cloud.callFunction({
        name: 'setComment',
        data: {
          star: app.globalData.currentStar,
          user: app.globalData.userInfo,
          content: com,
          discuss_id: that.data.data._id,
          discuss_openid: app.globalData.currentStar
        },
        success: res => {
          console.log('setComment success ', res)

        },
        fail: err => {
          console.error('setComment failed ', err)
        },
        complete: res => {
        }
      })
    }
    else if (that.data.conmmentType == 1) {
      wx.cloud.callFunction({
        name: 'setReply',
        data: {
          type: that.data.conmmentType,
          star: app.globalData.currentStar,
          user: app.globalData.userInfo,
          content: com,
          comment_id: that.data.commentInfo.commentId,
          comment_opeind: that.data.commentInfo.commentOpeind
        },
        success: res => {
          console.log('setReply success ', res)
        },
        fail: err => {
          console.error('setReply failed ', err)
        },
        complete: res => {
        }
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