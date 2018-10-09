/*
* @Author: Suoping
* @Date:   2018-08-15 00:03:12
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 02:41:57
*/

let util = require('../utils/util.js');
let base = require('./wxBase.js');
let pSize = 10;

module.exports = {
	/**
	 * 查询修改工单列表
	 * http://211.157.182.226:8090/pages/viewpage.action?pageId=12484615
	 * 入参[status] 0:待处理, 1:维修中, 2:已完成, 3:已评价
	 */
	getRepairListByStatus({ status = 0, page = 1, pageSize = pSize }){
		let aStatus = [10, 20, 30, 40][status];
		return base.$get.list('maintain/order/list/status', { status:aStatus, page, pageSize }).then(res => {
			res.data.list = res.data.list.map(item => {
				return {
					id: item.id,
					title: item.orderName,
					floor: item.floor,
					shopName: item.shopName,
					repairType: item.type,
					repairTypeDesc: item.typeName,
					readState: item.isRead,
					state: item.state,
					stateDesc: item.stateText,
					stateOverdue: item.overdue,
					stateOverdueDesc: item.overdueName,
					stateUrge: item.isUrge,
					stateRate: item.appraisal,
					stateRateDesc: item.appraisalName,
					rateScore: item.appraisalScore,
					createTime: item.createTime,
					maintainEndTime: item.maintainEndTime,
					expectedTime: item.expectedTime,
				}
			})
			return res.data;
		})
	},

	getRepairInfoById({id}){
		return base.$get('maintain/order/detail', { id, userId: getApp().globalData.userId||11 }).then(res => {
			return res.data;
		})
	},

	getBuildCate(){
		return base.$get('maintain/order/buildings').then(res => {
			return res.data.list.map(build => {
				return {
					id: build.value,
					value: build.text,
					floor: (build.children||[]).map(floor => {
						return {
							id: floor.value,
							value: floor.text,
						}
					})
				}
			})
		})
	},
	getRepairCate(){
		return base.$get('maintain/order/types').then(res => {
			return res.data.list.map(cate => {
				return {
					id: cate.value,
					value: cate.text,
				}
			})
		})
	},
	getWorkerByType({type}){
		return base.$get.list('maintain/order/maintainers', { type }).then(res => {
			return res.data.list.map(item => {
				return {
					id: item.value,
					value: item.text, 
				}
			})
		})
	},
	getRateNameList(){
		return base.$get('appraisal/conf/list').then(res => {
			return res.data.list.map(item => {
				return { id: item.id, name: item.name, grade: 1 }
			})
		})
	},
	getFeeNameList(){
		return base.$get('work/order/fee/items').then(res => {
			return res.data.list.map(item => {
				return { id: item.feeItemId, name: item.name, price: null }
			}) 
		})
	},
	sendReadedById({id, state, type = 1}){
		return base.$post('work/order/set/read', {id, state, type})
	},
	sendUrgeById({id, type = 1}){
		return base.$post('work/order/urge', {id, type})
	},
	addRepairOrder({title, buildId, floorId, repairCate, detail, photos}){
		return base.$post('maintain/order/addition', {
			title, building: buildId, floor: floorId, type: repairCate, detail, urls: photos
		})
	},
	resolveRepairRate({id, list}){
		return base.$post('maintain/order/appraisal', { id, appraisals:list });
	},
	rejectRepairOrderById({id}){
		return base.$post('maintain/order/goback', {id})
	},
	transferRepairOrderByMaster({id, time, workerId}){
		return base.$post('maintain/order/assign', { id, expectedTime: time, userId: workerId });
	},
	transferRepairOrder({id, workerId}){
		return base.$post('maintain/order/transfer', { id, userId: workerId });
	},
	resolveRepairOrder({ id = null, mode = 0, priceList = null, detail = null, photos = [] }){
		let aParam = {
			id,
			processingResult: 30,
			repairType: mode,
			processingDeclare: detail,
			urls: photos
		}
		if(mode){
			aParam['feeRecords'] = priceList;
		}
		return base.$post('maintain/order/completeness', aParam)
	}
}