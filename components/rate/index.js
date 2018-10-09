/*
* @Author: Suoping
* @Date:   2018-08-28 00:58:46
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-29 16:57:06
*/

Component({
	properties: {
		count: {
			type: Number,
			value: 5,
		},
		value: {
			type: Number,
			value: 0,
			observer: function(v){
				v = v < this.data.count?v:this.data.count - 1;
				v = v < 0?0: v;
				this.setData({ aValue: v });
				return v;
			}
		}
	},
	data: {
		aValue: 0,
	},
	methods: {
		starHandler(e){
			this.setData({ aValue: e.target.dataset.index });
			this.triggerEvent('change', { value: this.data.aValue });
		}
	},
	attached(){},
})