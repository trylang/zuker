// pages/marketing/facetoface/coupon/finish/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponInfo: {
      mainInfo: '',
      categoryDesc: '',
      getStartTime: '',
      getEndTime: ''
    }
  },
  homeHandler() {
    wx.removeStorageSync('CustomerInfo');
		getApp().push('/pages/index/index');
  },
  onLoad(options) {
		this.setData({couponInfo: options});
  } 
})