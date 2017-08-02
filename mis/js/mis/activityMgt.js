//注册送积分活动
var activityMgt = new MIS._Angular('activitySignupMgt', []);
activityMgt.createRoute('注册送积分管理', '/role_10_1', 'pages/activitySignupMgt.html', 'activitySignupMgtController');
var activitySignupMgtController = activityMgt.createController('activitySignupMgtController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.ActivitySignupManager($scope, publicService.promise);
		//init paging
		MIS.currentActivitySignup = null;
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading'
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
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentActivitySignup = row.entity;
			}else{
				MIS.currentActivitySignup = null;
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
		//create activity
		$scope.create = function(){
			$scope.go('/role_10_1/create');
			
		}
		$scope.active = function(){
			if(MIS.currentActivitySignup){
				//loading
				var loading = new MIS.Popup({
					loadingTxt: 'Loading'
				});
				var id = MIS.currentActivitySignup.activityObj.activityId;
				var flag = !MIS.currentActivitySignup.activityObj.enableFlag;
				manager.activeActivity(id, flag, function(){
					// refresh
					var popWindow = new MIS.Popup({
						w: 200,
						h: 125,
						contentList:[
							[
								{
									tag: 'label',
									attr: {
										innerHTML: '设置成功'
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
										popWindow.close();
										manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
										// $scope.$apply();
									}
								}
							]
						]
					});
				}, function(){

				})
			}
		}
	}
])
activityMgt.createRoute('添加注册送积分活动', '/role_10_1/create', 'pages/activitySignupCreate.html', 'activitySignupCreateController', null, true);
var activitySignupCreateController = activityMgt.createController('activitySignupCreateController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var activity = new MIS.ActivitySignup();

		$scope.activityModel = activity.activityObj;

		var manager = new MIS.ActivitySignupManager($scope, publicService.promise);
		
		$scope.createNew = function(){
			var validate = activity.createValidation();
			if(!validate)
				return 
			var data = activity.randerRequestObject();

			manager.createActivity(data, function(){
				var popWindow = new MIS.Popup({
					w: 200,
					h: 125,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '添加成功'
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
									popWindow.close();
									$scope.go('/role_10_1');
									$scope.$apply();
								}
							}
						]
					]
				});
			}, function(){

			})
		}
		
		$scope.cancel = function(){
			$scope.go('/role_10_1');
		}
	}
])

activityMgt.createRoute('邀请送积分', '/role_10_2', 'pages/activityInviteMgt.html', 'activityInviteMgtController');
var activityInviteMgtController = activityMgt.createController('activityInviteMgtController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.ActivityInviteManager($scope, publicService.promise);
		//init paging
		MIS.currentActivityInvite = null;
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading'
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
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentActivityInvite = row.entity;
			}else{
				MIS.currentActivityInvite = null;
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
		//create activity
		$scope.create = function(){
			$scope.go('/role_10_2/create');
			
		}
		$scope.active = function(){
			if(MIS.currentActivityInvite){
				//loading
				var loading = new MIS.Popup({
					loadingTxt: 'Loading'
				});
				var id = MIS.currentActivityInvite.activityObj.activityId;
				var flag = !MIS.currentActivityInvite.activityObj.enableFlag;
				manager.activeActivity(id, flag, function(){
					// refresh
					var popWindow = new MIS.Popup({
						w: 200,
						h: 125,
						contentList:[
							[
								{
									tag: 'label',
									attr: {
										innerHTML: '设置成功'
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
										popWindow.close();
										manager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);
										// $scope.$apply();
									}
								}
							]
						]
					});
				}, function(){

				})
			}
		}
	}
]);

activityMgt.createRoute('添加邀请送积分活动', '/role_10_2/create', 'pages/activityInviteCreate.html', 'activityInviteCreateController', null, true);
var activityInviteCreateController = activityMgt.createController('activityInviteCreateController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var activity = new MIS.ActivityInvite();

		$scope.activityModel = activity.activityObj;

		var manager = new MIS.ActivityInviteManager($scope, publicService.promise);
		
		$scope.createNew = function(){
			var validate = activity.createValidation();
			if(!validate)
				return 
			var data = activity.randerRequestObject();

			manager.createActivity(data, function(){
				var popWindow = new MIS.Popup({
					w: 200,
					h: 125,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '添加成功'
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
									popWindow.close();
									$scope.go('/role_10_2');
									$scope.$apply();
								}
							}
						]
					]
				});
			}, function(){

			})
		}
		
		$scope.cancel = function(){
			$scope.go('/role_10_2');
		}
	}
]);

