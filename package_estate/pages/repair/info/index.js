/*
* @Author: Suoping
* @Date:   2018-08-18 17:23:36
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 03:23:27
*/

let util = require('../../../../utils/util.js');

Page({
	data: {
		id: null,
		title: '',
		tags: [/*{ class: 'blue', value: '维修中' }, { class: 'blue', value: '待分配' }*/],
		reportName: '',
		reportTime: '',
		timeKeys: [
			/*{ name: '首次分配时间', date: '2018-08-08', time: '15:00', active: true },
			{ name: '计划完成时间', date: '2018-08-08', time: '15:00' },
			{ name: '实际完成时间', date: '2018-08-08', time: '15:00' },*/
		],
		worker: '',
		workerPhone: null,
		workerPhoneFormat: '',
		repairMode: 1,
		repairModeName: '',
		repairPrice: [],
		repairPriceTotal: 0,
		repairDetail: '',
		repairPhotos: [/*'../../../assets/test.jpg'*/],
		reportSelf: false,
		reportBuild: '',
		reportFloor: '',
		reportCate: '',
		reportDetail: '',
		reportPhotos: [/*'../../../../assets/test.jpg'*/],
		reportLogs: [
			/*{
				"operationTime": 1531365818000,
				"dateFormat": '05-26',
				"timeFormat": '15:50',
				"userId": 225,
				"userRealName": "毛运",
				"mobile": "15810878061",
				"mobileFormat": '186-1234-5678',
				"status": 1,
				"statusName": "提交工单",
				icon: '../../../../assets/test.jpg',
				active: true,
			}*/
		],
		reportRateScore: 4.5,
		reportRate: [
			/*{
				"name": "服务及时性",
				"grade": 4
			}*/
		],
		userRate: [],
		urgeMax: 1,
		urgeUsed: 0,
		modifyMode : 0,
		modifyButtonMode: 0,
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ id: opts.id });
			this.getInfoHandler();
		}else{
			getApp().go(-1);
		}
	},
	getInfoHandler(){
		wx.showLoading({
			title: '努力加载中...',
			mask: true
		})
		getApp().api.getRateNameList().then(res => {
			this.setData({ userRate: [...res] })
		})
		getApp().api.getRepairInfoById({ id: this.data.id }).then(res => {
			wx.hideLoading();
			getApp().api.sendReadedById({ id: Number(this.data.id), state: res.state });
			
			let aTags = [];
			switch(res.state){
				case 10:
					switch(getApp().globalData.userAccountType){
						case 'shop':
						case 'market':
						case 'worker':
							aTags.push({ class: 'blue', value: '待分配' });
						break;
					}
				break;
				case 20:
					switch(getApp().globalData.userAccountType){
						case 'shop':
						case 'market':
						case 'worker':
							aTags.push({ class: 'blue', value: '维修中' });
							if(res.overdue){
								aTags.push({ class: 'red', value: '已逾期' });
							}
						break;
					}
				break;
				case 30:
					switch(getApp().globalData.userAccountType){
						case 'shop':
						case 'market':
						case 'worker':
							aTags.push({ class: 'blue', value: '已完成' });
							if(res.overdue){
								aTags.push({ class: 'red', value: '已逾期' });
							}
							if(res.appraisal){
								aTags.push({ class: 'red', value: '已评价' });
							}
						break;
					}
				break;
			}
			this.setData({
				title: res.title||'',
				tags: aTags,
				reportName: res.petitionerName||'',
				reportTime: util.formatTime(res.petitionTime, 'YYYY-MM-DD hh:mm'),
				timeState: res.state||10,	//10:待分配 20:维修中 30:已完成
				timeKeys: (function(){
					switch(res.state){
						case 10:
							return [];
						break;
						case 20:
							return [
								{ name: '首次分配时间', date: util.formatTime(res.modifyTime, 'YYYY-MM-DD'), time: util.formatTime(res.modifyTime, 'hh:mm'), active: true },
								{ name: '计划完成时间', date: util.formatTime(res.expectedTime, 'YYYY-MM-DD'), time: util.formatTime(res.expectedTime, 'hh:mm') }
							];
						break;
						case 30:
							return [
								{ name: '首次分配时间', date: util.formatTime(res.modifyTime, 'YYYY-MM-DD'), time: util.formatTime(res.modifyTime, 'hh:mm'), active: true },
								{ name: '计划完成时间', date: util.formatTime(res.expectedTime, 'YYYY-MM-DD'), time: util.formatTime(res.expectedTime, 'hh:mm') },
								{ name: '实际完成时间', date: util.formatTime(res.maintainEndTime, 'YYYY-MM-DD'), time: util.formatTime(res.maintainEndTime, 'hh:mm'), active: true }
							];
						break;
					}
				})(),
				worker: res.maintainerName||'',
				workerPhone: res.maintainerPhone||'',
				workerPhoneFormat: (res.maintainerPhone||'').replace(/(\d)(?=(\d{4})+(?!\d))/g, "$1-"),
				repairMode: res.repairType,
				repairModeName: res.repairTypeName||'',
				repairPrice: (function(){
					return (res.feeVoList||[]).map(item => {
						return { name: item.name, price: item.amount }
					})
				})(),
				repairPriceTotal: (function(){
					return (res.feeVoList||[]).reduce((a,b)=>{ return a+b.amount; }, 0)
				})(),
				repairDetail: res.processDeclare||'',
				repairPhotos: [...res.completePic],
				reportSelf: res.petitioner == getApp().globalData.userId,
				reportBuild: res.building||'',
				reportFloor: res.floor||'',
				reportCate: res.typeName||'',
				reportDetail: res.detail||'',
				reportPhotos: [...res.breakPic],
				reportLogs: (function(){
					let aVoList = (res.operationVOList||[]).map(item => {
						return {
							title: item.statusName,
							operationTime: item.operationTime,
							dateFormat: util.formatTime(item.operationTime, 'MM-DD'),
							timeFormat: util.formatTime(item.operationTime, 'hh:mm'),
							userName: item.userRealName,
							mobile: item.mobile,
							mobileFormat: (item.mobile||'').replace(/(\d)(?=(\d{4})+(?!\d))/g, "$1-"),
							status: item.status,
							icon: `../../../../assets/icon_report_step_0${item.status}.png`,
							//CREATE(1, "提交工单"),
							//ASSIGN(2, "分配"),
							//GO_BACK(3, "退回"),
							//TRANSFER(4, "转派"),
							//COMPLETE(5, "完成"),
							//URGE(6, "催办"),
							//APPRAISAL(7, "评价"),
							active: item.status == 1 || item.status == 5 || item.status == 7,
						}
					})
					return aVoList;
				})(),
				reportRateScore: res.appraisalScore||0,
				reportRate: [...res.appraisalVoList],
				urgeMax: res.urgeNum||1,
				urgeUsed: res.urgedNum||0 ,
			})

			if(res.state == 10){
				this.setData({ modifyMode: 1001 })
			}else if(res.state == 20){
				this.setData({ modifyMode: 1002 })
			}else{
				if(res.appraisal == 0){
					this.setData({ modifyMode: 1003 })
				}else{
					this.setData({ modifyMode: 1004 })
				}
			}
			
			switch(getApp().globalData.userAccountType){
				case 'worker':
					if(res.state == 20){
						//维修工: 工单处理
						this.setData({ modifyButtonMode: 101 })
					}
				break;
				case 'market':
					if(res.state == 10){
						//商管: 分配工单
						this.setData({ modifyButtonMode: 201 })
					}else if(res.state == 20){
						//商管: 重新分配工单, 催办
						this.setData({ modifyButtonMode: 202 })
					}else{
						if(res.appraisal == 0){
							//商管: 评价
							this.setData({ modifyButtonMode: 203 })
						}
					}
				break;
				default:
					if(res.state != 30){
						//商户: 催办
						this.setData({ modifyButtonMode: 302 })
					}else{
						if(res.appraisal == 0){
							//商户: 评价
							this.setData({ modifyButtonMode: 303 })
						}
					}
				break;
			}
		}).catch(res => {
			wx.hideLoading();
			wx.showModal({
				title: '出现问题',
				content: res.msg,
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (res) => {
					if(res.confirm) {
						getApp().go(-1);
					}
				}
			})
		})
	},
	callHandler(e){
		let aPhoneNo = e.currentTarget.dataset.phone;
		if(aPhoneNo){
			wx.makePhoneCall({
				phoneNumber: aPhoneNo,
			})
		}
	},
	urgeHandler(e){
		getApp().api.sendUrgeById({id: Number(this.data.id)}).then(res => {
			this.selectComponent('#urgeAlertSuccess').alert();
			this.getInfoHandler();
		}).catch(res => {
			this.selectComponent('#urgeAlertFail').alert();
			this.getInfoHandler();
		})
	},
	urgeAssignHandler(e){
		getApp().push('/package_estate/pages/repair/assign/index?id='+this.data.id);
	},
	urgeReturnConfirmHandler(e){
		wx.showLoading({
			title: '工单退回中...',
			mask: true
		})
		getApp().api.rejectRepairOrderById({id: Number(this.data.id)}).then(res => {
			wx.hideLoading();
			wx.showToast({
				title: '退回成功',
				icon: 'success',
				duration: 3000,
				mask: true,
			})
			setTimeout(()=>{
				getApp().replace('/package_estate/pages/repair/index')
			}, 3000)
		}).catch(res => {
			wx.hideLoading();
			wx.showToast({
				title: '退回失败',
				icon: 'none',
				duration: 3000,
			})
		})
	},
	urgeRateHandler(e){
		this.selectComponent('#urgeAlertRate').alert();
	},
	userRateHandler(e){
		this.setData({ ['userRate['+e.currentTarget.dataset.index+'].grade']: e.detail.value+1 });
	},
	urgeAlertRateHandler(e){
		//提交评价
		this.selectComponent('#urgeAlertRate').close();
		getApp().api.resolveRepairRate({ id:this.data.id, list: this.data.userRate.map(item => {
			return { appraisalId: item.id, grade: item.grade }
		}) }).then(res => {
			wx.showToast({
				title: '评价成功',
				icon: 'success',
				duration: 3000,
			})
			this.getInfoHandler();
		}).catch(res => {
			wx.showToast({
				title: res.msg,
				icon: 'none',
				duration: 3000,
			})
		})
	},
	urgeMakeHandler(e){
		this.selectComponent('#assignPicker').open();
	},
	assignHandler(e){
		switch(e.detail.value){
			case 0:
				//退回
				this.selectComponent('#urgeAlertReturn').alert();
			break;
			case 1:
				//转派
				getApp().push('/package_estate/pages/repair/assign/index?id='+this.data.id);
			break;
			case 2:
				//完成
				getApp().push('/package_estate/pages/repair/complete/index?id='+this.data.id);
			break;
		}
	}
})