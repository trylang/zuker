/*
* @Author: Suoping
* @Date:   2018-08-18 18:38:03
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-20 18:17:31
*/

Page({
	data: {
		router: [
			{ path: '', label: '营销宝', icon: '../../assets/icon_nav_marketing.jpg', active: '../../assets/icon_nav_marketing_active.jpg' },
			{ path: '', label: '物业管理', icon: '../../assets/icon_nav_estate.jpg', active: '../../assets/icon_nav_estate_active.jpg'  },
			{ path: '', label: '我的', icon: '../../assets/icon_nav_user.jpg', active: '../../assets/icon_nav_user_active.jpg'  },
		],
		couponSearchUserType: [
			{ id: 1, value: '全部' },
			{ id: 2, value: '商场券' },
			{ id: 3, value: '商户券' },
		],
		couponSearchUserObj: { id: 1, value: '全部' },
		couponSearchTitle: '',
		couponSearchDate: '',
		couponSearchType: [
			{ id: -1, value: '全部' },
			{ id: 0, value: '待审核' },
			{ id: 66, value: '已通过' },
			{ id: 2, value: '未通过' },
		],
		couponSearchTypeObj: { id: 0, value: '' },
		couponSearchActivity: [
			/*{ id: 0, value: '全部' },
			{ id: 1, value: '猴赛雷' },*/
		],
		couponSearchActivityObj: {},
		couponSearchDrop: [],
		couponSearchDropType: true,	//true:审核状态	false: 参与活动
		couponSearchDropId: -1,
		batchList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', tag: 'resolve', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '投放活动: 猴赛雷摇一摇第一波'], total: 2000, },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', tag: 'reject', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '投放活动: 猴赛雷摇一摇第一波'], total: 2000, },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'cash', tag: 'pending', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '投放活动: 猴赛雷摇一摇第一波'], total: 2000, },*/
		],
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		//this.batchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.batchListHandler);
		getApp().api.getActivityListInUser().then(res => {
			this.setData({
				couponSearchActivity: [{ id: '', value: '全部' } ,...res.list.map(item => {return { id: item.id, value: item.title }})]
			})
		})
	},
	launchPickerOpenHandler(){
		this.setData({ couponSearchDrop: [] });
		this.selectComponent('#launchpicker').open();
	},
	launchPickerCloseHandler(e){
		this.selectComponent('#launchpicker').close();
	},
	verifyOpenHandler(){
		this.setData({ 
			couponSearchDrop: [...this.data.couponSearchType],
			couponSearchDropType: true,
			couponSearchDropId: this.data.couponSearchTypeObj.id||0,
		});
	},
	verifyCloseHandler(){
		this.setData({ couponSearchDrop: [] });
	},
	joinOpenHandler(){
		this.setData({ 
			couponSearchDrop: [...this.data.couponSearchActivity],
			couponSearchDropType: false,
			couponSearchDropId: this.data.couponSearchActivityObj.id||0,
		});
	},
	joinCloseHandler(){
		this.setData({ couponSearchDrop: [] });
	},
	dropdownResetHandler(){
		this.selectComponent('#select1').reset();
		this.selectComponent('#select2').reset();
		this.selectComponent('#select3').reset();
	},
	dropdownPickerCloseHandler(e){
		let aPicker = this.selectComponent('#launchpicker');
		let aSelected = aPicker.data.selected;
		this.setData({ couponSearchDate: aPicker.format(aSelected[0], 'YYYY-MM-DD') });
		this.dropdownResetHandler();
		//this.batchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.batchListHandler);
	},
	dropdownUserHandler(e){
		this.setData({ 
			couponSearchUserObj: e.detail,
		});
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.batchListHandler);
	},
	dropdownHandler(e){
		if(this.data.couponSearchDropType){
			this.setData({ 
				couponSearchDrop: [],
				couponSearchTypeObj: this.data.couponSearchDrop[e.currentTarget.dataset.index],
			});
		}else{
			this.setData({ 
				couponSearchDrop: [],
				couponSearchActivityObj: this.data.couponSearchDrop[e.currentTarget.dataset.index],
			});
		}
		this.dropdownResetHandler();
		//this.batchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.batchListHandler);
	},
	searchInputHandler(e){
		this.setData({ couponSearchTitle: e.detail.value });
		//this.batchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.batchListHandler);
	},
	batchListHandler(param){
		if(this.data.couponSearchTitle)param['title'] = this.data.couponSearchTitle;
		if(this.data.couponSearchDate)param['date'] = this.data.couponSearchDate;
		if(this.data.couponSearchTypeObj.id != -1)param['status'] = this.data.couponSearchTypeObj.id;
		if(this.data.couponSearchActivityObj.id)param['activityId'] = this.data.couponSearchActivityObj.id;
		if(this.data.couponSearchUserObj.id)param['type'] = this.data.couponSearchUserObj.id;
		getApp().api.getBatchListByStatusAndTitle(param).then(res => {
			res.list = res.list.map(item => {
				item.extend = ['投放活动: '+item.activityName, '投放店铺:'+item.coupon.issuerName];
				item.tag = ['pending', 'resolve', 'reject', 'end'][item.validateStatus]||item.statusDesc;
				return item;
			})
			this.setData({ batchList: [...this.data.batchList, ...res.list] });
			getApp().api.lazy.res(res);
		})
	},
	batchOnHandler(e){
		wx.showModal({
			title: '上架券批',
			content: '你确定要上架当前券批吗?',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#ff5400',
			success: (res) => {
				if(res.confirm) {
					wx.showLoading({
						title: '上架中...',
						mask: true
					})
					let aCoupon = this.data.batchList[e.currentTarget.dataset.index];
					getApp().api.putBatchStatus({ activityId: aCoupon.activityId, couponActivityId: aCoupon.couponActivityId, action: 3, isQuickReview:false }).then(res => {
						wx.hideLoading();
						wx.showToast({
							title: '上架成功',
							icon: 'success',
							duration: 1500,
							mask: false,
						})
						//this.batchListHandler();
						this.setData({ batchList: [] });
						getApp().api.lazy.init(this.batchListHandler);
					}).catch(res => {
						wx.hideLoading();
						wx.showModal({
							title: '上架失败',
							content: res.msg,
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3CC51F',
						})
					})
				}
			}
		})
	},
	batchOffHandler(e){
		wx.showModal({
			title: '下架券批',
			content: '你确定要下架当前券批吗?',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#ff5400',
			success: (res) => {
				if(res.confirm) {
					wx.showLoading({
						title: '下架中...',
						mask: true
					})
					let aCoupon = this.data.batchList[e.currentTarget.dataset.index];
					getApp().api.putBatchStatus({ activityId: aCoupon.activityId, couponActivityId: aCoupon.couponActivityId, action: 2, isQuickReview:false }).then(res => {
						wx.hideLoading();
						wx.showToast({
							title: '下架成功',
							icon: 'success',
							duration: 1500,
							mask: false,
						})
						//this.batchListHandler();
						this.setData({ batchList: [] });
						getApp().api.lazy.init(this.batchListHandler);
					}).catch(res => {
						wx.hideLoading();
						wx.showModal({
							title: '下架失败',
							content: res.msg,
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3CC51F',
						})
					})
				}
			}
		})
	},
	goBatchInfoHandler(e){
		getApp().push('/package_admin/coupon/launch/info/index?id='+this.data.batchList[e.currentTarget.dataset.index].couponActivityId);
	},
})