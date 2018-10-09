let customerInfo = null;

import utils from '../../../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerInfo: null,
    info: [{
      label: '会员',
      value: 'memberName'
    }, {
      label: '会员卡号',
      value: 'cardNo'
    }, {
      label: '手机',
      value: 'mobile'
    }, {
      label: '消费金额',
      value: 'amount'
    }, {
      label: '积分发生商户',
      value: 'shopName'
    }, {
      label: '积分发生时间',
      value: 'scoreDate'
    }]
  },

  homeHandler() {
    wx.removeStorageSync('CustomerInfo');
		getApp().push('/pages/index/index');
  },
  onLoad(options) {
    customerInfo = wx.getStorageSync('CustomerInfo');
    customerInfo.amount = customerInfo.amount * 0.01;
    customerInfo.scoreDate = utils.formatTime(customerInfo.scoreDate, 'YYYY.MM.DD hh:mm:ss');
		this.setData({customerInfo});
	}
})