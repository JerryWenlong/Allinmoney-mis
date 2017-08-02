(function(){
	'use strict'
	//资金审核
	MIS.FundType = {
			In: 'in',
			Out: 'out'
		},
	
	MIS.Fund = MIS.derive(null, {
		create: function(fundType){
			this.fundType = fundType;
			if(fundType == MIS.FundType.Out){
				this.fundObj = this.initFundOut();
				this.randerServerObj = this.randerFundOutObj;
			}else if(fundType == MIS.FundType.In){
				this.fundObj = this.initFundIn();
				this.randerServerObj = this.randerFundInObj;
			}
		},
		initFundOut: function(){
			var obj = {};
			return obj;
		},
		randerFundOutObj:function(responseObj){
			this.fundObj = responseObj;
			this.fundObj.interestType = MIS.getDictName(MIS.dictData.interestType, responseObj.interestType);//还款方式
			this.fundObj.prodBeginAt = responseObj.prodBeginAt.split('T')[0];//成立日期
			this.fundObj.prodEndAt = responseObj.prodEndAt.split('T')[0];//到期日期
		},
		initFundIn: function(){
			var obj = {};
			return obj;
		},
		randerFundInObj: function(responseObj){
			this.fundObj = responseObj;
			this.fundObj.interestType = MIS.getDictName(MIS.dictData.interestType, responseObj.interestType);//还款方式
			this.fundObj.prodBeginAt = responseObj.prodBeginAt.split('T')[0];//成立日期
			this.fundObj.prodEndAt = responseObj.prodEndAt.split('T')[0];//到期日期
			//预期年化收益
			//合同年化收益


		},
		getDate: function(){
			var date = '';
			if(this.fundType == MIS.FundType.Out){
				date = this.fundObj.tradeDate.value;
			}else if(this.fundType = MIS.FundType.In){
				date = this.fundObj.reportDate.value;
			}
			// return date.split('T')[0].replace(new RegExp('-', 'gm'),'/');
			return date.split('T')[0];
		},
		isInstallment: function(){//是否是分期产品
			return this.fundObj.interestFreq.value.toString() != '0'
		}
	},{});

	MIS.FundDetail = MIS.derive(null, {
		create: function(type){
			if(type == MIS.FundType.Out){
				this.detailObj = this.initFundOutDetail();
				this.randerServerObj = this.randerFundOutDetailObj;
			}else if(type == MIS.FundType.In){
				this.detailObj = this.initFundInDetail();
				this.randerServerObj = this.randerFundInDetailObj;
			}
		},
		initFundOutDetail: function(){
			var obj = {};
			
			return obj;
		},
		randerFundOutDetailObj: function(responseObj){
			this.detailObj = responseObj;
			this.detailObj.prodBeginAt = responseObj.prodBeginAt.split('T')[0];
			this.detailObj.prodEndAt = responseObj.prodEndAt.split('T')[0];
			this.detailObj.orderInternal = responseObj.orderInternal? '是':'否';
			this.detailObj.settleStateStr = MIS.getDictName(MIS.dictData.fundOutStateList, responseObj.settleState);
		},
		initFundInDetail: function(){
			var obj = {};
			
			return obj;
		},
		randerFundInDetailObj: function(responseObj){
			this.detailObj = responseObj;
			this.detailObj.interestBeginAt = responseObj.interestBeginAt.split('T')[0];
			this.detailObj.interestEndAt = responseObj.interestEndAt.split('T')[0];
			this.detailObj.orderInternal = responseObj.orderInternal? '是':'否';
			this.detailObj.redeemStateStr = MIS.getDictName(MIS.dictData.redeemStatusList, responseObj.redeemState);
		}
	}, {})

	MIS.FundManager = MIS.derive(null, {
		create: function(scope, promise, type){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';//default
			this.searchProdName = '';
			this.type = type;
			this.initGridOptions();
			// this.initSearch();
			// this.initData();
		},
		initData: function(){
			// create report
			var that = this;
			// this.promise({
			// 	serverName:'mgtSettleService',
			// 	apiName:'createReport',
			// 	method: 'post',
			// }).then(function(response){
			// 	// 
			// 	var errorCode = response.data['error'] ;
			// 	if(errorCode == 0){
			// 		//refresh data
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
			var fundOutColumnDefs = [
				{name: 'fundObj.prodName', displayName: '产品名称', minWidth: 280,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodCompanyName', displayName:'产品公司',  minWidth: 168,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodPeriod', displayName:'产品期限',  minWidth: 80,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.interestType', displayName:'还款方式',minWidth: 165,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodBeginAt', displayName:'产品成立日期',  minWidth: 106,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodEndAt', displayName:'产品到期日期',  minWidth: 106,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.yearRate', displayName:'预期年化收益率',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.contractRate', displayName:'合同年化收益率',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				// {name: 'fundObj.divideCount', displayName:'分期次数',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.entrustCount', displayName:'订单数量',  minWidth: 80,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.totalEntrust', displayName:'总投资额',  minWidth: 80,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.externalEntrust', displayName:'客户投资',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.internalEntrust', displayName:'虚拟补标',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.totalProfit', displayName:'总收益额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.totalReward', displayName:'总奖励额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false}
			];

			var fundInColumnDefs = [
				{name: 'fundObj.prodName', displayName: '产品名称', minWidth: 280,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodCompanyName', displayName:'产品公司',  minWidth: 168,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodPeriod', displayName:'产品期限',  minWidth: 80,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.interestType', displayName:'还款方式',minWidth: 165,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodBeginAt', displayName:'产品成立日期',  minWidth: 106,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.prodEndAt', displayName:'产品到期日期',  minWidth: 106,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.yearRate', displayName:'预期年化收益率',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.contractRate', displayName:'合同年化收益率',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.divideCount', displayName:'分期次数',  minWidth: 80,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.entrustCount', displayName:'订单数量',  minWidth: 80,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.totalEntrust', displayName:'总投资额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.externalEntrust', displayName:'客户投资',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.internalEntrust', displayName:'虚拟补标',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.totalProfit', displayName:'总收益额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'fundObj.totalReward', displayName:'总奖励额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false}
			];

			this.gridOptions.columnDefs = this.type == MIS.FundType.Out? fundOutColumnDefs : fundInColumnDefs;
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
			// var status = this.searchStatus.value();
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchProdName!=''){
				var s = '&prodName=' + this.searchProdName;
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, s]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getFundList(urlStr);
		},
		getFundList: function(urlStr){
			var that = this;
			var apiName = this.type == MIS.FundType.Out? 'getSettlementOut' : 'getSettlementIn';
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
				var pageData = that.randerFundList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		randerFundList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.Fund(this.type);
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		},

		doAudit: function(divideId, callback, forceAudit){
			var that = this;
			var api = '';
			if(this.type == MIS.FundType.Out){
				api = 'auditOut';
			}else if(this.type == MIS.FundType.In){
				api = 'auditIn';
			}
			return this.promise({
				serverName: 'mgtSettleService',
				apiName:api,
				method:'post',
				head:{
					'Content-Type': 'application/json'
				},
				urlStr: '{0}/{1}',
				apiParam: [divideId]
			}).then(function(response){
				var errorCode = response.data['error'] ;
				if(errorCode == 0){
					if(callback){
						callback();
					}else{
						//refresh data
						that.refresh();
					}
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					MIS.failedFn(errorMsg);
				}
			})
		},

		exportExcelOnServer:function(id){
			// only for type:out
			// type:in excel use fundDetailManager
			var urlStr = '{0}/{1}';

			var url = MIS.Util.getApiUrl('mgtSettleService', 'exportSettleOutExcel', urlStr, [id]);
			var elemIF = document.createElement('iframe');
			elemIF.src = url + '?access_token=' +  MIS.currentUser.getToken();

			// var status = this.searchStatus.value();
			// elemIF.src+= '&status=' + status;

			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
		},
		
		getJournal: function(fund){
			var that = this;
			var apiName = 'fundJournal';
			var kind = this.type == MIS.FundType.Out? 'out': 'in';
			var id = this.type == MIS.FundType.Out? fund.fundObj.reportSummaryOutId.value : fund.fundObj.reportSummaryInId.value;
			var searchStr = MIS.Util.stringFormat('/{0}/{1}', [kind, id])
			var urlStr = '{0}/{1}' + searchStr;
			return this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'get',
				urlStr: urlStr
			}).then(function(response){
				var errorCode = response.data['error'] ;
				if(errorCode == 0){
					var journalList = response.data['data'];
					var auditProgress = [];
					for(var i=0;i<journalList.length;i++){
						var item = journalList[i];
						auditProgress.push({
							opAt: item.opAt.replace('T',' '),
							operator: item.operator,
							status: that.getFundStatus(item.statusNew)
						})
					}
					return auditProgress;
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					MIS.failedFn(errorMsg);
				}
			});
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

	MIS.FundDetailManager = MIS.derive(null,{
		create: function(scope, promise, type, id){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';//default
			this.type = type;
			this.id = id;
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
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', 
				[page, pageSize]);
			if(this.searchStr!=''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getFundDetailList(urlStr);
		},
		getFundDetailList: function(urlStr){
			var that = this;
			var apiName = this.type == MIS.FundType.Out? 'fundOutDetail': 'fundInDetail';
			var apiParam = [this.id];
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				apiParam: apiParam,
				urlStr: urlStr
			}).then(function(response){
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerFundDetailList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			})
		},
		randerFundDetailList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.FundDetail(this.type);
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		},
		exportExcelOnServer:function(){
			var direction = this.type.toString().toLowerCase();
			var urlStr = '{0}/{1}';
			var url = '';
			if(this.type == MIS.FundType.In){
				url = MIS.Util.getApiUrl('mgtSettleService', 'exportSettleInDetailExcel', urlStr, [this.id]);
			}else if(this.type == MIS.FundType.Out){
				url = MIS.Util.getApiUrl('mgtSettleService', 'exportSettleOutExcel', urlStr, [this.id]);
			}
			var elemIF = document.createElement('iframe');
			var src = url + '?access_token=' +  MIS.currentUser.getToken();
			elemIF.src = encodeURI(src);
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
		},
	}, {});

	MIS.FundLog = MIS.derive(null, {
		create: function(type){
			if(type == MIS.FundType.Out){
				this.logObj = this.initFundOutLog();
				this.randerServerObj = this.randerFundOutLogObj;
			}else if(type == MIS.FundType.In){
				this.logObj = this.initFundInLog();
				this.randerServerObj = this.randerFundInLogObj;
			}
		},
		initFundOutLog: function(){
			var obj={};
			obj.entrustAmount = {
				value: NaN
			};
			obj.interestFreq = {
				value: ''
			};
			obj.interestRateContract={
				value: NaN
			};
			obj.opAt={
				value: ''
			};
			obj.payAmount={
				value: NaN
			};
			obj.prodBeginDate = {
				value: '',
				displayValue:''
			};
			obj.prodCompany={
				value:''
			};
			obj.prodEndDate={
				value:'',
				displayValue: ''
			};
			obj.prodLife = {
				value: NaN
			};
			obj.prodName = {
				value:''
			};
			obj.remark = {
				value:''
			};
			obj.settAmountProd={
				value:NaN
			};
			obj.spvTaNo = {
				value:''
			};
			obj.statusNew = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.fundStatusList
			};
			obj.statusOld = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.fundStatusList
			};
			obj.totalCount = {
				value: NaN
			};
			obj.totalFee={
				value:NaN
			};
			obj.tradeDate={
				value:'',
				displayValue: ''
			};

			return obj;
		},
		randerFundOutLogObj: function(responseObj){
			this.logObj.entrustAmount.value = responseObj.entrustAmount;
			this.logObj.interestFreq.value = responseObj.interestFreq;
			this.logObj.interestRateContract.value =  responseObj.interestRateContract;
			this.logObj.opAt.value = responseObj.opAt;
			this.logObj.payAmount.value = responseObj.payAmount;
			this.logObj.prodBeginDate.value = responseObj.prodBeginDate;
			this.logObj.prodBeginDate.displayValue = responseObj.prodBeginDate.split('T')[0];
			this.logObj.prodCompany.value = responseObj.prodCompany;
			this.logObj.prodEndDate.value = responseObj.prodEndDate;
			this.logObj.prodEndDate.displayValue = responseObj.prodEndDate.split('T')[0];
			this.logObj.prodLife.value = responseObj.prodLife;
			this.logObj.prodName.value = responseObj.prodName;
			this.logObj.remark.value = responseObj.remark;
			this.logObj.settAmountProd.value = responseObj.settAmountProd;
			this.logObj.spvTaNo.value = responseObj.spvTaNo;
			this.logObj.statusNew.item.value = responseObj.statusNew;
			this.logObj.statusOld.item.value = responseObj.statusOld;
			this.logObj.totalCount.value = responseObj.totalCount;
			this.logObj.totalFee.value = responseObj.totalFee;
			this.logObj.tradeDate.value = responseObj.tradeDate;
			this.logObj.tradeDate.displayValue = responseObj.tradeDate.split('T')[0];
		},
		initFundInLog: function(){
			var obj={};
			obj.feeType = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.fareType.list
			};
			obj.interestFreq={
				value: ''
			};
			obj.interestPlatform={
				value:NaN
			};
			obj.interestRateContract={
				value: NaN
			};
			obj.interestRateCustomer={
				value: NaN
			};
			obj.opAt={
				value: '',
			};
			obj.payAmount={
				value: NaN,
			};
			obj.prodBeginDate={
				value: '',
				displayValue: '',
			};
			obj.prodCompany={
				value: '',
			};
			obj.prodEndDate={
				value: '',
				displayValue: '',
			};
			obj.prodLife={
				value: NaN,
			};
			obj.prodName={
				value: ''
			};
			obj.remark={
				value: ''
			};
			obj.reportDate={
				value:'',
				displayValue: '',
			};
			obj.settAmountCustomer={
				value:NaN
			};
			obj.settAmountProd={
				value: NaN
			};
			obj.settAmountSpv={
				value:NaN
			}
			obj.spvTaNo={
				value: ''
			};
			obj.statusNew = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.fundInStatusList
			};
			obj.statusOld = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				list: MIS.dictData.fundInStatusList
			};
			obj.totalCount = {
				value: NaN
			};
			return obj;	
		},
		randerFundInLogObj: function(responseObj){
			this.logObj.feeType.item.value = responseObj.feeType;
			this.logObj.interestFreq.value = responseObj.interestFreq;
			this.logObj.interestPlatform.value = responseObj.interestPlatform;
			this.logObj.interestRateContract.value =  responseObj.interestRateContract;
			this.logObj.interestRateCustomer.value = responseObj.interestRateCustomer;
			this.logObj.opAt.value = responseObj.opAt;
			this.logObj.payAmount.value = responseObj.payAmount;
			this.logObj.prodBeginDate.value = responseObj.prodBeginDate;
			this.logObj.prodBeginDate.displayValue = responseObj.prodBeginDate.split('T')[0];
			this.logObj.prodCompany.value = responseObj.prodCompany;
			this.logObj.prodEndDate.value = responseObj.prodEndDate;
			this.logObj.prodEndDate.displayValue = responseObj.prodEndDate.split('T')[0];
			this.logObj.prodLife.value = responseObj.prodLife;
			this.logObj.prodName.value = responseObj.prodName;
			this.logObj.remark.value = responseObj.remark;
			this.logObj.reportDate.value = responseObj.reportDate;
			this.logObj.reportDate.displayValue = responseObj.reportDate.split('T')[0];
			this.logObj.settAmountCustomer.value = responseObj.settAmountCustomer;
			this.logObj.settAmountProd.value = responseObj.settAmountProd;
			this.logObj.settAmountSpv.value = responseObj.settAmountSpv;
			this.logObj.spvTaNo.value = responseObj.spvTaNo;
			this.logObj.statusNew.item.value = responseObj.statusNew;
			this.logObj.statusOld.item.value = responseObj.statusOld;
			this.logObj.totalCount.value = responseObj.totalCount;
		}
	}, {});

	MIS.FundLogManager = MIS.derive(null, {
		create: function(scope, promise, type){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';//default
			this.type = type;
			this.initSearch();
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
			this.page = page;
			this.pageSize = pageSize;
			var status = this.searchStatus.value();
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&status={2}', [page, pageSize, status]);
			if(this.searchStr!=''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getFundLogList(urlStr);
		},
		getFundLogList: function(urlStr){
			var that = this;
			var apiName = this.type == MIS.FundType.Out? 'fundOutLog': 'fundInLog';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr
			}).then(function(response){
				var paging = response.data['paging'];
				var page = paging['page'];
				var totalPages = paging['totalPages'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerFundLogList(response.data['data']);
				that.setPage(page, totalPages, pageSize, pageData);
			})
		},
		randerFundLogList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.FundLog(this.type);
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		},
		exportExcelOnServer:function(){
			var direction = this.type.toString().toLowerCase();
			var urlStr = '{0}/{1}/' + direction;
			var url = MIS.Util.getApiUrl('mgtSettleService', 'exportJournalExcel', urlStr);
			var elemIF = document.createElement('iframe');
			elemIF.src = url + '?access_token=' +  MIS.currentUser.getToken();
			// var status = this.searchStatus.value();
			// elemIF.src += 'status=' + status;
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
		}
	}, {});

	MIS.FundInstallment = MIS.derive(null, {
		create: function(){
			this.installmentObj = this.init();
		},
		init: function(){
			var obj = {};
			obj.auditStatus = '';
			obj.endDate = '';
			obj.startDate = '';
			obj.name = '';
			obj.numOfDays = '';//计息天数
			obj.numOfPeriod = '';//期数
			obj.payStatus = '';


			return obj
		},
		randerServerObj:function(responseObj){
			this.installmentObj = responseObj;
			this.installmentObj.interestBeginAt = responseObj.interestBeginAt.split('T')[0];//起息日
			this.installmentObj.interestEndAt = responseObj.interestEndAt.split('T')[0];//到息日
			this.installmentObj.interestPayAt = responseObj.interestPayAt.split('T')[0];//付息日
			//审核状态
			this.installmentObj.reviewStatusStr = MIS.getDictName(MIS.dictData.fundInStatusList, responseObj.reviewStatus);
			//清算状态
			this.installmentObj.settleStatusStr = MIS.getDictName(MIS.dictData.settleStatusList, responseObj.settleStatus);
		},
	}, {});

	MIS.FundInstallmentManager = MIS.derive(null, {
		create: function(scope, promise, summaryId){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.initGridOptions();
			this.summaryId = summaryId;
			this.getPage();
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
				{name: 'installmentObj.prodPeriod', displayName:'产品期限',  minWidth: 100,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.interestBeginAt', displayName:'起息日',  minWidth: 165, enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.interestEndAt', displayName:'到期日',  minWidth: 165,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.interestPayAt', displayName:'付息日',  minWidth: 165,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.yearRate', displayName:'预期年化收益率',  minWidth: 165,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.contractRate', displayName:'合同年化收益率',  minWidth: 165,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.totalEntrust', displayName:'总投资额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.externalEntrust', displayName:'客户投资',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.internalEntrust', displayName:'虚拟补标',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.totalProfit', displayName:'总收益额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.totalReward', displayName:'总奖励额',  minWidth: 120,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.reviewStatusStr', displayName: '审核状态', minWidth: 100,  enableHiding:false, enableColumnMenu:false},
				{name: 'installmentObj.settleStatusStr', displayName: '清算状态', minWidth: 100,  enableHiding:false, enableColumnMenu:false},

			];

			this.gridOptions.columnDefs = columnDefs;
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(pageData){
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		getPage: function(page, pageSize){
			// this.page = page;
			// this.pageSize = pageSize;
			var prodName = this.prodName;
			var prodCompany = this.prodCompany;
			
			var urlStr = '{0}/{1}';
			this.getFundList(urlStr);
		},
		getFundList: function(urlStr){
			var that = this;
			var apiName = 'installment';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				apiParam: [that.summaryId],
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var data = response.data['data'];
				var pageData = that.randerFundList(data);
				that.setPage(pageData);
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		randerFundList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.FundInstallment();
					obj.randerServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
		},
	}, {})
})()