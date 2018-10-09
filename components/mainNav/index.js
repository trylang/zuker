/*
* @Author: Suoping
* @Date:   2018-08-16 15:49:14
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-30 21:44:55
*/

Component({
	properties: {
		index: {
			type: Number,
			value: 0,
		},
		bgColor: {
			type: String
		},
		customerRouter: {
			type: Array,
			value: []
		}
	},
	data: {
		router: [],
		ipx: false,
	},
	methods: {
		routerHandler(e){
			let aPath = e.currentTarget.dataset.path;
			if (this.data.customerRouter.length>0) {
				getApp().push(aPath);
				return;
			}

			if(aPath){
				if(aPath.indexOf('action:') == 0){
					this.triggerEvent('action', aPath);
					return;
				}
				getApp().replace(aPath);
			}
		},
	},
	attached(){
		this.setData({ ipx: getApp().globalData.ipx });
		switch(getApp().globalData.userAccountType){
			case 'market':
				this.setData({
					router: [
						{ label: '营销宝', icon: '../../assets/icon_nav_marketing.jpg', active: '../../assets/icon_nav_marketing_active.jpg', path: '/package_admin/index' },
						{ label: '物业管理', icon: '../../assets/icon_nav_estate.jpg', active: '../../assets/icon_nav_estate_active.jpg', path: '/package_admin/estate/index' },
						{ label: '我的', icon: '../../assets/icon_nav_user.jpg', active: '../../assets/icon_nav_user_active.jpg', path: '/pages/user/index' },
					]
				})
			break;
			case 'worker':
				this.setData({
					router: [
						{ label: '物业管理', icon: '../../assets/icon_nav_estate.jpg', active: '../../assets/icon_nav_estate_active.jpg', path: '/package_admin/estate/index' },
						{ label: '我的', icon: '../../assets/icon_nav_user.jpg', active: '../../assets/icon_nav_user_active.jpg', path: '/pages/user/index' },
					]
				})
			break;
			default:
				this.setData({
					router: [
						{ label: '营销宝', icon: '../../assets/icon_nav_marketing.jpg', active: '../../assets/icon_nav_marketing_active.jpg', path: '/pages/index/index' },
						{ label: '数据罗盘', icon: '../../assets/icon_nav_datacenter.jpg', active: '../../assets/icon_nav_datacenter_active.jpg', path: '/package_datacenter/index' },
						{ label: '', icon: '../../assets/icon_nav_scanner.png', path: 'action:scanWriteOff' },
						{ label: '物业管理', icon: '../../assets/icon_nav_estate.jpg', active: '../../assets/icon_nav_estate_active.jpg', path: '/package_estate/index' },
						{ label: '我的', icon: '../../assets/icon_nav_user.jpg', active: '../../assets/icon_nav_user_active.jpg', path: '/pages/user/index' },
					]
				})
			break;
		}
	},
})