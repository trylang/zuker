/*
* @Author: Suoping
* @Date:   2018-08-19 12:02:45
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-19 12:03:00
*/

Page({
  data: {
    data_center: [
      {
        title: "销售额",
        date: "时间",
        list: {
          全场排名: "12",
          楼层排名: "6",
          业态排名: "21"
        }
      },
      {
        title: "销售坪效",
        date: "时间",
        list: {
          全场排名: "14",
          楼层排名: "8",
          业态排名: "23"
        }
      }
    ],
    router: [{
      title: '客流数据集中管理',
      imgSrc: '../assets/compass_pel_flow.png',
      btnSrc: '../assets/compass_peo_flow_btn.png',
      class: 'compass_pel_flow_bg',
      // url: '/package_datacenter/people_flow/index',
      url: '',
    }, {
      title: '核销情况统计查询',
      imgSrc: '../assets/compass_coupon.png',
      btnSrc: '../assets/compass_coupon_btn.png',
      class: 'compass_coupon_bg',
      url: '/package_datacenter/coupon/index',
    }]
  },
  toggleSelect(e) {
    let item = e.currentTarget.dataset.item;
    if (item.url) {
      getApp().push(item.url);
    }
  },
  closePickerHandler(e) {
    let aId = e.currentTarget.id;
    let aPicker = this.selectComponent("#" + aId);
    let aSelected = aPicker.data.selected;
    if (aSelected.length > 1) {
      let aStart = aPicker.format(aSelected[0], "YYYY.MM.DD");
      let aEnd = aPicker.format(aSelected[1], "YYYY.MM.DD");
      console.log(aId, aStart, aEnd);
      switch (aId) {
        case "showPicker":
          this.setData({ timeShow: [aStart, aEnd] });
          break;
        case "getPicker":
          this.setData({ timeGet: [aStart, aEnd] });
          break;
        default:
          this.setData({ timeWriteoff: [aStart, aEnd] });
          break;
      }
    } else {
      switch (aId) {
        case "showPicker":
          this.setData({ timeShow: [] });
          break;
        case "getPicker":
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
  showPickerResetHandler(e) {
    this.selectComponent("#showPicker").reset();
  },
  showPickConfirmHandler(e) {
    let aPicker = this.selectComponent("#showPicker");
    aPicker.close();
  }
});
