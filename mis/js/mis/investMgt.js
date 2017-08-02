var investMgt = new MIS._Angular('investMgt', []);
investMgt.createRoute('设置活动', '/role11/createInvest', 'pages/invest.html', 'investCreateController', null, true);
var investCreateController = investMgt.createController('investCreateController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.InvestManager($scope, publicService.promise);

		var invest = MIS.currentSelectedProduct.invest; 
		// product 审核状态
		$scope.disableSave = MIS.currentSelectedProduct.productObj.review_status.value().toString() == 2? true:false;
		$scope.investModel = invest.investObj;
		
		$scope.save = function(){
			var validation = checkSubvention();
			if(!validation)
				return 
			var popWindow = new MIS.Popup({
					loadingTxt: 'Loading'
				});
			
			var data = invest.randerRequestData();
			manager.createInvest(data, function(){
				popWindow.close();
				MIS.currentSelectedProduct = null;
				$scope.go('/role11')
			}, function(){

			})
		}
		$scope.cancel = function(){
			MIS.currentSelectedProduct = null;
			$scope.go('/role11')
		}
		$scope.removeLastSubvention = function(){
			invest.removeLastSubvention();
		}
		var addSubvention = $scope.addSubvention = function(){
			invest.addSubvention();
		}
		// add new subvention
		// addSubvention();

		var checkSubvention = function(){
			// check series
			var series = invest.checkSubventionSeries();
			if(!series){
				return false
			}
			for(var i=0;i<invest.investObj.subventions.length;i++){
				var sub = invest.investObj.subventions[i];
				if(!sub.checked())
					return false;
			}
			return true;
		}

		$scope.isLast = function(sub){
			return invest.isLastSub(sub);
		}
	}
]);
investMgt.createRoute('设置活动', '/role11/updateInvest', 'pages/invest.html', 'investUpdateController', null, true);
var investUpdateController = investMgt.createController('investUpdateController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		var manager = new MIS.InvestManager($scope, publicService.promise);

		var invest = MIS.currentSelectedProduct.invest; 
		// product 审核状态
		$scope.disableSave = MIS.currentSelectedProduct.productObj.review_status.value().toString() == '2'? true:false;
		

		$scope.investModel = invest.investObj;
		$scope.enableFlagStr = invest.investObj.enableFlag? '激活':'非激活';
		
		$scope.save = function(){
			var validation = checkSubvention();
			if(!validation)
				return 

			var popWindow = new MIS.Popup({
					loadingTxt: 'Loading'
				});
			var data = invest.randerRequestData();

			manager.updateInvest(data, function(){
				popWindow.close();
				MIS.currentSelectedProduct = null;
				$scope.go('/role11')
			}, function(){

			})
		}
		$scope.cancel = function(){
			MIS.currentSelectedProduct = null;
			$scope.go('/role11')
		}
		$scope.removeLastSubvention = function(){
			invest.removeLastSubvention();
		}
		var addSubvention = $scope.addSubvention = function(){
			invest.addSubvention();
		}
		var checkSubvention = function(){
			// check series
			var series = invest.checkSubventionSeries();
			if(!series){
				return false
			}
			for(var i=0;i<invest.investObj.subventions.length;i++){
				var sub = invest.investObj.subventions[i];
				if(!sub.checked())
					return false;
			}
			return true	
		}
		$scope.isLast = function(sub){
			return invest.isLastSub(sub);
		}
	}
]);