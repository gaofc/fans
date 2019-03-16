const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
exports.main = async(event, context) => {
  let {
    userInfo,
    star_id
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return await db.collection('star').where({
        star_id: star_id
      })
      .get()
  } catch (e) {
    console.error(e)
  }
}