/*
* @Author: Suoping
* @Date:   2018-08-18 10:52:42
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-18 12:00:45
*/

Component({
	properties: {
		data: {
			type: Array,
			value: [],
		},
		index: {
			type: Number,
			value: 0,
		},
	},
	data: {},
	methods: {
		tapHandler(e){
			this.setData({ selectIndex: e.currentTarget.dataset.index });
			this.triggerEvent('tap', this.data.selectIndex);
		},
	},
	attached(){},
})