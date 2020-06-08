(function(window, document, jsonpCallbackName) {
    const API_URL = 'http://localhost:3000/ads/jsonp';

    const scriptEle = document.createElement('script');
    scriptEle.src = API_URL;
    document.body.appendChild(scriptEle);

    window[jsonpCallbackName] = jsonpCallback;
    function jsonpCallback(res) {
        console.log('result', res);
    }
})(window, document, 'jsonpCallback')