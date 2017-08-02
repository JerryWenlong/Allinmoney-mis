var fundAudit = new MIS._Angular('fundAudit', []);


fundAudit.createRoute('资金转出审核', '/role51', 'pages/fundAuditOut.html', 'fundOutAuditController');
var fundOutAuditController = fundAudit.createController('fundOutAuditController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		$scope.title = '资金转出审核汇总';
		var fundManager = new MIS.FundManager($scope, publicService.promise, MIS.FundType.Out);
		// $scope.statusList = fundManager.statusList;
		// $scope.searchStatus = fundManager.searchStatus;

		$scope.searchProdName = '';

		$scope.search = function(){
			fundManager.searchProdName = $scope.searchProdName;
			//validate str
			fundManager.getPage(1, 10);
		}
		
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};
		$scope.gridOptions = fundManager.gridOptions;

		// init grid data
		$scope.gridOptions.data=[];

		// get first page
		fundManager.getPage(1, 10);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});

		// paging change page function
		$scope.changePage = function(page){
			fundManager.getPage(page, $scope.myConf.itemsPerPage);
		}

		MIS.currentSelectedFundOut = null;
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedFundOut= row.entity.fundObj;
			}else{
				MIS.currentSelectedFundOut = null;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};

		$scope.remark = '';

		$scope.auditDetails = function(){
			var fund = MIS.currentSelectedFundOut;
			if(fund == null){
				MIS.selectPop();
			}else{
				$scope.go('/role51/details/' + fund.settleSumId);
			}
		};

		$scope.export = function(){
			if(MIS.currentSelectedFundOut){
				fundManager.exportExcelOnServer(MIS.currentSelectedFundOut.settleSumId);
			}else{
				MIS.selectPop();
			}
		}
	}
]);


