/*
* @Author: Suoping
* @Date:   2018-08-17 19:19:23
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-24 04:18:57
*/

Page({
	data: {
		searchIndex: 0,
		batchList: [
			/*{ id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', tag: 'pending', extend: ['投放活动: 猴赛雷摇一摇'] },
			{ id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', tag: 'reject', extend: ['投放活动: 猴赛雷摇一摇'] },
			{ id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'cash', tag: 'resolve', extend: ['投放活动: 猴赛雷摇一摇'] },*/
		],
	},
	onReachBottom(){
		getApp().api.lazy.loadNext();
	},
	onLoad(){
		//this.getBatchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.getBatchListHandler, { status: this.data.searchIndex });
	},
	tabHandler(e){
		this.setData({ searchIndex: e.detail });
		//this.getBatchListHandler();
		this.setData({ batchList: [] });
		getApp().api.lazy.init(this.getBatchListHandler, { status: this.data.searchIndex });
	},
	getBatchListHandler(param){
		getApp().api.getBatchListByStatus(param).then(res => {
			res.list = res.list.map(item => {
				item.tag = ['pending', 'resolve', 'reject', 'end'][item.validateStatus]||item.statusDesc;
				item.extend = ['投放活动: '+item.activityName];
				return item;
			})
			this.setData({ batchList: [...this.data.batchList,...res.list] });
			getApp().api.lazy.res(res);
		})
	},
	goBatchInfoHandler(e){
		getApp().push('/pages/marketing/coupon/launch/review/index?id='+e.currentTarget.dataset.id);
	}
})