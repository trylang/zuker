/*
* @Author: Suoping
* @Date:   2018-08-29 23:01:26
* @Last Modified by:   Suoping
* @Last Modified time: 2018-08-30 01:26:41
*/

Component({
	properties:{
		appId: {
			type: String,
			value: '',
		},
		webURL: {
			type: String,
			value: '',
			observer: function(v){
				v = v + (v.indexOf('?')<0?'?':'&')+'from='+this.data.page;
				v = `https://dev.rtmap.com/rtmap-platform/preoauth/${this.data.appId}/base?r=${encodeURIComponent(v)}`;
				this.setData({ trueURL: v });
				return v;
			}
		},
		page: {
			type: String,
			value: '',
		}
	},
	data:{
		trueURL: '',
	}
})