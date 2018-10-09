/*
* @Author: Suoping
* @Date:   2018-08-22 07:22:04
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-25 03:31:13
*/

Page({
	data: {
		couponInfo: [
			/*{ label: '券标题', value: '小熊礼品券', },
			{ label: '券类型', value: '礼品券', },
			{ label: '券名称', value: '不限', },
			{ label: '活动名称', value: '不限', },
			{ label: '券码', value: '2018.08.01 - 2018.08.31', },*/
		],
		couponInfoExtend: { label: '其它说明', value: [/*'核销有效期: 领取后20天生效, 有效期60天', '使用门槛: 消费满100元, 可使用此券'*/], },
		writeoffInfo: [
			/*{ label: '领取人', value: '小熊礼品券', },
			{ label: '领取人OpenId', value: '小熊礼品券', },
			{ label: '领取时间', value: '礼品券', },
			{ label: '核销方式', value: '不限', },
			{ label: '核销人', value: '不限', },
			{ label: '核销时间', value: '2018.08.01 - 2018.08.31', },*/
		],
	},
	onLoad(opts){
		if(opts.qrcode){
			getApp().api.getCouponInfoByWriteoffQrcode({ qrcode: opts.qrcode }).then(res => {
				this.setData({
					couponInfo: [
						{ label: '券类型', value: res.categoryDesc, },
						{ label: '券名称', value: res.title, },
						{ label: '活动名称', value: res.activityName, },
						{ label: '券码', value: res.qrcode, },
					],
					couponInfoExtend: { label: '其它说明', value: [], },
					writeoffInfo: [
						{ label: '领取人', value: res.openIdName, },
						/*{ label: '领取人OpenId', value: res.openId, },*/
						{ label: '领取时间', value: res.getTime, },
						{ label: '核销方式', value: res.writeoffChannel, },
						{ label: '核销人', value: res.writeoffUser||res.writeOffName, },
						{ label: '核销时间', value: res.writeoffTime, },
					],
				})
			}).catch(res => {
				wx.showModal({
					title: '提示',
					content: res.msg || '',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3CC51F',
					success: (res) => {
						if(res.confirm) {
							getApp().go(-1);
						}
					}
				})
			});
		}else{
			wx.showModal({
				title: '无效信息',
				content: '找不到该券码信息!',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (res) => {
					if(res.confirm) {
						getApp().go(-1);
					}
				}
			})
		}
	}
})