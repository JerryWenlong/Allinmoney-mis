(function(angular){
'use strict';
angular.module( 'myTableList', [] ).directive('myTableList', [function(){
	return {
		restrict: "EA",
		scope:{
			tableId: '@tableId',
			tableData: '@tableData'
		},
		link:function (scope, element, attrs, ctrl) {
			//
			var sHtml = '';
		}
	}
}]);
})(angular)