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
    star_id
  } = event
  let {
    openId,
    appId
  } = userInfo

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;

  var url = `https://idol001.com/xingcheng/list/star-zhangyixing-6618/${year}/${month}/`

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