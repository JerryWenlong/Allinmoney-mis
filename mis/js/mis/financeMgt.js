var financeMgt = new MIS._Angular('financeMgt', []);
financeMgt.createRoute('提现管理', '/role31', 'pages/financeMgt.html', 'withdrawController');
var withdrawController = financeMgt.createController('withdrawController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {

		var financeManager = new MIS.FinanceManager($scope, publicService.promise, MIS.TradeType.Withdraw);
		$scope.withdrawFlag = true;
		$scope.keyWord = '';
		$scope.searchDetail = financeManager.searchStatus;
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		financeManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.data = data.currentPageList;
			$scope.myConf.totalItems = data.totalPages * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});
		$scope.getValue = function(obj){
			if(obj){
				var itemValue = obj.item.value
				var result = ''
				for(var i in obj.list){
					if(itemValue == obj.list[i].value){
						result = obj.list[i].name
						break;
					}
				}
			}
			return result
		}
		// paging change page function
		$scope.changePage = function(page){
			financeManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		//----
		$scope.query = function(){
			financeManager.searchKeyword = $scope.keyWord;
			financeManager.getPage(1,$scope.myConf.itemsPerPage);
		}
		$scope.advanceQueryObj = financeManager.searchDetailObj
		$scope.advanceQueryObj.errorMsg = ''
		$scope.advanceQuery =function(){
			financeManager.searchKeyword = '';
			$scope.keyWord = '';
			var popWindow = new MIS.Popup({
				w: 374,
				h: 340,
				coverCls: 'financeAuditCover',
				cls: 'financeMgtPop',
				title: {
					titleDivCls: 'financeMgtTtileObj',
					class: 'financeMgtWithdrawPopupHeader'
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '用户名',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.userName',
							attr: {
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '真实姓名',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.name',
							attr: {
								type: 'text',
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '交易状态',
							}
						},
						{
							tag: 'select',
							ngModel: "advanceQueryObj.tradeStatus.item",
                            ngOptions: "item.name  for item in advanceQueryObj.tradeStatus.list track by item.value"
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '银行名称',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.bankName',
							attr: {
								type: 'text',
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '交易时间',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.tradeBeginTime.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.tradeBeginTime',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'withdrawTradeBeginTime'
							},
							attr: {
								class: 'orderMgtPopInput3',
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;margin-right:28px;',
								type: 'text',
								placeholder: '开始时间'
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.tradeEndTime.value',
							datetime:  {
								datetimeModel: 'advanceQueryObj.tradeEndTime',
								datetimeValue: 'value',
								datetimeId: 'withdrawTradeEndTime',
								hasTime: true
							},
							attr: {
								class: 'orderMgtPopInput3',
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;',
								type: 'text',
								placeholder: '结束时间'
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '查询',
								class: 'popupBtn1 financeMgtBtn'
							},
							clickEvt: function(){
								beginTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.tradeBeginTime.value)
								endTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.tradeEndTime.value)
								if(beginTimestamp > endTimestamp){
									$scope.advanceQueryObj.errorMsg = '开始时间应早于结束时间'
									$scope.$apply()
								}else{
									financeManager.getPage(1,$scope.myConf.itemsPerPage);
									popWindow.close()
								}
							}
						},
						{
							tag: 'button',
							attr: {
								class: 'popupBtn1 financeMgtBtn',
								innerHTML: '重置',
								style: 'margin-left:55px'
							},
							clickEvt: function(){
								financeManager.clearSearchDetail();
								$scope.advanceQueryObj.errorMsg = '';
								$scope.$apply();
							}
						}
					],
					[
						{
							tag: 'label',
							ngModel: 'advanceQueryObj.errorMsg',
							attr: {
								type: 'text',
								style: 'height:20px;color:red;border:0;width:96%;text-align:center;background-color:transparent;',
							}
						}
					]
				]
			},$scope,$compile)
		}
}])
financeMgt.createRoute('充值管理', '/role32', 'pages/financeMgt.html', 'depositController');
var depositController = financeMgt.createController('depositController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		var financeManager = new MIS.FinanceManager($scope, publicService.promise, MIS.TradeType.Deposit);
		$scope.depositFlag = true;
		$scope.keyWord = '';
		$scope.searchDetail = financeManager.searchStatus;
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		financeManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.data = data.currentPageList;
			$scope.myConf.totalItems = data.totalPages * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});
		$scope.getValue = function(obj){
			if(obj){
				var itemValue = obj.item.value
				var result = ''
				for(var i in obj.list){
					if(itemValue == obj.list[i].value){
						result = obj.list[i].name
						break;
					}
				}
			}
			return result
		}
		// paging change page function
		$scope.changePage = function(page){
			financeManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		//----
		$scope.query = function(){
			financeManager.searchKeyword = $scope.keyWord
			financeManager.getPage(1,$scope.myConf.itemsPerPage);
		}
		$scope.advanceQueryObj = financeManager.searchDetailObj
		$scope.advanceQueryObj.errorMsg = '';
		$scope.advanceQuery =function(){
			financeManager.searchKeyword = '';
			$scope.keyWord = '';
			var popWindow = new MIS.Popup({
				w: 374,
				h: 340,
				coverCls: 'financeAuditCover',
				cls: 'financeMgtPop',
				title: {
					titleDivCls: 'financeMgtTtileObj',
					class: 'financeMgtWithdrawPopupHeader'
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '用户名',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.userName',
							attr: {
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '真实姓名',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.name',
							attr: {
								type: 'text',
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '交易状态',
							}
						},
						{
							tag: 'select',
							ngModel: "advanceQueryObj.tradeStatus.item",
                            ngOptions: "item.name  for item in advanceQueryObj.tradeStatus.list track by item.value"
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '银行名称',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.bankName',
							attr: {
								type: 'text',
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '交易时间',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.tradeBeginTime.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.tradeBeginTime',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'depositTradeBeginTime'
							},
							attr: {
								class: 'orderMgtPopInput3',
								style: 'width:98px;margin-right:10px;font-size:12px;padding-right:24px;margin-right:28px;',
								type: 'text',
								placeholder: '开始时间'
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.tradeEndTime.value',
							datetime:  {
								datetimeModel: 'advanceQueryObj.tradeEndTime',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'depositTradeEndTime'
							},
							attr: {
								class: 'orderMgtPopInput3',
								style: 'width:98px;font-size:12px;padding-right:24px;',
								type: 'text',
								placeholder: '结束时间'
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '查询',
								class: 'popupBtn1 financeMgtBtn'
							},
							clickEvt: function(){
								beginTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.tradeBeginTime.value)
								endTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.tradeEndTime.value)
								if(beginTimestamp > endTimestamp){
									$scope.advanceQueryObj.errorMsg = '开始时间应早于结束时间'
									$scope.$apply()
								}else{
									financeManager.getPage(1,$scope.myConf.itemsPerPage);
									popWindow.close()
								}
							}
						},
						{
							tag: 'button',
							attr: {
								class: 'popupBtn1 financeMgtBtn',
								innerHTML: '重置',
								style: 'margin-left:55px'
							},
							clickEvt: function(){
								financeManager.clearSearchDetail();
								$scope.advanceQueryObj.errorMsg = '';
								$scope.$apply();
							}
						}
					],
					[
						{
							tag: 'label',
							ngModel: 'advanceQueryObj.errorMsg',
							attr: {
								type: 'text',
								style: 'height:20px;color:red;border:0;width:96%;text-align:center;background-color:transparent;',
							}
						}
					]
				]
			},$scope,$compile)
		}
}])

