/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-26 21:38:54
*/
import util from '../../../../utils/util'
Page({
	data: {
		activityId: '',
		title: '霸王餐摇一摇第三波',
		couponList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', extend: ['领券有效期:', '2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']], append: 0, selected: true },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', extend: ['领券有效期:', '2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']], append: 0, selected: false },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'free', extend: ['领券有效期:', '2018.08.01 - 2019.01.01'], analysis: [['投', '8000'],['领', '5000'],['核', '4000']], append: 0, selected: false },*/
		],
		couponAppendIndex: null,
		couponLeft: 0,
		appendNum: null,
		appendTypes: 0,
		appendTotal: 0,
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onLoad(opts){
		if(opts.activityId){
			getApp().api.getActivityInfoById({ activityId: opts.activityId }).then(res => {
				this.setData({ activityId: opts.activityId, title: res.title })
			})
		}
	},
	onShow(){
		//this.couponListHandler();
		this.setData({ couponList: [] })
		getApp().api.lazy.init(this.couponListHandler, { status: 1 });
	},
	couponListHandler(param){
		getApp().api.getCouponListByStatus(param).then(res =>{
			this.setData({ 
				couponList: [...this.data.couponList, ...res.list.map(item => {
					item.tag = item.statusName;
					item.tagColor = ['#ff7575', '#ff5400', '#3a6dc4'][item.status]||'#999';
					item.extend = ['领券有效期: ', util.formatHyphens(item.coupon.getStartTime)+' - '+util.formatHyphens(item.coupon.getEndTime)];
					/*if(item.writeoffType){
						item.extend = ['领取后'+(item.writeoffActiveDay||'当天')+'生效', '有效期'+item.writeoffValidDay+'天'];
					}else{
						item.extend = ['领券有效期: ', item.start+' - '+item.end];
					}*/

					item.analysis = [['投', ''+item.launchNum],['领', ''+item.getNum],['核', ''+item.writeoffNum]];
					item.append = 0;
					item.selected = false;
					return item;
				})]
			});
			getApp().api.lazy.res(res);
		})
	},
	couponAppendAnalysisHandler(){
		let aAppend = [];
		this.data.couponList.forEach(item => {
			if(item.selected){
				aAppend.push(item.append);
			}
		})
		this.setData({
			appendTypes: aAppend.length,
			appendTotal: aAppend.reduce((a,b)=>{return a+b}, 0),
		})
	},
	couponSelectHandler(e){
		this.setData({
			['couponList['+e.currentTarget.dataset.index+'].selected']: true,
		})
		this.couponAppendAnalysisHandler();
	},
	couponUnSelectHandler(e){
		this.setData({
			['couponList['+e.currentTarget.dataset.index+'].selected']: false,
		})
		this.couponAppendAnalysisHandler();
	},
	couponAppendInputHandler(e){
		this.setData({ appendNum: e.detail.value });
	},
	couponAppendHandler(e){
		wx.showLoading()
		this.setData({ couponAppendIndex: e.currentTarget.dataset.index });
		getApp().api.getCouponInfoById({ couponId: e.currentTarget.dataset.id }).then(res => {
			this.setData({ 
				['couponList['+this.data.couponAppendIndex+'].leftNum']: res.leftNum,
				appendNum: this.data.couponList[this.data.couponAppendIndex].append||null,
				couponLeft: res.leftNum,
			});
			this.selectComponent('#appendAlert').alert();
			wx.hideLoading();
		}).catch(res => {
			wx.hideLoading();
		})
	},
	couponAppendConfirmHandler(){
		let aNum = Math.abs(this.data.appendNum);
		if(aNum > 0 && aNum <= this.data.couponLeft){
			this.setData({
				['couponList['+this.data.couponAppendIndex+'].append']: aNum,
				['couponList['+this.data.couponAppendIndex+'].selected']: true,
				couponAppendIndex: null,
				appendNum: null,
				couponLeft: 0,
			})
			this.couponAppendAnalysisHandler();
		}else{
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
			/*wx.showModal({
				title: '数量太大',
				content: '您输入的投放数量超过最大投放数量!',
				showCancel: true,
				cancelText: '重新输入',
				cancelColor: '#000000',
				confirmText: '全部投放',
				confirmColor: '#3CC51F',
				success: (res) => {
					if(res.confirm) {
						this.setData({ appendNum: aLeft });
						this.couponAppendConfirmHandler();
					}else{
						this.setData({ appendNum: null })
					}
				}
			})*/
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
			content: '确定要将'+this.data.appendTypes+'种'+this.data.appendTotal+'张优惠券投入当前活动吗?',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#3CC51F',
			success: (res) => {
				if(res.confirm) {
					wx.showLoading()
					getApp().api.putCouponsInject({activityId: this.data.activityId, activityName:this.data.title, config:this.data.couponList.filter(item => item.selected&&item.append).map(item => {return { couponId:item.id, total:item.append }}) }).then(res => {
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
										couponLeft: 0,
										appendTypes: 0,
										appendTotal: 0,
									})
									//this.couponListHandler();
									//this.couponListHandler();
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
	}
})