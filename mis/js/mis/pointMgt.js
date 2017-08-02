// 用户积分查询
var pointMgt = new MIS._Angular('pointMgt', []);
pointMgt.createRoute('积分获得查询', '/role_11_1', 'pages/pointSearchGet.html', 'pointSearchGetController');
var pointSearchGetController = pointMgt.createController('pointSearchGetController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		//
		var manager = new MIS.PointManager($scope, publicService.promise, 1);
		//init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.gridOptions = manager.gridOptions;
		//listen data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		// manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// paging change function
		$scope.changePage = function(page){
			loading.popup();
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}

		$scope.searchValue = '';
		$scope.search = function(){
			//clear advanced search
			manager.clearSearchDetail();
			manager.setSearch({searchValue: $scope.searchValue}, 'simple')
			//loading
			loading.popup();
			manager.getPage(1,$scope.myConf.itemsPerPage);
		}

		$scope.advanceQueryObj = manager.searchDetailObj;
		$scope.advanceQueryObj.errorMsg = '';
		$scope.advanceQuery = function(){
			// clear simple search value
			manager.searchStr = '';
			$scope.searchValue = '';
			var advancedSearchPop = new MIS.Popup({
				w: 374,
				h: 340,
				coverCls: 'misPopupCover',
				cls: 'financeMgtPop',
				title: {
					titleDivCls: 'financeMgtTtileObj',
					class: 'financeMgtWithdrawPopupHeader'
				},
				contentList: [
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '活动名称',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.changeByTitle',
							attr: {
								type: 'text'
							}
						}
					],
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
							ngModel: 'advanceQueryObj.accountName',
							attr: {
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '获得时间',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.date_from.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.date_from',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'pointGetSearch_from'
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
							ngModel: 'advanceQueryObj.date_to.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.date_to',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'pointGetSearch_to'
							},
							attr: {
								class: 'orderMgtPopInput3',
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;margin-right:28px;',
								type: 'text',
								placeholder: '结束时间'
							}
						},
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '查询',
								class: 'popupBtn1 financeMgtBtn'
							},
							clickEvt: function(){
								beginTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.date_from.value)
								endTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.date_to.value)
								if(beginTimestamp > endTimestamp){
									$scope.advanceQueryObj.errorMsg = '开始时间应早于结束时间'
									$scope.$apply()
								}else{
									manager.getSearchDetail();
									manager.getPage(1,$scope.myConf.itemsPerPage);
									advancedSearchPop.close();
									loading.popup();
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
								manager.clearSearchDetail();
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
			}, $scope, $compile)
		}
	}
])

// 用户使用积分查询
pointMgt.createRoute('积分使用查询', '/role_11_2', 'pages/pointSearchUse.html', 'pointSearchUseController');
var pointSearchUseController = pointMgt.createController('pointSearchUseController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		//
		var manager = new MIS.PointManager($scope, publicService.promise, 2);
		//init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.gridOptions = manager.gridOptions;
		//listen data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		// paging change function
		$scope.changePage = function(page){
			loading.popup();
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}

		$scope.searchValue = '';
		$scope.search = function(){
			//clear advanced search
			manager.clearSearchDetail();
			manager.setSearch({searchValue: $scope.searchValue}, 'simple')
			//loading
			loading.popup();
			manager.getPage(1,$scope.myConf.itemsPerPage);
		};

		$scope.advanceQueryObj = manager.searchDetailObj;
		$scope.advanceQueryObj.errorMsg = '';
		$scope.advanceQuery = function(){
			// clear simple search value
			manager.searchStr = '';
			$scope.searchValue = '';
			var advancedSearchPop = new MIS.Popup({
				w: 374,
				h: 340,
				coverCls: 'misPopupCover',
				cls: 'financeMgtPop',
				title: {
					titleDivCls: 'financeMgtTtileObj',
					class: 'financeMgtWithdrawPopupHeader'
				},
				contentList: [
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '活动名称',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.changeByTitle',
							attr: {
								type: 'text'
							}
						}
					],
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
							ngModel: 'advanceQueryObj.accountName',
							attr: {
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '获得时间',
							}
						},
						{
							tag: 'input',
							ngModel: 'advanceQueryObj.date_from.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.date_from',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'pointGetSearch_from'
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
							ngModel: 'advanceQueryObj.date_to.value',
							datetime: {
								datetimeModel: 'advanceQueryObj.date_to',
								datetimeValue: 'value',
								hasTime: true,
								datetimeId: 'pointGetSearch_to'
							},
							attr: {
								class: 'orderMgtPopInput3',
								style: 'width:92px;margin-right:10px;font-size:12px;padding-right:24px;margin-right:28px;',
								type: 'text',
								placeholder: '结束时间'
							}
						},
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '查询',
								class: 'popupBtn1 financeMgtBtn'
							},
							clickEvt: function(){
								beginTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.date_from.value)
								endTimestamp = MIS.Util.strToTimestamp($scope.advanceQueryObj.date_to.value)
								if(beginTimestamp > endTimestamp){
									$scope.advanceQueryObj.errorMsg = '开始时间应早于结束时间'
									$scope.$apply()
								}else{
									manager.getSearchDetail();
									manager.getPage(1,$scope.myConf.itemsPerPage);
									advancedSearchPop.close();
									loading.popup();
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
								manager.clearSearchDetail();
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
			}, $scope, $compile)
		}
	}
])

// 用户持有积分查询
pointMgt.createRoute('积分持有查询', '/role_11_3', 'pages/pointSearchAvailable.html', 'pointSearchAvailableController');
var pointSearchAvailableController = pointMgt.createController('pointSearchAvailableController', ['$scope', '$compile', 'publicService', 
	function($scope, $compile, publicService){
		//
		var manager = new MIS.PointManager($scope, publicService.promise, 3);
		//init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.gridOptions = manager.gridOptions;
		//listen data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		// manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// paging change function
		$scope.changePage = function(page){
			loading.popup();
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}

		$scope.searchValue = '';
		$scope.search = function(){
			//clear advanced search
			manager.clearSearchDetail();
			manager.setSearch({keyword: $scope.searchValue})
			//loading
			loading.popup();
			manager.getPage(1,$scope.myConf.itemsPerPage);
		}

		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedAccountPoint = row.entity;
			}else{
				MIS.currentSelectedAccountPoint = null;
				console.log('clear select');
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
			$scope.gridApi = gridApi;
			// gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
			// gridApi.selection.on.rowSelectionChangedBatch($scope, $scope.selectRowBatch);
			// gridApi.core.on.filterChanged($scope, $scope.filterChanged);
		};

		$scope.detail = function(){
			if(MIS.currentSelectedAccountPoint)
				$scope.go('/role_11_3/detail')
		}
	}
]);

// 用户积分明细
pointMgt.createRoute('积分明细', '/role_11_3/detail', 'pages/pointDetail.html', 'pointDetailController', null, true);
var pointDetailController = pointMgt.createController('pointDetailController', ['$scope', '$compile', 'publicService', 
	function($scope, $compile, publicService){
		//
		var accountId = MIS.currentSelectedAccountPoint.self.accountId;
		var manager = new MIS.PointDetailManager($scope, publicService.promise, accountId);
		//init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.gridOptions = manager.gridOptions;
		//listen data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// paging change function
		$scope.changePage = function(page){
			loading.popup();
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}

		$scope.searchDetailObj = manager.searchDetailObj;
		$scope.search = function(){
			manager.getSearchDetail();
			//loading
			loading.popup();
			manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
		}

		$scope.typeChange = function(){
			manager.getSearchDetail();
			//loading
			loading.popup();
			manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
		}

	}
]);
