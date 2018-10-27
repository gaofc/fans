const cloud = require('wx-server-sdk')
const fetch = require('node-fetch')

cloud.init()


function parseJson(jsonStr) {
  var jsonObj = JSON.parse(jsonStr);
  var longTextContent = jsonObj.data.longTextContent.replace(/<img.*?>/g, '')

  return {
    longTextContent: longTextContent
  }
}


exports.main = async (event, context) => {
  let {
    userInfo,
    id
  } = event
  let {
    openId,
    appId
  } = userInfo

  var url = `https://m.weibo.cn/statuses/extend?id=${id}`


  return new Promise((resolve, reject) => {
    console.log("url:" + url)
    fetch(url)
      .then((res) => {
        return res.text()
      }).then((body) => {
        resolve(parseJson(body))
      }).catch(err => console.error(err))
  })
}