financeMgt.createRoute('第三方支付流水查询', '/role33', 'pages/financeMgt.html', 'thirdPartyPayFlowController');
var thirdPartyPayFlowController = financeMgt.createController('thirdPartyPayFlowController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		var paymentManager = new MIS.PaymentManager($scope, publicService.promise);
		$scope.thirdPartyPayFlowFlag = true;
		$scope.keyWord = paymentManager.searchKeyword;
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		paymentManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.data = data.currentPageList;
			$scope.myConf.totalItems = data.totalPages * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});
		$scope.getValue = function(obj){
			if(obj){
				var itemValue = obj.item.value
				var result = ''
				for(var i in obj.list){
					if(itemValue == obj.list[i].value){
						result = obj.list[i].name
						break;
					}
				}
			}
			return result
		}
		// paging change page function
		$scope.changePage = function(page){
			paymentManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		//----
		$scope.query = function(){
			paymentManager.searchKeyword = $scope.keyWord;
			paymentManager.getPage(1,$scope.myConf.itemsPerPage);
		}
		$scope.advanceQueryObj = paymentManager.searchDetailObj
		$scope.advanceQueryObj.errorMsg = ''
		$scope.advanceQuery =function(){
			paymentManager.searchKeyword = '';
			$scope.keyWord = '';
			var popWindow = new MIS.Popup({
				w: 404,
				h: 298,
				title: {
					titleDivCls: 'financeMgtTtileObj',
					class: 'financeMgtWithdrawPopupHeader'
				},
				coverCls: 'financeAuditCover',
				cls: 'financeMgtPop',
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '交易日期'
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.tradeBeginTime.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.tradeBeginTime',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'paymentTradeBeginTime'
							},
							attr: {
								class: 'orderMgtPopInput2 orderMgtPopInput3',
								// class: 'orderMgtPopInput3',
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;',
								type: 'text',
								placeholder: '开始时间'
							}
						},
						{
							tag: 'label',
							attr: {
								style: 'float:none;width:10px;display:inline-block;text-align:center;margin-left:0;margin-right:20px;',
								innerHTML: '~'
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.tradeEndTime.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.tradeEndTime',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'paymentTradeEndTime'
							},
							attr: {
								class: 'orderMgtPopInput2 orderMgtPopInput3',
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;',
								type: 'text',
								placeholder: '结束时间'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '交易金额'
							}
						},
						{
							tag: 'input',
							attr: {
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;',
								type: 'text',
								placeholder: '最小金额'
							},
							ngModel: 'advanceQueryObj.tradeAmountMin.value',
						},
						{
							tag: 'label',
							attr: {
								style: 'float:none;width:10px;display:inline-block;text-align:center;margin-left:0;margin-right:20px;',
								innerHTML: '~'
							}
						},
						{
							tag: 'input',
							attr: {
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;',
								type: 'text',
								placeholder: '最大金额'
							},
							ngModel: 'advanceQueryObj.tradeAmountMax.value',
						},
						{
							tag: 'label',
							attr: {
								style: 'float:none;width:10px;',
								innerHTML: '元'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '交易类型'
							}
						},
						{
							tag: 'select',
							ngModel: "advanceQueryObj.transType.item",
                            ngOptions: "item.name  for item in advanceQueryObj.transType.list track by item.value",
                            attr: {
                            	style: 'width:304px;font-size:12px;'
                            }
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '交易状态'
							}
						},
						{
							tag: 'select',
							ngModel: "advanceQueryObj.tradeStatus.item",
                            ngOptions: "item.name  for item in advanceQueryObj.tradeStatus.list track by item.value",
                            attr: {
                            	style: 'width:304px;font-size:12px;'
                            }
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '查询',
								class: 'popupBtn1 financeMgtBtn'
							},
							clickEvt: function(){
								beginTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.tradeBeginTime.value)
								endTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.tradeEndTime.value)
								if(beginTimestamp > endTimestamp){
									$scope.advanceQueryObj.errorMsg = '开始时间应早于结束时间'
									$scope.$apply()
								}else if($scope.advanceQueryObj.tradeAmountMin.value > $scope.advanceQueryObj.tradeAmountMax.value ){
									$scope.advanceQueryObj.errorMsg = '最小金额应小于最大金额'
									$scope.$apply()
								}else{
									paymentManager.getPage(1,$scope.myConf.itemsPerPage);
									popWindow.close()
								}
							}
						},
						{
							tag: 'button',
							attr: {
								class: 'popupBtn1 financeMgtBtn',
								innerHTML: '重置',
								style: 'margin-left:55px'
							},
							clickEvt: function(){
								paymentManager.clearSearchDetail();
								$scope.advanceQueryObj.errorMsg = ''
								$scope.$apply();
							}
						}
					],
					[
						{
							tag: 'label',
							ngModel: 'advanceQueryObj.errorMsg',
							attr: {
								type: 'text',
								style: 'height:20px;color:red;border:0;width:96%;text-align:center;background-color:transparent',
							}
						}
					]
				]
			},$scope,$compile)
		}
}])



