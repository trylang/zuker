/*
* @Author: Suoping
* @Date:   2018-08-17 19:49:33
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-31 02:17:37
*/
let app = getApp();
Page({
	data: {
    isShop: false,
    isMarket: false,
		avatar: '',
		nick: '',
		id: '',
		nav: [
			{ icon: '../../assets/icon_user_lock.jpg', label: '修改密码', token:'rst' },
			{ icon: '../../assets/icon_user_message.jpg', label: '系统通知', token: 'msg' },
		],
	},
  onShow(){
    this.setData({
      isShop: getApp().globalData.userAccountType == 'shop',
      isMarket: getApp().globalData.userAccountType == 'market',
      avatar: app.globalData.userAvatar,
      nick: app.globalData.userRealName||app.globalData.userName,
      id: app.globalData.userId
    })
  },
	logoutHandler(){
    this.selectComponent('#alert').alert('退出账号 ' + this.data.nick + '?', '退出登录')
	},
  logout(){
    app.api.logout().then(res=>{
      wx.removeStorageSync('token');
      app.replaceAll('/pages/login/index');
    })
  },
  nvaTo(e){
    if (e.target.id=='rst'){
      app.push('/pages/user/password/index')
    }else{
      app.push('/pages/user/notify/index')
    }
  },
  todetail(){
    app.push('/pages/user/info/index')
  }
})