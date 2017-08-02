var authority = new MIS._Angular('authority', []);
authority.createRoute('权限管理', '/sysrole12', 'pages/authority.html', 'authorityController');
authority.createRoute('添加权限', '/sysrole12/edit', 'pages/authority-edit.html', 'authorityController');
authority.createController('authorityController',['$scope','publicService','$routeParams', function($scope, publicService, $routeParams) {
	// body...
	var authorityObj = MIS.authorityObj || new MIS.Authority($scope, publicService.promise);
	MIS.authorityObj = authorityObj;

	$scope.roleList = authorityObj.roleList;
	$scope.$on('dataChanged', function(event, roleList){
		$scope.roleList = roleList;
	});

	$scope.selectRole = function(role){
		authorityObj.currentRole = role;
		showAuth(role);
	}
	$scope.isCurrentSelectRole = function(role){
		if(authorityObj.currentRole){
			return role.roleId == authorityObj.currentRole.roleId
		}else{
			return false
		}
	}
	var showAuth = function(role){
		$scope.currentRolePersmissionList = authorityObj.showRolePermissions(role);
	}
	$scope.initPermissionTree=function(){
	//if authorityObj.currentRole is exist
		if(authorityObj.currentRole){
			$scope.currentRolePersmissionList = authorityObj.showRolePermissions(authorityObj.currentRole);
		}
	}
	//init create role permission list 
	$scope.creatRolePermissionList = authorityObj.showRolePermissions();
	$scope.roleTypeOptions = authorityObj.roleType.getRoleListOptions();
	//
	$scope.saveAuth = function(){
		if(authorityObj.currentRole){
			var permissionList = authorityObj.getPermissionIds($scope.currentRolePersmissionList);
			authorityObj.saveEditRole(authorityObj.currentRole.roleId, permissionList, function(){}, function(){});
		}
	}

	$scope.createRole = function(){
		//
		$scope.go('/sysrole12/edit');
	}

	$scope.cancelCreate = function(){
		$scope.go('/sysrole12');
	}
	
	var initNewRole = function(){
		$scope.newRole = {
			name:'',
			type:'',
		};
		$scope.selectRoleType = function(index){
			$scope.newRole.type = ''+index;
		}
	}
	initNewRole();

	$scope.saveNewRole = function(){
		var permissionList = authorityObj.getPermissionIds($scope.creatRolePermissionList).join(',');
		var roleName = $scope.newRole.name;
		var description = roleName;
		var roleType = $scope.newRole.type;
		authorityObj.saveCreatedRole(
			roleName, 
			roleType, 
			description, 
			permissionList,
			function(){
				$scope.go('back');
			},function(){

			});//todo success callback
	}
	console.log($scope.roleTypeOptions)
}]);

