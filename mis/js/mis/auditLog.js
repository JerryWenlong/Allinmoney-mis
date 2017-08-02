var auditLog = new MIS._Angular('auditLog', []);
auditLog.createRoute('资金转出审核记录', '/role61', 'pages/auditLog.html', 'outAuditLogController');
var outAuditLogController = auditLog.createController('outAuditLogController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		$scope.title = "资金转出审核汇总";

		$scope.outAuditLogFlag = true;

		var auditLogManager = new MIS.FundLogManager($scope, publicService.promise, MIS.FundType.Out);
		$scope.statusList = auditLogManager.statusList;
		$scope.searchStatus = auditLogManager.searchStatus;

		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};
		// get first page
		auditLogManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);


		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.totalPages * data.pageSize;
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
			auditLogManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.export = function(){
			auditLogManager.exportExcelOnServer();
		}

}]);



auditLog.createRoute('资金转入审核记录', '/role62', 'pages/auditLog.html', 'inAuditLogController');
var inAuditLogController = auditLog.createController('inAuditLogController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		$scope.title = "资金转入审核汇总"
		
		$scope.inAuditLogFlag = true;

		var auditLogManager = new MIS.FundLogManager($scope, publicService.promise, MIS.FundType.In);
		$scope.statusList = auditLogManager.statusList;
		$scope.searchStatus = auditLogManager.searchStatus;
		// init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage:1
		};
		// get first page
		auditLogManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);


		// listen on the grid data change
		$scope.$on('dataChange', function(event, data){
			$scope.pageListData = data.currentPageList;
			$scope.myConf.totalItems = data.totalPages * data.pageSize;
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
			auditLogManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		$scope.export = function(){
			auditLogManager.exportExcelOnServer();
		}
		
}]);



auditLog.createRoute('产品审核记录', '/role63', 'pages/auditLog.html', 'prodAuditLogController');
var prodAuditLogController = auditLog.createController('prodAuditLogController', ['$scope', '$compile', 'publicService',
	function ($scope, $compile, publicService) {
		$scope.myConf = {};
		$scope.gridOptions = {}
		$scope.title = "产品审核汇总"
		
}]);
