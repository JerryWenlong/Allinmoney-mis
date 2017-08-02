var showSettleError = new MIS._Angular('showSettleError',[
	'ui.grid',
	'ui.grid.edit',
	'ui.grid.cellNav',
	]);
showSettleError.createRoute('清算错误', '/role71/error', 'pages/showSettleError.html', 'showSettleErrorController');
var showSettleErrorController = showSettleError.createController('showSettleErrorController',[
	'$scope', '$http', '$q', '$interval','uiGridConstants', 'publicService','$window',
	function($scope, $http, $q, $interval, uiGridConstants, publicService, $window){
		$scope.settleExceptionObj = MIS.ErrorResults; // get from setSettleDetail while after socket get message as'EOF'
		$scope.accException = $scope.settleExceptionObj.account;
		$scope.bizException = $scope.settleExceptionObj.business;
        $scope.shrException = $scope.settleExceptionObj.taShare;
        $scope.dvdException = $scope.settleExceptionObj.dividend;
		$scope.accExceptionCount = 0;
		$scope.bizExceptionCount = 0;
        $scope.shrExceptionCount = 0;
        $scope.dvdExceptionCount = 0;

		$scope.currentErrorObj = null;//$scope.exceptionObj[errorType].errorObj;

		$scope.exceptionObj = {
			acc_type1: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q, 'scope': $scope, 'publicPromise': publicService.promise, 'errorType': '1', 'errorClass': 'AccountError'}),
			},
			acc_type2: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q, 'scope': $scope, 'publicPromise': publicService.promise, 'errorType': '2', 'errorClass': 'AccountError'}),
			},
			acc_type3: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q, 'scope': $scope, 'publicPromise': publicService.promise, 'errorType': '3', 'errorClass': 'AccountError'}),
			},
			acc_type4: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q, 'scope': $scope, 'publicPromise': publicService.promise, 'errorType': '4', 'errorClass': 'AccountError'}),
			},
			acc_type5: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q, 'scope': $scope, 'publicPromise': publicService.promise, 'errorType': '5', 'errorClass': 'AccountError'}),
			},
			biz_type1: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'1', 'errorClass': 'TradeError'}),
			},
			biz_type2: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'2', 'errorClass': 'TradeError'}),
			},
			biz_type3: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'3', 'errorClass': 'TradeError'}),
			},
			biz_type4: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'4', 'errorClass': 'TradeError'}),
			},
			biz_type5: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'5', 'errorClass': 'TradeError'}),
			},
			biz_type6: {
				hasError: false,
				errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'6', 'errorClass': 'TradeError'}),
			},
            shr_type1:{
                hasError: false,
                errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'1', 'errorClass': 'ShareError'})
            },
            shr_type2:{
                hasError: false,
                errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'2', 'errorClass': 'ShareError'})
            },
            shr_type3:{
                hasError: false,
                errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'3', 'errorClass': 'ShareError'})
            },
            shr_type4:{
                hasError: false,
                errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'4', 'errorClass': 'ShareError'})
            },
            dvd_type:{
                hasError: false,
                errorObj: new MIS.SettlementError({'q': $q,'scope': $scope, 'publicPromise': publicService.promise, 'errorType':'1', 'errorClass': 'DividendError'})
            },

		}

        var setCurrentError =function(currentError, flag){
            if($scope.currentErrorObj == null || flag == 1){
                $scope.currentErrorObj = currentError;
                $scope.currentErrorName = currentError.errorName;
            }
        };

		if($scope.accException.TA_ACCOUNT_NOT_IN_LOCAL_DB !=0){
			$scope.exceptionObj.acc_type1.hasError = true;
			setCurrentError($scope.exceptionObj.acc_type1.errorObj);
		}
		if($scope.accException.TA_RETURN_CODE_NOT_SUCCESS !=0){
			$scope.exceptionObj.acc_type2.hasError = true;
            setCurrentError($scope.exceptionObj.acc_type2.errorObj);
		}
		if($scope.accException.LOCAL_ACCOUNT_NOT_IN_02_FILE !=0){
			$scope.exceptionObj.acc_type3.hasError = true;
            setCurrentError($scope.exceptionObj.acc_type3.errorObj);
		}
		if($scope.accException.INVALID_TRANS_CFM_DATE_IN_02_FILE !=0){
			$scope.exceptionObj.acc_type4.hasError = true;
            setCurrentError($scope.exceptionObj.acc_type4.errorObj);
		}
		if($scope.accException.NULL_FIELDS_FOUND_IN_02_FILE !=0){
			$scope.exceptionObj.acc_type5.hasError = true;
            setCurrentError($scope.exceptionObj.acc_type5.errorObj);
		}
		if($scope.bizException.BIZ_NO_PAY !=0){
			$scope.exceptionObj.biz_type1.hasError = true;
            setCurrentError($scope.exceptionObj.biz_type1.errorObj);
		}
		if($scope.bizException.PAY_NO_BIZ !=0){
			$scope.exceptionObj.biz_type2.hasError = true;
            setCurrentError($scope.exceptionObj.biz_type2.errorObj);
		}
		if($scope.bizException.AMOUNT_SHARE_NOT_MATCH_03_FILE !=0){
			$scope.exceptionObj.biz_type3.hasError = true;
            setCurrentError($scope.exceptionObj.biz_type3.errorObj);
		}
		if($scope.bizException.NO_TRANS_BANK_CARD_PAY !=0){
			$scope.exceptionObj.biz_type4.hasError = true;
            setCurrentError($scope.exceptionObj.biz_type4.errorObj);
		}
		if($scope.bizException.EXCEPTIONAL_BIZ !=0){
			$scope.exceptionObj.biz_type5.hasError = true;
            setCurrentError($scope.exceptionObj.biz_type5.errorObj);
		}
		if($scope.bizException.AMOUNT_SHARE_NOT_MATCH_04_FILE !=0){
			$scope.exceptionObj.biz_type6.hasError = true;
            setCurrentError($scope.exceptionObj.biz_type6.errorObj);
		}

        if($scope.shrException.LOCAL_ACCOUNT_NOT_EXIST !=0){
            $scope.exceptionObj.shr_type1.hasError = true;
            setCurrentError($scope.exceptionObj.shr_type1.errorObj);
        }
        if($scope.shrException.LOCAL_TRANS_ACCOUNT_NOT_EXIST !=0){
            $scope.exceptionObj.shr_type2.hasError = true;
            setCurrentError($scope.exceptionObj.shr_type2.errorObj);
        }
        if($scope.shrException.LOCAL_PRODUCT_NOT_EXIST !=0){
            $scope.exceptionObj.shr_type3.hasError = true;
            setCurrentError($scope.exceptionObj.shr_type3.errorObj);
        }
        if($scope.shrException.TA_TOTAL_SHARE_LESS_THAN_AVAILABLE_SHARE !=0){
            $scope.exceptionObj.shr_type4.hasError = true;
            setCurrentError($scope.exceptionObj.shr_type4.errorObj);
        }
        if($scope.dvdException.LOCAL_ACCOUNT_NOT_EXIST !=0){
            $scope.exceptionObj.dvd_type.hasError = true;
            setCurrentError($scope.exceptionObj.dvd_type.errorObj);
        }


		//set default(first error type) gridOptions
		if($scope.currentErrorObj != null){
			$scope.gridOptions = $scope.currentErrorObj.gridOptions;
			$scope.currentErrorObj.getPage(1,10,{});
		}

		for(i in $scope.accException){
			if($scope.accException[i] != 0){
				$scope.accExceptionCount++;
			}
		}
		for(j in $scope.bizException){
			if($scope.bizException[j]!=0){
				$scope.bizExceptionCount++;
			}
		}
        for(k in $scope.shrException){
            if($scope.shrException[k]!=0){
                $scope.shrExceptionCount++;
            }
        }
        for(l in $scope.dvdException){
            if($scope.dvdException[l]!=0){
                $scope.dvdExceptionCount++;
            }
        }
		$scope.settleExceptionCount = $scope.accExceptionCount + $scope.bizExceptionCount + $scope.shrExceptionCount + $scope.dvdExceptionCount;



        var a = $window.document.getElementsByClassName('error_type').length;
        $scope.overflow_next = false;
        $scope.overflow_pre = false;
		if($scope.settleExceptionCount > 5){
            $scope.overflow_next = true;
            for(var nextDivIndex=5;nextDivIndex<a;nextDivIndex++){
                var nextDivObj = $window.document.getElementsByClassName('error_type')[nextDivIndex];
                nextDivObj.style.display = 'none';
            }
        }
        $scope.nextPart = function(){
            $scope.overflow_next = false;
            $scope.overflow_pre = true;
            for(var divIndex=0;divIndex<a;divIndex++){
                var divObj = $window.document.getElementsByClassName('error_type')[divIndex];
                if(divIndex<5){
                    divObj.style.display = 'none';
                }else{
                    divObj.style.display = 'block';
                }
            }
        };
        $scope.prePart = function(){
            $scope.overflow_next = true;
            $scope.overflow_pre = false;
            for(var divIndex=0;divIndex<a;divIndex++){
                var divObj = $window.document.getElementsByClassName('error_type')[divIndex];
                if(divIndex<5){
                    divObj.style.display = 'block';
                }else{
                    divObj.style.display = 'none';
                }
            }
        };
		
        $scope.myConf = {
            totalItems: 0,
            itemsPerPage: 10,
            currentPage:1
        };
    	$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
		});
        $scope.getErrorPage = function(errorType){
            setCurrentError($scope.exceptionObj[errorType].errorObj,1);

        	//$scope.currentErrorObj = $scope.exceptionObj[errorType].errorObj;
            $scope.gridOptions = $scope.currentErrorObj.gridOptions;
            $scope.currentErrorObj.getPage(1,10,{});
        };
        $scope.changePage = function(page){
			$scope.currentErrorObj.getPage(page, $scope.myConf.itemsPerPage,{});
		}

		$scope.saveEdit = function(){
            var popWindow = new MIS.Popup({
                loadingTxt: '正在保存...',
                notShow: false
            });
			$scope.currentErrorObj.saveEditData(function(response){
                var error = response.data['error'];
                if(error == 0){
                    popWindow.close();
                    var successWindow = new MIS.Popup({
                        w: 200,
                        h: 115,
                        contentList:[
                            [
                                {
                                    tag: 'label',
                                    attr: {
                                        innerHTML: '保存完毕'
                                    }
                                }
                            ],
                            [
                                {
                                    tag: 'button',
                                    attr: {
                                        innerHTML: '继续'
                                    },
                                    clickEvt: function(){
                                        successWindow.close();
                                    }
                                }
                            ]
                        ]
                    })
                }else{
                    var errorMsg = response.data['message'];
                    var errorWindow = new MIS.Popup({
                        w: 310,
                        h: 115,
                        contentList:[
                            [
                                {
                                    tag: 'label',
                                    attr: {
                                        innerHTML: errorMsg
                                    }
                                }
                            ],
                            [
                                {
                                    tag: 'button',
                                    attr: {
                                        innerHTML: '确定'
                                    },
                                    clickEvt: function(){
                                        errorWindow.close();
                                    }
                                }
                            ]
                        ]
                    });
                }
                $scope.currentErrorObj.refresh();

            },function(error){
                var errorWindow = new MIS.Popup({
                    w: 460,
                    h: 115,
                    contentList:[
                        [
                            {
                                tag: 'label',
                                attr: {
                                    innerHTML: '系统错误'
                                }
                            }
                        ],
                        [
                            {
                                tag: 'button',
                                attr: {
                                    innerHTML: '确定'
                                },
                                clickEvt: function(){
                                    errorWindow.close();
                                }
                            }
                        ]
                    ]
                });
                $scope.currentErrorObj.refresh();
            });
		}
		$scope.goBack = function(){
			$scope.go('back');
		}
    }
]);
showSettleErrorController.filter('fixFlagFilter', function(){
	var genderHash = {
		0: '否',
		1: '是',
	}
	return function(input){
		if(typeof(input) != 'number'){
			return '';
		}else{
			return genderHash[input]
		}
	}
});
showSettleErrorController.filter('taFilter', function(){
    var taList = MIS.dictData.taNoList.list;
    return function(input){
        var result = '';
        taList.forEach(function(item){
            if(item.value == input)
                    result = item.name
        })
        return result
    }

})
