let api = require('./apis/index.js');

//app.js
App({
	onLaunch() {
		let aModel = wx.getSystemInfoSync().model.replace(/\s/g, '');
			this.globalData.ipx = /iphonex/gi.test(aModel);
		wx.login({
			success: res => {
				console.log('onLaunch: ', res.code)
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
			}
		})
	},

	api,  //注册API接口;
	push(url) { wx.navigateTo({url}) },
	replace(url){ wx.redirectTo({url}) },
	replaceAll(url){ wx.reLaunch({url}) },
	go(n = 1){ wx.navigateBack({delta:Math.abs(n)}) },
	globalData: {
		ipx: false,	//是否是iphoneX;
		userId: '',
		userName: '',
		userRealName: '',
    mobile:'',
		userAvatar: '',
		userAge: 0,
		userGender: 0,	//0:男 1: 女
		userAccountType: '',	//market:商场 shop:商户, worker:维修工
		userPermis: [],
		type: '', // 1: 商场 2：商户
	}
})