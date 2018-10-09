/*
* @Author: Suoping
* @Date:   2018-08-28 15:43:55
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 03:58:40
*/

let buildSourceList = [];
Page({
	data: {
		title: null,
		buildList: [
			/*{ id: 0, value: '商业A楼' },
			{ id: 1, value: '商业B楼' },*/
		],
		floorList: [
			/*{ id: 0, value: 'B1' },
			{ id: 1, value: 'F1' },*/
		],
		repairTypeList: [
			/*{ id: 0, value: '水' },
			{ id: 1, value: '电' },*/
		],
		detail: null,
		hideDetail: false,
		slider: [/*{id: 1, img:'../../../../assets/test.jpg'}*/],
	},
	onLoad(){
		getApp().api.getBuildCate().then(res => {
			buildSourceList = [...res];
			this.setData({ buildList: res.map(b => { return{ id: b.id, value: b.value } }) });
		})
		getApp().api.getRepairCate().then(res => {
			this.setData({ repairTypeList: [...res] });
		})
	},
	buildCloseHandler(e){
		let aBuildId = this.selectComponent('#selectBuild').data.id;
		if(aBuildId){
			this.setData({ floorList: buildSourceList.find(b => b.id == aBuildId).floor.map(f => { return{ id: f.id, value: f.value } }) });
		}
		this.showDetailHandler();
	},
	titleHandler(e){
		this.setData({ title: e.detail.value });
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
		if(!this.data.title || !/\S/g.test(this.data.title)){
			wx.showToast({
				title: '请输入标题名称!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
		}
		if(!/\S/g.test(this.selectComponent('#selectBuild').data.id)){
			wx.showToast({
				title: '选择建筑物!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
		}
		if(!/\S/g.test(this.selectComponent('#selectFloor').data.id)){
			wx.showToast({
				title: '请选择楼层!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
		}
		if(!/\S/g.test(this.selectComponent('#selectType').data.id)){
			wx.showToast({
				title: '请选择维修类型!',
				icon: 'none', // "success", "loading", "none"
				duration: 3000,
			})
			return;
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
			title: '保存中...',
			mask: true,
		})
		getApp().api.addRepairOrder({
			title: this.data.title,
			buildId: this.selectComponent('#selectBuild').data.id,
			floorId: this.selectComponent('#selectFloor').data.id,
			repairCate: this.selectComponent('#selectType').data.id,
			detail: this.data.detail,
			photos: this.data.slider.map(s => s.id),
		}).then(res => {
			this.setData({ slider: [] });
			wx.hideLoading();
			wx.showToast({
				title: '保存成功',
				icon: 'success', // "success", "loading", "none"
				duration: 3000,
			})
			setTimeout(() => {
				getApp().push('/package_estate/pages/repair/index');
			}, 2500);
		}).catch(res => {
			wx.hideLoading();
			wx.showModal({
				title: '操作失败',
				content: res.msg,
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
		})
	},
})