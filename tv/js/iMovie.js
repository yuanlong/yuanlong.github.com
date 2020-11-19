(function() {
	var CrossServer="https://jsonp.afeld.me/?url=";
	//var CrossServer="https://json2jsonp.com/?url=";
	//var CrossServer = "https://cors-anywhere.herokuapp.com/";
	String.prototype.replaceAll = stringReplaceAll;

	function stringReplaceAll(AFindText, ARepText) {
		var raRegExp = new RegExp(AFindText.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, "\\$1"), "ig");
		return this.replace(raRegExp, ARepText);
	}
	Array.prototype.contains = function(a) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == a) return true;
		}
		return false;
	}
	window.queryProgress = function(id) {
		return localStorage.getItem('$movie_' + id) || "";
	}
	window.setProgress = function(id, num) {
		localStorage.setItem('$movie_' + id, num);
	}
	window.loadMovies = function(cid, pg, callback,cache) {
		jQuery.retryAjax({
			url: CrossServer + encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + pg +
				"&g=plus&play=kuyun&cid=" + cid),
			timeout: 20000,
			retryLimit: 10,
			dataType: "JSON",
			cache:cache||false,
			success: function(data) {
				callback(data);
			}
		});
	}

	window.searchMovies = function(wd, pg, callback) {
		if (wd == "") return;
		jQuery.retryAjax({
			url: CrossServer + encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + pg +
				"&g=plus&play=kuyun&wd=" + wd),
			timeout: 20000,
			retryLimit: 10,
			dataType: "JSON",
			success: function(data) {
				callback(data);
			}
		});
	}
	var db;

	function loadHistory() {
		queryMovie();
	}
	var curPlayID = "";
	var curPlayName = "";

	window.refreshMoives=function(vodid, vodname, callback) {
		jQuery.retryAjax({
			url: CrossServer + encodeURIComponent("https://api.iokzy.com/inc/feifei3s/?m=api&a=json&p=" + 1 +
				"&g=plus&play=kuyun&wd=" + vodname),
			timeout: 20000,
			retryLimit: 10,
			dataType: "JSON",
			cache:true,
			success: function(data) {
				for (var i = 0; i < data.data.length; i++) {
					var movie = data.data[i];
					if (movie.vod_id == vodid) {
						callback(movie);
						break;
					}
				}
			},
			error: function() {

			}
		});
	}

	window.playMovie=function(url) {
		if (url.startsWith("http://")) {
			url = url.replace("http://", "https://")
		}
		if (url.endsWith(".m3u8")) {
			// url = "https://www.ixxplayer.com/video.php?url=" + url;
			url = "https://www.dplayer.tv/?url=" + url;
		}
		return url;
	}

	if (/(iPhone|iPad|iPod|iOS|Mac)/i.test(navigator.userAgent)) {
		jQuery.getScript("js/jsstore.min.js", function() {
			loadscript("js/history.js");
		});
	} else {
		//设置数据库
		var dbsize = 2 * 2014 * 1024;
		db = openDatabase("iMovie", "", "", dbsize);
		db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS movies (id integer PRIMARY KEY,movieData text,last_date datetime)");
			deleteMovie();
		});
		window.saveMovie = function(mov) {
			db.transaction(function(tx) {
				tx.executeSql("SELECT id FROM movies where id=?", [mov.vod_id],
					function(tx, result) {
						if (result.rows.length > 0) {
							tx.executeSql("UPDATE movies set movieData=?,last_date=datetime('now','localtime') where id=?", [JSON.stringify(
									mov), mov.vod_id],
								function(tx, result) {},
								function(e) {});
						} else {
							//新增数据
							tx.executeSql("INSERT INTO movies(id,movieData,last_date) values(?,?,datetime('now','localtime'))", [mov.vod_id,
									JSON.stringify(mov)
								],
								function(tx, result) {},
								function(e) {});
						}
					},
					function(e) {

					}
				);
			});
		}
		window.deleteMovie = function() {
			db.transaction(function(tx) {
				tx.executeSql("DELETE FROM movies WHERE  last_date<datetime('now', '-60 day')", [], function(tx, result) {

				}, function(e) {});
			});
		}
		window.queryMovie = function(callback) {
			db.transaction(function(tx) {
				//显示list
				tx.executeSql("SELECT id,movieData,last_date FROM movies ORDER BY last_date desc", [],
					function(tx, result) {
						if (result.rows.length > 0) {
							var movies = [];
							for (var i = 0; i < result.rows.length; i++) {
								item = result.rows.item(i);
								movies.push(JSON.parse(item["movieData"]));
							}
							var data = {
								"data": movies
							};
							callback(data, true);
						}

					},
					function(e) {

					}
				);
			});
		}
	}

})();
