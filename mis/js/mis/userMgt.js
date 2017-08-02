var userMgt = new MIS._Angular('userMgt', []);
userMgt.createRoute('用户管理', '/role21', 'pages/userMgt.html', 'userMgtController');
var userMgtController = userMgt.createController('userMgtController', ['$scope', '$compile','publicService',
	function ($scope, $compile,publicService) {
		var manager = new MIS.CustomerManager($scope, publicService.promise);
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		$scope.gridOptions = manager.gridOptions;
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		// manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
		// paging change function
		$scope.changePage = function(page){
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentCustomer = row.entity;
			}else{
				MIS.currentCustomer = null;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};



		$scope.searchStr = '';
		$scope.searchModel = manager.searchModel;
		$scope.query = function(){
			// debugger;
			// if($scope.searchStr != '' && $scope.searchStr != undefined)
				manager.queryChannel($scope.searchStr);
		}
		
		// $scope.advanceQueryObj = manager.searchDetailObj;
		// $scope.advanceQueryObj.errorMsg = '';
		// $scope.advanceQuery =function(){
		// 	manager.searchStr = '';
		// 	$scope.searchValue = '';
		// 	var popWindow = new MIS.Popup({
		// 		w: 500,
		// 		coverCls: 'misPopupCover',
		// 		cls: 'misPopup popTwo',
		// 		title: {
					
		// 		},
		// 		contentList:[
		// 			[
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						innerHTML: '认证状态'
		// 					}
		// 				},
		// 				{
		// 					tag: 'select',
		// 					ngModel: 'advanceQueryObj.reviewed.item',
		// 					ngOptions: 'item as item.name for item in advanceQueryObj.reviewed.list track by item.value',
		// 				}
		// 			],
		// 			[
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						innerHTML: '投资总金额'
		// 					}
		// 				},
		// 				{
		// 					tag: 'input',
		// 					ngModel: 'advanceQueryObj.investFrom',
		// 					attr:{
		// 						type: 'text'
		// 					}
		// 				},
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						class:'middle',
		// 						innerHTML: '~'
		// 					}
		// 				},
		// 				{
		// 					tag: 'input',
		// 					ngModel: 'advanceQueryObj.investTo',
		// 					attr:{
		// 						type: 'text'
		// 					}
		// 				}
		// 			],
		// 			[
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						innerHTML: '注册时间'
		// 					}
		// 				},
		// 				{
		// 					tag: 'input',
		// 					ngModel: 'advanceQueryObj.registerFrom.value',
		// 					datetime: {
		// 						datetimeModel: 'advanceQueryObj.registerFrom',
		// 						datetimeValue: 'value',
		// 						hasTime: true,
		// 						datetimeId: 'userRegisterSearch_from'
		// 					},
		// 					attr: {
		// 						class: 'orderMgtPopInput3',
		// 						style: 'width:108px;margin-right:10px;font-size:12px;',
		// 						type: 'text',
		// 						placeholder: '起止'
		// 					}
		// 				},
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						class:'middle',
		// 						innerHTML: '~'
		// 					}
		// 				},
		// 				{
		// 					tag: 'input',
		// 					ngModel: 'advanceQueryObj.registerTo.value',
		// 					datetime: {
		// 						datetimeModel: 'advanceQueryObj.registerTo',
		// 						datetimeValue: 'value',
		// 						hasTime: true,
		// 						datetimeId: 'userRegisterSearch_to'
		// 					},
		// 					attr: {
		// 						class: 'orderMgtPopInput3',
		// 						style: 'width:108px;margin-right:10px;font-size:12px;',
		// 						type: 'text',
		// 						placeholder: '结束'
		// 					}
		// 				}
		// 			],
		// 			[
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						class: 'orderMgtPopLabel1',
		// 						innerHTML: '最后登录时间'
		// 					}
		// 				},
		// 				{
		// 					tag: 'input',
		// 					ngModel: 'advanceQueryObj.lastLoginFrom.value',
		// 					datetime: {
		// 						datetimeModel: 'advanceQueryObj.lastLoginFrom',
		// 						datetimeValue: 'value',
		// 						hasTime: true,
		// 						datetimeId: 'userLastLogin_from'
		// 					},
		// 					attr: {
		// 						class: 'orderMgtPopInput3',
		// 						style: 'width:108px;margin-right:10px;font-size:12px;',
		// 						type: 'text',
		// 						placeholder: '结束'
		// 					}
		// 				},
		// 				{
		// 					tag: 'label',
		// 					attr: {
		// 						class:'middle',
		// 						innerHTML: '~'
		// 					}
		// 				},
		// 				{
		// 					tag: 'input',
		// 					ngModel: 'advanceQueryObj.lastLoginTo.value',
		// 					datetime: {
		// 						datetimeModel: 'advanceQueryObj.lastLoginTo',
		// 						datetimeValue: 'value',
		// 						hasTime: true,
		// 						datetimeId: 'userLastLogin_to'
		// 					},
		// 					attr: {
		// 						class: 'orderMgtPopInput3',
		// 						style: 'width:108px;margin-right:10px;font-size:12px;',
		// 						type: 'text',
		// 						placeholder: '结束'
		// 					}
		// 				}
		// 			],
		// 			[
		// 				{
		// 					tag: 'button',
		// 					attr: {
		// 						innerHTML: '查询',
		// 						class: 'misPopupBtn'
		// 					},
		// 					clickEvt: function(){
		// 						console.log($scope.test)
		// 						popWindow.close();
		// 					}
		// 				},
		// 				{
		// 					tag: 'button',
		// 					attr: {
		// 						class: 'misPopupBtn',
		// 						innerHTML: '重置',
		// 						style: 'margin-left:55px'
		// 					},
		// 					clickEvt: function(){
		// 						popWindow.close();
		// 					}
		// 				}
		// 			],
		// 		]
		// 	},$scope,$compile)
		// }
		$scope.lockCtrl = function(){
			alert('lock')
		}
		$scope.detail = function(){
			if(!MIS.currentCustomer){
				return
			}
			var userId = MIS.currentCustomer.customerObj.userId;
			manager.searchDetail(userId, function(detail){
				//success
				MIS.currentCustomer.detailObj = detail.detailObj;
				$scope.go('/role21/detail');
			})
		}
		//查看投资记录
		$scope.showInvestList = function(){
			if(!MIS.currentCustomer)
				return
			var userId = MIS.currentCustomer.customerObj.userId;
			$scope.go('/role21/investList/user/' + userId);
		}
}]);

