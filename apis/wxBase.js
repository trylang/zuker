import './wxPromise.min.js';

let API_PATH = `https://wx-mini.rtmap.com/rtmap-tenant/`;
	API_PATH = `https://merchants.rtmap.com/rtmap-tenant/`;
let token = wx.getStorageSync('token');
const interceptors = (res, mode) => {
	if(res.statusCode == 200){
		let aData = res.data;
			aData.code = aData.code || aData.status || aData.errCode || aData.statusCode;
			aData.msg = aData.msg || aData.message || aData.errMsg || aData.statusMsg;
			aData.data = aData.data;
		switch(Object.prototype.toString.call(aData.data)){
			case '[object String]':
			case '[object Number]':
			case '[object Boolean]':
				aData.data = { value: aData.data };
			break;
			case '[object Array]':
				aData.data = { list: aData.data };
			break;
			case '[object Object]':
				//为对象时不需要处理, 这正是我们需要的结果;
			break;
			default:
				aData.data = {};
			break;
		}
		aData = { code: aData.code, msg: aData.msg, data: aData.data };
		if(mode && /^list$/i.test(mode)){
			aData.data = {
				page: aData.data.page || 1,
				total: aData.data.total || 0,
				list: aData.data.list || [],
			};
		}
		if(!token && aData.data.token){
			try {
			    wx.setStorageSync('token', aData.data.token);
			} catch (e) {}
			token = aData.data.token;
		}
		if(aData.code == 200){
			if(!token && aData.data && aData.data.token){
				token = aData.data.token;
			}
			return aData;
		}
		if(aData.code == 514 || aData.code == 60003){
			wx.removeStorageSync('token');
			return '/login';
		}
		return aData;
	}

	return { msg: '网络出现故障!' };
}
const request = ({url, data, method = "GET", header = {'content-type': 'application/json'}, withToken = true, mode = 'info'}) => {
	method = /^(get|post|options|put|delete)$/i.test(method)?method.toUpperCase():'GET';
	header = header || {'content-type': 'application/json'};
	if(withToken) header['token'] = token;
	if(/user\/login$/gi.test(url)){
		token = null;
		try {
			wx.removeStorageSync('token');
		} catch (e) {
		};
	}
	return new Promise((resolve, reject)=>{
		let fullUrl = (/^http/i.test(url)?'':API_PATH)+url;
		if (url.indexOf('app-face/') >= 0) { // 面对面接口地址调整
			fullUrl = fullUrl.replace('rtmap-tenant/', '');
		} 
		return wx.pro.request({ url: fullUrl, data, method, header }).then(res => {
			let aRes = interceptors(res, mode);
			if(aRes && aRes.code == 200){
				resolve(aRes);
			}else if(aRes == '/login'){
				wx.navigateTo({ url: '/pages/login/index' })
			}else{
				reject(aRes);
			}
		}).catch(res => {
			let aRes = interceptors(res, mode);
			reject(aRes);
		})
	})
}

let _get = function(url, data, header){ return request({url, data, method:'GET', header}); };
	_get.list = function(url, data, header){ return request({url, data, method:'GET', header, mode:'list'}); };
	_get.list.simple = function(url, data, header){ return request({url, data, method:'GET', header, withToken:false, mode:'list'}); };
	_get.simple = function(url, data, header){ return request({url, data, method:'GET', header, withToken:false}); };
	_get.simple.list = function(url, data, header){ return request({url, data, method:'GET', header, withToken:false, mode:'list'}); };
let _post = function(url, data, header){ return request({url, data, method:'POST', header}); };
	_post.list = function(url, data, header){ return request({url, data, method:'POST', header, mode:'list'}); };
	_post.list.simple = function(url, data, header){ return request({url, data, method:'POST', header, withToken:false, mode:'list'}); };
	_post.simple = function(url, data, header){ return request({url, data, method:'POST', header, withToken:false}); };
	_post.simple.list = function(url, data, header){ return request({url, data, method:'POST', header, withToken:false, mode:'list'}); };
let _token = function(){ return token; };

module.exports = {
	$path : API_PATH,
	$getToken: _token,
	$get : _get,
	$post : _post,
}
