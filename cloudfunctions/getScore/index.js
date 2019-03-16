// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
exports.main = async(event, context) => {
  let {
    userInfo,
    star
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return await db.collection('user_score').where({
        star: star,
        openid: openId
      })
      .get()
  } catch (e) {
    console.error(e)
  }
}