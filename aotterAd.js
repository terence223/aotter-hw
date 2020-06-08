(function(window, document, jsonpCallbackName) {
    // API 位址
    const API_URL = 'http://localhost:3000/ads/jsonp';

    class Aotter {
        // 記錄用 on 註冊的事件的 callback
        eventList = {}
        
        // 若 emit 時還沒被用 on 設定，先用這個變數記錄下來，當使用者一用 on 設定就可以馬上 emit
        waitingForEmit = {
            "on-ad-loaded": false,
            "on-ad-failed": false,
            "on-ad-impression": false
        }

        // 載入廣告的函式，參數 type 為 BANNER 和 VIDEO
        loadAd(type = '') {
            const scriptEle = document.createElement('script');
            scriptEle.src = `${API_URL}?type=${type}`;
            document.body.appendChild(scriptEle);
        }

        // 設定監聽事件的函式
        on(eventName, cb) {
            if(this.waitingForEmit[eventName]) {
                cb();
                this.waitingForEmit[eventName] = false;
            }
            else {
                this.eventList[eventName] = cb
            }
            
        }

        // 觸發監聽事件的 callback
        emit(eventName) {
            if(this.eventList[eventName]) {
                this.eventList[eventName]();
            }
            else {
                this.waitingForEmit[eventName] = true;
            }
        }
    }
    
    window[jsonpCallbackName] = jsonpCallback;

    // 接收 jsonp 資料的函式
    function jsonpCallback(res) {
        let ad;
        let adWasShown = false;
        if(!res.success) {
            aotterAd.emit('on-ad-failed');
            return;
        }

        if(res.type === 'BANNER') {
            ad = document.createElement('img');
            ad.width = '560'
            ad.src = res.image;
            ad.alt = res.title;
        }
        else if(res.type === 'VIDEO') {
            ad = document.createElement('iframe');
            ad.width = '560'
            ad.height = '315'
            ad.src = res.video_url
        }
    
        document.getElementById('aotter-ad-plugin').appendChild(ad);
        aotterAd.emit('on-ad-loaded');
        
        // 測試廣告是不是顯示超過一秒
        const handler = () => raf(() => {
            if(showOverHalf(document.getElementById('aotter-ad-plugin'))) {
                setTimeout(function() {
                    if(showOverHalf(document.getElementById('aotter-ad-plugin')) && !adWasShown) {
                        adWasShown = true;
                        window.removeEventListener('scroll', handler);
                        aotterAd.emit('on-ad-impression');
                        fetch(res.impression_url, {
                            mode: 'no-cors'
                        })
                    }
                }, 1000)
            }
        } )
            
        handler()
        window.addEventListener('scroll', handler)
    }

    // 測試元件是不是顯示超過 50%
    const showOverHalf = ele => {
        const scroll = window.scrollY || window.pageYOffset
        const boundTop = ele.getBoundingClientRect().top + scroll
        
        const view = {
            top: scroll,
            bottom: scroll + window.innerHeight,
        }
        
        const bound = {
            top: boundTop,
            bottom: boundTop + ele.clientHeight,
        }
        
        const halfHeight = ele.clientHeight / 2
        
        return ( (bound.bottom - halfHeight) >= view.top && bound.bottom <= view.bottom ) || ( (bound.top + halfHeight) <= view.bottom && bound.top >= view.top );
    }

    const raf = 
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
            window.setTimeout( callback, 1000 / 60 )
        }

    window.aotterAd = new Aotter();

})(window, document, 'jsonpCallback')