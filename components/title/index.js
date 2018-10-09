/*
* @Author: Suoping
* @Date:   2018-08-16 15:49:14
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-17 01:01:33
*/

Component({
	properties: {
		title: {
			type: String,
			value: '',
		},
		extend: {
			type: String,
			value: '更多',
		},
		href: {
			type: String,
			value: '',
		},
	},
	methods: {
		routerHandler(e){
			if(this.data.href){
				wx.navigateTo({ url: this.data.href });
			}
		},
	},
	attached(){},
})