activityMgt.createRoute('抽奖活动', '/role_10_3', 'pages/activityLotteryMgt.html', 'activityLotteryMgtController');
var activityLotteryMgtController = activityMgt.createController('activityLotteryMgtController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.ActivityLotteryManager($scope, publicService.promise);
		//init paging
		var currentActivityLottery = null;
		MIS.currentActivityLottery = null;
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		var loading = new MIS.Popup({
			loadingTxt: 'Loading'
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
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.selectRow = function(row){
			if(row.isSelected){
				currentActivityLottery = row.entity;
			}else{
				currentActivityLottery = null;
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
		$scope.create = function(){
			$scope.go('/role_10_3/create');
		};
		$scope.edit = function(){
			if(currentActivityLottery){
				loading.popup();
				// request for activity lottery detail
				manager.getLotteryDetail(currentActivityLottery.self.activityId, function(lottery){
					MIS.currentActivityLottery = lottery;
					loading.close();
					$scope.go('/role_10_3/edit')
				}, function(){})
			}
		};
		$scope.review = function(){
			if(currentActivityLottery){
				loading.popup();
				// request for activity lottery detail
				manager.getLotteryDetail(currentActivityLottery.self.activityId, function(lottery){
					MIS.currentActivityLottery = lottery;
					loading.close();
					$scope.go('/role_10_3/review')
				}, function(){})
			}
		};
		$scope.active = function(){
			if(currentActivityLottery){
				loading.popup();
				var id = currentActivityLottery.self.activityId;
				var flag = !currentActivityLottery.self.enableFlag;
				manager.activeActivity(id, flag, function(){
					loading.close();
					currentActivityLottery = null;
					manager.refresh();
				}, function(){})
			}
		};
	}
]);

activityMgt.createRoute('新增抽奖活动', '/role_10_3/create', 'pages/activityLotteryCreate.html', 'activityLotteryCreateController', null, true);
var activityLotteryCreateController = activityMgt.createController('activityLotteryCreateController',  ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var activity = new MIS.ActivityLottery();
		var manager = new MIS.ActivityLotteryManager($scope, publicService.promise);
		$scope.activityModel = activity.self;

		//create pond
		$scope.popPond = function(pond){
			var createNew = true;
			if(pond){// edit
				createNew = false;
				$scope.pondModel = activity.clonePondObj(pond);
			}else{// create new
				// init a new pond object for create.
				$scope.pondModel = activity.addNewLotteryPonds();
			}
			$scope.errorMsg = '';
			// popup create dialog to add pond.
			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				title: {
					txt: '添加奖池'
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖池名称'
							}
						},
						{
							tag: 'input',
							ngModel: 'pondModel.pondTitle',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖池区间'
							}
						},
						{
							tag: 'input',
							ngModel: 'pondModel.investAmountMin',
							attr: {
								type: 'text'
							}
						},
						{
							tag: 'span',
							attr: {
								innerHTML: '元起'
							}
						}
					],
					[
						{
							tag: 'self',
							ngShow: 'errorMsg',
							attr: {
								innerHTML: '{{errorMsg}}',
								class: 'errorMsg'
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
								//$scope.pondModel
								var validate = activity.checkPond($scope.pondModel);
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									$scope.$apply();
									return;
								}
								if(createNew){
									// get current pond index.
									var currentIndex = activity.getPondIndex($scope.currentPond);
									// insert the index after current pond.
									activity.insertPond($scope.pondModel, currentIndex);
									// call angular apply to refresh the view.
									popWindowCreate.close();
									$scope.$apply();
									// trigger added pond click
									triggerNewAddSelect();
								}else{
									activity.updateEditPond(pond, $scope.pondModel);
									popWindowCreate.close();
									$scope.$apply();
								}
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								
								$scope.$apply();
							}
						}
					]
				]
			}, $scope, $compile); 
		}
		//edit pond
		$scope.editPond = function(){
			if($scope.currentPond){
				$scope.popPond($scope.currentPond);
			}
		}
		//select pond, show prize
		var currentPondSelectTag = null;
		var highlight = function(tag){
			//
			MIS.Util.addClass(tag, 'highlight');
		}
		var disHighlight = function(tag){
			//
			MIS.Util.removeClass(tag, 'highlight');
		}
		var triggerNewAddSelect = function(){
			var tableBody = document.getElementById('lotteryPondTableBody');
			var trList = tableBody.getElementsByTagName('tr');
			var len = trList.length;
			if(!currentPondSelectTag){
				//如果没有当前选中的tag 选最后一个节点
				var node = trList[len-1];
				node.click()
			}else{
				//如果当前选中tag 则选择该tag的下一个兄弟节点
				var node = currentPondSelectTag.nextElementSibling || currentPondSelectTag.nextSibling;
				node.click()
			}
		}
		$scope.selectPond = function(pond, event){
			var tag = event.currentTarget || event.srcElement;
			if(currentPondSelectTag){
				disHighlight(currentPondSelectTag);
			}
			currentPondSelectTag = tag;
			highlight(tag);
			showPondPrize(pond);
		}
		//init a new pond object
		$scope.currentPond = null;
		$scope.currentPrize = null;

		var showPondPrize = function(pond){
			$scope.currentPond = pond;
			$scope.showPrize = true;
		}
		var hidePondPrize = function(){
			$scope.currentPond = null;
			$scope.showPrize = false;
		}
		// remove pond
		// only can remove last pond
		$scope.removePond = function(){
			var delPond = $scope.currentPond;
			if(delPond){
				activity.removeLotteryPond(delPond);
				hidePondPrize();
			}
			// activity.removeLastLotteryPond();
			// hidePondPrize();
		}

		$scope.popPrize = function(prize){
			var createNew = true;
			if(prize){
				createNew = false;
				$scope.prizeModel = activity.clonePrizeObj(prize);
			}else{
				$scope.prizeModel = activity.addNewLotteryPrize();
			}
			$scope.errorMsg = '';
			$scope.changePrizeType();
			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品类型'
							}
						},
						{
							tag: 'select',
							ngModel: 'prizeModel.prizeType.item',
							ngOptions: 'item as item.name for item in prizeModel.prizeType.list track by item.value',
							ngChange: 'changePrizeType(true)',
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品名称'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.prizeName',
							ngDisabled:'!disabledCouponList',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品数量'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.shareTotal',
							ngDisabled: 'prizeModel.prizeType.value().toString() == "4"',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品几率'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.probability',
							attr:{
								type: 'text'
							}
						},
						{
							tag: 'span',
							attr:{
								innerHTML: '%',
								style: 'float:left'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '积分数量'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.prizeValue',
							ngDisabled: 'prizeModel.prizeType.value() != "2"',
							attr:{
								type: 'text'
							},
							
						}
					],
					[
						{
							tag: 'label',
							attr:{
								innerHTML: '体验金/红包'
							},
						},
						{
							tag: 'search-down-list',
							ngDisabled: 'disabledCouponList',
							attr:{
								'searchdata-list': 'couponDataList',
								'searchdata-model': 'prizeModel.prizeInternalId',
								'display-value': 'prizeModel.prizeName',
								'change-fun':'searchCoupon',
								'search-id':'prize_coupon_searchDown',
								'disable-flag': 'disabledCouponList'
							}
						}
					],
					[
						{
							tag: 'self',
							ngShow: 'errorMsg',
							attr: {
								innerHTML: '{{errorMsg}}',
								class: 'errorMsg'
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
								//$scope.pondModel
								var validate = activity.checkPrize($scope.prizeModel);
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									$scope.$apply();
									return;
								}

								if(createNew){
									activity.insertPrize($scope.currentPond, $scope.prizeModel);
								}else{
									activity.updateEditPrize(prize, $scope.prizeModel)
								}
								popWindowCreate.close();
								$scope.$apply();
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								$scope.$apply();
							}
						}
					]
				]
			}, $scope, $compile);
		}
		//prize type change
		$scope.changePrizeType = function(clear){
			if(clear){
				// clear prize value
				$scope.prizeModel.prizeName = "";
				$scope.prizeModel.prizeValue = "";
				$scope.prizeModel.prizeInternalId = "";
				$scope.prizeModel.shareTotal = "";
			}
			if($scope.prizeModel.prizeType.value().toString() == '3'){
				//if coupon list not get, request for couponlist 
				$scope.disabledCouponList = false;
			}else{
				$scope.disabledCouponList = true;
			}
		}

		//edit pond
		$scope.editPrize = function(){
			if($scope.currentPrize){
				$scope.popPrize($scope.currentPrize);
			}
		}
		//select prize
		var currentPrizeSelectTag = null;
		$scope.selectPrize = function(prize, event){
			var tag = event.currentTarget || event.srcElement;
			if(tag.checked){
				if(currentPrizeSelectTag){
					currentPrizeSelectTag.checked = false;
				}
				currentPrizeSelectTag = tag;
				$scope.currentPrize = prize;
			}else{
				currentPrizeSelectTag = null;
				$scope.currentPrize = null;
			}
		}
		// remove prize
		$scope.removePrize = function(){
			var delPrize = $scope.currentPrize;
			var targetPond = $scope.currentPond;
			if(delPrize &&　targetPond){
				activity.removeLotteryPrize(targetPond, delPrize);
			}
		}
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});

		$scope.checkTitle = function(){
			var result = activity.checkTitle(activity.self.activityTitle);
			$scope.validateTitle = result;
			return result
		}
		$scope.checkBeginTime = function(){
			var result = activity.checkTime(activity.self.beginAt);
			$scope.validateBeginAt = result;
			return result;
		}
		$scope.checkEndTime = function(){
			var result = activity.checkTime(activity.self.endAt);
			$scope.validateEndAt = result;
			return result;
		}
		// save the activity
		$scope.save = function(){
			if(!$scope.checkTitle() || !$scope.checkBeginTime() || !$scope.checkEndTime())
				return
			// check prize

			var checkResult = activity.saveCheck();
			loading.popup();
			if(!checkResult.flag){
				var submitErrorMsg =  MIS.Util.stringFormat("发现错误:{0} 请检查", [checkResult.msg]);
				MIS.failedFn(submitErrorMsg);
				return 
			}

			var saveObj = activity.randerRequestObject();
			manager.saveNewLottery(saveObj, function(){
				// save successd
				loading.close();
				$scope.go('/role_10_3');
			}, function(){
				// save failed
			});
		}
		$scope.cancel = function(){
			$scope.go('/role_10_3')
		}

		//coupon
		$scope.couponDataList = [];
		var couponManager = new MIS.CouponManager($scope, publicService.promise);
		$scope.searchCoupon = function(val){
			couponManager.getSearchDownList(val, function(list){
				$scope.couponDataList = list;
			}, function(){})
		}
	}
])

