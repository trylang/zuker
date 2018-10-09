/*
* @Author: Suoping
* @Date:   2018-08-28 15:43:55
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 03:58:22
*/

Page({
	data: {
		modeId: 0,
		modeList: [
			{ id: 0, value: '免费维修' },
			{ id: 1, value: '有偿维修' },
		],
		priceList: [],
		detail: null,
		hideDetail: false,
		slider: [/*'../../../../assets/test.jpg'*/],
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ id: opts.id })
			this.selectComponent('#modeSelect').setup({ id: this.data.modeId, value: this.data.modeList.find(item => item.id == this.data.modeId).value })
			getApp().api.getFeeNameList().then(res => {
				this.setData({ priceList: [...res] });
			})
		}else{
			getApp().go(-1);
		}
	},
	modeHandler(e){
		this.setData({ modeId: e.detail.id });
	},
	priceHandler(e){
		this.setData({ ['priceList['+e.currentTarget.dataset.index+'].price']: Number(e.detail.value) });
	},
	hideDetailHandler(){
		this.setData({ hideDetail: true });
	},
	showDetailHandler(){
		this.setData({ hideDetail: false });
	},
	detailHandler(e){
		this.setData({ detail: e.detail.value });
	},
	sliderDeleteHandler(e){
		wx.showModal({
			title: '删除确认',
			content: '您确定要删除当前图片吗?',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#3CC51F',
			success: (res) => {
				if(res.confirm) {
					let aIndex = e.currentTarget.dataset.index;
					for(let i = aIndex; i< this.data.slider.length - 1; i++){
						this.setData({
							['slider['+i+'].id']: this.data.slider[i+1].id,
							['slider['+i+'].img']: this.data.slider[i+1].img
						});
					}
					this.setData({ slider: this.data.slider.slice(0,-1) });
				}
			},
		})
	},
	chooseImageHandler(e){
		wx.chooseImage({
			count: 1,
			success: res => {
				let aSize = res.tempFiles[0].size/1024;
				let maxSize = Number(e.currentTarget.dataset.size);
				if(aSize > maxSize){
					wx.showToast({ title: '图片超过指定容量, 请选择小于'+maxSize+'kb的图片!', icon: 'none', duration: 2000, });
					return;
				}
				let tmpImageUpload = res.tempFilePaths.map(item => {
					return{
						value: item,
						type: e.currentTarget.dataset.type,
						index: e.currentTarget.dataset.index,
					}
				})
				if(!tmpImageUpload.length)return;
				let aFile = tmpImageUpload[0];
				wx.showLoading({
					title: '努力上传中...',
					mask: false,
				})
				wx.uploadFile({
					url: getApp().api.getApiPath() + 'file/upload',
					filePath: aFile.value,
					name: 'file',
					header: { token: getApp().api.getToken() },
					success: res => {
						wx.hideLoading();
						wx.showToast({
							title: '上传成功',
							icon: 'success',
						})
						let aID = JSON.parse(res.data).data.id;
						let aIMG = JSON.parse(res.data).data.url;
						switch(aFile.type){
							case 'slider':
								this.setData({ slider: [...this.data.slider, {id: aID, img:aIMG}] });
							break;
						}
					},
					fail: ({errMsg}) => {
						wx.hideLoading();
						wx.showToast({
							title: '上传失败: '+errMsg,
							icon: 'none',
						})
					}
				})
			},
			fail: ({errMsg}) => {
				wx.showToast({ title: '取消图片上传!', icon: 'none', duration: 2000, })
			}
		})
	},
	confirmHandler(e){
		if(!/\S/g.test(this.selectComponent('#modeSelect').data.id)){
			wx.showToast({
				title: '请选择维修方式!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
		}
		if(this.selectComponent('#modeSelect').data.id == 1){
			if(!this.data.priceList.find(item => item.price > 0)){
				wx.showToast({
					title: '请至少输入一种金额!',
					icon: 'none', // "success", "loading", "none"
					duration: 3000,
				})
				return;
			}
		}
		if(!this.data.detail || !/\S/g.test(this.data.detail)){
			wx.showToast({
				title: '请输入报修内容!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
		}
		if(!this.data.slider.length){
			wx.showToast({
				title: '请上传至少一张图片!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
		}

		wx.showLoading({
			title: '提交中...',
			mask: true,
		})
		let aParam = {
			id: this.data.id,
			mode: this.data.modeId,
			detail: this.data.detail,
			photos: (this.data.slider||[]).map(item => item.id),
		}
		if(this.data.modeId){
			aParam['priceList'] = (this.data.priceList||[]).map(item=>{return{feeItemId: item.id, amount: item.price}});
		}
		getApp().api.resolveRepairOrder(aParam).then(res => {
			this.setData({ slider: [] });
			wx.hideLoading();
			wx.showToast({
				title: '提交成功',
				icon: 'success', // "success", "loading", "none"
				duration: 3000,
			})
			setTimeout(() => {
				getApp().push('/package_estate/pages/repair/index')
			}, 2500);
		}).catch(res => {
			wx.hideLoading();
			wx.showToast({
				title: '提交失败',
				icon: 'none',
				duration: 3000,
			})
		})
	},
})