/*
* @Author: Suoping
* @Date:   2018-08-17 00:05:19
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-17 01:17:57
*/


Component({
	options: {
		multipleSlots: true,
	},
	properties: {
		button: {
			type: String,
			value: '投放',
		},
		extend: {
			type: Array,
			value: [],
		}
	},
	data:{},
	methods: {
		tapHandler(){
			this.triggerEvent('confirm');
		},
	},
	attached(){},
})