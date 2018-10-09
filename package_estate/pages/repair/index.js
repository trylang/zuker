/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 02:41:07
*/

let util = require('../../../utils/util.js')

Page({
	data: {
		dataList: [{
			title: '待分配',
			list: [],
			selected: true,
			disabled: false,
		}, {
			title: '维修中',
			list: [],
			selected: false,
			disabled: false,
		}, {
			title: '已完成',
			list: [],
			selected: false,
			disabled: false,
		}, {
			title: '已评价',
			list: [],
			selected: false,
			disabled: false,
		}],
		menu: [],
		menuIndex: 0,
		createAble: false,
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		this.updateTab();
	},
	updateTab(){
		if(getApp().globalData.userAccountType == 'worker'){
			this.setData({ ['dataList[0].disabled']: true })
		}else{
			this.setData({ ['dataList[0].disabled']: false, createAble: true })
		}
		this.setData({
			menu: this.data.dataList.filter(item => !item.disabled).map(item => item.title),
			menuIndex: this.data.dataList.findIndex(item => item.selected),
		})
		this.data.dataList.forEach((item, index)=>{
			this.setData({ ['dataList['+index+'].list']:[] })
		})

		if(getApp().globalData.userAccountType == 'worker'){
			getApp().api.lazy.init(this.getDataListHandler, { status: this.data.menuIndex+1 });
		}else{
			getApp().api.lazy.init(this.getDataListHandler, { status: this.data.menuIndex });
		}
	},
	tabHandler(e){
		this.data.dataList.forEach((item, index) => {
			this.setData({
				['dataList['+index+'].selected']: index == Number(e.detail),
				['dataList['+index+'].list']: [],
			})
		})
		this.updateTab();
	},
	getDataListHandler(param){
		getApp().api.getRepairListByStatus(param).then(res => {
			res.list = res.list.map(item => {
				item.tags = [];
				item.starCalss = 'five';
				if(this.data.menuIndex == 0 && item.stateUrge){
					item.tags.push({ class: 'blue', value: '催办中' });
				}
				item.tags.push({ class: 'red', value: item.stateOverdueDesc});
				if(param.status > 10){
					item.timeDesc = '计划完成时间: '+ util.formatTime(item.expectedTime, 'YYYY-MM-DD hh:mm:ss')
				}else{
					item.timeDesc = '报修时间: '+ util.formatTime(item.createTime, 'YYYY-MM-DD hh:mm:ss')
				}
				return item;
			})
			this.setData({ ['dataList['+this.data.menuIndex+'].list']: [...this.data.dataList[this.data.menuIndex].list, ...res.list] });
			getApp().api.lazy.res(res);
		})
	},
	goInfoHandler(e){
		getApp().push('/package_estate/pages/repair/info/index?id='+this.data.dataList[this.data.menuIndex].list[e.currentTarget.dataset.index].id);
	},
	createHandler(){
		getApp().push('/package_estate/pages/repair/create/index');
	},
})