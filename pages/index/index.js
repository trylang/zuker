//index.js
//获取应用实例
const app = getApp()

let util = require('../../utils/util.js');

Page({
	data:{
		sliderIndex: 0,
		slider: [
			/*{ title: '霸王餐摇一摇第三波不吃白不吃', cover: '../../assets/test.jpg', start: '2018.08.01', end: '2019.01.01', appName: '摇一摇' },
			{ title: '霸王餐摇一摇第三波不吃白不吃', cover: '../../assets/test.jpg', start: '2018.08.01', end: '2019.01.01', appName: '摇一摇' },
			{ title: '霸王餐摇一摇第三波不吃白不吃', cover: '../../assets/test.jpg', start: '2018.08.01', end: '2019.01.01', appName: '摇一摇' },*/
		],
		quickNav: [
			{ icon: '../../assets/icon_header_nav_fscore.jpg', label: '面对面积分', path: '/pages/marketing/facetoface/scores/index' },
			{ icon: '../../assets/icon_header_nav_fcoupon.jpg', label: '面对面赠券', path: '/pages/marketing/facetoface/coupon/index' },
			{ icon: '../../assets/icon_header_nav_writeoff.jpg', label: '券码核销', path: '/pages/marketing/coupon/writeoff/index' },
      { icon: '../../assets/icon_header_nav_fallback.jpg', label: '扫码退券', path: '/pages/marketing/coupon/return/index' },
		],
		simpleNav: [
			{ icon: '../../assets/icon_simple_nav_activity.jpg', label: '活动管理', path: '/pages/marketing/activity/index' },
			{ icon: '../../assets/icon_simple_nav_coupon.jpg', label: '券管理', path: '/pages/marketing/coupon/index' },
			{ icon: '../../assets/icon_simple_nav_launch.jpg', label: '券投放管理', path: '/pages/marketing/coupon/launch/index' },
			{ icon: '../../assets/icon_simple_nav_history.jpg', label: '核销记录', path: '/pages/marketing/coupon/writeoff/history/index' },
		],
		couponList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', tag: '', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['总', '1.5万'],['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', tag: '', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['总', '1.5万'],['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'cash', tag: '', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['总', '1.5万'],['投', '8000'],['领', '5000'],['核', '4000']] },*/
		],
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onShow(){
		this.setData({ couponList: [], slider: [] });
		getApp().api.lazy.init(this.getCouponList, { status:1 });
		getApp().api.getActivityListForShopInject().then(res => {
			this.setData({ sliderIndex: 0, slider: [...res.list] });
		})
	},
	getCouponList(param){
		getApp().api.getCouponListByStatus(param).then(res => {
			res.list = res.list.map(item => {
				item.tag = item.statusName;
				item.tagColor = ['#ff7575', '#ff5400', '#3a6dc4'][item.status]||'#999';
				item.extend = ['领券有效期: ', util.formatHyphens(item.coupon.getStartTime)+' - '+util.formatHyphens(item.coupon.getEndTime)]
				/*if(item.writeoffType){
					item.extend = ['领取后'+(item.writeoffActiveDay||'当')+'天生效, 有效期'+item.writeoffValidDay+'天'];
				}else{
					item.extend = ['有效期: '+item.start+' - '+item.end];
				}*/
				item.analysis = [['总', ''+item.totalNum],['投', ''+item.launchNum],['领', ''+item.getNum],['核', ''+item.writeoffNum]];
				return item;
			})
			getApp().api.lazy.res(res);
			this.setData({ couponList: [...this.data.couponList, ...res.list] });
		})
	},
	goCreateHandler(){
		getApp().push('/pages/marketing/coupon/create/summary/index');
	},
	swiperHandler(e){
		this.setData({ sliderIndex: e.detail.current })
	},
	swiperTapHandler(e){
		getApp().push('/pages/marketing/activity/info/index?activityId='+this.data.slider[this.data.sliderIndex].id);
	},
	quickNavHandler(e){
		let aNav = this.data.quickNav[e.currentTarget.dataset.index];
		if(aNav && aNav.path && !this.checkNavActionHandler(aNav.path)){
			getApp().push(aNav.path)
		}
	},
	simpleNavHandler(e){
		let aNav = this.data.simpleNav[e.currentTarget.dataset.index];
		if(aNav && aNav.path && !this.checkNavActionHandler(aNav.path)){
			getApp().push(aNav.path)
		}
	},
	searchFunc(aCode, searchType) {
		let globalData = getApp().globalData;
		if (!searchType) { // 默认查会员
			let param = {
				tenantType: 1,
				tenantId: globalData.marketId,
				searchType: 3, // 查询类型: 1:mobile,3:cardNo,6:username,7:cid
				searchText: aCode
			};
			getApp().api.getCustomerDetail(param).then(data => {
				wx.hideLoading();
				if (!data.cid) {
					this.searchFunc(aCode, 'ticket');
					return;
				}
				getApp().push('/pages/marketing/coupon/writeoff/member/index?qrcode='+aCode);
			})
			.catch(res => {
				this.searchFunc(aCode, 'ticket');
			});

		} else if (searchType === 'ticket') {
			getApp().api.getCouponDetail({ qrCode: aCode }).then(res => {
				if (res.qrCode) {
					getApp().push('/pages/marketing/coupon/writeoff/coupon/index?qrcode='+aCode);
				} else {
					wx.showModal({
						title: "提示",
						content: "报歉: 找不到扫码对应的信息!",
						showCancel: true,
						cancelText: "扫码试试",
						cancelColor: "#000000",
						confirmText: "重新输入",
						confirmColor: "#3CC51F",
						success: res => {
							if (res.confirm) {
								this.clearHandler();
							} else {
								this.scanHandler();
							}
						}
					});
				}
			})
			.catch(res => {
				wx.hideLoading();
				wx.showToast({
					title: res.msg || '找不到扫码对应的信息',
					icon: "none",
					duration: 2500,
					mask: false
				});
			});
		}
		
	},
	checkNavActionHandler(action){
		action = action.detail||action;//兼容mainNav的actoin事件,所以要写action.detail.
		if(/^action\:/i.test(action)){
			switch(action.replace(/action\:/gi, '').toLowerCase()){
				case 'scanwriteoff':
					wx.scanCode({
						onlyFromCamera: true,
						success: (res) => {
							let aCode = res.result.replace(/\s/gi, '');
							this.searchFunc(aCode);
						}
					})
				break;
			}
			return true;
		}
		return false;
	},
	couponHomeHandler(e){
		getApp().push('/pages/marketing/coupon/index');
	},
	couponInfoHandler(e){
		getApp().push('/pages/marketing/coupon/info/index?id=' + e.currentTarget.dataset.id);
	},
	couponLaunchHandler(e){
		getApp().push('/pages/marketing/coupon/launch/append/index?id=' + e.target.dataset.id);
	},
})
