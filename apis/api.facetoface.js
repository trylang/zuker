/*
* @Author: Suoping
* @Date:   2018-08-15 00:02:48
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-29 01:21:32
*/

let util = require("../utils/util.js");
let base = require("./wxBase.js");
let pSize = 10;
let FACE_URL = 'https://app-face.rtmap.com/';

module.exports = {
  // 获取api接口路径
  getApiPath() {
    return base.$path;
  },

  // 获取当前token
  getToken() {
    return base.$getToken();
  },

  /**
   * 根据不同类型查询会员详情(D端)
   */
  getCustomerDetail(param) {
    return base.$get(FACE_URL+"app-face/api/scrm/customer/detail/by/type", param).then(res => {
      return res.data;
    });
  },

  /**
   * 通过泛会员标识查询cid
   */
  getCid(param) {
    return base.$get(FACE_URL+"app-face/api/scrm/customer/queryCid", param).then(res => {
      return res.data;
    });
  },

  /**
   * 会员详情查询接口
   * @param tenantId 租户id
   * @param tenantType 租户类型 1:商场，2:商户
   * @param searchType 查询类型: 1:mobile,3:cardNo,6:username,7:cid
   * @param searchText 查询内容
   */
  getCustomerInfo(param) {
    return base.$get(FACE_URL+"app-face/api/scrm/customer/detail", param).then(res => {
      return res.data;
    });
  },

  /**
   * 面对面积分
   */
  postScoreInfo(param) {
    return base.$post(FACE_URL+"app-face/app/score/get", param).then(res => {
      return res.data;
    });
  },

  /**
   * 面对面赠券
   */
  postCouponInfo(param) {
    return base.$post(FACE_URL+"app-face/app/coupon/get", param).then(res => {
      return res.data;
    });
  },

  /**
   * 面对面赠券列表
   */
  getCouponListInfo({ tenantId, tenantType, shopId, page = 1, pageSize = pSize } = {}) {
    let aParam = { tenantId, tenantType, shopId, page, pageSize};
    return base.$get(FACE_URL+"app-face/app/coupon/list", aParam).then(res => {
      return res.data;
    });
  },

  /**
   * 券码核销 -- 核销接口
   */
  getCouponWriteoffInfo(param) {
    return base.$get(FACE_URL+"app-face/app/coupon/writeoff", param).then(res => {
      return res.data;
    });
  },

  /**
   * 券码核销 -- 用户在指定商户下已领取的券列表
   */
  getCouponInstanceGotList(param) {
    return base.$get(FACE_URL+"app-face/app/coupon/instance/got/list", param).then(res => {
      return res.data;
    });
  },

  /**
   * 扫码退券 -- 券核销详情接口
   */
  getCouponDetail(param) {
    return base.$get(FACE_URL+"app-face/app/coupon/instance/detail", param).then(res => {
      return res.data;
    });
  },

  /**
   * 扫码退券 -- 扫码退券接口
   */
  postCouponReturn(param) {
    return base.$post(FACE_URL+"app-face/app/coupon/return", param).then(res => {
      return res.data;
    });
  },

  /**
   * 扫码退券 -- 用户已核销券列表
   */
  getCouponWriteOffList(param) {
    return base.$get(FACE_URL+"app-face/app/coupon/instance/writeoff/list", param).then(res => {
      return res.data;
    });
  },

  /**
   * 扫码退券 -- 按优惠券统计
   */
  postStatisticsByCoupon(param) {
    return base.$post(FACE_URL+"app-face/api/coupon/return/statistics/by/coupon", param).then(res => {
      return res.data;
    });
  },

  /**
   * 扫码退券 -- 按商户统计
   */
  postStatisticsByShop(param) {
    return base.$post(FACE_URL+"app-face/api/coupon/return/statistics/by/shop", param).then(res => {
      return res.data;
    });
  },

  /**
   * 扫码退券 -- 退券记录
   */
  postCouponReturnFlow(param) {
    return base.$post(FACE_URL+"app-face/api/coupon/return/flow", param).then(res => {
      return res.data;
    });
  },

};
