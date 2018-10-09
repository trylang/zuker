/*
* @Author: Suoping
* @Date:   2018-08-19 01:16:36
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-22 13:35:39
*/

let util = require('../../../../../utils/util.js');

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
		rejectReason: '',
		couponId: null,
	},
	onLoad(opts){
		if(opts.id){
			getApp().api.getBatchInfoByBatchId({ batchId:opts.id }).then(res => {

				let aExtend = ['领券有效期: ', util.formatHyphens(res.coupon.getStartTime)+' - '+util.formatHyphens(res.coupon.getEndTime), '投放活动: '+res.activityName];
				/*if(res.writeoffType){
					aExtend = ['领取后'+(res.writeoffActiveDay||'当天')+'生效', '有效期'+res.writeoffValidDay+'天', '投放活动: '+res.activityName];
				}else{
					aExtend = ['有效期: '+res.start+' - '+res.end, '投放活动: '+res.activityName];
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
					rejectReason: res.rejectReason,
					couponId: res.couponId,
				})
			})
		}else{
			getApp().push('/pages/marketing/coupon/launch/index');
		}
	}
})