//代收、代付审核
financeMgt.createRoute('代收审核', '/role34', 'pages/financeAuditIn.html', 'paymentAuditController');
var paymentAuditController = financeMgt.createController('paymentAuditController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		$scope.title = '代收审核';
		var financeManager = new MIS.FinanceAuditManager($scope, publicService.promise, MIS.FinanceAuditType.payment);
		$scope.statusList = financeManager.statusList;
		$scope.searchStatus = financeManager.searchStatus;
		$scope.financeInShowAuditBtn = MIS.access.financeInShowAuditBtn();
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};
		$scope.gridOptions = financeManager.gridOptions;

		// init grid data
		$scope.gridOptions.data=[];

		// get first page
		// financeManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});

		// paging change page function
		$scope.changePage = function(page){
			financeManager.getPage(page, $scope.myConf.itemsPerPage);
		}

		MIS.currentSelectedFinanceObj = null;
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedFinanceObj= row.entity;
			}else{
				MIS.currentSelectedFinanceObj = null;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};

		$scope.remark = '';

		var showSelectTip=function(){
			var popWindow = new MIS.Popup({
					w: 200,
					h: 115,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '请至少选择一条记录'
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '继续'
								},
								clickEvt: function(){
									popWindow.close();
								}
							}
						]
					]
				});
		}

		$scope.audit = function(){
			var finance = MIS.currentSelectedFinanceObj;
			// console.log(finance)
			if(finance == null){
				showSelectTip();
			}else{
				if(finance.financeAuditObj.reviewStatus.item.value == 2 || finance.financeAuditObj.reviewStatus.item.value == 4){
					var popWindow = new MIS.Popup({
						w: 300,
						h: 115,
						contentList:[
							[
								{
									tag: 'label',
									attr: {
										innerHTML: '无法再次审核'
									}
								}
							],
							[
								{
									tag: 'button',
									attr: {
										innerHTML: '关闭'
									},
									clickEvt: function(){
										popWindow.close();
									}
								}
							]
						]
					});
				}else{
					var popWindow = new MIS.Popup({
					w: 780,
					h: 230,
					coverCls: 'fundAuditCover',
					cls: 'fundAuditPop',
					title: {
						txt: '审核详情',
						height: '60px',
						attr: {
							class: 'fundAuditTitle',
						}
					},
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '交易日期:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: finance.financeAuditObj.transDate.value,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '交易类型:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: finance.financeAuditObj.businessType.item.value,
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '通过',
									class: 'fundAuditBtn'
								},
								clickEvt: function(){
									financeManager.doAudit(finance, 2);
									popWindow.close();
									
								}
							},
							{
								tag: 'button',
								attr: {
									class: 'fundAuditBtn',
									innerHTML: '拒绝',
									style: 'margin-left:90px',
								},
								clickEvt: function(){
									financeManager.doAudit(finance, 3);
									popWindow.close();
								}
							}
						]
					]
				},$scope,$compile);
				}
			}
		};
		$scope.auditDetails = function(){
			var finance = MIS.currentSelectedFinanceObj;
			if(finance == null){
				showSelectTip();
			}else{
				$scope.go('/role34/details');
			}
		};

		$scope.auditLog = function(){
			var finance = MIS.currentSelectedFinanceObj;
			if(finance == null){
				showSelectTip();
			}else{
				financeManager.getJournal(MIS.currentSelectedFinanceObj).then(function(auditProgress){
					auditLogFn(auditProgress);
				})
			}
			
		}

		var auditLogFn = function(auditProgress){
			var popWindow = new MIS.Popup({
				w: 506,
				h: 244,
				coverCls: 'financeAuditCover',
				cls: 'financeAuditPop1',
				title: {
					txt: '审核进度',
					height: '60px',
					attr: {
						class: 'financeAuditTitle'
					}
				},
				contentList:[
					[	
						{
							tag: 'ul',
							attr: {
								innerHTML: '<li>操作时间</li><li>操作人</li><li>操作结果</li>',
								class: 'financeAuditProgressUl1'
							}
						},
						{
							tag: 'ul',
							attr: {
								innerHTML: auditProgress,
								class: 'financeAuditProgressUl1',
								style: 'height:135px;overflow:auto;'
							}
						}
					]
				]
			});
		};
		$scope.export = function(){
			if (MIS.currentSelectedFinanceObj == null){
				showSelectTip()
			}else{
				financeManager.exportExcelOnServer(MIS.currentSelectedFinanceObj);
			}
		}
	}
]);

