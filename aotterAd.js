(function(window, document, jsonpCallbackName) {
    const API_URL = 'http://localhost:3000/ads/jsonp';

    class Aotter {
        eventList = {}
        
        waitingForEmit = {
            "on-ad-loaded": false,
            "on-ad-failed": false,
            "on-ad-impression": false
        }

        loadAd(type = '') {
            const scriptEle = document.createElement('script');
            scriptEle.src = `${API_URL}?type=${type}`;
            document.body.appendChild(scriptEle);
        }

        on(eventName, cb) {
            if(this.waitingForEmit[eventName]) {
                cb();
                this.waitingForEmit[eventName] = false;
            }
            else {
                this.eventList[eventName] = cb
            }
            
        }

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

    function jsonpCallback(res) {
        console.log('result', res);
        let ad;
        if(!res.success) {
            aotterAd.emit('on-ad-failed');
            return;
        }

        if(res.type === 'BANNER') {
            ad = document.createElement('img');
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
    }

    window.aotterAd = new Aotter();

})(window, document, 'jsonpCallback')