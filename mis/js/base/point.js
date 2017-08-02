(function(){
	'use strict'
	MIS.Point = MIS.derive(null, {
		create: function(){
			this.self = this.init();
		},
		init: function(){
			var obj = {};
			return obj;
		},
		randerResponseObject: function(responseObj){
			this.self.accountId = responseObj.accountId;//账号ID
			this.self.accountName = responseObj.accountName;//用户真实姓名
			this.self.userName = responseObj.userName;//用户名
			this.self.changeAt = responseObj.changeAt.replace('T', ' ');//变化时间
			this.self.changeById = responseObj.changeById;//活动ID
			this.self.changeByTitle = responseObj.changeByTitle;//活动名称
			this.self.changeType = responseObj.changeType;//变化类型 0-平台主动赠送；1-用户主动获取；2-朋友转入；3-投资使用；4-用户转出；5-积分过期
			this.self.entrustAmount = responseObj.entrustAmount;//委托金额
			this.self.orderSerialNo = responseObj.orderSerialNo;//订单号
			this.self.pointChangeId = responseObj.pointChangeId;//流水ID
			this.self.pointDelta = responseObj.pointDelta;//积分变动数量
			this.self.prodColdId = responseObj.prodColdId;//产品ID
			this.self.prodName = responseObj.prodName;//产品名称
			this.self.subventionAmount = responseObj.subventionAmount;//补贴金额
			this.self.tradeSerialNo = responseObj.tradeSerialNo;//交易流水号
		},
	}, {});

	MIS.AccountPoint = MIS.derive(null, {
		//用户持有的积分
		create: function(){
			this.self = {};
		},
		randerResponseObject: function(responseObj){
			this.self.userName = responseObj.userName;
			this.self.accountName = responseObj.name;
			this.self.availablePoint = responseObj.asset.availablePoint;//持有积分
			this.self.usedPoint = responseObj.asset.usedPoint;//累计使用积分
			this.self.expiredPoint = responseObj.asset.expiredPoint;//过期积分
			this.self.totalPoint = responseObj.asset.totalPoint;//累计获得积分
			this.self.accountId = responseObj.accountId;//accountId
		}
	}, {});

	MIS.PointDetail = MIS.derive(null, {
		create: function(){
			this.self = {};
		},
		randerResponseObject: function(responseObj){
			this.self.changeType = responseObj.changeType;
			this.self.createdAt = responseObj.createdAt.replace('T', ' ');
			this.self.deltaAmount = responseObj.deltaAmount;
			this.self.newAmount = responseObj.newAmount;
			this.self.subject = responseObj.subject;
		}
	},{})

	MIS.PointManager = MIS.derive(null, {
		create: function (scope, promise, type) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.searchDetailStr = '';
			this.apiName = '';
			this.type = type;
			this.initGridOptions();
			this.initSearch();
		},
		setSearch: function(search, queryType){
			var str = '';
			if(this.type == 3){
				if(search['keyword']) str = MIS.Util.stringFormat('{0}&keyword={1}', [str, search['keyword']]);
			}else{
				if(queryType == 'simple'){
					this.apiName = 'point_changes_simple_query';
					if(search['searchValue']) str = MIS.Util.stringFormat('{0}&search={1}', [str, search['searchValue']]);
				}else{
					this.apiName = 'point_changes_advanced_query';
				}
			}
			
			this.searchStr = str;
		},
		initSearch: function(){
			this.searchDetailStr = '';
			this.searchDetailObj = {
				changeByTitle:'', //活动名
				userName: '', //用户名
				accountName: '', //真实姓名
				date_from: {
					value:''
				},
				date_to:{
					value:''
				}
			}
		},
		clearSearchDetail: function(){
			this.searchDetailStr = '';
			this.searchDetailObj.changeByTitle = '';
			this.searchDetailObj.userName = '';
			this.searchDetailObj.accountName = '';
			this.searchDetailObj.date_from.value = '';
			this.searchDetailObj.date_to.value = '';
		},
		getSearchDetail: function(){
			this.searchDetailStr = '';
			if(this.searchDetailObj.changeByTitle != ''){
				this.searchDetailStr += '&changeByTitle=' + this.searchDetailObj.changeByTitle;
			}
			if(this.searchDetailObj.userName != ''){
				this.searchDetailStr += '&userName=' + this.searchDetailObj.userName;
			}
			if(this.searchDetailObj.accountName != ''){
				this.searchDetailStr += '&accountName=' + this.searchDetailObj.accountName;
			}
			if(this.searchDetailObj.date_from.value != ''){
				this.searchDetailStr += '&from=' + this.searchDetailObj.date_from.value.replace(' ', 'T');
			}
			if(this.searchDetailObj.date_to.value != ''){
				this.searchDetailStr += '&to=' + this.searchDetailObj.date_to.value.replace(' ', 'T');
			}
		},
		initGridOptions:function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs_1 = [
				{name: 'self.changeAt', displayName:'日期',  minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.changeByTitle', displayName:'活动名称',  minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.userName', displayName:'用户名', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'self.accountName', displayName:'真实姓名', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'self.pointDelta', displayName:'获得积分', minWidth: 100, enableHiding:false, enableColumnMenu:false}
			];
			var columnDefs_2 = [
				{name: 'self.changeAt', displayName:'日期',  minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.changeByTitle', displayName:'活动名称',  minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.userName', displayName:'用户名', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'self.accountName', displayName:'真实姓名', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'self.pointDelta', displayName:'花费积分', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.prodName', displayName:'产品名称', minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.entrustAmount', displayName:'委托金额(元)', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'self.orderSerialNo', displayName:'订单号', minWidth: 180, enableHiding:false, enableColumnMenu:false},
				{name: 'self.subventionAmount', displayName:'抵扣金额', minWidth: 80, enableHiding:false, enableColumnMenu:false}
			];
			var columnDefs_3 = [
				{name: 'self.userName', displayName:'用户名', minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'self.accountName', displayName:'真实姓名', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'self.availablePoint', displayName:'所持积分', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.usedPoint', displayName:'累计使用积分', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.expiredPoint', displayName:'过期积分', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.totalPoint', displayName:'累计获得积分', minWidth: 100, enableHiding:false, enableColumnMenu:false}

			];
			if(this.type == 1){
				this.gridOptions.columnDefs = columnDefs_1;
			}else if(this.type == 2){
				this.gridOptions.columnDefs = columnDefs_2;
			}else if(this.type == 3){
				this.gridOptions.columnDefs = columnDefs_3;
			}
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
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);

			if(this.type == 1){
				searchStr = MIS.Util.stringFormat('{0}&changeType={1}', [searchStr, '0,1,2']);
			}else if(this.type == 2){
				searchStr = MIS.Util.stringFormat('{0}&changeType={1}', [searchStr, '3,4'])
			}

			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			if(this.searchDetailStr != ''){
				this.apiName = 'point_changes_advanced_query';
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchDetailStr]);
			}
			if(this.type == 3){
				this.apiName = 'point_account_query'
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = this.apiName;
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
				var obj = {};
				if(this.type == 3){
					obj = new MIS.AccountPoint();
				}else{
					obj = new MIS.Point();
				}
				obj.randerResponseObject(item);
				list.push(obj)
			}
			return list;
		},
	}, {});

	MIS.PointDetailManager = MIS.derive(null, {
		create: function (scope, promise, accountId) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.searchDetailStr = '';
			this.apiName = 'point_account_jour';
			this.accountId = accountId;
			this.initGridOptions();
			this.initSearch();
		},
		initSearch: function(){
			this.searchDetailStr = '';
			this.searchDetailObj = {
				type: {
					value:''	
				},
				date_from: {
					value:''
				},
				date_to:{
					value:''
				}
			}
		},
		clearSearchDetail: function(){
			this.searchDetailStr = '';
			this.searchDetailObj.type.value = '';
			this.searchDetailObj.date_from.value = '';
			this.searchDetailObj.date_to.value = '';
		},
		getSearchDetail: function(){
			this.searchDetailStr = '';
			if(this.searchDetailObj.date_from.value != ''){
				this.searchDetailStr += '&fromDate=' + this.searchDetailObj.date_from.value.replace(' ', 'T');
			}
			if(this.searchDetailObj.date_to.value != ''){
				this.searchDetailStr += '&toDate=' + this.searchDetailObj.date_to.value.replace(' ', 'T');
			}
			if(this.searchDetailObj.type.value != ''){
				this.searchDetailStr += '&type=' + this.searchDetailObj.type.value;
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
			var columnDefs = [
				{name: 'self.deltaAmount', displayName:'积分变动', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.subject', displayName:'变动行为',  minWidth: 200, enableHiding:false, enableColumnMenu:false},
				{name: 'self.newAmount', displayName:'变动后积分', minWidth: 100, enableHiding:false, enableColumnMenu:false},
				{name: 'self.createdAt', displayName:'变动时间', minWidth: 100, enableHiding:false, enableColumnMenu:false}
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
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			if(this.searchDetailStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchDetailStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = this.apiName;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'get',
				urlStr: urlStr,
				apiParam: [this.accountId]
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
				var obj = new MIS.PointDetail();
				obj.randerResponseObject(item);
				list.push(obj)
			}
			return list;
		},
	}, {})
})()