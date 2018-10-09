/*
* @Author: Suoping
* @Date:   2018-08-28 15:43:55
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-30 22:47:24
*/

let util = require('../../../../utils/util.js')

Page({
	data: {
		id: null,
		planModifyAble: false,
		planDate: '',
		planTime: '',
		workerId: '',
		workerList: [
			/*{ id: 12, value: '张三' }*/
		],
		buttonText: '',
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ id: opts.id, planModifyAble:getApp().globalData.userAccountType == 'market' })
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
		
		getApp().api.getRepairInfoById({ id: this.data.id }).then(res => {
			wx.hideLoading();
			getApp().api.getWorkerByType({ type: res.type }).then(res => {
				this.setData({ workerList: [...res] })
			})
			if(res.state == 10){
				if(getApp().globalData.userAccountType == 'market'){
					this.setData({ buttonText: '确认分配' });
				}
			}else if(res.state == 20){
				switch(getApp().globalData.userAccountType){
					case 'market':
						this.setData({ buttonText: '重新分配' });
					break;
					case 'worker':
						this.setData({ buttonText: '确定转派' });
					break;
				}
			}
			this.setData({ 
				planDate: util.formatTime(res.expectedTime, 'YYYY-MM-DD'),
				planTime: util.formatTime(res.expectedTime, 'hh:mm'),
			})
			this.selectComponent('#workerSelect').setup({id:res.maintainerId, value:res.maintainerName});
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
	openPlanPickerHandler(e){
		if(this.data.planDate){
			this.selectComponent('#planPicker').open(this.data.planDate);
		}else{
			this.selectComponent('#planPicker').open();
		}
	},
	closePlanPickerHandler(e){
		let aPicker = this.selectComponent('#planPicker');
		if(aPicker.data.selected.length){
			this.setData({ planDate: aPicker.format(aPicker.data.selected[0], 'YYYY-MM-DD') })
		}
	},
	planTimeHandler: function(e) {
		this.setData({ planTime: e.detail.value })
	},
	confirmHandler(e){
		let aDate = this.data.planDate;
		let aTime = this.data.planTime;
		let aWorker = this.selectComponent('#workerSelect').data.id;
		if(getApp().globalData.userAccountType == 'market'){
			if(!aDate || !/\S/g.test(this.data.planDate)){
				wx.showToast({
					title: '请选择计划完成日期!',
					icon: 'none', // "success", "loading", "none"
					duration: 3000,
				})
				return;
			}
			if(!aDate || !/\S/g.test(this.data.planTime)){
				wx.showToast({
					title: '请选择计划完成时间!',
					icon: 'none', // "success", "loading", "none"
					duration: 3000,
				})
				return;
			}
			if(!aWorker || !/\S/g.test(this.selectComponent('#workerSelect').data.id)){
				wx.showToast({
					title: '请选择维修人员!',
					icon: 'none', // "success", "loading", "none"
					duration: 3000,
				})
				return;
			}
			getApp().api.transferRepairOrderByMaster({
				id: this.data.id,
				time: this.data.planDate+' '+this.data.planTime+':00',
				workerId: this.selectComponent('#workerSelect').data.id,
			}).then(res => {
				wx.showToast({
					title: '操作成功',
					icon: 'success',
					duration: 3000,
				})
				setTimeout(()=>{
					getApp().push('/package_estate/pages/repair/index')
				}, 3000)
			}).catch(res => {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					duration: 3000,
				})
			})
		}else{
			if(!aWorker || !/\S/g.test(this.selectComponent('#workerSelect').data.id)){
				wx.showToast({
					title: '请选择维修人员!',
					icon: 'none', // "success", "loading", "none"
					duration: 3000,
				})
				return;
			}
			getApp().api.transferRepairOrder({
				id: this.data.id,
				workerId: this.selectComponent('#workerSelect').data.id,
			}).then(res => {
				wx.showToast({
					title: '转派成功',
					icon: 'success',
					duration: 3000,
				})
				setTimeout(()=>{
					getApp().push('/package_estate/pages/repair/index')
				}, 3000)
			}).catch(res => {
				wx.showToast({
					title: '转派失败',
					icon: 'none',
					duration: 3000,
				})
			})
		}
	},
})