/*
* @Author: Suoping
* @Date:   2018-08-16 15:49:14
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-18 16:46:24
*/

Component({
	properties: {
		title: {
			type: String,
			value: '确定'
		},
	},
	methods: {
		tapHandler(e){
			this.triggerEvent('confirm');
		}
	},
	attached(){},
})