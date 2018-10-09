/*
* @Author: Suoping
* @Date:   2018-08-15 18:51:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-22 21:58:02
*/


Component({
	properties: {
		placeholder: String,
		type: {
			type: String,
			value: 'text',
		},
		icon: String,
		confirmType: {
			type: String,
			value: 'search'
		},
		editable:{
			type: Boolean,
			value: true,
		}
	},
	data: {
		value: '',
		active: false,
		clearClick: false,
	},
	methods: {
		inputHandler(e){
			return {
				value: e.detail.value.replace(/[\\\-\[\`\~\!\@\#\$\%\^\&\*\(\)\+\=\|\{\}\'\:\;\'\,\.\<\>\/\?\~\！\@\#\￥\%\…\…\&\*\（\）\—\—\+\|\{\}\【\】\‘\；\：\”\“\’\。\，\、\？\]]/g, ''),
			}
		},
		confirmHandler(e){
			this.setData({
				value: e.detail.value,
			})
			this.cancelHandler();
			this.triggerEvent('search', { value: this.data.value });
		},
		focusHandler(e){
			this.setData({
				active: true,
				clearClick: false,
			})
			this.triggerEvent('open');
		},
		clearHandler(){
			this.setData({
				value: '',
				clearClick: true,
			})
			this.triggerEvent('clear');
		},
		cancelHandler(){
			this.setData({
				active: false,
			})
			this.triggerEvent('cancel');
			if(this.data.clearClick){
				this.triggerEvent('search', { value: this.data.value });
			}
		},
		setup(v){
			this.setData({
				value: v,
				clearClick: false,
			})
		},
	},
	attached(){},
})