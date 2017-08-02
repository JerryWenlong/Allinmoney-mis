(function(){
    MIS.Config.Report = {
        columnData: [
            {// index 0,  订单
                column:[
                    {name:'orderNo', displayName:'交易单号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderCreatedAt', displayName:'交易时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderAccountName', displayName:'姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'cellPhone', displayName:'电话', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderUsername', displayName:'用户名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderProductName', displayName:'产品名称', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderProductRate', displayName:'年化利率', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderProductPeriod', displayName:'投资期限', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderProductAddRate', displayName:'加息利率', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderExpectedProfit', displayName:'客户投资收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderStatus', displayName:'产品状态', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderEntrustAmount', displayName:'客户投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderPointAmount', displayName:'使用点币抵扣金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'redCash', displayName:'返现券', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'fullSubtract', displayName:'满减券', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderAddAmount', displayName:'加息券金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderFrom', displayName:'渠道来源', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderPlatform', displayName:'投资终端', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'orderTimes', displayName:'共几次投资', minWidth:125, enableHiding:false,enableColumnMenu:false},
                ]
            },
            {// index 1,
                column: [
                    {name:'name', displayName: '渠道名称', minWidth: 125, enableHiding:false, enableColumnMenu: false},
                    {name:'regNum', displayName: '注册总人数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'certNum', displayName: '认证总人数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'bindNum', displayName: '绑卡总人数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'incomeRefPerson', displayName: '充值总人数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'incomeRefTimes', displayName: '充值总笔数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'incomeRefAmount', displayName: '充值总金额', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'investPersonNum', displayName: '邀请投资总人数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'investNum', displayName: '邀请投资总笔数', minWidth:125, enableHiding:false, enableColumnMenu:false},
                    {name:'investAmount', displayName: '邀请投资总金额', minWidth:125, enableHiding:false, enableColumnMenu:false}
                ]
            },
            {// index 2,
                column: [
                    {name:'phone', displayName:'手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'name', displayName:'客户姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'regTime', displayName:'注册时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'certTime', displayName:'实名时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'bindTime', displayName:'绑卡时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'gendar', displayName:'性别', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'age', displayName:'年龄', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'authCard', displayName:'身份证号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'card', displayName:'银行卡号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'bank', displayName:'银行', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'from', displayName:'渠道来源', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'regEquipment', displayName:'注册终端', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'fistInvestTime', displayName:'首次投资时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'firstInvestAmount', displayName:'首次投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investTimes', displayName:'总投资次数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investTotal', displayName:'累计投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false}
                ]
            },
            {// index 3,
                column: [
                    {name:'code', displayName:'资产编号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'companyNmae', displayName:'企业名称', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'productName', displayName:'产品名称', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'Amount', displayName:'项目金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'productStatus', displayName:'产品状态', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'productRate', displayName:'年化利率', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'productPeriod', displayName:'产品期限', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'customAmount', displayName:'客户总投资', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'customEarnings', displayName:'客户投资总收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'coupons', displayName:'优惠券成本', minWidth:125, enableHiding:false,enableColumnMenu:false},
                ]
            },
            {// index 4,
                column: [
                    {name:'phone', displayName:'邀请人手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'name', displayName:'邀请人姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'registerTime', displayName:'注册时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investTime', displayName:'投资时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'Amount', displayName:'投资总额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'regNum', displayName:'邀请注册人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'certNum', displayName:'邀请认证人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investPersonNum', displayName:'邀请投资人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investAmount', displayName:'邀请投资总额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'nonPayAmount', displayName:'待收收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'paidAmount', displayName:'已收收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'incomeAmount', displayName:'当期活动入账金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'statisticalDate', displayName:'统计时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                ]
            },
            {// index 5
                column: [
                    {name:'recommendName', displayName:'邀请人姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'recommendPhone', displayName:'邀请人手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'recommendedName', displayName:'被邀请人姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'recommendedPhone', displayName:'被邀请人手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'registerTime', displayName:'注册时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'cetrTime', displayName:'实名时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'bindTime', displayName:'绑卡时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investTime', displayName:'投资时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investAmount', displayName:'投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investStatus', displayName:'投资状态（判断流标）', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'incomeAmount', displayName:'当期活动入账金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'payStatus', displayName:'奖励支付方式', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'nonPayAmout', displayName:'待收收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'paidAmout', displayName:'已收收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'statisticalDate', displayName:'统计时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                ]
            },
            {// index 6
                column: [
                    {name:'date', displayName:'中奖时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'name', displayName:'姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'phone', displayName:'账户手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'internal', displayName:'是否虚拟账号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'product', displayName:'中奖商品', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'consumePoint', displayName:'消耗点币', minWidth:125, enableHiding:false,enableColumnMenu:false}
                ]
            },
            {// index 7
                column: [
                    {name:'date', displayName:'日期', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'regNum', displayName:'注册人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'certNum', displayName:'认证人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'bindNum', displayName:'绑卡人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'incomePerson', displayName:'充值人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'incomeTime', displayName:'充值笔数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'incomeAmount', displayName:'充值金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investPerson', displayName:'投资人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investTimes', displayName:'投资笔数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investAmount', displayName:'投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'withdrawalPerson', displayName:'提现人数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'withdrawalTimes', displayName:'提现笔数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'withdrawalAmount', displayName:'提现金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'amount', displayName:'用户个人余额总金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'spvAmountCurrent', displayName:'到期本息', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'reward', displayName:'平台奖励', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'spvAmount', displayName:'待收金额（含利息）', minWidth:125, enableHiding:false,enableColumnMenu:false}
                ]
            },
            {//index 8
                column:[
                    {name:'date', displayName:'获取时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'name', displayName:'用户名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'phone', displayName:'手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'type', displayName:'类别', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'delta', displayName:'点币数', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'newAmount', displayName:'余额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                ]
            },
            {//index 9
                column:[
                    {name:'regTime', displayName:'注册时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'useTime', displayName:'体验时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'Amount', displayName:'体验金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'name', displayName:'姓名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'phone', displayName:'手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'couponProfit', displayName:'获得收益', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investAmount', displayName:'优信贷投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                ]
            },
            {//index 10
                column:[
                    {name:'productName', displayName:'产品名称', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'name', displayName:'用户名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'phone', displayName:'手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'receivedTime', displayName:'领取时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investTime', displayName:'投资时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'settlementTime', displayName:'清算时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investAmount', displayName:'投资金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investProdTerm', displayName:'投资期限', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'reveivedType', displayName:'获领类别', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'couponType', displayName:'优惠券类型', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'code', displayName:'优惠券编码', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'costAmount', displayName:'优惠券金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'Amount', displayName:'优惠券成本', minWidth:125, enableHiding:false,enableColumnMenu:false}
                ]
            },
            {//index 11
                column:[
                    {name:'name', displayName:'用户名', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'phone', displayName:'手机号', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'codeCoupon', displayName:'优惠券编码', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'receiveType', displayName:'领取方式', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'receiveTime', displayName:'领取时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'startTime', displayName:'使用时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'endTime', displayName:'失效时间', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'status', displayName:'优惠券状态', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'couponType', displayName:'优惠券类型', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'amount', displayName:'优惠券金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'minInvestAmount', displayName:'优惠券起投金额', minWidth:125, enableHiding:false,enableColumnMenu:false},
                    {name:'investProdTerm', displayName:'优惠券投资期限', minWidth:125, enableHiding:false,enableColumnMenu:false}
                ]
            },
        ],
        reports:[
            {name: '订单', id: '1', index:0, api: 'order', searchObj:{cellphone: '', name: '', orderNo: '', tradeDate: '', productName: ''}},
            {name: '渠道查询', id: '2', index: 1, api: 'recommend', searchObj:{name: '', }},
            {name: '注册用户统计', id: '3', index: 2, api: 'user', searchObj: {phone: '', name: '', registerTime:'', from:'', }},
            {name: '标的统计', id: '4', index: 3, api: 'product', searchObj: {name:''}},
            {name: '邀请好友', id: '5', index: 4, api: 'recommend', searchObj: {name:'', phone: ''}},
            {name: '好友投资明细', id: '6', index: 5, api: 'recommendDetail', searchObj: {recommendName:'', recommendPhone: '', recommendedName:'', recommendedPhone:''}},
            {name: '抽奖兑换', id: '7', index: 6, api: 'lucky', searchObj: {phone:'', name: '', date:''}},
            {name: '数据概览', id: '8', index: 7, api: 'financing', searchObj: {date:'', from:''}},
            {name: '点币查询', id: '9', index: 8, api: 'point', searchObj: {phone:'', name:'', date:''}},
            {name: '体验标详情', id: '10', index: 9, api: 'coupon', searchObj: {phone:'', name:'', regtime:''}},
            {name: '优惠券（标的）', id: '11', index: 10, api: 'productcoupon', searchObj: {phone:'', productname:''}},
            {name: '优惠券（用户）', id: '12', index: 11, api: 'accountcoupon', searchObj: {phone:'', id:'', status: '', receivedStart: '', receivedEnd:''}, 
                list: {couponStatus: [{name: '未使用', value: '0'},{name: '已使用', value: '1'},{name: '已失效', value: '2'},{name: '冻结', value: '3'}]}},
        ],
        searchHtmls: [
            //index 0 ,订单
            '<li>' + 
                '<label>手机号</label>' +
                '<input ng-model="searchObj.cellphone"/>' +
            '</li>' +
            '<li>' + 
                '<label>姓名</label>' +
                '<input ng-model="searchObj.name"/>' +
            '</li>' +
            '<li>' + 
                '<label>交易单号</label>' +
                '<input ng-model="searchObj.orderNo"/>' +
            '</li>' +
            '<li>' + 
                '<label>交易时间</label>' +
                '<input ng-model="searchObj.tradeDate" datetime-model="searchObj.tradeDate" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_1"/>' +
            '</li>' +
            '<li>' + 
                '<label>产品名称</label>' +
                '<input ng-model="searchObj.prodName"/>' +
            '</li>',
            //index 1 ,各渠道总数
            '<li>'+
                '<label>渠道名称</label>'+
                '<input ng-model="searchObj.name"/>'+
            '</li>',
            //index 2, 注册用户统计
            '<li>' + 
                '<label>手机号</label>' +
                '<input ng-model="searchObj.phone"/>' +
            '</li>' +
            '<li>' + 
                '<label>姓名</label>' +
                '<input ng-model="searchObj.name"/>' +
            '</li>' +
            '<li>' + 
                '<label>注册时间</label>' +
                '<input ng-model="searchObj.registerTime" datetime-model="searchObj.registerTime" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_2"/>' +
            '</li>' +
            '<li>' + 
                '<label>渠道来源</label>' +
                '<input ng-model="searchObj.from"/>' +
            '</li>',
            //index 3
            '<li>'+
                '<label>产品名称</label>'+
                '<input ng-model="searchObj.name"/>'+
            '</li>',
            //index 4
            '<li>'+
                '<label>邀请人姓名</label>'+
                '<input ng-model="searchObj.name"/>'+
            '</li>'+
            '<li>'+
                '<label>邀请人手机号</label>'+
                '<input ng-model="searchObj.phone"/>'+
            '</li>',
            //index 5
            '<li>'+
                '<label>邀请人姓名</label>'+
                '<input ng-model="searchObj.recommendName"/>'+
            '</li>'+
            '<li>'+
                '<label>邀请人手机号</label>'+
                '<input ng-model="searchObj.recommendPhone"/>'+
            '</li>'+
            '<li>'+
                '<label>被邀请人姓名</label>'+
                '<input ng-model="searchObj.recommendedName"/>'+
            '</li>'+
            '<li>'+
                '<label>被邀请人手机号</label>'+
                '<input ng-model="searchObj.recommendedPhone"/>'+
            '</li>',
            //index 6
            '<li>'+
                '<label>账户手机号</label>'+
                '<input ng-model="searchObj.phone"/>'+
            '</li>'+
            '<li>'+
                '<label>姓名</label>'+
                '<input ng-model="searchObj.name"/>'+
            '</li>'+
            '<li>'+
                '<label>中奖时间</label>'+
                '<input ng-model="searchObj.date" datetime-model="searchObj.date" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_3"/>' +
            '</li>',
            //index 7
            '<li>' + 
                '<label>开始日期</label>' +
                '<input ng-model="searchObj.from" datetime-model="searchObj.from" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_7"/>' +
            '</li>' +
             '<li>' + 
                '<label>结束日期</label>' +
                '<input ng-model="searchObj.date" datetime-model="searchObj.date" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_4"/>' +
            '</li>',
            
            //index 8
            '<li>'+
                '<label>手机号</label>'+
                '<input ng-model="searchObj.phone"/>'+
            '</li>'+
            '<li>'+
                '<label>用户名</label>'+
                '<input ng-model="searchObj.name"/>'+
            '</li>'+
            '<li>'+
                '<label>获取时间</label>'+
                '<input ng-model="searchObj.date" datetime-model="searchObj.date" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_5"/>' +
            '</li>',
            //index 9
             '<li>'+
                '<label>手机号</label>'+
                '<input ng-model="searchObj.phone"/>'+
            '</li>'+
            '<li>'+
                '<label>用户名</label>'+
                '<input ng-model="searchObj.name"/>'+
            '</li>'+
            '<li>'+
                '<label>注册时间</label>'+
                '<input ng-model="searchObj.regtime" datetime-model="searchObj.regtime" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_6"/>' +
            '</li>',
            //index 10
             '<li>'+
                '<label>手机号</label>'+
                '<input ng-model="searchObj.phone"/>'+
            '</li>'+
            '<li>'+
                '<label>产品名称</label>'+
                '<input ng-model="searchObj.productname"/>'+
            '</li>',
            //index 11
            '<li>'+
                '<label>手机号</label>'+
                '<input ng-model="searchObj.phone"/>'+
            '</li>'+
            '<li>'+
                '<label>优惠券ID</label>'+
                '<input ng-model="searchObj.id" />'+
            '</li>'+
            '<li>'+
                '<label>发放时间</label>'+
                '<input ng-model="searchObj.receivedStart" datetime-model="searchObj.receivedStart" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_8"/>' +
            '</li>'+
            '<li>'+
                '<label>领取时间</label>'+
                '<input ng-model="searchObj.receivedEnd" datetime-model="searchObj.receivedEnd" type="text" class="timeSelect datetimeInput" my-datetime datetime-id="report_time_9"/>' +
            '</li>'+
            '<li>'+
                '<label>优惠券状态</label>'+
                '<select ng-model="searchObj.status" ng-options="item.value as item.name for item in selectLists.couponStatus"></select>'+
            '</li>',
        ]
    }
})()