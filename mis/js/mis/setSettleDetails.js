var settleDetails = new MIS._Angular('settleDetails', []);
settleDetails.createRoute('清算', '/role71', 'pages/setSettleDetails.html', 'settleDetailsController' );
var settleDetailsController = settleDetails.createController('settleDetailsController', [
    '$scope', 'publicService', '$route','$interval', '$window',
    function($scope, publicService, $route, $interval, $window){
        $scope.disableHandleError = true;//disabled handle error button;
        $scope.flow_flag = -1;
        $scope.phase_flag = -1;

        $scope.messageList = [];
        var start = -1;
        var end = -1;
        //生成清算日志
        $scope.settleProcsWritter = new MIS.handleSettleProcs({'window': $window ,'scope': $scope ,'divId': 'settle-log'});
        var settleWork = new MIS.Settle($scope,publicService.promise);

        var timer = null;
        $scope.hasSettled = false;
        var popWindow0 = new MIS.Popup({//清除settle临时数据
            loadingTxt: '正在清除...',
            notShow: true
        });
        var popWindow1 = new MIS.Popup({//清除临时数据失败
            w: 260,
            h: 115,
            contentList:[
                [
                    {
                        tag: 'label',
                        attr: {
                            innerHTML: '清除失败...'
                        }
                    }
                ],
                [
                    {
                        tag: 'button',
                        attr: {
                            innerHTML: '确认'
                        },
                        clickEvt: function(){
                            popupWindow1.close();
                        }
                    }
                ]
            ],
            notShow: true
        });
        $scope.clear = function(){
            popWindow0.popup();
            settleWork.clearLastSettlement(function(){
                popWindow0.close()
            },function(){
                popWindow1.popup();
            });
            resetPage();
        };

        var resetPage = function(){
            $scope.settleProcsWritter.clear();
            $scope.flow_flag = -1;
            $scope.phase_flag = -1;
            timer = null;
            $scope.messageList = [];
            start = -1;
            end = -1;
            $scope.showError = false;
        }

        var popWindow = new MIS.Popup({
            loadingTxt: '正在处理...',
            notShow: true
        });
        $scope.doSettle = function(){
            resetPage();
            popWindow.popup();
        	settleWork.doSettle(function(){
                // success, do nothing.
                // when get EOF will close the popup window
            }, function(errorMsg){
                
            });
            $scope.hasSettled = true;
        };
        var handleFn = function(){
            // $scope.messageList = data.settleFlowData;
            var len = $scope.messageList.length;
            var str = '';
            if(len > 0) {
                str = $scope.messageList[len - 1];
                var results = str.split(':');
                var key = results[0];
                var msg = results[1];
                if(key=="EOF"){
                    str = $scope.messageList[len - 2];
                    // get last message before 'EOF', then show message
                    var results = str.split(':');
                    var flow = results[0];
                    var phase = results[1];
                    MIS.SettleProcsObj.forEach(function(item, index){
                    if(flow == item.flow && phase == item.phase){
                        end = index;
                            if(end-start>=1){
                                $scope.flow_flag = item.flow_flag;
                                $scope.phase_flag = item.phase_flag;
                                for(var i=start+1; i<=end; i++){
                                    $scope.settleProcsWritter.showProcs(MIS.SettleProcsObj[i].desc);
                                }
                                start = end;
                                //$scope.settleProcsWritter.showProcs(item.desc);
                            }
                        }
                    })

                    var messageWindow = new MIS.Popup({
                        w: msg.length*12 + 70,
                        h: 115,
                        contentList:[
                            [
                                {
                                    tag: 'label',
                                    attr: {
                                        innerHTML: msg
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
                                        messageWindow.close();
                                    }
                                }
                            ]
                        ],
                        notShow: true
                    })
                    // finish stop the interval, get error
                    settleWork.getError(function(errorResults){
                        messageWindow.popup();
                        MIS.ErrorResults = errorResults;
                        showErrorResults(errorResults, msg);
                        $scope.settleProcsWritter.showProcs('EOF');
                    }, function(){
                        //
                        messageWindow.popup();
                        console.log('get error list failed!');
                    });
                    $interval.cancel(timer);
                }else{
                    var flow = key;
                    var phase = msg;
                    MIS.SettleProcsObj.forEach(function(item, index){
                    if(flow == item.flow && phase == item.phase){
                        end = index;
                            if(end-start>=1){
                                $scope.flow_flag = item.flow_flag;
                                $scope.phase_flag = item.phase_flag;
                                for(var i=start+1; i<=end; i++){
                                    $scope.settleProcsWritter.showProcs(MIS.SettleProcsObj[i].desc);
                                }
                                start = end;
                                //$scope.settleProcsWritter.showProcs(item.desc);
                            }

                        }
                    })
                }
            }
        };
        $scope.$on('sData', function(event,data){
            var newLen = data.settleFlowData.length;
            if($scope.messageList.length < newLen){
                $scope.messageList = data.settleFlowData;
                if(timer == null){
                    timer = $interval(handleFn, 100);
                }
            }
        });
        $scope.handelError = function (argument) {
                $scope.go('/role71/error');
        }
        
        var showErrorResults = function(errObj, msg){
            var accError = errObj.account;
            var bizError = errObj.business;
            var shrError = errObj.taShare;
            var dvdError = errObj.dividend;
            var accTotalErrCount = 0;
            var bizTotalErrCount = 0;
            var shrTotalErrCount = 0;
            var dvdTotalErrCount = 0;
            for(var accItem in accError){
                var accErrorCount=accError[accItem];
                accTotalErrCount += accErrorCount;
                if(MIS.SettleErrorResults.account.hasOwnProperty(accItem)){
                    MIS.SettleErrorResults.account[accItem].count=accErrorCount;
                }
            }
            for(var bizItem in bizError){
                var bizErrorCount=bizError[bizItem];
                bizTotalErrCount += bizErrorCount;
                if(MIS.SettleErrorResults.business.hasOwnProperty(bizItem)){
                    MIS.SettleErrorResults.business[bizItem].count=bizErrorCount;
                }
            }
            for(var shrItem in shrError){
                var shrErrorCount=shrError[shrItem];
                shrTotalErrCount += shrErrorCount;
                if(MIS.SettleErrorResults.taShare.hasOwnProperty(shrItem)){
                    MIS.SettleErrorResults.taShare[shrItem].count=shrErrorCount;
                }
            }
            for(var dvdItem in dvdError){
                var dvdErrorCount=dvdError[dvdItem];
                dvdTotalErrCount += dvdErrorCount;
                if(MIS.SettleErrorResults.dividend.hasOwnProperty(dvdItem)){
                    MIS.SettleErrorResults.dividend[dvdItem].count=dvdErrorCount;
                }
            }
            var totalErrorCount = accTotalErrCount + bizTotalErrCount + shrTotalErrCount + dvdTotalErrCount;

            if(totalErrorCount != 0){
                $scope.disableHandleError = false;
            }else{
                $scope.disableHandleError = true;
            }
            $scope.showError = true;
            $scope.settleFlowError = "流程处理结果: " + msg;
        }
        
        // default value
        $scope.accErrorResults = MIS.SettleErrorResults.account;
        $scope.bizErrorResults = MIS.SettleErrorResults.business;
        $scope.shrErrorResults = MIS.SettleErrorResults.taShare;
        $scope.dvdErrorResults = MIS.SettleErrorResults.dividend;
        $scope.settleFlowError = "";
        $scope.showError = false;
    }]);
