const cloud = require('wx-server-sdk')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

cloud.init()

function parseHtmlPage(html) {
  var $ = cheerio.load(html)
  var dom = $('tbody').find('tr')
  var schs = []
  dom.each(function(item) {
    var sch_data = {}
    var sch = $(this);
    var date = ''
    var time = ''
    var con = ''
    var loc = ''
    sch.find('td').each(function(key, item) {
      var t = $(this);
      console.log(t.text(), key)
      if (key == 0)
        date = t.text()
      else if (key == 1)
        time = t.text()
      else if (key == 2)
        con = t.text()
      else if (key == 4)
        loc = t.text()
    })
    schs.push({
      date: date.replace(/\n/g, '').replace(/ /g, ''),
      time: time.replace(/\n/g, '').replace(/ /g, ''),
      con: con.replace(/\n/g, '').replace(/ /g, ''),
      loc: loc.replace(/\n/g, '').replace(/ /g, '')
    })
  });
  return schs
}


exports.main = async(event, context) => {
  let {
    userInfo,
    url,
    page
  } = event
  let {
    openId,
    appId
  } = userInfo

  var now = new Date();
  if (now.getMonth() + page > 11) {
    now = new Date(now.getFullYear() + 1, (now.getMonth() + page) % 12, 1);
  } else {
    now = new Date(now.getFullYear(), now.getMonth() + page, 1);
  }

  var year = now.getFullYear();
  var month = now.getMonth() + 1;

  url += `${year}/${month}/`

  //var url = `https://idol001.com/xingcheng/list/star-zhangyixing-6618/${year}/${month}/`

  return new Promise((resolve, reject) => {
    console.log("url:" + url)
    fetch(url)
      .then((res) => {
        return res.text()
      }).then((body) => {
        resolve({
          schedules: parseHtmlPage(body),
          openid: openId
        })
      }).catch(err => console.error(err))
  })
}