const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async(event, context) => {
  let {
    userInfo,
    type,
    id
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {

    return new Promise((resolve, reject) => {
      var conl = 'discuss'
      if (type == 1) {
        conl = 'comment'
      }
      db.collection(conl).where({
          _id: id
        })
        .update({
          data: {
            like_num: _.inc(1)
          },
        }).then(res => {
          console.log(res)
          if (res.stats.updated == 0 && conl == 'discuss') {
            db.collection('discuss').add({
              data: {
                _id: id,
                type:1,
                like_num: 1,
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
          }
          else {
            var data = {
              dbmsg: res,
              openid: openId
            }
            resolve(data)
          }
        })
    })
  } catch (e) {
    console.error(e)
  }

}