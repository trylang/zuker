// pages/marketing/facetoface/index.js
let util = require("../../../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputFocus: true,
    inputCode: ""
  },
  clearHandler(e) {
    this.setData({ inputCode: "", inputFocus: false });
    setTimeout(() => {
      this.setData({ inputFocus: true });
    }, 100);
  },
  inputChecker(e) {
    let aCode = util.formatCode(e.detail.value);
    this.setData({ inputCode: aCode });
    return aCode;
  },
  inputHandler(e) {
    return { value: this.inputChecker(e) };
  },
  searchFunc(aCode) {
    getApp()
        .api.getCouponDetail({ qrCode: aCode })
        .then(res => {
          wx.hideLoading();
          if (res.qrCode) {
            wx.setStorageSync("CouponInfo", res);
            getApp().push("/pages/marketing/coupon/return/ticket/quit/index");
          } else {
            wx.showModal({
              title: "提示",
              content: "报歉: 找不到券码对应的信息!",
              showCancel: true,
              cancelText: "扫码试试",
              cancelColor: "#000000",
              confirmText: "重新输入",
              confirmColor: "#3CC51F",
              success: res => {
                if (res.confirm) {
                  this.clearHandler();
                } else {
                  this.scanHandler();
                }
              }
            });
          }
        })
        .catch(res => {
          wx.hideLoading();
          wx.showToast({
            title: res.msg || '找不到券码对应的信息',
            icon: "none",
            duration: 2500,
            mask: false
          });
        });
  },
  scanHandler(e) {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        let aCode = res.result.replace(/\s/gi, '');
				this.searchFunc(aCode);	
      }
    });
  },
  confirmHandler(e) {
    let aCode = "";
    if (e.detail && e.detail.value) {
      this.inputChecker(e);
    }
    aCode = this.data.inputCode.replace(/\s/gi, "");

    if (aCode) {
      wx.showLoading({
        title: "查询中...",
        mask: true
      });
      this.searchFunc(aCode);
    } else {
      wx.showModal({
        title: "券码错误",
        content: "提示: 请使用正确的券码!",
        showCancel: true,
        cancelText: "扫码试试",
        cancelColor: "#000000",
        confirmText: "重新输入",
        confirmColor: "#3CC51F",
        success: res => {
          if (res.confirm) {
            this.clearHandler();
          } else {
            this.scanHandler();
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
