(function(){
	var sStorage = {
		getItem:function(c_name){
			if(document.cookie.length>0){
				c_start=document.cookie.indexOf(c_name + "=");
				if(c_start != -1){
					c_start = c_start + c_name.length +1;
					c_end=document.cookie.indexOf(";",c_start)
				    if (c_end==-1) c_end=document.cookie.length
			    	return unescape(document.cookie.substring(c_start,c_end))
				    }
				}
			return "";
		},
		setItem:function(c_name, value, expireDays){
			var expireDays = expireDays || 365;
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expireDays);
			document.cookie=c_name + "=" + escape(value) + 
			((expireDays == null)? "" : ";expires=" + exdate.toGMTString());
		},
		removeItem:function(c_name){
			this.setItem(c_name,"",-1000);
		}
	};
	var lStorage = window.localStorage;

	var storeUserTemp = function(userName, token, roleList){
		sStorage.setItem('userName', userName);
		sStorage.setItem('token', token);
		sStorage.setItem('roleList', roleList)
	};
	var getUserTemp = function(){
		var userName = sStorage.getItem('userName');
		var token = sStorage.getItem('token');
		var roleList = sStorage.getItem('roleList');
		return {userName: userName, token: token, roleList: roleList}
	};
	var storeUserLocally = function(userName, token, roleList){
		lStorage.setItem('userName', userName);
		lStorage.setItem('token', token);
		lStorage.setItem('roleList', roleList)
	};
	var getUserLocally = function(){
		var userName = lStorage.getItem('userName');
		var token = lStorage.getItem('token');
		var roleList = lStorage.getItem('roleList');
		return {userName: userName, token: token, roleList: roleList}
	};

	var _round = 10;

	MIS.User = MIS.derive(null, {
		create: function(promise){
			this.userName = '';
			this.token = '';
			this.roleList = null;
			this.hasLogin = false;
			this.promise = promise;

			var user = this.getUser();
			if (user){
				this.userName = user.userName;
				this.token = user.token;
				this.roleList = user.roleList;
				this.hasLogin = true;
			}
			return this
		},
		storeUser:function(remember, userInfo){
			this.userName = userInfo.userName;
			this.token = userInfo.token;
			this.roleList = userInfo.roleList;
			if(remember){
				storeUserLocally(userInfo.userName, userInfo.token, userInfo.roleList);
			}else{
				storeUserTemp(userInfo.userName, userInfo.token, userInfo.roleList);
			};
			this.hasLogin = true;
		},
		getUser: function(){
			var userInfoTemp = getUserTemp();
			var userInfoLocal = getUserLocally();
			var info = null;
			if(userInfoTemp.token && userInfoTemp.token != ''){
				info = userInfoTemp;
			}else if(userInfoLocal.token && userInfoLocal.token != ''){
				info = userInfoLocal;
			}
			// if info == null, need login
			return info;
		},
		getUserName: function(){
			var info = this.getUser();
			if(info != null){
				return info.userName
			}else{
				return null;
			}
		},
		getUserSalt: function(loginId){
			var urlStr = "{0}/{1}/" + loginId;
			return this.promise({
				serverName: 'userService',
				apiName: 'salt',
				method: 'get',
				urlStr: urlStr,
			})
		},
		login: function(userName, userPassword, successFn, failedFn){
			var that = this;
			this.getUserSalt(userName).then(function(response){
				// get salt 
				var errorCode = response.data['error'];
				if(errorCode == '0'){
					var salt = response.data['data'].salt;
					var encryptPassword = that.generateMD5Sync(userPassword, salt);
					that.promise({
						serverName: 'userService',
						apiName:'signin',
						method:'post',
						data: {
							userName: userName,
							password: encryptPassword
						}
					}).then(function(response){
						//login success
						var errorCode = response.data['error'];
						if(errorCode == 0){
							var data = response.data['data'];
							var token = data['accessToken'];
							var cellphone = data['cellphone'];
							var userName = data['userName'];
							var roleList = data['roleTypes'];
							roleList = roleList.join('|');
							that.storeUser(true, {userName: userName, token: token, roleList: roleList});
							successFn();	
						}else{
							var errorMsg = MIS.Config.errorMessage(errorCode);
							failedFn(errorMsg);
						}
						
					}, function(){
						//login failed system error
					})
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					failedFn(errorMsg);
				}
			}, function(response){
				// get salt failed system error
				if(response.status == 404){
					failedFn('用户不存在')
				}else{
					failedFn('网络异常')
				}
				
			});
		},
		cryptPasswordSync: function(pw, salt){
			if(!salt || salt==""){
				var salt = dcodeIO.bcrypt.genSaltSync(_round);
			}
			var hash_str = dcodeIO.bcrypt.hashSync(pw, salt);
			return [hash_str, salt];
		},
		generateMD5Sync: function(pw, salt, random_key){
			var hash_str = this.cryptPasswordSync(pw, salt)[0];
			var str = random_key? (hash_str + random_key) : hash_str;
			var md5_result = md5(str);
			return md5_result;
		},
		getToken: function(){
			var userInfo = this.getUser();
			if (userInfo != null){
				return userInfo.token;
			}else{
				return null;
			}
		},
		clearUserTemp: function(){
			sStorage.removeItem('loginuser');
			sStorage.removeItem('token');
		},
		clearUserLocally: function(){
			lStorage.removeItem('loginuser');
			lStorage.removeItem('token');
		},
		logout: function(successFn, failedFn){
			var that = this;
			this.promise({
				serverName: 'userService',
				apiName: 'signout',
				method: 'get'
			}).then(function(response){
				var errorCode = response.data['error'];
				if(errorCode == 0){
					that.clearUserTemp();
					that.clearUserLocally();
					successFn();	
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					failedFn(errorMsg);
				}
			}, function(error){
				//
				failedFn()
			});
		},
		validatePassword: function(oldPassword, successFn, failedFn){
			//validate password before reset password
			var that = this;
			this.promise({
				serverName: 'userService',
				apiName:'validatePassword',
				method: 'post',
				data: {
					oldPassword: oldPassword
				}
			}).then(function(response){
				var errorCode = response.data['error'];
				if(errorCode == '0'){
					// 验证成功
					successFn();
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					failedFn(errorMsg);
				}
			}, function(){

			})
		},
		resetPassword: function(oldPassword, password, confirmPassword, successFn, failedFn){
			var that = this;
			this.getUserSalt(this.userName).then(function(response){
				// get salt 
				var errorCode = response.data['error'];
				if(errorCode == '0'){
					var salt = response.data['data'].salt;
					var _password = that.cryptPasswordSync(password, salt)[0];
					var _confirmPassword = that.cryptPasswordSync(confirmPassword, salt)[0];
					var _oldPassword = that.cryptPasswordSync(oldPassword, salt)[0];
					that.validatePassword(_oldPassword, function(){
						that.promise({
							serverName: 'userService',
							apiName:'resetPassword',
							method:'put',
							data: {
								password: _password,
								confirmPassword: _confirmPassword
							}
						}).then(function(response){
							//login success
							var errorCode = response.data['error'];
							if(errorCode == 0){
								successFn();	
							}else{
								var errorMsg = MIS.Config.errorMessage(errorCode);
								failedFn(errorMsg);
							}
							
						}, function(){
							//login failed system error
						})
					}, failedFn);
				}else{
					var errorMsg = MIS.Config.errorMessage(errorCode);
					failedFn(errorMsg);
				}
			}, function(response){
				// get salt failed system error
				if(response.status == 404){
					failedFn('用户不存在')
				}else{
					failedFn('网络异常')
				}
				
			});
		}
	}, {})
})()