/*
* @Author: Suoping
* @Date:   2018-08-18 22:48:11
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-22 16:16:21
*/

Component({
	properties: {
		data: Object,
	},
	data: {
		selected: false,
	},
	methods: {
		couponSelectHandler(){
			if(!this.data.selected){
				this.triggerEvent('select');
			}else{
				this.triggerEvent('unselect');
			}
			this.setData({
				selected: !this.data.selected,
			})
		},
		couponAppendHandler(e){
			this.triggerEvent('confirm');
		}
	},
	attached(){},
})