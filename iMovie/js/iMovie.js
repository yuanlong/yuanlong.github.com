jQuery(function(){
 function launchFullScreen(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
	try{
        launchFullScreen(document.documentElement);
	}catch(e){}
if(mui.os.wechat){
jQuery("body").html('<div class="fill" style="z-index: 999; width:100%;height:100%;"><div class="reference">请在手机浏览器打开</div><div class="clock" id="utility-clock"><div class="centre"><div class="dynamic"></div><div class="expand round circle-1"></div><div class="anchor hour"><div class="element thin-hand"></div><div class="element fat-hand"></div></div><div class="anchor minute"><div class="element thin-hand"></div><div class="element fat-hand minute-hand"></div></div><div class="anchor second"><div class="element second-hand"></div></div><div class="expand round circle-2"></div><div class="expand round circle-3"></div></div></div></div>');
var clock=document.querySelector('#utility-clock')
utilityClock(clock)
if(clock.parentNode.classList.contains('fill'))autoResize(clock,295+32)
function utilityClock(container){var dynamic=container.querySelector('.dynamic')
var hourElement=container.querySelector('.hour')
var minuteElement=container.querySelector('.minute')
var secondElement=container.querySelector('.second')
var minute=function(n){return n%5==0?minuteText(n):minuteLine(n)}
var minuteText=function(n){var element=document.createElement('div')
element.className='minute-text'
element.innerHTML=(n<10?'0':'')+n
position(element,n/60,135)
dynamic.appendChild(element)}
var minuteLine=function(n){var anchor=document.createElement('div')
anchor.className='anchor'
var element=document.createElement('div')
element.className='element minute-line'
rotate(anchor,n)
anchor.appendChild(element)
dynamic.appendChild(anchor)}
var hour=function(n){var element=document.createElement('div')
element.className='hour-text hour-'+n
element.innerHTML=n
position(element,n/12,105)
dynamic.appendChild(element)}
var position=function(element,phase,r){var theta=phase*2*Math.PI
element.style.top=(-r*Math.cos(theta)).toFixed(1)+'px'
element.style.left=(r*Math.sin(theta)).toFixed(1)+'px'}
var rotate=function(element,second){element.style.transform=element.style.webkitTransform='rotate('+(second*6)+'deg)'}
var animate=function(){var now=new Date()
var time=now.getHours()*3600+
now.getMinutes()*60+
now.getSeconds()*1+
now.getMilliseconds()/1000
rotate(secondElement,time)
rotate(minuteElement,time/60)
rotate(hourElement,time/60/12)
requestAnimationFrame(animate)}
for(var i=1;i<=60;i++)minute(i)
for(var i=1;i<=12;i++)hour(i)
animate()}
function autoResize(element,nativeSize){var update=function(){var scale=Math.min(window.innerWidth,window.innerHeight)/nativeSize
element.style.transform=element.style.webkitTransform='scale('+scale.toFixed(3)+')'}
update()
window.addEventListener('resize',update)}
return ;
}

(function(e){e.retryAjax=function(t){var n;t.tryCount=t.tryCount?t.tryCount:0,t.retryLimit=t.retryLimit?t.retryLimit:2,t.suppressErrors=!0,t.error?(n=t.error,delete t.error):n=function(){},t.complete=function(t,r){if(e.inArray(r,["timeout","abort","error"])>-1)return this.tryCount++,this.tryCount<=this.retryLimit?(this.tryCount===this.retryLimit&&(this.error=n,delete this.suppressErrors),e.ajax(this),!0):(window.alert("There was a server error.  Please refresh the page.  If the issue persists, give us a call. Thanks!"),!0)},e.ajax(t)}})(jQuery);

String.prototype.replaceAll = stringReplaceAll;

function stringReplaceAll(AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return this.replace(raRegExp, ARepText);
}
mui.init({
    swipeBack: false
});
var viewApi = mui('#app').view({
    defaultPage: '#index'
});
var oldBack = mui.back;
mui.back = function () {
    if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
        viewApi.back();
        jQuery(".player iframe").attr("src", "about:blank");
		sessionStorage.removeItem('$currMovie');
    } else { //执行webview后退
        oldBack();
    }
};
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005
});

var pullRefresh = mui('#offCanvasContentScroll .mui-scroll').pullToRefresh({
    up: {
        show: false,
        contentdown: "",
        contentnomore: "",
        contentrefresh: '<div class="moreloading"><span></span><span></span><span></span><span></span><span></span></div>',
        callback: function () {
            page = page + 1;
            if (curType == "search") {
                searchMovies(jQuery("input[type=search]").val(), page, false);
            } else {
                loadMovies(cid, page, false);
            }
        }
    }
});

var offCanvasWrapper = mui('#offCanvasWrapper');
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
var offCanvasSide = document.getElementById("offCanvasSide");

mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
var MovieTMPL = jQuery("#movieTemplate").html();
var InterTMPL = jQuery("#movieIntrTemplate").html();
var content = jQuery(".moviecontent ul");
var MOVIES = {};
//jQuery.getJSON("https://cors-anywhere.herokuapp.com/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=1&g=plus&play=kuyun&cid=5",function(data){
var cid = 5;
var page = 1;
var curType = "list";
loadMovies(cid, page, true);

