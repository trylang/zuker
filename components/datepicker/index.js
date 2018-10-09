/*
* @Author: Suoping
* @Date:   2018-08-15 10:26:16
* @Last Modified by:   Suoping
* @Last Modified time: 2018-09-28 22:25:15
*/

let aSelected = [];
Component({
	properties: {
		mode: {
			type: String,
			value: 'date',
		},
		autoClose: {
			type: Boolean,
			value: true,
		},
		simple: {
			type: Boolean,
			value: false,
		},
	},
	data: {
		visible: false,
		yearActive: false,
		yearList: [],
		sliderIndex: 1,
		sliderDuration: 200,
		today: null,
		month: null,
		monthCN: '',
		year: null,
		weekDayPrev: [],
		weekDayCurrent: [],
		weekDayNext: [],
		selected: [],
	},
	methods: {
		yearOpenHandler(e){
			this.setData({
				yearActive: true,
			})
		},
		yearSelectHandler(e){
			let aYear = this.data.yearList[e.target.dataset.index] || this.data.year;
			if(aYear !== this.data.year){
				this.setup(new Date(aYear, this.data.month - 1, this.data.today.getDate()));
			}
			this.setData({
				yearActive: false,
			})
		},
		dateClickHandler(e){
			let aDataset = e.target.dataset;
			let aDate = new Date(aDataset.year, aDataset.month, aDataset.date);

			aSelected.push(aDate);
			if(this.data.mode == 'date'){
				this.highlightDateClear();
				aSelected = [aSelected.pop()];
				//date模式下保持当前只选中一个日期;
			}else{
				if(aSelected.length > 1 && aSelected[0].getTime() == aSelected[1].getTime()){
					aSelected = [aSelected.pop()];
				}
			}
			if(this.data.mode == 'date'){
				this.setData({
					selected: [...aSelected]
				})
				this.highlightDate(this.data.selected[this.data.selected.length - 1]);
				this.triggerEvent('change', this.data.selected);
				if(this.data.autoClose)this.close();
				aSelected = [];
			}else{
				this.highlightDate(aSelected[aSelected.length - 1], 'gray');
				if(aSelected.length >= 2){
					if(aSelected[0].getTime() > aSelected[1].getTime()){
						aSelected.reverse();
					}
					this.setData({
						selected: [...aSelected]
					})
					this.highlightDateClear();
					this.highlightDate(this.data.selected[0], 'start');
					this.highlightDate(this.data.selected[1], 'end');
					this.triggerEvent('change', this.data.selected);
					if(this.data.autoClose)this.close();
					aSelected = [];
				}
			}
		},
		monthPrevHandler(){
			this.sliderHandler({ detail: { current: 0 } });
		},
		monthNextHandler(){
			this.sliderHandler({ detail: { current: 2 } });
		},
		sliderHandler: function(e){
			let aIndex = e.detail.current;
			let aDate = null;
			if(aIndex < this.data.sliderIndex){
				aDate = new Date(this.data.today.getFullYear(), this.data.today.getMonth() - 1)
			}else if(aIndex > this.data.sliderIndex){
				aDate = new Date(this.data.today.getFullYear(), this.data.today.getMonth() + 1);
			}else{
				return;
			};
			this.setData({
				sliderDuration: 0,
			})
			this.setup(aDate);
			this.setData({
				sliderIndex: 1,
			})
			this.setData({
				sliderDuration: 200,
			})
		},
		highlightDate(date, tag = 'selected'){
			let aYear = date.getFullYear();
			let aMonth = date.getMonth();
			let aDate = date.getDate();
			let aNode = null;
			let i = 0, j = 0;
			for(i = 0; i < this.data.weekDayCurrent.length; i++){
				aNode = this.data.weekDayCurrent[i];
				for(j = 0; j < aNode.length; j++){
					if(tag == 'end'){
						if(this.checkDateInRange(new Date(aNode[j].year, aNode[j].month, aNode[j].date))){
							this.setData({
								['weekDayCurrent['+i+']['+j+'].range']: true
							})
						}
					}
					if(aNode[j].year == aYear && aNode[j].month == aMonth && aNode[j].date == aDate){
						this.setData({
							['weekDayCurrent['+i+']['+j+'].'+tag]: true
						})
					}
				}
			}
			for(i = 0; i < this.data.weekDayPrev.length; i++){
				aNode = this.data.weekDayPrev[i];
				for(j = 0; j < aNode.length; j++){
					if(tag == 'end'){
						if(this.checkDateInRange(new Date(aNode[j].year, aNode[j].month, aNode[j].date))){
							this.setData({
								['weekDayPrev['+i+']['+j+'].range']: true
							})
						}
					}
					if(aNode[j].year == aYear && aNode[j].month == aMonth && aNode[j].date == aDate){
						this.setData({
							['weekDayPrev['+i+']['+j+'].'+tag]: true
						})
					}
				}
			}
			for(i = 0; i < this.data.weekDayNext.length; i++){
				aNode = this.data.weekDayNext[i];
				for(j = 0; j < aNode.length; j++){
					if(tag == 'end'){
						if(this.checkDateInRange(new Date(aNode[j].year, aNode[j].month, aNode[j].date))){
							this.setData({
								['weekDayNext['+i+']['+j+'].range']: true
							})
						}
					}
					if(aNode[j].year == aYear && aNode[j].month == aMonth && aNode[j].date == aDate){
						this.setData({
							['weekDayNext['+i+']['+j+'].'+tag]: true
						})
					}
				}
			}
		},
		highlightDateClear(){
			let aNode = null;
			let i = 0, j = 0;
			for(i = 0; i < this.data.weekDayCurrent.length; i++){
				aNode = this.data.weekDayCurrent[i];
				for(j = 0; j < aNode.length; j++){
					if(aNode[j].start || aNode[j].end || aNode[j].selected || aNode[j].gray || aNode[j].range){
						this.setData({
							['weekDayCurrent['+i+']['+j+'].start']: false,
							['weekDayCurrent['+i+']['+j+'].end']: false,
							['weekDayCurrent['+i+']['+j+'].selected']: false,
							['weekDayCurrent['+i+']['+j+'].gray']: false,
							['weekDayCurrent['+i+']['+j+'].range']: false,
						})
					}
				}
			}
			for(i = 0; i < this.data.weekDayPrev.length; i++){
				aNode = this.data.weekDayPrev[i];
				for(j = 0; j < aNode.length; j++){
					if(aNode[j].start || aNode[j].end || aNode[j].selected || aNode[j].gray || aNode[j].range){
						this.setData({
							['weekDayPrev['+i+']['+j+'].start']: false,
							['weekDayPrev['+i+']['+j+'].end']: false,
							['weekDayPrev['+i+']['+j+'].selected']: false,
							['weekDayPrev['+i+']['+j+'].gray']: false,
							['weekDayPrev['+i+']['+j+'].range']: false,
						})
					}
				}
			}
			for(i = 0; i < this.data.weekDayNext.length; i++){
				aNode = this.data.weekDayNext[i];
				for(j = 0; j < aNode.length; j++){
					if(aNode[j].start || aNode[j].end || aNode[j].selected || aNode[j].gray || aNode[j].range){
						this.setData({
							['weekDayNext['+i+']['+j+'].start']: false,
							['weekDayNext['+i+']['+j+'].end']: false,
							['weekDayNext['+i+']['+j+'].selected']: false,
							['weekDayNext['+i+']['+j+'].gray']: false,
							['weekDayNext['+i+']['+j+'].range']: false,
						})
					}
				}
			}
		},
		checkDateEqual(date1, date2){
			return date1.toString() == date2.toString();
		},
		checkDateInRange(date){
			return this.data.selected.length >=2 && date && (this.data.selected[0] && this.data.selected[0].getTime() < date.getTime()) && (this.data.selected[1] && this.data.selected[1].getTime() > date.getTime());
		},
		getDateFromData(data){
			let aDate = null;
			if(data){
				aDate = new Date(data);//时间戳;
				if(isNaN(aDate.getFullYear())){
					aDate = new Date((String(data).match(/\d+/gi)||[]).map(item => (Number(item)>9?item:'0'+Number(item))).join('-'));//格式化过的时间字符串;
				}
			}
			return aDate;
		},
		getWeekDayFromDate(date){
			let aPrevDate = new Date(date.getFullYear(), date.getMonth() - 1);
			let aNextDate = new Date(date.getFullYear(), date.getMonth() + 1);
			let aFirstDay = date.getFirstWeekDay();
			let aMaxDays = date.getDays();
			let aMax = Math.ceil((aMaxDays + aFirstDay) / 7) * 7; //动态根据日期显示4行或5行;
			aMax = 42;	//6*7能保证在某月1号是星期六,并且当月31天时, 5行无法显示全的问题;
			let aDay = [];		//预处理数组, 后面再解构到data中的变量以节省界面刷新次数;
			for(let i = 0; i < aMax; i++){
				let aItem = {
					date: 0,
					month: 0,
					year: 0,
					disabled: true,
					start: false,
					end: false,
					selected: false,
					gray: false,
					range: false,
				}
				if(i < aFirstDay){
					//上一个月份
					aItem.date = aPrevDate.getDays() - aFirstDay + i + 1;
					aItem.month = aPrevDate.getMonth();
					aItem.year = aPrevDate.getFullYear();
				}else if(i >= aFirstDay && i < Number(aFirstDay + aMaxDays)){
					//当前月份的天数正常添加;
					aItem.date = i - aFirstDay + 1;
					aItem.month = date.getMonth();
					aItem.year = date.getFullYear();
					aItem.disabled = false;
				}else{
					//下一个月份;
					aItem.date = i - Number(aFirstDay + aMaxDays) + 1;
					aItem.month = aNextDate.getMonth();
					aItem.year = aNextDate.getFullYear();
				}
				if(this.data.mode == 'date'){
					if(this.data.selected && this.data.selected[0]){
						aItem.selected = this.checkDateEqual(new Date(aItem.year, aItem.month, aItem.date), this.data.selected[0]);
					}
					aSelected = [];
				}else{
					if(aSelected[0]){
						aItem.gray = this.checkDateEqual(new Date(aItem.year, aItem.month, aItem.date), aSelected[0]);
					}
					if(this.data.selected && this.data.selected[0]){
						aItem.start = this.checkDateEqual(new Date(aItem.year, aItem.month, aItem.date), this.data.selected[0]);
					}
					if(this.data.selected && this.data.selected[1]){
						aItem.end = this.checkDateEqual(new Date(aItem.year, aItem.month, aItem.date), this.data.selected[1]);
						aItem.range = this.checkDateInRange(new Date(aItem.year, aItem.month, aItem.date));
					}
				}
				aDay.push(aItem);
			}
			let aWeekDays = [];
			while(aDay.length){
				aWeekDays.push(aDay.splice(0, 7));
			}
			return aWeekDays;
		},
		setup: function(date){
			let aDate = this.getDateFromData(date) || new Date();
			let datePrev = new Date(aDate.getFullYear(), aDate.getMonth() - 1);
			let dateNext = new Date(aDate.getFullYear(), aDate.getMonth() + 1);
			let aFullYear = aDate.getFullYear();
			let aMonth = aDate.getMonth();
			this.setData({
				today: aDate,
				month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12][aMonth],
				monthCN: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][aMonth],
				year: aFullYear,
				weekDayPrev: this.getWeekDayFromDate(datePrev),
				weekDayCurrent: this.getWeekDayFromDate(aDate),
				weekDayNext: this.getWeekDayFromDate(dateNext),
			})
			if(!this.data.yearList.length){
				this.setData({
					yearList: [aFullYear, aFullYear+1, aFullYear+2],
				})
			}
		},
		open(selected){
			this.setData({
				visible: true
			})
			aSelected = [];
			if(selected){
				let aDate = null;
				switch(this.data.mode){
					case 'date':
						if(Object.prototype.toString.call(selected) === '[object Array]'){
							aDate = this.getDateFromData(selected[0]);
						}else{
							aDate = this.getDateFromData(selected);
						}
						if(aDate){
							this.setData({
								selected: [aDate]
							})
							this.highlightDateClear();
							this.highlightDate(aDate);
						}
					break;
					default:
						if(Object.prototype.toString.call(selected) === '[object Array]'){
							if(selected.length >= 2){
								aSelected = [this.getDateFromData(selected[0]), this.getDateFromData(selected[1])];
								if(aSelected[0].getTime() > aSelected[1].getTime()){
									aSelected.reverse();
								}
								this.setData({
									selected: [...aSelected]
								})
								this.highlightDateClear();
								this.highlightDate(aSelected[0], 'start');
								this.highlightDate(aSelected[1], 'end');
								aSelected = [];
							}
							
						}
					break;
				}
			}
		},
		close(){
			aSelected = [];
			this.setData({
				visible: false,
			})
			this.triggerEvent('close');
		},
		reset(){
			aSelected = [];
			this.setData({
				selected: [],
			})
			this.highlightDateClear();
		},
		format(time, fms = 'YYYY-MM-DD'){
			    if(!time)return '';
				let aDateIns = new Date(time);let aYear = aDateIns.getFullYear();let aMonth = aDateIns.getMonth()+1;let aDate = aDateIns.getDate();let aHours = aDateIns.getHours();let aMinutes = aDateIns.getMinutes();let aSeconds = aDateIns.getSeconds();
				return fms.replace(/YYYY/gi, aYear).replace(/MM/g, aMonth<10?'0'+aMonth:aMonth).replace(/DD/gi, aDate<10?'0'+aDate:aDate).replace(/hh/gi, aHours<10?'0'+aHours:aHours).replace(/mm/g, aMinutes<10?'0'+aMinutes:aMinutes).replace(/ss/gi, aSeconds<10?'0'+aSeconds:aSeconds).replace(/yy/gi, aYear%100).replace(/M/g, aMonth).replace(/d/gi, aDate).replace(/h/gi, aHours).replace(/m/g, aMinutes).replace(/s/gi, aSeconds);
		}
	},
	attached(){
		if(!Date.getDays){
			Date.prototype.getDays = function(){
				return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate();
			}
		}
		if(!Date.getFirstWeekDay){
			Date.prototype.getFirstWeekDay = function(){
				return new Date(this.getFullYear(), this.getMonth(), 1).getDay();
			}
		}
		
		this.setup();
	},
})