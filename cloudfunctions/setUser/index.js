// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  let {
    userInfo,
    user
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return new Promise((resolve, reject) => {
      db.collection('user').add({
        data: {
          avatar_url: user.avatarUrl,
          city: user.city,
          country: user.country,
          gender: user.gender,
          language: user.language,
          nick_name: user.nickName,
          province: user.province,
          openid: openId,
          update_date: db.serverDate()
        }
      }).then(res => {
        console.log(res)
        var data = {
          dbmsg: res,
          openid: openId
        }
        resolve(data)
      })
    })
  } catch (e) {
    console.error(e)
  }

}