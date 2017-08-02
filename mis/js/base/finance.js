(function(){
	'use strict'
	MIS.TradeType = {
		Deposit: '1',//充值
		Withdraw: '2',//提现
	}
	MIS.Finance = MIS.derive(null, {
		create: function(type){
			this.financeObj={};
			this.init();
		},
		init: function(){
			var obj = {};
			obj.tradeSerialNo = {
				value: '',
			};
			obj.createdAt = {
				value: '',
			};
			obj.amount={
				value: '',
			};
			obj.transType={
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list:MIS.dictData.financeTransType,
			};
			obj.tradeType={
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list:MIS.dictData.financeTradeType,
			};
			obj.tradeStatus={
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list:MIS.dictData.financeTradeStatus,
			};
			obj.tradeSubject={
				value:''
			};
			obj.assetType={
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list:MIS.dictData.financeAssetType,
			};
			obj.userName={
				value: ''
			};
			obj.transSerialNo={
				value:''
			};
			obj.bankName={
				value:''
			};
			obj.cardNo={
				value:''
			};
			obj.name={
				value:''
			};
			this.financeObj = obj;
		},
		randerServerObj: function(responseObj){
			this.financeObj.tradeSerialNo.value = responseObj.tradeSerialNo;
			this.financeObj.createdAt.value = responseObj.createdAt.replace('T', ' ');
			this.financeObj.amount.value = responseObj.amount;
			this.financeObj.transType.item.value = responseObj.transType;
			this.financeObj.tradeType.item.value = responseObj.tradeType;
			this.financeObj.tradeStatus.item.value = responseObj.tradeStatus;
			this.financeObj.tradeSubject.value = responseObj.tradeSubject;
			this.financeObj.assetType.item.value = responseObj.assetType;
			this.financeObj.name.value = responseObj.name;
			this.financeObj.bankName.value = responseObj.bankName;
			this.financeObj.cardNo.value = responseObj.cardNo;
			this.financeObj.transSerialNo.value = responseObj.transSerialNo;
			this.financeObj.userName.value = responseObj.userName;
		}
	}, {});

	MIS.FinanceManager = MIS.derive(null, {
		create: function(scope, promise, type){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchKeyword = '';//default
			this.type = type;
			this.initSearch();
		},
		initSearch: function(){
			this.searchDetailStr = '';
			this.searchDetailObj = {
				name: '',
				userName: '',
				tradeStatus: {
					value: function(){
						if(this.item.hasOwnProperty('value')){
	                        return this.item.value;
	                    }
	                    else{
	                        return '';
	                    }
					},
					item:{},
					list:MIS.dictData.financeTradeStatus,
				},
				bankName:'',
				tradeBeginTime: {
					value: ''
				},
				tradeEndTime: {
					value: ''
				},
			};
		},
		clearSearchDetail: function(){
			this.searchDetailStr = '';
			this.searchDetailObj.name = '';
			this.searchDetailObj.userName = '';
			this.searchDetailObj.tradeStatus.item.value = '';
			this.searchDetailObj.bankName = '';
			this.searchDetailObj.tradeBeginTime.value='';
			this.searchDetailObj.tradeEndTime.value='';
		},
		getSearchDetail: function(){
			this.searchDetailStr = '';
			if(this.searchDetailObj.name != ''){
				this.searchDetailStr += '&name=' + this.searchDetailObj.name;
			}
			if(this.searchDetailObj.userName != ''){
				this.searchDetailStr += '&userName=' + this.searchDetailObj.userName;
			}
			if(this.searchDetailObj.tradeStatus.value().toString() != ''){
				this.searchDetailStr += '&tradeStatus=' + this.searchDetailObj.tradeStatus.value().toString();
			}
			if(this.searchDetailObj.bankName != ''){
				this.searchDetailStr += '&bankName=' + this.searchDetailObj.bankName;
			}
			if(this.searchDetailObj.tradeBeginTime.value != ''){
				this.searchDetailStr += '&from=' + this.searchDetailObj.tradeBeginTime.value;
			}
			if(this.searchDetailObj.tradeEndTime.value != ''){
				this.searchDetailStr += '&to=' + this.searchDetailObj.tradeEndTime.value;
			}
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				totalPages: that.totalPages,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, totalPages, pageSize, pageData){
			this.currentPage = page;
			this.totalPages = totalPages;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		getPage: function(page, pageSize){
			this.getSearchDetail();
			this.page = page;
			this.pageSize = pageSize;
			var type = this.type;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&tradeType={2}', [page, pageSize, type]);
			if(type == MIS.TradeType.Deposit){
				searchStr = MIS.Util.stringFormat('{0}&tradeStatus=2', [searchStr]);
			}
			if(this.searchKeyword!=''){
				searchStr = MIS.Util.stringFormat('{0}&keyword={1}', [searchStr, this.searchKeyword]);
			}
			if(this.searchDetailStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchDetailStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getFinanceList(urlStr);
		},
		getFinanceList: function(urlStr){
			var that = this;
			this.promise({
				serverName: 'accountService',
				apiName:'finance',
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
				var totalPages = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerFinanceList(response.data['data']);
				that.setPage(page, totalPages, pageSize, pageData);
			})
		},
		randerFinanceList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.Finance(this.type);
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		}
	}, {});
	

	MIS.PaymentFee = MIS.derive(null, {
		create: function(){
			this.paymentObj = this.init();
		},
		init: function(){
			var obj = {};
			obj.organId = {
				value: '',
			};
			obj.organName = {
				value: '',
			};
			obj.clientId = {
				value: '',
			};
			obj.requestId = {
				value: '',
			};
			obj.flowId = {
				value: '',
			};
			obj.bankNo = {
				value: '',
			};
			obj.bankName = {
				value: '',
			};
			obj.idNo = {
				value: '',
			};
			obj.cellPhone = {
				value:'',
			};
			obj.amount = {
				value:''
			};
			obj.fee={
				value:''
			};
			obj.remark={
				value: ''
			};
			obj.respCode={
				value:''
			};
			obj.respDesc={
				value:''
			};
			obj.transStatus={
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list:MIS.dictData.financeTransStatus,
			};
			obj.payChannel={
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list:MIS.dictData.financePayChannel,
			};
			obj.name={
				value:''
			};
			obj.cardNo={
				value:''
			};
			obj.transAt={
				value:'',
				displayValue: '',
			};
			obj.transType={
				value:''
			}

			return obj
		},
		randerServerObj: function(responseObj){
			this.paymentObj.organId.value = responseObj.organId;
			this.paymentObj.organName.value = responseObj.organName;
			this.paymentObj.clientId.value = responseObj.clientId;
			this.paymentObj.requestId.value = responseObj.requestId;
			this.paymentObj.flowId.value = responseObj.flowId;
			this.paymentObj.bankNo.value = responseObj.bankNo;
			this.paymentObj.bankName.value = responseObj.bankName;
			this.paymentObj.idNo.value = responseObj.idNo;
			this.paymentObj.cellPhone.value = responseObj.cellphone;
			this.paymentObj.amount.value = responseObj.amount;
			this.paymentObj.fee.value = responseObj.fee;
			this.paymentObj.remark.value = responseObj.remark;
			this.paymentObj.respCode.value = responseObj.respCode;
			this.paymentObj.respDesc.value = responseObj.respDesc;
			this.paymentObj.transStatus.item.value =responseObj.transStatus;
			this.paymentObj.payChannel.item.value = responseObj.payChannel;
			this.paymentObj.name.value = responseObj.name;
			this.paymentObj.cardNo.value = responseObj.cardNo;
			this.paymentObj.transAt.value = responseObj.transAt;
			this.paymentObj.transAt.displayValue = responseObj.transAt.split('T')[0] + ' ' + responseObj.transAt.split('T')[1];
			this.paymentObj.transType.value = responseObj.transType;
		},
	}, {})


	MIS.PaymentManager = MIS.derive(null, {
		create: function(scope, promise){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchKeyword = '';//defa
			this.initSearch();
		},
		initSearch: function(){
			this.searchDetailStr = '';
			this.searchDetailObj = {
				tradeStatus: {// only has 2 status 
					value: function(){
						if(this.item.hasOwnProperty('value')){
	                        return this.item.value;
	                    }
	                    else{
	                        return '';
	                    }
					},
					item:{},
					list: [ 
							{name: '未处理', value: 0},
            				{name: '处理中', value: 1},
							{name: '成功', value: 2},
            				{name: '失败', value: 3}],
				},
				transType: {
					value: function(){
						if(this.item.hasOwnProperty('value')){
	                        return this.item.value;
	                    }
	                    else{
	                        return '';
	                    }
					},
					item:{},
					list:MIS.TransType, 
				},
				tradeBeginTime: {
					value:''
				},
				tradeEndTime: {
					value:''
				},
				tradeAmountMin:{
					value:''
				},
				tradeAmountMax:{
					value:''
				}
			};
		},
		clearSearchDetail: function(){
			this.searchDetailStr = '';
			this.searchDetailObj.tradeStatus.item.value='';
			this.searchDetailObj.transType.item.value='';
			this.searchDetailObj.tradeBeginTime.value='';
			this.searchDetailObj.tradeEndTime.value='';
			this.searchDetailObj.tradeAmountMin.value='';
			this.searchDetailObj.tradeAmountMax.value='';
		},
		getSearchDetail: function(){
			this.searchDetailStr = '';
			if(this.searchDetailObj.tradeStatus.value() != ''){
				this.searchDetailStr += '&transStatus=' + this.searchDetailObj.tradeStatus.value();
			}
			if(this.searchDetailObj.transType.value() != ''){
				this.searchDetailStr += '&transType=' + this.searchDetailObj.transType.value();
			}
			if(this.searchDetailObj.tradeBeginTime.value != ''){
				this.searchDetailStr += '&fromDate=' + this.searchDetailObj.tradeBeginTime.value;
			}
			if(this.searchDetailObj.tradeEndTime.value != ''){
				this.searchDetailStr += '&toDate=' + this.searchDetailObj.tradeEndTime.value;
			}
			if(this.searchDetailObj.tradeAmountMin.value != ''){
				this.searchDetailStr += '&minAmount=' + this.searchDetailObj.tradeAmountMin.value;
			}
			if(this.searchDetailObj.tradeAmountMax.value != ''){
				this.searchDetailStr += '&maxAmount=' + this.searchDetailObj.tradeAmountMax.value;
			}
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				totalPages: that.totalPages,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, totalPages, pageSize, pageData){
			this.currentPage = page;
			this.totalPages = totalPages;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		getPage: function(page, pageSize){
			this.getSearchDetail();
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchKeyword!=''){
				searchStr = MIS.Util.stringFormat('{0}&accountName={1}', [searchStr, this.searchKeyword]);
			}
			if(this.searchDetailStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchDetailStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getPaymentFeeList(urlStr);
		},
		getPaymentFeeList: function(urlStr){
			var that = this;
			this.promise({
				serverName: 'paymentService',
				apiName:'paymentFee',
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
				var totalPages = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerPaymentFeeList(response.data['data']);
				that.setPage(page, totalPages, pageSize, pageData);
			})
		},
		randerPaymentFeeList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.PaymentFee();
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		}
	}, {})

	MIS.FinanceAuditType = {
		payment: 0,//代收
		withdraw: 1//代付
	}

	MIS.FinanceAuditObj = MIS.derive(null, {
		create: function(type){
			this.type = type;
			if(type == MIS.FinanceAuditType.payment){
				this.financeAuditObj = this.initPaymentAuditObj();
				this.randerServerObj = this.randerPaymentAuditObj;
			}else if(type == MIS.FinanceAuditType.withdraw){
				this.financeAuditObj = this.initWithdrawAuditObj();
				this.randerServerObj = this.randerWithdrawAuditObj;
			}
		},
		initPaymentAuditObj: function(){
			var obj = {};
			obj.organId = {
				value: '',
			}
			obj.organName = {
				value: '',
			}
			obj.merchantId = {
				value: '',
			}
			obj.currency = {
				value: '',
			}
			obj.amount = {
				value: '',
			}
			obj.fee = {
				value: '',
			}
			obj.remark = {
				value: '',
			}
			obj.transType = {
				value: '',
			}
			obj.businessType = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
				item:{},
				list: MIS.dictData.financeBusinessType,
			}
			obj.payChannel = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financePayChannel
			}
			obj.transDate = {
				value: '',
			}
			obj.transSumId = {
				value: '',
			}
			obj.reviewStatus = {
				value:function(){
				 	if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financeAuditStatus,
			}
			return obj;
		},
		randerPaymentAuditObj:function(responseObj){
			this.financeAuditObj.organId.value = responseObj.organId
			this.financeAuditObj.organName.value = responseObj.organName
			this.financeAuditObj.merchantId.value = responseObj.merchantId
			this.financeAuditObj.currency.value = responseObj.currency
			this.financeAuditObj.amount.value = responseObj.amount
			this.financeAuditObj.fee.value = responseObj.fee
			this.financeAuditObj.remark.value = responseObj.remark
			this.financeAuditObj.transType.value = responseObj.transType
			this.financeAuditObj.businessType.item.value = responseObj.businessType
			this.financeAuditObj.payChannel.item.value = responseObj.payChannel
			this.financeAuditObj.transDate.value = responseObj.transDate
			this.financeAuditObj.transSumId.value = responseObj.transSumId
			this.financeAuditObj.reviewStatus.item.value = responseObj.reviewStatus
		},
		initWithdrawAuditObj: function(){
			var obj = {};
			obj.organId = {
				value: '',
			}
			obj.organName = {
				value: '',
			}
			obj.merchantId = {
				value: '',
			}
			obj.currency = {
				value: '',
			}
			obj.amount = {
				value: '',
			}
			obj.fee = {
				value: '',
			}
			obj.remark = {
				value: '',
			}
			obj.transType = {
				value: '',
			}
			obj.businessType = {
				value:function(){
				 	if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financeBusinessType,
			}
			obj.payChannel = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financePayChannel
			}
			obj.transDate = {
				value: '',
			}
			obj.reviewStatus = {
				value:function(){
				 	if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financeAuditStatus,
			}
			obj.transSumId = {
				value: '',
			}
			return obj;
		},
		randerWithdrawAuditObj: function(responseObj){
			this.financeAuditObj.organId.value = responseObj.organId
			this.financeAuditObj.organName.value = responseObj.organName
			this.financeAuditObj.merchantId.value = responseObj.merchantId
			this.financeAuditObj.currency.value = responseObj.currency
			this.financeAuditObj.amount.value = responseObj.amount
			this.financeAuditObj.fee.value = responseObj.fee
			this.financeAuditObj.remark.value = responseObj.remark
			this.financeAuditObj.transType.value = responseObj.transType
			this.financeAuditObj.businessType.item.value = responseObj.businessType
			this.financeAuditObj.payChannel.item.value = responseObj.payChannel
			this.financeAuditObj.transDate.value = responseObj.transDate
			this.financeAuditObj.reviewStatus.item.value = responseObj.reviewStatus
			this.financeAuditObj.transSumId.value = responseObj.transSumId
		}
	},{});

	MIS.FinanceAuditManager = MIS.derive(null, {
		create: function(scope, promise, type){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';//default
			this.type = type;
			this.initGridOptions();
			this.initSearch();
			this.initData();
		},
		initData: function(){
			var that = this;

			// this.promise({
			// 	serverName:'paymentService',
			// 	apiName:'financeSum',
			// 	method: 'get',
			// }).then(function(response){
			// 	// 
			// 	var errorCode = response.data['error'] ;
			// 	if(errorCode == 0){
					//refresh data
					that.getPage(that.currentPage, that.pageSize);
			// 	}else{
			// 		var errorMsg = response.data['message'];
			// 		MIS.failedFn(errorMsg);
			// 	}
			// })
		},
		initSearch: function(){
			var defaultStatus = {name: '全部', value:''}
			var statusList = [defaultStatus];
			if(this.type == MIS.FundType.Out){
				var list = MIS.dictData.fundStatusList;
				for(var i=0; i<list.length;i++){
					if(list[i].value > -2){
						statusList.push(list[i]);
					}
				}
			}else if(this.type == MIS.FundType.In){
				var list = MIS.dictData.fundInStatusList;
				for(var i=0; i<list.length;i++){
					if(list[i].value > -2){
						statusList.push(list[i]);
					}
				}
			}
			this.statusList = statusList;
			this.searchStatus = {
				item: { value: '' },
                value: function(){
                        return this.item.value
                }
			}
		},
		initGridOptions: function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var paymentColumnDefs = [
				{name: 'financeAuditObj.transDate.value', displayName:'交易时间',  minWidth: 65,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.organName.value', displayName:'支付机构',  minWidth: 145,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.amount.value', displayName:'金额',  minWidth: 85,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.payChannel.item.value', cellFilter: 'payChannelFilter', displayName:'支付通道',  minWidth: 85,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.businessType.item.value', cellFilter: 'businessTypeFilter', displayName:'类型',  minWidth: 65,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.reviewStatus.item.value', cellFilter: 'reviewStatusFilter', displayName:'审核状态',  minWidth: 65,  enableHiding:false, enableColumnMenu:false},
			];

			var withdrawColumnDefs = [
				{name: 'financeAuditObj.transDate.value', displayName:'交易时间',  minWidth: 65,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.organName.value', displayName:'支付机构',  minWidth: 145,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.amount.value', displayName:'金额',  minWidth: 85,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.businessType.item.value', cellFilter: 'businessTypeFilter', displayName:'类型',  minWidth: 65,  enableHiding:false, enableColumnMenu:false},
				{name: 'financeAuditObj.reviewStatus.item.value', cellFilter: 'reviewStatusFilter', displayName:'审核状态',  minWidth: 65,  enableHiding:false, enableColumnMenu:false},
			];

			this.gridOptions.columnDefs = this.type == MIS.FinanceAuditType.payment? paymentColumnDefs : withdrawColumnDefs;
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
			var transType = this.type

			var status = this.searchStatus.value();
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&transType={2}', [page, pageSize, transType]);
			if(this.searchStr!=''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getSumList(urlStr);
		},
		getSumList: function(urlStr){
			var that = this;
			this.promise({
				serverName: 'paymentService',
				apiName: 'financeSum',
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
				var pageData = that.randerFinanceAuditList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		randerFinanceAuditList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.FinanceAuditObj(this.type);
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		},
		doAudit: function(finance, action){
			var that = this;
			var data = {};
			data.transSumId = finance.financeAuditObj.transSumId.value;
			data.reviewStatus = action;
			return this.promise({
				serverName: 'paymentService',
				apiName:'review',
				method:'post',
				data: data,
				head:{
					'Content-Type': 'application/json'
				},
			}).then(function(response){
				var errorCode = response.data['error'] ;
				if(errorCode == 0){
					//refresh data
					that.refresh();
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					MIS.failedFn(errorMsg);
				}
			});
		},
		withdrawConfirm: function(finance){
			var that = this;
			var data = {};
			var financeObj = finance.financeAuditObj;
			data.transSumId = financeObj.transSumId.value;
			data.organId = financeObj.organId.value;
			data.transType = financeObj.transType.value;
			data.transDate = financeObj.transDate.value;
			return this.promise({
				serverName: 'paymentService',
				apiName:'withdrawConfirm',
				method:'post',
				data: data,
				head:{
					'Content-Type': 'application/json'
				},
			}).then(function(response){
				var errorCode = response.data['error'] ;
				if(errorCode == 0){
					//refresh data
					that.refresh();
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					MIS.failedFn(errorMsg);
				}
			});
		},
		exportExcelOnServer:function(finance){
			var url
			if(finance.financeAuditObj.transType.value == "0"){
				url = MIS.Util.getApiUrl('paymentService', 'payExportExcel');
			}else if(finance.financeAuditObj.transType.value == "1"){
				url = MIS.Util.getApiUrl('paymentService', 'withdrawExportExcel');
			}
			var elemIF = document.createElement('iframe');
			elemIF.src = url + '?access_token=' +  MIS.currentUser.getToken();

			
			if(finance.financeAuditObj.transType.value == "0"){
				elemIF.src+= '&transStatus=2';
				elemIF.src+= '&organId=' + finance.financeAuditObj.organId.value;
				elemIF.src+= '&businessType=' + finance.financeAuditObj.businessType.item.value;
				elemIF.src+= '&fromDate=' + finance.financeAuditObj.transDate.value;
				elemIF.src+= '&toDate=' + finance.financeAuditObj.transDate.value;
				elemIF.src+= '&payChannel=' + finance.financeAuditObj.payChannel.value();
			}
			if(finance.financeAuditObj.transType.value == "1"){
				elemIF.src+= '&tradeStatus=1,2';
				elemIF.src+= '&tradeType=2';
				elemIF.src+= '&from=' + finance.financeAuditObj.transDate.value;
				elemIF.src+= '&to=' + finance.financeAuditObj.transDate.value;
			}
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
		},
		getFundStatus: function(input){
			var fundStatusList = this.type == MIS.FundType.Out? MIS.dictData.fundStatusList : MIS.dictData.fundInStatusList;	
			var result = '';
			fundStatusList.forEach(function(item){
				if(item.value == input){
					result = item.name
				}
			});
			return result;
		}
	}, {});

	MIS.FinanceLog = MIS.derive(null, {
		create: function(type){
			if(type == MIS.FinanceAuditType.payment){
				this.logObj = this.initPaymentLog();
				this.randerServerObj = this.randerPaymentLogObj;
			}else if(type == MIS.FinanceAuditType.withdraw){
				this.logObj = this.initWithdrawLog();
				this.randerServerObj = this.randerWithdrawLogObj;
			}
		},
		initPaymentLog: function(){
			var obj={};
			obj.idNo={
				value:'',
				// displayValue: ''
			};
			obj.flowId = {
				value:''
			};
			obj.name = {
				value: ''
			};
			obj.bankName = {
				value: ''
			};
			obj.cardNo = {
				value: ''
			};
			obj.amount = {
				value: ''
			};
			obj.transType = {
				value: ''
			};
			obj.organName = {
				value: ''
			};
			obj.respDesc = {
				value: ''
			};
			obj.transDate = {
				value: ''
			};
			obj.businessType = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financeBusinessType
			};
			obj.transAt = {
				value: '',
				displayValue: ''
			}

			return obj;
		},
		randerPaymentLogObj: function(responseObj){
			this.logObj.idNo.value = responseObj.idNo;
			this.logObj.flowId.value = responseObj.flowId;
			this.logObj.name.value = responseObj.name;
			this.logObj.bankName.value = responseObj.bankName;
			this.logObj.cardNo.value = responseObj.cardNo;
			this.logObj.amount.value = responseObj.amount;
			this.logObj.transType.value = responseObj.transType;
			this.logObj.organName.value = responseObj.organName;
			this.logObj.respDesc.value = responseObj.respDesc;
			this.logObj.transDate.value = responseObj.transDate;
			this.logObj.businessType.item.value = responseObj.businessType;
			this.logObj.transAt.displayValue = responseObj.transAt.replace(/T/," ");
			
		},
		initWithdrawLog: function(){
			var obj={};
			obj.idNo={
				value:'',
				// displayValue: ''
			};
			obj.flowId = {
				value:''
			};
			obj.name = {
				value: ''
			};
			obj.bankName = {
				value: ''
			};
			obj.cardNo = {
				value: ''
			};
			obj.amount = {
				value: ''
			};
			obj.transType = {
				value: ''
			};
			obj.organName = {
				value: ''
			};
			obj.respDesc = {
				value: ''
			};
			obj.transDate = {
				value: ''
			};
			obj.businessType = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.financeBusinessType
			};
			obj.transAt = {
				value: '',
				displayValue: ''
			}
			return obj;	
		},
		randerWithdrawLogObj: function(responseObj){
			this.logObj.idNo.value = responseObj.idNo;
			this.logObj.flowId.value = responseObj.flowId;
			this.logObj.name.value = responseObj.name;
			this.logObj.bankName.value = responseObj.bankName;
			this.logObj.cardNo.value = responseObj.cardNo;
			this.logObj.amount.value = responseObj.amount;
			this.logObj.transType.value = responseObj.transType;
			this.logObj.organName.value = responseObj.organName;
			this.logObj.respDesc.value = responseObj.respDesc;
			this.logObj.transDate.value = responseObj.transDate;
			this.logObj.businessType.item.value = responseObj.businessType;
			this.logObj.transAt.displayValue = responseObj.transAt.replace(/T/," ");
		}
	}, {});

	MIS.FinanceDetailManager = MIS.derive(null,{
		create: function(scope, promise, type, finance){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';//default
			this.type = type;
			this.finance = finance;
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
		getPage: function(page, pageSize){
			this.page = page;
			this.pageSize = pageSize;
			var financeObj = this.finance.financeAuditObj
			var organId = financeObj.organId.value
			var businessType = financeObj.businessType.item.value
			var fromDate = financeObj.transDate.value;
			var toDate = financeObj.transDate.value;	
			var payChannel = financeObj.payChannel.value();
			var transStatus = '2';
			var access_token = MIS.currentUser.getToken();
			var searchStr = '';
			if(this.type == MIS.FinanceAuditType.withdraw){
				//如果是带付审核 则不需要transStatus
				searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&access_token={2}&organId={3}&businessType={4}&fromDate={5}&toDate={6}&payChannel={7}', 
				[page, pageSize, access_token, organId, businessType, fromDate, toDate, payChannel]);
			}else{
				searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&access_token={2}&organId={3}&businessType={4}&fromDate={5}&toDate={6}&payChannel={7}&transStatus={8}', 
				[page, pageSize, access_token, organId, businessType, fromDate, toDate, payChannel, transStatus]);
			}
			if(this.searchStr!=''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getFinanceDetailList(urlStr);
		},
		getFinanceDetailList: function(urlStr){
			var that = this;
			var apiName = this.type == MIS.FinanceAuditType.payment? 'payDetail': 'withdrawDetail';
			this.promise({
				serverName: 'paymentService',
				apiName: apiName,
				method:'get',
				urlStr: urlStr
			}).then(function(response){
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerFinanceDetailList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			})
		},
		randerFinanceDetailList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.FinanceLog(this.type);
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		}
	}, {});


})()
