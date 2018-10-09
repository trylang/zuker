/*
* @Author: Suoping
* @Date:   2018-08-19 03:42:38
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-20 19:33:33
*/

let lazyInterval = null;
let tmpImageUpload = [];

Page({
	data: {
		couponMode: '',
		couponId: null,
		couponCategoryId: null,

		title: '',
		subTitle: '',
		total: null,
		timeShow: [],
		timeShowType: 1,
		timeGet: [],
		timeWriteoff: [],
		timeWriteoffType: 0,
		writeOffActiveAfterDays: null,
		writeOffValidDays: null,
		slider: [],
		useLimit: null,
		useLimitType: 0,
		isAllShop: 1,	//禁止全场核销;
		rectangle: 2,
		shopId: null,
		useDetail: '',
		useDetailFocus: false,
		useHtml: [],

		normalCost: null,	//通用券, 成本
		normalPrice: null,	//通用券, 价格
		discountOff: null,	//折扣券, 折扣额度(0-100)
		giftCost: null,		//礼品券, 成本
		giftPrice: null,	//礼品券, 价格
		cashPrice: null,	//代金券, 金额
		freeCost: null,		//免费试吃试用券, 成本
		freePrice: null,	//免费试吃试用券, 价格
		singleCost: null,
		singlePrice: null,	//单品优惠券, 金额

		appendImageAble: true,
		appendHtmlAble: true,

		fixAreaTarget: '',
		fixAreaHtml: '',
		fixAreaMax: 200,

		saveAble: false,
		ipx: false,
	},
	onLoad(opts){
		if(opts.id){
			this.setData({ couponId: opts.id, couponMode: '' });
			this.getCouponInfoHandler();
		}else if(opts.type){
			let aCategoryId = { 'normal':9, 'cash':2, 'discount':0, 'gift':1, 'free':6, 'brand':8, 'single':7 }[opts.type];
			this.setData({ couponId: null, couponMode: opts.type, categoryId: aCategoryId });
		}else{
			this.setData({ couponId: null, couponMode: 'normal', categoryId: 9 });
		}
		this.setData({ ipx: getApp().globalData.ipx });
	},
	getCouponInfoHandler(){
		getApp().api.getCouponInfoById({ couponId: this.data.couponId }).then(res => {
			this.setData({
				couponMode: res.type,
				categoryId: res.categoryId,
				title: res.coupon.mainInfo,
				subTitle: res.coupon.extendInfo,
				total: res.coupon.quantity,
				timeShow: [(res.coupon.displayStartTime||'').replace(/-/g, '.'), (res.coupon.displayEndTime||'').replace(/-/g, '.')],
				timeShowType: res.coupon.displayTimeType,
				timeGet: [(res.coupon.getStartTime||'').replace(/-/g, '.'), (res.coupon.getEndTime||'').replace(/-/g, '.')],
				timeWriteoff: [(res.coupon.effectiveStartTime||'').replace(/-/g, '.'), (res.coupon.effectiveEndTime||'').replace(/-/g, '.')],
				timeWriteoffType: res.coupon.effectiveType,
				writeOffActiveAfterDays: res.coupon.activedLimitedStartDay,
				writeOffValidDays: res.coupon.activedLimitedDays,
				slider: (res.coupon.couponImageList||[]).map(item => { return { imgType: item.imgType||0, imgUrl: item.imgUrl, delete: false } }),
				useLimit: res.coupon.conditionPrice,
				useLimitType: res.coupon.conditionType,
				useDetail: res.coupon.descClause,
				useHtml: [],
			})
			let aHtml = [];
			try{
				let aJSON = JSON.parse(res.coupon.imgtxtInfo);
				aJSON.forEach(item => {
					if(item.img||item.src){
						aHtml.push(`<img style='width: 100%;' src='${item.img || item.src}'>`);
					}
					if(item.html){
						aHtml.push(item.html);
					}
					if(!item.img && !item.html && Object.prototype.toString.call(item) == '[object String]'){
						aHtml.push(item);
					}
				})
			}catch(e){
				aHtml.push(res.coupon.imgtxtInfo);
			}
			this.setData({ useHtml: aHtml });
			this.data.useHtml.forEach((item, index) => {
				let aComp = this.selectComponent('#html_modify_' + index);
				aComp.setup(item);
			})


			switch(res.type){
				case 'normal':
					this.setData({
						normalCost: res.coupon.cost*0.01,
						normalPrice: res.coupon.facePrice*0.01
					})
				break;
				case 'discount':
					this.setData({
						discountOff: res.coupon.discount
					})
				break;
				case 'gift':
					this.setData({
						giftCost: res.coupon.cost*0.01,
						giftPrice: res.coupon.unitPrice*0.01
					})
				break;
				case 'cash':
					this.setData({
						cashPrice: res.coupon.facePrice*0.01
					})
				break;
				case 'free':
					this.setData({
						freeCost: res.coupon.cost*0.01,
						freePrice: res.coupon.unitPrice*0.01
					})
				break;
				case 'single':
					this.setData({
						singleCost: res.coupon.cost*0.01,
						singlePrice: res.coupon.unitPrice*0.01
					})
				break;
			}
			this.checkSaveStatusHander();
		})
	},
	radioHandler(e){
		this.setData({
			[e.currentTarget.dataset.key]: e.currentTarget.dataset.value,
		})
		clearTimeout(lazyInterval);
		lazyInterval = setTimeout(this.checkSaveStatusHander, 100);
	},
	chooseImageHandler(e){
		wx.chooseImage({
			count: 1,
			success: res => {
				let aSize = res.tempFiles[0].size/1024;
				let maxSize = Number(e.currentTarget.dataset.size);
				if(aSize > maxSize){
					wx.showToast({ title: '图片超过指定容量, 请选择小于'+maxSize+'kb的图片!', icon: 'none', duration: 2000, });
					return;
				}
				tmpImageUpload = res.tempFilePaths.map(item => {
					return{
						value: item,
						type: e.currentTarget.dataset.type,
						index: e.currentTarget.dataset.index,
					}
				})
				this.uploadImageHandler();
			},
			fail: ({errMsg}) => {
				wx.showToast({ title: '取消图片上传!', icon: 'none', duration: 2000, })
			}
		})
	},
	uploadImageHandler(e){
		if(!tmpImageUpload.length)return;
		let aFile = tmpImageUpload[0];
		wx.showLoading({
			title: '努力上传中...',
			mask: false,
		})
		wx.uploadFile({
			url: getApp().api.getApiPath() + 'file/upload',
			filePath: aFile.value,
			name: 'file',
			header: { token: getApp().api.getToken() },
			success: res => {
				wx.hideLoading();
				wx.showToast({
					title: '上传成功',
					icon: 'success',
				})
				let aIMG = JSON.parse(res.data).data.url;
				switch(aFile.type){
					case 'slider':
						this.setData({ slider: [...this.data.slider, { imgUrl: aIMG, imgType: 0 }] });
					break;
					case 'modify':
						var aSRC = `<img style='width: 100%;' src='${aIMG}'>`;
						this.selectComponent('#html_modify_'+aFile.index).setup(aSRC);
						this.setData({ ['useHtml['+aFile.index+']']: aSRC })
					break;
				}
				tmpImageUpload.shift();
				clearTimeout(lazyInterval);
				lazyInterval = setTimeout(()=>{
					this.checkAppendStatusHandler();
					this.checkSaveStatusHander();
				}, 100);
			},
			fail: ({errMsg}) => {
				wx.hideLoading();
				wx.showToast({
					title: '上传失败: '+errMsg,
					icon: 'none',
				})
			}
		})
	},
	sliderDeleteHandler(e){
		wx.showModal({
			title: '删除确认',
			content: '您确定要删除当前图片吗?',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#3CC51F',
			success: (res) => {
				if(res.confirm) {
					let aIndex = e.currentTarget.dataset.index;
					for(let i = aIndex; i< this.data.slider.length - 1; i++){
						this.setData({ ['slider['+i+'].imgUrl']: this.data.slider[i+1].imgUrl });
					}
					this.setData({ slider: this.data.slider.slice(0,-1) });
					clearTimeout(lazyInterval);
					lazyInterval = setTimeout(this.checkSaveStatusHander, 100);
				}
			},
		})
	},
	openShowPickerHandler(e){
		if(this.data.timeShow[1] && this.data.timeShow[1]){
			this.selectComponent('#showPicker').open([...this.data.timeShow]);
		}else{
			this.selectComponent('#showPicker').open();
		}
	},
	openGetPickerHandler(e){
		if(this.data.timeGet[1] && this.data.timeGet[1]){
			this.selectComponent('#getPicker').open([...this.data.timeGet]);
		}else{
			this.selectComponent('#getPicker').open();
		}
	},
	openWriteoffPickerHandler(e){
		if(this.data.timeWriteoff[1] && this.data.timeWriteoff[1]){
			this.selectComponent('#writeoffPicker').open([...this.data.timeWriteoff]);
		}else{
			this.selectComponent('#writeoffPicker').open();
		}
	},
	showPickerResetHandler(e){
		this.selectComponent('#showPicker').reset();
	},
	getPickerResetHandler(e){
		this.selectComponent('#getPicker').reset();
	},
	pickerResetHandler(e){
		this.selectComponent('#writeoffPicker').reset();
	},
	showPickConfirmHandler(e){
		let aPicker = this.selectComponent('#showPicker');
		aPicker.close();
	},
	getPickConfirmHandler(e){
		let aPicker = this.selectComponent('#getPicker');
		aPicker.close();
	},
	pickConfirmHandler(e){
		let aPicker = this.selectComponent('#writeoffPicker');
		aPicker.close();
	},
	closePickerHandler(e){
		let aId = e.currentTarget.id;
		let aPicker = this.selectComponent('#'+aId);
		let aSelected = aPicker.data.selected;
		if(aSelected.length > 1){
			let aStart = aPicker.format(aSelected[0], 'YYYY.MM.DD');
			let aEnd = aPicker.format(aSelected[1], 'YYYY.MM.DD');
			switch(aId){
				case 'showPicker':
					this.setData({ timeShow: [aStart, aEnd] });
				break;
				case 'getPicker':
					this.setData({ timeGet: [aStart, aEnd] });
				break;
				default:
					this.setData({ timeWriteoff: [aStart, aEnd] });
				break;
			}
		}else{
			switch(aId){
				case 'showPicker':
					this.setData({ timeShow: [] });
				break;
				case 'getPicker':
					this.setData({ timeGet: [] });
				break;
				default:
					this.setData({ timeWriteoff: [] });
				break;
			}
		}
		clearTimeout(lazyInterval);
		lazyInterval = setTimeout(this.checkSaveStatusHander, 100);
	},
	inputHandler(e){
		let aValue = null;
		clearTimeout(lazyInterval);
		lazyInterval = setTimeout(this.checkSaveStatusHander, 100);
		switch(e.currentTarget.dataset.key){
			case 'title':
				this.setData({ [e.currentTarget.dataset.key]: e.detail.value });
			break;
			case 'subTitle':
				this.setData({ [e.currentTarget.dataset.key]: e.detail.value });
			break;
			case 'normalCost':
			case 'normalPrice':
			case 'discountOff':
			case 'cashPrice':
			case 'giftCost':
			case 'giftPrice':
			case 'freeCost':
			case 'freePrice':
			case 'singleCost':
			case 'singlePrice':
			case 'priceCost':
			case 'total':
			case 'writeOffActiveAfterDays':
			case 'writeOffValidDays':
			case 'itemCost':
			case 'itemPrice':
			case 'useLimit':
				aValue = e.detail.value.replace(/[^0-9]/gi, '');
				if(aValue === ''){
					this.setData({ [e.currentTarget.dataset.key]: aValue });
					return { value: aValue }
				}
				aValue = Number(aValue);
				//let aMin = Number(e.currentTarget.dataset.min);
				let aMax = Number(e.currentTarget.dataset.max);
				//if(aMin && aValue < aMin)aValue = aMin;
				if(aMax && aValue > aMax)aValue = aMax;
				this.setData({ [e.currentTarget.dataset.key]: aValue });
				return { value: aValue };
			break;
			case 'useDetail':
				this.setData({ [e.currentTarget.dataset.key]: e.detail.value });
			break;
		}
	},
	appendImageHandler(e){
		if(this.data.appendImageAble){
			this.setData({
				useHtml: [...this.data.useHtml, `<img style='width: 100%;' src=''>`],
			});
			(this.data.useHtml||[]).map((item, index) => {
				let aComp = this.selectComponent('#html_modify_'+index);
					aComp.setup(this.data.useHtml[index]);
			})
		}
		this.checkAppendStatusHandler();
	},
	appendHtmlHandler(e){
		if(this.data.appendHtmlAble){
			this.setData({
				useHtml: [...this.data.useHtml, ''],
			});
			(this.data.useHtml||[]).map((item, index) => {
				let aComp = this.selectComponent('#html_modify_'+index);
					aComp.setup(this.data.useHtml[index]);
			})
		}
		this.checkAppendStatusHandler();
	},
	
	checkAppendStatusHandler(e){
		this.setData({ appendImageAble: true, appendHtmlAble: true });
		this.data.useHtml.forEach((item, index) => {
			let aComp = this.selectComponent('#html_modify_'+index);
			if(!aComp.data.delete &&  !aComp.data.content && aComp.data.mode){
				this.setData({ appendImageAble: false });
			}
			if(!aComp.data.delete &&  !aComp.data.content && !aComp.data.mode){
				this.setData({ appendHtmlAble: false });
			}
		})
	},

	useDetailFocusInHandler(){
		this.setData({ useDetailFocus: true })
	},
	useDetailFocusOutHandler(){
		this.setData({ useDetailFocus: false })
	},

	checkSaveStatusHander(){
		let hasTitle = { name:'title', value: /\S/gi.test(this.data.title), 'err': '券标题不能为空!'};
		let hasTotal = { name: 'total', value: Number(this.data.total)>0, 'err': '券数量必须大于0!'};
		let hasTimeShow = { name: 'timeShow', value: (this.data.timeShowType == 1) || ( this.data.timeShowType == 2 &&  this.data.timeShow.filter(item => !!item).length > 1), 'err': '请输入正确的券展示时间!'};
		let hasTimeGet = { name: 'timeGet', value: this.data.timeGet.filter(item => !!item).length > 1, 'err': '请输入正确的券领取时间!'};
		let hasWriteOff = { name: 'timeWriteoff', value: (this.data.timeWriteoffType == 0 && this.data.timeWriteoff.filter(item => !!item).length > 1) || ( this.data.timeWriteoffType == 1 &&  this.data.writeOffValidDays > 0), 'err': '请输入正确的核销时间!'};
		let hasSlider = { name: 'slider', value: Number(this.data.slider.length) > 0, 'err': '请上传至少一张优惠券图片!' };
		let hasNormalCost = { name: 'normalCost', value: Number(this.data.normalCost) > 0, 'err': '商品成本价必须大于0元!'};
		let hasNormalPrice = { name: 'normalPrice', value: Number(this.data.normalPrice) > 0, 'err': '商品价格必须大于0元!'};
		let hasDiscountOff = { name: 'dissountOff', value: Number(this.data.discountOff) >= 10, 'err': '券折扣必须大于等于10!'};
		let hasGiftCost = { name: 'giftCost', value: Number(this.data.giftCost) > 0, 'err': '礼品成本价必须大于0元!'};
		let hasGiftPrice = { name: 'giftPrice', value: Number(this.data.giftPrice) > 0, 'err': '礼品价格必须大于0元!'};
		let hasCashPrice = { name: 'cashPrice', value: Number(this.data.cashPrice) > 0, 'err': '金额必须大于0元!'};
		let hasFreeCost = { name: 'freeCost', value: Number(this.data.freeCost) > 0, 'err': '食品成本价必须大于0元!'};
		let hasFreePrice = { name: 'freePrice', value: Number(this.data.freePrice) > 0, 'err': '食品价格必须大于0元!'};
		let hasSingleCost = { name: 'singleCost', value: Number(this.data.singleCost) > 0, 'err': '成本价必须大于0元!'};
		let hasSinglePrice = { name: 'singlePrice', value: Number(this.data.singlePrice) > 0, 'err': '商品原价必须大于0元!'};
		let hasUseLimit = { name: 'useLimit', value: ( this.data.useLimitType == 0 ) || ( this.data.useLimitType == 1 && this.data.useLimit > 0 ), 'err': '请输入正确的使用门槛!'};
		let hasDetail = { name: 'detail', value: (this.data.useDetail||'').length > 0, 'err': '券使用说明不能为空!'};

		let aCheckList = [];
		switch(this.data.couponMode){
			case 'discount':
				aCheckList = [hasTimeShow,hasTimeGet,hasTotal,hasWriteOff,hasSlider,hasDiscountOff,hasUseLimit,hasDetail];
			break;
			case 'gift':
				aCheckList = [hasTitle,hasTimeShow,hasTimeGet,hasTotal,hasWriteOff,hasSlider,hasGiftCost,hasGiftPrice,hasUseLimit,hasDetail];
			break;
			case 'cash':
				aCheckList = [hasTimeShow,hasTimeGet,hasTotal,hasWriteOff,hasSlider,hasCashPrice,hasUseLimit,hasDetail];
			break;
			case 'free':
				aCheckList = [hasTitle,hasTimeShow,hasTimeGet,hasTotal,hasWriteOff,hasSlider,hasFreeCost,hasUseLimit,hasDetail]
			break;
			case 'brand':
				aCheckList = [hasTitle,hasSlider];
			break;
			case 'single':
				aCheckList = [hasTitle,hasTimeShow,hasTimeGet,hasTotal,hasWriteOff,hasSlider,hasSingleCost,hasSinglePrice,hasUseLimit,hasDetail];
			break;
			default:
				aCheckList = [hasTitle,hasTimeShow,hasTimeGet,hasTotal,hasWriteOff,hasSlider,hasNormalCost,hasNormalPrice,hasUseLimit,hasDetail];
			break;
		}
		let aResult = aCheckList.find(item => !item.value);
		if(aResult){
			this.setData({ saveAble: false });
			return aResult;

		}else{
			this.setData({ saveAble: true });
			return null;
		}
	},

	preventHandler(e){
		return false;
	},

	fixedHandler(e){
		let aLen = e.currentTarget.dataset.maxlength;
		let aIndex = e.currentTarget.dataset.index;
			aIndex = aIndex>=0?aIndex:-1;
		let aKey = e.currentTarget.dataset.key;
			aKey = aKey=="htmlMedia"?"htmlMedia@"+aIndex:aKey;
		this.setData({
			fixAreaIndex: aIndex,
			fixAreaTarget: aKey,
			fixAreaHtml: this.data[aKey]||e.detail.value||'',
			fixAreaMax: aLen||200,
		})
	},

	fixedInputHandler(e){
		this.setData({ fixAreaHtml: e.detail.value });
	},

	fixedFocusOutHandler(e){
		if(!this.data.fixAreaTarget)return;
		if(/^htmlMedia@/gi.test(this.data.fixAreaTarget)){
			let aComp = this.selectComponent('#html_modify_' + this.data.fixAreaTarget.replace(/htmlMedia@/gi, ''));
			aComp.setup(this.data.fixAreaHtml);
			this.setData({
				['useHtml['+this.data.fixAreaIndex+']']: this.data.fixAreaHtml,
				fixAreaTarget: '',
				fixAreaHtml: '',
				fixAreaMax: 200,
			})
			this.checkAppendStatusHandler();
			return;
		}
		this.setData({
			[this.data.fixAreaTarget]: this.data.fixAreaHtml,
			fixAreaTarget: '',
			fixAreaHtml: '',
			fixAreaMax: 200,
		})
		this.checkAppendStatusHandler();
	},

	saveHandler(e){
		let aChecker = this.checkSaveStatusHander();
		if(aChecker){
			wx.showToast({
				title: aChecker.err,
				icon: 'none',
				duration: 3000,
				mask: false,
			})
			return;
		};
		let aParam = {
			categoryId: this.data.categoryId,
			mainInfo: this.data.title,
			extendInfo: this.data.subTitle,
			quantity: this.data.total,
			displayTimeType: this.data.timeShowType,
			displayStartTime: this.data.timeShow[0],
			displayEndTime: this.data.timeShow[1],
			getStartTime: this.data.timeGet[0],
			getEndTime: this.data.timeGet[1],
			effectiveType: this.data.timeWriteoffType,
			effectiveStartTime: this.data.timeWriteoff[0],
			effectiveEndTime: this.data.timeWriteoff[1],
			activedLimitedStartDay: this.data.writeOffActiveAfterDays,
			activedLimitedDays: this.data.writeOffValidDays,
			imageList: this.data.slider.filter(item => item && item.imgUrl),
			conditionType: this.data.useLimitType,
			conditionPrice: this.data.useLimit*100,
			cost: 0,
			isAllShop: 1,
			rectangle: 2,
			shopId: getApp().globalData.shopId,
			descClause: this.data.useDetail.replace(/(\r|\n)/, '<br>'),
			imgtxtInfo: JSON.stringify((this.data.useHtml||[]).filter((item, index) => {
				let aComp = this.selectComponent('#html_modify_'+index);
				if(aComp.data.delete)return false;
				if(/^<img.*src=.+>$/i.test(item)){
					if(!String(item).replace(/.*src=['"]([^'"]*).*/gi, '$1'))return false;
				}
				if(!/\S/g.test(item))return false;
				return true;
			})),
			/*imgtxtInfo: JSON.stringify((this.data.tmpHtml||[]).map((item, index) => {
				let aComp = this.selectComponent('#html_comp_'+index);
				if(!aComp.data.delete && aComp.data.content){
					if(aComp.data.mode){
						return `<img style="width: 100%;" src="${aComp.data.content}">`;
					}else{
						return aComp.data.content;
					}
					return '';
				}
			}).filter(item => item)),*/
		};
		switch(this.data.couponMode){
			case 'discount':
				//discount
				aParam['discount'] = Number(this.data.discountOff) < 10 ? 10: this.data.discountOff;
				aParam['mainInfo'] = aParam.discount+'折折扣券';
			break;
			case 'gift':
				//unitPrice
				aParam['cost'] = this.data.giftCost*100;
				aParam['unitPrice'] = this.data.giftPrice*100;
			break;
			case 'cash':
				//facePrice
				aParam['facePrice'] = this.data.cashPrice*100;
				aParam['mainInfo'] = this.data.cashPrice+'元代金券';
			break;
			case 'free':
				//unitPrice
				aParam['cost'] = this.data.freeCost*100;
				aParam['unitPrice'] = this.data.freePrice*100;
			break;
			case 'brand':
				aParam['quantity'] = 999999;
			break;
			case 'single':
				//unitPrice
				aParam['cost'] = this.data.singleCost*100;
				aParam['unitPrice'] = this.data.singlePrice*100;
			break;
			default:
				//facePrice
				aParam['cost'] = this.data.normalCost*100;
				aParam['facePrice'] = this.data.normalPrice*100;
			break;
		}
		if(aParam.displayStartTime){
			aParam.displayStartTime = aParam.displayStartTime.replace(/\./g, '-');
		}
		if(aParam.displayEndTime){
			aParam.displayEndTime = aParam.displayEndTime.replace(/\./g, '-');
		}
		if(aParam.getStartTime){
			aParam.getStartTime = aParam.getStartTime.replace(/\./g, '-');
		}
		if(aParam.getEndTime){
			aParam.getEndTime = aParam.getEndTime.replace(/\./g, '-');
		}
		if(aParam.effectiveStartTime){
			aParam.effectiveStartTime = aParam.effectiveStartTime.replace(/\./g, '-');
		}
		if(aParam.effectiveEndTime){
			aParam.effectiveEndTime = aParam.effectiveEndTime.replace(/\./g, '-');
		}
		if(this.data.couponId){
			aParam['id'] = this.data.couponId;
			getApp().api.updateCoupon(aParam).then(res => {
				wx.showModal({
					title: '保存成功',
					content: '成功保存修改的内容',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3CC51F',
					success: (aRes) => {
						if(aRes.confirm) {
							getApp().replace('/pages/marketing/coupon/info/index?id='+this.data.couponId);
						}
					},
				})
			}).catch(res => {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					duration: 3000,
					mask: false,
				})
			})
		}else{
			getApp().api.createCoupon(aParam).then(res => {
				wx.showModal({
					title: '创建成功',
					content: '您的优惠券已经成功创建!',
					showCancel: true,
					cancelText: '继续编辑',
					cancelColor: '#000000',
					confirmText: '立即投放',
					confirmColor: '#3CC51F',
					success: (aRes) => {
						if(aRes.confirm) {
							getApp().replace('/pages/marketing/coupon/launch/append/index?id='+res.value);
						}else{
							this.setData({ couponId: res.value });
						}
					},
				})
			}).catch(res => {
				wx.showModal({
					title: '创建失败',
					content: res.msg || '',
					showCancel: false,
					confirmText: '确定',
					confirmColor: '#3CC51F',
				})
			})
		}
	},
})
