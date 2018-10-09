/*
* @Author: Suoping
* @Date:   2018-08-28 15:13:50
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-28 17:15:14
*/

Component({
	properties: {
		data: {
			type: Array,
			value: ['aa','bb','cc'],
		},
		cancel: {
			type: String,
			value: '取消',
		},
	},
	data: {
		visible: false,
	},
	methods: {
		open(){
			this.setData({ visible: true });
		},
		close(){
			this.setData({ visible: false });
		},
		clickHandler(e){
			this.triggerEvent('confirm', { value: e.target.dataset.index });
			this.close();
		}
	},
})