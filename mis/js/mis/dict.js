'use strict'
MIS.MisDictData = MIS.derive(null, {
	create: function(publicPromise, d){
		this.promise = publicPromise;
        this.d = d;
        this.loadLength = 0;
        
		this.initDictData();
		this.initProduct();
        this.initAccount();
        this.initFund();
        this.initFinance();
        this.initAffiche();
        MIS.dictData.clientList = [
            {name: '游览器', value: 1},
            {name: 'Android客户端', value: 2},
            {name: 'iOS客户端', value: 4},
            {name: '微应用', value: 8}
        ];
        MIS.dictData.activeStatus = [
            {name: '未激活', value: 0},
            {name: '激活', value: 1}
        ];
        MIS.dictData.prodType = [
            {name: '体验金产品', value: 0},
            {name: '优信贷', value: 1},
            {name: '节节生息', value: 2},
        ]
        MIS.dictData.monthDay = [
            {name: '一个月', value: 30},
            {name: '三个月', value: 90},
            {name: '六个月', value: 180},
            {name: '十二个月', value: 360}
        ]
        //不从服务器获取dict
        MIS.loadSuccess = true;
        this.d.resolve();
	},
	initDictData: function(){
		MIS.dictData={
			taNoList:{//机构TA号
				list:[],
				dictNo: 41009
			},
			codeTypeList:{//产品代码类型
				list:[],
				dictNo: 41030,
			},
			prodTypeList:{//产品类别
				list:[],
				dictNo: 41001
			},
			prodTypeAssList:{//产品辅助类别
				list:[],
				dictNo: 41018
			},
			prodStatusList:{//产品状态
				list:[],
				dictNo: 41002
			},
			currencyTypeList: {//货币种类
				list:[],
				dictNo:975
			},
			payTypeList:{//允许支付方式
				list:[],
				dictNo:40500
			},
			riskLevelList:{//风险等级
				list:[],
				// dictNo:41003
                dictNo: 500000
			},
			assessLevel:{//评估等级
				list:[],
				dictNo: 500004 //41005
			},
			entrustType:{//委托方式
				list:[],
				dictNo:1201
			},
			prodCodeCtrlList: {//业务控制串
				list:[],
				dictNo: 41011
			},
			investType:{//投资类型
				list:[],
				dictNo:41012
			},
			incomeType:{//收益类型
				list:[],
				dictNo:41013
			},
			fundChargeType:{//基金收费方式
				list:[],
				dictNo:2026
			},
			dividendTypeList: {//产品分红方式
				list:[],
				dictNo: 41004
			},
			taStatusList:{//TA状态
				list:[],
				dictNo:41006
			},
			taCtrlList:{//TA控制串
				list:[],
				dictNo:41010
			},
            fareMode: {
                list:[],
                dictNo:2026
            },
            fareType: {
                list:[],
                dictNo:41031
            },
            interestMethod: {
                list:[],
                dictNo: 500001
            },
            productReviewType:{
                list:[],
                dictNo: 500002
            },
            productRateType: {
                list:[],
                dictNo: 500003
            }

		};
        for(var key in MIS.dictData){
            this.loadLength ++;
        }
        for(var o in MIS.dictData){
            
            var obj = MIS.dictData[o];
            // (function(obj, that){
            //     that.getDictList(obj.dictNo,function(list){
            //         obj.list = list;
            //     })
            // })(obj, this);
        }
	},
	initProduct: function(){
		//hard code
        MIS.dictData.financeAuditStatus = [
            {
                name: "未审核",
                value: "0"
            },
            {
                name: "审核中",
                value: "1"
            },
            {
                name: "审核通过",
                value: "2"
            },
            {
                name: "审核失败",
                value: "3"
            },
            {
                name: "已打款",
                value: "4"
            }
        ];
        MIS.dictData.financeBusinessType = [
            {
                name: "理财",
                value: "0"
            },
            {
                name: "充值",
                value: "1"
            },
            {
                name: "提现",
                value: "2"
            },
        ];
        MIS.dictData.prodStatusList = [
            {
                name: "预约认购期",
                value: 0
            },
            {
                name: "认购期",
                value: 1
            },
            {
                name: "已募满",
                value: 2
            },
            {
                name: "产品成立",
                value: 3
            },
            {
                name: "产品未成立/募集失败",
                value: 4
            },
            {
                name: "开放期",
                value: 5
            },
            {
                name: "封闭期",
                value: 6
            },
            {
                name: "产品到期",
                value: 7
            },
            {
                name: "已清算",
                value: 8
            },
            {
                name: "已结佣",
                value: 9
            },
            {
                name: "已下架",
                value: 10
            },
        ];
        MIS.dictData.investArea  = [
            {
                name: "抵押标",
                value: 0
            },
            {
                name: "质押标",
                value: 1
            },
            {
                name: "信用标",
                value: 2
            },
            {
                name: "债权转让标",
                value: 3
            },
            {
                name: "净值标",
                value: 4
            },
        ];
        MIS.dictData.incomeType = [
            {
                name: "保本固定收益",
                value: 0
            },
            {
                name: "保本浮动收益",
                value: 1
            },
            {
                name: "非保本浮动收益",
                value: 2
            },
        ];
        MIS.dictData.fareMode = [
            {
                name: "收益",
                value: 0
            },
            {
                name: "前置收费",
                value: 1
            },
            {
                name: "后置收费",
                value: 2
            },
            {
                name: "混合收费",
                value: 3
            },
            {
                name: "佣金",
                value: 4
            },
            {
                name: "加息",
                value: 5
            }
        ];
        MIS.dictData.fareDivideSection = [
            {
                name: "第一级",
                value: 0
            },
            {
                name: "第二级",
                value: 1
            },
            {
                name: "第三级",
                value: 2
            },
            {
                name: "第四级",
                value: 3
            },
            {
                name: "第五级",
                value: 4
            },
            {
                name: "第六级",
                value: 5
            },
            {
                name: "第七级",
                value: 6
            },
            {
                name: "第八级",
                value: 7
            },
            {
                name: "第九级",
                value: 8
            },
            {
                name: "第十级",
                value: 9
            },
        ];
        MIS.dictData.fareType = [
            {
                name: "收益",
                value: 0
            },
            {
                name: "认购费率",
                value: 1
            },
            {
                name: "管理费率",
                value: 2
            },
            {
                name: "赎回费率",
                value: 3
            },
            {
                name: "托管费率",
                value: 4
            },
            {
                name: "手续费率",
                value: 5
            },
            {
                name: "印花费率",
                value: 6
            },
            {
                name: "申购费率",
                value: 7
            },
            {
                name: "其他费率",
                value: 8
            },
            {
                name: "佣金",
                value: 9
            },
            {
                name: "初投加息",
                value: 10
            },
            {
                name: "复投加息",
                value: 11
            }
        ];
        MIS.dictData.fareMethod = [
            {
                name: "比例费率",
                value: 0
            },
            {
                name: "固定费率",
                value: 1
            },
            {
                name: "分段费率",
                value: 2
            }
        ];
        MIS.dictData.assessLevel = [
            {
                name: "未评级",
                value: 0
            },
            {
                name: "一级",
                value: 1
            },
            {
                name: "二级",
                value: 2
            },
            {
                name: "三级",
                value: 3
            },
            {
                name: "四级",
                value: 4
            },
            {
                name: "五级",
                value: 5
            },
            {
                name: "六级",
                value: 6
            },
            {
                name: "七级",
                value: 7
            },
            {
                name: "八级",
                value: 8
            },
            {
                name: "九级",
                value: 9
            },
            {
                name: "十级",
                value: 10
            },
        ];
        MIS.dictData.riskLevelList = [
            {
                name: "未知等级",
                value: 0
            },
            {
                name: "保守型",
                value: 1
            },
            {
                name: "稳健型",
                value: 2
            },
            {
                name: "平衡型",
                value: 3
            },
            {
                name: "积极型",
                value: 4
            },
            {
                name: "激进型",
                value: 5
            },
        ];
        MIS.dictData.reviewStatus = [
            {
                name: "未审核",
                value: 0
            },
            {
                name: "已提交",
                value: 1
            },
            {
                name: "审核成功",
                value: 2
            },
            {
                name: "审核失败",
                value: 3
            },
        ];
        MIS.dictData.interestType = [
            {
                name: "到期一次性还本付息",
                value: 0
            },
            {
                name: "按年付息，到期还本付息",
                value: 1
            },
            {
                name: "按半年付息，到期还本付息",
                value: 2
            },
            {
                name: "按季付息，到期还本付息",
                value: 3
            },
            {
                name: "按月付息，到期还本付息",
                value: 4
            },
        ];
		MIS.dictData.prodBusinessTypeList=[
            {
                name: "证券理财认购申请",
                value: 44020
            },
            {
                name: "证券理财申购申请",
                value: 44022
            },
            {
                name: "证券理财赎回申请",
                value: 44024
            },
            {
                name: "证券理财转托管",
                value: 44026
            },
            {
                name: "证券理财转托管入",
                value: 44027
            },
            {
                name: "证券理财转托管出",
                value: 44028
            },
            {
                name: "证券理财分红方式设置",
                value: 44029
            },
            {
                name: "证券理财份额冻结",
                value: 44031
            },
            {
                name: "证券理财份额解冻",
                value: 44032
            },
            {
                name: "证券理财非交易过户",
                value: 44033
            },
            {
                name: "证券理财非交易过户入",
                value: 44034
            },
            {
                name: "证券理财非交易过户出",
                value: 44035
            },
            {
                name: "证券理财转换入",
                value: 44037
            },
            {
                name: "证券理财转换出",
                value: 44038
            },
            {
                name: "证券理财定时定额投资",
                value: 44039
            },
            {
                name: "证券理财交易撤单",
                value: 44053
            },
            {
                name: "证券理财确权",
                value: 44080
            },
            {
                name: "证券理财份额分拆",
                value: 44085
            },
            {
                name: "证券理财份额合并",
                value: 44086
            },
            {
                name: "证券理财快速过户申请",
                value: 44098
            },
            {
                name: "产品预约认购",
                value: 49020
            },
            {
                name: "产品预约申购",
                value: 49021
            },
            {
                name: "产品预约赎回",
                value: 49022
            },
            {
                name: "产品预约转换",
                value: 49023
            },
            {
                name: "产品预约撤单",
                value: 49024
            },
            {
                name: "证券理财赎回申请",
                value: 49024
            },
            {
                name: "产品预约确认",
                value: 49025
            },
            {
                name: "代客户申领额度",
                value: 49026
            }
        ];
        MIS.dictData.couponCategoryList = [
            {name: '体验金', value: 1},
            {name: '投资红包', value: 2},
            {name: '现金红包', value: 3},
            {name: '加息令牌', value: 4},
            {name: '加息券', value: 5},
            {name: '满减券', value: 7},
            {name: '比例红包', value: 8}
        ];
        MIS.dictData.couponClientFlagList = [
            {name: 'APP+WEB', value: 0},
            {name: 'APP', value: 1},
            {name: 'WEB', value: 2},
        ];
        MIS.dictData.couponStatusAudit = [
            {name: '已提交', value: 0},
            {name: '待审核', value: 1},
            {name: '已通过', value: 2},
            {name: '已拒绝', value: 3},
        ];
        MIS.dictData.couponStatusLifecycle = [
            {name: '未生效', value: 0},
            {name: '生效中', value: 1},
            {name: '已失效', value: 2},
        ];
        MIS.dictData.couponTermType = [
            {name: '固定起止日期', value: 0},
            {name: '动态起止日期', value: 1},
            {name: '无期限', value: 2},
        ];
        MIS.dictData.couponWithdrawFlag = [
            {name: '可以提现', value: true},
            {name: '不能提现', value: false},
        ];
	},
    initAccount: function(){
        MIS.dictData.roleList = [];// default = [], render it when goin to AccountManagementController
        MIS.dictData.roleStatusList = [
            {name: '已冻结', value:'2'},
            {name: '正常状态', value: '1'},
        ];
    },
    initFund: function(){
        MIS.dictData.auditableList = [
            {name: '可以', value: true},
            {name: '不可以', value: false},
        ];
        MIS.dictData.errorFlagList = [
            {name: '数据正常', value: 0},
            {name: '数据不平', value: 1},
            {name: '没有支付流水', value: 2},
        ];
        MIS.dictData.internalList = [
            {name: '是', value: 1},
            {name: '否', value: 0},
        ];
        MIS.dictData.feeTypeList = [
            {name: '前端收费', value: 0},
            {name: '后端收费', value: 1},
            {name: '混合收费', value: 2}
        ];
        MIS.dictData.fundStatusList = [
            {name: '未对账', value: 0},
            {name: '已对账', value: 1},
            {name: '已审批', value: 2},
            {name: '已付款', value: 3},
            {name: '已拒绝', value: -1},
            {name: '已完成', value: -2},
            {name: '未知状态', value: -3},
        ];
        MIS.dictData.fundInStatusList=[
            {name: '未对账', value: 0},
            {name: '已对内对账', value: 1},
            {name: '已对外对账', value: 2},
            {name: '已收款', value: 3},
            {name: '已完成', value: 4}
        ];
        MIS.dictData.settleStatusList=[
            {name: '未处理', value: 0},
            {name: '处理中', value: 1},
            {name: '处理成功', value: 2},
            {name: '处理失败', value: 3},
        ];
        MIS.dictData.redeemStatusList=[
            {name: '未处理', value: 0},
            {name: '赎回订单', value: 1},
            {name: '赎回份额', value: 2},
            {name: '返回本息', value: 3},
            {name: '赎回奖励', value: 4},
            {name: '返回奖励', value: 5},
            {name: '短信通知', value: 6},
            {name: '成功', value: 7},
        ];
        MIS.dictData.fundOutStateList=[
            {name: '未处理', value: 0},
            {name: '清算订单', value: 1},
            {name: '清算份额', value: 2},
            {name: '成功', value: 3},
        ]
    },
    initFinance: function(){
        MIS.dictData.financeTradeType = [
            {name: '理财', value: 0},
            {name: '充值', value: 1},
            {name: '提现', value: 2},
            {name: '收益', value: 3},
            {name: '转账', value: 4},
            {name: '赎回', value: 5},
            {name: '撤单', value: 6},
            {name: '退款', value: 7},
            {name: '清算', value: 8},
            {name: '回款', value: 9},
            {name: '手续费', value: 10},
        ];
        MIS.dictData.financeTransType = [
            {name: '支出', value: 0},
            {name: '收入', value: 1},
        ];
        MIS.dictData.financeTradeStatus = [
            {name: '未处理', value: 0},
            {name: '处理中', value: 1},
            {name: '成功', value: 2},
            {name: '失败', value: 3},
            {name: '已清算', value: 4},
            {name: '已关闭', value: 5},
            {name: '已赎回', value: 6},
            {name: '已回款', value: 7},
        ];
        MIS.dictData.financeAssetType = [
            {name: '银行卡', value: 0},
            {name: '余额', value: 1},
            {name: '加金券', value: 2},
            {name: '加息券', value: 3},
            {name: '积分', value: 4},
            {name: '资产', value: 5},
            {name: '收益', value: 6},
            {name: '佣金', value: 7},
        ];
        MIS.TransType = [
            {name:'代收', value:'0'},
            {name:'代付', value:'1'},
        ];
        MIS.dictData.financeTransStatus = [
            {name: '未交易', value:'0'},
            {name: '交易处理中', value:'1'},
            {name: '交易成功', value:'2'},
            {name: '交易失败', value:'3'},
        ];
        MIS.dictData.financePayChannel = [
            {name: '快捷支付', value:'0'},
            {name: '网关支付', value:'1'},
            {name: '线下支付', value:'2'},
        ];
    },
    initAffiche: function(){
        MIS.dictData.bulletinType = [
            {name:'公告', value: '0'},
            {name:'新闻', value: '1'},
            {name:'动态', value: '2'},
            {name:'广告', value: '3'},
            {name:'报告', value: '4'}
        ];
        MIS.dictData.bulletinTop = [
            {name:'不置顶', value: '0'},
            {name:'置顶', value: '1'}
        ];
        MIS.dictData.bulletinPublish = [
            {name:'不发布', value: '0'},
            {name:'发布', value: '1'}
        ];
        MIS.dictData.prizeType = [
            {name: '实物奖品', value:'1'},
            {name: '积分', value:'2'},
            {name: '体验金或红包', value:'3'},
            {name: '幸运号', value:'4'},
            {name: '无效产品', value:'5'}
        ];
        MIS.dictData.activityType = [
            {name: '投资抽奖', value: 0},
            {name: '点币(积分)抽奖', value: 1},
            {name: '上证指数抽奖', value: 2},

        ];
    },
	renderResponseList:function(responseList){
		var len = responseList.length;
		var list = [];
		if(len <= 0) return list;
		for(var i=0;i<len;i++){
			var item = responseList[i];
			var obj={};
			obj.name = item.dictPrompt;
			obj.value = item.subentry;
			list.push(obj);
		}
		return list;
	},
	getDictList:function(dictNo, callback){
		var that = this;
		var searchStr = MIS.Util.stringFormat('dictEntry={0}&branchNo=8888',[dictNo]);
		var urlStr = '{0}/{1}?' + searchStr;
		this.promise({
			serverName:'mgtProductService',
			apiName:'prodDict',
			method:'get',
			urlStr:urlStr
		}).then(function(response){
			var list = that.renderResponseList(response.data['data']);
			callback(list);
            that.loadLength --;
            that.checkLoad();
		},function(error){
			console.log('get list error : dictNo[' + dictNo + ']');
            that.d.reject()
		})
	},
    checkLoad: function(){
        if (this.loadLength <= 0){
            MIS.loadSuccess = true;
            this.d.resolve();
        }
    }
}, {})