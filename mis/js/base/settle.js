(function(){

	var flow = MIS.derive(null, {
		create:function(description, flowId){
			this.description = description;
			this.flowId = flowId;
		},
	},{})


	var SettleFlowList = [
		new flow('Exporting 01 file to FTP server', 1),
		new flow('Importing 02 file from FTP server and starting settlement of 02 file',2),
		new flow('Exporting 03 file to FTP server',3),
		new flow('Importing 04 file from FTP server and starting settlement of 04 file',4),
		new flow('Importing 05 file from FTP server and starting settlement of 05 file',5),
		new flow('Importing 06 file from FTP server and starting settlement of 06 file',6),
	]


	MIS.Settle = MIS.derive(null, {
		init: function(){
			this.currentStatus = '';
			this.errorList = [];
			this.socketUrl= MIS.Util.stringFormat('{0}/web', [MIS.Config['mgtSettleService'].host]);
			this.createSocket();
      		this.settleData = [];
			this.myFrame = {};
		},
		create: function($scope,publicPromise, setFlow){
			var that = this;
			this.scope =  $scope;
			this.promise = publicPromise;
			if(setFlow && MIS.Util.isArray(setFlow)){
				this.settleFlowStep = [];
				for(var i=0; i<setFlow.length;i++){
					var flowId = setFlow[i];
					SettleFlowList.forEach(function(item){
						if(item.flowId == flowId){
							that.settleFlowStep.push(item);
						}
					})
				}

			}else{
				this.settleFlowStep = -1; //all steps
			}
			this.init();
		},
		getSocketId: function(){
			var that = this;
			return this.promise({
				serverName: 'mgtSettleService',
				apiName:'getSocket',
				method:'get',
				head:{
					'Content-Type': 'application/json'
				},
			}).then(function(response){
				var webId = response.data['webId'];
				that.channelUrl = MIS.Util.stringFormat('/topic/web/{0}',[webId])
			},function(){
				console.log('get socket id error');
			})
		},
		createSocket: function(fn){
            var fn = fn || function(){};
			var that = this;
			this.getSocketId().then(function(){
				that.connectSocket(fn);
			});
		},
		connectSocket: function(fn){
			var that = this;
			var socket = new SockJS(this.socketUrl);
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function(frame){
                fn();
				var stop = false;
				var startTime = 2000;
				stompClient.subscribe(that.channelUrl, function(message){
					console.log(message.body);
					that.settleData.push(message.body);
					that.notifyDataChange();
				});
			});
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				settleFlowData: that.settleData,
			}
			this.scope.$emit('sData', data);
		},
		setSystemError: function(Fn){
			this.systemError = Fn;
		},
		clearLastSettlement:function(successFn, failedFn){
            var that = this;
            var clearExceptAccount = true;
            var clearExceptBusiness = true;
            var clearSettlementState = true;
            var resetSettlementTag = true;
            var clearCache = true;
			var clearBiz = true;

			var params = MIS.Util.stringFormat(
				"?clearBiz={0}&clearExceptAccount={1}&clearExceptBusiness={2}&clearSettlementState={3}&resetSettlementTag={4}&clearCache={5}",
				[clearBiz, clearExceptAccount, clearExceptBusiness, clearSettlementState, resetSettlementTag, clearCache ]
			)
			var urlStr = "{0}/{1}" + params;

			this.promise({
				serverName: 'mgtSettleService',
				apiName:'clearSettle',
				method:'delete',
				head:{
					'Content-Type': 'application/json'
				},
				urlStr: urlStr
			}).then(function(response){
                that.createSocket(function(){
                    console.log('clear settle success')
                    successFn();
                });
                //
			},function(failed) {
				// body...
				console.log('clear settle failed')
				if(failedFn) failedFn(failed);
			});
		},
		getError: function(successFn, failedFn){
			// get all errors after get finish target
			this.promise({
				serverName: 'mgtSettleService',
				apiName:'getSettlementResult',
				method: 'get',
				head: {
					'Content-Type': 'application/json'
				}
			}).then(function(response){
				if(response.data['error'] == 0){
					successFn(response.data);
				}else{
					failedFn()
				}
			}, failedFn)
		},
		doSettle: function(successFn, failedFn){
			if(this.settleFlowStep == -1){
				this.doSettleByAllStep(successFn, failedFn);
			}else{
				this.doSettleAsFlow(successFn, failedFn);
			}
		},
		doSettleByAllStep: function(successFn, failedFn){
			var flowId = -1;
			this.doJob(flowId, function(response){
				var errorCode = response.data['error'];
				if(errorCode == 0){
					successFn()
				}else{
					var errorMsg = response.data['message'];
					failedFn(errorMsg);
				}
			}, function(error){
					var errorMsg = '系统错误';
					failedFn(errorMsg);
			});
		},
		// not use currently
		doSettleAsFlow: function(successFn, failedFn){
			var jobList = this.settleFlowStep;
			if(jobList.length <= 0) return false;
			var current = 0;
			var currentJob = jobList[current];

			(function(_this, _current, _jobList, successFn, failedFn){
				var currentJob = _jobList[_current];
				var that = _this;

				_this.doJob(currentJob.flowId, successFn, failedFn);

				var successFn = function(){
					var next = _current++;
					if(next<=_jobList.length){
						var nextJob = _jobList[next];
						that.doJob(nextJob.flowId, successFn, failedFn);
					}else{
						that.finishJob();
					}
				}
			})(this, current, jobList, successFn, failedFn);
		},
		doJob: function (flowId, successFn, failedFn) {
			var that = this;
			var urlStr = "{0}/{1}?flow=" + flowId;
			this.promise({
				serverName: 'mgtSettleService',
				apiName: 'settleFlow',
				method:'put',
				head:{
					'Content-Type': 'application/json'
				},
				urlStr:urlStr
			}).then(successFn, failedFn);
		},
		finishJob: function(){
			//
			console.log('finishJob');
		},
	}, {});


	var ErrorClass = {
		TradeError:{
			class:'tradeError',
			apiName:'settleTradeError',
		},
		AccountError: {
			class:'accountError',
			apiName:'settleAccountError',
		},
        ShareError:{
            class:'shareError',
            apiName:'settleShareError',
        },
        DividendError:{
            class:'dividendError',
            apiName:'settleDividendError'
        }
	}

	MIS.SettleError = MIS.derive(null, {
		init: function (argument) {
			// body...
			this.scope = argument['scope'];
            this.$q = argument['q'];
			this.pageSize = argument['pageSize'] || 10;
			this.total = 0;
			this.currentPage = 1;
			this.currentPageList = [];
			this.promise = argument['publicPromise'];
            this.resultList = [];
		},
		randerPageList: function(){},//virtual function, implement in child class
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			};
			this.scope.$emit('dataChange', data);
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		getPage: function(apiName, requestParam){
			// public get page
			var urlStr = '{0}/{1}?' + requestParam;
			var serverName = 'mgtSettleService';
			var apiName = apiName;
			var method='get';

			var that = this;
			this.promise({
				serverName: serverName,
				apiName: apiName,
				method:method,
				head:{
					'Content-Type': 'application/json'
				},
				urlStr: urlStr
			}).then(function(response){
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var errorCode = response.data['error'];
				var pageData = that.randerPageList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			},function(failed){
                //that.setPage(1, 0, 10, []);
			});
		},
		updateTradeError: function(dataList, errorType, successFn, failedFn){
			var urlStr = "{0}/{1}/" + errorType;
			this.promise({
				serverName: 'mgtSettleService',
				apiName: 'updateSettleBusinessError',
				method: 'put',
				head:{
					'Content-Type': 'application/json'
				},
				urlStr: urlStr,
				data: dataList
			}).then(successFn, failedFn);
		},
		updateAccountError: function(dataList, successFn, failedFn){
			this.promise({
				serverName: 'mgtSettleService',
				apiName: 'updateSettleAccountError',
				method: 'put',
				head:{
					'Content-Type': 'application/json'
				},
				data: dataList
			}).then(successFn, failedFn);
		},
		updateShareError: function(dataList, successFn, failedFn){
			this.promise({
				serverName: 'mgtSettleService',
				apiName: 'updateSettleShareError',
				method: 'put',
				head:{
					'Content-Type': 'application/json'
				},
				data: dataList
			}).then(successFn, failedFn);
		},
		updateDividendError: function(dataList, successFn, failedFn){
			this.promise({
				serverName: 'mgtSettleService',
				apiName: 'updateSettleDividendError',
				method: 'put',
				head:{
					'Content-Type': 'application/json'
				},
				data: dataList
			}).then(successFn, failedFn);
		},
		
	}, {});

	//error type
	MIS.SettlementError = MIS.derive(MIS.SettleError,{
		create: function(argument){
			var that = this;
			this.init(argument);
			var errorClass = argument['errorClass'];
			this.errorClass = ErrorClass[errorClass];
			this.errorType = argument['errorType'];
			this.initGridOption();
			this.initGridRegister();

		},
		initGridOption: function(){
			this.gridOptions = {
				// enableRowSelection: false,
				// enableSelectAll:false,
				// multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
				enableCellEditOnFocus:true,
                // selectionRowHeaderWidth: 0
			};
			var columnDefs = [];
			if(this.errorClass.class == ErrorClass.TradeError.class){
				switch(this.errorType){
					case '1': this.errorName = '交易未支付';
                        columnDefs = this.initTradeErrorGridOption_type1();break;
					//case '2': this.errorName = '支付没有对应的交易';columnDefs = this.initTradeErrorGridOption_type2();break;
					case '3': this.errorName = '03文件导出过程中发现有账户和份额不匹配';columnDefs = this.initTradeErrorGridOption_type3();break;
					case '4': this.errorName = '用户银行卡无流水';columnDefs = this.initTradeErrorGridOption_type4();break;
					case '5': this.errorName = '异常交易';columnDefs = this.initTradeErrorGridOption_type5();break;
					//case '6': this.errorName = '04文件解析过程中发现不匹配的账户和份额';columnDefs = this.initTradeErrorGridOption_type6();break;
				}
			}else if(this.errorClass.class == ErrorClass.AccountError.class){
				 switch(this.errorType){
				 	case '1': this.errorName = '清算本地数据库不存在TA返回的帐号';break;
				 	case '2': this.errorName = 'TA返回码不为0000';break;
				 	case '3': this.errorName = '02文件不存在清算本地数据库的帐号';break;
				 	case '4': this.errorName = '无效的交易日期';break;
				 	case '5': this.errorName = '02文件中存在无效字段';break;
				 }
				columnDefs = this.initAccountErrorGridOption_type1();
			}else if(this.errorClass.class == ErrorClass.ShareError.class){
                switch(this.errorType){
                    case '1': this.errorName = '对应的account不存在';break;
                    case '2': this.errorName = 'sett_account_prod_share表没有对应的记录';break;
                    case '3': this.errorName = '对应的production不存在';break;
                    case '4': this.errorName = 'TA_TOTAL_SHARE_LESS_THAN_AVAILABLE_SHARE 错误';break;
                }
                columnDefs=this.initShareErrorGridOption_type0();
            }else if(this.errorClass.class == ErrorClass.DividendError.class){
                this.errorName = '对应的account不存在';
                columnDefs = this.initDividendErrorGridOption_type();
            }
			this.gridOptions.columnDefs = columnDefs;
		},
		initGridRegister: function(){
			var that = this;
			this.gridOptions.onRegisterApi = function(gridApi){
                that.scope.gridApi = gridApi;
                gridApi.edit.on.afterCellEdit(that.scope,function(rowEntity, colDef, newValue, oldValue){
                	if(newValue !== oldValue) rowEntity._hasChanged = true;//set _hasChanged
                });
			};
		},
		randerPageList: function(responseItems){
			var results = [];
			var len = responseItems.length;
			for(var i=0; i< len; i++){
				var responseItem = responseItems[i];
				var obj = {};
				if(this.errorClass.class == ErrorClass.AccountError.class){
					obj.applicationNo = responseItem.applicationNo;
					obj.assetAccountId = responseItem.assetAccountId;
					obj.bizCode = responseItem.bizCode;
					obj.branchCode = responseItem.branchCode;
					obj.distributorCode = responseItem.distributorCode;
					obj.errorType = responseItem.errorType;
					obj.financingAccountId = responseItem.financingAccountId;
					obj.fixFlag = responseItem.fixFlag;
					obj.taAccountId = responseItem.taAccountId;
					obj.taNo = responseItem.taNo;
					obj.taReturnCode = responseItem.taReturnCode;
					obj.taSerialNo = responseItem.taSerialNo;
					obj.transAccount = responseItem.transAccount;
					obj.transConfirmDate = responseItem.transConfirmDate;
					obj.transDate = responseItem.transDate;
					obj.transTime = responseItem.transTime;
					obj.sett02ExcpAccountId = responseItem.sett02ExcpAccountId;
					results.push(obj);
				}else if(this.errorClass.class == ErrorClass.TradeError.class){
					switch(this.errorType){
						case '1': obj = this.randerTradeError_1(responseItem);break;
						//case '2': obj = this.randerTradeError_2(responseItem);break;
						case '3': obj = this.randerTradeError_3(responseItem);break;
						case '4': obj = this.randerTradeError_4(responseItem);break;
						case '5': obj = this.randerTradeError_5(responseItem);break;
						//case '6': obj = this.randerTradeError_6(responseItem);break;
					}
					results.push(obj);
				}else if(this.errorClass.class == ErrorClass.ShareError.class){
                    obj.sett05ExcpTaShareId = responseItem.sett05ExcpTaShareId;
                    obj.assetAccountId = responseItem.assetAccountId;
                    obj.financingAccountId = responseItem.financingAccountId;
                    obj.taAccountId = responseItem.taAccountId;
                    obj.transAccount = responseItem.transAccount;
                    obj.taNo = responseItem.taNo;
                    obj.prodCode = responseItem.prodCode;
                    obj.taSerialNo = responseItem.taSerialNo;
                    obj.availableShare = responseItem.availableShare;
                    obj.frozenShare = responseItem.frozenShare;
                    obj.detailType = responseItem.detailType;
                    obj.errorType = responseItem.errorType;
                    obj.fixFlag = responseItem.fixFlag;
                    results.push(obj);
                }else if(this.errorClass.class == ErrorClass.DividendError.class){
                    obj.sett06ExcpDividendId = responseItem.sett06ExcpDividendId;
                    obj.assetAccountId = responseItem.assetAccountId;
                    obj.financingAccountId = responseItem.financingAccountId;
                    obj.taAccountId = responseItem.taAccountId;
                    obj.transAccount = responseItem.transAccount;
                    obj.taNo = responseItem.taNo;
                    obj.prodCode = responseItem.prodCode;
                    obj.taSerialNo = responseItem.taSerialNo;
                    obj.errorType = responseItem.errorType;
                    obj.fixFlag = responseItem.fixFlag;
                    results.push(obj);
                }
			}
			return results;

		},
		randerTradeError_1: function(responseItem){
			var obj = {};
			obj.sett03BizNoPayId = responseItem.sett03BizNoPayId;
			obj.assetAccountId = responseItem.assetAccountId;
			obj.financingAccountId = responseItem.financingAccountId ;
			obj.bizId = responseItem.bizId ;
			obj.taAccountId = responseItem.taAccountId ;
			obj.taNo = responseItem.taNo ;
			obj.prodCode = responseItem.prodCode ;
			obj.prodPrice = responseItem.prodPrice ;
			obj.bizType = responseItem.bizType ;
			obj.entrustShare = responseItem.entrustShare ;
			obj.entrustAmount = responseItem.entrustAmount ;
			obj.totalAmount = responseItem.totalAmount ;
			obj.paymentRequestId = responseItem.paymentRequestId ;
			obj.fixFlag = responseItem.fixFlag ;
			return obj;
		},
        randerTradeError_2: function(responseItem){
            var obj = {};
            //WAITTING
            return obj;
        },
		randerTradeError_3: function(responseItem){
			var obj = {};
			// obj. = responseItem. ;
			obj.bizId = responseItem.bizId ;
			obj.assetAccountId = responseItem.assetAccountId ;
			obj.bizType = responseItem.bizType ;
			obj.bizNo = responseItem.bizNo ;
			obj.taNo = responseItem.taNo ;
			obj.entrustAmount = responseItem.entrustAmount ;
			obj.entrustShare = responseItem.entrustShare ;
			obj.financingAccountId = responseItem.financingAccountId ;
			obj.fixFlag = responseItem.fixFlag ;
			obj.payAmount = responseItem.payAmount ;
			obj.prodCode = responseItem.prodCode ;
			obj.prodPrice = responseItem.prodPrice ;
			obj.realPayAmount = responseItem.realPayAmount ;
			obj.sett03BizAmountShareNotMatchId = responseItem.sett03BizAmountShareNotMatchId ;
			obj.taAccountId = responseItem.taAccountId ;
			return obj;
		},
		randerTradeError_4: function(responseItem){
			var obj = {};
			obj.sett03BizNoBankcardPayId = responseItem.sett03BizNoBankcardPayId ;
			obj.assetAccountId = responseItem.assetAccountId ;
			obj.payAmount = responseItem.payAmount ;
			obj.tradeSerialNo = responseItem.tradeSerialNo ;
			obj.paymentSerialNo = responseItem.paymentSerialNo ;
			obj.fixFlag = responseItem.fixFlag ;
			return obj;
		},
		randerTradeError_5: function(responseItem){
			var obj = {};
			obj.sett04ExcpBizId = responseItem.sett04ExcpBizId ;
			obj.assetAccountId = responseItem.assetAccountId ;
			obj.financingAccountId = responseItem.financingAccountId ;
			obj.applicationNo = responseItem.applicationNo ;
			obj.transAccount = responseItem.transAccount ;
			obj.taAccountId = responseItem.taAccountId ;
			obj.taNo = responseItem.taNo ;
			obj.prodCode = responseItem.prodCode ;
			obj.prodPrice = responseItem.prodPrice ;
			obj.bizCode = responseItem.bizCode ;
			obj.entrustPrice = responseItem.entrustPrice ;
			obj.entrustShare = responseItem.entrustShare ;
			obj.entrustAmount = responseItem.entrustAmount ;
			obj.settledShare = responseItem.settledShare ;
			obj.settledAmount = responseItem.settledAmount ;
			obj.totalCommission = responseItem.totalCommission ;
			obj.errorType = responseItem.errorType ;
			obj.taReturnCode = responseItem.taReturnCode ;
			obj.fileName = responseItem.fileName ;
			obj.fixFlag = responseItem.fixFlag ;
			return obj;
		},
        randerTradeError_6: function(responseItem){
            var obj = {};
            //
            return obj;
        },
		getPage: function(page, pageSize, search){
			this.currentPage = page;
			this.pageSize = pageSize;
			var requestParam = MIS.Util.stringFormat('page={0}&pageSize={1}&errorType={2}', [page, pageSize, this.errorType]);
			this.getPage._inherited.apply(this, [this.errorClass.apiName, requestParam]);
		},
        refresh: function(){
            this.getPage(this.currentPage, this.pageSize, {});
        },
		saveEditData: function(successFn, failedFn){
            var changedList = [];
            var len = this.gridOptions.data.length;
            for(var i=0;i<len;i++){
            	var item = this.gridOptions.data[i];
            	if(item._hasChanged){
            		changedList.push(item);
            	}
            }
            //save to server
            if(changedList.length > 0){
            	if(this.errorClass.class == ErrorClass.TradeError.class){
	            	var errorType = this.errorType;
	            	this.updateTradeError(changedList, errorType, successFn, failedFn);
	            }else if(this.errorClass.class == ErrorClass.AccountError.class){
	            	this.updateAccountError(changedList, successFn, failedFn);
	            }else if(this.errorClass.class == ErrorClass.ShareError.class){
		            	this.updateShareError(changedList, successFn, failedFn);
	            }else if(this.errorClass.class == ErrorClass.DividendError.class){
		            	this.updateDividendError(changedList, successFn, failedFn);
	            }
            }else{
            	// nothing to change
            	successFn({
            		data:{
            			error:0
            		}
            	});
            }
            
		},
		initTradeErrorGridOption_type1:function(){
            return [
                {name: 'sett03BizNoPayId', displayName:'',minWidth: 85, visible:false, enableHiding:false, enableColumnMenu:false},
                {name: 'assetAccountId', displayName:'资产账号',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'financingAccountId', displayName:'财务账号', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'bizId', displayName:'bizID',  minWidth: 85, visible:false, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taAccountId', displayName:'投资人基金账号', minWidth: 140, enableCellEdit:false, enableHiding:false, enableColumnMenu:false },
                {name: 'taNo', displayName:'TA', cellFilter:'taFilter', minWidth: 55, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'prodCode', displayName:'产品代码',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'prodPrice', displayName:'产品价格',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'bizType', displayName:'业务类型', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'entrustShare', displayName:'委托份额',minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'entrustAmount', displayName:'委托金额', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'totalAmount', displayName:'基金金额汇总', minWidth: 100, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'paymentRequestId', displayName:'paymentRequestId', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
                    editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
                    {code:0, name:'否'},
                    {code:1, name:'是'}
                ]
                },
            ];
        },
        initTradeErrorGridOption_type2:function(){
            return [
            ];
        },
        initTradeErrorGridOption_type3: function(){

            return [
                {name: 'bizId', displayName:'bizID',  minWidth: 85, visible:false, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'assetAccountId', displayName:'资产账号',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'bizType', displayName:'业务类型', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'bizNo', displayName:'订单号', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'taNo', displayName:'TA', cellFilter:'taFilter', minWidth: 55, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'entrustAmount', displayName:'委托金额', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'entrustShare', displayName:'委托份额',minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'financingAccountId', displayName:'财务账号', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
                    editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
                    {code:0, name:'否'},
                    {code:1, name:'是'}
                ]
                },
                {name: 'payAmount', displayName:'支付金额', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'prodCode', displayName:'产品代码',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'prodPrice', displayName:'产品价格',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'realPayAmount', displayName:'实际支付金额', minWidth: 120, enableHiding:false, enableColumnMenu:false},
                {name: 'sett03BizAmountShareNotMatchId', displayName:'',minWidth: 85, visible:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taAccountId', displayName:'投资人基金账号', minWidth: 140, enableCellEdit:false, enableHiding:false, enableColumnMenu:false },
            ];
        },
		initTradeErrorGridOption_type4: function(){
            return [
                {name: 'sett03BizNoBankcardPayId', displayName:'bizID',  minWidth: 85, visible:false, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'assetAccountId', displayName:'资产账号',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'payAmount', displayName:'支付金额', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'tradeSerialNo', displayName:'tradeSerialNo', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'paymentSerialNo', displayName:'paymentSerialNo', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
                    editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
                    {code:0, name:'否'},
                    {code:1, name:'是'}
                ]
                },
            ]
		},
        initTradeErrorGridOption_type5:function(){
            return [
                {name: 'sett04ExcpBizId', displayName:'sett04ExcpBizId',  minWidth: 85, visible:false, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'assetAccountId', displayName:'资产账号',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'financingAccountId', displayName:'财务账号', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'applicationNo', displayName:'申请单号', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taAccountId', displayName:'投资人基金账号', minWidth: 140, enableCellEdit:false, enableHiding:false, enableColumnMenu:false },
                {name: 'transAccount', displayName:'TA账号', minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false },
                {name: 'taNo', displayName:'TA', cellFilter:'taFilter', minWidth: 55, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'prodCode', displayName:'产品代码',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'prodPrice', displayName:'产品价格',minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'bizCode', displayName:'bizCode', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'entrustPrice', displayName:'entrustPrice', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'entrustShare', displayName:'委托份额',minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'entrustAmount', displayName:'委托金额', minWidth: 85, enableHiding:false, enableColumnMenu:false},
                {name: 'settledShare', displayName:'成交份额', minWidth: 70, enableColumnMenu:false , enableHiding:false},
                {name: 'settledAmount', displayName:'成交金额', minWidth: 70, enableColumnMenu:false , enableHiding:false},
                {name: 'totalCommission', displayName:'总手续费', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'errorType', displayName:'errorType', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false, visible: false},
                {name: 'taReturnCode', displayName:'TA返回值', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'fileName', displayName:'清算源文件', minWidth: 70, enableCellEdit:false, enableColumnMenu:false , enableHiding:false},
                {name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
                    editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
                    {code:0, name:'否'},
                    {code:1, name:'是'}
                ]
                },
            ];
        },
        initTradeErrorGridOption_type6:function(){
            return [
            ];
        },
        initAccountErrorGridOption_type1:function(){
            return [
            	{name: 'sett02ExcpAccountId', visible:false},
                {name: 'applicationNo', displayName:'应用编号', width: "28%", enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'assetAccountId', displayName:'资产帐号ID',  minWidth: 100, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'bizCode', displayName:'交易编码',  minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'branchCode', displayName:'分支编码',  minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'distributorCode', displayName:'分布编码',  minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'errorType', displayName:'错误类型',  minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'financingAccountId', displayName:'财务帐号ID',  minWidth: 100, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
                    editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
                    {code:0, name:'否'},
                    {code:1, name:'是'}
                ]
                },
                {name: 'taAccountId', displayName:'投资人基金账号',  minWidth: 140, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taNo', displayName:'TA编号', cellFilter:'taFilter',  minWidth: 85, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taReturnCode', displayName:'TA返回码',  minWidth: 95, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taSerialNo', displayName:'TA序列号',  minWidth: 95, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'transAccount', displayName:'交易账号',  minWidth: 130, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'transConfirmDate', displayName:'交易确认日期',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'transDate', displayName:'交易日期',  minWidth: 100, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'transTime', displayName:'交易时间',  minWidth: 100, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
            ];
        },
        initShareErrorGridOption_type0:function(){
            return [
                {name: 'sett05ExcpTaShareId', displayName:'sett05ExcpTaShareId',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'assetAccountId', displayName:'assetAccountId',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'financingAccountId', displayName:'financingAccountId',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taAccountId', displayName:'投资人基金账号',  minWidth: 140, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'transAccount', displayName:'transAccount',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taNo', displayName:'taNo',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'prodCode', displayName:'prodCode',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'taSerialNo', displayName:'taSerialNo',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'availableShare', displayName:'availableShare',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'frozenShare', displayName:'frozenShare',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'detailType', displayName:'detailType',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'errorType', displayName:'errorType',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
                {name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
                    editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
                    {code:0, name:'否'},
                    {code:1, name:'是'}
                ]},
            ];
        },
        initDividendErrorGridOption_type:function(){
            return [
				{name: 'sett06ExcpDividendId', displayName:'sett06ExcpDividendId',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'assetAccountId', displayName:'assetAccountId',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'financingAccountId', displayName:'financingAccountId',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'taAccountId', displayName:'投资人基金账号',  minWidth: 140, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'transAccount', displayName:'transAccount',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'taNo', displayName:'taNo',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'prodCode', displayName:'prodCode',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'taSerialNo', displayName:'taSerialNo',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'errorType', displayName:'errorType',  minWidth: 155, enableCellEdit:false, enableHiding:false, enableColumnMenu:false},
				{name: 'fixFlag', displayName:'是否订正过',cellFilter: 'fixFlagFilter', minWidth: 100, enableHiding:false, enableColumnMenu:false,
					editDropdownIdLabel: 'code', editDropdownValueLabel:'name',editableCellTemplate:'ui-grid/dropdownEditor',editDropdownOptionsArray:[
					{code:0, name:'否'},
					{code:1, name:'是'}
				]},
            ];
        },
	},{})
})()
