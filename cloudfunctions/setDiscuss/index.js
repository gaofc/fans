const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  let {
    userInfo,
    star,
    user,
    content,
    pics
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return new Promise((resolve, reject) => {
      db.collection('discuss').add({
        data: {
          avatar_url: user.avatarUrl,
          type: 0,
          nick_name: user.nickName,
          content: content,
          openid: openId,
          pics: pics,
          star: star,
          like_num: 0,
          comment_num: 0,
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