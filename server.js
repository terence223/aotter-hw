const express = require('express')
const app = express()
const data = require('./mock-data.json');
const { PORT = 3000 } = process.env;

const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const genAdId = () => `${+new Date()}-${random(0, 1000)}`;

//get random ad from mock data
const getAd = (type = '') => {
  const ads = type
    ? data.filter(ad => ad.type === type || !ad.success)
    : data;

  const ad = ads[random(0, ads.length)];
  return {
    ...ad,
    id: genAdId()
  }
}

//api endpoint
// 改用 jsonp 傳資料
app.get('/ads/jsonp', (req, res) => {
  /**
   * type: requested ad type
   */
  const { type = '' } = req.query;
  const resData = JSON.stringify(getAd(type.toUpperCase()))
  res.set('Content-Type', 'application/text')
  res.send(`jsonpCallback(${resData})`)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}!`)
})
