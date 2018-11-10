const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async(event, context) => {
  let {
    userInfo,
    type,
    star,
    user,
    content,
    comment_id,
    comment_opeind,
    reply_id,
    reply_openid,
    reply_name
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    db.collection('comment').where({
        _id: comment_id
      })
      .update({
        data: {
          reply_num: _.inc(1)
        },
      }).then(res => {
        console.log(res)
      })

    return new Promise((resolve, reject) => {
      if (type == 1) {
        db.collection('comment').add({
          data: {
            star: star,
            avatar_url: user.avatarUrl,
            nick_name: user.nickName,
            content: content,
            openid: openId,
            comment_id: comment_id,
            comment_opeind: comment_opeind,
            like_num: 0,
            reply_num: 0,
            type: type,
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
      } else if (type == 2) {
        db.collection('comment').add({
          data: {
            star: star,
            avatar_url: user.avatarUrl,
            nick_name: user.nickName,
            content: content,
            openid: openId,
            comment_id: comment_id,
            comment_opeind: comment_opeind,
            reply_id: reply_id,
            reply_openid: reply_openid,
            reply_name: reply_name,
            like_num: 0,
            reply_num: 0,
            type: type,
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
      }

    })
  } catch (e) {
    console.error(e)
  }
}