MIS.handleSettleProcs = MIS.derive(null, {
    create: function (argument){
        this.divId = argument['divId'];
        this.window = argument['window'];
        this.scope = argument['scope'];
        this.settleProcsList = [];
        this.innerHtml = [];
        this.divObj = this.window.document.getElementById(this.divId);
        this.messageEnd = this.window.document.getElementById('msg_end');
    },
    clear: function(){
        var that = this;
        that.divObj.innerHTML = "";
        that.settleProcsList = [];
        that.innerHtml = [];
    },
    showProcs: function(procs, msg){
        var that = this;
        var currentProcsObj = {
            id: procs,
            msg: procs,
            tips: '待处理',
            cls: 'process-ongoing'
        };
        that.settleProcsList.push(currentProcsObj);
        if(currentProcsObj.msg!="EOF"){
            that.innerHtml.push("<li>" + currentProcsObj.msg + "<span class='" + currentProcsObj.cls + "' id='" + currentProcsObj.id + "'>[" + currentProcsObj.tips + "]</span></li>");
        }else{
            that.innerHtml.push("<li><span class='process-done' id='" + currentProcsObj.id + "'></span></li>");
        }
        that.window.document.getElementById(that.divId).innerHTML=that.innerHtml.join("");
        var len=that.settleProcsList.length;
        var lastIndex = len -1;
        for(var i=0;i<len;i++){
            var obj = that.settleProcsList[i];
            var objIndex = that.settleProcsList.indexOf(that.settleProcsList[i]);
            if(objIndex != lastIndex && that.window.document.getElementById(obj.id)){
                that.window.document.getElementById(obj.id).innerHTML = "[已处理]";
                that.window.document.getElementById(obj.id).className = "process-done";
            }
            if(that.settleProcsList[i].msg == 'EOF'){
                that.window.document.getElementById(obj.id).innerHTML = "[处理完毕]";
            }
        };
        this.messageEnd.scrollIntoView();
    }
},{});
MIS.SettleErrorResults = {
    account: {
        TA_RETURN_CODE_NOT_SUCCESS: {
            name: 'TA返回码不为0000',
            count: 0
        },
        LOCAL_ACCOUNT_NOT_IN_02_FILE: {
            name: '02文件不存在清算本地数据库的帐号',
            count: 0
        },
        TA_ACCOUNT_NOT_IN_LOCAL_DB: {
            name: '清算本地数据库不存在TA返回的帐号',
            count: 0
        },
        INVALID_TRANS_CFM_DATE_IN_02_FILE: {
            name: '无效的交易日期',
            count: 0
        },
        NULL_FIELDS_FOUND_IN_02_FILE: {
            name: '02文件中存在无效字段',
            count: 0
        },
    },
    business: {
        EXCEPTIONAL_BIZ: {
            name: '异常交易',
            count: 0
        },
        PAY_NO_BIZ: {
            name: '支付没有对应的交易',
            count: 0
        },
        AMOUNT_SHARE_NOT_MATCH_03_FILE: {
            name: '03文件导出过程中发现有账户和份额不匹配',
            count: 0
        },
        BIZ_NO_PAY: {
            name: '交易未支付',
            count: 0
        },
        NO_TRANS_BANK_CARD_PAY: {
            name: '用户银行卡无流水',
            count: 0
        },
        AMOUNT_SHARE_NOT_MATCH_04_FILE: {
            name: '04文件解析过程中发现不匹配的账户和份额',
            count: 0
        },
        EXCEPTIONAL_TA_SHARE:{
            name: 'TA份额异常',
            count: 0
        },
        EXCEPTIONAL_TA_DIVIDEND:{
            name: 'TA分红异常',
            count: 0
        }
    },
    taShare: {
        LOCAL_ACCOUNT_NOT_EXIST:{
            name: 'taShare:LOCAL_ACCOUNT_NOT_EXIST',
            count: 0
        },
        LOCAL_TRANS_ACCOUNT_NOT_EXIST	:{
            name: 'taShare:LOCAL_TRANS_ACCOUNT_NOT_EXIST',
            count: 0
        },
        LOCAL_PRODUCT_NOT_EXIST:{
            name: 'taShare:LOCAL_PRODUCT_NOT_EXIST',
            count: 0
        },
        TA_TOTAL_SHARE_LESS_THAN_AVAILABLE_SHARE:{
            name: 'taShare: TA_TOTAL_SHARE_LESS_THAN_AVAILABLE_SHARE',
            count: 0
        }
    },
    dividend: {
        LOCAL_ACCOUNT_NOT_EXIST:{
            name: 'taDividend:LOCAL_ACCOUNT_NOT_EXIST',
            count: 0
        },
    }
}

