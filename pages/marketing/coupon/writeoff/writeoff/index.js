/*
* @Author: Suoping
* @Date:   2018-08-18 13:34:45
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-24 17:10:37
*/

let util = require('../../../../../utils/util.js');

Page({
	data: {
		qrcode: '',
		title: '',
		extend: '',
		id: '',
		info: [
			/*{ label: '所属活动', value: '猴赛雷摇一摇第一波', },
			{ label: '所属店铺', value: '小军电玩店', },
			{ label: '核销店铺', value: '阿军', },*/
		],
	},
	onLoad(opts){
		if(opts.qrcode){
			this.setData({ qrcode: opts.qrcode });
			getApp().api.getCouponInfoByWriteoffQrcode({ qrcode: opts.qrcode }).then(res => {
				if(res.qrcode && res.qrcode == this.data.qrcode && res.writeoffTime){
					this.setData({
						title: res.title,
						extend: res.subTitle||'',
						id: util.formatCode(res.qrcode),
						info: [
							{ label: '所属活动', value: res.activityName, },
							{ label: '核销店铺', value: res.writeOffName, },
							{ label: '核销用户', value: res.writeoffUser, },
							{ label: '核销时间', value: res.writeoffTime, },
						],
					})
				}else{
					wx.showModal({
						title: '信息无效',
						content: '提示: 您输入的券码找不到对应的卡券!',
						showCancel: false,
						confirmText: '重新输入',
						confirmColor: '#3CC51F',
						success: (res) => {
							if(res.confirm) {
								getApp().replace('/pages/marketing/coupon/writeoff/index');
							}
						}
					})
				}
			}).catch(res => {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					duration: 2500,
					mask: false,
					complete: (res) => {
						setTimeout(()=>{
							getApp().replace('/pages/marketing/coupon/writeoff/index');
						}, 3000)
					}
				})
			})
		}else{
			getApp().replace('/pages/marketing/coupon/writeoff/index');
		}
	},
	homeHandler(){
		//getApp().replace('/pages/marketing/coupon/writeoff/index');
		getApp().replace('/pages/index/index');
	},
	scanHandler(e){
		wx.scanCode({
			onlyFromCamera: true,
			success: (res) => {
				getApp().push('/pages/marketing/coupon/writeoff/index?code='+res.result);
			}
		})
	},
})