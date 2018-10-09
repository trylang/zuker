/*
* @Author: Suoping
* @Date:   2018-08-16 15:49:14
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-21 15:35:40
*/

Component({
	properties: {
		data: {
			type: Array,
			value: [],
		},
		customerData: {
			type: Array,
			value: [],
		},
		bgColor: {
			type: String
		},
		index: {
			type: Number,
			value: 0,
		},
	},
	data: {},
	methods: {
		tapHandler(e){
			this.triggerEvent('change', e.currentTarget.dataset.index);
		},
	},
	attached(){},
})