MIS.SettleProcsObj = [
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_SYNC',
        flow_flag: 1,
        phase_flag: 1,
        desc: '01文件:数据同步'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_COLLECTION',
        flow_flag: 1,
        phase_flag: 2,
        desc: '01文件:数据收集'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_GENERATING',
        flow_flag: 1,
        phase_flag: 3,
        desc: '01文件:数据生成'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_PARSING',
        flow_flag: 1,
        phase_flag: 4,
        desc: '01文件:数据解析'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_PROCESSING',
        flow_flag: 1,
        phase_flag: 5,
        desc: '01文件:数据处理'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_STORING',
        flow_flag: 1,
        phase_flag: 6,
        desc: '01文件:保存数据'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_SENDING',
        flow_flag: 1,
        phase_flag: 7,
        desc: '01文件:发送数据'
    },
    {
        flow: 'FLOW_ACCOUNT_EXPORTATION',
        phase: 'PHASE_DATA_VERIFICATION',
        flow_flag: 1,
        phase_flag: 8,
        desc: '01文件:验证数据'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_SYNC',
        flow_flag : 2,
        phase_flag :1,
        desc: '02文件:数据同步'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_COLLECTION',
        flow_flag : 2,
        phase_flag :2,
        desc: '02文件:数据收集'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_GENERATING',
        flow_flag : 2,
        phase_flag :3,
        desc: '02文件:数据生成'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_PARSING',
        flow_flag : 2,
        phase_flag :4,
        desc: '02文件:数据解析'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_PROCESSING',
        flow_flag : 2,
        phase_flag :5,
        desc: '02文件:数据处理'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_STORING',
        flow_flag : 2,
        phase_flag :6,
        desc: '02文件:保存数据'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_SENDING',
        flow_flag : 2,
        phase_flag :7,
        desc: '02文件:发送数据'
    },
    {
        flow: 'FLOW_ACCOUNT_SETTLEMENT',
        phase: 'PHASE_DATA_VERIFICATION',
        flow_flag : 2,
        phase_flag :8,
        desc: '02文件:验证数据'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_SYNC',
        flow_flag : 3,
        phase_flag :1,
        desc: '03文件:数据同步'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_COLLECTION',
        flow_flag : 3,
        phase_flag :2,
        desc: '03文件:数据收集'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_GENERATING',
        flow_flag : 3,
        phase_flag :3,
        desc: '03文件:数据生成'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_PARSING',
        flow_flag : 3,
        phase_flag :4,
        desc: '03文件:数据解析'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_PROCESSING',
        flow_flag : 3,
        phase_flag :5,
        desc: '03文件:数据处理'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_STORING',
        flow_flag : 3,
        phase_flag :6,
        desc: '03文件:保存数据'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_SENDING',
        flow_flag : 3,
        phase_flag :7,
        desc: '03文件:发送数据'
    },
    {
        flow: 'FLOW_BUSINESS_EXPORTATION',
        phase: 'PHASE_DATA_VERIFICATION',
        flow_flag : 3,
        phase_flag :8,
        desc: '03文件:验证数据'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_SYNC',
        flow_flag : 4,
        phase_flag :1,
        desc: '04文件:数据同步'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_COLLECTION',
        flow_flag : 4,
        phase_flag :2,
        desc: '04文件:数据收集'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_GENERATING',
        flow_flag : 4,
        phase_flag :3,
        desc: '04文件:数据生成'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_PARSING',
        flow_flag : 4,
        phase_flag :4,
        desc: '04文件:数据解析'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_PROCESSING',
        flow_flag : 4,
        phase_flag :5,
        desc: '04文件:数据处理'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_STORING',
        flow_flag : 4,
        phase_flag :6,
        desc: '04文件:保存数据'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_SENDING',
        flow_flag : 4,
        phase_flag :7,
        desc: '04文件:发送数据'
    },
    {
        flow: 'FLOW_BUSINESS_SETTLEMENT',
        phase: 'PHASE_DATA_VERIFICATION',
        flow_flag : 4,
        phase_flag :8,
        desc: '04文件:验证数据'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_SYNC',
        flow_flag : 5,
        phase_flag :1,
        desc: '05文件:数据同步'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_COLLECTION',
        flow_flag : 5,
        phase_flag :2,
        desc: '05文件:数据收集'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_GENERATING',
        flow_flag : 5,
        phase_flag :3,
        desc: '05文件:数据生成'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_PARSING',
        flow_flag : 5,
        phase_flag :4,
        desc: '05文件:数据解析'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_PROCESSING',
        flow_flag : 5,
        phase_flag :5,
        desc: '05文件:数据处理'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_STORING',
        flow_flag : 5,
        phase_flag :6,
        desc: '05文件:保存数据'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_SENDING',
        flow_flag : 5,
        phase_flag :7,
        desc: '05文件:发送数据'
    },
    {
        flow: 'FLOW_DIVIDEND_SETTLEMENT',
        phase: 'PHASE_DATA_VERIFICATION',
        flow_flag : 5,
        phase_flag :8,
        desc: '05文件:验证数据'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_SYNC',
        flow_flag : 6,
        phase_flag :1,
        desc: '06文件:数据同步'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_COLLECTION',
        flow_flag : 6,
        phase_flag :2,
        desc: '06文件:数据收集'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_GENERATING',
        flow_flag : 6,
        phase_flag :3,
        desc: '06文件:数据生成'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_PARSING',
        flow_flag : 6,
        phase_flag :4,
        desc: '06文件:数据解析'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_PROCESSING',
        flow_flag : 6,
        phase_flag :5,
        desc: '06文件:数据处理'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_STORING',
        flow_flag : 6,
        phase_flag :6,
        desc: '06文件:保存数据'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_SENDING',
        flow_flag : 6,
        phase_flag :7,
        desc: '06文件:发送数据'
    },
    {
        flow: 'FLOW_SHARE_SETTLEMENT',
        phase: 'PHASE_DATA_VERIFICATION',
        flow_flag : 6,
        phase_flag :8,
        desc: '06文件:验证数据'
    }
]