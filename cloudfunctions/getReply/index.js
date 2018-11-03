// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
exports.main = async (event, context) => {
  let {
    userInfo,
    comment_id
  } = event
  let {
    openId,
    appId
  } = userInfo
  try {
    return await db.collection('comment').where({
      comment_id: comment_id
    })
      .get()
  } catch (e) {
    console.error(e)
  }
}