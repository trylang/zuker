/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-21 17:07:42
*/

Page({
	data: {
		couponId: '',
		cover: '',
		title: '',
		tag: '',
		extend: '.',
		totalNum: 0,
		launchNum: 0,
		getNum: 0,
		writeoffNum: 0,
		batchList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'free', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']] },*/
		],
		couponLeft: 0,
		appendNum: null,
		appendItem: null,
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ couponId: opts.id });
			getApp().api.getCouponInfoById({ couponId: opts.id }).then(res => {
				this.setData({
					cover: res.cover,
					title: res.title,
					tag: {'normal':'通','cash':'代','discount':'折','gift':'礼','free':'免','brand':'品','single':'单'}[res.type],
					extend: res.subTitle,
					totalNum: res.totalNum,
					launchNum: res.launchNum,
					getNum: res.getNum,
					writeoffNum: res.writeoffNum,
				})
			})
		}else{
			getApp().push('/pages/marketing/coupon/index');
		}
	},
	onShow(){
		//this.batchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.batchListHandler, { couponId: this.data.couponId });
	},
	batchListHandler(param){
		if(!this.data.couponId)return;
		getApp().api.getBatchListByCouponId(param).then(res => {
			this.setData({
				batchList: [...this.data.batchList, ...res.list.map(item => {
					return {
						couponId: item.couponId,
						cover: item.cover,
						title: item.title,
						type: item.type,
						/*tag: ['pending', 'resolve', 'reject', 'end'][item.validateStatus]||item.statusDesc,*/
						extend: [/*'领券有效期: '+(item.writeoffType?'领取后'+(item.writeoffActiveDay||'当天')+'生效, 有效期'+item.writeoffValidDay+'天':item.start+' - '+item.end)*/],
						analysis: '投放量:'+item.launchNum + '    领取量:'+item.getNum + '    核销量:'+item.writeoffNum,
						activityId: item.activityId,
						activityName: item.activityName,
						couponActivityId: item.couponActivityId,
						appendAble: item.validateStatus == 0 || item.validateStatus == 1 || item.validateStatus == 5 || item.validateStatus == 6,
					}
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
		let aItem = this.data.batchList.find(item => item.couponActivityId == e.currentTarget.dataset.id );
		getApp().api.getCouponInfoById({ couponId: aItem.couponId }).then(res => {
			this.setData({ couponLeft: res.leftNum, appendNum: null, appendItem:aItem });
			this.selectComponent('#appendAlert').alert();
			wx.hideLoading();
		}).catch(res => {
			wx.hideLoading();
		})
	},
	couponAppendConfirmHandler(e){
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
							this.setData({ batchList: [] });
							getApp().api.lazy.init(this.batchListHandler, { couponId: this.data.couponId });
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
		}
	},
	goCouponInfoHandler(e){
		getApp().push('/pages/marketing/activity/info/index?activityId='+this.data.batchList[e.currentTarget.dataset.index].activityId);
	},
	goAppendHandler(e){
		getApp().push('/pages/marketing/coupon/launch/append/index?id='+this.data.couponId);
	},
})
