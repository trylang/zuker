/*
* @Author: Suoping
* @Date:   2018-08-14 19:49:22
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-24 12:25:07
*/

let admin = require('./api.admin.js');
let datacenter = require('./api.datacenter.js');
let estate = require('./api.estate.js');
let marketing = require('./api.marketing.js');
let user = require('./api.user.js');
let facetoface = require('./api.facetoface.js');

let aExports = {};
for(let i in admin){
	aExports[i] = admin[i];
}
for(let i in datacenter){
	aExports[i] = datacenter[i];
}
for(let i in estate){
	aExports[i] = estate[i];
}
for(let i in marketing){
	aExports[i] = marketing[i];
}
for(let i in user){
	aExports[i] = user[i];
}
for(let i in facetoface){
	aExports[i] = facetoface[i];
}

/**
 * 以下为全局使用的上划屏幕刷新功能函数;
 */
aExports['lazy'] = { 
	page: 1,
	totalPage: 1,
	_running: false,
	_fun: null,
	_params: null,
	res: function(res){
		this._running = false;
		this.totalPage = Math.ceil(res.total/10);
	},
	loadNext: function(){
		if(this.page  < this.totalPage && this._fun && !this._running){
			this.page = this.page + 1;
			this._params['page'] = this.page;
			this._params['pageSize'] = 10;
			this._fun(this._params);
			wx.showLoading({
				title: '加载中...',
				mask: true,
			})
			setTimeout(()=>{
				wx.hideLoading();
			}, 500)
		}
	},
	init: function(fun, params){
		this.page = 1;
		this.totalPage = 1;
		this._fun = fun;
		this._params = params || {};
		if(this._fun){
			this._running = true;
			this._params['page'] = this.page;
			this._params['pageSize'] = 10;
			this._fun(this._params);
			wx.showLoading({
				title: '加载中...',
				mask: true,
			})
			setTimeout(()=>{
				wx.hideLoading();
			}, 500)
		}
	}
}

module.exports = aExports;