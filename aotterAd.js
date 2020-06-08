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
    }

    window.aotterAd = new Aotter();

})(window, document, 'jsonpCallback')