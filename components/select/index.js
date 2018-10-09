/*
* @Author: Suoping
* @Date:   2018-08-16 12:21:59
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-29 18:14:42
*/

Component({
	properties: {
		list: {
			type: Array,
			value: [],
		},
		listPlacehoder: {
			type: Array,
			value: [{ id: null, value: '空' }],
		},
		placeholder: {
			type: String,
			value: '',
		},
		placeholderColor: {
			type: String,
			value: '',
		},
		placeholderAlign: {
			type: String,
			value: '',
		},
	},
	data: {
		id: null,
		value: '',
		active: false,
	},
	methods: {
		toogleHandler(){
			this.setData({ active: !this.data.active, })
			if(this.data.active){
				this.triggerEvent('open');
			}else{
				this.cancelHandler();
			}
		},
		cancelHandler(e){
			this.setData({ active: false, })
			this.triggerEvent('close');
		},
		confirmHandler(e){
			let aSet = e.target.dataset;
			this.setData({ id: aSet.id, value: aSet.value, })
			this.triggerEvent('change', aSet);
			this.cancelHandler();
		},
		setup({id, value}){
			this.setData({ id, value })
		},
		reset(){
			this.setData({ active: false, })
		},
	},
	attached(){},
})