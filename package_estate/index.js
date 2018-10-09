/*
* @Author: Suoping
* @Date:   2018-08-18 17:23:36
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 02:20:13
*/

Page({
	data: {
		isShop: false,
		isMarket: false,
		banner: '../assets/estate/banner.jpg',
		nav: [
			/*{ icon: '../assets/estate/icon_estate_repair.jpg', label: '报修', path: '/package_estate/pages/repair/index', },
			{ icon: '../assets/estate/icon_cert_staff.jpg', label: '员工证件申请', path: '', },
			{ icon: '../assets/estate/icon_cert_entry.jpg', label: '出入许可申请', path: '', },
			{ icon: '../assets/estate/icon_cert_delay.jpg', label: '延时闭店申请', path: '', },
			{ icon: '../assets/estate/icon_estate_feedback.jpg', label: '建议反馈', path: '', },
			{ icon: '../assets/estate/icon_estate_service.jpg', label: '有偿服务', path: '', },
			{ icon: '../assets/estate/icon_estate_guide.jpg', label: '装店指南', path: '', },
			{ icon: '../assets/estate/icon_estate_staff.jpg', label: '员工证件', path: '', },
			{ icon: '../assets/estate/icon_estate_report.jpg', label: '上报销售', path: '', },
			{ icon: '../assets/estate/icon_estate_close.jpg', label: '延时闭店', path: '', },
			{ icon: '../assets/estate/icon_estate_entry.jpg', label: '出入许可', path: '', },
			{ icon: '../assets/estate/icon_notice.jpg', label: '公告', path: '', },*/
		],
	},
	onShow(e){
		this.setData({
			isShop: getApp().globalData.userAccountType == 'shop',
      		isMarket: getApp().globalData.userAccountType == 'market',
		})

		let aNav = [];
		let aPermise = getApp().globalData.userPermis;
		aNav.push({ icon: '../assets/estate/icon_estate_repair.jpg', label: '报修', path: '/package_estate/pages/repair/index', });
		aPermise.forEach(item => {
			if(item == 'estate'){
				//物业报修
				//aNav.push({ icon: '../assets/estate/icon_estate_repair.jpg', label: '报修', path: '/package_estate/pages/repair/index', });
			}
			if(item == 'verify'){
				//信息审核
			}
			if(item == 'staff'){
				aNav.push({ icon: '../assets/estate/icon_estate_staff.jpg', label: '员工证件', path: '', })
			}
			if(item == 'feedback'){
				//建议反馈
				aNav.push({ icon: '../assets/estate/icon_estate_feedback.jpg', label: '建议反馈', path: '', });
			}
			if(item == 'notice'){
				//消息通知
				aNav.push({ icon: '../assets/estate/icon_notice.jpg', label: '公告', path: '', });
			}
			if(item == 'guide'){
				//装店指南
				aNav.push({ icon: '../assets/estate/icon_estate_guide.jpg', label: '装店指南', path: '', })
			}
			if(item == 'service'){
				//有偿服务
				aNav.push({ icon: '../assets/estate/icon_estate_service.jpg', label: '有偿服务', path: '', })
			}
			if(item == 'disclaimer'){
				//免责声明
			}
			if(item == 'analysis'){
				//销售统计
			}
			if(item == 'report'){
				//上报销售
				aNav.push({ icon: '../assets/estate/icon_estate_report.jpg', label: '上报销售', path: '', });
			}
			if(item == 'setting'){
				//系统设置
			}
			if(item == 'index'){
				//报修工单
			}
			if(item == 'delay'){
				//延时闭店
				aNav.push({ icon: '../assets/estate/icon_cert_delay.jpg', label: '延时闭店申请', path: '', });
			}
			if(item == 'permit'){
				//出入许可
				aNav.push({ icon: '../assets/estate/icon_cert_entry.jpg', label: '出入许可申请', path: '', });
			}
			if(item == 'scan'){
				//扫码核销
			}
			if(item == 'jurisdiction'){
				//数据权限
			}
		})
		this.setData({ nav: [...aNav] });
	},
	navHandler(e){
		let aPath = e.currentTarget.dataset.path;
		if(aPath){
			getApp().push(aPath);
		}
	}
})