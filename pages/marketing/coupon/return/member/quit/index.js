let customerInfo = null;
let globalData = getApp().globalData;
let selectedCoupon = null;

Page({
  data: {
    customerInfo: null,
    checkedCou: true,
    avatar: "../../../../../../assets/test.jpg",
    couponList: []
    // couponList: [
    // 	{ id: 1, cover: '../../assets/test.jpg', checked: false, title: '10元代金券', type: 'cash', tag: '', date: '2018.08.01-2019.01.01'},
    // 	{ id: 2, cover: '../../assets/test.jpg', checked: true, title: '满三件打七折', type: 'discount', tag: '', date: '2018.08.01-2019.01.01'},
    // 	{ id: 3, cover: '../../assets/test.jpg', checked: false, title: '周二新品免费吃', type: 'cash', tag: '', date: '2018.08.01-2019.01.01'},
    // ],
  },
  radioChange(e) {
    this.data.couponList.forEach(item => {
      if (item.qrCode == parseInt(e.detail.value)) {
				item.checked = true;
				selectedCoupon = item;
      } else {
        item.checked = false;
      }
    });
    this.setData({ couponList: this.data.couponList });
    this.setData({ checkedCou: false });
  },
  nextHandler() {
		let param = {
      tenantId: globalData.marketId,
      tenantType: 1,
      qrCode: selectedCoupon.qrCode,
      shopId: globalData.shopId,
      openId: selectedCoupon.openId,
      mobile: globalData.mobile,
      cid: selectedCoupon.cid || customerInfo.cid,
      couponId: selectedCoupon.couponId,
      couponActivityId: selectedCoupon.couponActivityId
		};
		getApp()
      .api.postCouponReturn(param)
      .then(res => {
				wx.setStorageSync('CouponInfo', res);
				getApp().push("/pages/marketing/coupon/return/finish/index");
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
  getCouponWriteOffList(param) {
    getApp()
      .api.getCouponWriteOffList(param)
      .then(res => {
        let data = [...this.data.couponList, ...res.list.map(item => {
          return {
            cover:
								item.couponImageList.find(img => img.imgType == 1)
                ? item.couponImageList.find(img => img.imgType == 1).imgUrl
                : "",
            checked: false,
            title: item.mainInfo,
            couponId: item.couponId,
            couponActivityId: item.couponActivityId,
						activityId: item.activityId,
						qrCode: item.qrCode,
						date: item.writeoffTime
          };
        })];
        this.setData({ couponList: data });
      });
  },
  onReachBottom() {
    getApp().api.lazy.loadNext();
  },
  onLoad(options) {
    customerInfo = wx.getStorageSync("CustomerInfo");
    if (!customerInfo.icon) customerInfo.icon = '/assets/icon_avatar.png';
    this.setData({ customerInfo });
    getApp().api.lazy.init(this.getCouponWriteOffList, {
      shopId: globalData.shopId,
      cid: customerInfo.cid
    });
  }
});
