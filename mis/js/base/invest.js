(function(){//活动规则
	'use strict'
	MIS.Invest = MIS.derive(null, {
		create: function(prodId, prodName){
			this.investObj = this.init();
			
		},
		init: function(){
			var obj = {};
			obj.subventions = [];
			obj.beginAt = '';//规则生效时间 yyyy-mm-ddThh:mm:ss
			obj.description = '';//描述信息 1024字符
			obj.endAt = '';//
			obj.prodCodeId = '';//规则适用的产品代码ID
			obj.prodName = '';
			obj.ruleName = '';//规则名称
			obj.shortDescription = '';//简述信息 512
			obj.subventionType = 1;// 积分抵扣类型  1--按投资总额比例抵扣
			return obj
		},
		initCreate: function(prodId, prodName){
			// for create new
			if(prodId)
				this.investObj.prodCodeId = prodId;
			if(prodName)
				this.investObj.prodName = prodName;
		},
		setSubvention: function (responseObj) {
			// body...
			var obj={};
			if(responseObj){
				obj.subventionId = responseObj.subventionId;
				obj.cashExchRate = responseObj.cashExchRate;
				obj.investAmountMax = responseObj.investAmountMax;//最高投资金额
				obj.investAmountMin = responseObj.investAmountMin;
				obj.subventionAmountMax = responseObj.subventionAmountMax;//最高抵扣金额
				obj.subventionAmountMin = responseObj.subventionAmountMin;
				obj.subventionValue = responseObj.subventionValue;//可抵扣的值
				obj.vcashExchRate = responseObj.vcashExchRate;//与其他虚拟货币的兑换比例
			}else{
				obj.cashExchRate = 10;
				obj.investAmountMax = '';//最高投资金额
				obj.investAmountMin = '';
				// obj.subventionAmountMax = '';//最高抵扣金额
				// obj.subventionAmountMin = '';
				obj.subventionValue = '';//可抵扣的值
				// obj.vcashExchRate = '';//与其他虚拟货币的兑换比例
			}
			obj.checked = function(){
				var subValue = obj.subventionValue;
				var subReg = /^(\d{1,3}|\d{1,3}\.\d{1,3})$/;
				var amountReg = /^([1-9]\d*\d*|0)$/;
				if(!subReg.test(subValue))
					return false;
				if(!amountReg.test(obj.investAmountMin) || !amountReg.test(obj.investAmountMax))
					return false;
				var min = parseFloat(obj.investAmountMin);
				var max = parseFloat(obj.investAmountMax);
				if(isNaN(min) || isNaN(max)){
					return false;
				}
				if(min < 0 || max < 0){
					return false;
				}
				if(min > max){
					return false;
				}
				return true;
			}
			return obj
		},
		removeSubvention: function(sub){
			var index = this.investObj.subventions.indexOf(sub);
			this.investObj.subventions.splice(index, 1);
		},
		removeLastSubvention: function(){
			var sub = this.getLastSub();
			if(sub != null)
				this.removeSubvention(sub);
		},
		isLastSub: function(sub){
			var len = this.investObj.subventions.length;
			var index = this.investObj.subventions.indexOf(sub);
			return (index + 1 == len);
		},
		getLastSub: function(){
			var len = this.investObj.subventions.length;
			if(len > 0){
				return this.investObj.subventions[len-1];
			}else{
				return null
			}
		},
		addSubvention: function(){
			var sub = this.setSubvention();
			var lastSub = this.getLastSub();
			if(lastSub != null){
				sub.investAmountMin = parseFloat(lastSub.investAmountMax) + 1;
				if(lastSub.investAmountMax < 2147483647){
					sub.investAmountMax = 2147483647;
					this.investObj.subventions.push(sub);
				}
			}else{
				sub.investAmountMin = 0;
				sub.investAmountMax = 2147483647;
				this.investObj.subventions.push(sub);
			}
		},
		checkSubventionSeries: function(){//检查subventions的连续性
			var list = this.investObj.subventions;
			var len = list.length;
			for(var i=0; i<len-1;i++){
				var itemFont = list[i];
				var itemNext = list[i+1];
				if(parseFloat(itemFont.investAmountMax) + 1 != parseFloat(itemNext.investAmountMin))
					return false
			}
			return true
		},
		randerResponseData: function(responseData){
			this.investObj.beginAt = responseData.baseInfo.beginAt.replace('T', ' ');
			this.investObj.description = responseData.baseInfo.description;
			this.investObj.endAt = responseData.baseInfo.endAt.replace('T', ' ');
			this.investObj.prodCodeId = responseData.baseInfo.prodCodeId;
			this.investObj.prodName = responseData.baseInfo.prodName;
			this.investObj.ruleName = responseData.baseInfo.ruleName;
			this.investObj.shortDescription = responseData.baseInfo.shortDescription;
			this.investObj.subventionType = responseData.baseInfo.subventionType;
			this.investObj.pointInvestRuleId = responseData.baseInfo.pointInvestRuleId;
			this.investObj.enableFlag = responseData.baseInfo.enableFlag;

			var subventions = [];
			for(var i=0;i<responseData.subventions.length;i++){
				var subObj = this.setSubvention(responseData.subventions[i]);
				subventions.push(subObj);
			}
			this.investObj.subventions = subventions
		},
		randerRequestData: function(){
			var baseInfo = {};
			baseInfo.beginAt = this.investObj.beginAt.replace(' ', 'T');
			baseInfo.endAt = this.investObj.endAt.replace(' ', 'T');
			baseInfo.description = this.investObj.description;
			baseInfo.prodCodeId = this.investObj.prodCodeId;
			baseInfo.prodName = this.investObj.prodName;
			baseInfo.ruleName = this.investObj.ruleName;
			baseInfo.subventionType = this.investObj.subventionType;
			if(this.investObj.pointInvestRuleId)
				baseInfo.pointInvestRuleId = this.investObj.pointInvestRuleId;
			
			var subventions = [];
			var list = this.investObj.subventions;
			for(var i=0;i<list.length;i++){
				var subvention={};
				var obj = list[i];
				subvention.subventionValue = parseFloat(obj.subventionValue);
				subvention.investAmountMax = parseFloat(obj.investAmountMax);
				subvention.investAmountMin = parseFloat(obj.investAmountMin);
				subvention.cashExchRate = obj.cashExchRate;
				if(obj.subventionId)
					subvention.subventionId = obj.subventionId;
				if(obj.hasOwnProperty('subventionAmountMax'))
					subvention.subventionAmountMax = obj.subventionAmountMax;//最高抵扣金额
				if(obj.hasOwnProperty('subventionAmountMin'))
					subvention.subventionAmountMin = obj.subventionAmountMin;
				if(obj.hasOwnProperty('vcashExchRate'))
					subvention.vcashExchRate = obj.vcashExchRate;//与其他虚拟货币的兑换比例

				subventions.push(subvention)
			}
			

			return {baseInfo: baseInfo, subventions:subventions}
		},
	}, {});

	MIS.InvestManager = MIS.derive(null, {
		create: function(scope, promise){
			// body...
			this.scope = scope;
			this.promise = promise;
		},
		getInvest: function(prodCodeId, success, falied){
			var that = this;
			var apiName = 'invest';
			var urlStr = '{0}/{1}?prodCodeId=' + prodCodeId;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				success(response.data['data']);
			}, function(){
				console.log('get invest failed')
			});
		},
		createInvest: function(data, success, failed){
			var that = this;
			var apiName = 'invest';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'post',
				data: data
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				success(response.data['data']);
			}, function(){
				console.log('get invest failed')
			});
		},
		updateInvest: function(data, success, failed){
			var that = this;
			var apiName = 'invest';
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
				success(response.data['data']);
			}, function(){
				console.log('get invest failed')
			});
		}
	}, {})
})()