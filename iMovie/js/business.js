(function(){
var CrossServer="https://jsonp.afeld.me/?url=";
(function(e){e.retryAjax=function(t){var n;t.tryCount=t.tryCount?t.tryCount:0,t.retryLimit=t.retryLimit?t.retryLimit:2,t.suppressErrors=!0,t.error?(n=t.error,delete t.error):n=function(){},t.complete=function(t,r){if(e.inArray(r,["timeout","abort","error","parsererror"])>-1)return this.tryCount++,this.tryCount<=this.retryLimit?(this.tryCount===this.retryLimit&&(this.error=n,delete this.suppressErrors),e.ajax(this),!0):(window.alert("There was a server error.  Please refresh the page.  If the issue persists, give us a call. Thanks!"),!0)},e.ajax(t)}})(jQuery);

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
		localStorage.removeItem('$currMovie');
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
Array.prototype.contains=function(a){for(var i=0;i<this.length;i++){if(this[i]==a)return true;}return false;}
var allowCIDS=['26','23','24'];
window.showMovies =function (data, clean) {
    if (clean) {
        content.empty();
    }
    for (var i = 0; i < data.data.length; i++) {
		
        var movie = data.data[i];
		if(movie.vod_cid>19&&movie.vod_cid!=26&&!allowCIDS.contains(movie.vod_cid)){continue;}//屏蔽
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
window.queryProgress=function(id){
	return localStorage.getItem('$movie_'+id)||"";
}
window.setProgress=function(id,num){
	localStorage.setItem('$movie_'+id,num);
}
function loadMovies(cid, pg, clean) {
    if (clean) {
        showLoading();
    }
    jQuery.retryAjax({
		url:CrossServer+encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + pg +
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
		 url:CrossServer+encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + pg +
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
   localStorage.setItem('$currMovie',JSON.stringify(movie));
   saveMovie(movie);
});

var db;


function loadHistory(){
	showLoading();
	queryMovie();
	hideLoading();
}
var curPlayID="";
var curPlayName="";
function showMovie(movie){
	curPlayID=movie.vod_id;
	curPlayName=movie.vod_name;
 var html = InterTMPL.replaceAll("{{name}}", movie.vod_name).replaceAll("{{type}}", movie.list_name).replaceAll(
        "{{area}}", movie.vod_area).replaceAll(
        "{{director}}", movie.vod_director).replaceAll(
        "{{actor}}", movie.vod_actor).replaceAll(
        "{{content}}", movie.vod_content);
    movieinter.empty().html(html);
    showPlayList(movie,true);
    jQuery("#moviename").text(movie.vod_name);
    viewApi.go("#play");
}

function showPlayList(movie,play){
if (movie.vod_url != undefined) {
        var vod_urls = movie.vod_url.split("$$$");
        if (vod_urls.length > 0) {
            vod_urls = vod_urls[0].split(/\r\n/);
            var url = vod_urls[0].split("$")[1];
			if(play){
			playMovie(url);
			}
            var html = "";
			var hisSee="";
			if(vod_urls.length>1){
				hisSee=queryProgress(movie.vod_id);
			}
            for (var _index = 0; _index < vod_urls.length; _index++) {
                var _urls = vod_urls[_index].split("$");
				var cur=_index == 0 ? "current" : "";
				if(hisSee!=""){
					if(hisSee!=_urls[0]){
						cur="";
					}else{
						cur= "current";
						if(play){
						playMovie(_urls[1]);
						}
					}
				}
                html = html + PlayLi.replaceAll("{{cur}}",cur).replaceAll(
                    "{{url}}", _urls[1]).replaceAll(
                    "{{name}}", _urls[0]);
            }
			
            jQuery(".playlist ul").empty().html(html);
        }
    }
}

function refreshMoives(vodid,vodname){
	jQuery.retryAjax({
		 url:CrossServer+encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + 1 +
        "&g=plus&play=kuyun&wd=" + vodname),
        timeout: 5000,
        retryLimit: 3,
		dataType:"JSON",
        success:function (data) {
           for (var i = 0; i < data.data.length; i++) {
				var movie = data.data[i];
				if(movie.vod_id==vodid){
					showPlayList(movie,false);
				}
			}
        },
		error:function () {
		
    }});
}

jQuery("#refreshBtn").click(function(){
refreshMoives(curPlayID,curPlayName)
})

jQuery("#menu").on("tap", "li", function () {
	var curMenu=jQuery(this);
    var curCid = curMenu.data("cid");
    if (curCid!=undefined&&(cid != curCid || curType == "search"||curType=="history")) {
        cid = curCid||5;
        page = 1;
        curType = "list";
        pullRefresh.refresh(true);
        jQuery("input[type=search]").val("");
        loadMovies(cid, page, true);
    }else{
		var type=curMenu.data("type");
		if(type!=undefined&&type=='history'){
			curType="history";
			
			loadHistory();
		}
	}
	document.querySelector("#app .mui-title").innerText=curMenu[0].innerText;
    offCanvasWrapper.offCanvas('close');
});

jQuery(".playlist").on("tap", "li", function () {
    var url = jQuery(this).data("url");
	playMovie(url);
    jQuery(".playlist li.current").removeClass("current");
    jQuery(this).addClass("current");
	setProgress(curPlayID,jQuery(this).text())
  });

function playMovie(url){
	if(url.startsWith("http://")){
		url=url.replace("http://","https://")
		}
    if (url.endsWith(".m3u8")) {
        url = "https://www.ixxplayer.com/video.php?url=" + url;
    }
	jQuery(".player iframe").attr("src", "about:blank");
    jQuery(".player iframe").attr("src", url || "about:blank");
}


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
 jQuery(".player,.player iframe").height(parseInt(window.innerWidth*0.5627)>(window.innerHeight-145)?(window.innerHeight-145):parseInt(window.innerWidth*0.5627));
}
	resize();
jQuery(window).resize(function(){
  resize();
});


if (/(iPhone|iPad|iPod|iOS|Mac)/i.test(navigator.userAgent)) {
jQuery.getScript("js/jsstore.min.js",function(){
loadscript("js/history.js");
});
}else{
//设置数据库
var dbsize = 2 * 2014 * 1024;
db = openDatabase("iMovie", "", "", dbsize);
db.transaction(function (tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS movies (id integer PRIMARY KEY,movieData text,last_date datetime)");
	deleteMovie();
});
window.saveMovie=function (mov){
	 db.transaction(function (tx) {
		 tx.executeSql("SELECT id FROM movies where id=?", [mov.vod_id],
                    function (tx, result) {
                        if (result.rows.length > 0) {
							tx.executeSql("UPDATE movies set movieData=?,last_date=datetime('now','localtime') where id=?", [JSON.stringify(mov), mov.vod_id],
						function (tx, result) {}, function (e) {
						});
                        }else{
						 //新增数据
					tx.executeSql("INSERT INTO movies(id,movieData,last_date) values(?,?,datetime('now','localtime'))", [mov.vod_id, JSON.stringify(mov)],
						function (tx, result) {}, function (e) {
						});
						}
                    }, function (e) {
                        
                    }
            );
        });
}
window.deleteMovie=function (){
	db.transaction(function (tx) {
                    tx.executeSql("DELETE FROM movies WHERE  last_date<datetime('now', '-7 day')", [], function (tx, result) {
                        
                    }, function (e) {
                    });
    });
}
window.queryMovie=function (){
	db.transaction(function (tx) {
            //显示list
            tx.executeSql("SELECT id,movieData,last_date FROM movies ORDER BY last_date desc", [],
                    function (tx, result) {
                        if (result.rows.length > 0) {
							var movies=[];
                            for (var i = 0; i < result.rows.length; i++) {
                                item = result.rows.item(i);
								movies.push(JSON.parse(item["movieData"]));
                            }
							var data={"data":movies};
							showMovies(data,true);
                        }
                        
                    }, function (e) {
                        
                    }
            );
    });
}
}

try{
	var curMovie=localStorage.getItem('$currMovie') || "";
	if(curMovie!=""){
		var mov=JSON.parse(curMovie);
		showMovie(mov);
	}
}catch(e){}

})();