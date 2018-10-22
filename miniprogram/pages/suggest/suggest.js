// miniprogram/pages/suggest/suggest.js
Page({
  formSubmit: function(options){
    var qq = options.detail.value.qq
    var wechat = options.detail.value.wechat
    var cellphone = options.detail.value.cellphone
    var content = options.detail.value.content

    wx.showToast({
      title: '正在提交',
      icon: "loading"
    })
    wx.cloud.callFunction({
      name: 'saveSuggests',
      data: {
        user_qq: qq,
        user_wechat: wechat,
        user_cellphone: cellphone,
        user_content: content,
      },
      success: res => {
        console.log('[云函数] [saveUserKeep] suc: ', res)
        
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
       
      },
      complete: res => {
        wx.showModal({
          content: '反馈成功，感谢您的反馈！',
          showCancel: false,
          confirmText: '确定',
          success (res) {
            wx.navigateBack({
            })
          }
        })
       }
    })

  },

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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