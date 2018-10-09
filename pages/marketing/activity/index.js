/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-24 18:09:09
*/

Page({
	data: {
		searchMode: 0,	//0:全部, 1:活动名, 2:时间段;
		searchInput: '',
		searchDuration: [],
		activityList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '步步高一层店铺两件服务起拼九折', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '所属应用: 拼团'] },
			{ id: 1, cover: '../../assets/test.jpg', title: '霸王餐摇一摇第三波', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '所属应用: 拼团'] },
			{ id: 1, cover: '../../assets/test.jpg', title: '最新优惠活动大集合', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '所属应用: 拼团'] },*/
		],
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		//this.getAcvitityList();
		this.setData({ activityList: [] });
		getApp().api.lazy.init(this.getAcvitityList, { activityName: this.data.searchInput, start: this.data.searchDuration[0] });
	},
	searchActModeStater(){
		this.setData({ searchMode: 1, })
	},
	searchActModeEnder(){
		this.setData({ searchMode: 0, })
	},
	searchInputHandler(e){
		if(/\S/g.test(e.detail.value)){
			this.setData({ searchInput: e.detail.value })
		}else{
			this.setData({ searchInput: '' })
		}
		//this.getAcvitityList();
		this.setData({ activityList: [] });
		getApp().api.lazy.init(this.getAcvitityList, { activityName: this.data.searchInput, start: this.data.searchDuration[0] });
	},
	openPickerHandler(e){
		this.setData({ searchMode: 2, })
		this.selectComponent('#dpicker').open();
	},
	pickerResetHandler(e){
		this.selectComponent('#dpicker').reset();
	},
	pickConfirmHandler(e){
		let aPicker = this.selectComponent('#dpicker');
		aPicker.close();
	},
	closePickerHandler(e){
		let aPicker = this.selectComponent('#dpicker');
		let aSelected = aPicker.data.selected;
		if(aSelected.length > 1){
			this.selectComponent('#dateInput').setup(aPicker.format(aSelected[0], 'YYYY.MM.DD')+' - '+aPicker.format(aSelected[1], 'YYYY.MM.DD'));
			this.setData({ searchDuration: [aPicker.format(aSelected[0], 'YYYY-MM-DD'), aPicker.format(aSelected[1], 'YYYY-MM-DD')] });
		}else if(aSelected.length){
			this.selectComponent('#dateInput').setup(aPicker.format(aSelected[0], 'YYYY.MM.DD'));
			this.setData({ searchDuration: [aPicker.format(aSelected[0], 'YYYY-MM-DD')] });
		}else{
			this.selectComponent('#dateInput').setup('');
			this.setData({ searchDuration: [] });
		}
		this.setData({ searchMode: 0, });
		//this.getAcvitityList();
		this.setData({ activityList: [] });
		getApp().api.lazy.init(this.getAcvitityList, { activityName: this.data.searchInput, start: this.data.searchDuration[0] });
	},
	getAcvitityList(param){
		/*let aParam = {};
		if(this.data.searchInput)aParam['activityName'] = this.data.searchInput;
		if(this.data.searchDuration[0])aParam['start'] = this.data.searchDuration[0];
		aParam['page'] = 1;
		aParam['pageSize'] = 10;
		wx.showLoading();*/
		getApp().api.getActivityListForShopInject(param).then(res => {
			this.setData({
				activityList: [...this.data.activityList, ...res.list.map(item => {
					return {
						id: item.id,
						cover: item.cover,
						title: item.title,
						tag: item.activityStatusDesc,
						tagColor: ['#ff7575', '#ff5400', '#3a6dc4'][item.activityStatus]||'#999',
						extend: ['有效期: '+item.start+' - '+item.end, '所属应用: '+item.appName]
					}
				})]
			})
			getApp().api.lazy.res(res);
			//wx.hideLoading()
		}).catch(res => {
			//wx.hideLoading()
		})
	},
	infoHandler(e){
		getApp().push('/pages/marketing/activity/info/index?activityId='+this.data.activityList[e.currentTarget.dataset.index].id);
	}
})