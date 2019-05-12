String.prototype.replaceAll = stringReplaceAll;

function stringReplaceAll(AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return this.replace(raRegExp, ARepText);
}
mui.init({
    swipeBack: false
});
var viewApi = mui('#app').view({
    defaultPage: '#setting'
});
var oldBack = mui.back;
mui.back = function () {
    if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
        viewApi.back();
        jQuery(".player iframe").attr("src", "about:blank");
    } else { //执行webview后退
        oldBack();
    }
};
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005
});

var pullRefresh=mui('#offCanvasContentScroll .mui-scroll').pullToRefresh({
    up: {
        show: false,
		contentdown:"",
		contentnomore:"",
        contentrefresh: '<div class="moreloading"><span></span><span></span><span></span><span></span><span></span></div>',
        callback: function () {
            page = page + 1;
			if(curType=="search"){
				searchMoives(jQuery("input[type=search]").val(), page, false);
			}else{
				loadMoives(cid, page, false);
			}
        }
    }
});

var offCanvasWrapper = mui('#offCanvasWrapper');
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
var offCanvasSide = document.getElementById("offCanvasSide");

mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
var MoiveTMPL = jQuery("#moiveTemplate").html();
var InterTMPL = jQuery("#moiveIntrTemplate").html();
var content = jQuery(".moivecontent ul");
var MOIVES = {};
//jQuery.getJSON("https://cors-anywhere.herokuapp.com/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=1&g=plus&play=kuyun&cid=5",function(data){
var cid = 5;
var page = 1;
var curType="list";
loadMoives(cid, page, true);

function showMoives(data, clean) {
    if (clean) {
        content.empty();
    }
    for (var i = 0; i < data.data.length; i++) {
        var moive = data.data[i];
        MOIVES[moive.vod_id] = moive;
        var html = MoiveTMPL.replaceAll("{{id}}", moive.vod_id).replaceAll("{{img}}", moive.vod_pic).replaceAll(
            "{{name}}", moive.vod_name);
        content.append(html);
    }
    jQuery("img.lazy").lazyload({
        placeholder: "data:image/gif;base64,R0lGODlhCwAPAIAAAFVVVf///yH5BAEAAAEALAAAAAALAA8AAAILhI+py+0Po5y0wgIAOw==",
        effect: "fadeIn"
    });
    hideLoading();
	if(data.data.length<30){
		pullRefresh.endPullUpToRefresh(true);
	}else{
		pullRefresh.endPullUpToRefresh();
	}
}

function loadMoives(cid, page, clean) {
    if (clean) {
        showLoading();
    }
    jQuery.getJSON("https://proxy.zme.ink/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + page +
        "&g=plus&play=kuyun&cid=" + cid,
        function (data) {
            showMoives(data, clean);
        }).error(function() {pullRefresh.endPullUpToRefresh();});
}

function searchMoives(wd, page, clean) {
    if (wd == "") return;
    if (clean) {
        showLoading();
    }
    jQuery.getJSON("https://proxy.zme.ink/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + page +
        "&g=plus&play=kuyun&wd=" + wd,
        function (data) {
            showMoives(data, clean);
        }).error(function() {pullRefresh.endPullUpToRefresh();});
}

function showLoading() {
    jQuery(".mui-mask,.loading").show();
}

function hideLoading() {
    jQuery(".loading,.mui-mask").hide();
}
var moiveinter = jQuery("#moiveIntr");
var PlayLi = '<li class="{{cur}}" data-url="{{url}}"><a>{{name}}</a></li>';
jQuery(".moivecontent").on("tap", ".mui-card", function () {
    var id = jQuery(this).data("id");
    var moive = MOIVES[id];
    if (moive == undefined) {
        return;
    }
    var html = InterTMPL.replaceAll("{{name}}", moive.vod_name).replaceAll("{{type}}", moive.list_name).replaceAll(
        "{{area}}", moive.vod_area).replaceAll(
        "{{director}}", moive.vod_director).replaceAll(
        "{{actor}}", moive.vod_actor).replaceAll(
        "{{content}}", moive.vod_content);
    moiveinter.empty().html(html);
    if (moive.vod_url != undefined) {
        var vod_urls = moive.vod_url.split("$$$");
        if (vod_urls.length > 0) {
            vod_urls = vod_urls[0].split(/\r\n/);
            var url = vod_urls[0].split("$")[1];
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
    jQuery("#moivename").text(moive.vod_name);
    viewApi.go("#play");
});
jQuery("#menu").on("tap", "li", function () {
    var curCid = jQuery(this).data("cid");
    if (cid != curCid||curType=="search") {
        cid = curCid;
        page = 1;
		curType="list";		
		pullRefresh.refresh(true);
		jQuery("input[type=search]").val("");
        loadMoives(cid, page, true);
    }
    offCanvasWrapper.offCanvas('close');
});

jQuery(".playlist").on("tap", "li", function () {
    var url = jQuery(this).data("url");
    if (url.endsWith(".m3u8")) {
        url = "https://www.ixxplayer.com/video.php?url=" + url;
    }
    jQuery(".playlist li.current").removeClass("current");
    jQuery(this).addClass("current");
    jQuery(".player iframe").attr("src", "about:blank");
    jQuery(".player iframe").attr("src", url || "about:blank");
});

jQuery(".mui-search").on('submit', '.moive-search-form', function (event) {
    event.preventDefault();
});
jQuery("input[type=search]").on("keypress", function (e) {
    var keycode = e.keyCode;
    if (keycode == '13') {
        e.preventDefault();
		page=1;
		curType="search";
		pullRefresh.refresh(true);
        searchMoives(jQuery(this).val(), 1, true);
    }
})