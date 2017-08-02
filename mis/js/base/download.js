(function(angular){
'use strict';
angular.module( 'downFile', [] ).directive('downFile', ['$http',function ($http) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attr) {
            var ele = $(element);
            ele.on('click', function (e) {
                ele.prop('disabled', true);
                e.preventDefault();
                $http({
                    url: attr.downFile,
                    method: 'get',
                    responseType: 'arraybuffer'
                }).success(function (data, status, headers) {
                    ele.prop('disabled', false);
                    var type;
                    switch (attr.downFileType) {
                        case 'xlsx':
                            type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                            break;
                    }
                    if (!type) throw '无效类型';
                    saveAs(new Blob([data], { type: type }), decodeURI(headers()["x-filename"]));  // 中文乱码
                }).error(function (data, status) {
                    alert(data);
                    ele.prop('disabled', false);
                });
            });
        }
    };
}]);
})(angular)