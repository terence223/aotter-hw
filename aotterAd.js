(function(window, document, jsonpCallbackName) {
    const API_URL = 'http://localhost:3000/ads/jsonp';

    class Aotter {
        loadAd(type = '') {
            const scriptEle = document.createElement('script');
            scriptEle.src = `${API_URL}?type=${type}`;
            document.body.appendChild(scriptEle);
        }
    }

    

    window[jsonpCallbackName] = jsonpCallback;
    function jsonpCallback(res) {
        console.log('result', res);
        let ad;
        if(!res.success) {
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
    }

    window.aotterAd = new Aotter();

})(window, document, 'jsonpCallback')