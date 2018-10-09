/*
* @Author: Suoping
* @Date:   2018-08-23 19:14:13
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-07 16:07:38
*/

Component({
	properties: {
		size: {
			type: Number,
			value: 100,
		},
		maxlength: {
			type: Number,
			value: 100,
		},
	},
	data: {
		mode: true,			//true:图片 false:文本
		content: '',
		delete: false,
	},
	methods: {
		setup(v){
			if(/^<img.*src=.+>$/i.test(v)){
				let aSrc = String(v).replace(/.*src=['"]([^'"]*).*/gi, '$1');
				this.setData({ mode: true, content: aSrc });
			}else{
				this.setData({ mode: false, content: v });
			}
		},
		chooseImageHandler(e){
			this.triggerEvent('choose');
		},
		inputHandler(e){
			this.triggerEvent('input', { value: this.data.content });
		},
		deleteHandler(e){
			wx.showModal({
				title: '删除确认',
				content: '您确定要删除当前'+(this.data.mode?'图片':'文字')+'吗?',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#000000',
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (res) => {
					if(res.confirm) {
						this.setData({ delete: true })
						this.triggerEvent('delete');
					}
				},
			})
		},
	},
	attached(){},
})