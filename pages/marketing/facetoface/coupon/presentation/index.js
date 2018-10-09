let globalData = getApp().globalData;

let selectedCoupon = null;
let customerInfo = null;
let util = require("../../../../../utils/util.js");

Page({
  data: {
    customerInfo: {
      icon: "/assets/icon_avatar.png",
    },
    couponList: [],
    checkedCou: true
  },
  radioChange(e) {
    this.data.couponList.forEach(item => {
      if (item.couponActivityId === e.detail.value) {
        item.checked = true;
        selectedCoupon = item;
      } else {
        item.checked = false;
      }
    });
    this.setData({ couponList: this.data.couponList });
    this.setData({ checkedCou: false });
  },
  getCouponList(param) {
    getApp()
      .api.getCouponListInfo(param)
      .then(res => {
        let data = [...this.data.couponList, ...res.list.map(item => {
          let icon;
          if (item.couponImageList.length > 0) {
            let sel = item.couponImageList.find(item => item.imgType == 0);
            if (sel) icon = sel.imgUrl;
          }
          return {
            cover: icon,
            checked: false,
            title: item.mainInfo,
            couponId: item.couponId,
            couponActivityId: item.couponActivityId,
            activityId: item.activityId,
            count: item.getCount,  //领券数
            quantity: item.quantity,  //投放数
            extend: ["领券有效期:", `${item.getStartTime} - ${item.getEndTime}`]
          };
        })];
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
  nextHandler() {
    if (!selectedCoupon) {return;}
    let param = {
      tenantId: globalData.marketId,
      tenantType: 1,
      couponId: selectedCoupon.couponId,
      couponActivityId: selectedCoupon.couponActivityId,
      activityId: selectedCoupon.activityId,
      openId: customerInfo.openId,
      channelId: "",
      mobile: customerInfo.mobile,
      cid: customerInfo.cid,
      aliPayId: customerInfo.aliPayId,
      type: customerInfo.openId ? 1 : 2
    };
    getApp()
      .api.postCouponInfo(param)
      .then(res => {
        res.getStartTime = util.formatTime(res.getStartTime, 'YYYY.MM.DD');
        res.getEndTime = util.formatTime(res.getEndTime, 'YYYY.MM.DD');
        getApp().push(`/pages/marketing/facetoface/coupon/finish/index?mainInfo=${res.mainInfo}&categoryDesc=${res.categoryDesc}&getStartTime=${res.getStartTime}&getEndTime=${res.getEndTime}`);
      }).catch(err => {
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
  onLoad(options) {
    customerInfo = wx.getStorageSync('CustomerInfo');
    if (!customerInfo.icon) customerInfo.icon = '/assets/icon_avatar.png';
    this.setData({ customerInfo });
    getApp().api.lazy.init(this.getCouponList, {
      tenantId: globalData.marketId,
      shopId: globalData.shopId,
      tenantType: 1
    });
  }
});
