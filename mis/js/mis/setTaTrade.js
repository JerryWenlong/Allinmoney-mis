var productShelves = new MIS._Angular('setTaTrade', []);
productShelves.createRoute('TA交易参数', '/role24', 'pages/setTaTrade.html', 'setTaTradeController' );
var productShelvesController = productShelves.createController('setTaTradeController', [
    '$scope', 'publicService', '$route',
    function($scope, publicService, $route){
        var setTaTrade = new MIS.SetTaTrade($scope, publicService.promise);
        var product = setTaTrade.product;
        $scope.taTradeModel = product.prodTradeObj;
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
        var setTaTradeSuccessFn = function(){
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
        var setTaTradeFailedFn = function(){
            //popup
        };
        $scope.submit = function(){
            setTaTrade.setTrade(setTaTradeSuccessFn, setTaTradeFailedFn, checkFailed);
        };
        $scope.checkItem = function(obj){
            var result = setTaTrade.product.validate(obj);
            obj.errorFlag = !result;
            return result;
        };
        $scope.showError = function(obj){
            return !obj.errorFlag;
        };
    }]);

MIS.SetTaTrade = MIS.derive(null, {
    create: function($scope, publicPromise){
        this.scope = $scope;
        this.promise = publicPromise;
        this.product = new MIS.TaTrade();
    },
    checkValue:function(){
        var result = true;
        for(var item in this.product.prodTradeObj){
            if(this.product.prodTradeObj[item].hasOwnProperty('checked')){
                if(!this.product.prodTradeObj[item].checked){
                    result = false;
                    break;
                }
            }
        }
        return result;
    },
    setTrade: function(success, failed, check){
        var that = this;
        if(!this.checkValue()){
            check();
            //todo
            return false;
        }
        var data = this.product.renderRequestData();
        this.promise({
            serverName:'mgtProductService',
            apiName:'taTrade',
            method:'post',
            head:{
                'content-type':'application/json'
            },
            data: data
        }).then(function(response) {
            success();
		    // success
        }, function(error) {
            // failed
            failed();
        });
    },
}, {})