// miniprogram/pages/post/post.js

const app = getApp()

Page({
  data: {
    imageList:[],
    countLeft: 9,
    cloudPaths:[]
  },

  formSubmit:function(e) {
    wx.showToast({
      title: '正在发表',
      icon: 'loading'
    })

    var openid = app.globalData.openid
    var text = e.detail.value.text
    var that = this
    console.log(text)

    var cloudPaths = []
    for (var i = 0; i <that.data.imageList.length; i++) {
      console.log(that.data.imageList[i])
      var tmp = that.data.imageList[i].split('/')
      var picName = tmp[tmp.length - 1]
      var cloudName = 'cloud://fans-d900c2.6661-fans-d900c2/discuss_pics/' + openid + '/' + picName
      cloudPaths.push(cloudName)
      wx.cloud.uploadFile({
        cloudPath: 'discuss_pics/' + openid + '/' + picName,
        filePath: that.data.imageList[i],
        success: res => {
          // get resource ID
          console.log(res)
        },
        fail: err => {
          // handle error
          console.log(err)
        },
        complete: res => {
          
        }
      })
    }
    console.log(cloudPaths)

    wx.cloud.callFunction({
      name: 'setDiscuss',
      data: {
        star: app.globalData.currentStar.star_id,
        user: app.globalData.userInfo,
        content: text,
        pics: cloudPaths
      },
      success: res => {
        console.log('setDiscuss success ', res)
        wx.hideToast()
        
        wx.showModal({
          title: '讨论',
          content: '发布讨论成功',
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        wx.setStorage({
          key: 'hasPost',
          data: true,
        })
      },
      fail: err => {
        console.error('setDiscuss failed ', err)
        wx.showToast({
          title: '发布讨论失败',
        })
      },
      complete: res => {
       

      }
    })

  },

  formReset: function() {
    wx.navigateBack({
      delta:1
    })
  },

  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      count: that.data.countLeft,
      success: function (res) {
        console.log(res)
        var imgs = that.data.imageList.concat(res.tempFilePaths)
        console.log(imgs)
        console.log(that.data.countLeft)
        console.log(res.tempFilePaths.length)
        that.setData({
          imageList: imgs,
          countLeft: that.data.countLeft - res.tempFilePaths.length
        })
      }
    })
  },

  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
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