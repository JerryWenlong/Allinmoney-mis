//升息令牌
(function(){
	var BIG_NUMBER = ['一', '二', '三', '四','五', '六', '七', '八'];
	MIS.InterestToken = MIS.derive(null, {
		create: function(){
			var tokenObj = this.tokenObj = {};
			tokenObj.title = '';
			tokenObj.categoryId = 4;//加息令牌
			tokenObj.priority = 0;
			tokenObj.submitAt = '';
			tokenObj.createAt = '';
			tokenObj.modifiedAt = '';
			tokenObj.value = [];
			tokenObj.displayValue = [];
		},
		init: function(responseObj){
			var list = responseObj.value;
			this.tokenObj.value = list;
			this.tokenObj.couponId = responseObj.couponId;
		},
		randerDisplay: function(){
			var tokenObj = this.tokenObj;
			tokenObj.displayValue = [];

			var list = tokenObj.value;
			var len = list.length;
			for(var i=0;i<len;i++){
				var displayValue = {};
				displayValue.prodTerm = MIS.getDictName(MIS.dictData.monthDay, list[i].prodTerm);
				displayValue.interestStr = '';
				var interestList = list[i].interests;
				var strList = [];
				
				for(var j=0;j<interestList.length;j++){
					var str = '第{0}次：{1}%';
					str = MIS.Util.stringFormat(str, [BIG_NUMBER[interestList[j].order], interestList[j].value]);
					strList.push(str);
				}
				displayValue.strList = strList;
				displayValue.interestStr = strList.join('<br/>');
				displayValue.height = interestList.length * 30 + 'px';
				displayValue.index = i;
				tokenObj.displayValue.push(displayValue)
			}
		},
		saveAddValue: function(cloneObj){
			var obj = {};
			obj.prodTerm = cloneObj.prodTerm.value();
			var list = [];
			var interestList = cloneObj.interests;
			for(var i=0; i<interestList.length; i++){
				var item = {
					order: interestList[i].order,
					value: interestList[i].value,
				}
				list.push(item)
			}
			obj.interests = list;
			//insert
			this.tokenObj.value.push(obj)
			this.randerDisplay(); 
		},
		saveEditValue: function(currentIndex, cloneObj){
			var obj = this.tokenObj.value[currentIndex];
			obj.prodTerm = cloneObj.prodTerm.value();
			var list = [];
			var interestList = cloneObj.interests;
			for(var i=0; i<interestList.length; i++){
				var item = {
					order: interestList[i].order,
					value: interestList[i].value,
				}
				list.push(item)
			}
			obj.interests = list;
			this.randerDisplay();
		},
		deleteValue: function(currentIndex){
			this.tokenObj.value.splice(currentIndex, 1);
			this.randerDisplay()
		},
		cloneValueObj: function(currentIndex, createNew){
			var cloneObj = {
				prodTerm: {
					value: function(){
						if(this.item.hasOwnProperty('value')){
							return this.item.value;
						}else{
							return '';
						}
					},
					item:{},
					list:MIS.dictData.monthDay
				},
				interests: []
			}
			if(createNew) {
				this.cloneAdd(cloneObj)
				return cloneObj;
			}

			var obj = this.tokenObj.value[currentIndex];
			var interestList = obj.interests;
			cloneObj.prodTerm.item.value = obj.prodTerm;
			for(var i=0; i<interestList.length;i++){
				var item = {};
				item.order = interestList[i].order;
				item.name = MIS.Util.stringFormat('第{0}次', [BIG_NUMBER[item.order]]);
				item.value = interestList[i].value;
				cloneObj.interests.push(item)
			}
			return cloneObj;
		},
		cloneAdd: function(cloneObj){
			var len = cloneObj.interests.length;
			var order = len > 0? cloneObj.interests[len-1].order + 1 : 0;
			if(order > 5) return
			var name = MIS.Util.stringFormat('第{0}次', [BIG_NUMBER[order]]);
			var item = {
				order: order,
				name: name,
				value: '',
			}
			cloneObj.interests.push(item);
		},
		cloneDel: function(cloneObj){
			cloneObj.interests.pop();
		},
		checkToken: function(cloneObj){
			var result = {
				flag: true,
				msg: ''
			}
			var list = cloneObj.interests;
			var len = list.length;
			// 天数为正整数
			var prodTerm = cloneObj.prodTerm.value();
			var prodTermReg = /^[1-9]\d*$/;
			if(!prodTermReg.test(prodTerm)){
				result.flag = false;
				result.msg = '请选则类型';
				return result;
			}

			for(var i=0; i<len;i++){
				var order = list[i].order;
				var value = list[i].value;
				if(order < 0){
					result.flag = false;
					result.msg = '次数不正确,请重新设置';
					return result;
				}
				var reg = /^(\d+|\d+\.\d{1,8})$/
				if(!reg.test(value)){
					result.flag = false;
					result.msg = '复投利息必须为数字';
					return result;
				}
			}
			return result
		},
	}, {});

	MIS.InterestTokenMgt = MIS.derive(null, {
		create: function(scope, promise){
			this.scope = scope;
			this.promise = promise;
			this.loading = new MIS.Popup({
				loadingTxt: 'Loading',
				notShow: true
			});
			//get interest token
		},
		getInterestToken: function(successFn){
			var that = this;
			var apiName = 'interesrToken';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var interestObj = that.randerInterestToken(response.data['data']);
				successFn(interestObj);
			});
		},
		randerInterestToken:function(data){
			var obj = new MIS.InterestToken();
			if(data && data.createAt){
				obj.init(data);
			}
			obj.randerDisplay();
			return obj
		},
		addInterestToken: function(obj, successFn){
			
			var data = {
				data: obj.value
			};
			if(obj.couponId){
				data.tokenId=obj.couponId;
			};
			var that = this;
			var apiName = 'interesrToken';
			this.loading.popup();
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				data: data
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				//pop save success
				MIS.successPop("保存成功", function(){
					//refresh
				});
			});
		}

	}, {})
})()