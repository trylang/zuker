let couponInfo = null;
let globalData = getApp().globalData;
let util = require("../../../../../../utils/util.js");

Page({
  data: {
    couponInfo: null,
    avatar: "../../../../../../assets/test.jpg",
    qrcodeFormat: "",
    title: "",
    extend: "",
    id: "",
    info: [],
    infoExtend: [],
  },
  radioChange(e) {
    this.data.couponList.forEach(item => {
      if (item.id === parseInt(e.detail.value)) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    this.setData({ couponList: this.data.couponList });
  },
  nextHandler() {
    let param = {
      tenantId: globalData.type == 1 ? globalData.marketId : globalData.shopId,
      tenantType: globalData.type || 1,
      qrCode: couponInfo.qrCode,
      shopId: globalData.shopId,
      openId: couponInfo.openId,
      mobile: globalData.mobile,
      cid: couponInfo.cid,
      couponId: couponInfo.couponId,
      couponActivityId: couponInfo.couponActivityId
    };

    getApp()
      .api.postCouponReturn(param)
      .then(res => {
        wx.setStorageSync("CouponInfo", Object.assign({}, couponInfo, res));
        getApp().push("/pages/marketing/coupon/return/finish/index");
      })
      .catch(err => {
        wx.showToast({
          title: err.msg,
          icon: "none",
          duration: 2500,
          mask: false
        });
      });
  },
  onLoad(options) {
    couponInfo = wx.getStorageSync("CouponInfo");
    if (couponInfo.qrCode) {
      getApp()
        .api.getCouponInfoByQrcode({ qrcode: couponInfo.qrCode })
        .then(res => {
          if (res.qrcode && res.qrcode == couponInfo.qrCode && res.type) {
            let aInfo = [];
            aInfo.push({ label: "所属活动", value: couponInfo.activityName });
            let aDetail = (res.detail||'').replace(/<br(\/|)>/gi,'\r').match(/[^\r\n\s]+/gi);

            switch(res.type){
              case 'normal':
                aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
  
  
                aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
                aInfo.push({ label: '原价', value: res.coupon.facePrice*0.01+'元' })
                aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
                aInfo.push({ label: '使用说明', value: '' });
              break;
              case 'discount':
                aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
                aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
                aInfo.push({ label: '使用说明', value: '' });
              break;
              case 'gift':
                aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
  
  
                aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
                aInfo.push({ label: '礼品原价', value: res.coupon.unitPrice*0.01+'元' })
                aInfo.push({ label: '使用说明', value: '' });
              break;
              case 'cash':
                aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
                aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
                aInfo.push({ label: '使用说明', value: '' });
              break;
              case 'free':
                aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
  
                aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
                aInfo.push({ label: '使用门槛', value: res.PriceRestriction?'消费满'+res.PriceRestriction+'元, 可使用此券':'无消费限制', });
                aInfo.push({ label: '使用说明', value: '' });
              break;
              case 'single':
                aInfo.push({ label: '核销有效期', value: res.writeoffType?'领取后'+(res.writeoffActiveDay||'当')+'天生效, 有效期'+res.writeoffValidDay+'天':res.start+' - '+res.end, });
  
                aInfo.push({ label: '成本价', value: res.coupon.cost*0.01+'元' })
                aInfo.push({ label: '商品原价', value: res.coupon.unitPrice*0.01+'元' })
                aInfo.push({ label: '使用说明', value: '' });
              break;
              case 'brand':
                aDetail = [];
              break;
            }

            this.setData({
              avatar: res.cover,
              title: res.title,
              extend: res.subTitle,
              id: util.formatCode(res.qrcode),
              info: aInfo,
              infoExtend: aDetail,
            });

          }
        });
    }

  }
});
