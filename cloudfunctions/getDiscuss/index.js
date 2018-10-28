// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
exports.main = async(event, context) => {
  var each = 20
  let {
    userInfo,
    star,
    page
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return await db.collection('discuss').where({
      star: star
      })
      .orderBy('update_date', 'desc')
      .skip(each * page)
      .limit(each)
      .get()
  } catch (e) {
    console.error(e)
  }
}