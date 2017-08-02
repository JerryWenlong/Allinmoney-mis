var productShelves = new MIS._Angular('productShelves', []);

productShelves.createRoute('产品上架', '/role11/shelves', 'pages/productShelves.html', 'productShelvesController', null, true);
var productShelvesController = productShelves.createController('productShelvesController', [
	'$scope', 'publicService', 
	function($scope, publicService){
        var divInfo = [
            '产品信息',
            // '产品开发设计',
            // '产品销售控制',
            // '产品销售控制',
            // '控制串',
			'产品详情',
			'产品费率'
        ];
		$scope.pageTitle = "产品上架";
		$scope.divFlag = 0;
        $scope.pageSubtitle = divInfo[$scope.divFlag];
        $scope.preBtn = 1;
		$scope.nextBtn = 0;
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

		var productShelves = new MIS.ProductShelves($scope, publicService.promise);
		var product = productShelves.product;
		$scope.productModel = product.productObj;
		$scope.productDetailList = product.productObj.details; // details
		if($scope.productDetailList.length <= 0){
			var defaultDetail = $scope.createDetail();
			$scope.productDetailList.push(defaultDetail);
		}

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
				$scope.fareModel.fareRatio = null;
				$scope.fareModel.fixedFare = null;
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

		var shelfSuccessFn=function(){
			//popup
			var popWindow = new MIS.Popup({
				w: 150,
				h: 115,
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '产品添加成功'
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
								$scope.go('/role11');
								$scope.$apply();
							}
						}
					]
				]
			});
			//$scope.go('/role11');
		};
		var shelfFailedFn=function(){
			//popup
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
			var detailList = [];
			$scope.productDetailList.forEach(function(detail){
				if(detail.prodInfo){// if prodInfo != '' , then add to product
					detailList.push(detail.randerRequestData());
				}
			});
			productShelves.product.productObj.details = detailList;
			productShelves.shelfProduct(shelfSuccessFn, shelfFailedFn, checkFailed);
		}
		$scope.cancel = function(){
			$scope.go('/role11');
		}	
	}]);

MIS.ProductShelves = MIS.derive(null, {
	create: function($scope, publicPromise, product){
		this.scope = $scope;
		this.promise = publicPromise;
		this.product = product? product : new MIS.Product();
		this.errTip = '';
	},
	checkValue:function(){
		var result = true;
		for(var item in this.product.productObj){
			if(this.product.productObj[item].hasOwnProperty('checked')){
				this.product.validate(this.product.productObj[item])
				if(!this.product.productObj[item].checked){
					this.errTip = this.product.productObj[item].validateMsg;
					result = false;
				}
			}
		}
		return result;
	},
	shelfProduct: function(success, failed, checkFailed){
		var that = this;
		if(!this.checkValue()){
			//todo
			checkFailed();
			return false;
		}
		var data = this.product.renderRequestCodeData();
		// console.log(data);
		this.promise({
			serverName:'mgtProductService',
			apiName:'productCode',
			method:'post',
			head:{
				'content-type':'application/json',
			},
			data: data
		}).then(function(response) {
			// success
			success();
		}, function(error) {
			// falied
			failed();
		});
	},
	setTa:function(){
		//	
	},
	saveEditedProduct:function(success, failed, checkFailed){
		var that = this;
		if(!this.checkValue()){
			//todo
			checkFailed();
			return false;
		};
		var data = this.product.renderRequestCodeData();
		this.promise({
			serverName:'mgtProductService',
			apiName:'productCode',
			method:'put',
			head:{
				'content-type':'application/json',
			},
			urlStr: "{0}/{1}/" + data.prodCodeId,
			data: data
		}).then(function(response){
			//success
			if(response.data['error']==0){
				success();
			}else{
				failed();
			}
		},function(){
			//failed
			failed();
		})
	},
	updateIssuedAt: function(prodCodeId, issuedAt, success, failed, checkFailed){
		var that = this;
		if(!this.checkValue()){
			//todo
			checkFailed();
			return false;
		};
		var updateIssuedAtValue = null;
		if(issuedAt){
			updateIssuedAtValue = issuedAt.replace(' ', 'T');
		}
		var data = {
			issuedAt: updateIssuedAtValue
		}
		this.promise({
			serverName:'mgtProductService',
			apiName:'productCode',
			method:'put',
			head:{
				'content-type':'application/json',
			},
			urlStr: "{0}/{1}/" + prodCodeId,
			data: data
		}).then(function(response){
			//success
			if(response.data['error']==0){
				success('产品开始时间设置成功');
			}else{
				failed();
			}
		},function(){
			//failed
			failed();
		})
	}
}, {})