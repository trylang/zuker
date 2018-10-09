/*
* @Author: Suoping
* @Date:   2018-08-16 15:49:14
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-28 17:38:16
*/

Component({
	properties: {
		title: {
			type: String,
			value: '提示',
		},
		cancel: {
			type: String,
			value: '取消',
		},
		confirm: {
			type: String,
			value: '确定',
		},
	},
	data: {
		titleText: '',
		contentText: '',
		active: false,
	},
	methods: {
		confirmHandler(e){
			this.cancelHandler();
			this.triggerEvent('confirm');
		},
		cancelHandler(){
			this.setData({
				titleText: '',
				contentText: '',
				active: false,
			})
			this.triggerEvent('cancel');
		},
		alert(content = '', title = ''){
			this.setData({
				titleText: title,
				contentText: content,
				active: true,
			})
		},
		open(content = '', title = ''){
			this.alert(content, title);
		},
		close(){
			this.cancelHandler();
		},
	},
	attached(){},
})