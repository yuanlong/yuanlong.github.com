String.prototype.replaceAll = stringReplaceAll; 
		function stringReplaceAll(AFindText,ARepText) { 
			var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,"\\$1"),"ig"); 
			return this.replace(raRegExp,ARepText); 
		}
			mui.init({
				swipeBack: false,
			});
			var viewApi = mui('#app').view({
			defaultPage: '#setting'
		});
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
var MoiveTMPL=jQuery("#moiveTemplate").html();
var content=jQuery(".moivecontent ul")

		//jQuery.getJSON("https://cors-anywhere.herokuapp.com/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=1&g=plus&play=kuyun&cid=5",function(data){
jQuery.getJSON("https://proxy.zme.ink/https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=1&g=plus&play=kuyun&cid=5",function(data){	
for(var i=0;i<data.data.length;i++){
		var moive=data.data[i];
var html=MoiveTMPL.replaceAll("{{id}}",moive.vod_id).replaceAll("{{img}}",moive.vod_pic).replaceAll("{{name}}",moive.vod_name);
content.append(html);
	}
})
