(function(angular){
	'use strict'
	angular.module('dropdownCheckList',[]).directive('myDropdownCheckList', [function(){
		var htmlStr= 
		'<div ng-mouseleave="hideSelect()" class="my-check-select" style="display:inline-block">' +
            '<input type="text" placeholder="多选" ng-click="changeShow()" style="display:inline-block"/>'+
			'<ul class="options-pannel" ng-show="showMySelect" '+
				'style="padding-left: 3px;border: 1px solid gainsboro;margin-top:0;display:inline-block;position:absolute;overflow:auto;background:#FFF;width:{{width}}px;height:{{height}}px;" >' + 
				'<li class="options" ng-repeat="item in dataList" style="width:100%" >' +
					'<input type="checkbox" ng-model="item.checked"/>'+
					'<span>{{item.name}}</span>'+
				'</li>' +
			'</ul>' +
		'</div>';

		return {
			restrict: "EA",
			replace: true, //replace the element with tamplate
			template: htmlStr,
			scope:{
				dataList: '=optionsData',
				width: '@width',
				height: '@height',
			},
			link: function(scope, element, attrs, ctrl){
				var target = element[0];
				scope.changeShow = function(e){
					scope.showMySelect = !scope.showMySelect;
					var e = window.event || e;
					var target = e.srcElement||e.currentTarget;

					var sublins = target.parentNode.children;
					var ul = {};
					for(var i=0;i<sublins.length;i++){
						if(sublins[i].nodeName == 'UL'){
							ul = sublins[i]; 
							break;
						}
					}
					ul.style.left = target.offsetLeft+ 'px';
					ul.style.top = target.offsetTop + target.offsetHeight + 'px';
					console.log('left:'+target.offsetLeft+ ' top:'+ target.offsetTop)
				}
				scope.hideSelect = function() {
					scope.showMySelect=false;
				}
			}
		}
	}])
})(angular)