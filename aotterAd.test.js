const path = require('path');
const puppeteer = require('puppeteer');
require('expect-puppeteer');

describe('若廣告載入成功會過', () => {

    it('should display AD', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('file://' + path.join(__dirname, 'index.html'), {"waitUntil" : "networkidle0"})
        const containerEle = await page.$('#aotter-ad-plugin');

        let isVideoLoaded;
        let isBannerLoaded;

        try {
            isVideoLoaded = await containerEle.$eval('iframe', node => !!node)
        }
        catch {
            isVideoLoaded = false
        }
  
        try {
            isBannerLoaded = await containerEle.$eval('img', node => !!node)
        }
        catch {
            isBannerLoaded = false
        }
        console.log('result', isVideoLoaded, isBannerLoaded)
        expect(isVideoLoaded || isBannerLoaded).toBeTruthy()
        await browser.close();
    })
 })