fundOutAuditController.filter('fundStatusFilter', function(){
	var fundStatusList = MIS.dictData.fundStatusList;
	return function (input) {
		var result = '';
		fundStatusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
fundOutAuditController.filter('interestTypeFilter', function(){
	var list = MIS.dictData.interestType;
	return function(input){
		var result = '';
		list.forEach(function(item){
			if(item.value.toString() == input){
				result = item.name;
			}
		});
		return result;
	}
})

fundAudit.createRoute('资金转出审核明细', '/role51/details/:settleSumId', 'pages/fundAuditDetails.html', 'fundOutAuditDetailsController', null, true);
var fundOutAuditDetailsController = fundAudit.createController('fundOutAuditDetailsController', ['$scope', 'publicService', '$routeParams',
	function ($scope, publicService, $routeParams) {
		$scope.title = "资金转出审核明细";
		$scope.fundOutDetailFlag = true;
		var settleSumId = $routeParams.settleSumId;
		if(typeof(settleSumId) == 'undefined'){
			$scope.go('/');
		}
		var fundDetailManager = new MIS.FundDetailManager($scope, publicService.promise, MIS.FundType.Out, settleSumId);

		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		fundDetailManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
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
			fundDetailManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.goBack = function(){
			$scope.go('/role51');
		}
		$scope.export = function(){
			fundDetailManager.exportExcelOnServer();
		}
}])


fundAudit.createRoute('资金转入审核', '/role52', 'pages/fundAuditIn.html', 'fundInAuditController');
var fundInAuditController = fundAudit.createController('fundInAuditController',  ['$scope','$compile','publicService',
	function ($scope,$compile, publicService) {
		$scope.title = '资金转入审核汇总';
		MIS.currentFundInInstallment = null;
		var fundManager = new MIS.FundManager($scope, publicService.promise, MIS.FundType.In);
		// $scope.statusList = fundManager.statusList;
		$scope.searchProdName = '';

		// $scope.showAuditBtn = MIS.access.showFundInAuditBtn();

		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};
		$scope.gridOptions = fundManager.gridOptions;

		// init grid data
		$scope.gridOptions.data=[];
		
		var saveTempData = function(data){
			MIS.TempData.fundInAudit = data;
		}

		$scope.search = function(){
			fundManager.searchProdName = $scope.searchProdName;
			//validate str
			fundManager.getPage(1, 10);
		}

		// get first page
		// fundManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			saveTempData(data);
		});

		if(MIS.TempData.fundInAudit){
			$scope.$emit('dataChange', MIS.TempData.fundInAudit)
		}else{
			fundManager.getPage(1, 10);
		}
		// paging change page function
		$scope.changePage = function(page){
			fundManager.getPage(page, $scope.myConf.itemsPerPage);
		}



		$scope.disabledAuditBtn = true;
		MIS.currentSelectedFund = null;
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedFund= row.entity;
				// $scope.disabledAuditBtn = MIS.access.disabledFundInAuditBtn(MIS.currentSelectedFund.fundObj.reviewStatus);
			}else{
				MIS.currentSelectedFund = null;
				// $scope.disabledAuditBtn = true;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};

		$scope.remark = '';

		

		$scope.audit = function(){
			var fund = MIS.currentSelectedFund;
			if(fund == null){
				MIS.selectPop();
			}else{
				// check if has installment 如果是分期产品 到分期列表页
				if(fund.isInstallment()){
					// $scope.go('/role52/installment/' + fund.fundObj.reportSummaryInId.value + '/' +fund.fundObj.prodName.value + '/' + fund.fundObj.prodCompany.value);
					MIS.currentFundInInstallment= {
						installments: fund.fundObj.installments,
						reportSummaryInId: fund.fundObj.reportSummaryInId.value,
						prodName: fund.fundObj.prodName.value,
						prodCompany: fund.fundObj.prodCompany.value
					};
					$scope.go('/role52/installment');
					
					return 
				}
				//check access
				if($scope.disabledAuditBtn || !$scope.showAuditBtn){
					MIS.accessPop('没有权限');
				}
				
				$scope.remark = '';
				var popWindow = new MIS.Popup({
					w: 780,
					h: 440,
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
									innerHTML: '产品名称:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: fund.fundObj.prodName.value,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: 'SPV/TA公司名称:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: fund.fundObj.prodCompany.value,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '客户投资金额:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: fund.fundObj.payAmount.value,
								}
							}
						],
						[
							{
								tag: 'textarea',
								attr: {
									placeholder: '请输入拒绝理由',
									class: 'fundAuditTextarea',
								},
								ngModel: 'remark',
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
									fundManager.doAudit(fund, 0, $scope.remark);
									popWindow.close();
									
								}
							},
							{
								tag: 'button',
								ngDisabled: 'remark == ""',
								attr: {
									class: 'fundAuditBtn',
									innerHTML: '拒绝',
									style: 'margin-left:90px',
								},
								clickEvt: function(){
									fundManager.doAudit(fund, 1, $scope.remark);
									popWindow.close();
								}
							}
						]
					]
				},$scope,$compile);
			}
		};
		$scope.auditDetails = function(){
			var fund = MIS.currentSelectedFund;
			if(fund == null){
				MIS.selectPop();
			}else{
				// // check if has installment 如果是分期产品 到分期列表页
				// if(fund.isInstallment()){
					// $scope.go('/role52/installment/' + fund.fundObj.reportSummaryInId.value + '/' +fund.fundObj.prodName.value + '/' + fund.fundObj.prodCompany.value);
					MIS.currentFundInInstallment= {
						settleSumId: fund.fundObj.settleSumId,
						prodName: fund.fundObj.prodName,
						prodCompanyName: fund.fundObj.prodCompanyName
					};
					$scope.go('/role52/installment');
					
					// return 
				// }
				// // check if has installment 如果是分期产品 到分期列表页
				// $scope.go('/role52/details');
			}
		};

		$scope.auditLog = function(){
			var fund = MIS.currentSelectedFund;
			if(fund == null){
				MIS.selectPop();
			}else{
				fundManager.getJournal(MIS.currentSelectedFund).then(function(auditProgress){
					auditLogFn(auditProgress);
				})
			}
			
		}

		var auditLogFn = function(auditProgress){
			var popWindow = new MIS.Popup({
				w: 506,
				h: 244,
				coverCls: 'fundAuditCover',
				cls: 'fundAuditPop1',
				title: {
					txt: '审核进度',
					height: '60px',
					attr: {
						class: 'fundAuditTitle'
					}
				},
				contentList:[
					[	
						{
							tag: 'ul',
							attr: {
								innerHTML: '<li>操作时间</li><li>操作人</li><li>操作结果</li>',
								class: 'fundAuditProgressUl1'
							}
						},
						{
							tag: 'ul',
							attr: {
								innerHTML: auditProgress,
								class: 'fundAuditProgressUl1',
								style: 'height:135px;overflow:auto;'
							}
						}
					]
				]
			});
		};
		$scope.export = function(){
			fundManager.exportExcelOnServer();
		}
	//Controller end
	}
])
fundInAuditController.filter('fundInStatusFilter', function(){
	var fundStatusList = MIS.dictData.fundInStatusList;
	return function (input) {
		var result = '';
		fundStatusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
fundInAuditController.filter('feeTypeFilter', function(){
	var feeTypeList = MIS.dictData.feeTypeList;
	return function (input) {
		var result = '';
		feeTypeList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
// fundAudit.createRoute('资金转入审核明细', '/role52/details', 'pages/fundAuditDetails.html', 'fundInAuditDetailsController', null , true);
fundAudit.createRoute('资金转入审核明细', '/role52/details/:dividedId', 'pages/fundAuditDetails.html', 'fundInAuditDetailsController', null , true);
var fundInAuditDetailsController = fundAudit.createController('fundInAuditDetailsController', ['$scope', 'publicService','$routeParams',
	function ($scope, publicService, $routeParams) {
		$scope.title = "资金转入审核明细";
		$scope.fundInDetailFlag = true;

		if(typeof($routeParams.dividedId) == 'undefined'){
			// 
			$scope.go('/');
		}
		
		$scope.goBack = function(){
			$scope.go('/role52/installment')
		}

		var fundDetailManager = new MIS.FundDetailManager($scope, publicService.promise, MIS.FundType.In, $routeParams.dividedId);

		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};

		// get first page
		fundDetailManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
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
			fundDetailManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.export = function(){
			fundDetailManager.exportExcelOnServer();
		}
}])

fundAudit.createRoute('资金转入分期', '/role52/installment', 'pages/fundInstallment.html', 'fundInstallmentController', null, true);
// fundAudit.createRoute('资金转入分期', '/role52/installment/:summaryId/:prodName/:prodCompany', 'pages/fundInstallment.html', 'fundInstallmentController', null, true);
var fundInstallmentController = fundAudit.createController('fundInstallmentController', ['$scope', 'publicService', '$routeParams', '$compile',
	function($scope, publicService, $routeParams, $compile){

		$scope.showAuditBtn = MIS.access.showFundInAuditBtn();

		var prodName = $scope.prodName = MIS.currentFundInInstallment.prodName; //check prodId?
		var prodCompany = $scope.prodCompany = MIS.currentFundInInstallment.prodCompanyName;
		var summaryId = MIS.currentFundInInstallment.settleSumId;

		// var data = MIS.currentFundInInstallment.installments;

		var manager = new MIS.FundInstallmentManager($scope, publicService.promise, summaryId);
		
		$scope.gridOptions = manager.gridOptions;

		// init grid data
		$scope.gridOptions.data=[];

		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
		});

		// get first page
		// manager.getPage();
		

		// back
		$scope.goBack = function(){
			$scope.go('/role52');
		}

		// refresh
		$scope.refresh = function(){
			manager.getPage();
		}


		var fundManager = new MIS.FundManager($scope, publicService.promise, MIS.FundType.In);
		$scope.audit = function(){
			if(currentSelect == null){
				MIS.selectPop();
			}else{
				//check access
				if($scope.disabledAuditBtn || !$scope.showAuditBtn){
					MIS.accessPop('没有权限');
				}
				
				$scope.remark = '';
				var popWindow = new MIS.Popup({
					w: 780,
					h: 440,
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
									innerHTML: '产品名称:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: currentSelect.prodName,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: 'SPV/TA公司名称:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: currentSelect.prodCompanyName,
								}
							}
						],
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '客户投资金额:',
								}
							},
							{
								tag: 'label',
								attr: {
									innerHTML: currentSelect.externalEntrust,
								}
							}
						],
						// [
						// 	{
						// 		tag: 'textarea',
						// 		attr: {
						// 			placeholder: '请输入拒绝理由',
						// 			class: 'fundAuditTextarea',
						// 		},
						// 		ngModel: 'remark',
						// 	}
						// ],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '通过',
									class: 'fundAuditBtn'
								},
								clickEvt: function(){
									fundManager.doAudit(currentSelect.settleDivideId, $scope.refresh, true);
									popWindow.close();
									
								}
							},
							{
								tag: 'button',
								// ngDisabled: 'remark == ""',
								attr: {
									class: 'fundAuditBtn',
									innerHTML: '取消',
									style: 'margin-left:90px',
								},
								clickEvt: function(){
									// fundManager.doAudit(fund, 1, $scope.remark, $scope.refresh, true);
									popWindow.close();
								}
							}
						]
					]
				},$scope,$compile);
			}
		};


		var currentSelect = null;
		$scope.selectRow = function(row){
			if(row.isSelected){
				currentSelect = row.entity.installmentObj;
				$scope.disabledAuditBtn = MIS.access.disabledFundInAuditBtn(currentSelect.reviewStatus);
			}else{
				currentSelect = null;
				$scope.disabledAuditBtn = true;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};
		$scope.auditDetails = function(){
			if(currentSelect == null){
				MIS.selectPop();
			}else{
				$scope.go('/role52/details/' + currentSelect.settleDivideId);
			}
		};
	}
])