activityMgt.createRoute('修改抽奖活动', '/role_10_3/edit', 'pages/activityLotteryCreate.html', 'activityLotteryEditController', null, true);
var activityLotteryEditController = activityMgt.createController('activityLotteryEditController', ['$scope', '$compile', 'publicService', 
	function($scope, $compile, publicService){
		var activity = MIS.currentActivityLottery;
		var manager = new MIS.ActivityLotteryManager($scope, publicService.promise);
		$scope.activityModel = activity.self;
		//create pond
		$scope.popPond = function(pond){
			var createNew = true;
			if(pond){// edit
				createNew = false;
				$scope.pondModel = activity.clonePondObj(pond);
			}else{// create new
				// init a new pond object for create.
				$scope.pondModel = activity.addNewLotteryPonds();
			}
			$scope.errorMsg = '';
			// popup create dialog to add pond.
			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				title: {
					txt: '添加奖池'
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖池名称'
							}
						},
						{
							tag: 'input',
							ngModel: 'pondModel.pondTitle',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖池区间'
							}
						},
						{
							tag: 'input',
							ngModel: 'pondModel.investAmountMin',
							attr: {
								type: 'text'
							}
						},
						{
							tag: 'span',
							attr: {
								innerHTML: '元起'
							}
						}
					],
					[
						{
							tag: 'self',
							ngShow: 'errorMsg',
							attr: {
								innerHTML: '{{errorMsg}}',
								class: 'errorMsg'
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
								//$scope.pondModel
								var validate = activity.checkPond($scope.pondModel);
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									return;
								}

								if(createNew){
									// get current pond index.
									var currentIndex = activity.getPondIndex($scope.currentPond);
									// insert the index after current pond.
									activity.insertPond($scope.pondModel, currentIndex);
									// call angular apply to refresh the view.
									popWindowCreate.close();
									$scope.$apply();
									// trigger added pond click
									triggerNewAddSelect();
								}else{
									activity.updateEditPond(pond, $scope.pondModel);
									popWindowCreate.close();
									$scope.$apply();
								}
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								
								$scope.$apply();
							}
						}
					]
				]
			}, $scope, $compile); 
		}
		//edit pond
		$scope.editPond = function(){
			if($scope.currentPond){
				$scope.popPond($scope.currentPond);
			}
		}
		//select pond, show prize
		var currentPondSelectTag = null;
		var highlight = function(tag){
			//
			MIS.Util.addClass(tag, 'highlight');
		}
		var disHighlight = function(tag){
			//
			MIS.Util.removeClass(tag, 'highlight');
		}
		var triggerNewAddSelect = function(){
			var tableBody = document.getElementById('lotteryPondTableBody');
			var trList = tableBody.getElementsByTagName('tr');
			var len = trList.length;
			if(!currentPondSelectTag){
				//如果没有当前选中的tag 选最后一个节点
				var node = trList[len-1];
				node.click()
			}else{
				//如果当前选中tag 则选择该tag的下一个兄弟节点
				var node = currentPondSelectTag.nextElementSibling || currentPondSelectTag.nextSibling;
				node.click()
			}
		}
		$scope.selectPond = function(pond, event){
			var tag = event.currentTarget || event.srcElement;
			if(currentPondSelectTag){
				disHighlight(currentPondSelectTag);
			}
			currentPondSelectTag = tag;
			highlight(tag);
			showPondPrize(pond);
		}
		//init a new pond object
		$scope.currentPond = null;
		$scope.currentPrize = null;

		var showPondPrize = function(pond){
			$scope.currentPond = pond;
			$scope.showPrize = true;
		}
		var hidePondPrize = function(){
			$scope.currentPond = null;
			$scope.showPrize = false;
		}
		// remove pond
		// only can remove last pond
		$scope.removePond = function(){
			var delPond = $scope.currentPond;
			if(delPond){
				activity.removeLotteryPond(delPond);
				hidePondPrize();
			}
			// activity.removeLastLotteryPond();
			// hidePondPrize();
		}

		$scope.popPrize = function(prize){
			var createNew = true;
			if(prize){
				createNew = false;
				$scope.prizeModel = activity.clonePrizeObj(prize);
			}else{
				$scope.prizeModel = activity.addNewLotteryPrize();
			}
			$scope.changePrizeType();
			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品类型'
							}
						},
						{
							tag: 'select',
							ngModel: 'prizeModel.prizeType.item',
							ngOptions: 'item as item.name for item in prizeModel.prizeType.list track by item.value',
							ngChange: 'changePrizeType(true)'
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品名称'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.prizeName',
							ngDisabled:'!disabledCouponList',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品数量'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.shareTotal',
							ngDisabled: 'prizeModel.prizeType.value().toString() == "4"',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '奖品几率'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.probability',
							attr:{
								type: 'text'
							}
						},
						{
							tag: 'span',
							attr:{
								innerHTML: '%',
								style: 'float:left'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '积分数量'
							}
						},
						{
							tag: 'input',
							ngModel: 'prizeModel.prizeValue',
							ngDisabled: 'prizeModel.prizeType.value() != "2"',
							attr:{
								type: 'text'
							},
							
						}
					],
					[
						{
							tag: 'label',
							attr:{
								innerHTML: '体验券'
							},
						},
						{
							tag: 'search-down-list',
							ngDisabled: 'disabledCouponList',
							attr:{
								'searchdata-list': 'couponDataList',
								'searchdata-model': 'prizeModel.prizeInternalId',
								'display-value': 'prizeModel.prizeName',
								'change-fun':'searchCoupon',
								'search-id':'prize_coupon_searchDown',
								'disable-flag': 'disabledCouponList'
							}
						}
					],
					[
						{
							tag: 'self',
							ngShow: 'errorMsg',
							attr: {
								innerHTML: '{{errorMsg}}',
								class: 'errorMsg'
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
								//$scope.pondModel
								var validate = activity.checkPrize($scope.prizeModel);
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									return;
								}
								if(createNew){
									activity.insertPrize($scope.currentPond, $scope.prizeModel);
								}else{
									activity.updateEditPrize(prize, $scope.prizeModel)
								}
								popWindowCreate.close();
								$scope.$apply();
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								$scope.$apply();
							}
						}
					]
				]
			}, $scope, $compile);
		}

		//prize type change
		$scope.changePrizeType = function(clear){
			if(clear){
				// clear prize value
				$scope.prizeModel.prizeName = "";
				$scope.prizeModel.prizeValue = "";
				$scope.prizeModel.prizeInternalId = "";
				$scope.prizeModel.shareTotal = "";
			}
			if($scope.prizeModel.prizeType.value().toString() == '3'){
				//if coupon list not get, request for couponlist 
				$scope.disabledCouponList = false;
			}else{
				$scope.disabledCouponList = true;
			}
		}

		//edit pond
		$scope.editPrize = function(){
			if($scope.currentPrize){
				$scope.popPrize($scope.currentPrize);
			}
		}
		//select prize
		var currentPrizeSelectTag = null;
		$scope.selectPrize = function(prize, event){
			var tag = event.currentTarget || event.srcElement;
			if(tag.checked){
				if(currentPrizeSelectTag){
					currentPrizeSelectTag.checked = false;
				}
				currentPrizeSelectTag = tag;
				$scope.currentPrize = prize;
			}else{
				currentPrizeSelectTag = null;
				$scope.currentPrize = null;
			}
		}
		// remove prize
		$scope.removePrize = function(){
			var delPrize = $scope.currentPrize;
			var targetPond = $scope.currentPond;
			if(delPrize &&　targetPond){
				activity.removeLotteryPrize(targetPond, delPrize);
				$scope.currentPrize = null;
			}
		}
		var loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notShow: true
		});
		$scope.checkTitle = function(){
			var result = activity.checkTitle(activity.self.activityTitle);
			$scope.validateTitle = result;
			return result
		}
		$scope.checkBeginTime = function(){
			var result = activity.checkTime(activity.self.beginAt);
			$scope.validateBeginAt = result;
			return result;
		}
		$scope.checkEndTime = function(){
			var result = activity.checkTime(activity.self.endAt);
			$scope.validateEndAt = result;
			return result;
		}
		// save the activity
		$scope.save = function(){
			if(!$scope.checkTitle() || !$scope.checkBeginTime() || !$scope.checkEndTime())
				return 
			var checkResult = activity.saveCheck();
			loading.popup();
			if(!checkResult.flag){
				var submitErrorMsg =  MIS.Util.stringFormat("发现错误:{0} 请检查", [checkResult.msg]);
				MIS.failedFn(submitErrorMsg);
				return 
			}
			var saveObj = activity.randerRequestObject();
			manager.updateLottery(saveObj, function(){
				// save successd
				loading.close();
				$scope.go('/role_10_3');
			}, function(){
				// save failed
			});
		}
		$scope.cancel = function(){
			$scope.go('/role_10_3')
		}

		//coupon
		$scope.couponDataList = [];
		var couponManager = new MIS.CouponManager($scope, publicService.promise);
		$scope.searchCoupon = function(val){
			couponManager.getSearchDownList(val, function(list){
				$scope.couponDataList = list;
			}, function(){})
		}
	}
])

