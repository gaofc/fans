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
        name: 'saveUserInfo',
        data: {
          user : e.detail.userInfo
        },
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid

        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          // wx.navigateTo({
          //   url: '../deployFunctions/deployFunctions',
          // })
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
    this.setData({
      logged: app.globalData.logged,
      avatar: app.globalData.avatar,
      name: app.globalData.name
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