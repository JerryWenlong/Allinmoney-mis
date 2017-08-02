var productShelves = new MIS._Angular('setTaBusiness', []);
productShelves.createRoute('TA业务', '/role25', 'pages/setTaBusiness.html', 'setTaBusinessController' );
var productShelvesController = productShelves.createController('setTaBusinessController', [
    '$scope', 'publicService', '$route',
    function($scope, publicService, $route){
        var setTaBusiness = new MIS.SetTaBusiness($scope, publicService.promise);
        var product = setTaBusiness.product;
        $scope.taBusinessModel = product.prodBusinessObj;
        var setTaBusinessSuccessFn = function(){
            var popWindow = new MIS.Popup({
                h: 100,
                w: 150,
                btnList: [
                    {
                        content: '返回',
                        clickEvent: function(){
                            $route.reload();
                        }
                    }
                ],
                content: ['提交处理成功']
            });
        };
        var setTaBusinessFailedFn = function(){
            //popup
        };
        var checkFailed = function(){
            var popWindow = new MIS.Popup({
                h: 100,
                w: 150,
                btnList: [
                    {
                        content: '继续检查'
                    }
                ],
                content: ['提交的内容有误']
            });
        };
        $scope.submit = function(){
            setTaBusiness.setBusiness(setTaBusinessSuccessFn, setTaBusinessFailedFn, checkFailed);
        };
        $scope.checkItem = function(obj){
            var result = setTaBusiness.product.validate(obj);
            obj.errorFlag = !result;
            return result;
        };
        $scope.showError = function(obj){
            return !obj.errorFlag;
        };
    }]);

MIS.SetTaBusiness = MIS.derive(null, {
    create: function($scope, publicPromise){
        this.scope = $scope;
        this.promise = publicPromise;
        this.product = new MIS.TaBusiness();
    },
    checkValue:function(){
        var result = true;
        for(var item in this.product.prodBusinessObj){
            if(this.product.prodBusinessObj[item].hasOwnProperty('checked')){
                if(!this.product.prodBusinessObj[item].checked){
                    result = false;
                    break;
                }
            }
        }
        return result;
    },
    setBusiness: function(success, failed, check){
        var that = this;
        if(!this.checkValue()){
            check();
            //todo
            return false;
        }
        var data = this.product.renderRequestData();
        this.promise({
            serverName:'mgtProductService',
            apiName:'taAllowBusiness',
            method:'post',
            head:{
                'content-type':'application/json',
            },
            data: data
        }).then(function(response) {
            success();
            // success
        }, function(error) {
            failed();
            // faild
        });
    },
}, {})
