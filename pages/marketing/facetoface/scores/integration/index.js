let tmpImageUpload = [];
let globalData = getApp().globalData;
let customerInfo = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
		customerInfo: null,
		amount: '',
		avatar: '/assets/icon_avatar.png',
		slider: []
    // slider: [{
    //   imgUrl: '../../../../../assets/test.jpg'
    // }]
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
				tmpImageUpload = res.tempFilePaths.map(item => {
					return{
						value: item,
						type: e.currentTarget.dataset.type,
						index: e.currentTarget.dataset.index,
					}
				})
				this.uploadImageHandler();
			},
			fail: ({errMsg}) => {
				wx.showToast({ title: '取消图片上传!', icon: 'none', duration: 2000, })
			}
		})
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
						this.setData({ ['slider['+i+'].imgUrl']: this.data.slider[i+1].imgUrl });
					}
					this.setData({ slider: this.data.slider.slice(0,-1) });
				}
			},
		})
	},
  uploadImageHandler(e){
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
        let aIMG = JSON.parse(res.data).data.url;
				switch(aFile.type){
					case 'slider':
						this.setData({ slider: [...this.data.slider, { imgUrl: aIMG, imgType: 0 }] });
					break;
					case 'modify':
						this.selectComponent('#html_modify_'+aFile.index).setup(aIMG);
					break;
					case 'append':
						this.selectComponent('#html_comp_'+aFile.index).setup(aIMG);
					break;
				}
				tmpImageUpload.shift();
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
	inputHandler(e) {
		this.setData({amount: e.detail.value})
	},
  nextHandler() {
		if(Number(this.data.amount) <= 0) {
			wx.showToast({
				title: '金额必须大于0！',
				icon: 'none',
			})
			return;
		};
		if(this.data.amount.indexOf('.') >= 0 && this.data.amount.split('.')[1].length > 2) {
			wx.showToast({
				title: '金额最多可保留两位小数！',
				icon: 'none',
			})
			return;
		};
		let param = {
			tenantType: 1,
			tradeTenantType: 2 || globalData.type,
			tenantId: globalData.marketId,
			tradeTenantId: globalData.type == 1 ? globalData.marketId : globalData.shopId,
			shopId: globalData.shopId,
			openId: customerInfo.openId, 
			mobile: customerInfo.mobile,
			cid: customerInfo.cid,
			amount: this.data.amount * 100,
		};
		this.data.slider.forEach((item, index) => {
			param[`receiptImage${index+1}`] = item.imgUrl;
		});
		getApp().api.postScoreInfo(param).then(res => {
			wx.setStorageSync('CustomerInfo', Object.assign({}, customerInfo, res));
			getApp().push('/pages/marketing/facetoface/scores/finish/index');
		}).catch(err => {
			wx.showToast({
				title: err.msg,
				icon: 'none',
				duration: 2500,
				mask: false,
			});
		});
	},
	onLoad(options) {
		customerInfo = wx.getStorageSync('CustomerInfo');
		if (!customerInfo.icon) customerInfo.icon = '/assets/icon_avatar.png';
		this.setData({customerInfo});
	}
})