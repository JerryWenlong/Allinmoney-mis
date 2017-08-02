(function(){
	'use strict'
	MIS.Account = MIS.derive(null, {
		create: function(){
			this.init();
		},
		init: function(){
			var obj = {};
			var that = this;
			obj.user_id = {//账户ID
				value:'',
				reg:/^\d+$/,
				validateMsg:'不验证',
				checked: false,
				required:false
			}
			obj.company_no = {//公司编号
				value:'',
				reg: /^\w{0,32}$/,
				validateMsg: '公司编号不能为空，最长32位字符',
				checked: false,
				required: false,
			};
			obj.branch_no = {//分支编号
				value:'',
				reg: /^\w{0,32}$/,
				validateMsg: '分支编号不能为空，最长32位字符',
				checked: false,
				required: false
			};
			obj.user_name ={//用户名
				value:'',
				reg: /^\w{4,30}$/,
				validateMsg: '用户名为4 - 30位字符串,可包含字母、数字和下划线,大小写不敏感',
				checked: false,
				required: true,
			};
			obj.cellphone = {//手机号
				value:'',
				reg: /^\d{11}$/,
				validateMsg: '请正确填写11位手机号',
				checked: false,
				required: true,
			};
			obj.email={
				value:'',
				reg: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
				validateMsg: '请输入正确的邮箱',
				checked: false,
				required: false,
			};
			obj.bind_id={
				value:'',
				reg: /^\w{0,32}$/,
				validateMsg: '',
				checked: false,
				required: false,
			};
			obj.role_ids={//权限
				value:function(){
				 	if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				reg: /^.+$/,
				validateMsg: '请选择用户权限',
				list: MIS.dictData.roleList,
				checked: false,
				required: true,
			};
			obj.name={//真实姓名
				value:'',
				reg: /^(\w+|[\u4e00-\u9fa5]){1,64}$/,
				validateMsg:'',
				checked: false,
				required: true,
			};
			obj.avatar={//头像
				value:'',
				reg:/^.+$/,
				validateMsg:'',
				checked: false,
				required:false
			};
			obj.id_no={//身份证
				value:'',
				reg:/\d{17}[\d|x]|\d{15}/,
				validateMsg:'',
				checked: false,
				required:false,
			};
			obj.gender={
				value:function(){
				 	if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				validateMsg:'',
				reg: /^.+$/,
				list: [
					{name: '保密', value: '0'},
					{name: '男', value: '1'},
					{name: '女', value: '2'},
				],
				checked: false,
				required: false,
			};
			obj.education={
				value:function(){
				 	if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item:{},
				reg: /^.+$/,
				list: [
					{name: '其他', value: '0'},
					{name: '专科', value: '1'},
					{name: '本科', value: '2'},
					{name: '硕士', value: '3'},
					{name: '博士', value: '4'},
				],
				validateMsg:'',
				checked: false,
				required: false,
			};
			obj.marriage = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
						return this.item.value;
					}else{
						return '';
					}
				},
				item:{},
				reg:/^.+$/,
				list: [
					{name: '其他', value: '0'},
					{name: '未婚', value: '1'},
					{name: '已婚', value: '2'},
					{name: '离婚', value: '3'},
				],
				validateMsg:'',
				checked:false,
				required:false
			};
			obj.address={
				value:'',
				reg:/^(\w|[\u4e00-\u9fa5]){1,64}$/,
				validateMsg:'',
				checked: false,
				required: false
			};
			obj.zipcode={
				value:'',
				reg:/^\d{6,8}$/,
				validateMsg:'请输入正确的邮编',
				checked:false,
				required: false
			};
			obj.company_name={
				value:'',
				reg:/^(\w|[\u4e00-\u9fa5]){1,64}$/,
				validateMsg:'请输入正确的公司名',
				checked:false,
				required: false
			};
			obj.department_name={
				value:'',
				reg:/^(\w|[\u4e00-\u9fa5]){1,64}$/,
				validateMsg:'请输入正确的部门名称',
				checked:false,
				required: false
			};
			obj.contact_name={
				value:'',
				reg:/^(\w|[\u4e00-\u9fa5]){1,32}$/,
				validateMsg:'请输入正确的联系人',
				checked:false,
				required: false
			};
			obj.contact_phone={
				value:'',
				reg:/^\d{11}$/,
				validateMsg:'请输入正确的联系人电话',
				checked:false,
				required: false
			};
			obj.remark={
				value:'',
				reg:/^(\w|[\u4e00-\u9fa5]){1,64}$/,
				validateMsg:'备注长度为64个字符',
				checked:false,
				required: false
			};
			obj.status={
				value:function(){
					if(this.item.hasOwnProperty('value')){
						return this.item.value;
					}else{
						return '';
					}
				},
				reg:/^.+$/,
				item:{},
				list:MIS.dictData.roleStatusList,
				checked: false,
				required: false
			}
			this.accountObj = obj;
		},

		renderServerObj: function(responseObj){
			this.accountObj.user_id.value = responseObj.userId;
			this.accountObj.user_name.value = responseObj.userName;
			this.accountObj.name.value = responseObj.name;
			this.accountObj.id_no.value = responseObj.idNo;
			this.accountObj.cellphone.value = responseObj.cellphone;
			this.accountObj.email.value = responseObj.email;
			this.accountObj.role_ids.item.value = responseObj.roleIds;
			this.accountObj.status.item.value = responseObj.status;
			for(var item in this.accountObj){
				if(this.accountObj[item].hasOwnProperty('checked'))
					this.accountObj[item].checked = true;
			}
		},

		renderRequestData:function(){
			var requestData = {};
			var obj = this.accountObj;
			// requestData.companyNo = obj.company_no.value;
			// requestData.branchNo = obj.branch_no.value;
			requestData.userId = obj.user_id.value;
			requestData.userName = obj.user_name.value;
			// requestData.cellphone = obj.cellphone.value;
			// requestData.email = obj.email.value;
			// requestData.bindId = obj.bind_id.value;
			requestData.roleIds = obj.role_ids.value().toString();
			requestData.name = obj.name.value;
			// requestData.avatar = obj.avatar.value;
			// requestData.idNo = obj.id_no.value;
			// requestData.gender = obj.gender.value();
			// requestData.education = obj.education.value();
			// requestData.marriage = obj.marriage.value();
			// requestData.profession = obj.profession.value;

			return requestData;
		},

		validate: function(obj){
			//obj.value, obj.reg
			var result = false;
			var reg = obj.reg;
			if(typeof(obj.value) == 'function'){
                if( (!obj.required && obj.value() == '') || reg.test(obj.value())){
                    result = true;
                    obj.checked = true;
                }
            }else{
                if((!obj.required && obj.value == '') || reg.test(obj.value)){
                    result = true;
                	obj.checked = true;
                }
            }
			return result;
		},
	　　
	}, {});

	MIS.AccountManager = MIS.derive(null, {
		create: function($scope, promise){
			this.scope = $scope;
			this.promise = promise;
			this.currentSelectAccount = null;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';//default
		},
		eidt: function(account){
			this.currentSelectAccount = account;
		},
		add: function(){
			// add new account
			this.currentSelectAccount = new MIS.Account();
		},
		setSearch: function(search){
			var str = '';
			if(search['asc']) str = MIS.Util.stringFormat('{0}&asc={1}', [str, search['asc']]);
			if(search['roleId']) str = MIS.Util.stringFormat('{0}&roleId={1}', [str, search['roleId']]);
			if(search['name']) str = MIS.Util.stringFormat('{0}&name={1}', [str, search['name']]);
			if(search['cellphone']) str = MIS.Util.stringFormat('{0}&cellphone={1}', [str, search['cellphone']]);
			this.searchStr = str;
		},
		refresh: function(){
			// get page
			this.getPage(this.page, this.pageSize)
		},
		randerAccountList: function(responseData){
			var len = responseData.length;
			var listData = [];
			if(len > 0){
				for(var i=0;i<len;i++){
					var item = responseData[i];
					var obj = new MIS.Account()
					obj.renderServerObj(item);
					listData.push(obj);
				}
			}
			return listData;
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
		getPage: function(page, pageSize){
			this.page = page;
			this.pageSize = pageSize;
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}', [page, pageSize]);
			if(this.searchStr!=''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getAccountList(urlStr);
		},
		getAccountList: function(urlStr){
			var that = this;
			this.promise({
				serverName: 'userService',
				apiName:'user',
				method:'get',
				head:{'Content-Type':'application/json'},
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
				var pageData = that.randerAccountList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		saveNewAccount: function(successFn, failedFn){
			var data = this.currentSelectAccount.renderRequestData();
			this.promise({
				serverName: 'userService',
				apiName:'user',
				method:'post',
				head:{'Content-Type':'application/json'},
				data: data
			}).then(function(response){
				if(response.data['error'] == 0){
					successFn();
				}else{
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
				} 
			})
		},
		updateAccount: function(successFn, failedFn){
			var data = this.currentSelectAccount.renderRequestData();
			var userId = data.userId;
			var urlStr = "{0}/{1}/" + userId;
			this.promise({
				serverName: 'userService',
				apiName:'user',
				method:'put',
				head:{
					'Content-Type':'application/json',
				},
				urlStr: urlStr,
				data: data
			}).then(function(response){
				if(response.data['error'] == 0){
					successFn();
				}else{
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
				} 
			})
		},
		lockAccount: function(account, setStatus, successFn, failedFn){
			var userId = account.accountObj.user_id.value;
			var status = setStatus;
			var str = MIS.Util.stringFormat("{0}/status/{1}", [userId, status]);
			var urlStr = "{0}/{1}/" + str;
			this.promise({
				serverName: 'userService',
				apiName: 'user',
				method: 'put',
				urlStr: urlStr,
			}).then(function(response){
				var errorCode = response.data['error'];
				if(errorCode.toString() == "0"){
					successFn();
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					MIS.failedFn(errorMsg);
				}
			});
		},
		createChannel: function(channleName, cellphone, success){
			var that = this;
			var obj = {
				roleIds: '1,5,6',
				name: channleName,
				cellphone: cellphone
			};
			this.promise({
				serverName: 'userService',
				apiName:'user',
				method:'post',
				head:{'Content-Type':'application/json'},
				data: obj
			}).then(function(response){
				if(response.data['error'] == 0){
					success();
				}else{
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
				} 
			})
		},
		getActivityData: function(agencyId, agencyName, callback){
			//获取活动列表
			var that = this;
			var count = 0;
			this.couponList = [];
			this.signupList = [];
			this.inviteList = [];
			this.lotteryList = [];
			var initAgency = function(dataList, ids){
				if(ids == "" || typeof(ids) != 'string'){
					return;
				}
				var idList = ids.split(',');
				for(var i=0; i<idList.length;i++){
					var id = idList[i];
					for(var j=0; j<dataList.length;j++){
						var item = dataList[j];
						if(item.id == id){
							item.checked = true;
							break;
						}
					}
				}
			}

			var successCallBack = function(){
				count ++;
				if(count >= 4){
					// 先获取是否设置过渠道
					that.hasSetActivity(agencyId, agencyName, function(agency){
						if(typeof(agency) != 'undefined'){
							//已经设置过渠道 填充页面数据
							initAgency(that.couponList, agency.couponIds);
							initAgency(that.signupList, agency.pointActSignupIds);
							initAgency(that.inviteList, agency.pointActInviteIds);
							initAgency(that.lotteryList, agency.lotteryActIds);
							that.confId = agency.confId;
						}
						callback({
							coupon: that.couponList,
							signup: that.signupList,
							invite: that.inviteList,
							lottery: that.lotteryList
						});
					});
				}
			}
			this.getCouponList(successCallBack);
			this.getActivitySignupList(successCallBack);
			this.getActivityInviteList(successCallBack);
			this.getActivityLotteryList(successCallBack);
		},
		generateActivityObj: function(id, name, checked){
			return {id: id, name: name, checked: checked}
		},
		getCouponList: function(c){
			//获取体验金
			var that = this;
			var urlStr = '{0}/{1}?pageIdx=1&pageSize=500&lifecycle=0,1&verbose=false';
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
				var dataList = response.data['data'];
				var list = [];
				for(var i=0;i<dataList.length;i++){
					var item = dataList[i];
					list.push(that.generateActivityObj(item.coupon.couponId, item.coupon.title, false));
				}
				that.couponList = list
				c();
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		getActivitySignupList: function(c){
			//获取注册送积分活动列表
			var that = this;
			var now = new Date().format('yyyy-MM-ddTHH:mm:ss');
			var urlStr = '{0}/{1}?pageIdx=1&pageSize=500&endAt=' + now;
			var apiName = 'activity_signup';
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
				var dataList = response.data['data'];
				var list = [];
				for(var i=0;i<dataList.length;i++){
					var item = dataList[i];
					list.push(that.generateActivityObj(item.activityId, item.activityTitle, false));
				}
				that.signupList = list;
				c();
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		getActivityInviteList: function(c){
			//获取邀请送积分活动列表
			var that = this;
			var now = new Date().format('yyyy-MM-ddTHH:mm:ss');
			var urlStr = '{0}/{1}?pageIdx=1&pageSize=500&endAt=' + now;
			var apiName = 'activity_invite';
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
				var dataList = response.data['data'];
				var list = [];
				for(var i=0;i<dataList.length;i++){
					var item = dataList[i];
					list.push(that.generateActivityObj(item.activityId, item.activityTitle, false));
				}
				that.inviteList = list;
				c();
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		getActivityLotteryList: function(c){
			//获取抽奖活动列表
			var that = this;
			var now = new Date().format('yyyy-MM-ddTHH:mm:ss');
			var urlStr = '{0}/{1}?pageIdx=1&pageSize=500&endAt=' + now;
			var apiName = 'activity_lottery';
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
				var dataList = response.data['data'];
				var list = [];
				for(var i=0;i<dataList.length;i++){
					var item = dataList[i];
					list.push(that.generateActivityObj(item.activityId, item.activityTitle, false));
				}
				that.lotteryList = list;
				c();
			}, function(){
				//
				console.log('getAccountList failed!');
			})
		},
		setChannelActivity: function(agencyId, agencyName, agencyConfList, callback){
			var that = this;
			var apiName = 'agency';
			if(that.confId)
				agencyConfList.confId = that.confId;
			var data = {
				agencyId: agencyId,
				agencyName: agencyName,
				agencyConfList: [agencyConfList]
			}
			var urlStr = '{0}/{1}';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				urlStr: urlStr,
				data: data
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				callback();
			}, function(){
				//
				console.log('');
			})
		},
		hasSetActivity: function(agencyId, agencyName, callback){
			//是否设置过渠道
			var that = this;
			var apiName = 'agency';
			var urlStr = '{0}/{1}?agencyId=' + agencyId + '&agencyName=' + agencyName;
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				urlStr: urlStr,
				method: 'get'
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				var agency = response.data['data'][0];
				callback(agency);
			}, function(){
				console.log('hasSetActivity error')
			})

		},
	},{});
})()