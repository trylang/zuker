/*
* @Author: Suoping
* @Date:   2018-08-18 18:38:03
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-25 01:27:18
*/

Page({
	data: {
		inputCouponKey: '',
		couponSearchDate: '',
		couponSearchCate: [
			{ id: null, value: '全部' },
			{ id: '9', value: '通用券' },
			{ id: '2', value: '代金券' },
			{ id: '6', value: '免费试吃试用' },
			{ id: '1', value: '礼品券' },
			{ id: '0', value: '折扣券' },
			{ id: '8', value: '品牌活动' },
			{ id: '7', value: '单品优惠' },
		],
		couponSearchCateObj: {},
		couponSearchActivity: [
			/*{ id: 0, value: '全部' },
			{ id: 1, value: '猴赛雷' },*/
		],
		couponSearchActivityObj: {},
		couponSearchDrop: [],
		couponSearchDropType: true,	//true:券类型	false: 活动
		couponSearchDropId: -1,
		couponList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', tag: 'resolve', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '投放活动: 猴赛雷摇一摇第一波'], total: 2000, },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', tag: 'reject', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '投放活动: 猴赛雷摇一摇第一波'], total: 2000, },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'cash', tag: 'pending', extend: ['领券有效期: 2018.08.01 - 2019.01.01', '投放活动: 猴赛雷摇一摇第一波'], total: 2000, },*/
		],
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		//this.launchListHandler();
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.launchListHandler, { couponTypeId:  this.data.couponSearchCateObj.id||'', activityName: this.data.couponSearchActivityObj.id||'', date:this.data.couponSearchDate||'', });
		getApp().api.getActivityListInUser().then(res => {
			this.setData({
				couponSearchActivity: [{ id: null, value: '全部' } ,...res.list.map(item => {return { id: item.id, value: item.title }})]
			})
		})
	},
	writeoffOpenHandler(){
		this.setData({ couponSearchDrop: [] });
		this.selectComponent('#datepicker').open();
	},
	writeoffCloseHandler(e){
		this.selectComponent('#datepicker').close();
	},
	cateOpenHandler(){
		this.setData({ 
			couponSearchDrop: [...this.data.couponSearchCate],
			couponSearchDropType: true,
			couponSearchDropId: this.data.couponSearchCateObj.id||-1,
		});
	},
	cateCloseHandler(e){
		this.setData({ couponSearchDrop: [] });
	},
	actOpenHandler(){
		this.setData({ 
			couponSearchDrop: [...this.data.couponSearchActivity],
			couponSearchDropType: false,
			couponSearchDropId: this.data.couponSearchActivityObj.id||-1,
		});
	},
	actCloseHandler(){
		this.setData({ couponSearchDrop: [] });
	},
	dropdownResetHandler(){
		this.selectComponent('#select1').reset();
		this.selectComponent('#select2').reset();
		this.selectComponent('#select3').reset();
		//this.launchListHandler();
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.launchListHandler, { couponTypeId:  this.data.couponSearchCateObj.id||'', activityId: this.data.couponSearchActivityObj.id||'', date:this.data.couponSearchDate||'', });
	},
	dropdownPickerCloseHandler(e){
		let aPicker = this.selectComponent('#datepicker');
		let aSelected = aPicker.data.selected;
		this.setData({ couponSearchDate: aPicker.format(aSelected[0], 'YYYY-MM-DD') });
		this.dropdownResetHandler();
	},
	dropdownHandler(e){
		if(this.data.couponSearchDropType){
			this.setData({
				couponSearchCateObj: this.data.couponSearchDrop[e.currentTarget.dataset.index],
				couponSearchDrop: [],
			});
		}else{
			this.setData({ 
				couponSearchDrop: [],
				couponSearchActivityObj: this.data.couponSearchDrop[e.currentTarget.dataset.index],
			});
		}
		this.dropdownResetHandler();
	},
	searchInputHandler(e){
		this.setData({ inputCouponKey: e.detail.value });
		//this.launchListHandler();
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.launchListHandler, { couponTypeId:  this.data.couponSearchCateObj.id||'', activityId: this.data.couponSearchActivityObj.id||'', date:this.data.couponSearchDate||'', });
	},
	launchListHandler(param){
		if(this.data.inputCouponKey)param['qrcode'] = this.data.inputCouponKey;
		getApp().api.getCouponListByWriteoff(param).then(res => {
			this.setData({
				couponList: [...this.data.couponList, ...res.list.map(item => {
					return {
						id: item.openId,
						title: item.title,
						activityName: item.activityName,
						qrCode: item.qrCode,
						getTime: item.getTime,
					}
				})]
			})
			getApp().api.lazy.res(res);
		})
	},
	goInfoHandler(e){
		getApp().push('/pages/marketing/coupon/writeoff/history/info/index?qrcode='+this.data.couponList[e.currentTarget.dataset.index].qrCode);
	},
})