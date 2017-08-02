(function(){
	const INTEGER_MAX_VALUE = 2147483647;
	'use strict'
	// MIS 积分活动
	// 每个活动都是独立不同的 活动包括查询活动列表 创建活动 关闭激活活动
	// 活动不能修改删除 只能关闭活动 重新添加新的活动

	MIS.ActivitySignup = MIS.derive(null, {
		create: function(){
			this.activityObj = this.init();
		},
		init: function(){
			var obj = {};
			obj.activityTitle = {
				value:'注册送积分',
				reg:''
			};
			obj.beginAt = {
				value:'',
				reg:'',
				checked: ''
			};
			obj.description = {
				value:'',
				reg:''
			};
			obj.endAt = {
				value:'',
				reg:'',
				checked: ''
			};
			obj.point = {
				value:'',
				reg:/^[1-9]\d{0,8}$/,
				checked: ''
			}
			return obj
		},
		randerResponseObject: function(responseObj){
			this.activityObj.activityId = responseObj.activityId;
			this.activityObj.activityTitle.value = responseObj.activityTitle;
			this.activityObj.beginAt.value = responseObj.beginAt.replace('T', ' ');
			this.activityObj.description.value = responseObj.description;
			this.activityObj.enableFlag = responseObj.enableFlag;
			this.activityObj.enableFlagStr = responseObj.enableFlag? '激活' : '非激活';
			this.activityObj.endAt.value = responseObj.endAt.replace('T', ' ');
			this.activityObj.modifiedAt = responseObj.modifiedAt;
			this.activityObj.point.value = responseObj.point;
		},
		randerRequestObject: function(){
			var requestObj = {};
			requestObj.activityTitle = this.activityObj.activityTitle.value;
			requestObj.beginAt = this.activityObj.beginAt.value.replace(' ', 'T');
			requestObj.description = this.activityObj.description.value;
			requestObj.endAt = this.activityObj.endAt.value.replace(' ', 'T');
			requestObj.point = parseInt(this.activityObj.point.value);
			return requestObj;
		},
		createValidation: function(){
			// ignore title
			// ignore description
			var result = true;
			var v_beginAt = MIS.Util.validationDateTime(this.activityObj.beginAt.value);
			if(v_beginAt){
				this.activityObj.beginAt.checked = true
			}else{
				this.activityObj.beginAt.checked = false;
				result = false;
			}
			var v_endAt = MIS.Util.validationDateTime(this.activityObj.endAt.value);
			if(v_endAt){
				this.activityObj.endAt.checked = true
			}else{
				this.activityObj.endAt.checked = false
				result = false;
			}
			var v_point = this.activityObj.point.reg.test(this.activityObj.point.value);
			if(v_point){
				this.activityObj.point.checked = true
			}else{
				this.activityObj.point.checked = false
				result = false;
			}
			return result
		}
	}, {})

	MIS.ActivitySignupManager = MIS.derive(null, {
		create: function (scope, promise) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.initGridOptions();
		},
		initGridOptions:function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs = [
				{name: 'activityObj.activityId', displayName:'活动ID',  minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.point.value', displayName:'获得点币(个)',  minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.beginAt.value', displayName:'起始时间', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.endAt.value', displayName:'结束时间', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.enableFlagStr', displayName:'状态', minWidth: 80, enableHiding:false, enableColumnMenu:false}
			];
			this.gridOptions.columnDefs = columnDefs;
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		refresh: function(){
			this.getPage(this.page, this.pageSize);
		},
		getPage: function(page, pageSize){
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'activity_signup';
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
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerObjList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get activity signup list failed');
			});
		},
		randerObjList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.ActivitySignup();
				obj.randerResponseObject(item);
				list.push(obj)
			}
			return list;
		},
		createActivity: function(data, success, failed){
			var that = this;
			var apiName = 'activity_signup';
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'post',
				data: data
			}).then(function(response){
				var error = response.data['error'];
				if( error != 0){
					var errorMsg = MIS.Config.errorMessage(error);
					var errorStr = response.data['message'];
					MIS.failedFn(errorMsg + '-' + errorStr);
					return
				}else{
					success()
				}
			}, function(){

			})
		},
		activeActivity: function(activityId, flag, success, failed){
			var that = this;
			var apiName = 'activity_signup';
			var urlStr = '{0}/{1}/' + activityId + '?enableFlag=' + flag;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				success(response.data['data']);
			}, function(){
				console.log('change enableFlag failed')
			});
		}
	}, {})

	//邀请有礼活动
	//
	MIS.ActivityInvite = MIS.derive(null, {
		create: function(){
			this.activityObj = this.init();
		},
		init: function(){
			var obj = {};
			obj.activityTitle = {
				value:'邀请送积分',
				reg:''
			};
			obj.beginAt = {
				value:'',
				reg:'',
				checked: ''
			};
			obj.description = {
				value:'',
				reg:''
			};
			obj.endAt = {
				value:'',
				reg:'',
				checked: ''
			};
			obj.pointInvitee = {
				value:'',
				reg:/^[1-9]\d{0,8}$/,
				checked: ''
			};//被邀请人获得的积分数量
			obj.pointInviter = {
				value:'',
				reg:/^[1-9]\d{0,8}$/,
				checked: ''
			};//邀请人获得的积分数量
			obj.rebateRateInviter = {
				value:'',
				reg:/^([1-9]\d{0,2}|0|([1-9]\d{0,2}.\d{1,3})|0.\d{1,3})$/, //***.***
				checked: ''
			}
			return obj
		},
		randerResponseObject: function(responseObj){
			this.activityObj.activityId = responseObj.activityId;
			this.activityObj.activityTitle.value = responseObj.activityTitle;
			this.activityObj.beginAt.value = responseObj.beginAt.replace('T', ' ');
			this.activityObj.description.value = responseObj.description;
			this.activityObj.enableFlag = responseObj.enableFlag;
			this.activityObj.enableFlagStr = responseObj.enableFlag? '激活' : '非激活';
			this.activityObj.endAt.value = responseObj.endAt.replace('T', ' ');
			this.activityObj.modifiedAt = responseObj.modifiedAt;
			this.activityObj.pointInvitee.value = responseObj.pointInvitee;
			this.activityObj.pointInviter.value = responseObj.pointInviter;
			this.activityObj.rebateRateInviter.value = responseObj.rebateRateInviter;
		},
		randerRequestObject: function(){
			var requestObj = {};
			requestObj.activityTitle = this.activityObj.activityTitle.value;
			requestObj.beginAt = this.activityObj.beginAt.value.replace(' ', 'T');
			requestObj.description = this.activityObj.description.value;
			requestObj.endAt = this.activityObj.endAt.value.replace(' ', 'T');
			requestObj.pointInviter = parseInt(this.activityObj.pointInviter.value);
			requestObj.rebateRateInviter = parseFloat(this.activityObj.rebateRateInviter.value)
			return requestObj;
		},
		createValidation: function(){
			// ignore title
			// ignore description
			var result = true;
			var v_beginAt = MIS.Util.validationDateTime(this.activityObj.beginAt.value);
			if(v_beginAt){
				this.activityObj.beginAt.checked = true
			}else{
				this.activityObj.beginAt.checked = false;
				result = false;
			}
			var v_endAt = MIS.Util.validationDateTime(this.activityObj.endAt.value);
			if(v_endAt){
				this.activityObj.endAt.checked = true
			}else{
				this.activityObj.endAt.checked = false
				result = false;
			}
			var v_point = this.activityObj.pointInviter.reg.test(this.activityObj.pointInviter.value);
			if(v_point){
				this.activityObj.pointInviter.checked = true
			}else{
				this.activityObj.pointInviter.checked = false
				result = false;
			}
			var v_rate = this.activityObj.rebateRateInviter.reg.test(this.activityObj.rebateRateInviter.value)
			if(v_rate){
				this.activityObj.rebateRateInviter.checked = true
			}else{
				this.activityObj.rebateRateInviter.checked = false
				result = false;
			}
			return result
		}
	}, {})

	MIS.ActivityInviteManager = MIS.derive(null, {
		create: function (scope, promise) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.initGridOptions();
		},
		initGridOptions:function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs = [
				{name: 'activityObj.activityId', displayName:'活动ID',  minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.pointInviter.value', displayName:'获得点币(个)',  minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.rebateRateInviter.value', displayName:'获得利益(%)',  minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.beginAt.value', displayName:'起始时间', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.endAt.value', displayName:'结束时间', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'activityObj.enableFlagStr', displayName:'状态', minWidth: 80, enableHiding:false, enableColumnMenu:false}
			];
			this.gridOptions.columnDefs = columnDefs;
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		refresh: function(){
			this.getPage(this.page, this.pageSize);
		},
		getPage: function(page, pageSize){
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'activity_invite';
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
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerObjList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get activity signup list failed');
			});
		},
		randerObjList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.ActivityInvite();
				obj.randerResponseObject(item);
				list.push(obj)
			}
			return list;
		},
		createActivity: function(data, success, failed){
			var that = this;
			var apiName = 'activity_invite';
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'post',
				data: data
			}).then(function(response){
				var error = response.data['error'];
				if( error != 0){
					var errorMsg = MIS.Config.errorMessage(error);
					var errorStr = response.data['message'];
					MIS.failedFn(errorMsg + '-' + errorStr);
					return
				}else{
					success()
				}
			}, function(){

			})
		},
		activeActivity: function(activityId, flag, success, failed){
			var that = this;
			var apiName = 'activity_invite';
			var urlStr = '{0}/{1}/' + activityId + '?enableFlag=' + flag;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				success(response.data['data']);
			}, function(){
				console.log('change enableFlag failed')
			});
		}
	}, {});

	//抽奖活动
	MIS.ActivityLottery = MIS.derive(null, {
		create: function(){
			this.self = this.init();
		},
		init: function(){
			var obj = {};
			obj.activityTitle = ''; // 活动标题，不超过256个字符
			obj.beginAt = ''; // 活动开始时间
			obj.description = ''; // 活动描述，不超过1024个字符
			// obj.enableFlag = false; // 激活标识，false-未激活；true-已激活
			obj.endAt = ''; // 活动结束时间
			obj.investAmountMin = 0; // 可参与活动的最低投资金额
			obj.investAmountMinAcc = 0; //可参与活动的累计最低投资金额
			obj.investAmountMinHit = 1; //满足参与活动的最低投资金额的次数
			obj.lotteryPonds = []; // 奖池列表
			obj.probability = ''; // 活动中奖率，字段值为百分数的字面值，精度8位小数。即若中奖率50%，则为该值为50
			obj.qualifierType = ''; // 参与资格类型，与奖池、奖品的参与资格标识相同
			obj.activityType = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item: {value:0},
				list: MIS.dictData.activityType
			}; // 抽奖类型 Required
			return obj;
		},
		addNewLotteryPonds: function(){
			var obj = {};
			obj.investAmountMin = '';//最低投资金额
			obj.level = '';// 奖池等级，默认从1开始按照顺序递增
			obj.lotteryPrizes = [];// 	奖品列表
			obj.pondTitle = '';// 奖池标题，不超过32个字符
			obj.probability = '';
			obj.qualifierType = '';//参与资格类型
			return obj;
		},
		clonePondObj: function(pond){
			var obj = {};
			obj.pondTitle = pond.pondTitle;
			obj.investAmountMin = pond.investAmountMin;
			return obj;
		},
		updateEditPond: function(pond, cloneObj){
			//validate?
			pond.pondTitle = cloneObj.pondTitle;
			pond.investAmountMin = cloneObj.investAmountMin;
		},
		addNewLotteryPrize: function(){
			var obj = {};
			obj.investAmountMin = 0; //default 0
			obj.investAmountMinAcc = 0; //default 0
			obj.investAmountMinHit = 1; //default 1
			obj.prizeInternalId = '';//奖品的内部ID,仅适用于Coupon奖品
			obj.prizeName = ''; //奖品名称 Required
			obj.prizeType = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{name: '实物奖品', value:'1'},
				list: MIS.dictData.prizeType,
			}; //奖品类型 Required
			
			obj.prizeValue = ''; //奖品价值
			obj.probability = ''; //奖品的中奖率,字段值为百分数的字面值，精度8位小数
			obj.qualifierType = 0; //参与资格类型,与奖池和活动的参与资格标识相同
			obj.shareAvailable = INTEGER_MAX_VALUE; // 可用奖品总数 默认为Integer.MAX_VALUE,即2147483647 且不能大于这个数
			obj.shareTotal = '';//INTEGER_MAX_VALUE; // 奖品总数 默认为Integer.MAX_VALUE，即2147483647
			obj.shareUser = 1; // 单次中奖的奖品数量 默认为1
			return obj;
		},
		clonePrizeObj: function(prize){
			var obj = {};
			obj.prizeType = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{value:prize.prizeType.value()},
				list: MIS.dictData.prizeType,
			};
			
			obj.prizeInternalId = prize.prizeInternalId;
			obj.prizeName = prize.prizeName;
			obj.prizeValue = prize.prizeValue;
			obj.probability = prize.probability;
			obj.shareTotal = prize.shareTotal;
			return obj
		},
		updateEditPrize: function(prize, cloneObj){
			prize.prizeType.item.value = cloneObj.prizeType.value();
			prize.prizeInternalId = cloneObj.prizeInternalId;
			prize.prizeName = cloneObj.prizeName;
			prize.prizeValue = cloneObj.prizeValue;
			prize.shareTotal = cloneObj.shareTotal;
			prize.probability = cloneObj.probability;
		},
		randerResponseObject: function(responseObj){
			this.self.activityId = responseObj.activityId;
			this.self.activityTitle = responseObj.activityTitle;
			this.self.beginAt = responseObj.beginAt.replace('T', ' ');
			this.self.createdAt = responseObj.createdAt.replace('T', ' ');
			this.self.description = responseObj.description;
			this.self.enableFlag = responseObj.enableFlag;
			this.self.enableFlagStr = responseObj.enableFlag? '激活' : '非激活';
			this.self.endAt = responseObj.endAt.replace('T', ' ');
			this.self.investAmountMin = responseObj.investAmountMin;
			this.self.investAmountMinAcc = responseObj.investAmountMinAcc;
			this.self.investAmountMinHit = responseObj.investAmountMinHit;
			// There's no lotteryPonds when request activity lottery list
			if(responseObj.lotteryPonds){
				this.self.lotteryPonds = this.randerLotteryPonds(responseObj.lotteryPonds);
			}
			this.self.modifiedAt = responseObj.modifiedAt.replace('T', ' ');
			this.self.probability = responseObj.probability;
			this.self.qualifierType = responseObj.qualifierType;
			this.self.activityType.item.value = responseObj.activityType;
		},
		randerLotteryPonds: function(lotteryPonds){
			var list = [];
			var len = lotteryPonds.length;
			for(var i=0;i<len;i++){
				var pond = lotteryPonds[i];
				var obj = {};
				obj.activityId = pond.activityId;
				obj.createdAt = pond.createdAt;
				obj.investAmountMin = pond.investAmountMin;//最低投资金额
				obj.investAmountMinAcc = pond.investAmountMinAcc;
				obj.investAmountMinHit = pond.investAmountMinHit;
				obj.level = pond.level;// 奖池等级，默认从1开始按照顺序递增
				obj.lotteryPrizes = this.randerLotteryPrizes(pond.lotteryPrizes);// 	奖品列表
				obj.pondId = pond.pondId;
				obj.pondTitle = pond.pondTitle;// 奖池标题，不超过32个字符
				obj.probability = pond.probability;
				obj.qualifierType = pond.qualifierType;//参与资格类型
				list.push(obj);
			}
			return list;
		},		
		randerLotteryPrizes: function(lotteryPrizes){
			var list = [];
			var len = lotteryPrizes.length;
			for(var i=0;i<len;i++){
				var prize = lotteryPrizes[i];
				var obj = {};
				obj.createdAt = prize.createdAt;
				obj.investAmountMin = prize.investAmountMin; //default 0
				obj.investAmountMinAcc = prize.investAmountMinAcc; //default 0
				obj.investAmountMinHit = prize.investAmountMinHit; //default 1
				obj.modifiedAt = prize.modifiedAt;
				obj.pondId = prize.pondId;
				obj.prizeId = prize.prizeId;
				obj.prizeInternalId = prize.prizeInternalId;//奖品的内部ID,仅适用于Coupon奖品
				obj.prizeName = prize.prizeName; //奖品名称 Required
				obj.prizeType = {
					value: function(){
	                    if(this.item.hasOwnProperty('value')){
	                        return this.item.value;
	                    }
	                    else{
	                        return '';
	                    }
	                },
	                item:{value: prize.prizeType},
					list: MIS.dictData.prizeType,
				};
				obj.prizeValue = prize.prizeValue; //奖品价值
				obj.probability = prize.probability; //奖品的中奖率,字段值为百分数的字面值，精度8位小数
				obj.qualifierType = prize.qualifierType; //参与资格类型,与奖池和活动的参与资格标识相同
				obj.shareAvailable = prize.shareAvailable; // 可用奖品总数 默认为Integer.MAX_VALUE,即2147483647 且不能大于这个数
				obj.shareTotal = prize.shareTotal; // 奖品总数 默认为Integer.MAX_VALUE，即2147483647
				obj.shareUser = prize.shareUser; // 单次中奖的奖品数量 默认为1
				list.push(obj);
			}
			return list;
		},
		insertPond: function(pond, index){
			var _index = index+1;
			MIS.Util.listInsert(this.self.lotteryPonds, pond, _index);
		},
		insertPrize:　function(pond, prize){
			pond.lotteryPrizes.push(prize);
		},
		removeLotteryPond: function(pond){//删除pond
			var index = this.self.lotteryPonds.indexOf(pond);
			this.self.lotteryPonds.splice(index, 1);
		},
		removeLastLotteryPond: function(){
			var len = this.self.lotteryPonds.length;
			if(len > 0){
				var index = len - 1;
				this.self.lotteryPonds.splice(index, 1);
			}
		},
		removeLotteryPrize: function(pond, prize){//删除pond中的prize
			var index = pond.lotteryPrizes.indexOf(prize);
			if(index != -1){
				pond.lotteryPrizes.splice(index, 1);
			}
		},
		getPondIndex:function(pond){
			var index = -1;
			var _index = this.self.lotteryPonds.indexOf(pond);
			if(_index >= 0){// 若查到位置 则以该位置为基准
				index = _index;
			}else{//若查不到位置 则以列表最后一个为基准
				var len = this.self.lotteryPonds.length;
				index = len - 1;
			}
			return index;
		},
		randerRequestObject: function(){
			var requestObj = {};
			var obj = this.self;
			if(obj.activityId){
				requestObj.activityId = obj.activityId;
			}
			requestObj.activityTitle = obj.activityTitle;
			requestObj.beginAt = obj.beginAt.replace(' ','T');
			requestObj.description = obj.description;
			if(obj.hasOwnProperty('enableFlag'))
				requestObj.enableFlag = obj.enableFlag;
			requestObj.endAt = obj.endAt.replace(' ','T');
			requestObj.investAmountMin = obj.investAmountMin;
			requestObj.investAmountMinAcc = obj.investAmountMinAcc;
			requestObj.investAmountMinHit = obj.investAmountMinHit;
			requestObj.lotteryPonds = [];
			requestObj.activityType = obj.activityType.value();
			for(var i=0; i<obj.lotteryPonds.length; i++){
				var pond = {};
				var item = obj.lotteryPonds[i];
				if(item.hasOwnProperty('activityId'))
					pond.activityId = item.activityId;
				pond.investAmountMin = item.investAmountMin;
				pond.level = item.level;
				pond.lotteryPrizes = [];
				for(var j=0; j<item.lotteryPrizes.length;j++){
					var prize = {};
					var itemPrize = item.lotteryPrizes[j];
					prize.investAmountMin = itemPrize.investAmountMin;
					prize.investAmountMinAcc = itemPrize.investAmountMinAcc;
					prize.investAmountMinHit = itemPrize.investAmountMinHit;
					if(itemPrize.hasOwnProperty('prizeId'))
						prize.prizeId = itemPrize.prizeId;
					if(itemPrize.hasOwnProperty('prizeInternalId'))
						prize.prizeInternalId = itemPrize.prizeInternalId;
					if(itemPrize.hasOwnProperty('prizeValue'))
						prize.prizeValue = itemPrize.prizeValue;
					prize.prizeName = itemPrize.prizeName;
					prize.prizeType = itemPrize.prizeType.value();
					
					if(itemPrize.hasOwnProperty('probability') &&  itemPrize.probability!='')
						prize.probability = parseFloat(itemPrize.probability);
					prize.qualifierType = itemPrize.qualifierType;
					prize.shareAvailable = itemPrize.shareAvailable;
					if(itemPrize.hasOwnProperty('shareTotal') && itemPrize.shareTotal != '')
						prize.shareTotal = parseFloat(itemPrize.shareTotal);
					prize.shareUser = itemPrize.shareUser;
					pond.lotteryPrizes.push(prize);
				}
				pond.pondTitle = item.pondTitle;
				// pond.probability = item.probability;
				pond.qualifierType = item.qualifierType;
				if(item.hasOwnProperty('investAmountMinAcc'))
					pond.investAmountMinAcc = item.investAmountMinAcc;
				if(item.hasOwnProperty('investAmountMinHit'))
					pond.investAmountMinHit = item.investAmountMinHit;
				if(item.hasOwnProperty('pondId'))
					pond.pondId = item.pondId;
				requestObj.lotteryPonds.push(pond);
			}
			return requestObj;
		},
		validateField: function(){
			var result={
				flag: true,
				msg: ''
			};
			if(!this.checkTitle(this.self.activityTitle)){
				result.flag = false;
				result.msg = "请输入正确的活动标题(不超过256个字符)";
				return result;
			}
			if(!this.checkTime(this.self.beginAt)){
				result.flag = false;
				result.msg = "请选择正确的生效日期";
				return result;
			}
			if(!this.checkTime(this.self.endAt)){
				result.flag = false;
				result.msg = "请选择正确的结束日期";
				return result;
			}
			if(!this.checkActivityType(this.self.activityType.value()) == ''){
				result.flag = false;
				result.msg = "请选择正确的活动类型"
			}

			return result;
		},
		checkTitle: function(title){
			//validate activityTitle 活动标题，不超过256个字符
			var reg = /^(\w|[\u4e00-\u9fa5]){1,256}$/;
			if(reg.test(title)){
				return true;
			}
			return false;
		},
		checkTime: function(time){
			return MIS.Util.validationDateTime(time);
		},
		checkActivityType: function(type){
			return !isNaN(parseInt(type));
		},
		checkPond: function(pond){
			var result = {
				flag: false,
				msg: ''
			}
			//奖池标题 32个字符
			var reg_1 = /^(\w|[\u4e00-\u9fa5]){1,32}$/;
			if(!reg_1.test(pond.pondTitle)){
				result.msg = "请输入正确的奖池名称";
				return result
			}
			var reg_2 = /^(\d{1,16}|\d{1,16}\.\d{1,3})$/;
			if(!reg_2.test(pond.investAmountMin)){
				result.msg = "请输入正确的奖池金额";
				return result
			}

			result.flag = true;
			return result
		},
		checkPrize: function(prize){
			var activityType = this.self.activityType.value().toString();

			var result = {
				flag: true,
				msg: ''
			}
			// if activityType == '2'
			if(activityType == '2'){
				//
				if(prize.prizeType.value().toString() != '4'){
					result.flag = false;
					result.msg = '指数抽奖只能设置"幸运号"';
					return result;
				}
			}
			//  {name: '实物奖品', value:'1'},
			// 	{name: '积分', value:'2'},
			// 	{name: '体验金', value:'3'},
			var reg_1 = /^(\w|[\u4e00-\u9fa5]){1,32}$/;
			var reg_2 = /^\d{1,16}$/;
			var reg_3 = /^\w{1,32}/;
			var reg_4 = /^([1-9]|([1-9][0-9])|[1-9]\.\d{1,8}|([1-9][0-9]\.\d{1,8})|0\.\d{1,8}|100)$/;

			if(!reg_1.test(prize.prizeName)){
				result.flag = false;
				result.msg = "请输入正确的奖品名称";
				return result;
			}
			if(prize.prizeType.value().toString() == '2'){
				if(!reg_2.test(prize.prizeValue)){
					result.flag = false;
					result.msg = "请输入正确的奖品积分";
					return result;
				}
			}
			if(prize.prizeType.value().toString() == '3'){
				if(!reg_3.test(prize.prizeInternalId)){
					result.flag = false;
					result.msg = "请选择正确的优惠券";
					return result;
				}
			}
			if(!reg_4.test(prize.probability)){
				result.flag = false;
				result.msg = "请输入正确的概率,最多保留8位小数";
				return result;
			}
			return result;
		},
		saveCheck: function(){
			// check each prize
			var obj = this.self;
			for(var i=0; i<obj.lotteryPonds.length; i++){
				var pond = obj.lotteryPonds[i];
				for(var j=0; j<pond.lotteryPrizes.length;j++){
					var prize = pond.lotteryPrizes[j];
					var result = this.checkPrize(prize);
					if(!result.flag){
						return {flag: result.flag,msg: result.msg}
					}
				}
			}
			return {flag: true, msg: ''}
		}


	}, {});

	MIS.ActivityLotteryManager = MIS.derive(null, {
		create: function(scope, promise){
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.initGridOptions();
		},
		getLottery: function(activityId, success, failed){
			var that = this;
			var apiName = 'activity_lottery';
			var apiParam = [activityId]
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				apiParam: apiParam
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
		initGridOptions: function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs = [
				{name: 'self.activityId', displayName:'活动ID', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.activityTitle', displayName:'抽奖活动名称', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.beginAt', displayName:'起始时间',  minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.endAt', displayName:'终止时间', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.enableFlagStr', displayName:'激活状态', minWidth: 100, enableHiding:false, enableColumnMenu:false}
			];
			this.gridOptions.columnDefs = columnDefs;
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		refresh: function(){
			this.getPage(this.page, this.pageSize);
		},
		getPage: function(page, pageSize){
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'activity_lottery';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr,
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerObjList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get activity signup list failed');
			});
		},
		randerObjList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.ActivityLottery();
				obj.randerResponseObject(item);
				list.push(obj)
			}
			return list;
		},
		saveNewLottery: function(activity, success, failed){
			var that = this;
			var apiName = 'activity_lottery';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'post',
				data: activity
			}).then(function(){
				success();
			},function(){
				debugger;
			})
		},
		getLotteryDetail: function(activityId, success, failed){
			var that = this;
			var apiName = 'activity_lottery_detail';
			var apiParam = [activityId];
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'get',
				apiParam: apiParam
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var data = response.data['data'];
				var lottery = new MIS.ActivityLottery()
				lottery.randerResponseObject(data);
				success(lottery)
			},function(){

			})
		},
		updateLottery: function(activity, success, failed){
			var that = this;
			var apiName = 'activity_lottery';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				data: activity
			}).then(function(){
				success();
			},function(){
				debugger;
			})
		},
		activeActivity: function(activityId, flag, success, failed){
			var that = this;
			var apiName = 'activity_lottery';
			var urlStr = '{0}/{1}/' + activityId + '/status?enableFlag=' + flag;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				success(response.data['data']);
			}, function(){
				console.log('change enableFlag failed')
			});
		}
	}, {});

	
	//活动
	MIS.Activity = MIS.derive(null, {
		create: function(){
			this.activityObj = {}
		},
		init: function(){
			var obj = {};
			obj.accounts = {
				value: [],
				reg: '',
				msg: '请正确选择可参与活动的用户组',
				required: false
			};
			obj.actions = {
				value: [],
				reg: '',
				msg: '请选择活动形式',
				required: false
			};
			obj.admittances = {
				value: '',
				reg: '',
				msg: '',
				required: false
			};//活动准入条件
			obj.agencies = {
				value: [],
				reg: '',
				msg: '请正确选择可参与活动的渠道列表',
				required: false
			};
			// obj.awards = {
			// 	value: '',
			// 	reg: '',
			// 	msg: '请输入正确的奖励信息',
			// 	required: false
			// };
			obj.beginAt = {
				value: '',
				reg: '',
				msg: '请设置正确的活动开始时间',
				required: false
			};
			obj.clients = {
				value: [],
				reg: /^.+$/,
				list: that.randerCheckList(MIS.dictData.clientList),
				msg: '请设置正确的客户端列表',
				required: false
			};
			// obj.createdAt = {
			// 	value: '',
			// };//活动创建时间
			obj.description = {
				value: '',
				reg: '',
				msg: '活动描述，不超过1024个字符',
				required: false
			};
			obj.endAt = {
				value: '',
				reg: '',
				msg: '请设置正确的活动结束时间',
				required: false
			};
			// obj.id = {
			// 	value: ''
			// }
			obj.status = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item: {name: '未激活', value: 0},
				list: MIS.dictData.activeStatus
			};
			obj.title = {
				value: '',
				reg: '',
				msg: '请输入正确的活动标题',
				required: true
			};
			this.activityObj = obj;
		},
		initAwards: function(){

		},
		
		randerCheckList: function(dictList){
			var len = dictList.length;
            var list = [];
            if(len <= 0) return list;
            for(var i=0;i<len;i++){
                var obj = dictList[i];
                obj.checked = false;
                list.push(obj);
            }
            return list;
		}
	},{});
	
})()