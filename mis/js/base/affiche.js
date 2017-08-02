(function(){
	'use strict'
	MIS.Affiche = MIS.derive(null, {
		create: function(){
			this.afficheObj = this.init();
		},
		init: function(){
			var obj = {}
			obj.bulletinType = {//公告类型 0公告 1新闻 2动态 3广告
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item: {},
				reg: /^.+$/,
				validateMsg: '公告类型',
				list: MIS.dictData.bulletinType,
				error: false,
				required: true
			};

			obj.top = {//公告是否置顶 0不置顶 1置顶
				value: '0',
				reg: /^.+$/,
				validateMsg: '是否置顶',
				error: false,
				required: false
			}

			obj.publish = {//公告是否发布 0 不发布 1 发布
				value:'1',
				reg: /^.+$/,
				validateMsg: '是否发布',
				error: false,
				required: false
			}

			obj.title = {//公告标题
				value: '',
				reg:/^(\w|[_\-]|.|\s|[\u4e00-\u9fa5]){0,64}$/,
				validateMsg: '请输入正确的标题(64字符)',
				error:false,
				required: true
			}

			obj.summery = {//公告简介
				value: '',
				reg:/^(\w|[_\-]|.|\s|[\u4e00-\u9fa5]){0,128}$/,
				validateMsg: '请输入正确的简介（128字符）',
				error:false,
				required: false
			}

			obj.content = {
				value: '',
				// reg: //
				error: false,
				required: false
			}

			obj.thumbnailUrl = "";

			obj.keyWord = {
				value: '',
				reg: /^(\w|[,]|[\u4e00-\u9fa5]){0,256}$/,
				validateMsg:'请输入正确的关键词(256字符,逗号间隔)',
				error: false,
				required: false
			}
			obj.fileUrl = {//文章链接
				value: '',
				reg: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
				error: false,
				required: false
			}
			obj.publishAt = {//发布时间
				value: '',
				errorMsg: '请输入正确的发布时间',
				error: false,
				checkFn: MIS.Util.validationDateTime,
				required: true
			}
			return obj
		},
		validate: function(){
			var result = true;
			for(var item in this.afficheObj){
				var obj = this.afficheObj[item];
				var value = typeof(obj.value) == 'function'? obj.value():obj.value;
				if(obj.required && value === ''){
	    			obj.error = true;
	    			result = false;
	    		}else if(!obj.required && value === ''){
	    			obj.error = false;
	    		}else if(typeof(obj.checkFn) == 'function'){
	    			obj.error = !obj.checkFn(value);
	    			if(obj.error){
	    				result = false;
	    			}
	    		}else if(typeof(obj.reg) == 'object'){
	    			obj.error = !obj.reg.test(value);
	    			if(obj.error){
	    				result = false;
	    			}
	    		}
			}
			
			return result;
		},
		randerServerObj: function(responseObj){
			this.afficheObj.bulletinId = responseObj.bulletinId;
			this.afficheObj.bulletinType.item.value = responseObj.bulletinType;
			this.afficheObj.bulletinTypeDisplay = MIS.getDictName(MIS.dictData.bulletinType, responseObj.bulletinType);
			this.afficheObj.top.value = responseObj.top;
			this.afficheObj.publish.value = responseObj.publish;
			this.afficheObj.title.value = responseObj.title;
			this.afficheObj.summery.value = responseObj.summery;
			this.afficheObj.content.value = responseObj.content;
			this.afficheObj.thumbnailUrl = responseObj.thumbnailUrl;
			this.afficheObj.createdAt = responseObj.createdAt.replace('T', ' ');
			this.afficheObj.keyWord.value = responseObj.keyWord;
			this.afficheObj.fileUrl.value = responseObj.fileUrl;
			this.afficheObj.publishAt.value = responseObj.publishAt? responseObj.publishAt.replace('T', ' '):'';

		},
		randerRequestObj: function(){
			var requestObj = {};
			if(this.afficheObj.bulletinId){
				requestObj.bulletinId = this.afficheObj.bulletinId;
			}
			requestObj.bulletinType = this.afficheObj.bulletinType.value();
			requestObj.top = this.afficheObj.top.value;
			requestObj.publish = this.afficheObj.publish.value;
			requestObj.title = this.afficheObj.title.value;
			requestObj.summery = this.afficheObj.summery.value;
			requestObj.content = this.afficheObj.content.value;
			requestObj.thumbnailUrl = this.afficheObj.thumbnailUrl;
			requestObj.keyWord = this.afficheObj.keyWord.value;
			requestObj.fileUrl = this.afficheObj.fileUrl.value;
			requestObj.publishAt = this.afficheObj.publishAt.value.replace(' ', 'T');;
			return requestObj;
		},
	}, {});


	MIS.AfficheManger = MIS.derive(null, {
		create: function (scope, promise) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			// this.getPage(that.currentPage, that.pageSize);

			this.initGridOptions();
		},
		setSearch: function(search){
			var str = '';
			if(search['type']) str = MIS.Util.stringFormat('{0}&type={1}', [str, search['type']]);
			if(search['title']) str = MIS.Util.stringFormat('{0}&title={1}', [str, search['title']]);
			this.searchStr = str;
		},
		initGridOptions:function(){
			this.gridOptions = {
				enableRowSelection: true,
				enableSelectAll:false,
				multiSelect:false,
				enableFiltering:false,
				enableSorting: false,
			};
			var columnDefs = [
				{name: 'afficheObj.bulletinId', displayName:'公告ID',  minWidth: 150, enableHiding:false, enableColumnMenu:false},
				{name: 'afficheObj.bulletinType.item.value', displayName:'类别',  cellFilter:'bulletinTypeFilter', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'afficheObj.title.value', displayName:'标题名称',  minWidth: 250, enableHiding:false, enableColumnMenu:false},
				{name: 'afficheObj.publish.value', displayName:'状态', cellFilter:'bulletinPublishFilter', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'afficheObj.top.value', displayName:'置顶', cellFilter:'bulletinTopFilter', minWidth: 80, enableHiding:false, enableColumnMenu:false},
				{name: 'afficheObj.createdAt', displayName:'添加时间', minWidth: 180, enableHiding:false, enableColumnMenu:false}
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
			var urlStr = '{0}/{1}?' + searchStr;
			this.getAfficheList(urlStr);
		},
		getAfficheList: function(urlStr){
			var that = this;
			var apiName = 'affiche';
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
				var pageData = that.randerAfficheList(response.data['data']);
				that.setPage(page, total, pageSize, pageData);
			}, function(failed){
				//failed
				console.log('get Affiche list failed');
			})
		},
		randerAfficheList: function(dataList){
			var len = dataList.length;
			var list = [];
			for(var i=0;i<len;i++){
				var item = dataList[i];
				var obj = new MIS.Affiche();
				obj.randerServerObj(item);
				list.push(obj)
			}
			return list;
		},
		createAffiche: function(data, success, failed){
			var that = this;
			var apiName = 'affiche';
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'post',
				data: data
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
		updateAffiche: function(data, success, failed){
			var that = this;
			var apiName = 'affiche';
			var couponId = data.bulletinId;
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'put',
				urlStr: "{0}/{1}/" + couponId,
				data: data
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
		uploadFile: function(file, successFn, failedFn){
			//callback overwrite fileName fileUrl
			var that = this;
			var fData = new FormData();
			fData.append('uploadFile', file)
			this.promise({
				serverName: 'utilService',
				apiName:'upload',
				method: 'post',
				head: {
					'Content-Type': undefined
				},
				data: fData
			}).then(function(response){
				var errorCode = response.data['error'];
				if(errorCode == 0){
					var data = response.data['data'];
					successFn(data['thumbnailUrl']);
				}else{
					failedFn();
				}
			})
		},
		deleteAffiche: function(id, success, failed){
			var that = this;
			var apiName = 'affiche';
			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'delete',
				urlStr: "{0}/{1}/" + id
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
		}
	}, {})
})()