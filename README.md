## 執行方法

1. `npm install` 安裝必要的套件
2. `node server.js` 執行 server
3. 打開 index.html，即可看到結果
4. 若要執行測試請跑 `npm run test` 

## SDK 原理

* 檔案為 aotterAd.js，引入該檔案並可執行
* 用 parcel 壓縮過後的檔案在 dist/aotterAd.js
* 在 html 建立一個 id 為 aotter-ad-plugin 的 div，獲取到的廣告會塞到這裡面
* 可用 `window.aotterAd` 此變數呼叫下列 API

## SDK API

| key            | usage                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------|
| loadAd(type)       | 載入廣告，可指名廣告類型 BANNER 或 VIDEO                                                                      |
| on('on-ad-loaded', callback)  | 廣告載入成功便會呼叫 callback                                                        |
| on('on-ad-failed', callback) | 廣告載入失敗便會呼叫 callback   |
| on('on-ad-impression', callback) | 廣告被看到 50% 超過一秒便會呼叫 callback  |

## 關於測試
###只寫了一個簡單的測試，測試廣告是否有被顯示出來，但由於 server 預設會隨機傳錯誤，所以若要每次都跑成功請把 mock-data.json 的 	`success : false ` 那筆物件拿掉，個人認為還需要的測試有
* loadAd 前沒有廣告，執行後便有
* 成功時應該要有 callback 可以執行
* 失敗時應該要有 callback 可以執行
* 捲動後露出 50% 廣告時應該要有 callback 可以執行

## 關於搜集錯誤
應該可以使用類似 rollbar 的 Error tracking system 去追蹤