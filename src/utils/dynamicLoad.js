const dynamicLoad = {}
import Golbal from '@/api/global_variable.js'

dynamicLoad.js = (url, callback) => {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (typeof (callback) == 'function') {
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                callback();
                script.onload = script.onreadystatechange = null;
            }
        };
    }
    head.appendChild(script);
}

dynamicLoad.css = (url) => {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}

dynamicLoad.addPrefix = (url) => {
    return `http://${Golbal.baseUrl}:${Golbal.port}${url}`;
}

dynamicLoad.prefix = () => {
    return `http://${Golbal.baseUrl}:${Golbal.port}`;
}
dynamicLoad.removejscssfile = (filename, type)=> {
    var targetelement;
    var targetattr
    if (type == 'css') {
        targetelement = 'link';
        targetattr = 'href';
    }
    else {
        targetelement = 'script';
        targetattr = 'src';
    }

    var allsuspects = document.getElementsByTagName(targetelement);
    
    for (var i = allsuspects.length - 1; i >= 0; i--) {
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
            // console.log(allsuspects[i])
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
    }
}
export default dynamicLoad