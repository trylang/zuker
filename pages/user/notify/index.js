/*
* @Author: Suoping
* @Date:   2018-08-18 02:19:04
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-18 02:24:24
*/
let utils = require('../../../utils/util');
Page({
	data: {
		unreadNum: 0,
		list: [],
	},
  onLoad(){
    this.getMsgList()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function (e) {
    if (this.data.page >= Math.floor(this.data.unreadNum/10)){
      return false
    }
    let page = this.data.page + 1
    this.getMsgList(page)
  },

  getMsgList(page=1){
    wx.showLoading({
      mask: true
    })
    getApp().api.getMsgList({ page }).then(res => {
      wx.hideLoading();
      res.list=res.list.map(item=>{
        item.time = utils.formatTime(item.time,'YYYY.MM.DD hh:mm:ss')
        return item
      })
      let dataList = this.data.list
      dataList.push(...res.list)
      this.setData({
        page: res.page,
        unreadNum: res.total,
        list: dataList
      })
    }).catch(res => {
      wx.hideLoading();
    })
  },
  msgInfo(e){
    getApp().push('/pages/user/notify/info/index?id=' + e.currentTarget.id)
  }
})