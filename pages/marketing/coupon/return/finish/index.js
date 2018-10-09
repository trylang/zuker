let couponInfo = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponInfo: null,
    objs: {
      '券码': 'qrCode',
      '所属活动': 'activityName',
      '核销店铺': 'writeOffName',
      '核销人员': 'writeoffUser'
    }
  },
  homeHandler() {    
    wx.getStorageInfo({
      success: function(res) {
        if (res.keys.length> 1) {
          res.keys.forEach(item => {
            if (item === 'CouponInfo' || item === 'CustomerInfo') {
              wx.removeStorageSync(item);
            }
          });
        }
      },
      complete: function() {
        wx.reLaunch({
          url: '../../../../../pages/index/index'
        })
      }
    });
  },
  onLoad(options) {
    couponInfo = wx.getStorageSync("CouponInfo");
    this.setData({ 
      couponInfo: {
        mainInfo: couponInfo.mainInfo || '',
        extendInfo: couponInfo.extendInfo || '',
        qrCode: couponInfo.qrCode || '',
        activityName: couponInfo.activityName || '',
        writeOffName: couponInfo.writeOffName || '',
        writeoffUser: couponInfo.writeoffUser || ''
      }
    });
  }

})