paymentAuditController.filter('payChannelFilter', function(){
	var list = MIS.dictData.financePayChannel;
	return function(input){
		var result = '';
		list.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
})
paymentAuditController.filter('businessTypeFilter', function(){
	var businessTypeList = MIS.dictData.financeBusinessType;
	return function (input) {
		var result = '';
		businessTypeList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
paymentAuditController.filter('reviewStatusFilter', function(){
	var reviewStatusList = MIS.dictData.financeAuditStatus;
	return function (input) {
		var result = '';
		reviewStatusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});

financeMgt.createRoute('代收审核明细', '/role34/details', 'pages/financeAuditDetails.html', 'paymentAuditDetailsController', null, true);
var paymentAuditDetailsController = financeMgt.createController('paymentAuditDetailsController', ['$scope', 'publicService',
	function ($scope, publicService) {
		$scope.title = "代收审核明细";
		$scope.paymentDetailFlag = true;
		var financeDetailManager = new MIS.FinanceDetailManager($scope, publicService.promise, MIS.FinanceAuditType.payment, MIS.currentSelectedFinanceObj);

		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		financeDetailManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			// console.log($scope.pageListData)
		});
		$scope.getValue = function(obj){
			if(obj){
				var itemValue = obj.item.value
				var result = ''
				for(var i in obj.list){
					if(itemValue == obj.list[i].value){
						result = obj.list[i].name
						break;
					}
				}
			}
			return result
		}
		// paging change page function
		$scope.changePage = function(page){
			financeDetailManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.goBack = function(){
			$scope.go('/role34');
		}
		$scope.export = function(){
			financeDetailManager.exportExcelOnServer();
		}
}])


financeMgt.createRoute('代付审核', '/role35', 'pages/financeAuditOut.html', 'withdrawAuditController');
var withdrawAuditController = financeMgt.createController('withdrawAuditController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		$scope.title = '代付审核';
		var financeManager = new MIS.FinanceAuditManager($scope, publicService.promise, MIS.FinanceAuditType.withdraw);
		$scope.statusList = financeManager.statusList;
		$scope.searchStatus = financeManager.searchStatus;

		$scope.showPayBtn = MIS.access.financeShowPayBtn();
		$scope.financeOutShowAuditBtn = MIS.access.financeOutShowAuditBtn();
		
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};
		$scope.gridOptions = financeManager.gridOptions;

		// init grid data
		$scope.gridOptions.data=[];

		// get first page
		// financeManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});

		// paging change page function
		$scope.changePage = function(page){
			financeManager.getPage(page, $scope.myConf.itemsPerPage);
		}

		MIS.currentSelectedFinanceObj = null;
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedFinanceObj= row.entity;
			}else{
				MIS.currentSelectedFinanceObj = null;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};

		$scope.remark = '';

		var showSelectTip=function(){
			var popWindow = new MIS.Popup({
					w: 200,
					h: 115,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '请至少选择一条记录'
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '继续'
								},
								clickEvt: function(){
									popWindow.close();
								}
							}
						]
					]
				});
		}

		$scope.audit = function(){
			var finance = MIS.currentSelectedFinanceObj;
			if(finance == null){
				showSelectTip();
			}else{
				if(finance.financeAuditObj.reviewStatus.item.value == 2 || finance.financeAuditObj.reviewStatus.item.value == 4){
					var popWindow = new MIS.Popup({
						w: 300,
						h: 115,
						contentList:[
							[
								{
									tag: 'label',
									attr: {
										innerHTML: '无法再次审核'
									}
								}
							],
							[
								{
									tag: 'button',
									attr: {
										innerHTML: '关闭'
									},
									clickEvt: function(){
										popWindow.close();
									}
								}
							]
						]
					});
				}else{
					var popWindow = new MIS.Popup({
					w: 780,
					h: 230,
					coverCls: 'fundAuditCover',
					cls: 'fundAuditPop',
					title: {
						txt: '审核详情',
						height: '60px',
						attr: {
							class: 'fundAuditTitle',
						}
					},
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '交易日期:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: finance.financeAuditObj.transDate.value,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '交易类型:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: finance.financeAuditObj.businessType.item.value,
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '通过',
									class: 'fundAuditBtn'
								},
								clickEvt: function(){
									financeManager.doAudit(finance, 2);
									popWindow.close();
									
								}
							},
							{
								tag: 'button',
								attr: {
									class: 'fundAuditBtn',
									innerHTML: '拒绝',
									style: 'margin-left:90px',
								},
								clickEvt: function(){
									financeManager.doAudit(finance, 3);
									popWindow.close();
								}
							}
						]
					]
				},$scope,$compile);
				}
			}
		};
		$scope.confirm = function(){
			var finance = MIS.currentSelectedFinanceObj;
			if(finance == null){
				showSelectTip();
			}else{
				if(!$scope.showPayBtn){
					// 没有打款权限
					MIS.accessPop('您没有权限');
				}
				if(finance.financeAuditObj.reviewStatus.item.value != 2){
					var popWindow = new MIS.Popup({
						w: 300,
						h: 115,
						contentList:[
							[
								{
									tag: 'label',
									attr: {
										innerHTML: '打款失败(尚未完成审核或已打款)'
									}
								}
							],
							[
								{
									tag: 'button',
									attr: {
										innerHTML: '关闭'
									},
									clickEvt: function(){
										popWindow.close();
									}
								}
							]
						]
					});
				}else{
					var popWindow = new MIS.Popup({
					w: 780,
					h: 230,
					coverCls: 'fundAuditCover',
					cls: 'fundAuditPop',
					title: {
						txt: '审核详情',
						height: '60px',
						attr: {
							class: 'fundAuditTitle',
						}
					},
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '交易日期:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: finance.financeAuditObj.transDate.value,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '交易类型:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: finance.financeAuditObj.businessType.item.value,
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '通过',
									class: 'fundAuditBtn'
								},
								clickEvt: function(){
									financeManager.withdrawConfirm(finance);
									popWindow.close();
									
								}
							},
							{
								tag: 'button',
								attr: {
									class: 'fundAuditBtn',
									innerHTML: '取消',
									style: 'margin-left:90px',
								},
								clickEvt: function(){
									popWindow.close();
								}
							}
						]
					]
				},$scope,$compile);
				}
			}
		};
		$scope.auditDetails = function(){
			var finance = MIS.currentSelectedFinanceObj;
			if(finance == null){
				showSelectTip();
			}else{
				// console.log(MIS.currentSelectedFinanceObj)
				$scope.go('/role35/details');
			}
		};

		$scope.auditLog = function(){
			var finance = MIS.currentSelectedFinanceObj;
			if(finance == null){
				showSelectTip();
			}else{
				financeManager.getJournal(MIS.currentSelectedFinanceObj).then(function(auditProgress){
					auditLogFn(auditProgress);
				})
			}
			
		}

		var auditLogFn = function(auditProgress){
			var popWindow = new MIS.Popup({
				w: 506,
				h: 244,
				coverCls: 'financeAuditCover',
				cls: 'financeAuditPop1',
				title: {
					txt: '审核进度',
					height: '60px',
					attr: {
						class: 'financeAuditTitle'
					}
				},
				contentList:[
					[	
						{
							tag: 'ul',
							attr: {
								innerHTML: '<li>操作时间</li><li>操作人</li><li>操作结果</li>',
								class: 'financeAuditProgressUl1'
							}
						},
						{
							tag: 'ul',
							attr: {
								innerHTML: auditProgress,
								class: 'financeAuditProgressUl1',
								style: 'height:135px;overflow:auto;'
							}
						}
					]
				]
			});
		};
		$scope.export = function(){
			if (MIS.currentSelectedFinanceObj == null){
				showSelectTip()
			}else{
				financeManager.exportExcelOnServer(MIS.currentSelectedFinanceObj);
			}
		}
	}
]);
withdrawAuditController.filter('businessTypeFilter', function(){
	var businessTypeList = MIS.dictData.financeBusinessType;
	return function (input) {
		var result = '';
		businessTypeList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
withdrawAuditController.filter('reviewStatusFilter', function(){
	var reviewStatusList = MIS.dictData.financeAuditStatus;
	return function (input) {
		var result = '';
		reviewStatusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});

financeMgt.createRoute('代付审核明细', '/role35/details', 'pages/financeAuditDetails.html', 'withdrawAuditDetailsController', null, true);
var withdrawAuditDetailsController = financeMgt.createController('withdrawAuditDetailsController', ['$scope', 'publicService',
	function ($scope, publicService) {
		$scope.title = "代付审核明细";
		$scope.withdrawDetailFlag = true;
		var financeDetailManager = new MIS.FinanceDetailManager($scope, publicService.promise, MIS.FinanceAuditType.withdraw, MIS.currentSelectedFinanceObj);

		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		financeDetailManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			// console.log($scope.pageListData)
		});
		$scope.getValue = function(obj){
			if(obj){
				var itemValue = obj.item.value
				var result = ''
				for(var i in obj.list){
					if(itemValue == obj.list[i].value){
						result = obj.list[i].name
						break;
					}
				}
			}
			return result
		}
		// paging change page function
		$scope.changePage = function(page){
			financeDetailManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.goBack = function(){
			$scope.go('/role35');
		}
		$scope.export = function(){
			financeDetailManager.exportExcelOnServer();
		}
}])
