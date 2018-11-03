// miniprogram/pages/comment/comment.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    replys: [],
    replyInfo: {},
    replyType: 1
  },

  onShowComment: function (e) {
    console.log(e)
    var replyInfo = {}
    if (e.currentTarget.dataset.type == 2) {
      replyInfo.replyId = e.currentTarget.dataset.replyId
      replyInfo.replyOpeind = e.currentTarget.dataset.replyOpeind
      replyInfo.replyName = e.currentTarget.dataset.replyName
    }
    this.setData({
      ifShowComment: true,
      replyInfo: replyInfo,
      replyType: e.currentTarget.dataset.type
    })
  },

  onHideComment: function (e) {
    this.setData({
      ifShowComment: false
    })
  },

  formSubmit: function (e) {
    console.log(e)
    var com = e.detail.value.com
    var that = this
    if (that.data.replyType == 1) {
      wx.cloud.callFunction({
        name: 'setReply',
        data: {
          type: that.data.replyType,
          star: app.globalData.currentStar,
          user: app.globalData.userInfo,
          content: com,
          comment_id: that.data.comment._id,
          comment_opeind: that.data.comment.openid
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
    else if (that.data.replyType == 2) {
      wx.cloud.callFunction({
        name: 'setReply',
        data: {
          type: that.data.replyType,
          star: app.globalData.currentStar,
          user: app.globalData.userInfo,
          content: com,
          comment_id: that.data.comment._id,
          comment_opeind: that.data.comment.openid,
          reply_id: that.data.replyInfo.replyId,
          reply_openid: that.data.replyInfo.replyOpeind,
          reply_name: that.data.replyInfo.replyName
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var comment = JSON.parse(decodeURIComponent(options.comment))
    console.log(comment)
    that.setData({
      comment: comment
    })

    wx.cloud.callFunction({
      name: 'getReply',
      data: {
        comment_id: comment._id
      },
      success: res => {
        console.log('getReply suc', res)
        that.setData({
          replys: res.result.data
        })
      },
      fail: err => {
        console.error('getReply failed', err)
      },
      complete: res => { }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})