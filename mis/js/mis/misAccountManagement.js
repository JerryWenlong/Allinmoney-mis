var misAccountManagement = new MIS._Angular('misAccountManagement', []);
misAccountManagement.createService('getAccountService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope){
	return {
		getRoleList: function(){
			var d = $q.defer();
			var url = MIS.Util.getApiUrl('userService', 'role');
			$http({
				method: 'get',
				url: url,
			}).then(function(response){
				d.resolve(response.data);
			}, function(error){
				d.reject(error);
			});
			return d.promise
		},
		hasSelectAccount: function () {
			var d = $q.defer();
			if(MIS.currentSelectedAccount == null){
				$rootScope.go('/sysrole11');
				d.reject();
			}else{
				d.resolve();
			}
			return d.promise
		}
	}
	
}])
var resolve = {
	roleList: ['getAccountService', function(getAccountService){
		return getAccountService.getRoleList().then(function(data){
			var result = [];
			var len = data['data'].length;
			for(var i=0;i<len;i++){
				var obj = {};
				obj.name = data['data'][i].description;
				obj.value = data['data'][i].roleId;
				if(obj.value >= 8 && obj.value <= 12)// only list 9 10 11 12
					result.push(obj);
			}
			MIS.dictData.roleList = result
		},function(){
			//error
			console.log('get role list failed!!');
		})
	}]
}
var accEditResolve = {
	hasSelectAccount: ['getAccountService', function(getAccountService){
			return getAccountService.hasSelectAccount();
	}]
}
misAccountManagement.createRoute('账号管理', '/sysrole11', 'pages/misAccountManagement.html', 'misAccountManagementController', resolve);
var misAccountManagementController = misAccountManagement.createController('misAccountManagementController', ['$scope','uiGridConstants', 'publicService', 'roleList', 
	function ($scope, uiGridConstants, publicService, roleList) {
	// body...
	// new AccountManager
	var accountManager = new MIS.AccountManager($scope, publicService.promise);
	MIS.currentSelectedAccount = null;
	$scope.showLock = true;

	// init paging
	$scope.myConf = {
		totalItems: 0,
		itemsPerPage: 10,
		currentPage:1
	};

	// init searchModel
	$scope.searchModel = {
		value:"0",
		searchList:[
			{name: '姓名', value: "0", searchOption: 'name'},
			{name: '角色', value: "1", searchOption: 'roleId'},
			// {name: '公司', value: "2", searchOption: 'name'},
			{name: '手机号', value: "2", searchOption: 'cellphone'}
		]
	}

	$scope.roleList = MIS.dictData.roleList;

	// default search value
	$scope.searchValue = "";
	$scope.resetSearch = function(){
		$scope.searchValue = "";
	}

	// search click function
	$scope.searchClick=function(){
		if($scope.searchValue!=''){
			var search = {};
			var searchOption = $scope.searchModel.searchList[parseInt($scope.searchModel.value)].searchOption;
			search[searchOption] = $scope.searchValue;
			accountManager.setSearch(search);
		}else{
			accountManager.setSearch({});
		}

		accountManager.getPage(1, $scope.myConf.itemsPerPage);
	}

	// set grid options
	$scope.gridOptions = {
		enableRowSelection: true,
		enableSelectAll:false,
		multiSelect:false,
		enableFiltering:false,
		enableSorting: false,
	};

	// set grid columns
	$scope.gridOptions.columnDefs = [
	    { name: 'accountObj.user_name.value', displayName:'用户名', enableHiding:false, enableColumnMenu:false},
	    { name: 'accountObj.name.value', displayName:'姓名', enableHiding:false, enableColumnMenu:false},
	    { name: 'accountObj.id_no.value', displayName:'身份证', enableHiding:false, enableColumnMenu:false},
	    { name: 'accountObj.cellphone.value', displayName:'手机号码', enableHiding:false, enableColumnMenu:false},
	    { name: 'accountObj.email.value', displayName:'邮箱', enableHiding:false, enableColumnMenu:false},
	    { name: 'accountObj.role_ids.item.value', cellFilter:'roleFilter', displayName:'角色权限', enableHiding:false, enableColumnMenu:false},
	    { name: 'accountObj.status.item.value', cellFilter:'roleStatusFilter', displayName:'用户状态', enableHiding:false, enableColumnMenu:false},
  	];

  	// init grid data
	$scope.gridOptions.data=[];

	// get first page
	accountManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
	
	// listen on the grid data change
	$scope.$on('dataChange', function(event, data){
		$scope.gridOptions.data = data.currentPageList;
		$scope.myConf.totalItems = data.total * data.pageSize;
		$scope.myConf.currentPage = data.currentPage;
	});

	// paging change page function
	$scope.changePage = function(page){
		accountManager.getPage(page, $scope.myConf.itemsPerPage);
	}
	
	$scope.gridOptions.onRegisterApi = function(gridApi){
		$scope.gridApi = gridApi;
		gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
	};
	$scope.selectRow = function(row){
		if(row.isSelected){
			MIS.currentSelectedAccount = row.entity;
			if( MIS.currentSelectedAccount.accountObj.status.value() == '1'){
				$scope.showLock = true;
			}else if(MIS.currentSelectedAccount.accountObj.status.value() == '2'){
				$scope.showLock = false;
			}
		}else{
			MIS.currentSelectedAccount = null;
			$scope.showLock = true;
		}
	}
	// add function for add and modify accuont
	$scope.addUser = function(){
		$scope.go('/sysrole11/addUser');
	}
	$scope.modifyUser = function(){
		if(MIS.currentSelectedAccount){
			$scope.go('/sysrole11/modifyUser');
		}else{
			var popWindow = new MIS.Popup({
				w: 220,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '请选择要修改的帐号'
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

	var popWindow = new MIS.Popup({
        loadingTxt: '正在处理...',
        notShow: true
    });

	$scope.lockUser = function(unlock){
		if(MIS.currentSelectedAccount){
			popWindow.popup();
			var errorMsg = '冻结失败';
			var setStatus = '2';
			if(unlock){
				errorMsg = '解冻失败';
				setStatus = '1';
			}
			accountManager.lockAccount(MIS.currentSelectedAccount, setStatus, function(){
				accountManager.refresh();
				popWindow.close();
			}, function(){
				var errorWindow = new MIS.Popup({
					h: 115,
					w: 260,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: errorMsg
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '确认'
								},
								clickEvt: function(){
									errorWindow.close();
								}
							}
						]
					]
				});
			});
		}else{
			var errorWindow = new MIS.Popup({
				h: 115,
				w: 260,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '请选择帐号'
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '确认'
							},
							clickEvt: function(){
								errorWindow.close();
							}
						}
					]
				]
			})
		}
		MIS.currentSelectedAccount = null;
	}
}]);

