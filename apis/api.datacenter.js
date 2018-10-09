/*
* @Author: Suoping
* @Date:   2018-08-15 00:02:48
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-28 22:27:22
*/

let util = require('../utils/util.js');
let base = require('./wxBase.js');
let pSize = 10;

module.exports = {
  // 获取api接口路径
  getApiPath() {
    return base.$path;
  },

  // 获取当前token
  getToken() {
    return base.$getToken();
  },

  // 按活动核销统计
  getCouponWriteoffByActivity(param) {
    return base.$get.list('coupon/effect/writeoff/list/by/activity', param).then(res => {
      return res.data;
    })
  },

  // 按券核销统计
  getCouponWriteoffByCategory(param) {
    return base.$get.list('coupon/effect/writeoff/list/by/category', param).then(res => {
      return res.data;
    })
  },
}