(function(){
	'use strict'
	//customer 用户信息 用户资料 投资记录
	MIS.Customer = MIS.derive(null, {
		create: function(){
			this.customerObj = this.init();
		},
		init: function(){
			var obj = {};
			obj.userId = '';//用户Id accountId
			obj.name = '';//姓名
			obj.registerAt = '';//注册时间
			obj.cellphone ='';//注册手机号
			//性别
			obj.refereeId='';
			obj.refereeName='';//推荐人
			obj.email='';//邮箱
			obj.loginAt='';//最后登录时间
			obj.userName = '';
			return obj;
		},
		randerResponseObject: function(resObj){
			this.customerObj.userId = resObj.userId;
			this.customerObj.name = resObj.name;
			this.customerObj.registerAt = resObj.registerAt.split('T')[0];
			this.customerObj.roleIds = resObj.roleIds;
			this.customerObj.cellphone = resObj.cellphone;
			this.customerObj.userName = resObj.userName;
			this.customerObj.loginAt = resObj.loginAt;
			this.customerObj.refereeName = resObj.refereeName;
		},

	}, {});

	MIS.CustomerManager = MIS.derive(null, {
		create: function (scope, promise, roleId) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			if(typeof(roleId) == 'string')
				this.roleId = roleId;
			this.initGridOptions();
			// this.initSearch();
			this.initSimpleSearch();
		},
		initSimpleSearch: function(){
			if(typeof(this.roleId) == 'string'){
				this.searchModel = {
					value: function(){
						return this.item.value || ''
					},
					item: {name: '渠道商', value:'name'},
					searchList:[
						{name: '渠道商', value:'name'},
						{name: '电话', value:'cellphone'},
					]
				}
			}else{
				this.searchModel = {
					value: function(){
						return this.item.value || ''
					},
					item: {name: '姓名', value:'name'},
					searchList:[
						{name: '姓名', value:'name'},
						{name: '电话', value:'cellphone'},
					]
				}
			}
			
		},
		initSearch: function(){
			this.searchDetailStr = '';
			this.searchDetailObj = {
				reviewed: {
					value: function(){
	                    if(this.item.hasOwnProperty('value')){
	                        return this.item.value;
	                    }
	                    else{
	                        return '';
	                    }
	                },
	                item:{name: '认证', 'value': true},
	                list: [{name: '认证', 'value': true},{name: '未认证', 'value': false}],
				},
				investFrom: '',
				investTo: '',
				registerFrom: {
					value: ''
				},
				registerTo: {
					value: ''
				},
				lastLoginFrom: {
					value: ''
				},
				lastLoginTo: {
					value: ''
				}
			}
		},
		initGridOptions: function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs = [];
			if(typeof(this.roleId) == 'string'){
				columnDefs = [
					{name: 'customerObj.userId', displayName:'渠道ID',  minWidth: 80, enableHiding:false, enableColumnMenu:false},
					{name: 'customerObj.name', displayName:'渠道商',  minWidth: 150, enableHiding:false, enableColumnMenu:false},
					{name: 'customerObj.cellphone', displayName:'电话', minWidth: 150, enableHiding:false, enableColumnMenu:false},
					{name: 'customerObj.registerAt', displayName:'注册时间', minWidth: 150, enableHiding:false, enableColumnMenu:false}
				];
			}else{
				columnDefs = [
					{name: 'customerObj.userId', displayName:'用户ID',  minWidth: 80, enableHiding:false, enableColumnMenu:false},
					{name: 'customerObj.name', displayName:'姓名',  minWidth: 150, enableHiding:false, enableColumnMenu:false},
					{name: 'customerObj.cellphone', displayName:'电话', minWidth: 150, enableHiding:false, enableColumnMenu:false},
					{name: 'customerObj.registerAt', displayName:'注册时间', minWidth: 150, enableHiding:false, enableColumnMenu:false}
				];
			}
			this.gridOptions.columnDefs = columnDefs;
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		refresh: function(){
			this.getPage(this.page, this.pageSize);
		},
		getPage: function(page, pageSize){
			var roleId = 1;
			if(typeof(this.roleId) == 'string'){
				roleId = this.roleId;
			}
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&roleId={2}', [page, pageSize, roleId]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'user';
			this.promise({
				serverName: 'userService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerObjList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get activity signup list failed');
			});
		},
		randerObjList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.Customer();
				obj.randerResponseObject(item);
				list.push(obj)
			}
			return list;
		},
		searchDetail: function(userId, success, failed){
			var that = this;
			var apiName = 'userDetail';
			this.promise({
				serverName: 'userService',
				apiName:apiName,
				method:'get',
				apiParam: [userId]
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var detail = new MIS.CustomerDetail();
				detail.randerResponseObject(response.data['data']);
				success(detail);
			}, function(failed){
				//failed
				console.log('get user detail failed');
			});
		},

		queryChannel: function(str){
			var that = this;
			var str = str || '';
			if(this.searchModel.value() != '')
				this.searchStr = MIS.Util.stringFormat('&{0}={1}', [this.searchModel.value(), str]);
			this.getPage(1, 10);
		},

	}, {});

	MIS.CustomerDetail = MIS.derive(null, {
		create: function(){
			this.detailObj = this.init();
		},
		init: function(){
			var obj = {};
			obj.expectProfit = '';//待收收益 asset
			obj.totalProfit = '';//累计收益 asset
			obj.available = '';//账户余额 balance
			obj.totalAsset = '';//总资产 
			obj.userName='';//真实姓名
			obj.idNo='';//身份证
			obj.age='';//年龄
			obj.gender='';//性别
			obj.authTime='';//实名认证时间
			obj.status='';//实名认证状态
			obj.bankCellphone='';//银行预留手机号
			obj.bankName = '';
			obj.bindTime='';//绑卡时间
			obj.cardNo='';//绑定银行卡号
			obj.cardType='';//绑定银行卡类型
			obj.bindStatus='';//绑定状态 成功 失败 认证中
			return obj
		},
		randerResponseObject: function(resObj){
			this.detailObj.expectProfit = resObj.asset.expectProfit;
			this.detailObj.totalProfit = resObj.asset.totalProfit;
			this.detailObj.available = resObj.balance.available;
			this.detailObj.totalAsset = resObj.totalAsset;
			this.detailObj.userName = resObj.userName;
			this.detailObj.idNo = resObj.idNo;
			if(resObj.cards.length>0){
				this.detailObj.bankCellphone = resObj.cards[0].cellphone;
				this.detailObj.cardNo = resObj.cards[0].cardNo;
				this.detailObj.bankName = resObj.cards[0].bankName;
			}
			this.detailObj.bindStatus = resObj.status;
		}
	}, {});


	MIS.InvestList = MIS.derive(null, {
		create: function(responseObj){
			this.investObj = responseObj;
			this.investObj.investedAt = responseObj.investedAt.replace('T', ' ');
		},
	}, {})

	MIS.InvestListMgt = MIS.derive(null, {
		create: function (scope, promise, id, type) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.id = id;
			this.type = type;// 1 prod 2 user 3 referee
			this.initGridOptions();
		},
		initGridOptions: function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs = [];
			// switch(this.type){
			// 	case '1': columnDefs = [
			// 			{name: 'investObj.accountId', displayName:'用户ID',  minWidth: 120, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.name', displayName: '真实姓名', minWidth: 80, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.cellphone', displayName: '手机号', minWidth: 120, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.prodName', displayName: '产品名称', minWidth: 200, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.prodPeriod', displayName: '产品期限', minWidth: 80, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.amount', displayName: '投资金额', minWidth: 150, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.investedAt', displayName: '投资时间', minWidth: 200, enableHiding:false, enableColumnMenu:false},
			// 			{name: 'investObj.orderSerialNo', displayName: '订单号', minWidth: 200, enableHiding:false, enableColumnMenu:false},
						
			// 		];break;
			// 	case '2': columnDefs = [
						
			// 		];break;
			// 	case '3': columnDefs = [
						
			// 		];break;
			// }
			columnDefs = [
						{name: 'investObj.accountId', displayName:'用户ID',  minWidth: 120, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.name', displayName: '真实姓名', minWidth: 80, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.cellphone', displayName: '手机号', minWidth: 120, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.prodName', displayName: '产品名称', minWidth: 200, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.prodPeriod', displayName: '产品期限', minWidth: 80, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.amount', displayName: '投资金额', minWidth: 150, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.investedAt', displayName: '投资时间', minWidth: 200, enableHiding:false, enableColumnMenu:false},
						{name: 'investObj.orderSerialNo', displayName: '订单号', minWidth: 200, enableHiding:false, enableColumnMenu:false},
						
					];
			this.gridOptions.columnDefs = columnDefs;
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		refresh: function(){
			this.getPage(this.page, this.pageSize);
		},
		getPage: function(page, pageSize){
			var roleId = 1;
			if(typeof(this.roleId) == 'string'){
				roleId = this.roleId;
			}
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			// if(this.searchStr != ''){
			// 	searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			// }
			var str = '';
			if(this.type == '1'){
				str = 'prodCodeId';
			}else if(this.type == '2'){
				str = 'userId';
			}else{
				str = 'refereeId'
			}
			searchStr = MIS.Util.stringFormat('{0}&{1}={2}', [searchStr, str, this.id]);
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'investJour';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerObjList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get activity signup list failed');
			});
		},
		randerObjList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.InvestList(item);
				list.push(obj)
			}
			return list;
		},
	});

	MIS.SMS = MIS.derive(null, {
		create: function(responseObj){
			this.smsObj = responseObj;
		},
	},{});

	MIS.SMSManager = MIS.derive(null, {
		create: function (scope, promise) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
		},
		queryCellphone:function(str){
			var that = this;
			var str = str || '';
			this.searchStr = MIS.Util.stringFormat('&cellphone={0}', [str]);
			this.getPage(1, 10);
		},
		notifyDataChange: function(){
			var that = this;
			var data = {
				currentPage: that.currentPage,
				pageSize: that.pageSize,
				total: that.total,
				currentPageList: that.currentPageList
			}
			this.scope.$emit('dataChange', data)
		},
		setPage: function(page, total, pageSize, pageData){
			this.currentPage = page;
			this.total = total;
			this.pageSize = pageSize;
			this.currentPageList = pageData;
			this.notifyDataChange();
		},
		refresh: function(){
			this.getPage(this.page, this.pageSize);
		},
		getPage: function(page, pageSize){
			var roleId = 1;
			if(typeof(this.roleId) == 'string'){
				roleId = this.roleId;
			}
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'sms';
			this.promise({
				serverName: 'utilService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var paging = response.data['paging'];
				var page = paging['page'];
				var total = paging['total'];
				var pageSize = paging['pageSize'];
				var pageData = that.randerObjList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get activity signup list failed');
			});
		},
		randerObjList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.SMS(item);
				list.push(obj)
			}
			return list;
		},
	}, {})
})()

