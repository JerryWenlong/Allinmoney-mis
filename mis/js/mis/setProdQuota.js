var productShelves = new MIS._Angular('setProdQuota', []);
productShelves.createRoute('setProdQuotaView', '/role26', 'pages/setProdQuota.html', 'setProdQuotaController' );
var productShelvesController = productShelves.createController('setProdQuotaController', [
    '$scope', 'publicService', '$route',
    function($scope, publicService, $route){
        $scope.divFlag = 0;
        $scope.preBtn = 1;
        $scope.nextBtn = 1;
        $scope.preContent = function(){
            $scope.divFlag --;
            if($scope.divFlag <=0){
                $scope.preBtn = 1;
                $scope.nextBtn = 0;
            }else{
                $scope.preBtn = 0;
                $scope.nextBtn = 0;
            }
        };
        $scope.nextContent = function(){
            $scope.divFlag ++;
            if($scope.divFlag >=4){
                $scope.preBtn = 0;
                $scope.nextBtn = 1;
            }else{
                $scope.preBtn = 0;
                $scope.nextBtn = 0;
            }
        };
        var prodQuota = new MIS.SetProdQuota($scope, publicService.promise);
        var product = prodQuota.product;
        $scope.prodQuotaModel = product.prodQuotaObj;
        var setQuotaSuccessFn = function(){
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
        var setQuotaFailedFn = function(){
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
            prodQuota.setQuota(setQuotaSuccessFn, setQuotaFailedFn, checkFailed);
        };
        $scope.checkItem = function(obj){
            var result = prodQuota.product.validate(obj);
            obj.errorFlag = !result;
            return result;
        };
        $scope.showError = function(obj){
            return !obj.errorFlag;
        };
    }]);

MIS.SetProdQuota = MIS.derive(null, {
    create: function($scope, publicPromise){
        this.scope = $scope;
        this.promise = publicPromise;
        this.product = new MIS.ProdQuota();
    },
    checkValue:function(){
        var result = true;
        for(var item in this.product.prodQuotaObj){
            if(this.product.prodQuotaObj[item].hasOwnProperty('checked')){
                if(!this.product.prodQuotaObj[item].checked){
                    result = false;
                    break;
                }
            }
        }
        return result;
    },
    setQuota: function(success, failed, check){
        var that = this;
        if(!this.checkValue()){
            check();
            return false;
        }
        var data = this.product.renderRequestData();
        this.promise({
            serverName:'mgtProductService',
            apiName:'productQuota',
            method:'post',
            data: data
        }).then(function(response) {
            success();
            // success
        }, function(error) {
            failed();
            // faild
        });
    },
    setTa:function(){
        //
    },
}, {})
