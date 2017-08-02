(function(){
MIS._moduleList = [];//all angular modules merge into misApp
MIS._viewList = [];//all ng-route views
MIS._Angular = MIS.derive(null, {
	module:null,
	controllers:[],
	create: function(name, moduleList){
		//
		MIS._moduleList = MIS._moduleList || [];
		var module = angular.module(name, moduleList);
		MIS._moduleList.push({
			name: name,
			module: module
		});
		this.module = module;
	},
	createController: function(name, args){
		var controller = this.module.controller(name, args);
		return controller;
	},
	createService:function(name, args){
		var service = this.module.factory(name, args);
		return service;
	},
	createRoute: function(viewName, viewPath, templateUrl, controllerName, resolve, notTab){
		var resolve = resolve || {};
		resolve['loadingResource'] = ['prepareService', function(prepareService){
	        return prepareService.loadingResource();
	    }];
		MIS._viewList.push({
			viewName: viewName,
			viewPath: viewPath,
			templateUrl: templateUrl,
			controllerName: controllerName,
			resolve: resolve,
			notTab: notTab? notTab: false,
		})
	}
},{});

var prepare = new MIS._Angular('misPrepare', []);
prepare.createService('prepareService', ['$http', '$q', 'publicService', function($http, $q, publicService){
    return {
        loadingResource: function(){
            var d = $q.defer();
            if(MIS.dictData && MIS.loadSuccess){
                return d.resolve();
            }else{
                new MIS.MisDictData(publicService.promise, d);
            }
            
            return d.promise;
        }
    }
}])

MIS.app = MIS.derive(null, {
	app: null,
	appName:'',
	moduleList: [],
	viewList:[],
	create: function(appName, ngModuleList){
		this.appName = appName || 'misApp';
		this.initModule(ngModuleList);
		this.initRoute();
	},
	initModule:function(ngModuleList){
		var that = this;
		var moduleList = function(){
			var result = [];
			if(MIS._moduleList.length > 0){
				that.moduleList = MIS._moduleList;
			}
			for(var i=0;i< that.moduleList.length;i++){
				var module = that.moduleList[i];
				result.push(module.name);
			}
			return result;
		}
		var list = moduleList();
		Array.prototype.push.apply(list, ngModuleList);
		var misApp = angular.module(this.appName, list);
		this.app = misApp;
	},
	initRoute: function(){
		var that = this;
		this.app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			if(MIS._viewList.length >= 1){
				for(var i=0; i<MIS._viewList.length;i++){
					var nav = MIS._viewList[i];
					$routeProvider.when(nav.viewPath, {templateUrl: nav.templateUrl, controller: nav.controllerName, reloadOnSearch:true, resolve:nav.resolve});
				}
			}
			$routeProvider.otherwise({redirectTo:'/'});
			$locationProvider.html5Mode(true);
		}])
	},
},{})

MIS.GridManager = MIS.derive(null, {
	init: function(scope, promise, apiName, useGrid){
		this.scope = scope;
		this.promise = promise;
		this.apiName = apiName;
		this.currentPageList = [];
		this.total = 0;
		this.pageSize = 10;//default
		this.currentPage = 1;//default
		this.tempStorageObj = null;
		this.useGrid = useGrid;
		this.initScope();
		this.loading = new MIS.Popup({
			loadingTxt: 'Loading',
			notshow: true
		});
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
		this.loading.popup();
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
			obj = this.randerObj(item);
			list.push(obj)
		}
		return list;
	},
	randerObj: function(){
		/* need complete in child */
	},
	initScope: function(){
		var $scope = this.scope;
		var that = this;
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		$scope.gridOptions = this.gridOptions;
		//listen data change
		if(!this.useGrid){
			$scope.$on('dataChange',function(event, data){
				$scope.pageListData = data.currentPageList;
				$scope.myConf.totalItems = data.total * data.pageSize;
				$scope.myConf.currentPage = data.currentPage;
				that.loading.close();
			});
		}else{
			$scope.$on('dataChange', function(event, data){
				$scope.gridOptions.data = data.currentPageList;
				$scope.myConf.totalItems = data.total * data.pageSize;
				$scope.myConf.currentPage = data.currentPage;
				that.loading.close();
			});
			$scope.gridOptions.onRegisterApi = function(gridApi){
			//set gridApi on scope
				$scope.gridApi = gridApi;
				// gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
				gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
				// gridApi.selection.on.rowSelectionChangedBatch($scope, $scope.selectRowBatch);
				// gridApi.core.on.filterChanged($scope, $scope.filterChanged);
			};
			$scope.selectRow = function(row){
				if(row.isSelected){
					that.tempStorageObj = row.entity;
				}else{
					that.tempStorageObj = null;
				}
			}
		}
		// paging change function
		$scope.changePage = function(page){
			that.getPage(page, $scope.myConf.itemsPerPage);
		}
	}
},{})

})()
