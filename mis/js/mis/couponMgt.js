var couponMgt = new MIS._Angular('couponMgt', []);
couponMgt.createRoute('优惠券管理', '/role81', 'pages/couponMgt.html', 'couponMgtController');
var couponMgtController = couponMgt.createController('couponMgtController', ['$scope', '$compile', 'publicService', 
	function ($scope, $compile, publicService){
		$scope.title = '优惠券管理';
		var couponManager = new MIS.CouponManager($scope, publicService.promise);
		var loading = new MIS.Popup({
			loadingTxt: 'Loading'
		});
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		$scope.gridOptions = couponManager.gridOptions;
		// init grid data
		$scope.gridOptions.data = [];
		// get first page
		couponManager.getPage($scope.myConf.currentPage, $scope.myConf.itemsPerPage);
		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
			loading.close();
		});

		$scope.newCoupon = function(){
			$scope.go('/role81/create');
		}
		$scope.reviewCoupon = function(){
			if(MIS.currentSelectedCoupon){
				$scope.go('/role81/review');	
			}
		}

		// paging change function
		$scope.changePage = function(page){
			loading.popup();
			MIS.currentSelectedCoupon = null;
			couponManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		// select
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedCoupon = row.entity;
			}else{
				MIS.currentSelectedCoupon = null;
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
		};
		$scope.activeCoupon = function(){
			if(MIS.currentSelectedCoupon){
				loading.popup();
				couponManager.activeCoupon(MIS.currentSelectedCoupon.couponObj.couponId, MIS.currentSelectedCoupon.couponObj.urgentFlag, function(){
					loading.close();
				})
			}
		}

	}
]);
couponMgt.createRoute('新增优惠券', '/role81/create', 'pages/createCoupon.html', 'couponCreateController', null, true);
var couponCreateController = couponMgt.createController('couponCreateController', ['$scope', '$compile', 'publicService', 
	function($scope, $compile, publicService){
		//get new experience product
		var couponManager = new MIS.CouponManager($scope, publicService.promise);

		$scope.investCondition = '元≤X≤';
		var coupon = new MIS.Coupon();
		$scope.couponObj = coupon.couponObj;
		$scope.disabledProdTerm = function(){
			if(!$scope.couponObj.productList)
				return false;
			var res = false;
			$scope.couponObj.productList.list.forEach(function(item){
				if(item.checked){
					$scope.couponObj.prodTerm.value = '';
					res = true;
					return;
				}
			})
			return res;
		}
		// init product list
		couponManager.getAllSellingProductList(function(productList){
			if(productList.length > 0){
				coupon.initProductList(productList);
			}else{
				// no product
			}
		})
		

		$scope.submitCreateCoupon = function(){
			if(validate()){ 
				couponManager.createCoupon($scope.couponObj, function(){
					// success callback
					$scope.go('role81');
				})
			}else{
				// invalidate input
			}
		};

		$scope.checkTitle = function(checkNull){
			var result = false;
			var val = $scope.couponObj.title.value;
			var rule = /^(\w|[\u4e00-\u9fa5]|.){0,64}$/; 
			if(!checkNull && val == ""){
				$scope.couponObj.title.error = false;
			}
			if(rule.test(val) && val != ""){
				$scope.couponObj.title.error = false;
				return true
			}else{
				$scope.couponObj.title.error = true;
				return false
			}
		}

		$scope.checkValue = function(checkNull){
			var result = false;
			var val = $scope.couponObj.value.value;
			var rule;
			// if($scope.couponObj.categoryId.value() == 8){
			// 	rule = /^(\d+|\d+\.\d{1,8})$/;
			// }else{
			// 	rule = /^[1-9]\d{0,8}$/;
			// }
			rule = /^(\d+|\d+\.\d{1,8})$/;
			if(!checkNull && val == ""){
				$scope.couponObj.value.error = false;
			}
			if(rule.test(val)){
				$scope.couponObj.value.error = false;
				return true
			}else{
				$scope.couponObj.value.error = true;
				return false
			}
		}

		$scope.checkInvestMin = function(checkNull){
			var result = false;
			var val = $scope.couponObj.minInvestAmount.value;
			var rule = /^[1-9]\d{0,8}$/;
			if(!checkNull  && val == ""){
				$scope.couponObj.maxInvestAmount.error = false
				return true;
			}else if(rule.test(val)){
				$scope.couponObj.maxInvestAmount.error = false
				return true;
			}else{
				$scope.couponObj.maxInvestAmount.error = true
				return false
			}
		}
		$scope.checkInvestMax = function(checkNull){
			var result = false;
			var val = $scope.couponObj.maxInvestAmount.value;
			var rule = /^[1-9]\d{0,8}$/;
			if(!checkNull  && val == ""){
				$scope.couponObj.maxInvestAmount.error = false
				return true;
			}else if(rule.test(val)){
				$scope.couponObj.maxInvestAmount.error = false
				return true;
			}else{
				$scope.couponObj.maxInvestAmount.error = true
				return false
			}
		}

		// var checkInvest = function(){
		// 	var min = $scope.couponObj.minInvestAmount.value;
		// 	var max = $scope.couponObj.maxInvestAmount.value;
			
		// }

		$scope.checkTerm = function(checkNull){
			var result = false;
			var val = $scope.couponObj.term.value;
			var rule = /^[1-9]\d{0,8}$/;
			if(!checkNull && val == ""){
				$scope.couponObj.term.error = false;
			}
			if(rule.test(val)){
				$scope.couponObj.term.error = false;
				return true
			}else{
				$scope.couponObj.term.error = true;
				return false
			}
		}

		$scope.checkCountPlanned = function(checkNull){
			var result = false;
			var val = $scope.couponObj.countPlanned.value;
			var rule = /^[1-9]\d{0,10}$/;
			if(!checkNull && val == ""){
				$scope.couponObj.countPlanned.error = false;
			}
			if(rule.test(val)){
				$scope.couponObj.countPlanned.error = false;
				return true
			}else{
				$scope.couponObj.countPlanned.error = true;
				return false
			}
		}

		$scope.checkDescription = function(checkNull){
			var result = false;
			var val = $scope.couponObj.description.value;
			var rule =  /^(\w|[_\-]|\s|[\u4e00-\u9fa5]){0,64}$/;
			if(!checkNull && val == ""){
				$scope.couponObj.description.error = false;
			}
			if(rule.test(val)){
				$scope.couponObj.description.error = false;
				return true
			}else{
				$scope.couponObj.description.error = true;
				return false
			}
		}

		$scope.checkProdTerm = function(checkNull){
			var result = false;
			var val = $scope.couponObj.prodTerm.value;
			var rule = /^[1-9]\d{0,8}$/;
			if(!checkNull && val == ""){
				$scope.couponObj.prodTerm.error = false;
			}
			if(rule.test(val)){
				$scope.couponObj.prodTerm.error = false;
				return true
			}else{
				$scope.couponObj.prodTerm.error = true;
				return false
			}
		}

		$scope.checkIssueBegin = function(checkNull){
			var result = false;
			var val = $scope.couponObj.issueBegin.value;
			if(!checkNull && val == ""){
				$scope.couponObj.issueBegin.error = false;
				return true
			}
			if(MIS.Util.validationDateTime(val)){
				$scope.couponObj.issueBegin.error = false;
				return true
			}else{
				$scope.couponObj.issueBegin.error = true;
				return false
			}
			
		}
		$scope.checkIssueEnd = function(checkNull){
			var result = false;
			var val = $scope.couponObj.issueEnd.value;
			if(!checkNull && val == ""){
				$scope.couponObj.issueEnd.error = false;
				return true
			}
			if(MIS.Util.validationDateTime(val)){
				$scope.couponObj.issueEnd.error = false;
				return true
			}else{
				$scope.couponObj.issueEnd.error = true;
				return false
			}
			
		}

		var validate = function(){
			var result = true;
			if(!$scope.checkTitle(true))
				result = false;
			if(!$scope.checkValue(true))
				result = false;
			if(!$scope.checkTerm(true))
				result = false;
			if(!$scope.checkCountPlanned(true))
				result = false;
			if(!$scope.checkDescription(true))
				result = false;
			if(!$scope.checkInvestMin(false))
				result = false;
			if(!$scope.checkInvestMax(false))
				result = false;
			if(!$scope.checkIssueBegin(false))
				result = false;
			if(!$scope.checkIssueEnd(false))
				result = false;
			return result;
		}

		$scope.jelloElement = function(obj){
			debugger;
		}
		$scope.selectedProductsFilter = function(item){
			return item.checked
		}
		$scope.cancelSelect = function(item){
			item.checked = false;
		}
		$scope.cancel = function(){
			$scope.go('/role81');
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
]);

couponCreateController.filter('couponStatusAuditFilter', function(){
	var couponStatusList = MIS.dictData.couponStatusAudit;
	return function (input) {
		var result = '';
		couponStatusList.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});

couponMgt.createRoute('查看优惠券', '/role81/review', 'pages/reviewCoupon.html', 'couponReviewController', null, true);
var couponReviewController = couponMgt.createController('couponReviewController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var couponManager = new MIS.CouponManager($scope, publicService.promise);
		$scope.investCondition = '元≤X≤';
		var coupon = MIS.currentSelectedCoupon;
		$scope.couponObj = coupon.couponObj;
		$scope.back=function(){
			MIS.currentSelectedCoupon = null;
			$scope.go('/role81')
		}
	}
]);

couponMgt.createRoute('升息令牌管理', '/role82', 'pages/interestToken.html', 'interestTokenController');
var interestTokenController = couponMgt.createController('interestTokenController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var interestTokenManager = new MIS.InterestTokenMgt($scope, publicService.promise);
		$scope.interestToken = null;
		$scope.displayList = [];

		//获取令牌
		interestTokenManager.getInterestToken(
			function(interestToken){
				$scope.displayList = interestToken.tokenObj.displayValue;
				$scope.interestToken = interestToken;
			}
		)

		//删除令牌
		$scope.deleteInterestToken = function(currentIndex){
			$scope.interestToken.deleteValue(currentIndex);
			$scope.displayList = $scope.interestToken.tokenObj.displayValue;
		}
		//编辑令牌
		$scope.editInterestToken = function(currentIndex, isInsert){
			$scope.setError = false;
			$scope.errorMsg = '';
			$scope.cloneValueObj = $scope.interestToken.cloneValueObj(currentIndex, isInsert);

			var popWindowCreate = new MIS.Popup({
				w: 374,
				coverCls: 'misPopupCover',
				cls: 'misPopup popOne',
				title: {
					txt: '设置升息令牌'
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '产品类型'
							}
						},
						{
							tag: 'select',
							ngModel:"cloneValueObj.prodTerm.item",
							ngOptions: "item as item.name for item in cloneValueObj.prodTerm.list track by item.value",
							attr: {
								type: 'text',
								style: 'width: 116px;'
							}
						}
					],
					[
						{
							tag: 'self',
							ngRepeat: "token in cloneValueObj.interests",
							attr: {
								innerHTML: 
									'<label>' +
										'{{token.name}}:' + 
									'</label>' +
									'<input ng-model="token.value" type="text"></input>'
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
							ngClick: 'subDel()',
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
							ngShow: 'setError'
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
								var validate = $scope.interestToken.checkToken($scope.cloneValueObj);
								$scope.setError = false;
								if(!validate.flag){
									$scope.errorMsg = validate.msg;
									$scope.setError = true;
									$scope.$apply();
									return;
								}
								if(isInsert){
									$scope.interestToken.saveAddValue($scope.cloneValueObj);
								}else{
									$scope.interestToken.saveEditValue(currentIndex, $scope.cloneValueObj);
								}
								$scope.displayList = $scope.interestToken.tokenObj.displayValue;
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
			}, $scope, $compile);//end pop
		}

		$scope.subAdd = function(){
			$scope.interestToken.cloneAdd($scope.cloneValueObj)
		}
		$scope.subDel = function(){
			$scope.interestToken.cloneDel($scope.cloneValueObj)
		}
		$scope.save = function(){
			interestTokenManager.addInterestToken($scope.interestToken.tokenObj)
		}
	}
])