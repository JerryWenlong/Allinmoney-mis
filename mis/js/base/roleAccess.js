(function(){
	'use strict'
	// ROLE_ADMIN,
 //    ROLE_CUSTOM,
 //    ROLE_FINANCE,
 //    ROLE_SETTLE,
 //    ROLE_OPERATOR,
	//用户权限控制
	var ROLE = {
		ADMIN: 'ROLE_ADMIN', //admin
		CUSTOM: 'ROLE_CUSTOM',//运营
		FINANCE:'ROLE_FINANCE', //财务
		SETTLE: 'ROLE_SETTLE', //清算
		OPERATOR: 'ROLE_OPERATOR', //产品
	}

	var misFnTree = [
        {'icon':'icon1','parent':false,'roleName': '产品管理', 'roleId':'role1', 'children':[
	    	{ 'parent':'role1','roleName' : '产品列表', 'roleId' : 'role11', 'children' : [] },
        ]},
        {'icon':'icon2','parent':false,'roleName': '用户管理', 'roleId':'role2', 'children':[
            { 'parent': 'role2', 'roleName': '用户管理', 'roleId': 'role21', 'children': []},
            { 'parent': 'role2', 'roleName': '渠道管理', 'roleId': 'role22', 'children': []},
            { 'parent': 'role2', 'roleName': '短信管理', 'roleId': 'role23', 'children': []},
            // { 'parent': 'role2', 'roleName': '中奖记录', 'roleId': 'role24', 'children': []},
        ]},
        {'icon':'icon3','parent':false,'roleName': '财务管理', 'roleId':'role3', 'children':[
            { 'parent':'role3','roleName' : '提现管理', 'roleId' : 'role31', 'children' : [] },
            { 'parent':'role3','roleName' : '充值管理', 'roleId' : 'role32', 'children' : [] },
            { 'parent':'role3','roleName' : '代收审核', 'roleId' : 'role34', 'children' : [] },
            { 'parent':'role3','roleName' : '代付审核', 'roleId' : 'role35', 'children' : [] },
        ]},
        // {'icon':'icon4','parent':false,'roleName': '订单管理', 'roleId':'role4', 'children':[
        //     { 'parent':'role4','roleName' : '订单管理', 'roleId' : 'role41', 'children' : [] },
        // ]},
        {'icon':'icon5','parent':false,'roleName': '资金审核', 'roleId':'role5', 'children':[
            { 'parent':'role5','roleName' : '资金转出审核', 'roleId' : 'role51', 'children' : [] },
            { 'parent':'role5','roleName' : '资金转入审核', 'roleId' : 'role52', 'children' : [] },
        ]},
        // {'icon':'icon6','parent':false,'roleName': '审核记录', 'roleId':'role6', 'children':[
        //     { 'parent':'role6','roleName' : '转出审核记录', 'roleId' : 'role61', 'children' : [] },
        //     { 'parent':'role6','roleName' : '转入审核记录', 'roleId' : 'role62', 'children' : [] },
        // ]},
        {'icon':'icon8', 'parent': false, 'roleName': '优惠券', 'roleId': 'role8', 'children': [
            {'parent': 'role8', 'roleName': '优惠券管理', 'roleId': 'role81', 'children':[]},
            {'parent': 'role8', 'roleName': '升息令牌管理', 'roleId': 'role82', 'children':[]},
        ]},
        {'icon':'icon9', 'parent': false, 'roleName': '公告', 'roleId': 'role9', 'children': [
            {'parent': 'role9', 'roleName': '公告管理', 'roleId': 'role91', 'children':[]},
        ]},
        {'icon':'icon10', 'parent': false, 'roleName': '活动规则', 'roleId': 'role_10', 'children': [
            {parent: 'role_10', roleName: '注册送积分', roleId: 'role_10_1', children: []},
            {parent: 'role_10', roleName: '邀请有礼', roleId: 'role_10_2', children: []},
            {parent: 'role_10', roleName: '抽奖活动', roleId: 'role_10_3', children: []},
        ]},
        // {'icon':'icon11', 'parent': false, 'roleName': '点币查询', 'roleId': 'role_11', 'children': [
        //     {parent: 'role_11', roleName: '点币获得查询', roleId: 'role_11_1', children: []},
        //     {parent: 'role_11', roleName: '点币使用查询', roleId: 'role_11_2', children: []},
        //     {parent: 'role_11', roleName: '点币持有查询', roleId: 'role_11_3', children: []}
        // ]}
        {'icon': 'icon12', 'parent': false, 'roleName': '报表', 'roleId': 'role_12', 'children': [
            {parent: 'role_12', roleName: '报表查询01', roleId: 'role_12_1', children: []}
        ]},
	];

	var misSysTree = [
        {'icon':'icon8', 'parent':false, 'roleName' : '账号管理', 'roleId' : 'sysrole1', 'children' : [
            { 'parent':'sysrole1','roleName' : '账号操作', 'roleId' : 'sysrole11', 'children' : [] },
        ]}]

    MIS.Access = MIS.derive(null, {
		create: function(roleList){
			this.roleList = roleList;
			return this;
		},
		getTreeList: function(){
			var tree_1 = [], tree_2 = [], level1 = [], level2 = [];
			if(this.hasRole(ROLE.ADMIN)){
				tree_1 = misFnTree;
				tree_2 = misSysTree;
				return {fnTree: tree_1, sysTree: tree_2}
			}
			if(this.hasRole(ROLE.CUSTOM)){
				var _lv1 = ['role1', 'role2', 'role3', 'role5', 'role8', 'role9', 'role_10', 'role_11', 'role_12'];
				level1 = MIS.Util.union(level1, _lv1);
				var _lv2 = ['role11', 'role21', 'role22', 'role23', 'role31', 'role32', 'role52', 'role81', 'role91', 'role_10_1', 
				'role_10_2', 'role_10_3', 'role_11_1', 'role_11_2', 'role_11_3', 'role_12_1'];
				level2 = MIS.Util.union(level2, _lv2);
			}
			if(this.hasRole(ROLE.SETTLE)){
				var _lv1 = ['role3', 'role5'];
				level1 = MIS.Util.union(level1, _lv1);
				var _lv2 = ['role34', 'role35', 'role51', 'role52'];
				level2 = MIS.Util.union(level2, _lv2);
			}
			if(this.hasRole(ROLE.FINANCE)){
				var _lv1 = ['role3', 'role5'];
				level1 = MIS.Util.union(level1, _lv1);
				var _lv2 = ['role34', 'role35', 'role51', 'role52'];
				level2 = MIS.Util.union(level2, _lv2);
			}
			if(this.hasRole(ROLE.OPERATOR)){
				var _lv1 = ['role1', 'role5'];
				level1 = MIS.Util.union(level1, _lv1);
				var _lv2 = ['role11', 'role52'];
				level2 = MIS.Util.union(level2, _lv2);
			}
			for(var i=0; i<misFnTree.length; i++){
				var item = misFnTree[i];
				if(level1.indexOf(item.roleId) >= 0){
					var childNodes = [];
					for(var j=0; j<item.children.length; j++){
						var child = item.children[j];
						if(level2.indexOf(child.roleId) >= 0){
							childNodes.push(child);
						}
					}
					item.children = childNodes;
					tree_1.push(item);
				}
			}
			return {fnTree: tree_1, sysTree: tree_2}
		},
		showFundOutAuditBtn: function(){
			var _accessList = [ROLE.ADMIN];
			return this.inAccessList(_accessList);
		},
		showFundInAuditBtn: function(){
			var _accessList = [ROLE.ADMIN, ROLE.CUSTOM, ROLE.SETTLE, ROLE.FINANCE, ROLE.OPERATOR];
			return this.inAccessList(_accessList);
		},
		disabledFundInAuditBtn: function(fundStatus){
			// var fundStatus = 
			if(this.hasRole(ROLE.ADMIN) && fundStatus <= 2){
				return false
			}
			if(this.hasRole(ROLE.SETTLE) && fundStatus == 0){
				//清算人员 第一步 对内对账
				return false
			}
			if(this.inAccessList([ROLE.CUSTOM, ROLE.OPERATOR]) && fundStatus == 1){
				//运营 产品 第二步 对外对账
				return false
			}
			if(this.hasRole(ROLE.FINANCE) && fundStatus == 2){
				//财务 第三步 收款
				return false
			}
			return true;
		},
		financeShowPayBtn: function(){
			// 财务 代付审核 打款按钮
			var _accessList = [ROLE.ADMIN, ROLE.FINANCE];
			return this.inAccessList(_accessList);
		},
		financeInShowAuditBtn: function(){
			var _accessList = [ROLE.ADMIN, ROLE.SETTLE];
			return this.inAccessList(_accessList);
		},
		financeOutShowAuditBtn: function(){
			var _accessList = [ROLE.ADMIN, ROLE.SETTLE];
			return this.inAccessList(_accessList);
		},
		showSysTree: function(){
			// 是否显示 系统管理
			var _accessList = [ROLE.ADMIN];
			return this.inAccessList(_accessList);
		},
		showProdShelfBtn: function(){
			var _accessList = [ROLE.ADMIN, ROLE.CUSTOM];
			return this.inAccessList(_accessList);
		},
		showProdInvestBtn: function(){
			var _accessList = [ROLE.ADMIN, ROLE.CUSTOM];
			return this.inAccessList(_accessList);
		},
		showProdAuditBtn: function(){//产品审核 只有产品部门可以 运营不行
			var _accessList = [ROLE.ADMIN, ROLE.OPERATOR];
			return this.inAccessList(_accessList);
		},
		disabledProductEdit: function(){
			var _accessList = [ROLE.ADMIN, ROLE.CUSTOM];
			return !this.inAccessList(_accessList);
		},
		hasRole: function(role){
			var index = this.roleList.indexOf(role);
			return index>=0
		},
		inAccessList: function(accessList){
			var _access = false;
			this.roleList.forEach(function(role){
				if(accessList.indexOf(role)>=0){
					_access = true;
					return
				}
			})
			return _access;
		},
	}, {})
})()