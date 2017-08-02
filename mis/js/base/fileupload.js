(function(angular){
'use strict';
angular.module('fileUpload', []).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope:{
            getFile: '=getFile'
        },
        link: function(scope, element, attrs, ngModel) {
            // var model = $parse(attrs.fileModel);
            // var modelSetter = model.assign;
            element.bind('change', function(event){
                // scope.$apply(function(){
                //     modelSetter(scope, element[0].files[0]);
                // });
                scope.file = (event.srcElement || event.target).files[0];
                if(scope.file){
                    scope.getFile(scope.file);
                }
            });
        }
    };
}]);
})(angular)