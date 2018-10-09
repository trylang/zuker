/*
* @Author: Suoping
* @Date:   2018-08-19 01:16:36
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-21 17:43:56
*/

let util = require('../../../../utils/util.js');

Page({
	data: {
		type: '',
		cover: '',
		title: '',
		titleType: '',
		type: '',
		tag: '',
		tagIcon: '',
		extend: [],
		launchNum: 0,
		getNum: 0,
		writeoffNum: 0,
		validateStatus: null,
		rejectReason: '',
		couponId: null,
		activityId: null,
		couponActivityId: null,
		inputReason: '',
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ couponActivityId: opts.id });
			this.batchInfoHandler();
		}else{
			getApp().push('/pages/marketing/coupon/launch/index');
		}
	},
	batchInfoHandler(){
		getApp().api.getBatchInfoByBatchId({ batchId:this.data.couponActivityId }).then(res => {
			let aExtend = ['领券有效期: ', util.formatHyphens(res.coupon.getStartTime)+' - '+util.formatHyphens(res.coupon.getEndTime), '投放活动: '+res.activityName, '投放店铺:'+res.coupon.issuerName];
			/*if(res.writeoffType){
				aExtend = ['领取后'+(res.writeoffActiveDay||'当')+'天生效', '有效期'+res.writeoffValidDay+'天', '投放活动: '+res.activityName, '投放店铺:'+res.coupon.issuerName];
			}else{
				aExtend = ['有效期: '+res.start+' - '+res.end, '投放活动: '+res.activityName, '投放店铺:'+res.coupon.issuerName];
			}*/
			this.setData({
				type: res.statusDesc,
				cover: res.cover,
				title: res.title,
				titleType: ['待审核','已审核','驳回','结束'][res.validateStatus]||'审核',
				type: res.type,
				tag: ['pending','resolve','reject','end'][res.validateStatus]||res.statusDesc,
				tagIcon: res.validateStatus==2?'icon_verify_reject.png':(res.validator||res.validateTime)?'icon_verify_resolve.png':'',
				extend: [...aExtend],
				launchNum: res.launchNum,
				getNum: res.getNum,
				writeoffNum: res.writeoffNum,
				validateStatus: res.validateStatus,
				rejectReason: res.rejectReason,
				couponId: res.couponId,
				activityId: res.activityId,
				couponActivityId: res.couponActivityId,
				inputReason: '',
			})
		})
	},
	inputReasonHandler(e){
		this.setData({ inputReason: e.detail.value });
	},
	rejectHandler(){
		this.setData({ inputReason: '' });
		this.selectComponent('#reject').alert('','驳回原因');
	},
	rejectConfirmHandler(){
		if(!/\D/gi.test(this.data.inputReason)){
			wx.showModal({
				title: '无法驳回',
				content: '请填写驳回原因!',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
			return;
		}
		getApp().api.putBatchStatus({ activityId: this.data.activityId, couponActivityId: this.data.couponActivityId, action: 1, rejectReason: this.data.inputReason }).then(res => {
			wx.showToast({
				title: '驳回成功',
				icon: 'success',
				duration: 1500,
				mask: false,
			})
			this.batchInfoHandler();
		}).catch(res => {
			wx.showModal({
				title: '驳回失败',
				content: res.msg,
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
		})
	},
	resolveHandler(){
		this.selectComponent('#resolve').alert('','是否通过券投放申请');
	},
	resolveConfirmHandler(){
		getApp().api.putBatchStatus({ activityId: this.data.activityId, couponActivityId: this.data.couponActivityId, action: 0 }).then(res => {
			wx.showToast({
				title: '审核通过',
				icon: 'success',
				duration: 1500,
				mask: false,
			})
			this.batchInfoHandler();
		}).catch(res => {
			wx.showModal({
				title: '审核失败',
				content: res.msg,
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
		})
	},
})