/*
* @Author: Suoping
* @Date:   2018-08-19 10:08:47
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-30 21:35:23
*/

let utils = require('../../utils/util');
Page({
	data: {
    effect: [],
		nameFocus: false,
		passFocus: false,
		inputName: '',
		inputPassword: '',
        redirectPAGE: '',
	},
	onLoad(opts){
        if(!getApp().globalData.userId && wx.getStorageSync('token')){
            getApp().globalData.userId = '-1';
            this.autoLoginHandler();
        }
        this.setData({ nameFocus: true, passFocus: false });

        let starInterval = null;
        let starMax = 30;
        let addStar = ()=> {
            clearTimeout(starInterval);
            let stars = [...this.data.effect];
            stars.push({
                x: Math.round(Math.random() * 100),
                y: Math.round(Math.random() * 90),
                rotate: Math.round(Math.random()*4)*90 - 45,
                scale: Math.random() * .6 + .4,
                delay: Math.random() * starMax *0.05,
            })
            this.setData({ effect: stars });
            if(stars.length >= starMax){
                clearTimeout(starInterval);
            }else{
                starInterval = setTimeout(addStar, Math.random() * starMax*5);
            }
        }
        addStar();
        if(opts.url){
            this.setData({ redirectPAGE: opts.url })
        }
    },
    inputNameHandler(e){
        this.setData({ inputName: e.detail.value })
    },
    inputPwdHandler(e) {
        this.setData({ inputPassword: e.detail.value })
    },
    focusHandler(){
        if(!this.data.inputName){
            this.setData({ nameFocus: true, passFocus: false });
            return;
        }
        if(!this.data.inputPassword){
            this.setData({ nameFocus: false, passFocus: true });
            return;
        }
        this.login();
    },
    autoLoginHandler(){
    	wx.showLoading({ mask: true })
    	getApp().api.getUserInfo().then(res => {
            let aFindPermiNode = function(nodeList){
              if(nodeList){
                if(nodeList.chaildNodes){
                  let aIndex = nodeList.chaildNodes.length;
                  let aNode = null;
                  while(aIndex > 0){
                    aIndex--;
                    aNode = nodeList.chaildNodes[aIndex];
                    if(/(\/|)zuke(_|)/gi.test(aNode.sid)){
                      aIndex = 0;//停止while;
                      return aNode.chaildNodes || aNode;
                    }
                  }
                }else{
                  for(let i = 0; i < nodeList.length; i++){
                    let aPermiNode = aFindPermiNode(nodeList[i]);
                    if(aPermiNode){
                      return aPermiNode.map(item =>  {
                        return ''+item.sid.match(/[^\/_]+$/g)
                      });
                    }
                  }
                }
              }else{
                return [];
              }
            }
    		let app = getApp();
    			app.globalData.type = res.type;
    			app.globalData.userId = res.id;
                app.globalData.shopId = res.shopId;
                app.globalData.address = res.address;
                app.globalData.marketname = res.marketname;
                app.globalData.marketId = res.marketId;
    			app.globalData.userName = res.name;
    			app.globalData.userRealName = res.realName;
    			app.globalData.mobile = res.mobile;
                app.globalData.cityName = res.cityName
    			app.globalData.userAvatar = res.avatar||'/assets/icon_avatar.png';
    			app.globalData.userAge = res.age;
    			app.globalData.userGender = res.gender;
    			app.globalData.userAccountType = (res.accountType||'').toLowerCase();
                app.globalData.userPermis = aFindPermiNode(res.resources);
                if(app.globalData.userAccountType == 'market'){
                    if(app.globalData.userPermis.length == 1 && (app.globalData.userPermis[0] == 'estate' || app.globalData.userPermis[0] == 'index')){
                        app.globalData.userAccountType = 'worker';
                        app.replace('/package_admin/estate/index');
                        return;
                    }
                }
            if(this.data.redirectPAGE){
                app.replace(this.data.redirectPAGE);
            }else{
                switch(app.globalData.userAccountType){
                    case 'market':
                    case 'worker':
                        app.replace('/package_admin/index');
                    break;
                    default:
                        app.replace('/pages/index/index');
                    break;
                }
            }
    		wx.hideLoading();
    	}).catch(res=>{
    		wx.hideLoading();
    		wx.showModal({
    			title: '登录失败',
    			content: '报歉: 登录出现问题, 请重新尝试!',
    			showCancel: false,
    			confirmText: '确定',
    			confirmColor: '#3CC51F'
    		})
    	})
    },
    forgotHandler(){
        getApp().push('/pages/login/password/index');
    },
    login(){
    	let aName = this.data.inputName.replace(/\s/gi, '');
    	let aPass = this.data.inputPassword.replace(/\s/gi, '');
    	if (!aName){
    		wx.showToast({ title: '请输入用户名', icon: 'none', duration: 2000 });
    		this.setData({ nameFocus: true, passFocus: false });
    		return;
    	}
    	if (!aPass){
    		wx.showToast({ title: '请输入密码', icon: 'none', duration: 2000 });
    		this.setData({ nameFocus: false, passFocus: true });
    		return;
        }
        wx.showLoading({ title: '登录中...', mask: true })
    	getApp().api.loginByPassword({
    		username: aName,
    		password: utils.md5(aPass)
    	}).then(res => {
            this.autoLoginHandler();
            /*let tokenChecker = setInterval(() => {
                if(wx.getStorageSync('token')){
                    clearInterval(tokenChecker);
                    this.autoLoginHandler();
                }
            }, 10)*/
    	}).catch(res => {
            wx.hideLoading();
            wx.showModal({
                title: '登录失败',
                content: res.msg || '',
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#3CC51F',
            })
        })
    }
})