activityMgt.createRoute('查看抽奖活动', '/role_10_3/review', 'pages/activityLotteryCreate.html', 'activityLotteryReviewController', null, true);
var activityLotteryReviewController = activityMgt.createController('activityLotteryReviewController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		$scope.hideMenu = true;
		var activity = MIS.currentActivityLottery;
		//check if activityType == 2
		$scope.showComponentIndexBtn = false;
		$scope.showPrizeRecordBtn = true;
		if(activity.self.activityType.value().toString() == '2'){
			//show goto set index
			$scope.showComponentIndexBtn = true;
		}
		$scope.activityModel = activity.self;
		//select pond, show prize
		var currentPondSelectTag = null;
		var highlight = function(tag){
			//
			MIS.Util.addClass(tag, 'highlight');
		}
		var disHighlight = function(tag){
			//
			MIS.Util.removeClass(tag, 'highlight');
		}
		$scope.selectPond = function(pond, event){
			var tag = event.currentTarget || event.srcElement;
			if(currentPondSelectTag){
				disHighlight(currentPondSelectTag);
			}
			currentPondSelectTag = tag;
			highlight(tag);
			showPondPrize(pond);
		}
		//init a new pond object
		$scope.currentPond = null;
		$scope.currentPrize = null;

		var showPondPrize = function(pond){
			$scope.currentPond = pond;
			$scope.showPrize = true;
		}
		var hidePondPrize = function(){
			$scope.currentPond = null;
			$scope.showPrize = false;
		}
		$scope.cancel = function(){
			$scope.go('/role_10_3')
		}
		$scope.gotoSet = function(){
			$scope.go('/role_10_3/set_prize_A/' + activity.self.activityId);
		}
		$scope.prizeRecord = function(){
			var id = activity.self.activityId;
			$scope.go('/role24/'+id);
		}
	}
])


