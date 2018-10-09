/*
* @Author: Suoping
* @Date:   2018-08-18 16:29:32
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-28 17:37:54
*/

Component({
	properties: {
		title: {
			type: String,
			value: '按钮',
		},
		border: {
			type: Boolean,
			value: false,
		},
		disabled: {
			type: Boolean,
			value: false,
		},
	},
	data: {},
	methods: {
		tapHandler(e){
			if(this.data.disabled)return;
			this.triggerEvent('tap');
			this.triggerEvent('confirm');
		},
	},
	attached(){},
})