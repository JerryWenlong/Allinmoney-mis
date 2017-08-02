(function(angular){
	'use strict';
	angular.module( 'searchDownList', [] ).directive('searchDownList', ['$compile', function($compile){
		var htmlStr = 
			'<div class="my-searchdown">' + 
				'<input ng-model="dataValueDisplay" type="text" ng-change="dataChange()" id="{{inputId}}" ng-disabled="disableFlag">' + 
				'<ul ng-show="showSelect" class="options-pannel" >' +
					'<li ng-repeat="item in dataList" ng-mousedown="selectItem(item, $event)">' +
						'<span>{{item.name}}</span>'+
					'</li>' +
				'</ul>' +
			'</div>';

		return {
			restrict: "EA",
			replace: true,
			template: htmlStr,
			scope: {
				dataList: '=searchdataList',
				dataModel: '=searchdataModel',
				displayStr: '=displayValue',
				changeFun: '=changeFun',
				id: '@searchId',
				disableFlag: '=disableFlag'
			},
			link: function(scope, element, attrs, ctrl){
				scope.showSelect = false;
				if(scope.disableFlag){
					scope.dataValueDisplay = ''
				}else{
					scope.dataValueDisplay = scope.displayStr;
				}
				var bindClear = false;
				var inputId = scope.inputId = scope.id + '_input';
				
				scope.selectItem = function(item, event){
					var inputNode = document.getElementById(inputId);
					scope.dataModel = item.value;
					if(scope.disableFlag){

					}else{
						scope.dataValueDisplay = scope.displayStr =item.name;
					}
					scope.showSelect = false;
					MIS.Util.unbind(inputNode, 'blur', clear);
					bindClear=false;
				}
				scope.dataChange = function(){
					var inputNode = document.getElementById(inputId);
					scope.showSelect = true;
					scope.changeFun(scope.dataValueDisplay);
					if(!bindClear){
						MIS.Util.bind(inputNode, 'blur', clear);
						bindClear = true;
					}
				}
				var clear=function(event){
					var inputNode = document.getElementById(inputId);
					scope.dataValueDisplay = scope.displayStr = "";
					scope.dataModel = "";
					scope.showSelect = false;
					bindClear = false;
					MIS.Util.unbind(inputNode, 'blur', clear);
					$compile( htmlStr )( scope )
				}
			}
		}
	}]);
})(angular)