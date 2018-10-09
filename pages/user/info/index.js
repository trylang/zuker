/*
* @Author: Suoping
* @Date:   2018-08-18 00:04:36
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-29 08:04:40
*/

Page({
	data: {
    avatar: '/assets/icon_avatar.png',
		info:[]
	},
  onLoad(){
    this.getShopDetial()
  },
  getShopDetial(){
    let userInfo = getApp().globalData;
    if (userInfo.userAccountType == 'shop'){
      getApp().api.getShopDetail({
        shopId: userInfo.shopId
      }).then(res => {
        this.setData({
          avatar: userInfo.userAvatar,
          info: [
            { label: '联系人', value: userInfo.userRealName || '-', },
            { label: '手机号', value: userInfo.mobile || '-', },
            { label: '店铺名称', value: res.shopName || '-', },
            { label: '业态', value: res.industryName || '-', },
            { label: '楼层', value: res.floor || '-', },
            { label: '所属商场', value: userInfo.marketname, },
            { label: '城市', value: res.cityName, },
            { label: '地址', value: userInfo.address, },
          ],
        })
      })
    }else{
      this.setData({
        avatar: userInfo.userAvatar,
        info: [
          { label: '联系人', value: userInfo.userRealName || '-', },
          { label: '手机号', value: userInfo.mobile || '-', },
          { label: '商场名称', value: userInfo.marketname, },
        ],
      })
    }
    
  }
})