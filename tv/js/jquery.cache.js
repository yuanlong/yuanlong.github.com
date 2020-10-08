(function($, window) {
var WebStorageCache=function(){"use strict";function a(a,b){for(var c in b)a[c]=b[c];return a}function b(a){var b=!1;if(a&&a.setItem){b=!0;var c="__"+Math.round(1e7*Math.random());try{a.setItem(c,c),a.removeItem(c)}catch(d){b=!1}}return b}function c(a){var b=typeof a;return"string"===b&&window[a]instanceof Storage?window[a]:a}function d(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())}function e(a,b){if(b=b||new Date,"number"==typeof a?a=a===1/0?l:new Date(b.getTime()+1e3*a):"string"==typeof a&&(a=new Date(a)),a&&!d(a))throw new Error("`expires` parameter cannot be converted to a valid Date instance");return a}function f(a){var b=!1;if(a)if(a.code)switch(a.code){case 22:b=!0;break;case 1014:"NS_ERROR_DOM_QUOTA_REACHED"===a.name&&(b=!0)}else-2147024882===a.number&&(b=!0);return b}function g(a,b){this.c=(new Date).getTime(),b=b||l;var c=e(b);this.e=c.getTime(),this.v=a}function h(a){return"object"!=typeof a?!1:a&&"c"in a&&"e"in a&&"v"in a?!0:!1}function i(a){var b=(new Date).getTime();return b<a.e}function j(a){return"string"!=typeof a&&(console.warn(a+" used as a key, but it is not a string."),a=String(a)),a}function k(d){var e={storage:"localStorage",exp:1/0},f=a(e,d),g=c(f.storage),h=b(g);this.isSupported=function(){return h},h?(this.storage=g,this.quotaExceedHandler=function(a,b,c){if(console.warn("Quota exceeded!"),c&&c.force===!0){var d=this.deleteAllExpires();console.warn("delete all expires CacheItem : ["+d+"] and try execute `set` method again!");try{c.force=!1,this.set(a,b,c)}catch(e){console.warn(e)}}}):a(this,n)}var l=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),m={serialize:function(a){return JSON.stringify(a)},deserialize:function(a){return a&&JSON.parse(a)}},n={set:function(){},get:function(){},"delete":function(){},deleteAllExpires:function(){},clear:function(){},add:function(){},replace:function(){},touch:function(){}},o={set:function(b,c,d){if(b=j(b),d=a({force:!0},d),void 0===c)return this["delete"](b);var e=m.serialize(c),h=new g(e,d.exp);try{this.storage.setItem(b,m.serialize(h))}catch(i){f(i)?this.quotaExceedHandler(b,e,d,i):console.error(i)}return c},get:function(a){a=j(a);var b=null;try{b=m.deserialize(this.storage.getItem(a))}catch(c){return null}if(h(b)){if(i(b)){var d=b.v;return m.deserialize(d)}this["delete"](a)}return null},"delete":function(a){return a=j(a),this.storage.removeItem(a),a},deleteAllExpires:function(){for(var a=this.storage.length,b=[],c=this,d=0;a>d;d++){var e=this.storage.key(d),f=null;try{f=m.deserialize(this.storage.getItem(e))}catch(g){}if(null!==f&&void 0!==f.e){var h=(new Date).getTime();h>=f.e&&b.push(e)}}return b.forEach(function(a){c["delete"](a)}),b},clear:function(){this.storage.clear()},add:function(b,c,d){b=j(b),d=a({force:!0},d);try{var e=m.deserialize(this.storage.getItem(b));if(!h(e)||!i(e))return this.set(b,c,d),!0}catch(f){return this.set(b,c,d),!0}return!1},replace:function(a,b,c){a=j(a);var d=null;try{d=m.deserialize(this.storage.getItem(a))}catch(e){return!1}if(h(d)){if(i(d))return this.set(a,b,c),!0;this["delete"](a)}return!1},touch:function(a,b){a=j(a);var c=null;try{c=m.deserialize(this.storage.getItem(a))}catch(d){return!1}if(h(c)){if(i(c))return this.set(a,this.get(a),{exp:b}),!0;this["delete"](a)}return!1}};return k.prototype=o,k}();
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config={defaultTimeout : 20 * 60, // 20 min
			defaultStorageType:'localStorage',
			defaultCacheValidate:function defaultCacheValidate(response) {
				return true;
			},
			defaultPreGenCacheKey:function defaultPreGenCacheKey(ajaxOptions) {
				var dataOrigin = ajaxOptions.data || {};
				var key, dataString;
				try {
					if (typeof dataString !== 'string') {
						dataString = JSON.stringify(dataOrigin);
					}
					key = ajaxOptions.url.replace(/jQuery.*/, '') + (ajaxOptions.type||"get").toUpperCase() + (dataString || '');
				} catch (e) {
					console.error(e);
				}
				return key;
			}
}

