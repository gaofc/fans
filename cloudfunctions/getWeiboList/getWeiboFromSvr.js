const cloud = require('wx-server-sdk')
const fetch = require('node-fetch')

cloud.init()
const db = cloud.database()

function parseJson(jsonStr) {
  var jsonObj = JSON.parse(jsonStr);
  var cards = jsonObj.data.cards
  var tweets = []

  for (var i = 0; i < cards.length; i++) {
    var tweet = {}
    var mblog = cards[i].mblog
    if (mblog != undefined) {
      tweet.type = 0
      tweet.update_date = mblog.created_at
      tweet.nick_name = mblog.user.screen_name
      tweet.avatar_url = mblog.user.profile_image_url
      tweet._id = mblog.id
      var text = mblog.text
      text = text.replace(/<img.*?>/g, '').replace("全文", "<span style='color: #5073A0;'>全文</span>")
      tweet.content = text
      var page_info = mblog.page_info
      if (page_info != undefined) {
        if (page_info.media_info != undefined) {
          var media_info = {}
          media_info.stream_url = page_info.media_info.stream_url
          media_info.page_pic = page_info.page_pic.url
          tweet.media_info = media_info
        } else {
          tweet.pics = [page_info.page_pic.url]
        }
      }
      var pics = mblog.pics
      if (pics != undefined) {
        tweet.pics = []
        for (var j = 0; j < pics.length; j++) {
          var pic_url = pics[j].url
          tweet.pics.push(pic_url)
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
          } else {
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
      saveToDB(tweet)
      tweets.push(tweet)
    }
  }
  console.log(tweets)
  return {
    tweets: tweets
  }
}

function saveToDB(item) {
  db.collection('discuss').where({
    _id: item.id
  })
    .count().then((res) => {
      console.log('####' + res)
      if (res.total == 0) {
        db.collection('discuss').add({
          data: {
            item
          }
        }).then(res => {
          console.log(res)
        })
      }
    })
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