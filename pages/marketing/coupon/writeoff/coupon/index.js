/*
* @Author: Suoping
* @Date:   2018-08-18 13:35:40
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-22 14:47:05
*/

let util = require('../../../../../utils/util.js');

Page({
	data: {
		qrcode: '',
		qrcodeFormat: '',
		avatar: '',
		title: '',
		extend: '',
		id: '',
		info: [
			/*{ label: '所属活动', value: '猴赛雷摇一摇第一波', },
			{ label: '核销有效期', value: '2018.09.01 - 2018.12.31', },
			{ label: '商品成本', value: '10元', },
			{ label: '商品价格', value: '30元', },
			{ label: '使用门槛', value: '消费满100元, 可使用此券', },
			{ label: '使用说明', value: '', },*/
		],
		infoExtend: [],
		writeoffState: false,
	},
	onLoad(opts){
		if(opts.qrcode){
			this.setData({ qrcode: opts.qrcode, qrcodeFormat: util.formatCode(opts.qrcode) });
			getApp().api.getCouponInfoByQrcode({ qrcode: opts.qrcode }).then(res => {
				if(res.qrcode && res.qrcode == this.data.qrcode && res.type){
					let aInfo = [];
						aInfo.push({ label: '所属活动', value: '', });
						
					let aDetail = (res.detail||'').replace(/<br(\/|)>/gi,'\r').match(/[^\r\n\s]+/gi);
					switch(res.type){
						case 'normal':
							aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });


							aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
							aInfo.push({ label: '原价', value: res.coupon.facePrice*0.01+'元' })
							aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
							aInfo.push({ label: '使用说明', value: '' });
						break;
						case 'discount':
							aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
							aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
							aInfo.push({ label: '使用说明', value: '' });
						break;
						case 'gift':
							aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });


							aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
							aInfo.push({ label: '礼品原价', value: res.coupon.unitPrice*0.01+'元' })
							aInfo.push({ label: '使用说明', value: '' });
						break;
						case 'cash':
							aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
							aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
							aInfo.push({ label: '使用说明', value: '' });
						break;
						case 'free':
							aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });

							aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
							aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
							aInfo.push({ label: '使用说明', value: '' });
						break;
						case 'single':
							aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });

							aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
							aInfo.push({ label: '商品原价', value: res.coupon.unitPrice*0.01+'元' })
							aInfo.push({ label: '使用说明', value: '' });
						break;
						case 'brand':
							aDetail = [];
						break;
					}

					this.setData({
						avatar: res.cover,
						title: res.title,
						extend: res.subTitle,
						id: util.formatCode(res.qrcode),
						info: aInfo,
						infoExtend: aDetail,
						writeoffState: false,
					})
					getApp().api.getActivityInfoById({activityId: res.activityId}).then(res => {
						this.setData({ 'info[0].value': res.title });
					})
					if(res.writeoffTime){
						this.setData({ writeoffState: true });
						wx.showToast({
							title: '该券码已核销!',
							icon: 'none',
							duration: 1500,
							mask: false
						})
						//getApp().push('/pages/marketing/coupon/writeoff/index');
					}
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
					duration: 2000,
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
	writeoffHandler(){
		this.selectComponent('#writeoffAlert').alert();
	},
	writeoffConfirmHandler(){
		wx.showLoading({
			title: '核销中...',
			mask: true,
		})
		let retry = 0;
		let writeoffFun = () => {
			getApp().api.putCouponWriteoff({ qrcode: this.data.qrcode }).then(res => {
				getApp().replace('/pages/marketing/coupon/writeoff/writeoff/index?qrcode=' + this.data.qrcode);
			}).catch(res=>{
				wx.hideLoading();
				wx.showToast({
					title: res.msg,
					icon: 'none',
					duration: 3000,
					mask: false
				})
				/*if(res.code == status){
					getApp().replace('/pages/marketing/coupon/writeoff/writeoff/index?qrcode=' + this.data.qrcode);
					return;
				}
				if(retry < 3){
					retry++;
					writeoffFun();
					return;
				}
				wx.hideLoading();
				wx.showToast({
					title: res.msg,
					icon: 'none',
					duration: 3000,
					mask: false
				})*/
			})
		}
		writeoffFun();
	},
})