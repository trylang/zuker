/*
* @Author: Suoping
* @Date:   2018-08-22 14:02:03
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-25 02:08:26
*/

Component({
	properties: {
		back: {
			type: Boolean,
			value: true,
		},
		label: {
			type: String
		}
	},
	data: {
		title: '商户通',
		appPages: 0,
		ipx: false,
	},
	methods: {
		backHandler(){
			getApp().go(-1);
		}
	},
	attached(){
		let aPages = getCurrentPages();
		this.setData({ appPages: aPages.length, ipx: getApp().globalData.ipx });
		if(/^pages\/index/gi.test(aPages[0].is)){
			this.setData({ title: '营销宝' });
		}else if(/^package_datacenter\//gi.test(aPages[0].is)){
			this.setData({ title: '数据罗盘' });
		}else if(/^package_estate\//gi.test(aPages[0].is)){
			this.setData({ title: '物业管理' });
		}else if(/^pages\/user\//gi.test(aPages[0].is)){
			this.setData({ title: '我的' });
		}else if(/^package_admin\/estate\//gi.test(aPages[0].is)){
			this.setData({ title: '物业管理' });
		}else if(/^package_admin\//gi.test(aPages[0].is)){
			this.setData({ title: '营销宝' });
		}
	},
})