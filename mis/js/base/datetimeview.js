(function(angular){
'use strict';
angular.module( 'datetimeView', [] ).directive('myDatetime', [function(){
	return {
		restrict: "EA",
		scope:{
			datetimeId: '@datetimeId',
			dataModel:'=datetimeModel',
			dataValue:'@datetimeValue',
			dataCallback:'=callback',
			hasTime:'@hasTime',
		},
		link:function (scope, element, attrs, ctrl) {
			//
			var target = element[0];
			var callback = function(value){
				if(scope.dataValue){
					scope.dataModel[scope.dataValue] = value;
				}else{
					scope.dataModel = value;
				}
				target.focus();
				scope.$apply();
			};
			var datetime = null;
			target.onclick=function(e){
				var e = e || window.event;
				e.stopPropagation();
				if(scope.hasTime){
					datetime = new MIS.DateTime(target, scope.datetimeId, callback);
				}else{
					datetime = new MIS.DatePannel(target, scope.datetimeId, callback);
				}	
			
			}
		}
	}
}]);
})(angular)