MIS.Authority = MIS.derive(null, {
	create:function($scope, publicPromise){
		this.roleList=[];
		this.permissionList=[];
		this.scope = $scope;
		this.initService(publicPromise);
		this.initData();
	},
	go:function(path){
		MIS.navHistoryObj.goNavigate(path);
	},
	roleType:{
		roleTypeList: ['ROLE_USER','ROLE_ADMIN','ROLE_SERVICE','ROLE_OPERATOR','ROLE_BROKER','ROLE_COMPANY'],
		getType:function(index){
			return this.roleTypeList[index];
		},
		getRoleListOptions:function(){
			var options = [];
			this.roleTypeList.forEach(function(item, index, array){
				options.push({
					index:index,
					label:item
				})
			});
			return options
		},
	},
	initService:function(publicPromise){
		this.promise = publicPromise;
	},
	initData:function(){
		this.getRoleList();
		this.getPermissionList();
	},
	initRoleObj:function(responseObj){
		var role = {};
		role.roleName = responseObj.description;
		role.roleId = responseObj.roleId;
		role.available = responseObj.available;
		role.permissionList = responseObj.permissionIds.split(',');
		role.roleType = this.roleType.getType(responseObj.roleType);
		role.role = responseObj.role;
		return role
	},
	initPermissionObj:function(responseObj){
		var that = this;
		var permission = {};
		permission.permissionId = responseObj.permissionId.toString();
		permission.parentId = responseObj.parentId;
		permission.permission = responseObj.permission;
		permission.permissionName = responseObj.description;
		permission.available = responseObj.available;
		permission.checked = false;
		permission.children = [];

		if(responseObj.permissions && responseObj.permissions.length>0){
			responseObj.permissions.forEach(function(item, index, array){
				permission.children.push(that.initPermissionObj(item))
			})
			
		}
		return permission;
	},
	getRoleList:function(successFn, failedFn){
		var that = this;

		// get all Role list with it's auth list
		this.promise({
			serverName:'userService',
			apiName:'role',
			method:'get'
		}).then(function(response){
			if(response.data.error == "0"){
				that.roleList = [];
				var len = response.data['data'].length;
				for(var i=0;i<len;i++){
					that.roleList.push(that.initRoleObj(response.data['data'][i]));
				}
			}
			that.scope.$emit('dataChanged', that.roleList);
			if(successFn){
				successFn();
			}

		},function(error){
			console.log('api error');
			that.roleList = [];
			that.scope.$emit("dataChanged", that.roleList);
		});
	},
	getPermissionList:function(){
		var that = this;
		// get all auth list, for showing the auth tree
		this.promise({
			serverName: 'userService',
			apiName:'permission',
			method:'get',
		}).then(function(response){
			if(response.data.error == "0"){
				that.permissionList = [];
				if(MIS.Util.isArray(response.data['data'])){
					var len = response.data['data'].length;
					for(var i=0;i<len;i++){
						that.permissionList.push(that.initPermissionObj(response.data['data'][i]));
					}
				}else{
					that.permissionList.push(that.initPermissionObj(response.data['data']))
				}
				
			}
			that.scope.$emit('dataChanged', that.roleList)
		},function(error){
			console.log('api error');
			that.permissionList = [];
			that.scope.$emit("dataChanged", that.roleList);
		});

	},
	getPermissionIds:function(permissionTree){
		//get permissionIds from permission tree 
		var permissionIds = [];

		var getDeepIds = function(nodeList){
			nodeList.forEach(function(node){
				if(node.checked){
					permissionIds.push(node.permissionId)
				}
				if(node.children.length>0){
					getDeepIds(node.children)
				}
			})
		}

		getDeepIds(permissionTree);
		return permissionIds;
	},
	saveEditRole: function(roleId, permissionList, successFn, failedFn){
		var that = this;
		// get all Role list with it's auth list
		this.promise({
			serverName:'userService',
			apiName:'role',
			method:'put',
			data:permissionList,
			urlStr:'{0}/{1}/'+roleId+'/permissions',
		}).then(function(response){
			if(response.data.error == "0"){
				var len = response.data['data'].length;
				//set role.permissionList
				that.roleList.find(function(role){
					if(role.roleId == roleId){
						role.permissionList = response.data['data'].toString().split(',');
					}
				})
			}
			that.scope.$emit('dataChanged', that.roleList);
			successFn();
		},function(error){
			console.log('api error');
			failedFn();
		});
	},
	saveCreatedRole: function(roleName, roleType, description, permissionIds, successFn, failedFn){
		var that = this;
		var popWindow1 = new MIS.Popup({
			loadingTxt: 'Loading...'
		});

		var data = {
			role: roleName,
			roleType: roleType,
			description: description,
			permissionIds: permissionIds
		}
		this.promise({
			serverName: 'userService',
			apiName:'role',
			method:'post',
			data: data
		}).then(function(response){
			that.getRoleList(function(){
				var popWindow2 = new MIS.Popup({
					w: 150,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '成功'
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
									popWindow2.close();
									successFn();
								}
							}
						]
					]
				});
			});
		},function(error){
			failedFn();
		})
	},
	deleteRole: function(){
		//
	},
	deepClear:function(permissionNode){
		//deep clear function to clear the node and all child checked status
		this.deepChangeStatus(permissionNode, false);
	},
	deepChangeStatus:function(permissionNode, status){
		var that = this;
		if(permissionNode.children.length > 0){
			permissionNode.children.forEach(function(node){
				that.deepChangeStatus(node, status);
			});
		}
		permissionNode.checked = status;
	},
	showRolePermissions:function(role){
		// according to the role permission list,
		// showing the permission tree of selected role.
		var that = this;
		// permission tree list
		var list = this.permissionList;
		//clear the permission tree.
		list.forEach(function(permissionNode){
			//clear, set all permission as false
			that.deepClear(permissionNode);
		});
		// compare permission id of the node in permission tree with
		// role permission, if {permissionTree}.perssionId == {role}.permissionId
		// set this node and all its child node status as checked in permissionTree.
		function deepShow(permissionList, rolePermissionId){
			permissionList.forEach(function(permissionNode){
				if(permissionNode.permissionId == rolePermissionId) {
					that.deepChangeStatus(permissionNode, true);
				}
				if(permissionNode.children.length>0){
					deepShow(permissionNode.children, rolePermissionId);
				}
			})
		}
		//
		if(role && role.permissionList.length>0){
			role.permissionList.forEach(function(id){
				deepShow(list, id);
			})
		}
		return list
	},

},{})