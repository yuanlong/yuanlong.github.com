String.prototype.replaceAll = stringReplaceAll;
function stringReplaceAll(AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
    return this.replace(raRegExp, ARepText);
}
mui.init({
    swipeBack: false,
});
var viewApi = mui('#app').view({
    defaultPage: '#setting'
});
var oldBack = mui.back;
mui.back = function() {
	if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
		viewApi.back();
	} else { //执行webview后退
		oldBack();
	}
};
//侧滑容器父节点
var offCanvasWrapper = mui('#offCanvasWrapper');
//主界面容器
var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
//菜单容器
var offCanvasSide = document.getElementById("offCanvasSide");

//document.getElementById('offCanvasShow').addEventListener('tap', function() {
//	offCanvasWrapper.offCanvas('show');
//});
//document.getElementById('offCanvasHide').addEventListener('tap', function() {
//	offCanvasWrapper.offCanvas('close');
//});
//主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
var MoiveTMPL = jQuery("#moiveTemplate").html();
var content = jQuery(".moivecontent ul")

//jQuery.getJSON("https://cors-anywhere.herokuapp.com/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=1&g=plus&play=kuyun&cid=5",function(data){
var cid = 5;
var page = 1;
loadMoives(cid, page,true)
function loadMoives(cid, page,clean) {
	showLoading();
    jQuery.getJSON("https://proxy.zme.ink/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + page +
        "&g=plus&play=kuyun&cid=" + cid,
        function (data) {
			if(clean){
				content.empty();
			}
            for (var i = 0; i < data.data.length; i++) {
                var moive = data.data[i];
                var html = MoiveTMPL.replaceAll("{{id}}", moive.vod_id).replaceAll("{{img}}", moive.vod_pic).replaceAll(
                    "{{name}}", moive.vod_name);
                content.append(html);
            }
			jQuery("img.lazy").lazyload({placeholder:"data:image/gif;base64,R0lGODlhCwAPAIAAAFVVVf///yH5BAEAAAEALAAAAAALAA8AAAILhI+py+0Po5y0wgIAOw==",effect: "fadeIn"});
			hideLoading();
        })
}
function showLoading(){
	jQuery(".mui-mask,.loading").show();

}
function hideLoading(){
jQuery(".loading,.mui-mask").hide();
}
jQuery(".moivecontent").on("tap",".mui-card",function(){
	var id=jQuery(this).data("id");
	viewApi.go("#play")
});
jQuery("#menu").on("tap","li",function(){
	var curCid=jQuery(this).data("cid");
	if(cid!=curCid){
		cid=curCid;
		page=1;
		loadMoives(cid, page,true);
	}
	offCanvasWrapper.offCanvas('close');
}
);