activityMgt.createRoute('中奖记录', '/role24/:activityId', 'pages/prizeRecordMgt.html', 'prizeRecordMgtController', null, true);
activityMgt.createRoute('中奖记录', '/role24', 'pages/prizeRecordMgt.html', 'prizeRecordMgtController');
var prizeRecordMgtController = userMgt.createController('prizeRecordMgtController', ['$scope', '$compile', 'publicService', '$routeParams',
	function($scope, $compile, publicService, $routeParams){
		var activityId = $routeParams.activityId || '';
		var manager = new MIS.PrizeRecordMgt($scope, publicService.promise, activityId);
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
			if($scope.searchStr != '' && $scope.searchStr != undefined){
				manager.queryCellphone($scope.searchStr);
			}else{
				loading.close();
			}
		}
		// paging change function
		$scope.changePage = function(page){
			manager.getPage(page, $scope.myConf.itemsPerPage);
		}

		$scope.back = function(){
			$scope.go('/role_10_3/review');
		}

		$scope.exportShow = function(){
			$scope.phaseNumber='';
			$scope.errorMsg='';
			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '导出奖期'
							}
						},
						{
							tag: 'input',
							ngModel: 'phaseNumber',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'self',
							ngShow: 'errorMsg',
							attr: {
								innerHTML: '{{errorMsg}}',
								class: 'errorMsg'
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
								var reg = /^[1-9]\d*$/;
								if(!reg.test($scope.phaseNumber)){
									$scope.errorMsg = '请输入正确的开奖期数';
									$scope.$apply();
									return
								}
								$scope.errorMsg = '';
								manager.exportExcelOnServer(activityId, $scope.phaseNumber)
								popWindowCreate.close();
								$scope.$apply();
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								$scope.$apply();
							}
						}
					]
				]
			}, $scope, $compile);
		}

		if(activityId != ''){
			manager.getPage(0,$scope.myConf.itemsPerPage);
		}
	}	
])