misAccountManagementController.filter('roleFilter', function(){
	var roleList = MIS.dictData.roleList;
	return function (input) {
		var result = '';
		roleList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});

misAccountManagementController.filter('roleStatusFilter', function(){
	var statusList = MIS.dictData.roleStatusList;
	return function(input){
		var result = '';
		statusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
//Controller for add account page
misAccountManagement.createRoute('账号添加', '/sysrole11/addUser', 'pages/misAccountCtrl.html', 'misAddAccountController', null, true);
var misAddAccountController = misAccountManagement.createController('misAddAccountController', ['$scope', 'publicService', '$location', '$window',
	function ($scope, publicService, $location, $window) {
	// body...
	$scope.test = 'add';
	$scope.title = "新建帐号";
	var accountSet = new MIS.AccountManager($scope, publicService.promise);
	var account = new MIS.Account;
	$scope.accountModel = account.accountObj;
	$scope.checkItem = function(obj){
		var result = account.validate(obj);
		obj.errorFlag = !result;
		return result;
	};
	$scope.showError = function(obj){
		return !obj.errorFlag;
	};
	$scope.cancel = function(){
		$scope.go('/sysrole11');
	}
	
	var submitSuccessFn = function(){
		
		var popWindow = new MIS.Popup({
			w: 150,
			h: 115,
			contentList: [
				[
					{
						tag: 'lable',
						attr: {
							innerHTML: '账户添加成功'
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
							popWindow.close();
							$scope.go('/sysrole11');
							$scope.$apply();
						}
					}
				]
			]
		})
	}
	var submitFailedFn = function(){
		var popWindow = new MIS.Popup({//清除临时数据失败
			h: 115,
			w: 160,
			contentList: [
				[
					{
						tag: 'lable',
						attr: {
							innerHTML: '账户创建失败...'
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
	}
	var checkFailed = function(msg){
		var windowWidth = msg.length*12 + 24;
		var popWindow = new MIS.Popup({
			h: 115,
			w: windowWidth,
			contentList: [
				[
					{
						tag: 'lable',
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
	}
	$scope.submit = function(){
		accountSet.currentSelectAccount = account;
		var checkFlag = true;
		for(var i in $scope.accountModel){
			var obj = $scope.accountModel[i];
			if(!account.validate(obj)){
				var errTip = obj.validateMsg;
				checkFlag = false;
				break;
			};
		}
		if(!checkFlag){
			checkFailed(errTip);
		}else{
			accountSet.saveNewAccount(submitSuccessFn, submitFailedFn);
		}
	}
}]);

//Controller for modify account page
misAccountManagement.createRoute('账号修改', '/sysrole11/modifyUser', 'pages/misAccountCtrl.html', 'misModifyAccountController',accEditResolve, true);
var misModifyAccountController = misAccountManagement.createController('misModifyAccountController', ['$scope', 'publicService', 'hasSelectAccount',
	function ($scope, publicService) {
	// body...
	$scope.title = "修改帐号";
	if(MIS.currentSelectedAccount==null){
		$scope.go('/sysrole11');
	}
	var accountSet = new MIS.AccountManager($scope, publicService.promise);
	var account = MIS.currentSelectedAccount;
	$scope.accountModel = account.accountObj;
	$scope.checkItem = function(obj){
		var result = account.validate(obj);
		obj.errorFlag = !result;
		return result;
	};
	$scope.showError = function(obj){
		return !obj.errorFlag;
	};
	$scope.editDisable = true;
	var submitSuccessFn = function(){
		var popWindow = new MIS.Popup({
			h: 115,
			w: 150,
			contentList: [
				[
					{
						tag: 'lable',
						attr: {
							innerHTML: '账户修改成功'
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
							popWindow.close();
							MIS.currentSelectedAccount = null;
							$scope.go('/sysrole11');
							$scope.$apply();
						}
					}
				]
			]
		})
	}
	var submitFailedFn = function(){
		var popWindow = new MIS.Popup({
			h: 115,
			w: 150,
			contentList: [
				[
					{
						tag: 'lable',
						attr: {
							innerHTML: '账户修改失败'
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
	}
	var checkFailed = function(msg){
		var windowWidth = msg.length*12 + 24;
		console.log(windowWidth);
		var popWindow = new MIS.Popup({
			h: 115,
			w: windowWidth,
			contentList: [
				[
					{
						tag: 'lable',
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
	}
	$scope.submit = function(){
//		console.log($scope.accountModel);
		accountSet.currentSelectAccount = account;
		var checkFlag = true;
		for(var i in $scope.accountModel){
			var obj = $scope.accountModel[i];
			if(!account.validate(obj)){
				errTip = obj.validateMsg;
				checkFlag = false;
				break;
			};
		}
		if(!checkFlag){
			checkFailed(errTip);
		}else{
			accountSet.updateAccount(submitSuccessFn,submitFailedFn);
		}
	}
	$scope.cancel = function(){
		MIS.currentSelectedAccount = null;
		$scope.go('/sysrole11');
	}
}]);