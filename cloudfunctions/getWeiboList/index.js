const cloud = require('wx-server-sdk')
const fetch = require('node-fetch')

cloud.init()


function parseJson(jsonStr) {
  var jsonObj = JSON.parse(jsonStr);
  var cards = jsonObj.data.cards
  var tweets = []

  for (var i = 0; i < cards.length; i++) {
    var tweet = {}
    var mblog = cards[i].mblog
    if (mblog != undefined) {
      tweet.created_at = mblog.created_at
      tweet.screen_name = mblog.user.screen_name
      tweet.profile_image_url = mblog.user.profile_image_url
      tweet.id = mblog.user.id
      var text = mblog.text
      text = text.replace(/<img.*?>/g, '')
      tweet.text = text
      var page_info = mblog.page_info
      if (page_info != undefined) {
        if (page_info.media_info != undefined) {
          var media_info = {}
          media_info.stream_url = page_info.media_info.stream_url
          media_info.page_pic = page_info.page_pic.url
          tweet.media_info = media_info
        }
        else {
          tweet.page_pics = [page_info.page_pic.url]
        }
      }
      var pics = mblog.pics
      if (pics != undefined) {
        tweet.page_pics = []
        for (var j = 0; j < pics.length; j++) {
          var pic_url = pics[j].url
          tweet.page_pics.push(pic_url)
        }
      }
      var retweeted_status = mblog.retweeted_status
      if (retweeted_status != undefined) {
        retweet = {}
        retweet.name = retweeted_status.user.screen_name
        retweet.text = retweeted_status.text.replace(/<img.*?>/g, '')
        var page_info = retweeted_status.page_info
        if (page_info != undefined) {
          if (page_info.media_info != undefined) {
            var media_info = {}
            media_info.stream_url = page_info.media_info.stream_url
            media_info.page_pic = page_info.page_pic.url
            retweet.media_info = media_info
          }
          else {
            retweet.page_pics = [page_info.page_pic.url]
          }
        }
        var pics = retweeted_status.pics
        if (pics != undefined) {
          retweet.page_pics = []
          for (var j = 0; j < pics.length; j++) {
            var pic_url = pics[j].url
            retweet.page_pics.push(pic_url)
          }
        }
        tweet.retweet = retweet
      }
      tweets.push(tweet)
    }
  }
  console.log(tweets)
  return { tweets: tweets}
}


exports.main = async (event, context) => {
  var page = 2
  var url = `https://m.weibo.cn/api/container/getIndex?uid=2706896955&luicode=10000011&lfid=100103type%3D1%26q%3D%E5%BC%A0%E8%89%BA%E5%85%B4&featurecode=20000320&type=uid&value=2706896955&containerid=1076032706896955&page=${page}`


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