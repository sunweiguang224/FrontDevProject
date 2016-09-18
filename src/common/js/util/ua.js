/**
 * Created by weiguangsun on 2016/6/17.
 * 判断当前平台类型
 */
function Ua(){
	this.ua = navigator.userAgent;
	this.cache = {};
}
Ua.prototype = {
	match: function(regexStr){
		return new RegExp(regexStr, 'g').exec(this.ua) ? true : false;
	},
	getFromCache: function(cacheName, regStrArray){
		// 如果未缓存过cache[cacheName]，则缓存对正则数组regStrArray匹配的结果
		if(this.cache[cacheName] === undefined){
			// 正则数组regStrArray匹配的结果
			var cacheValue;
			for(var i in regStrArray){
				cacheValue = this.match(regStrArray[i]);
				if(cacheValue){
					break;
				}
			}
			// 缓存
			this.cache[cacheName] = cacheValue;
		}
		// 返回缓存中的值
		return this.cache[cacheName];
	},
	/**
	 * chrome浏览器
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; Android 6.0; MI 5 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.108 Mobile Safari/537.36
	 * ios		Mozilla/5.0 (iPod; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/51.0.2704.64 Mobile/13F69 Safari/601.1.46
	 */
	isChrome: function(){
		return this.getFromCache(arguments.callee.name, ['Chrome', 'CriOS']);
	},
	/**
	 * uc浏览器
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; U; Android 6.0; zh-CN; MI 5 Build/MRA58K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/10.10.3.810 U3/0.8.0 Mobile Safari/534.30
	 * ios		Mozilla/5.0 (iPod touch; CPU iPhone OS 9_3_2 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/13F69 UCBrowser/10.9.16.802 Mobile
	 */
	isUc: function(){
		return this.getFromCache(arguments.callee.name, ['UCBrowser']);
	},
	/**
	 * QQ浏览器
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; U; Android 6.0; zh-cn; MI 5 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/37.0.0.0 MQQBrowser/6.7 Mobile Safari/537.36
	 * ios		Mozilla/5.0 (iPod touch; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/6.0 MQQBrowser/6.7.2 Mobile/13F69 Safari/8536.25 MttCustomUA/2
	 */
	isQqBrowser: function(){
		return this.getFromCache(arguments.callee.name, ['MQQBrowser']);
	},
	/**
	 * 小米系统浏览器
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; U; Android 6.0; zh-cn; MI 5 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.85 Mobile Safari/537.36 XiaoMi/MiuiBrowser/2.1.1
	 */
	isXiaoMiBrowser: function(){
		return this.getFromCache(arguments.callee.name, ['XiaoMi/MiuiBrowser']);
	},
	/**
	 * safari浏览器
	 * @returns {true | false}
	 * ios		Mozilla/5.0 (iPod touch; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13F69 Safari/601.1
	 */
	isSafari: function(){
		return this.getFromCache(arguments.callee.name, ['Version/\\d?[.]\\d Mobile/.* Safari/.*']);
	},
	/**
	 * 新浪微博
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; Android 6.0; MI 5 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.76 Mobile Safari/537.36 Weibo (Xiaomi-MI 5__weibo__6.6.0__android__android6.0)
	 * ios		Mozilla/5.0 (iPod touch; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13F69 Weibo (iPod5,1__weibo__5.4.0__iphone__os9.3.2)
	 */
	isSinaWeiBo: function(){
		return this.getFromCache(arguments.callee.name, ['Weibo']);
	},
	/**
	 * QQ+QQ空间（QQ和QQ空间ua相同）
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; Android 6.0; MI 5 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036522 Safari/537.36 V1_AND_SQ_6.3.7_374_YYB_D QQ/6.3.7.2795 NetType/WIFI WebP/0.3.0 Pixel/1080
	 * ios		Mozilla/5.0 (iPod touch; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13F69 QQ/6.3.5.437 V1_IPH_SQ_6.3.5_1_APP_A Pixel/640 Core/UIWebView NetType/WIFI Mem/12
	 */
	isQq: function(){
		return this.getFromCache(arguments.callee.name, ['QQ']);
	},
	/**
	 * 微信+朋友圈（微信和朋友圈ua相同）
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; Android 6.0; MI 5 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.2 TBS/036523 Safari/537.36 MicroMessenger/6.3.18.800 NetType/WIFI Language/zh_CN
	 * ios		Mozilla/5.0 (iPod touch; CPU iPhone OS 9_3_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13F69 MicroMessenger/6.3.19 NetType/WIFI Language/zh_CN
	 */
	isWeiXin: function(){
		return match('Weibo');
		return this.getFromCache(arguments.callee.name, ['MQQBrowser']);
	},
	/**
	 * 支付宝
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; U; Android 6.0; zh-cn; MI 5 Build/MRA58K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/1.0.0.100 U3/0.8.0 Mobile Safari/534.30 AlipayDefined(nt:WIFI,ws:360|640|3.0) AliApp(AP/9.6.8.053103) AlipayClient/9.6.8.053103 Language/zh-Hans
	 * ios		Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13E233 ChannelId(12) Nebula PSDType(1) AlipayDefined(nt:WIFI,ws:320|504|2.0) AliApp(AP/9.6.6.05070802) AlipayClient/9.6.6.05070802 Language/zh-Hans
	 */
	isAlipay: function(){
		return match('AlipayClient');
		return this.getFromCache(arguments.callee.name, ['AlipayClient']);
	},
	/**
	 * 搜狐新闻客户端
	 * @returns {true | false}
	 * android	Mozilla/5.0 (Linux; Android 6.0; MI 5 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.76 Mobile Safari/537.36 SohuNews/5.6.0 BuildCode/106 JsKit/1.0 (Android)
	 * ios		Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13E233 JsKit/1.0 (iOS)
	 */
	isSohuNewsClient: function(){
		return this.getFromCache(arguments.callee.name, ['SohuNews', 'JsKit']);
	},
	/**
	 * android
	 * @returns {true | false}
	 */
	isAndroid: function(){
		return this.getFromCache(arguments.callee.name, ['Android']);
	},
	/**
	 * ios
	 * @returns {true | false}
	 */
	isIos: function(){
		return this.getFromCache(arguments.callee.name, ['iPhone']);
	},
};
Ua.prototype.constructor = Ua;


// 按CommonJS规范导出
if(module && module.exports){
	module.exports = new Ua();
}