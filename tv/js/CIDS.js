var M_CIDS = [{
	"cid": "5",
	"name": "动作片",
	sname: "动作"
}, {
	"cid": "6",
	"name": "喜剧片",
	sname: "喜剧"
}, {
	"cid": "7",
	"name": "爱情片",
	sname: "爱情"
}, {
	"cid": "8",
	"name": "科幻片",
	sname: "科幻"
}, {
	"cid": "9",
	"name": "恐怖片",
	sname: "恐怖"
}, {
	"cid": "26",
	"name": "国内综艺",
	sname: "综艺"
}];
var G_CIDS = [{
	"cid": "12",
	name: "国产剧",
	sname: "国剧"
}, {
	"cid": "15",
	name: "欧美剧",
	sname: "美剧"
}, {
	"cid": "14",
	name: "韩剧",
	sname: "韩剧"
}, {
	"cid": "17",
	name: "日本剧",
	sname: "日剧"
}, {
	"cid": "23",
	name: "国产动漫",
	sname: "国漫"
}, {
	"cid": "24",
	name: "日韩动漫",
	sname: "日漫"
}, {
	"cid": "13",
	name: "香港剧",
	sname: "港剧"
}, {
	"cid": "16",
	name: "台湾剧",
	sname: "台剧"
}];
var O_CIDS = [{
	"cid": "11",
	name: "战争片",
	sname: "战争"
}, {
	"cid": "10",
	name: "剧情片",
	sname: "剧情"
}, {
	"cid": "18",
	name: "海外剧",
	sname: "海外"
}, {
	"cid": "19",
	name: "纪录片",
	sname: "记录"
}];
var CIDS = M_CIDS.concat(G_CIDS).concat(O_CIDS);
var CIDLIST=[];
for(var i=CIDS.length-1;i>=0;i--){
	CIDLIST.push(CIDS[i].cid);
}
var curPlayMovie=null;
