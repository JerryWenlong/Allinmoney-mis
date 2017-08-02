(function(){
	'use strict'
	MIS.Coupon = MIS.derive(null, {
		create:function(){
			this.couponObj=this.init();
			// this.couponObj = this.initCoupon();
		},
		init: function(){
			var obj = {};
			var that = this;
			obj.title= {
				value: "",
				errorMsg: "请输入正确的体验金名称(64个字符以内)",
				error: false,
			};
			obj.categoryId={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{value:2},
				errorMsg: '',
				list: MIS.dictData.couponCategoryList,
				error: false,
			};
			obj.value= {
				value:'',
				errorMsg: "请输入正确的面值",
				error: false,
			};
			obj.term= {
				value: "",
				errorMsg: "请输入正确的有效期限",
				error: false,
			};
			obj.countPlanned= {
				value: "",
				errorMsg: "请输入正确的发行上限",
				error: false,
			};
			obj.minInvestAmount={
				value: "",
				errorMsg: "请输入正确的投资金额",
				error: false,
			};
			obj.maxInvestAmount={
				value: "",
				errorMsg: "请输入正确的投资金额",
				error: false,
			};
			obj.userGroup={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{name: '新用户', value:1},
				errorMsg: '',
				list: [{name: '新用户', value:1}, {name:'老用户', value:2}],
				error: false,
			}
			obj.description= {
				value: "",
				errorMsg: "请输入正确的体验金描述",
				error: false,
			};
			obj.prodTerm = {//产品投资期限 若选了产品 则不能使用此选项
				value: '',
				errorMsg:'请输入正确的投资期限',
				error: false
			}
			obj.issueBegin = {
				value: '',
				errorMsg: '请输入正确的发放开始时间',
				error: false
			}
			obj.issueEnd = {
				value: '',
				errorMsg: '请输入正确的发放截止时间',
				error: false
			}
			return obj;
		},
		initProductList: function(productList){
			var that = this;
			this.couponObj.productList = {
				value: [],
				list: that.randerCheckList(productList),
			}
		},
		randerCouponObj: function(responseObj){
			var couponObj = this.couponObj;
			couponObj.couponId = responseObj.coupon.couponId;
			couponObj.categoryName = MIS.getDictName(MIS.dictData.couponCategoryList,responseObj.coupon.categoryId);

			couponObj.title.value = responseObj.coupon.title;
			couponObj.categoryId.item.value = responseObj.coupon.categoryId;
			couponObj.value.value = responseObj.coupon.value;
			couponObj.term.value = responseObj.coupon.term;
			couponObj.countPlanned.value= responseObj.coupon.countPlanned;
			couponObj.minInvestAmount.value = responseObj.coupon.minInvestAmount;
			couponObj.maxInvestAmount.value = responseObj.coupon.maxInvestAmount;
			if(responseObj.accounts.length > 0){
				couponObj.userGroup.item.value = responseObj.accounts[0].accountGroup;	
			}
			couponObj.description.value = responseObj.coupon.description;

			couponObj.countIssued = responseObj.statistics.countIssued;//派发总数
			couponObj.countUsed = responseObj.statistics.countUsed;//使用总数
			couponObj.statusAudit = responseObj.coupon.statusAudit;//审核状态
			couponObj.issueBegin.value = '';
			couponObj.issueEnd.value = '';
			if(responseObj.coupon.issueBegin)
				couponObj.issueBegin.value = responseObj.coupon.issueBegin.replace('T', ' ');
			if(responseObj.coupon.issueEnd)
				couponObj.issueEnd.value = responseObj.coupon.issueEnd.replace('T', ' ');

			var list = [];
			if(responseObj.products.length>0){
				for(var i=0;i<responseObj.products.length;i++){
					var product = responseObj.products[i];
					if(product.prodCodeId == 0){
						couponObj.prodTerm.value = product.prodTerm;
					}else{
		                var obj = {};
		                obj.checked = true;
		                obj.name = product.prodName;
		                obj.value = product.prodCodeId;
		                list.push(obj);
		            }
				}	
			}
			couponObj.productList = {
				value: [],
				list: list,
			}
			couponObj.urgentFlag = responseObj.coupon.urgentFlag;
			if(couponObj.urgentFlag == 0){
				couponObj.urgentFlagStr = '激活';
			}else{
				couponObj.urgentFlagStr = '关闭';
			}
			couponObj.randId = responseObj.randId
		},
		randerCouponProducts: function(products){
			for(var i=0; i<products.length;i++){
				var product = products[i];
				var obj = {};
				obj.prodCodeId = product.prodCodeId;
				obj.prodName = product.prodName;
				// obj.prodType = product.prodType;
				this.couponObj.products.push(obj);
			}
		},
		randerCreateCouponObj: function(couponObj){
			var requestData = {};
			var min = parseInt(couponObj.minInvestAmount.value);
			var max = parseInt(couponObj.maxInvestAmount.value);
			if(!isNaN(min))
				requestData.minInvestAmount = min;
			if(!isNaN(max))
				requestData.maxInvestAmount = max;
			requestData.products = [];
			//get productList
			var productList = this.getChecked(couponObj.productList.list);
			for(var i=0; i<productList.length;i++){
				var prod = productList[i];
				var obj = {};
				obj.prodCodeId = prod.value;
				obj.prodName = prod.name;
				obj.prodTerm = parseInt(prod.prodTerm);
				obj.prodType = parseInt(prod.prodType);
				if(!isNaN(min))
					obj.minInvestAmount = requestData.minInvestAmount;
				if(!isNaN(max))
					obj.maxInvestAmount = requestData.maxInvestAmount;
				requestData.products.push(obj);
			}
			//
			requestData.categoryId = couponObj.categoryId.value();
			requestData.description = couponObj.description.value;
			requestData.title = couponObj.title.value;
			requestData.plannedCount = parseInt(couponObj.countPlanned.value);
			requestData.term = parseInt(couponObj.term.value);//期限
			requestData.termType = 1;//动态
			requestData.value = couponObj.value.value;//面值
			requestData.statusAudit = 2; //审核状态  2-已通过

			requestData.accountGroups = [];
			requestData.accountGroups.push({
				accountGroup:couponObj.userGroup.value()
			})
			if(couponObj.prodTerm.value){
				requestData.products.push({
					prodTerm:couponObj.prodTerm.value
				});
			}
			if(couponObj.issueBegin.value)
				requestData.issueBegin = couponObj.issueBegin.value.replace(' ', 'T');
			if(couponObj.issueEnd.value)
				requestData.issueEnd = couponObj.issueEnd.value.replace(' ', 'T');
			return requestData
		},
		randerCheckList:function(dictList, defaultCheck){
            var len = dictList.length;
            var list = [];
            if(len <= 0) return list;
            for(var i=0;i<len;i++){
                var product = dictList[i];
                var obj = {};
                obj.checked = false;
                if(defaultCheck){
                	defaultCheck.forEach(function(defaultValue){
                		if(defaultValue == obj.value){
                			obj.checked = true;
                		}
                	})
                }
                obj.name = product.prodName;
                obj.value = product.prodCodeId;
                obj.prodTerm = product.prodPeriod;
                obj.prodType = product.prodType;
                list.push(obj);
            }
            return list;
        },
        getChecked:function(list){
            var result = [];
            list.forEach(function(item){
                if(item.checked){
                    result.push(item);
                }
            });
            return result;
        },
        setChecked: function(checkedList, list){
        	for(var i=0;i<checkedList.length; i++){
        		var checkedValue = checkedList[i];
        		list.forEach(function(item){
        			if(item.value == checkedValue){
        				item.checked = true;
        			}
        		})
        	}
        	return list;
        },
	}, {});

	MIS.CouponManager = MIS.derive(null, {
		create: function(scope, promise){
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			// this.getPage(that.currentPage, that.pageSize);
			this.initGridOptions();
			this.requestCouponDownlistTimstamp = null;
		},
		// getExperienceProduct: function(callback){
		// 	// 获取新手产品
		// 	// this.experienceProduct ...
		// 	var that = this;
		// 	var apiName = 'productList';
		// 	var urlStr = '{0}/{1}?tag=newbie';
		// 	this.promise({
		// 		serverName: 'mgtSettleService',
		// 		apiName:apiName,
		// 		method:'get',
		// 		urlStr: urlStr
		// 	}).then(function(response){
		// 		if(response.data['error'] != 0){
		// 			var errorMsg = MIS.Config.errorMessage(response.data['error']);
		// 			MIS.failedFn(errorMsg);
		// 			return
		// 		}
		// 		var list = response.data['data'];
		// 		//
		// 		callback(list);
		// 	}, function(){
		// 		//
		// 		console.log('getExperienceProduct failed!');
		// 	})
		// },
		getAllSellingProductList: function(callback){
			// 获取已经审核通过的产品
			var that = this;
			var apiName = 'couponProductList';
			// 募集中的产品 prodStatus = 1
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&prodStatus=1', [1, 200]);
			var urlStr = '{0}/{1}?' + searchStr;
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'get',
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var list = response.data['data'];
				//
				callback(list);
			}, function(){
				//
				console.log('getProductList failed!');
			})
		},
		createCoupon:function(couponObj, success, failed){
			var that = this;
			var apiName = 'createCoupon';
			var obj = new MIS.Coupon();
			var requestData = obj.randerCreateCouponObj(couponObj);
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'post',
				data: requestData
			}).then(function(response){
				var error = response.data['error'];
				if( error != 0){
					var errorMsg = MIS.Config.errorMessage(error);
					var errorStr = response.data['message'];
					MIS.failedFn(errorMsg + '-' + errorStr);
					return
				}else{
					success()
				}
			}, function(){

			})
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
				{name: 'couponObj.couponId', displayName:'ID',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.categoryName', displayName:'类别',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.title.value', displayName:'优惠券名称',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.urgentFlagStr', displayName:'激活状态',  minWidth:125,enableHiding:false,enableColumnMenu:false},
				// {name: 'couponObj.statusAudit', displayName:'审核状态', cellFilter: 'couponStatusAuditFilter', minWidth:125,enableHiding:false,enableColumnMenu:false},
				{name: 'couponObj.value.value', displayName:'面值(元)',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.term.value', displayName:'有效期(天)',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.countPlanned.value', displayName:'发行上限(张)',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.countIssued', displayName:'已领取张数(张)',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
				{name: 'couponObj.countUsed', displayName:'已使用张数(张)',  minWidth: 125, enableHiding:false, enableColumnMenu:false},
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
			var searchStr = MIS.Util.stringFormat('pageIdx={0}&pageSize={1}', [page, pageSize]);
			
			var urlStr = '{0}/{1}?' + searchStr;
			this.getCouponList(urlStr);
		},
		getCouponList:function(urlStr){
			var that = this;
			var apiName = 'couponList';
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
				var pageData = that.randerCouponList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		getSearchDownList: function(title, success, failed){
			var that = this;
			this.requestCouponDownlistTimstamp = MIS.Util.getTimeStamp();
			var apiName = 'couponList';
			var searchStr = MIS.Util.stringFormat('title={0}&pageSize={1}&requestId={2}', [title, -1, this.requestCouponDownlistTimstamp]);
			var urlStr = '{0}/{1}?' + searchStr;
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
				var requestId = response.data['requestId'];
				//ignore time stamp < last request
				if(requestId < that.requestCouponDownlistTimstamp)
					return
				var responseData =response.data['data'];
				var datalist = [];
				var len = responseData.length;
				if(len > 0){
					for(var i=0; i<len;i++){
						var item = responseData[i];
						var obj = {
							name: item.coupon.title,
							value: item.coupon.couponId
						}
						datalist.push(obj)
					}
				}else{
					datalist.push({name: '', value: ''})
				}
				
				success(datalist)
			},function(){
				//
			})
		},
		randerCouponList:function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.Coupon();
					obj.randerCouponObj(item);
					listData.push(obj);
				}
			}
			return listData;
		},
		getCouponDetail: function(couponId){
			// 
			var that = this;
			var apiName = 'couponDetail';
			var searchStr = MIS.Util.stringFormat('couponId={0}', [couponId]);
			var urlStr = '{0}/{1}?' + searchStr;
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
				debugger;
			}, function(){

			})
			// return couponObj
		},
		activeCoupon: function(couponId, flag, success){
			var that = this;
			var enableFlag = flag == 3? true:false;
			var apiName = 'activeCoupon';
			var searchStr = MIS.Util.stringFormat('enableFlag={0}', [enableFlag]);
			var urlStr = '{0}/{1}?' + searchStr;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				urlStr: urlStr,
				apiParam: [couponId]
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				that.refresh();
				success();
			}, function(){

			})
		}
	}, {})
})()