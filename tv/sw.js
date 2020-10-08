"use strict";
var _sw_version="20201007";
function ParseDateFmt(n, t) {
    var r;
    n = new Date(n);
    var u = {
        "M+": n.getMonth() + 1,
        "d+": n.getDate(),
        "H+": n.getHours(),
        "m+": n.getMinutes(),
        "s+": n.getSeconds(),
        "q+": Math.floor((n.getMonth() + 3) / 3),
        S: n.getMilliseconds()
    }
      , f = n.getFullYear()
      , i = f + "";
    i = i.length >= 4 ? i : "0000".substr(0, 4 - i.length) + i;
    t || (t = "yyyy-MM-dd HH:mm:ss");
    /(y+)/.test(t) && (t = t.replace(RegExp.$1, (i + "").substr(4 - RegExp.$1.length)));
    for (r in u)
        new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, RegExp.$1.length === 1 ? u[r] : ("00" + u[r]).substr(("" + u[r]).length)));
    return t
}
var _SW_BASE=[
	"/tv"
];
var _SW_EXCLUDE=[
	
];
function clearOldCaches() {
    return caches.keys().then(n=>Promise.all(n.filter(n=>[swConfig.cache.url, swConfig.cache.js, swConfig.cache.css, swConfig.cache.img].indexOf(n) < 0).map(n=>caches.delete(n))))
}
function fileType(n) {
    let t = "url";
    if(n.indexOf("??")!=-1&&n.split("??").length>=2){
    	n=n.split("??")[1];
    }
    return n.split("?")[0].endsWith(".css") && (t = "css"),
    n.split("?")[0].endsWith(".js") && (t = "js"),
    n.split("?")[0].endsWith(".ttf") && (t = "font"),
    ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico", "json"].map(n=>"." + n).reduce((t,i)=>t || n.split("?")[0].endsWith(i), !1) && (t = "img"),
    t
}
function cachePrior(n, event) {
    event.respondWith(caches.open(n).then(n=>n.match(event.request).then(i=>i ? i : fetch(event.request).then(i=>(i.ok && n.put(event.request, i.clone()),
    i)))))
}
function netPrior(n, event) {
	if(n==undefined)return;
    event.respondWith(caches.open(n).then(n=>fetch(event.request).then(i=>(i.ok && n.put(event.request, i.clone()),
    i)).catch(()=>n.match(event.request.url).then(n=>{
        if (n)
            return n
    }
    ))))
}
var swConfig = {
    version: "sdk",
    cache: {
        css: "css_",
        js: "js_",
        img: "img_",
        url: "url_",
        font:"font_"
    },
    domain: {
        domain: location.host+"/tv/"
    }
};
swConfig.cache.url += swConfig.version + ParseDateFmt(new Date, "yyMMdd");
swConfig.cache.js += swConfig.version + ParseDateFmt(new Date, "yyMM");
swConfig.cache.css += swConfig.version + ParseDateFmt(new Date, "yyMM");
swConfig.cache.img += swConfig.version + ParseDateFmt(new Date, "yyMM");
self.addEventListener("install", function(event) {
    event.waitUntil(self.skipWaiting())
});
self.addEventListener("activate", function(event) {
    event.waitUntil(clearOldCaches().then(()=>self.clients.claim()))
});
self.addEventListener("fetch", function(event) {
    if (event.request.method === "GET"){
    	var url=event.request.url;
    	/**
		if(event.request.url.indexOf("https://")==0){
    		url=url.match(/(https:\/\/)((\w|\.|\/)+)/g)[0].replace("https://"+location.host,"");
	 	   if(_SW_EXCLUDE.reduce((t,i)=>t && (url==i), 1)){
	 		   return;
	 	   }
 	   }**/
        switch (fileType(event.request.url)) {
        case "css":
            cachePrior(swConfig.cache.css, event);
            break;
        case "js":
            cachePrior(swConfig.cache.js, event);
            break;
        case "font":
            cachePrior(swConfig.cache.font, event);
            break;
        case "img":
            cachePrior(swConfig.cache.img, event);
        }
    }
});
self.addEventListener("error", function(event) {
    console.error("error");
    console.dir(event)
});
