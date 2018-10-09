/*
* @Author: Suoping
* @Date:   2018-08-14 23:39:43
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-30 12:04:15
*/

let base = require('./wxBase.js');

module.exports = {

  //用户相关
    /** 
   *  用户登录
   * //http://10.10.11.47:8090/pages/viewpage.action?pageId=11934012
   * @param 用户名
   * @param 密码 
   * @return data
   */
	loginByPassword({username, password}){
    return base.$get.simple('user/login', {username, password}).then(res => {
			return res.data;//在这里做数据抹平操作;
		});
	},

    /** 
   *  修改密码
   * http://10.10.11.47:8090/pages/viewpage.action?pageId=11934026
   * @param 用户ID
   * @param 原密码
   * @param 新密码
   * @return data
   */
  modifyPassword({ userId, password, newWord }) {
    return base.$get('user/modify/password', { userId, password, newWord }).then(res => {
      return res.data;
    });
  },

  /** 
    *  退出
    * http://211.157.182.226:8090/pages/viewpage.action?pageId=11934008
    * @return data
    */
  logout() {
    return base.$get('user/logout').then(res => {
      return res.data;
    });
  },

  /** 
 *  获取用户信息
 * http://211.157.182.226:8090/pages/viewpage.action?pageId=11934003
 * @return data
 */
  getUserInfoById({userId}) {
    return base.$get('user/info', {userId}).then(res => {
      return res.data;
    });
  },

/** 
*  获取店铺详情
* http://211.157.182.226:8090/pages/viewpage.action?pageId=12485015
* @param 商户ID
* @return data
*/
getShopDetail({ shopId }) {
  return base.$get('shop/detail', { shopId }).then(res => {
    return res.data;
  });
},
  //通过token获取用户信息
  //http://10.10.11.47:8090/pages/viewpage.action?pageId=12484958
  getUserInfo(){
    return base.$get('user/info/by/token').then(res => {
      let realName
      if (res.data.isSub){
        realName = res.data.realName || res.data.name
      }else{
        realName = res.data.type == 2 ? res.data.shop.realName : res.data.market.realName
      }
      return {
        id: res.data.id,
        shopId: res.data.shopId,
        name: res.data.name||'',
        address: res.data.type==2?res.data.shop.address:res.data.market.companyAddress,
        marketname: res.data.market.name,
        marketId: res.data.marketId,
        cityName: res.data.cityName||'',
        realName,
        mobile: res.data.mobile||'',
        avatar: res.data.type == 2 ? res.data.shop.imgLogoUrl : res.data.market.imgLogoUrl,
        age: res.data.age||0,
        gender: ['male', 'female'][res.data.gender||0],
        accountType: ['unknow', 'market', 'shop'][res.data.type || 1],
        resources: res.data.resources,
        type: res.data.type,  // type=2 为店铺，tenantId = shopId; type = 1, 为商场， tenantId = marketId 
      };
    })
  },

  /** 
 *  根据手机号获取用户信息
 * http://211.157.182.226:8090/pages/viewpage.action?pageId=12484845
 * @param 手机号
 * @return data
 */
  getUserInfoByMobileNum({ mobileNum }) {
    return base.$get.simple('api/get/user', { mobileNum }).then(res => {
      return res.data;
    });
  },

  /** 
 *  获取验证码接口
 * http://211.157.182.226:8090/pages/viewpage.action?pageId=12484845
 * @param 手机号
 * @return data
 */
  getCode({ mobileNum }) {
    return base.$get.simple('api/v1/sms/get/code', { mobileNum }).then(res => {
      return res.data;
    });
  },

  /** 
 *  验证验证码接口
 * http://211.157.182.226:8090/pages/viewpage.action?pageId=12484845
 * @param 手机号
 * @param 验证码
 * @return data
 */
  verifyCode({ mobileNum, code }) {
    return base.$get.simple('api/v1/sms/verify/code', { mobileNum, code }).then(res => {
      return res.data;
    });
  },

  /** 
*  根据手机号重置密码接口
* http://211.157.182.226:8090/pages/viewpage.action?pageId=12484845
* @param 手机号
* @param 密码
* @return data
*/
  resetPassword({ mobileNum, password }) {
    return base.$get.simple('api/reset/password', { mobileNum, password }).then(res => {
      return res.data;
    });
  },


//消息相关
  /** 
*  消息通知列表接口
* http://211.157.182.226:8090/pages/viewpage.action?pageId=12484734
* @param 第几页
* @param 每页多少条
* @return data
*/
  getMsgList({ page = 1, pageSize = 10, type = 4 } ={}) {
    return base.$get.list('message/notification/mobile/list', { page, pageSize, type }).then(res => {
      res.data.list = res.data.list.map(item=>{
        return {
          title: item.title||'',
          content: item.content||'',
          time: item.createTime||'',
          read: item.state,
          id: item.id
        }
      })
      return res.data;
    });
  },

  /** 
*  消息详情接口
* http://211.157.182.226:8090/pages/viewpage.action?pageId=12484739
* @param 消息ID
* @return data
*/
  getMsgdetail({ id }) {
    return base.$get('message/notification/detail', { id }).then(res => {
      return res.data;
    });
  },

  /** 
*  设为已读
* http://211.157.182.226:8090/pages/viewpage.action?pageId=12484779
* @param 消息ID
* @return data
*/
  updateMsg({ id }) {
    return base.$get('message/notification/read', { id }).then(res => {
      return res.data;
    });
  }
  
}
