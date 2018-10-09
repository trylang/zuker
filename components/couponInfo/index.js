/*
* @Author: Suoping
* @Date:   2018-08-19 01:07:37
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-28 21:30:48
*/

Component({
	properties: {
		couponId: {
			type: String,
			observer: function(v){
				this.setData({ couponId: v });
				this.loadCouponInfo();
			}
		},
		swiper: {
			type: Boolean,
			value: true,
		}
	},
	data: {
		couponId: '',
		status: null,
		pics: [],
		detail: [
			/*{ label: '券标题', value: '小熊礼品券', },
			{ label: '券类型', value: '礼品券', },
			{ label: '展示有效期', value: '不限', },
			{ label: '领取有效期', value: '2018.08.01 - 2018.08.31', },
			{ label: '核销有效期', value: '领取后20天生效, 有效期60天', },
			{ label: '商品成本', value: '10元', },
			{ label: '商品价格', value: '50元', },
			{ label: '使用门槛', value: '消费满100元, 可使用此券', },*/
		],
		detailExtend: { label: '使用说明', value: [/*'1. 活动时间以2018.08.01为主', '2. 参与者为7岁以下儿童', '3. 每位儿童限领一次', '4. 小能一旦购买, 不退不换'*/], },
		detailHtml: [/* { src:'../../../../../assets/test.jpg' }, '小朋友拿到小熊玩具开心的瞬间, 活动期间不可错过哦, 赶紧带着小宝贝们来步步高吧.', { src:'../../../../../assets/test.jpg' }, '小朋友拿到小熊玩具开心的瞬间, 活动期间不可错过哦, 赶紧带着小宝贝们来步步高吧.' */],
	},
	methods: {
		loadCouponInfo(){
			getApp().api.getCouponInfoById({ couponId: this.data.couponId }).then(res => {
				if(res.statusNum === 0){
					this.triggerEvent('editable');
				}

				let aDetail = [];
				let aTitle = { label: '券标题', value: res.title, };
				let aSubTitle = { label: '副标题', value: res.subTitle, };
				let aTotal = { label: '券总量', value: res.totalNum, };
				let aType = { label: '券类型', value: res.typeName, };
				let aDisplay = { label: '展示有效期', value: res.showType==1?'不限':res.showStart+' - '+res.showEnd, };
				let aGetter = { label: '领取有效期', value: res.getStart+' - '+res.getEnd, };
				let aValidate = { label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, };
				let aLimit = { label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', };

				let aCost = 0;
				let aPrice = 0;
				switch(res.type){
					case 'normal':
						aCost = { label: '成本价', value: res.coupon.cost*0.01+'元', };
						aPrice = { label: '原价', value: res.coupon.facePrice*0.01+'元', };
						aDetail.push(aTitle, aSubTitle, aTotal, aType, aDisplay, aGetter, aValidate, aCost, aPrice, aLimit);
					break;
					case 'discount':
						aTitle.value = res.coupon.discount+'折折扣券';
						aDetail.push(aTitle, aSubTitle, aTotal, aType, aDisplay, aGetter, aValidate, aLimit)
					break;
					case 'gift':
						aCost = { label: '成本价', value: res.coupon.cost*0.01+'元', };
						aPrice = { label: '礼品原价', value: res.coupon.unitPrice*0.01+'元', };
						aDetail.push(aTitle, aSubTitle, aTotal, aType, aDisplay, aGetter, aValidate, aCost, aPrice);
					break;
					case 'cash':
						aTitle.value = res.coupon.facePrice*0.01+'元代金券';
						aDetail.push(aTitle, aSubTitle, aTotal, aType, aDisplay, aGetter, aValidate, aLimit);
					break;
					case 'free':
						aCost = { label: '成本价', value: res.coupon.cost*0.01+'元', };
						aDetail.push(aTitle, aSubTitle, aTotal, aType, aDisplay, aGetter, aValidate, aCost, aLimit);
					break;
					case 'single':
						aCost = { label: '成本价', value: res.coupon.cost*0.01+'元', };
						aPrice = { label: '商品原价', value: res.coupon.unitPrice*0.01+'元', };
						aDetail.push(aTitle, aSubTitle, aTotal, aType, aDisplay, aGetter, aValidate, aCost, aPrice);
					break;
					case 'brand':
						aDetail.push(aTitle, aSubTitle, aType)
					break;
				}
				this.setData({
					status: res.statusNum,
					pics: res.banner,
					detail: [...aDetail,],
					detailHtml: [],
				})
				if(res.detail && res.type !== 'brand'){
					this.setData({
						detailExtend: { label: '使用说明', value: res.detail.replace(/<br(\/|)>/gi,'\r').match(/[^\r\n\s]+/gi), },
					})
				}
				if(res.html){
					let aHtml = [];
					try{
						aHtml.push(...JSON.parse(res.html));
					}catch(e){
						aHtml.push(res.html);
					}
					this.setData({ detailHtml: aHtml });
				}
			})
		},
		reload(){
			if(!this.data.couponId)return;
			this.loadCouponInfo();
		},
	},
	attached(){
		if(this.couponId){
			this.loadCouponInfo(this.couponId);
		}
	},
})