function extend(obj, props) {
	    for (var key in props) {
	        obj[key] = props[key];
	    }return obj;
	}
var CacheProxy =(function () {
	function CacheProxy(options) {
		_classCallCheck(this, CacheProxy);

		var defaults = {
			timeout: _config.defaultTimeout,
			storageType: _config.defaultStorageType,
			cacheValidate: _config.defaultCacheValidate,
			preGenCacheKey: _config.defaultPreGenCacheKey,
			forceRefresh: false
		};

		var opt = extend(defaults, options);

		this.defaultTimeout = opt.timeout;
		this.storageType = opt.storageType;
		this.cacheValidate = opt.cacheValidate;
		this.preGenCacheKey = opt.preGenCacheKey;
		this.forceRefresh = opt.forceRefresh;

		this.storageMap = {
			sessionStorage: new WebStorageCache({
				storage: 'sessionStorage'
			}),
			localStorage: new WebStorageCache({
				storage: 'localStorage'
			})
		};
		// 清除已过期数据
		this.deleteAllExpires();
	}

	_createClass(CacheProxy, [{
		key: 'genCacheKey',
		value: function genCacheKey(options, customPreGenCacheKey) {

			var fun = this.preGenCacheKey;
			if (typeof customPreGenCacheKey === 'function') {
				fun = customPreGenCacheKey;
			}

			return $.md5(fun(options));
		}
	}, {
		key: 'getStorage',
		value: function getStorage(type) {
			return this.storageMap[type] || this.storageMap[this.storageType] || this.storageMap['localStorage'];
		}
	}, {
		key: 'getCacheValidateFun',
		value: function getCacheValidateFun() {
			return this.cacheValidate;
		}
	}, {
		key: 'deleteAllExpires',
		value: function deleteAllExpires() {
			this.storageMap.sessionStorage.deleteAllExpires();
			this.storageMap.localStorage.deleteAllExpires();
		}
	}]);
	return CacheProxy;
})();
	$.ajaxCacheRefresh=false;
	$.ajaxCache=function(url,options){
		if (typeof url === "object") {
			options = url;
			url = undefined;
		}else{
			if(options==undefined){
				options={};
			}
			options.url=url;
		}
			var ajaxCacheOptions = options.cacheConfig || {};
			var cacheProxy = new CacheProxy(ajaxCacheOptions);
			if (ajaxCacheOptions) {
					var storage = cacheProxy.getStorage(ajaxCacheOptions.storageType);
					if (storage.isSupported()) {
						try {
							var cacheKey = cacheProxy.genCacheKey(options, ajaxCacheOptions.preGenCacheKey);
							var value = storage.get(cacheKey);
							if (value && ajaxCacheOptions.forceRefresh !== true&&$.ajaxCacheRefresh===false) {
								if (options.success) {
									options.success(value);
									return;
								}
							}
							// force reflash cache
							if (ajaxCacheOptions.forceRefresh === true||$.ajaxCacheRefresh===true) {
								storage.delete(cacheKey);
								value = null;
							}

							if (!value) {
								// If it not in the cache, we store the data, add success callback - normal callback will proceed
								var realsuccess;
								if (options.success) {
									realsuccess = options.success;
								}
								options.success = function (data) {
									var exp = cacheProxy.defaultTimeout;
									if (typeof ajaxCacheOptions.timeout === 'number') {
										exp = ajaxCacheOptions.timeout;
									}
									try {
										var cacheValidateFun = ajaxCacheOptions.cacheValidate || cacheProxy.getCacheValidateFun();
										if (typeof cacheValidateFun === 'function') {
											if (cacheValidateFun.call(null, data, options)) {
												// 业务逻辑的判断这个请求是否真正成功的请求。
												storage.set(cacheKey, data, { exp: exp });
											}
										} else {
											console.error('cacheValidate must be a Function');
										}
									} catch (e) {
										console.error(e);
									}
									if (realsuccess) realsuccess(data);
								};
							}
						} catch (e) {
							console.error(e);
						}
					}
		}
		if(url!=undefined){
			$.ajax(url,options);
		}else{
			$.ajax(options);
		}
	}
})(jQuery, window);
(function(e) {
	e.retryAjax = function(t) {
		var n;
		t.tryCount = t.tryCount ? t.tryCount : 0, t.retryLimit = t.retryLimit ? t.retryLimit : 2, t.suppressErrors = !0,
			t.error ? (n = t.error, delete t.error) : n = function() {}, t.complete = function(t, r) {
				if (e.inArray(r, ["timeout", "abort", "error", "parsererror"]) > -1) return this.tryCount++, this.tryCount <=
					this.retryLimit ? (this.tryCount === this.retryLimit && (this.error = n, delete this.suppressErrors), e.ajax(
						this), !0) : (console.log(
						"There was a server error.  Please refresh the page.  If the issue persists, give us a call. Thanks!"), !0)
			}, t.cache?e.ajaxCache(t):e.ajax(t)
	}
})(jQuery);