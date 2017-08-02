var productManagement = new MIS._Angular('productManagement', [
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.rowEdit',
	'ui.grid.cellNav',
	'ui.grid.selection',
	'ngAnimate'])
productManagement.createRoute('产品管理', '/role11', 'pages/productManagement.html', 'productManagementController');
var productManagementController = productManagement.createController('productManagementController',[
	'$scope', '$compile', '$http', '$q', '$interval','uiGridConstants', 'publicService', '$route',
	function ($scope, $compile, $http, $q, $interval, uiGridConstants, publicService, $route) {
	// create new productManage
	var productManage = new MIS.ProductManage($scope, publicService.promise);

	$scope.showProdShelfBtn = MIS.access.showProdShelfBtn();
	$scope.showProdInvestBtn = MIS.access.showProdInvestBtn();
	$scope.showProdAuditBtn = MIS.access.showProdAuditBtn();

	// init paging
	$scope.myConf = {
		totalItems: 0,
		itemsPerPage: 10,
		currentPage:1
	};

	//listen data change
	$scope.$on('dataChange', function(event, data){
		$scope.gridOptions.data = data.currentPageList;
		$scope.myConf.totalItems = data.total * data.pageSize;
		$scope.myConf.currentPage = data.currentPage;
	});

	// get default page data
	productManage.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

	// paging change function
	$scope.changePage = function(page){
		productManage.getPage(page, $scope.myConf.itemsPerPage);
	}

	// init searchModel
	$scope.searchModel = {
		value:"0",
		searchList:[
			{name: '产品名称', value: "0", searchOption: 'prodName'},
			{name: '产品公司', value: "1", searchOption: 'prodCompanyName'},
			// {name: '产品代码', value: "2", searchOption: 'prodCode'},
			// {name: '产品状态', value: "3", searchOption: 'prodStatus'}
			{name: '风险类型', value: "2", searchOption: 'riskLevel'}
		]
	}

	// init search option of product status
	// $scope.prodStagusOptionList = MIS.dictData.prodStatusList.list;
	$scope.prodRiskLevelList = MIS.dictData.riskLevelList;

	// default search value
	$scope.searchValue = "";

	// search click function
	$scope.searchClick=function(){
		if($scope.searchValue!=''){
			var search = {};
			var searchOption = $scope.searchModel.searchList[parseInt($scope.searchModel.value)].searchOption;
			search[searchOption] = $scope.searchValue;
			productManage.setSearch(search);
		}else{
			productManage.setSearch({});
		}

		productManage.getPage(1, $scope.myConf.itemsPerPage);
	}

	// search selected change
	$scope.searchSelectedChange = function(value){
		console.log('change');
		$scope.searchValue = '';
	}

	$scope.gotoShelves= function () {
		$scope.go('/role11/shelves')
	}
	$scope.gotoEditProduct = function(){
		if(MIS.currentSelectedProduct){
			$scope.go('/role11/edit');
		}else{
			var popWindow = new MIS.Popup({
				w: 200,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '请选择要修改的产品'
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
	}
	$scope.gotoAuditProduct =function(){
		if(MIS.currentSelectedProduct){
			if(!$scope.showProdAuditBtn){
				MIS.accessPop('您没有权限');
			}
			var prod = MIS.currentSelectedProduct
			$scope.reviewComment = ""
			if(prod.productObj.review_status.item.value == 2){
				var popWindow = new MIS.Popup({
				w: 200,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '选择的产品已完成了审核'
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
			}else{
				var popWindow = new MIS.Popup({
					w: 780,
					h: 342,
					coverCls: 'misPopupCover',
					cls: 'fundAuditPop',
					title: {
						txt: '产品审核',
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
									innerHTML: prod.productObj.name.value,
								}
							}
						],
						[
							{
								tag: 'textarea',
								attr: {
									placeholder: '请输入通过/拒绝理由',
									class: 'fundAuditTextarea',
								},
								ngModel: 'reviewComment',
							}
						],
						[
							{
								tag: 'button',
								ngDisabled: 'reviewComment == ""',
								attr: {
									innerHTML: '通过',
									class: 'fundAuditBtn'
								},
								clickEvt: function(){
									// productManage.doAudit(prod, 2, $scope.reviewComment);
									productManage.passAuditWithInvest(prod, $scope.reviewComment);
									popWindow.close();
								}
							},
							{
								tag: 'button',
								ngDisabled: 'reviewComment == ""',
								attr: {
									class: 'fundAuditBtn',
									innerHTML: '拒绝',
									style: 'margin-left:90px',
								},
								clickEvt: function(){
									productManage.doAudit(prod, 3, $scope.reviewComment);
									popWindow.close();
								}
							}
						]
					]
				},$scope,$compile);
			}
		}else{
			var popWindow = new MIS.Popup({
				w: 200,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '请选择要修改的产品'
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
	}
	$scope.gotoDetail = function(){
		if(MIS.currentSelectedProduct){
			$scope.go('/role11/detail');
		}
	}
	$scope.gridOptions = {
		enableFiltering:false,
		enableSorting: false,
		enableSelectAll:false,
		multiSelect:false,
	};
	//suppressRemoveSort: true,
	$scope.gridOptions.columnDefs = [
	    // { name: 'productObj.prod_code_id', enableCellEdit: false, enableHiding:false, enableColumnMenu:false, visible:false},
	    // { name: 'productObj.issuer_name.value', displayName: 'TA编号', enableHiding:false, enableColumnMenu:false},
	    { name: 'productObj.prod_code_id.value', displayName: '产品代码', minWidth: 100, type: 'string', enableHiding:false, enableColumnMenu:false},
	    { name: 'productObj.name.value', displayName: '产品名称', enableHiding:false,  minWidth: 280,enableColumnMenu:false},
	    { name: 'productObj.raise_begin_date.value', displayName: '募集开始日期', minWidth: 100, enableHiding:false, enableColumnMenu:false},
	    { name: 'productObj.raise_end_date.value', displayName: '募集结束日期', minWidth: 100, enableHiding:false, enableColumnMenu:false},
	    // { name: 'productObj.company_name.value', displayName: '产品公司', enableHiding:false, enableColumnMenu:false,},
	    // { name: 'productObj.trustee_bank.value', displayName: '托管银行', enableHiding:false, enableColumnMenu:false,},
	    // { name: 'productObj.manager.value', displayName: '产品管理人', enableHiding:false, enableColumnMenu:false,},
	 //    { name: 'productObj.status.item.value', displayName: '产品状态',  enableHiding:false, enableColumnMenu:false,
	 //    	cellFilter:'statusFilter',
		// },
		// { name: 'productObj.risk_level.item.value', displayName: '风险类型',  enableHiding:false, enableColumnMenu:false,
	 //    	cellFilter:'riskLevelFilter',
		// },
	    // { name: 'productObj.type.item.value', displayName:'产品类型', cellFilter:'typeFilter', enableHiding:false, enableColumnMenu:false, },
	    { name: 'productObj.assess_level.item.value', displayName:'评估等级', minWidth: 100,cellFilter:'assessLevelFilter', enableHiding:false, enableColumnMenu:false, },
	    { name: 'productObj.review_status.item.value', displayName:'审核状态', minWidth: 100,cellFilter:'reviewStatusFilter', enableHiding:false, enableColumnMenu:false, },
  	];
	$scope.selectRow = function(row){
		if(row.isSelected){
			MIS.currentSelectedProduct = row.entity;
		}else{
			MIS.currentSelectedProduct = null;
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

	//设置-修改活动规则
	var investManager = new MIS.InvestManager($scope, publicService.promise);
	$scope.gotoInvest = function(){
		if(MIS.currentSelectedProduct){
			// open loading
			var popWindow = new MIS.Popup({
					loadingTxt: 'Loading'
				});
			investManager.getInvest(MIS.currentSelectedProduct.productObj.prod_code_id.value,
				function(dataList){
					popWindow.close();
					// get invest success
					var len = dataList.length;
					if(len > 0){
						// edit
						var invest = new MIS.Invest();
						invest.randerResponseData(dataList[0]);
						MIS.currentSelectedProduct.invest = invest;
						$scope.go('/role11/updateInvest');
					}else{
						// create
						MIS.currentSelectedProduct.invest = new MIS.Invest();
						MIS.currentSelectedProduct.invest.initCreate(MIS.currentSelectedProduct.productObj.prod_code_id.value, MIS.currentSelectedProduct.productObj.name.value);
						$scope.go('/role11/createInvest');
					}
					
				}, function(){
					// get invest failed
				})
		}else{
			MIS.selectPop()
		}
	}

	//查看投资记录
	$scope.showInvestList = function(){
		if(!MIS.currentSelectedProduct){
			MIS.selectPop()
			return
		}
		var prodCodeId = MIS.currentSelectedProduct.productObj.prod_code_id.value;
		$scope.go('/role11/investList/product/' + prodCodeId);
	}
}]);

productManagementController.filter('statusFilter', function(){
	var statusList = MIS.dictData.prodStatusList.list;
	return function (input) {
		var result = '';
		statusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
productManagementController.filter('typeFilter', function(){
	var typeList = MIS.dictData.prodTypeList;
	return function (input) {
		var result = '';
		typeList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
productManagementController.filter('riskLevelFilter', function(){
	var riskList =  MIS.dictData.riskLevelList;
	return function (input) {
		var result = '';
		riskList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
})

productManagementController.filter('assessLevelFilter', function(){
	var riskList =  MIS.dictData.assessLevel;
	return function (input) {
		var result = '';
		riskList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
})

productManagementController.filter('reviewStatusFilter', function(){
	var riskList =  MIS.dictData.reviewStatus;
	return function (input) {
		var result = '';
		riskList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
})
productManagement.createRoute('产品编辑', '/role11/edit', 'pages/productShelves.html', 'productEditController', null, true);
var productShelvesController = productManagement.createController('productEditController', [
	'$scope', 'publicService', 
	function($scope, publicService){
		$scope.divFlag = 0;
		$scope.preBtn = 1;
		$scope.nextBtn = 0;
		var divInfo = [
			'产品信息',
			// '产品开发设计',
			// '产品销售控制',
			// '产品销售控制',
			// '控制串',
			'产品详情',
			'产品费率'
		  ];
		$scope.disabledProductEdit = MIS.access.disabledProductEdit();
		$scope.pageTitle = "产品修改";
		$scope.divFlag = 0;
		$scope.pageSubtitle = divInfo[$scope.divFlag];
		$scope.preContent = function(){
			$scope.divFlag --;
			$scope.pageSubtitle = divInfo[$scope.divFlag];
			if($scope.divFlag <=0){
				$scope.preBtn = 1;
				$scope.nextBtn = 0;
			}else{
				$scope.preBtn = 0;
				$scope.nextBtn = 0;
			}
		};
		$scope.nextContent = function(){
			$scope.divFlag ++;
            $scope.pageSubtitle = divInfo[$scope.divFlag];
			if($scope.divFlag >=2){
				$scope.pageSubtitle = divInfo[$scope.divFlag];
				$scope.preBtn = 0;
				$scope.nextBtn = 1;
			}else{
				$scope.preBtn = 0;
				$scope.nextBtn = 0;
			}
		};
		$scope.checkItem = function(obj){
			var result = product.validate(obj);
			obj.errorFlag = !result;
			return result;
		};

		$scope.createDetail = function(){
			var productDetail = new MIS.ProductDetail(publicService.promise);
			return productDetail
		}
		
		var product = MIS.currentSelectedProduct;
		// console.log(product)
		$scope.productModel = product.productObj;
		$scope.productDetailList = []; // details
		product.productObj.details.forEach(function(detailObj){
			var detail = new MIS.ProductDetail(publicService.promise);
			detail.randerResponseObj(detailObj);
			$scope.productDetailList.push(detail);
		})
		if($scope.productDetailList.length <= 0){
			var defaultDetail = $scope.createDetail();
			$scope.productDetailList.push(defaultDetail);
		}

		var productShelves = new MIS.ProductShelves($scope, publicService.promise, product);
		$scope.fareModel = new MIS.ProductFare();
		$scope.fareContent = "";
		$scope.setRatio = function(){
			$scope.fareInputFlag = true;
			$scope.myFareType = $scope.fareModel.fareMethod.value();
			if($scope.fareModel.fareMethod.value() != '1'){
				$scope.fareContentUnit = '%';
			}else if($scope.fareModel.fareMethod.value() == '1'){
				$scope.fareContentUnit = '元';
			}
		}
		$scope.fareContentRegFlag = false;
		$scope.checkFareValue = function(){
			if($scope.fareContentUnit == '%'){
				if(/^\d+(\.\d+)*$/.test($scope.fareContent)){
					$scope.fareContentRegFlag = true;
				}else{
					$scope.fareContentRegFlag = false;
				}
			}else if($scope.fareContentUnit == '元'){
				if(/^\d+(\.\d+)*$/.test($scope.fareContent)){
					$scope.fareContentRegFlag = true;
				}else{
					$scope.fareContentRegFlag = false;
				}
			}
		}
		$scope.duplicateFareList = [];
		$scope.showDuplicateFare = function(fare){
			var hasDuclicate = 'false';
			$scope.duplicateFareList.forEach(function(item){
				if(item === fare){
					hasDuclicate = 'true'
				}
			})
			return hasDuclicate;
		};
		
		$scope.addFare = function(){
			if($scope.fareContentRegFlag == false){
				var popWindow = new MIS.Popup({
					w: 150,
					h: 115,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '产品费率输入有误'
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '继续检查'
								},
								clickEvt: function(){
									popWindow.close();
								}
							}
						]
					]
				});
			}else{
				$scope.fareModel.fareRatio = "";
				$scope.fareModel.fixedFare = "";
				if($scope.myFareType == '0' || $scope.myFareType == '2'){
					$scope.fareModel.fareRatio = $scope.fareContent
				}else if($scope.myFareType == '1'){
					$scope.fareModel.fixedFare = $scope.fareContent
				}
				product.addFare($scope.fareModel.randerRequestData());
				$scope.duplicateFareList = product.checkDuplicateFare();
			}
		}
		$scope.removeFare = function(index){
			product.removeFare(index);
			$scope.duplicateFareList = product.checkDuplicateFare();
		}


		$scope.showError = function(obj){
			if(obj.hasOwnProperty('errorFlag')){
				return !obj.errorFlag;
			}else{
				return true
			}
		};
		$scope.editDisable = true;
		var shelfSuccessFn=function(msg){
			var msg = msg || '产品修改成功';
			var popWindow = new MIS.Popup({
				w: 200,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: msg
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '返回'
							},
							clickEvt: function(){
								MIS.currentSelectedProduct = null;
								popWindow.close();
								$scope.go('/role11');
								$scope.$apply();
							}
						}
					]
				]
			});
		};
		var shelfFailedFn=function(){
			//popup
			MIS.Popup.close();
			var popWindow = new MIS.Popup({
				w: 200,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '产品修改失败'
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '继续检查'
							},
							clickEvt: function(){
								popWindow.close();
							}
						}
					]
				]
			});
		};
		var checkFailed=function(){
			//popup
			var msg = productShelves.errTip
			var windowWidth = msg.length*12 + 24;
			var popWindow = new MIS.Popup({
				w: windowWidth + 50,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: msg
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '继续检查'
							},
							clickEvt: function(){
								popWindow.close();
							}
						}
					]
				]
			});
			
		};
		$scope.submit = function(){
			var popWindow = new MIS.Popup({
					loadingTxt: 'Loading'
				});
			if(MIS.currentSelectedProduct.productObj.review_status.item.value == 2){
				var issuedAt = productShelves.product.productObj.issuedAt.value;
				var prodCodeId = productShelves.product.productObj.prod_code_id.value;
				productShelves.updateIssuedAt(prodCodeId, issuedAt,shelfSuccessFn, shelfFailedFn, checkFailed)
			}else{
				var detailList = [];
				$scope.productDetailList.forEach(function(detail){
					if(detail.prodInfo){// if prodInfo != '' , then add to product
						detailList.push(detail.randerRequestData());
					}
				});
				productShelves.product.productObj.details = detailList;
				productShelves.saveEditedProduct(shelfSuccessFn, shelfFailedFn, checkFailed);
			}
		}
		$scope.cancel = function(){
			MIS.currentSelectedProduct = null;
			$scope.go('/role11');
		}


		//For product detail page
		$scope.show = function(){
			console.log($scope.myConf)
		}
		$scope.myConf =	[{	
			title: '标签',
			actived: false,
			titleInput: 'aaa',
			descInput: 'bbb'
		}]


		$scope.showProdName=function(e){
			var clientX = e.clientX;
			var clientY = e.clientY;
			var text = e.currentTarget.value;
			MIS.Util.showText(clientX, clientY, text);
		}
		$scope.hideProdName=function(){
			MIS.Util.hideText();
		}
	}]);


