// pages/marketing/facetoface/index.js
let util = require('../../../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputFocus: true,
		inputCode: '',
  },
  clearHandler(e){
		this.setData({ inputCode: "", inputFocus: false });
		setTimeout(()=>{
			this.setData({ inputFocus: true });
		}, 100)
	},
  inputChecker(e){
		let aCode = util.formatCode(e.detail.value);
		this.setData({ inputCode: aCode });
		return aCode;
	},
  inputHandler(e){
		return { value: this.inputChecker(e) };
	},
	searchFunc(aCode, searchType) {
		let globalData = getApp().globalData;
		let param = {
			tenantType: 1,
			tenantId: globalData.marketId,
			searchType: searchType || 3, // 查询类型: 1:mobile,3:cardNo,6:username,7:cid
			searchText: aCode
		};
		getApp().api.getCustomerDetail(param).then(data => {
				wx.hideLoading();
				if (!data.cid && !searchType) {
					this.searchFunc(aCode, 1);
					return;
				}
				if(data.cardNo){
					wx.setStorageSync('CustomerInfo', data);
					getApp().push(
						'/pages/marketing/coupon/writeoff/member/index?qrcode='+aCode
					);
				}else{
					wx.showModal({
						title: '提示',
						content: '报歉: 找不到会员码对应的信息!',
						showCancel: true,
						cancelText: '扫码试试',
						cancelColor: '#000000',
						confirmText: '重新输入',
						confirmColor: '#3CC51F',
						success: (res) => {
							if(res.confirm) {
								this.clearHandler();
							}else{
								this.scanHandler();
							}
						},
					})
				}
		}).catch(err => {
			wx.hideLoading();
			if (!searchType) {
				this.searchFunc(aCode, 1);
				return;
			}
			wx.showToast({
				title: err.msg || '找不到会员码对应的信息',
				icon: 'none',
				duration: 2500,
				mask: false,
			})
		});
	},
  scanHandler(e){
		wx.scanCode({
			onlyFromCamera: true,
			success: (res) => {
				let aCode = res.result.replace(/\s/gi, '');
				this.searchFunc(aCode);		
			}
		})
  },
  confirmHandler(e){
    let aCode = '';
		if(e.detail && e.detail.value){
			this.inputChecker(e);
		}
		aCode = this.data.inputCode.replace(/\s/gi, '');
		if(aCode){
			wx.showLoading({
				title: '查询中...',
				mask: true,
			});
			this.searchFunc(aCode);
			
		}else{
			wx.showModal({
				title: '会员码错误',
				content: '提示: 请使用正确的会员码!',
				showCancel: true,
				cancelText: '扫码试试',
				cancelColor: '#000000',
				confirmText: '重新输入',
				confirmColor: '#3CC51F',
				success: (res) => {
					if(res.confirm) {
						this.clearHandler();
					}else{
						this.scanHandler();
					}
				},
			})
		}
  },

})