/*
* @Author: Suoping
* @Date:   2018-08-17 01:55:00
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-19 20:33:54
*/

let util = require('../../../utils/util.js');

Page({
	data: {
		searchIndex: 0,
		couponList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', tag: '正常', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['总', '1.5万'],['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', tag: '已失效', tagColor:'#999', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['总', '1.5万'],['投', '8000'],['领', '5000'],['核', '4000']] },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'cash', tag: '正常', extend: ['领券有效期: 2018.08.01 - 2019.01.01'], analysis: [['总', '1.5万'],['投', '8000'],['领', '5000'],['核', '4000']] },*/
		],
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onLoad(){
		//this.getCouponListHandler();
		getApp().api.lazy.init(this.getCouponListHandler, { status: this.data.searchIndex });
	},
	tabHandler(e){
		this.setData({ searchIndex: e.detail, couponList: [] });
		//this.getCouponListHandler();
		getApp().api.lazy.init(this.getCouponListHandler, { status: this.data.searchIndex });
	},
	getCouponListHandler(param){
		getApp().api.getCouponListByStatus(param).then(res => {
			res.list = res.list.map(item => {
				item.tag = item.statusName;
				item.tagColor = {0:'#ff7575', 1:'#ff5400', 4:'#999'}[item.status];
				/*if(item.writeoffType){
					item.extend = ['领取后'+(item.writeoffActiveDay||'当')+'天生效, 有效期'+item.writeoffValidDay+'天'];
				}else{
					item.extend = ['有效期: '+item.start+' - '+item.end];
				}*/
				item.extend = ['领券有效期: ', util.formatHyphens(item.coupon.getStartTime)+' - '+util.formatHyphens(item.coupon.getEndTime)];
				item.analysis = [['总', ''+item.totalNum],['投', ''+item.launchNum],['领', ''+item.getNum],['核', ''+item.writeoffNum]];
				return item;
			})
			this.setData({ couponList: [...this.data.couponList, ...res.list] });
			getApp().api.lazy.res(res);
		})
	},
	goCouponInfoHandler(e){
		getApp().push('/pages/marketing/coupon/info/index?id='+e.currentTarget.dataset.id);
	},
	createHandler(){
		getApp().push('/pages/marketing/coupon/create/summary/index');
	},
})