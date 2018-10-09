/*
* @Author: Suoping
* @Date:   2018-08-18 01:59:27
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-18 03:31:39
*/
let utils = require('../../../utils/util');
let aTime = null;
let app = getApp();
Page({
	data: {
		error: '',
		oldWord: '',
		newWord: '',
		newWordTwo: '',
		modifyAble: false,
	},
	oldInputHandler(e){
		this.setData({ oldWord: e.detail.value });
		this.checkInputModifyAble();
	},
	oldConfirmHandler(e){},
	newInputHandler(e){
		this.setData({ newWord: e.detail.value });
		this.checkInputModifyAble();
	},
	newConfirmHandler(e){},
	newTwoInputHandler(e){
		this.setData({ newWordTwo: e.detail.value });
		this.checkInputModifyAble();
	},
	newTwoConfirmHandler(e){},
	checkInputModifyAble(){
    this.setData({ modifyAble: true });
		if(!/\S/g.test(this.data.oldWord)){ return false; }
		if(!/\S/g.test(this.data.newWord)){ return false; }
		if(!/\S/g.test(this.data.newWordTwo)){ return false; }
		if(this.data.newWord !== this.data.newWordTwo){ return false; }
		if(this.data.newWord.length < 8){ return false; }
		let aLevel = 0;
		if(/\d/g.test(this.data.newWord)){ aLevel++; }
		if(/[a-z]/g.test(this.data.newWord)){ aLevel++; }
		if(/[A-Z]/g.test(this.data.newWord)){ aLevel++; }
		if(aLevel < 2){ return false; }
		this.setData({ modifyAble: false })
		return true;
	},
	checkModifyAble(){
		this.setData({ modifyAble: false });
		if(!/\S/g.test(this.data.oldWord)){
			this.errorTip('请输入旧密码!');
			return false;
		}
		if(!/\S/g.test(this.data.newWord)){
			this.errorTip('请输入新密码!');
			return false;
		}
		if(!/\S/g.test(this.data.newWordTwo)){
			this.errorTip('请输入确认新密码!');
			return false;
		}
		if(this.data.newWord !== this.data.newWordTwo){
			this.errorTip('两次输入的新密码不一致!');
			return false;
		}
		if(this.data.newWord.length < 8){
			this.errorTip('新密码长度小于8位!');
			return false;
		}
		let aLevel = 0;
		if(/\d/g.test(this.data.newWord)){ aLevel++; }
		if(/[a-z]/g.test(this.data.newWord)){ aLevel++; }
		if(/[A-Z]/g.test(this.data.newWord)){ aLevel++; }
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
	confirmHandler(){
		if(this.checkModifyAble()){
      app.api.modifyPassword({
        userId: app.globalData.userId,
        password: utils.md5(this.data.oldWord),
        newWord: utils.md5(this.data.newWord)
      }).then(res => {
        app.push('/pages/login/index')
        }).catch(err=>{
          this.errorTip(err.msg || err.message)
        })
			//
		}
	},
})