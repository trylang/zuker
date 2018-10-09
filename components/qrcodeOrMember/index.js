
Component({
  properties: {
		navLabel: {
			type: String,
			value: '扫码退券',
    },
    path: {
      type: Object,
      value: {
        ticket: '/pages/marketing/coupon/return/ticket/index',
        member: '/pages/marketing/coupon/return/member/index'
      },
      observer: function(v) {
        let ticket = `selects[0].url`;
        let member = `selects[1].url`;
        this.setData({
          [ticket] : v.ticket,
          [member]: v.member
        })
      }
    }
  },
  data: {
    selects: [{
      bgColor: '#17305C',
      imgSrc: '../../assets/return_ticket.png',
      title: '查询券码',
      desc: '请顾客出示其优惠券券码',
      url: ''
    }, {
      bgColor: '#FF5400',
      imgSrc: '../../assets/return_member.png',
      title: '查询会员码',
      desc: '请顾客出示其卡片会员码',
      url: ''
    }]
  },
  methods: {
    toggleSelect(e) {
      let item = e.currentTarget.dataset.item;
      getApp().push(item.url);
    }
  },
})
