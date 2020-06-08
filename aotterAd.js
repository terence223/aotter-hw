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