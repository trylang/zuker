/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-20 19:35:20
*/

let util = require('../../../../utils/util.js');

Page({
	data: {
		activityId: '',
		cover: '',
		title: '',
		start: '',
		end: '',
		owner: '',
		detail: '',
		couponList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'free', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']] },*/
		],
		appendItem: null,
		appendNum: null,
	},
	onLoad(opts){
		if(opts.activityId){
			this.setData({ activityId: opts.activityId });
			getApp().api.getActivityInfoById({ activityId: opts.activityId }).then(res => {
				this.setData({
					cover: res.cover,
					title: res.title,
					start: res.start,
					end: res.end,
					owner: res.owner,
					detail: res.detail||'',
				})
			})
		}
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		//this.batchListHandler();
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.batchListHandler, { activityId: this.data.activityId });
	},
	batchListHandler(param){
		if(!this.data.activityId)return;
		getApp().api.getBatchListByActivityId(param).then(res => {
			this.setData({
				couponList: [...this.data.couponList, ...res.list.map(item => {
					item.id = item.couponId;
					item.tag = ['pending', 'resolve', 'reject', 'end'][item.validateStatus]||item.statusDesc;

					/*if(item.writeoffType){
						item.extend = ['领取后'+(item.writeoffActiveDay||'当天')+'生效', '有效期'+item.writeoffValidDay+'天'];
					}else{
						item.extend = ['领券有效期: ', util.formatHyphens(item.coupon.getStartTime)+' - '+util.formatHyphens(item.coupon.getEndTime)];
					}*/
					item.extend = ['领券有效期: ', util.formatHyphens(item.coupon.getStartTime)+' - '+util.formatHyphens(item.coupon.getEndTime)];
					item.analysis = [['投', ''+item.launchNum],['领', ''+item.getNum],['核', ''+item.writeoffNum]];
					item.appendAble = item.validateStatus === 0 || item.validateStatus === 1 || item.validateStatus === 5 || item.validateStatus === 6;
					return item;
				})]
			})
			getApp().api.lazy.res(res);
		})
	},
	couponAppendInputHandler(e){
		this.setData({ appendNum: e.detail.value });
	},
	couponAppendHandler(e){
		wx.showLoading()
		getApp().api.getCouponInfoById({ couponId: e.currentTarget.dataset.id }).then(res => {
			this.setData({ couponLeft: res.leftNum, appendNum: null, appendItem:this.data.couponList.find(item => item.couponId == e.currentTarget.dataset.id ) });
			this.selectComponent('#appendAlert').alert();
			wx.hideLoading();
		}).catch(res => {
			wx.hideLoading();
		})
	},
	couponAppendConfirmHandler(){
		let aNum = Math.abs(this.data.appendNum);
		if(aNum > 0 && aNum <= this.data.couponLeft){
			wx.showModal({
				title: '追加投放',
				content: '确定要追加投放'+aNum+'张优惠券到该券批吗?',
				showCancel: true,
				cancelText: '取消',
				cancelColor: '#000000',
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (res) => {
					if(res.confirm) {
						wx.showLoading()

						getApp().api.putBatchQuantity({ couponActivityId: this.data.appendItem.couponActivityId, num: aNum }).then(res => {
							wx.hideLoading();
							wx.showToast({
								title: '追加成功',
								icon: 'success',
								duration: 1500,
								mask: false,
							})
							this.setData({
								appendItem: null,
								appendNum: null,
								couponLeft: 0,
							})
							//this.batchListHandler();
							this.setData({ couponList: [] })
							getApp().api.lazy.init(this.batchListHandler, { activityId: this.data.activityId });
						}).catch(res => {
							wx.hideLoading();
							wx.showModal({
								title: '追加失败',
								content: res.msg || '',
								showCancel: false,
								confirmText: '确定',
								confirmColor: '#3CC51F',
							})
						});
					}
				}
			})
		}else{
			if(aNum <= 0){
				wx.showModal({
					title: '无效数量',
					content: '请填写大于0的数量!',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3CC51F',
				})
				return;
			}
			wx.showModal({
				title: '无效数量',
				content: '超过最大可投放库存!',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
			/*if(this.data.couponLeft > 0){
				wx.showModal({
					title: '无效数量',
					content: '超过最大可投放库存!',
					showCancel: true,
					cancelText: '重新输入',
					cancelColor: '#000000',
					confirmText: '最大投放',
					confirmColor: '#3CC51F',
					success: (res) => {
						if(res.confirm){
							this.setData({ appendNum: this.data.couponLeft });
							this.couponAppendConfirmHandler();
						}
					}
				})
			}else{
				wx.showModal({
					title: '无效数量',
					content: '没有可投放的优惠券库存!',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3CC51F',
				})
			}*/
			return;
		}
	},
	goAppendHandler(e){
		getApp().push('/pages/marketing/activity/append/index?activityId='+this.data.activityId);
	},
})