//设置开奖
activityMgt.createRoute('设置开奖', '/role_10_3/set_prize_A/:activityId', 'pages/prize_set_A.html', 'prize_set_A_controller', null, true);
var prize_set_A_controller = activityMgt.createController('prize_set_A_controller', ['$scope', '$compile', 'publicService', '$routeParams', 
	function($scope, $compile, publicService, $routeParams){
		var activityId = $routeParams.activityId;
		//listen data change
		var useGrid = false;
		var manager = new MIS.Prize_A_mgt($scope, publicService.promise, $compile, activityId, useGrid);

		manager.getPage(0, 10);
		var currentObj = null;
		$scope.changeSelect = function(obj){
			if(!currentObj){
				currentObj = obj;
				return;
			}
			currentObj.self._selected = false;
			if(currentObj.self.phaseId == obj.self.phaseId){
				currentObj = null;
			}else{
				currentObj = obj;
			}
		}
		//设置指数
		$scope.setIndex = function(){
			$scope.stockIndexError = false;
			$scope.errorMsg = '';
			if(!currentObj){
				MIS.selectPop();
				return;
			}
			$scope.cloneIndexObj = currentObj.createCloneIndex();

			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				title: {
					txt: '设置上证指数'
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '<span style="color:red">*</span>上证指数:'
							}
						},
						{
							tag: 'input',
							ngModel: 'cloneIndexObj.stockIndex',
							attr:{
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '<span style="color:red">*</span>指数日期:'
							}
						},
						{
							tag: 'input',
							ngModel: 'cloneIndexObj.stockIndexDay',
							attr:{
								type: 'text'
							},
							datetime:{
								datetimeId: 'prize_A_stockIndexDay',
								datetimeModel: 'cloneIndexObj.stockIndexDay',
								hasTime: false
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '错误:',
								class: 'errorText'
							},
							ngShow: 'stockIndexError'
						},
						{
							tag: 'label',
							attr: {
								innerHTML: '{{errorMsg}}',
								class: 'errorText'
							},
							ngShow: 'stockIndexError'
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '确认'
							},
							clickEvt: function(){
								//$scope.pondModel
								var validate = currentObj.checkStockIndex($scope.cloneIndexObj);
								$scope.stockIndexError = false;
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									$scope.stockIndexError = true;
									$scope.$apply();
									return;
								}
								manager.setStockIndex($scope.cloneIndexObj);
								popWindowCreate.close();
								$scope.$apply();
								currentObj = null;
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								$scope.$apply();
								currentObj = null;
							}
						}
					]
				]
			}, $scope, $compile);//end pop
		}

		//设置中奖号码
		$scope.setLuckyNumber = function(){
			$scope.stockIndexNumError = false;
			$scope.errorMsg = '';
			if(!currentObj){
				MIS.selectPop();
				return;
			}
			$scope.cloneNumberObj = currentObj.createClonePrizeNumber();

			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				title: {
					txt: '设置中奖号码'
				},
				contentList:[
					[
						{
							tag: 'self',
							ngRepeat: "prizeNum in cloneNumberObj.prizeList",
							attr: {
								innerHTML: 
									'<label>' +
										'{{prizeNum.name}}:' + 
									'</label>' +
									'<input ng-model="prizeNum.number" type="text"></input>'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '参与奖:'
							},
						},
						{
							tag: 'input',
							ngModel: 'cloneNumberObj.last',
							attr: {
								type:'text'
							}
						}
					],
					[
						{
							tag: 'span',
							ngClick: 'subAdd()',
							attr:{
								class: 'subAdd'
							}
						},
						{
							tag: 'span',
							ngClick: 'delPrizeNum()',
							attr:{
								class: 'subDel'
							}
						}
					],
					[
						{
							tag: 'self',
							attr: {
								innerHTML: '错误：{{errorMsg}}',
								class: 'errorText'
							},
							ngShow: 'stockIndexNumError'
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '确认'
							},
							clickEvt: function(){
								//$scope.pondModel
								var validate = currentObj.checkLuckyNumber($scope.cloneNumberObj);
								$scope.stockIndexNumError = false;
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									$scope.stockIndexNumError = true;
									$scope.$apply();
									return;
								}
								manager.setPrizeNumber($scope.cloneNumberObj);
								popWindowCreate.close();
								$scope.$apply();
								currentObj = null;
							}
						},
						{
							tag: 'button',
							attr: {
								innerHTML: '取消'
							},
							clickEvt: function(){
								popWindowCreate.close();
								$scope.$apply();
								currentObj = null;
							}
						}
					]
				]
			}, $scope, $compile);//end pop
		}

		$scope.subAdd = function(){
			currentObj.addPrizeNumber($scope.cloneNumberObj);
		}
		$scope.delPrizeNum = function(){
			currentObj.delPrizeNumber($scope.cloneNumberObj);
		}

		$scope.submitEvent = function(){
			if(!currentObj){
				MIS.selectPop();
				return;
			}
			manager.submitEvent(currentObj);
		}

		$scope.showDetail = function(phaseIndex){
			manager.showPhaseDetail(activityId, phaseIndex);
		}

		$scope.back = function(){
			$scope.go('/role_10_3/review');
			//log
		}
		$scope.showProdName=function(e){
			var clientX = e.clientX;
			var clientY = e.clientY;
			var text = e.currentTarget.textContent;
			MIS.Util.showText(clientX, clientY, text);
		}
		$scope.hideProdName=function(){
			MIS.Util.hideText();
		}
	}
])