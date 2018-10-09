/*
* @Author: Suoping
* @Date:   2018-08-18 03:34:25
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-25 16:10:57
*/

let utils = require('../../../utils/util');
let aTime = null;
Page({
	data: {
		error: '',
		mobile: '',
		code: '',
		newWord: '',
		modifyAble: false,
    text: '获取验证码',
    codeDisabled: false,
    interval:null
	},
	mobileInputHandler(e){
		let aValue = e.detail.value.replace(/\D/gi, '');
		this.setData({ mobile: aValue });
		this.checkInputModifyAble();
		return { value: aValue }
	},
	mobileConfirmHandler(e){},
	codeInputHandler(e){
		this.setData({ code: e.detail.value });
		this.checkInputModifyAble();
	},
	codeConfirmHandler(e){},
	newInputHandler(e){
		this.setData({ newWord: e.detail.value });
		this.checkInputModifyAble();
	},
	newConfirmHandler(e){},
	checkInputModifyAble(){
		this.setData({ modifyAble: false });
		if(!/\S/g.test(this.data.mobile)){ return false; }
		if(!/\S/g.test(this.data.code)){ return false; }
		if(!/\S/g.test(this.data.newWord)){ return false; }
		if(this.data.newWord.length < 8){ return false; }
		let aLevel = 0;
		if(/\d/g.test(this.data.newWord)){ aLevel++; }
		if(/[a-z]/g.test(this.data.newWord)){ aLevel++; }
		if(/[A-Z]/g.test(this.data.newWord)){ aLevel++; }
    if (/[~`@#$%^&\*()_\+{}\|<>\/\\\[\]]/g.test(this.data.newWord)) { aLevel++; }
		if(aLevel < 2){ return false; }
		this.setData({ modifyAble: true })
		return true;
	},
	checkModifyAble(){
		this.setData({ modifyAble: false });
		if(!/\S/g.test(this.data.mobile)){
			this.errorTip('请输入手机号!');
			return false;
		}
		if(!/\S/g.test(this.data.code)){
			this.errorTip('请输入验证码!');
			return false;
		}
		if(!/\S/g.test(this.data.newWord)){
			this.errorTip('请输入新密码!');
			return false;
		}
		if(this.data.newWord.length < 8){
			this.errorTip('新密码长度小于8位!');
			return false;
		}
		let aLevel = 0;
		if(/\d/g.test(this.data.newWord)){ aLevel++; }
		if(/[a-z]/g.test(this.data.newWord)){ aLevel++; }
    if (/[A-Z]/g.test(this.data.newWord)) { aLevel++; }
    if (/[~`@#$%^&\*()_\+{}\|<>\/\\\[\]]/g.test(this.data.newWord)){ aLevel++; }
		if(aLevel < 2){
			this.errorTip('密码必须包含数字,大小写字母中的两种或以上!');
			return false;
		}
		this.setData({ modifyAble: true })
		return true;
	},
	errorTip(str){
		clearTimeout(aTime);
		this.setData({ error: str });
		aTime = setTimeout(() => {
			this.setData({ error: '' });
		}, 2000)
	},

  countdown() {
    let _this = this
    let time = 60
    _this.setData({codeDisabled :true})
    clearInterval(_this.interval)
    let interval = setInterval(function () {
      if (time > 0) {
        time--
        let text = time < 10 ? '0' + time + '秒后重试' : time +'秒后重试'
        _this.setData({
          text
        })
      } else {
        _this.setData({
          text: '获取验证码',
          codeDisabled: false
        })
        clearInterval(_this.data.interval)
      }
    }, 1000)
    _this.setData({
      interval: interval
    })
  },

  getUserInfoByMobileNum(){
    let reg = /^1\d{10}$/,_this=this;
    if (this.data.codeDisabled){
      return
    }
    if (reg.test(this.data.mobile) == false) {
      this.errorTip('请输入正确的手机号')
      return false
    }
    getApp().api.getUserInfoByMobileNum({
      mobileNum: this.data.mobile
    }).then(res=>{
      _this.getCode()
      }).catch(res => {
        _this.errorTip(res.msg || res.message)
      })
  },
	//获取验证码
  getCode(){
    let _this = this
    getApp().api.getCode({
      mobileNum: this.data.mobile
    }).then(res=>{
      _this.countdown()
    }).catch(res => {
			_this.errorTip(res.msg || res.message)
    })
  },
	verifyCode(){
		let _this=this
    getApp().api.verifyCode({
      mobileNum: this.data.mobile,
      code: this.data.code
    }).then(res=>{
			_this.resetPassword()
      }).catch(res => {
        _this.errorTip(res.msg || res.message)
      })
	},
	resetPassword(){
		let _this=this
		getApp().api.resetPassword({
      mobileNum: _this.data.mobile,
      password: utils.md5(_this.data.newWord)
    }).then(res=>{
				wx.showToast({
					title: '密码重置成功',
					icon: 'success'
				});
				getApp().push('/pages/login/index')
      }).catch(res => {
      _this.errorTip(res.msg || res.message)
      })
	},
	confirmHandler(){
		if(this.checkModifyAble()){
      this.verifyCode()
			//
		}
	},
})
