const cloud = require('wx-server-sdk')
const fetch = require('node-fetch')

cloud.init()
const db = cloud.database()
const _ = db.command

function parseJson(jsonStr) {
  var jsonObj = JSON.parse(jsonStr);
  var cards = jsonObj.data.cards[0].card_group
  var tweets = []

  for (var i = 0; i < cards.length; i++) {
    var tweet = {}
    var mblog = cards[i].mblog
    if (mblog != undefined) {
      tweet.created_at = mblog.created_at
      tweet.screen_name = mblog.user.screen_name
      tweet.profile_image_url = mblog.user.profile_image_url
      tweet.id = mblog.id
      var text = mblog.text
      text = text.replace(/<img.*?>/g, '').replace("全文", "<span style='color: #5073A0;'>全文</span>")
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
        retweet.id = retweeted_status.id
        retweet.text = retweeted_status.text.replace(/<img.*?>/g, '').replace("全文", "<span style='color: #5073A0;'>全文</span>")
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
  return tweets
}


exports.main = async (event, context) => {
  let {
    userInfo,
    page
  } = event
  let {
    openId,
    appId
  } = userInfo

  page = page == undefined ? 1 : page
  var url = `https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D60%26q%3D%E5%BC%A0%E8%89%BA%E5%85%B4%26t%3D0&page_type=searchall&page=${page}`


  return new Promise((resolve, reject) => {
    console.log("url:" + url)
    fetch(url)
      .then((res) => {
        return res.text()
      }).then((body) => {
        return parseJson(body)
      }).then((tweets) => {
        ids = []
        for (var i = 0; i < tweets.length; i++) {
          ids.push(tweets[i].id)
        }
        console.log(ids)
        db.collection('discuss').where({
          _id: _.in(ids)
        })
          .get().then(res => {
            console.log(res)
            data = {
              tweets: tweets,
              num: res.data
            }
            resolve(data)
          })
      }).catch(err => console.error(err))
  })
}