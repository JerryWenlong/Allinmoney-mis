var home = new MIS._Angular('home', []);
home.createRoute('首页', '/', 'pages/home.html', 'homeController');
home.createController('homeController',['$scope', function($scope) {
	// body...
	$scope.gotoOrderPage = function(){
		// $scope.go('/role41')
	}
	$scope.gotoUserPage = function(){
		// $scope.go('/role21')
	}
	$scope.gotoProdPage = function(){
		// $scope.go('/role11')
	}
	$scope.gotoFinancePage = function(){
		// $scope.go('/role31')
	}
	$scope.gotoAuditLogPage = function(){
		// $scope.go('/role61')
	}
	$scope.gotoSettlementPage = function(){
		// $scope.go('/role71')
	}
	$scope.gotoFundAuditPage = function(){
		// $scope.go('/role51')
	}
}])