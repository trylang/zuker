// package_datacenter/people_flow/ranking/index.js
Page({

  data: {
    searchIndex: 0,
    customerRouter: [{
      label: '商户概览',
      imgUrl: '',
      fontColor: '#fff',
      fontActColor: '#FF5400',
      path: '/package_datacenter/people_flow/index'
    }, {
      label: '客群画像',
      imgUrl: '',
      fontColor: '#fff',
      fontActColor: '#FF5400',
      path: '/package_datacenter/people_flow/figure/index'
    }, {
      label: '商户排行',
      imgUrl: '',
      fontColor: '#fff',
      fontActColor: '#FF5400',
      path: '/package_datacenter/people_flow/ranking/index'
    }],
    customerTabs: [{
      label: '全部',
      fontColor: '#282828',
      fontActColor: '#282828',
    }, {
      label: '本业态',
      fontColor: '#282828',
      fontActColor: '#282828',
    }, {
      label: '本楼层',
      fontColor: '#282828',
      fontActColor: '#282828',
    }],
    dataObjs: [
      {
        '客流量': [49, 55],
        '平均驻留时长': [16, 15],
        '获客坪效': [9, 12]
      },
      {
        '客流量': [99, 21],
        '平均驻留时长': [22, 11],
        '获客坪效': [65, 12]
      },
      {
        '客流量': [761, 214],
        '平均驻留时长': [162, 151],
        '获客坪效': [119, 132]
      }
    ]
  },

  tabHandler(e){
		this.setData({ searchIndex: e.detail, couponList: [] });
		//this.getCouponListHandler();
		getApp().api.lazy.init(this.getCouponListHandler, { status: this.data.searchIndex });
  },
  
})