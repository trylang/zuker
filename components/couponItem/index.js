/*
* @Author: Suoping
* @Date:   2018-08-16 15:49:14
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-23 15:18:21
*/

Component({
	options: {
		multipleSlots: true,
	},
	properties: {
		size: {
			type: Number,
			value: 140,
		},
		cover: {
			type: String,
			value: '',
		},
		type: {
			type: String,
			value: '',
			observer: function(v){
				if(/^(normal|cash|discount|gift|free|brand|single)$/i.test(v)) return v.toLowerCase();
				return '';
			}
		},
		tag: {
			type: String,
			value: '',
			observer: function(v, ov){
				if(/^(pending|resolve|reject|end)$/i.test(v)){
					let aSet = {
						"pending": { color: "#ff7575", text: '待审核' },
						"resolve": { color: "#ff5400", text: '投放中' },
						"reject": { color: "#3a6dc4", text: '已驳回' },
						"end": { color: "#999", text: '已结束' },
					}[v.toLowerCase()];
					this.setData({
						tagTextStr: aSet.text,
						tagColorStr: aSet.color,
					})
					return v;
				}
				this.setData({
					tagTextStr: v,
				})
				return v;
			}
		},
		tagColor: {
			type: String,
			value: '#999',
			observer: function(v){
				this.setData({
					tagColorStr: v || '#999',
				})
			}
		},
		title: {
			type: String,
			value: '',
		},
		extend: {
			type: Array,
			value: [],
		}
	},
	data:{
		tagTextStr: '',
		tagColorStr: '',
	},
	methods: {},
	attached(){},
})