const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let {
    userInfo,
    star,
    nick_name,
    avatar_url
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    db.collection('score_record').add({
      data: {
        star: star,
        avatar_url: avatar_url,
        nick_name: nick_name,
        openid: openId,
        type: 'signin',
        score: 10,
        update_date: db.serverDate()
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })

    return new Promise((resolve, reject) => {
      db.collection('user_score').where({
        openid: openId,
        star: star
      })
        .update({
          data: {
            score: _.inc(10)
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
