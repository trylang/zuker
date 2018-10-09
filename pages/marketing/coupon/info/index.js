/*
* @Author: Suoping
* @Date:   2018-08-19 01:16:36
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-24 23:46:03
*/

Page({
	data: {
		couponId: '',
		editAble: false,
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ couponId: opts.id });
		}else{
			getApp().go(-1);
		}
	},
	onShow(){
		if(this.data.couponId){
			this.selectComponent('#couponInfo').reload();
		}
	},
	editalbeHandler(){
		this.setData({ editAble: true });
	},
	modifyHandler(e){
		if(!this.data.editAble){
			this.selectComponent('#modifyAlert').alert('当前券正在投放中, 不允许编辑!', '操作提示')
			return;
		}
		getApp().push('/pages/marketing/coupon/create/index?id='+this.data.couponId);
	},
	launchHandler(e){
		getApp().push('/pages/marketing/coupon/launch/info/index?id='+this.data.couponId);
	},
})