MIS.ProductManage = MIS.derive(null, {
	create: function($scope, publicPromise){
		this.promise = publicPromise;
		this.scope = $scope;
		this.productList = [];
		this.currentPageList = [];//TODO: list page model
		this.total = 0;
		this.pageSize = 10;//default
		this.currentPage = 1;//default
		this.catch = true;//default
		this.searchStr = '';
	},
	catchPageList:function(page, pageListData){
		this.productList[page-1] = pageListData;
	},
	setSearch: function(search){
		var str = '';
		if(search['asc']) str = MIS.Util.stringFormat('{0}&asc={1}', [str, search['asc']]);
		if(search['prodName']) str = MIS.Util.stringFormat('{0}&prodName={1}', [str, search['prodName']]);
		if(search['prodCompanyName']) str = MIS.Util.stringFormat('{0}&prodCompanyName={1}', [str, search['prodCompanyName']]);
		// if(search['prodCode']) str = MIS.Util.stringFormat('{0}&prodCode={1}', [str, search['prodCode']]);
		// if(search['prodStatus']) str = MIS.Util.stringFormat('{0}&prodStatus={1}', [str, search['prodStatus']]);
		if(search['riskLevel']) str = MIS.Util.stringFormat('{0}&prodRiskLevel={1}', [str, search['riskLevel']]);
		this.searchStr = str;
	},
	randerProductList: function(responseData){
		var len = responseData.length;
		var listData = [];
		if(len > 0){
			for(var i=0;i<len;i++){
				var item = responseData[i];
				var obj = new MIS.Product()
				obj.renderServerObjToProduct(item);
				listData.push(obj);
			}
		}
		return listData;
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
		if(this.catch){
			this.catchPageList(page, pageData);
		}
	},
	getPage: function(page, pageSize, search){
		this.currentPage = page;
		this.pageSize = pageSize;
		var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
		if(this.searchStr != ''){
			searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr])
		}
		var urlStr = '{0}/{1}?' + searchStr;
		this.getProductList(urlStr);
	},
	refresh: function(){
		this.getPage(this.currentPage, this.pageSize);
	},
	getProductList:function(urlStr){
		var that = this;
		this.promise({
			serverName: 'mgtProductService',
			apiName:'productCode',
			method:'get',
			urlStr: urlStr
		}).then(function(response){
			//success
			if(response.data['error'] != 0){
				var errorMsg = MIS.Config.errorMessage(response.data['error']);
				MIS.failedFn(errorMsg);
				return
			} 
			var paging = response.data['paging'];
			var page = paging['page'];
			var total = paging['total'];
			var pageSize = paging['pageSize'];
			var pageData = that.randerProductList(response.data['data']);
			that.setPage(page, total, pageSize, pageData);
		}, function(failed){
			//failed
			console.log('Get product list failed.')
		});
	},
    doAudit: function(obj, reviewStatus, reviewComment){
    	var that = this;
    	var prodData = obj;
    	var requestData = '{"reviewStatus": "' + reviewStatus + '", "reviewComment": "' + reviewComment + '"}'
    	urlStr = "{0}/{1}/" + obj.productObj.prod_code_id.value + "/review"
    	this.promise({
    		serverName: "mgtProductService",
    		apiName: "productCode",
    		method: "post",
    		urlStr: urlStr,
    		data: requestData
    	}).then(function(response){
    		var errorCode = response.data['error'];
    		if(errorCode == 0){
    			console.log(response.data)
    			// successFn();
    			that.refresh();
    		}else{
    			console.log(response.data)
    			// failedFn();
    			that.refresh();
    		}
    	})
    },
    passAuditWithInvest: function(prod, reviewComment){
    	var that = this;
    	var reviewStatus = 2; //review status
    	var investManager = new MIS.InvestManager(this.scope, this.promise);
    	// 激活活动
		// open loading
		var popWindow = new MIS.Popup({
				loadingTxt: 'Loading'
			});
		investManager.getInvest(MIS.currentSelectedProduct.productObj.prod_code_id.value,
			function(dataList){
				// get invest success
				var len = dataList.length;
				if(len > 0){
					// edit
					var invest = new MIS.Invest();
					invest.randerResponseData(dataList[0]);
					// active invest
					that.activeInvest(invest.investObj.pointInvestRuleId, true, function(){
						that.doAudit(prod, 2, reviewComment);
					}, function(){});
				}else{
					// no invest
					that.doAudit(prod, 2, reviewComment);
				}
				
			}, function(){
				// get invest failed
			})
		
	},
	activeInvest: function(investId, flag, success, failed){
			var that = this;
			var apiName = 'product_invest_active';
			var urlStr = '{0}/{1}/?enableFlag=' + flag;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				urlStr: urlStr,
				apiParam: [investId]
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				success(response.data['data']);
			}, function(){
				console.log('change enableFlag failed');
				failed();
			});
		}
}, {});


	