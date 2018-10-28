// miniprogram/pages/me/me.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "../../images/tmp.jpg",
    name: "您尚未登录"
  },

  onGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.logged = true
      
      this.setData({
        avatar: e.detail.userInfo.avatarUrl,
        name: e.detail.userInfo.nickName
      })

      wx.cloud.callFunction({
        name: 'setUser',
        data: {
          user : e.detail.userInfo
        },
        success: res => {
          console.log('setUser success', res)
        },
        fail: err => {
          console.error('setUser failed', err)
        },
        complete: res => {
        }
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    
  },
  

  toKeepPage(options) {
    if (!app.globalData.logged) {
      wx.showModal({
        title: '登录',
        content: '您需要先登录才能使用收藏功能',
        showCancel: false,
        confirmText: '确定'
      })
    }
    else {
      wx.navigateTo({
        url: '../keep/keep',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.logged == true) {
      this.setData({
        avatar: app.globalData.userInfo.avatarUrl,
        name: app.globalData.userInfo.nickName
      })
    }
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