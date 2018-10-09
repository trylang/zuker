/*
* @Author: Suoping
* @Date:   2018-08-15 00:02:24
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-20 16:28:14
*/

let util = require('../utils/util.js');
let base = require('./wxBase.js');
let pSize = 10;

module.exports = {
	//通过状态查询券批列表;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933756
	//入参[status]: 0:待审核、1:投放中、2:驳回、3:已结束、4:已撤回、5:暂停、6:已领光、7:已退回
	getBatchListByStatusAndTitle({status = '', title = '', date = '', activityId = '', type = 1, page = 1, pageSize = pSize } = {}){
		let aParam = {voucherStatus:status, type, title, queryTime: date, page, pageSize };
		if(activityId)aParam['activityId'] = activityId;
		return base.$get.list('coupon/voucher/deliver/all/list', aParam).then(res => {
			res.data.list = res.data.list.map(item => {
				return{
					coupon: item,
					couponId: item.couponId,
					activityId: item.activityId,
					couponActivityId: item.couponActivityId,
					activityName: item.activityName,
					title: item.title,
					cover: ((item.couponImageList||[]).find(p => p&&p.imgType)||(item.couponImageList||[])[0]||{imgUrl:''}).imgUrl||'',
					start: util.formatHyphens(item.effectiveStartTime),
					end: util.formatHyphens(item.effectiveEndTime),
					writeoffType: item.effectiveType,
					writeoffActiveDay: item.activedLimitedStartDay,
					writeoffValidDay: item.activedLimitedDays,
					totalNum: item.total,
					launchNum: item.deliverTotal,
					getNum: item.getTotal,
					exposureNum: item.exposureTotal,
					writeoffNum: item.writeTotal,
					leftNum: item.surplusNum,
					statusDesc: item.statusDesc,
					type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[item.categoryId],
					validateStatus: item.voucherStatus,
				}
			});
			return res.data;
		})
	},

	//对券批状态进行[审核/驳回/启用/暂停/退还/撤回]操作
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=12484811
	//入参[activityId]: 已注券的活动ID
	//入参[couponActivityId]: 已入券活动对应的券批ID
	//入参[action]: 操作符, 0:审核, 1:驳回, 2:暂停, 3:启用, 4:退还, 5:撤回
	//入参[rejectReason]: 驳回理由
	//入参[isQuickReview]: 是否是快速审核机制, false:否, true:是
	putBatchStatus({activityId = '', couponActivityId = '', action = 0, rejectReason = '', isQuickReview = true}){
		let aParam = { activityId, couponActivityId, operateAction:['audit', 'reject', 'pause', 'restart', 'cancel'][action], auditResult:rejectReason, isQuickReview:Number(isQuickReview)+1  };
		return base.$post('coupon/voucher/status/operate', aParam);
	},
}