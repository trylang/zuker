/*
* @Author: Suoping
* @Date:   2018-08-18 13:34:12
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-18 15:18:33
*/
let customerInfo = null;
let globalData = getApp().globalData;

Page({
	data: {
		customerInfo: {
			icon: '../../../../../assets/test.jpg',
		}
	},
	nextHandler() {
		getApp().push(
			`/pages/marketing/facetoface/scores/integration/index`);
	},
	onLoad(options) {
		customerInfo = wx.getStorageSync('CustomerInfo');
		let showData = {
			cardNo: customerInfo.cardNo,
			mobile: customerInfo.mobile,
			shopName: globalData.userName,
			name: customerInfo.name,
			icon:  customerInfo.icon ? customerInfo.icon : '/assets/icon_avatar.png'
		};
		this.setData({customerInfo: showData});
	}
})