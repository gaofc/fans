const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let {
    userInfo,
    star,
    user,
    content,
    discuss_id,
    discuss_openid
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    db.collection('discuss').where({
      _id: discuss_id
    })
      .update({
        data: {
          comment_num: _.inc(1)
        },
      }).then(res => {
        console.log(res)
        if (res.stats.updated == 0) {
          db.collection('discuss').add({
            data: {
              _id: discuss_id,
              type: 1,
              like_num: 0,
              comment_num: 1,
              update_date: db.serverDate()
            }
          }).then(res => {
            console.log(res)
          })
        }
      })

    return new Promise((resolve, reject) => {
      db.collection('comment').add({
        data: {
          star: star,
          avatar_url: user.avatarUrl,
          nick_name: user.nickName,
          content: content,
          openid: openId,
          discuss_id: discuss_id,
          discuss_openid: discuss_openid,
          like_num: 0,
          reply_num: 0,
          type: 0,
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