function showMovies(data, clean) {
    if (clean) {
        content.empty();
    }
    for (var i = 0; i < data.data.length; i++) {
        var movie = data.data[i];
        MOVIES[movie.vod_id] = movie;
        var html = MovieTMPL.replaceAll("{{id}}", movie.vod_id).replaceAll("{{img}}", movie.vod_pic).replaceAll(
            "{{name}}", movie.vod_name);
        content.append(html);
    }
    jQuery("img.lazy").lazyload({
        placeholder: "data:image/gif;base64,R0lGODlhCwAPAIAAAFVVVf///yH5BAEAAAEALAAAAAALAA8AAAILhI+py+0Po5y0wgIAOw==",
        effect: "fadeIn"
    });
    hideLoading();
    if (data.data.length < 30) {
        pullRefresh.endPullUpToRefresh(true);
    } else {
        pullRefresh.endPullUpToRefresh();
    }
}

function loadMovies(cid, pg, clean) {
    if (clean) {
        showLoading();
    }
    jQuery.retryAjax({
		url:"https://jsonp.afeld.me/?url="+encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + pg +
        "&g=plus&play=kuyun&cid=" + cid),
		timeout: 5000,
        retryLimit: 3,
		dataType:"JSON",
        success:function (data) {
            showMovies(data, clean);
			if($(content).height()<window.innerHeight){
				page=page+1;
loadMovies(cid,page,false);
			}
        }
		,
		error:function () {
		hideLoading();
        pullRefresh.endPullUpToRefresh();
    }});
	setTimeout(function(){
		hideLoading();
	},10000);
}

function searchMovies(wd, pg, clean) {
    if (wd == "") return;
    if (clean) {
        showLoading();
    }
     jQuery.retryAjax({
		 url:"https://jsonp.afeld.me/?url="+encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + pg +
        "&g=plus&play=kuyun&wd=" + wd),
        timeout: 5000,
        retryLimit: 3,
		dataType:"JSON",
        success:function (data) {
            showMovies(data, clean);
        },
		error:function () {
			hideLoading();
        pullRefresh.endPullUpToRefresh();
    }});
}

function showLoading() {
    jQuery(".mui-mask,.loading").show();
}

function hideLoading() {
    jQuery(".loading,.mui-mask").hide();
}
var movieinter = jQuery("#movieIntr");
var PlayLi = '<li class="{{cur}}" data-url="{{url}}"><a>{{name}}</a></li>';
jQuery(".moviecontent").on("tap", ".mui-card", function () {
    var id = jQuery(this).data("id");
    var movie = MOVIES[id];
    if (movie == undefined) {
        return;
    }
   showMovie(movie);
   sessionStorage.setItem('$currMovie',JSON.stringify(movie));
});
function showMovie(movie){
 var html = InterTMPL.replaceAll("{{name}}", movie.vod_name).replaceAll("{{type}}", movie.list_name).replaceAll(
        "{{area}}", movie.vod_area).replaceAll(
        "{{director}}", movie.vod_director).replaceAll(
        "{{actor}}", movie.vod_actor).replaceAll(
        "{{content}}", movie.vod_content);
    movieinter.empty().html(html);
    if (movie.vod_url != undefined) {
        var vod_urls = movie.vod_url.split("$$$");
        if (vod_urls.length > 0) {
            vod_urls = vod_urls[0].split(/\r\n/);
            var url = vod_urls[0].split("$")[1];
		if(url.startsWith("http://")){
		url=url.replace("http://","https://")
		}
            if (url.endsWith(".m3u8")) {
                url = "https://www.ixxplayer.com/video.php?url=" + url;
            }
            jQuery(".player iframe").attr("src", url || "about:blank");
            var html = "";
            for (var _index = 0; _index < vod_urls.length; _index++) {
                var _urls = vod_urls[_index].split("$");
                html = html + PlayLi.replaceAll("{{cur}}", _index == 0 ? "current" : "").replaceAll(
                    "{{url}}", _urls[1]).replaceAll(
                    "{{name}}", _urls[0]);
            }
            jQuery(".playlist ul").empty().html(html);
        }
    }
    jQuery("#moviename").text(movie.vod_name);
    viewApi.go("#play");
}

jQuery("#menu").on("tap", "li", function () {
    var curCid = jQuery(this).data("cid");
    if (cid != curCid || curType == "search") {
        cid = curCid;
        page = 1;
        curType = "list";
        pullRefresh.refresh(true);
        jQuery("input[type=search]").val("");
        loadMovies(cid, page, true);
    }
    offCanvasWrapper.offCanvas('close');
});

jQuery(".playlist").on("tap", "li", function () {
    var url = jQuery(this).data("url");
	if(url.startsWith("http://")){
		url=url.replace("http://","https://")
		}
    if (url.endsWith(".m3u8")) {
        url = "https://www.ixxplayer.com/video.php?url=" + url;
    }
    jQuery(".playlist li.current").removeClass("current");
    jQuery(this).addClass("current");
    jQuery(".player iframe").attr("src", "about:blank");
    jQuery(".player iframe").attr("src", url || "about:blank");
});

jQuery(".mui-search").on('submit', '.movie-search-form', function (event) {
    event.preventDefault();
});
jQuery("input[type=search]").on("keypress", function (e) {
    var keycode = e.keyCode;
    if (keycode == '13') {
        e.preventDefault();
        page = 1;
        curType = "search";
        pullRefresh.refresh(true);
        searchMovies(jQuery(this).val(), 1, true);
    }
});
function resize(){
 jQuery(".player,.player iframe").height(parseInt(window.innerWidth*0.5627)>(window.innerHeight-88)?(window.innerHeight-88):parseInt(window.innerWidth*0.5627));
}
	resize();
jQuery(window).resize(function(){
  resize();
});
try{
	var curMovie=sessionStorage.getItem('$currMovie') || "";
	if(curMovie!=""){
		var mov=JSON.parse(curMovie);
		showMovie(mov);
	}
}catch(e){}
});