userMgt.createRoute('用户信息', '/role21/detail', 'pages/userDetail.html', 'userDetailController', null, true);
var userDetailController = userMgt.createController('userDetailController', ['$scope', '$compile', 'publicService', 
	function($scope, $compile, publicService){
		if(!MIS.currentCustomer){$scope.go('/role21');}
		$scope.dataModel = MIS.currentCustomer;
		$scope.back=function(){
			$scope.go('/role21')
		}

}]);

userMgt.createRoute('渠道管理', '/role22', 'pages/channelMgt.html', 'channelMgtController');
var channelMgtController = userMgt.createController('channelMgtController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.CustomerManager($scope, publicService.promise, '1,5,6');
		MIS.currentChannel = null;
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		$scope.gridOptions = manager.gridOptions;
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		// manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
		// paging change function
		$scope.changePage = function(page){
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentChannel = row.entity;
			}else{
				MIS.currentChannel = null;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};
		$scope.createChannel = function(){
			$scope.go('/role22/create');
		}
		$scope.searchStr = '';
		$scope.searchModel = manager.searchModel;
		$scope.query = function(){
			// if($scope.searchStr != '' && $scope.searchStr != undefined)
				manager.queryChannel($scope.searchStr);
		}
		$scope.setActivity = function(){
			//set Activity
			if(MIS.currentChannel){
				$scope.go('/role22/activity')
			}else{
				MIS.selectPop();
			}
		}
		//查看投资记录
		$scope.showInvestList = function(){
			if(!MIS.currentChannel)
				return
			var userId = MIS.currentChannel.customerObj.userId;
			$scope.go('/role22/investList/channel/' + userId);
		}
	}
]);

userMgt.createRoute('新增渠道', '/role22/create', 'pages/channelCreate.html', 'channelCreateController');
var channelCreateController = userMgt.createController('channelCreateController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
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
			$scope.go('/role22');
		}
		$scope.submit = function(){
			//check
			if(!$scope.checkItem($scope.accountModel.name) || !$scope.checkItem( $scope.accountModel.cellphone))
				return

			// create channel
			var loading = new MIS.Popup({
				loadingTxt: 'Loading'
			});
			accountSet.createChannel($scope.accountModel.name.value, $scope.accountModel.cellphone.value, function(){
				//
				loading.close();
				$scope.go('/role22');
			})
		}
	}
]);

