/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-19 14:29:00
*/

Page({
	data: {
		couponId: '',
		title: '',
		tag: '',
		extend: '.',
		totalNum: 0,
		launchNum: 0,
		getNum: 0,
		writeoffNum: 0,
		leftNum: 0,
		activityList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '步步高一层店铺两件服务起拼九折', extend: ['2018.08.01 - 2019.01.01'], selected: true, },
			{ id: 1, cover: '../../assets/test.jpg', title: '霸王餐摇一摇第三波', extend: ['2018.08.01 - 2019.01.01'] },
			{ id: 1, cover: '../../assets/test.jpg', title: '最新优惠活动大集合', extend: ['2018.08.01 - 2019.01.01'] },*/
		],
		couponAppendIndex: null,
		appendNum: null,
		appendTypes: 0,
		appendTotal: 0,
		couponLeft: 0,
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ couponId: opts.id });
			this.couponInfoHandler();
		}else{
			getApp().push('/pages/marketing/coupon/index');
		}
	},
	onShow(){
		this.couponInfoHandler();
		//this.activityListHandler();
		this.setData({ activityList: [] });
		getApp().api.lazy.init(this.activityListHandler);
	},
	couponInfoHandler(){
		getApp().api.getCouponInfoById({ couponId: this.data.couponId }).then(res => {
			this.setData({
				title: res.title,
				tag: {'normal':'通','cash':'代','discount':'折','gift':'礼','free':'免','brand':'品','single':'单'}[res.type],
				extend: res.subTitle,
				totalNum: res.totalNum,
				launchNum: res.launchNum,
				getNum: res.getNum,
				writeoffNum: res.writeoffNum,
				leftNum: res.leftNum,
			})
			this.couponAppendAnalysisHandler();
		})
	},
	activityListHandler(param){
		getApp().api.getActivityListForShopInject(param).then(res => {
			this.setData({
				activityList: [...this.data.activityList, ...res.list.map(item => {
					return {
						id: item.id,
						cover: item.cover,
						title: item.title,
						tag: item.activityStatusDesc,
						tagColor: ['#ff7575', '#ff5400', '#3a6dc4'][item.activityStatus]||'#999',
						extend: [item.start+' - '+item.end, '所属应用: '+item.appName],
						append: 0,
						input: 0,
						selected: false,
						launchNum: item.launchNum,
						getNum: item.getNum,
						writeoffNum: item.writeoffNum,
					}
				})]
			})
			getApp().api.lazy.res(res);
		}).catch(res => {
		})
	},
	couponAppendAnalysisHandler(){
		let aAppend = [];
		this.data.activityList.forEach(item => {
			if(item.selected){
				aAppend.push(item.append);
			}
		})
		let aTotal = aAppend.reduce((a,b)=>{return a+b}, 0);
		this.setData({
			appendTypes: aAppend.length,
			appendTotal: aTotal,
			couponLeft: this.data.leftNum - aTotal - this.data.appendNum,
		})
	},
	couponSelectHandler(e){
		this.setData({
			['activityList['+e.currentTarget.dataset.index+'].selected']: true,
		})
		this.couponAppendAnalysisHandler();
	},
	couponUnSelectHandler(e){
		this.setData({
			['activityList['+e.currentTarget.dataset.index+'].selected']: false,
		})
		this.couponAppendAnalysisHandler();
	},
	couponAppendInputHandler(e){
		this.setData({ appendNum: e.detail.value });
		this.couponAppendAnalysisHandler()
	},
	couponAppendHandler(e){
		let aIndex = e.currentTarget.dataset.index;
		let aAppend = this.data.activityList[e.currentTarget.dataset.index].append;
		this.setData({ 
			couponAppendIndex: aIndex,
			appendNum: aAppend||null,
			['activityList['+ aIndex +'].input']: aAppend,
			['activityList[' + aIndex + '].append']: 0,
		});
		this.couponAppendAnalysisHandler()
		this.selectComponent('#appendAlert').alert();
	},
	couponAppendConfirmHandler(){
		let aNum = Math.abs(this.data.appendNum);
		if(aNum > 0 && aNum <= this.data.leftNum){
			this.setData({
				['activityList['+this.data.couponAppendIndex+'].input']: 0,
				['activityList['+this.data.couponAppendIndex+'].append']: aNum,
				['activityList['+this.data.couponAppendIndex+'].selected']: true,
				couponAppendIndex: null,
				appendNum: null,
			})
			this.couponAppendAnalysisHandler();
		}else{
			this.setData({
				['activityList['+this.data.couponAppendIndex+'].input']: 0,
				['activityList['+this.data.couponAppendIndex+'].append']: 0,
				['activityList['+this.data.couponAppendIndex+'].selected']: false,
				couponAppendIndex: null,
				appendNum: null,
			})
			this.couponAppendAnalysisHandler();
			if(aNum <= 0){
				wx.showModal({
					title: '无效数量',
					content: '请填写大于0的数量!',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3CC51F',
				})
				return;
			}
			wx.showModal({
				title: '无效数量',
				content: '超过最大可投放库存!',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
		}
	},
	confirmAppendHandler(e){
		if(this.data.appendTotal <= 0){
			wx.showModal({
				title: '无效数量',
				content: '请填写大于0的数量!',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
			})
			return;
		}
		wx.showModal({
			title: '确认投放',
			content: '确定要向'+this.data.appendTypes+'个活动投放'+this.data.appendTotal+'张优惠券吗?',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#3CC51F',
			success: (res) => {
				if(res.confirm) {
					wx.showLoading()
					getApp().api.putCouponInject({couponId: this.data.couponId, config:this.data.activityList.filter(item => item.selected&&item.append).map(item => {return { activityId:item.id, activityName: item.title, total:item.append }}) }).then(res => {
						wx.hideLoading();
						wx.showModal({
							title: '投放成功',
							content: '所选优惠券已成功投放!',
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3CC51F',
							success: res => {
								if(res.confirm){
									this.setData({
										couponAppendIndex: null,
										appendNum: null,
										appendTypes: 0,
										appendTotal: 0,
									})
									//this.couponInfoHandler();
									//this.activityListHandler();
									getApp().go(-1);
								}
							}
						})
					}).catch(res => {
						wx.hideLoading();
						wx.showModal({
							title: '投放失败',
							content: res.msg || '',
							showCancel: false,
							confirmText: '确定',
							confirmColor: '#3CC51F',
						})
					});
				}
			}
		})
	},
})