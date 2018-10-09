/*
* @Author: Suoping
* @Date:   2018-08-14 19:50:34
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-28 22:22:49
*/

let util = require('../utils/util.js');
let base = require('./wxBase.js');
let pSize = 10;

module.exports = {
	//获取api接口路径;
	getApiPath(){
		return base.$path;
	},

	//获取当前token;
	getToken(){
		return base.$getToken();
	},

	//通过状态获取券列表;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933514
	//入参[status]: 0:全部(默认)	1:正常	2:已失效
	getCouponListByStatus({status = 0, page = 1, pageSize = pSize} = {}){
		let aStatus = [null, 0, 4][status];
		let aParam = { page, pageSize };
		if(!(!aStatus && typeof(aStatus)!="undefined" && aStatus!=0))aParam['status'] = aStatus;
		return  base.$get.list('coupon/list', aParam).then(res => {
			res.data.list = res.data.list.map(item => {
				return{
					coupon: item,
					id: item.id,
					title: item.mainInfo,
					subTitle: item.extendInfo,
					cover: ((item.couponImageList||[]).find(p => p&&p.imgType)||(item.couponImageList||[])[0]||{imgUrl:''}).imgUrl||'',
					banner: (item.couponImageList||[]).filter(p => p&&p.imgUrl).map(p => p.imgUrl),
					start: util.formatHyphens(item.effectiveStartTime),
					end: util.formatHyphens(item.effectiveEndTime||''),
					writeoffType: item.effectiveType,
					writeoffActiveDay: item.activedLimitedStartDay,
					writeoffValidDay: item.activedLimitedDays,
					totalNum: item.quantity,
					launchNum: item.pourNum,
					getNum: item.getNum,
					writeoffNum: item.writeoffNum,
					leftNum: item.surplusNum,
					status: item.status,
					statusName: {0:'正常', 1:'投放中', 4:'已过期'}[item.status],
					type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[item.categoryId],
					typeName: item.categoryDesc,
				}
			})
			return res.data;
		})
	},

	//通过核销条件查询券核销列表
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933840
	//入参[couponTypeId]: 券类型ID, 0:通用券, 1:代金券, 2:折扣券, 3:礼品券, 4:免费试吃试用券, 5:品牌推广, 6:单品优惠
	//入参[activityName]: 活动名称
	//入参[date]: 券核销时间, yyyy-mm-dd
	getCouponListByWriteoff({couponTypeId = '', qrcode= '', activityId='', date='', page = 1, pageSize = pSize} = {}){
		let aParam = { page, pageSize };
		if(qrcode)aParam['qrCode'] = qrcode;
		if(couponTypeId)aParam['categoryId'] = couponTypeId;
		if(activityId)aParam['activityId'] = activityId;
		if(date)aParam['writeoffTime'] = date;
		return base.$get('coupon/writeoff/list', aParam).then(res => {
			res.data.list = res.data.list.map(item => {
				return {
					title: item.mainInfo,
					subTitle: item.extendInfo,
					categoryId: item.categoryId,
					categoryDesc: item.categoryDesc,
					getTime: item.getTime,
					openId: item.openId,
					openIdName: item.openIdName,
					qrCode: item.qrCode,
					activityId: item.activityId,
					activityName: item.activityName,
					writeoffUser: item.writeoffUser,
					writeoffChannel: item.writeoffChannel,
					writeOffName: item.writeOffName,
					writeoffTime: item.writeoffTime,
					couponActivityId: item.couponActivityId,
				};
			})
			return res.data;
		})
	},

	//通过券ID获取券详情;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933524
	//入参[couponId]: 券ID
	getCouponInfoById({couponId}){
		return base.$get('coupon/detail', { couponId }).then(res => {
			return {
				title: res.data.mainInfo,
				subTitle: res.data.extendInfo,
				cover: ((res.data.couponImageList||[]).find(p => p&&p.imgType)||(res.data.couponImageList||[])[0]||{imgUrl:''}).imgUrl||'',
				banner: (res.data.couponImageList||[]).filter(p => p&&p.imgUrl).map(p => p.imgUrl),
				showType: res.data.displayTimeType,
				showStart: util.formatHyphens(res.data.displayStartTime||''),
				showEnd: util.formatHyphens(res.data.displayEndTime||''),
				getStart: util.formatHyphens(res.data.getStartTime||''),
				getEnd: util.formatHyphens(res.data.getEndTime||''),
				start: util.formatHyphens(res.data.effectiveStartTime||''),
				end: util.formatHyphens(res.data.effectiveEndTime||''),
				writeoffType: res.data.effectiveType,
				writeoffActiveDay: res.data.activedLimitedStartDay,
				writeoffValidDay: res.data.activedLimitedDays,
				totalNum: res.data.quantity,
				launchNum: res.data.pourNum,
				getNum: res.data.getNum,
				writeoffNum: res.data.writeoffNum,
				leftNum: res.data.surplusNum,
				priceCost: res.data.cost*0.01,
				pricePay: res.data.facePrice*0.01,
				PriceRestriction: res.data.conditionPrice,
				detail: res.data.descClause||'',
				html: res.data.imgtxtInfo||'',
				status: {0:'正常', 1:'投放中', 4:'已过期'}[res.data.status],
				statusNum: res.data.status,
				type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[res.data.categoryId],
				categoryId: res.data.categoryId,
				typeName: res.data.categoryDesc,
				coupon: res.data,
			}
		})
	},

	//通过qrcode获取券详情
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933866
	//入参[qrcode]: 券二维码
	getCouponInfoByQrcode({qrcode}){
		return base.$get('coupon/instance/card/detail', { qrCode: qrcode }).then(res => {
			return{
				activityId: res.data.activityId,
				openId: res.data.openId,
				couponActivityId: res.data.couponActivityId,
				qrcode: res.data.qrCode,
				title: res.data.mainInfo,
				subTitle: res.data.extendInfo,
				cover: ((res.data.couponImageList||[]).find(p => p&&p.imgType)||(res.data.couponImageList||[])[0]||{imgUrl:''}).imgUrl||'',
				banner: (res.data.couponImageList||[]).filter(p => p&&p.imgUrl).map(p => p.imgUrl),

				showType: res.data.displayTimeType,
				showStart: util.formatHyphens(res.data.displayStartTime||''),
				showEnd: util.formatHyphens(res.data.displayEndTime||''),
				getStart: util.formatHyphens(res.data.getStartTime||''),
				getEnd: util.formatHyphens(res.data.getEndTime||''),

				start: util.formatHyphens(res.data.effectiveStartTime||''),
				end: util.formatHyphens(res.data.effectiveEndTime||''),
				writeoffType: res.data.effectiveType,
				writeoffActiveDay: res.data.activedLimitedStartDay,
				writeoffValidDay: res.data.activedLimitedDays,
				writeoffTime: res.data.writeoffTime,
				totalNum: res.data.quantity,
				launchNum: res.data.pourNum,
				getNum: res.data.getNum,
				writeoffNum: res.data.writeoffNum,
				leftNum: res.data.surplusNum,
				priceCost: res.data.cost*0.01,
				pricePay: res.data.facePrice*0.01,
				PriceRestriction: res.data.conditionPrice*0.01,//这个接口需要处理.
				detail: res.data.descClause||'',
				html: res.data.imgtxtInfo||'',
				status: {0:'正常', 1:'投放中', 4:'已过期'}[res.data.status],
				statusNum: res.data.status,
				type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[res.data.categoryId],
				categoryId: res.data.categoryId,
				typeName: res.data.categoryDesc,
				coupon: res.data,
			}
			return res.data;
		})
	},

	//通过qrcode获取券核销详情
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933858
	//入参[qrcode]: 券二维码
	getCouponInfoByWriteoffQrcode({qrcode}){
		return base.$get('coupon/writeoff/detail', { qrCode: qrcode }).then(res => {
			return {
				qrcode: res.data.qrCode,
				title: res.data.mainInfo,
				subTitle: res.data.extendInfo,
				categoryId: res.data.categoryId,
				categoryDesc: res.data.categoryDesc,
				openIdName: res.data.openIdName,
				openId: res.data.openId,
				getTime: res.data.getTime,
				activityName: res.data.activityName,
				writeOffName: res.data.writeOffName,
				writeoffUser: res.data.writeoffUser,
				writeoffChannel: res.data.writeoffChannel,
				writeoffTime: res.data.writeoffTime,
			}
			return res;
		})
	},

	//将指定券ID(单个)的券注入到多个活动中;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933534
	//入参[couponId]: 券ID
	//入参[config]: 活动与注券量配置
	putCouponInject({couponId, config = { activityId : '', activityName : '', total : 0 }}){
		return base.$post('coupon/to/activity', {couponId, injectConfig:config});
	},

	//将指定券ID(多个)的券批量注入到单个活动中;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933534
	//入参[couponId]: 券ID
	//入参[config]: 注券量配置
	putCouponsInject({activityId, activityName, config = [{ couponId : '', total : 0 }]}){
		return base.$post('activity/voucher/save', {activityId, activityName, injectConfig:config});
	},

	//通过指定的qrcode核销对应的券
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933862
	//入参[qrCode]: 券二维码
	putCouponWriteoff({qrcode}){
		return base.$get('coupon/writeoff', { qrCode:qrcode, writeOffChannel: 'wxapp_zuker', operateType: 0 }).then(res => {
			return base.$get('coupon/writeoff', { qrCode:qrcode, writeOffChannel: 'wxapp_zuker', operateType: 1, writeSessionId: res.data.writeSessionId })
		})
	},

	//通过指定的qrcode与券ID,会员ID,券批ID退还优惠券
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933869
	//入参[qrcode]: 券二维码
	//入参[couponId]: 券ID
	//入参[memberId]: 会员ID
	//入参[couponActivityId]: 券批ID
	putCouponFallbackFromBatch({qrcode, couponId, memberId, couponActivityId}){
		return base.$post('coupon/instance/return', { qrCode:qrcode, couponId, cid:memberId, couponActivityId })
	},

	//获取券类型列表;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933592
	getCouponTypeList(){
		return base.$get('coupon/category/list').then(res => {
			//这里需要抹平
			return res;
		})
	},

	////创建优惠券;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933592
	createCoupon(coupon){
		return base.$post('coupon/create', coupon).then(res => {
			return res.data;
		})
	},

	////更新优惠券;
	//http://211.157.182.226:8090/pages/viewpage.action?pageId=12485251
	updateCoupon(coupon){
		return base.$post('coupon/update', coupon).then(res => {
			return res.data;
		})
	},

	//通过券ID查询该券投放的券批列表;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933618
	//入参[couponId]: 券ID
	getBatchListByCouponId({couponId}){
		return base.$get.list('coupon/voucher/deliver/list', { couponId }).then(res => {
			res.data.list = res.data.list.map(item => {
				return {
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
					statusDesc: item.statusDesc,
					type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[item.categoryId],
					validateStatus: item.voucherStatus,
				}
			})
			return res.data;
		})
	},

	//通过状态查询券批列表;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933756
	//入参[status]: 0:待审核、1:投放中、2:驳回、3:已结束、4:已撤回、5:暂停、6:已领光、7:已退回
	getBatchListByStatus({status = 1, page = 1, pageSize = pSize} = {}){
		return base.$get.list('coupon/voucher/deliver/all/list', {voucherStatus:status, page, pageSize}).then(res => {
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
					statusDesc: item.statusDesc,
					type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[item.categoryId],
					validateStatus: item.voucherStatus,
				}
			});
			return res.data;
		})
	},

	//通过活动ID查询券批列表;
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=12484990
	//入参[activityId]: 活动ID
	getBatchListByActivityId({activityId}){
		return base.$get.list('activity/voucher/list', {activityId}).then(res => {
			res.data.list = res.data.list.map(item => {
				return{
					coupon: item,
					couponId: item.couponId,
					activityId: item.activityId,
					couponActivityId: item.couponActivityId,
					activityName: item.activityName,
					title: item.couponName,
					subTitle: item.extendInfo,
					cover: ((item.couponImageList||[]).find(p => p&&p.imgType)||(item.couponImageList||[])[0]||{imgUrl:''}).imgUrl||'',
					start: util.formatHyphens(item.effectiveStartTime),
					end: util.formatHyphens(item.effectiveEndTime),
					writeoffType: item.effectiveType,
					writeoffActiveDay: item.activedLimitedStartDay,
					writeoffValidDay: item.activedLimitedDays,
					launchNum: item.quantity,
					getNum: item.getCount,
					writeoffNum: item.writeoffCount,
					statusDesc: item.statusDesc||item.validateStatusName,
					type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[item.couponCategoryId],
					validateStatus: item.validateStatus,
				}
			});
			return res.data;
		})
	},

	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933780
	//通过券批ID查询该券批的详情
	getBatchInfoByBatchId({batchId}){
		return base.$get('coupon/activity/detail', {couponActivityId:batchId}).then(res => {
			return {
				coupon: res.data,
				couponId: res.data.couponId,
				activityId: res.data.activityId,
				couponActivityId: res.data.couponActivityId,
				activityName: res.data.activityName,
				title: res.data.mainInfo,
				subTitle: res.data.extendInfo,
				cover: ((res.data.couponImageList||[]).find(p => p&&p.imgType)||(res.data.couponImageList||[])[0]||{imgUrl:''}).imgUrl||'',
				start: util.formatHyphens(res.data.effectiveStartTime),
				end: util.formatHyphens(res.data.effectiveEndTime),
				writeoffType: res.data.effectiveType,
				writeoffActiveDay: res.data.activedLimitedStartDay,
				writeoffValidDay: res.data.activedLimitedDays,
				launchNum: res.data.quantity,
				getNum: res.data.getNum,
				writeoffNum: res.data.writeoffNum,
				html: res.data.imgtxtInfo,
				statusDesc: res.data.statusDesc,
				type: { 9:'normal', 2:'cash', 0:'discount', 1:'gift', 6:'free', 8:'brand', 7:'single' }[res.data.categoryId],
				validateStatus: res.data.validateStatus,
				validator: res.data.auditName,
				validateTime: res.data.auditTime,
				rejectReason: res.data.auditResult,
			}
		})
	},

	//增加券批库存
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=12485039
	//入参[couponActivityId]: 券批ID
	//入参[num]: 数据
	putBatchQuantity({couponActivityId, num = 0}){
		return base.$get('coupon/activity/update/quantity', { couponActivityId, quantity: num });
	},

	//获取活动列表
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933693
	//入参[activityName]: 活动名称
	//入参[start]: 活动开始时间 yyyy-mm-dd
	getActivityList({activityName = '', start = '', page = 1, pageSize = pSize} = {}){
		let aParam = { page, pageSize };
		if(activityName)aParam['activityName'] = activityName;
		if(start)aParam['startDate'] = start;
		return base.$get.list('activity/list', aParam).then(res => {
			res.data.list = res.data.list.map(item => {
				return {
					id: item.activityId,
					title: item.activityName,
					cover: item.imgLogoUrl,
					start: util.formatHyphens(item.activityStartDate),
					end: util.formatHyphens(item.activityEndDate),
					appName: item.appName,
					activityId: item.activityId,
					activityName: item.activityName,
				};
			})
			return res.data;
		})
	},

	//获取小b可注券活动列表
	//http://211.157.182.226:8090/pages/viewpage.action?pageId=12485082
	getActivityListForShopInject({activityName = '', start = '', page = 1, pageSize = pSize} = {}){
		let aParam = { page, pageSize };
		if(activityName)aParam['activityName'] = activityName;
		if(start)aParam['startDate'] = start;
		return base.$get.list('activity/voucher/activity/pagelist', aParam).then(res => {
			res.data.list = res.data.list.map(item => {
				return {
					id: item.activityId,
					title: item.activityName,
					cover: item.imgLogoUrl,
					start: util.formatHyphens(item.activityStartDate),
					end: util.formatHyphens(item.activityEndDate),
					appName: item.appName,
					activityId: item.activityId,
					activityName: item.activityName,
					activityStatus: item.activityStatus,
					activityStatusDesc: item.activityStatusDesc,
					launchNum: item.pourNum,
					getNum: item.getCouponNum,
					writeoffNum: item.writeoffCouponNum,
				};
			})
			return res.data;
		})
	},

	//查询商户下有注券的活动列表
	//http://211.157.182.226:8090/pages/viewpage.action?pageId=12485057
	getActivityListInUser(){
		return base.$get.list('coupon/activity/enterprise/activity/list?pageSize=999').then(res => {
			res.data.list = res.data.list.map(item => {
				return {
					activity: item,
					id: item.activityId,
					title: item.activityName,
				}
			})
			return res.data;
		})
	},

	//根据活动ID获取活动详情
	//http://10.10.11.47:8090/pages/viewpage.action?pageId=11933703
	//入参[activityId]: 活动ID
	getActivityInfoById({activityId}){
		return base.$get('activity/detail', {activityId}).then(res => {
			return {
				cover: res.data.imgLogoUrl,
				title: res.data.activityName,
				start: util.formatHyphens(res.data.activityStartDate),
				end: util.formatHyphens(res.data.activityEndDate),
				owner: res.data.appName,
				detail: res.data.activityRule,
			};
		})
	},


}