userMgt.createRoute('渠道活动', '/role22/activity', 'pages/channelActivity.html', 'channelActivityController', null, true);
var channelActivityController = userMgt.createController('channelActivityController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.AccountManager($scope, publicService.promise);
		var agencyId = MIS.currentChannel.customerObj.userId;
		var agencyName = MIS.currentChannel.customerObj.userName;

		var loading = new MIS.Popup({
			loadingTxt: 'Loading'
		});

		$scope.allActivity = {
			list: [],
		}
		$scope.activityList = [
			{
				name: '体验金',
				code: 0,
				selected: false,
				list: []
			},
			{
				name: '注册送积分',
				code: 1,
				selected: false,
				list: []
			},
			{
				name: '邀请有礼',
				code: 2,
				selected: false,
				list: []
			},
			{
				name: '抽奖',
				code: 3,
				selected: false,
				list: []
			},
		]
		$scope.currentActivity = null;

		manager.getActivityData(agencyId, agencyName, function(data){

			$scope.activityList[0].list = data.coupon;
			$scope.activityList[1].list = data.signup;
			$scope.activityList[2].list = data.invite;
			$scope.activityList[3].list = data.lottery;
			// default select
			$scope.selectActivity($scope.activityList[0]);
			loading.close();
		})

		$scope.selectedActivityFilter = function(item){ 
			if(item)
				return item.checked;
		}
		$scope.cancelSelect = function(item){item.checked = false;}
		$scope.selectActivity = function(activity){
			if($scope.currentActivity)
				$scope.currentActivity.selected = false;
			$scope.currentActivity = activity;
			$scope.currentActivity.selected = true;
		}
		var getSelectActivityList = function(){
			var couponList = $scope.activityList[0].list;
			var signupList = $scope.activityList[1].list;
			var inviteList = $scope.activityList[2].list;
			var lotteryList = $scope.activityList[3].list;
			var agencyConfList = {
				couponIds: '',
				pointActSignupIds: '',
				pointActInviteIds: '',
				lotteryActIds: ''
			};
			var arrCoupon = [];
			for(var i=0; i<couponList.length; i++){
				var item = couponList[i];
				if(item.checked)
					arrCoupon.push(item.id);
			}
			agencyConfList.couponIds = arrCoupon.join(',');
			var arrSignup = [];
			for(var i=0; i<signupList.length; i++){
				var item = signupList[i];
				if(item.checked)
					arrSignup.push(item.id);
			}
			agencyConfList.pointActSignupIds = arrSignup.join(',');
			var arrInvite = [];
			for(var i=0; i<inviteList.length; i++){
				var item = inviteList[i];
				if(item.checked)
					arrInvite.push(item.id);
			}
			agencyConfList.pointActInviteIds = arrInvite.join(',');
			var arrLottery = [];
			for(var i=0; i<lotteryList.length; i++){
				var item = lotteryList[i];
				if(item.checked)
					arrLottery.push(item.id);
			}
			agencyConfList.lotteryActIds = arrLottery.join(',');
			
			return agencyConfList

		}
		$scope.submit = function(){
			loading.popup();
			//get selected activity list
			var agencyConfList = getSelectActivityList();
			manager.setChannelActivity(agencyId, agencyName, agencyConfList, function(){
				// success
				loading.close();
				$scope.go('/role22');
			})
		}
		$scope.cancel = function(){
			$scope.go('/role22');
		}
	}
]);


//投资记录
//prodId
userMgt.createRoute('投资记录', '/role11/investList/product/:prodId', 'pages/investList.html', 'investListController', null, true);
//userId
userMgt.createRoute('投资记录', '/role21/investList/user/:userId', 'pages/investList.html', 'investListController', null, true);
//refereeId
userMgt.createRoute('投资记录', '/role22/investList/channel/:refereeId', 'pages/investList.html', 'investListController', null, true);
var investListController = userMgt.createController('investListController', ['$scope', '$compile', 'publicService', '$routeParams',
	function($scope, $compile, publicService, routeParams){
		//
		var id = '';
		var type = '';
		var backUrl = '';
		if(typeof(routeParams.prodId)!='undefined'){
			id = routeParams.prodId;
			type = '1';
			backUrl = '/role11';
		}else if(typeof(routeParams.userId)!='undefined'){
			id = routeParams.userId;
			type = '2';
			backUrl = '/role21';
		}else if(typeof(routeParams.refereeId)!='undefined'){
			id = routeParams.refereeId;
			type = '3';
			backUrl = '/role22';
		}
		var manager = new MIS.InvestListMgt($scope, publicService.promise, id, type);

		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		$scope.gridOptions = manager.gridOptions;
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});
		manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
		// paging change function
		$scope.changePage = function(page){
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.goBack = function(){
			$scope.go(backUrl);
		}
	}
]);

userMgt.createRoute('短信管理', '/role23', 'pages/iSmsMgt.html', 'iSmsMgtController');
var iSmsMgtController = userMgt.createController('iSmsMgtController', ['$scope', '$compile', 'publicService', 
	function($scope, $compile, publicService){
		var manager = new MIS.SMSManager($scope, publicService.promise);
		$scope.pageListData = [];
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});

		$scope.searchStr = '';
		$scope.query = function(){
			loading.popup();
			// if($scope.searchStr != '' && $scope.searchStr != undefined){
			// 	manager.queryCellphone($scope.searchStr);
			// }else{
			// 	loading.close();
			// }
			manager.queryCellphone($scope.searchStr);
		}
		// paging change function
		$scope.changePage = function(page){
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
	}	
])

