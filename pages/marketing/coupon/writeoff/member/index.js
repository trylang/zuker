/*
* @Author: Suoping
* @Date:   2018-08-18 13:34:12
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-18 15:18:33
*/
let globalData = getApp().globalData;

let customerInfo = null;

Page({
	data: {
		customerInfo: null,
		couponList: [
			// { id: 1, cover: '../../assets/test.jpg', title: '全场消费满300立减60元抵扣券抵扣券抵扣券', type: 'cash', tag: '', extend: ['领券有效期:', '2018.08.01 - 2019.01.01'] },
			// { id: 1, cover: '../../assets/test.jpg', title: '满三件打七折', type: 'discount', tag: '', extend: ['领券有效期:', '2018.08.01 - 2019.01.01'] },
			// { id: 1, cover: '../../assets/test.jpg', title: '周二新品免费吃', type: 'cash', tag: '', extend: ['领券有效期:', '2018.08.01 - 2019.01.01'] },
		],
	},
	nextHandler(e) {
		let aCode = e.currentTarget.dataset.qrcode;
		getApp().push('/pages/marketing/coupon/writeoff/coupon/index?qrcode='+aCode);
	},
	getCouponList(param) {
		getApp()
      .api.getCouponInstanceGotList(param).then(res => {
				let data = res.list.map(item => {
          return {
            cover: item.imgLogoUrl,
            title: item.mainInfo || '',
            couponId: item.couponId,
            couponActivityId: item.couponActivityId,
						activityId: item.activityId,
						qrCode: item.qrCode,
            extend: ["领券有效期:", `${item.effectiveStartTime || ''} - ${item.effectiveEndTime || ''}`]
          };
        });
        this.setData({ couponList: data });
			})
			.catch(err => {
				wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2500,
          mask: false
        });
			});
	},
	onReachBottom() {
    getApp().api.lazy.loadNext();
  },
	onLoad(opts) {
		customerInfo = wx.getStorageSync('CustomerInfo');
		if (!customerInfo.icon) customerInfo.icon = '/assets/icon_avatar.png';
		this.setData({ customerInfo });
		getApp().api.lazy.init(this.getCouponList, {
			shopId: globalData.shopId,
			cid: customerInfo.cid
    });
	}
})