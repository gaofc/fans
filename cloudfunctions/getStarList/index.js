// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {
  var each = 20
  let {
    userInfo,
    page
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return await db.collection('star')
      .orderBy('star_name', 'asc')
      .skip(each * page)
      .limit(each)
      .get()
  } catch (e) {
    console.error(e)
  }
}