// package_datacenter/coupon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    router: [{
      type: 'activity',
      title: '按活动核销',
      img: '../../assets/data_activity_btn.png',
      selImg: '../../assets/data_activity_btn_selected.png'
    }, {
      type: 'coupon',
      title: '按券核销',
      img: '../../assets/data_coupon_btn.png',
      selImg: '../../assets/data_coupon_btn_selected.png'
    }],
    selectRoute: 'activity',
		couponSearchDate: '',
		writeoffStartTime: '',
		writeoffEndTime: '',
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
  toggleSelect(e) {
    let item = e.currentTarget.dataset.item;
		this.setData({selectRoute: item.type});
		let param = { 
			writeoffStartTime:this.data.writeoffStartTime, 
			writeoffEndTime:this.data.writeoffEndTime,
			categoryId:  this.data.couponSearchCateObj.id||'', 
			activityId: this.data.couponSearchActivityObj.id||''
		};

		if (!this.data.writeoffStartTime) delete param.writeoffStartTime;
		if (!this.data.writeoffEndTime) delete param.writeoffEndTime;
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.launchListHandler, param);
  },
  onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.launchListHandler, 
			{ 
				categoryId:  this.data.couponSearchCateObj.id||'', 
			 	activityId: this.data.couponSearchActivityObj.id||'', 
			}
		);
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
		if (this.data.selectRoute === 'activity') {
			this.selectComponent('#select5').reset();
		} else {
			this.selectComponent('#select4').reset();
		}
		this.selectComponent('#select6').reset();
		this.setData({ couponList: [] });
		let param = { 
			writeoffStartTime:this.data.writeoffStartTime, 
			writeoffEndTime:this.data.writeoffEndTime,
			categoryId:  this.data.couponSearchCateObj.id||'', 
			activityId: this.data.couponSearchActivityObj.id||''
		};

		if (!this.data.writeoffStartTime) delete param.writeoffStartTime;
		if (!this.data.writeoffEndTime) delete param.writeoffEndTime;
		getApp().api.lazy.init(this.launchListHandler, param);
	},
	dropdownPickerCloseHandler(e){
		let aPicker = this.selectComponent('#datepicker');
		let aSelected = aPicker.data.selected;
		let couponSearchDate = '';
		let writeoffStartTime = '';
		let writeoffEndTime = '';
		if (aSelected.length > 0) {
			writeoffStartTime = aPicker.format(aSelected[0], 'YYYY-MM-DD');
			writeoffEndTime = aPicker.format(aSelected[1], 'YYYY-MM-DD');
			couponSearchDate = `${writeoffStartTime}~${writeoffEndTime}`;
		}
		this.setData({ 
			couponSearchDate,
			writeoffStartTime,
			writeoffEndTime
		});
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
		let param = { 
			writeoffStartTime:this.data.writeoffStartTime, 
			writeoffEndTime:this.data.writeoffEndTime,
			categoryId:  this.data.couponSearchCateObj.id||'', 
			activityId: this.data.couponSearchActivityObj.id||''
		};

		if (!this.data.writeoffStartTime) delete param.writeoffStartTime;
		if (!this.data.writeoffEndTime) delete param.writeoffEndTime;
		this.setData({ couponList: [] });
		getApp().api.lazy.init(this.launchListHandler, param);
	},
	launchListHandler(param){
		if (this.data.selectRoute === 'activity') {
			getApp().api.getCouponWriteoffByActivity(param).then(res => {
				this.setData({
					couponList: [...this.data.couponList, ...res.list]
				})
				getApp().api.lazy.res(res);
			})
		} else if (this.data.selectRoute === 'coupon') {
			getApp().api.getCouponWriteoffByCategory(param).then(res => {
				this.setData({
          couponList: [...this.data.couponList, ...res.list.map(item => {
						return {
							cover: item.couponImageList.length > 0 ? item.couponImageList[0].imgUrl : '',
							couponName: item.couponName,
							writeoffNum: item.writeoffNum,
							writeoffTime: item.writeoffTime
						}
					})]
				})
				getApp().api.lazy.res(res);
			})
		}
		
	},
	goInfoHandler(e){
		getApp().push('/pages/marketing/coupon/writeoff/history/info/index?qrcode='+this.data.couponList[e.currentTarget.dataset.index].qrCode);
	},
})