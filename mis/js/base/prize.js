(function(){
	'use strict'
	var _No = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

	MIS.Prize_A = MIS.derive(null, {
		create: function(responseObj){
			this.self = this.init(responseObj);
		},
		init: function(responseObj){
			var obj = {};
			obj.activityId = responseObj.activityId;
			obj.phaseId  = responseObj.phaseId;
			obj.phaseIndex = responseObj.phaseIndex;//期数
			// obj.status = responseObj.status;//1 设置过指数 2 设置过中奖号码 3 2者都设置过了
			obj.progressStr = MIS.Util.stringFormat('{0}/{1}', [responseObj.progress, responseObj.capacity]);
			obj.modifiedAt = responseObj.modifiedAt.replace('T', ' ');//满额时间
			obj.stockIndex = responseObj.stockIndex;//上证指数 
			obj.hasSetLuckgNumber = responseObj.status >= 2? '已设置':'未设置';
			obj.prizeNumber = responseObj.prizeNumber;//中奖号码
			obj.stockIndexDay = responseObj.stockIndex ===''? '':responseObj.stockIndexDay;
			obj.hasSubmit = responseObj.status >= 7? '已开奖':'';

			obj._selected = false;
			obj.setFlag = responseObj.progress >= responseObj.capacity? true:false ;//是否可以设置上证指数、中奖号码。 即,是否满额 
			return obj
		},
		createCloneIndex: function(){
			var obj = {};
			obj.stockIndex = this.self.stockIndex;
			obj.stockIndexDay = this.self.stockIndexDay;
			obj.activityId = this.self.activityId;
			obj.phaseId = this.self.phaseId;
			return obj
		},
		createClonePrizeNumber: function(){
			var obj = {
				prizeList : [],
				last: "",
			};
			obj.activityId = this.self.activityId;
			obj.phaseId = this.self.phaseId;

			var prizeNumberList = [];
			if(this.self.hasSetLuckgNumber){
				//若设置过中奖号码, 则copy给clone对象
				var arr = this.prizeNumber.split(MIS.Config.FLAG_LOTTERY_STOCK_INDEX_PRIZE_NUMBER);
				obj.last = arr.pop();
				prizeNumberList = arr.length < 1? [""]:arr;
			}else{
				//若未设置中奖号码, 则初始化空的一等奖&空的参与奖
				prizeNumberList = [""];
			}
			var l = prizeNumberList.length;
			for(var i=0; i<l; i++){
				var _name = _No[i]+'等奖';
				var _number = prizeNumberList[i];
				obj.prizeList.push({
					name: _name,
					number: _number
				});
			}
			return obj;
		},
		addPrizeNumber: function(obj){
			var len = obj.prizeList.length;
			obj.prizeList.push({
				name: _No[len]+'等奖',
				number: ''
			})
		},
		delPrizeNumber: function(obj){
			obj.prizeList.pop();
		},
		checkStockIndex: function(cloneIndexObj){
			//验证设置上证指数
			var result = {
				flag: true,
				msg: ''
			}
			//check index --string
			var reg = /^\d+\.\d{2}$/;
			if(!reg.test(cloneIndexObj.stockIndex)){
				result.flag = false;
				result.msg = '请输入正确的上证指数';
				return result;
			}
			//check index day --
			if(!MIS.Util.validationDate(cloneIndexObj.stockIndexDay)){
				result.flag = false;
				result.msg = '请选择正确的指数日期';
				return result;
			}
			return result
		},
		checkLuckyNumber: function(cloneNumberObj){
			//验证设置中奖号码
			var result = {
				flag: true,
				msg: ''
			}
			var arr = [];
			for(var i=0; i<cloneNumberObj.prizeList.length;i++){
				arr.push(cloneNumberObj.prizeList[i].number);
			}
			var _list = arr.concat([cloneNumberObj.last]);
			var reg = /^\d+(,\d+)*$/;
			for(var i=0; i<_list.length; i++){
				if(!reg.test(_list[i])){
					result.flag = false;
					result.msg = '请输入正确的中奖号码';
					return result
				}
			}

			var checkUnique = MIS.Util.checkUnique(_list);
			if(!checkUnique){
				result.flag = false;
				result.msg = '中奖号不能重复,请重新设置';
				return result;
			}
			return result
		},
	}, {});
	MIS.Prize_A_mgt = MIS.derive(MIS.GridManager,{
		create: function (scope, promise, compile, activityId, useGrid) {
			// body...
			var apiName = 'prize_A';
			this.compile = compile;
			this.activityId = activityId;
			this.searchStr = '&activityId=' + activityId;
			this.init(scope, promise, apiName, useGrid);
			this.initSearch(scope);
		},
		initSearch: function(scope){
			var that = this;
			scope.searchModel = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				item: {value: 0},
				list: [
					{name: '全部', value: 0},
					{name: '未满', value: 1},
					{name: '已满', value: 2},
				]
			}
			scope.changeProgressSearch = function(){
				var queryProgress = scope.searchModel.value();
				that.searchStr = MIS.Util.stringFormat('&activityId={0}&progress={1}', [that.activityId, queryProgress]);
				that.getPage(0, 10);
			}
		},
		randerObj: function(responseObj){
			var obj = new MIS.Prize_A(responseObj);
			return obj;
		},
		setStockIndex: function(obj){
			var data = {
				activityId: obj.activityId,
				phaseId: obj.phaseId,
				stockIndex: obj.stockIndex.toString(),
				stockIndexDay: obj.stockIndexDay
			}
			this.saveToServer(data);
		},
		setPrizeNumber: function(obj){
			// get Prizenumber str
			var arr = [];
			for(var i=0; i<obj.prizeList.length;i++){
				arr.push(obj.prizeList[i].number);
			}
			arr.push(obj.last)
			var prizeStr = arr.join(';');
			var data = {
				activityId: obj.activityId,
				phaseId: obj.phaseId,
				prizeNumber: prizeStr
			}
			this.saveToServer(data);
		},
		saveToServer: function(data){
			var that = this;
			var apiName = 'prize_A';
			this.promise({
				serverName: 'mgtSettleService',
				apiName:apiName,
				method:'put',
				data: [data],
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				//pop save success
				MIS.successPop("保存成功", function(){
					//refresh
					that.refresh()
				});
			}, function(failed){
				//failed
				console.log('');
			});
		},
		submitEvent: function(prizeObj){
			var that = this;
			var apiName = 'submit_prize_A';
			var phaseId = prizeObj.self.phaseId;
			var queryAction = 'submit';
			var urlStr = '{0}/{1}?action=' + queryAction;

			this.promise({
				serverName: 'mgtSettleService',
				apiName: apiName,
				method: 'put',
				apiParam: [phaseId],
				urlStr: urlStr
			}).then(function(response){
				if(response.data['error'] != 0){
					var errorMsg = MIS.Config.errorMessage(response.data['error']);
					MIS.failedFn(errorMsg);
					return
				}
				//pop save success
				MIS.successPop("保存成功", function(){
					//refresh
					that.refresh()
				});
			})
		},
		showPhaseDetail: function(activityId, phaseIndex){
			var that = this;
			this.loading.popup();
			// 请求数据
			var urlStr = '{0}/{1}?actId=' + activityId + '&phaseId=' + phaseIndex + '&page=1&pageSize=50';
			var apiName = 'prize_A_detail';
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
				that.loading.close();
				that.createPhaseDetailGrid(list, phaseIndex);
			})
			
		},
		createPhaseDetailGrid: function(list,phaseIndex){
			var that = this;
			var domroot = this.domroot = document.getElementsByTagName('body')[0];
			var coverDiv = this.coverDiv = document.createElement('div');
            coverDiv.setAttribute('class', 'misPopupCover grey'); 
            coverDiv.style.height = '100%';//window.innerHeight + 'px';
            coverDiv.style.width = '100%';//window.innerWidth + 'px';
            var dataDiv = this.dataDiv = document.createElement('div');
            MIS.Util.addClass(dataDiv, 'DLC_Grid_Div');
            dataDiv.style.width='838px';
            dataDiv.style.height = 'auto';
            var domUL = document.createElement('ul');
            MIS.Util.addClass(domUL, 'DLC_Grid');
            this.randerGrid(domUL, list, phaseIndex);
            //close btn
            var btnLine = document.createElement('p');
            btnLine.style.textAlign = 'center';
            btnLine.style.marginTop = '10px';
            var closeBtn = document.createElement('button');
            closeBtn.innerHTML = '关闭';
            MIS.Util.addClass(closeBtn, 'btn');
            MIS.Util.bind(closeBtn, 'click', function(){
            	that.domroot.removeChild(that.coverDiv);
            	that.domroot.removeChild(that.dataDiv);
            })
            dataDiv.appendChild(domUL);
            btnLine.appendChild(closeBtn);
            dataDiv.appendChild(btnLine);

            domroot.appendChild(coverDiv);
            domroot.appendChild(dataDiv);

            var divMarginLeft = '-' + dataDiv.offsetWidth / 2;
            var divMarginTop = '-' + dataDiv.offsetHeight / 2;
            dataDiv.style.marginLeft = divMarginLeft + 'px';
            dataDiv.style.marginTop = divMarginTop + 'px';


		},
		randerGrid: function(root, list, phaseIndex){
			var that = this;
			root.style.width = '838px';
			root.style.height = 'auto';
			var title = document.createElement('li');
			MIS.Util.addClass(title, 'DLC_Grid_Title');

			title.innerHTML = '<span style="width:80px">期数</span>' +
				'<span style="width:100px">幸运号</span>' +
				'<span style="width:100px">用户ID</span>' +
				'<span style="width:100px">联系电话</span>' +
				'<span style="width:100px">购买产品</span>' +
				'<span style="width:100px">购买金额</span>' +
				'<span style="width:150px">抽奖时间</span>' +
				'<span style="width:100px">奖品</span>' ;
			root.appendChild(title);
			for(var i=0;i<list.length;i++){
				var obj = list[i];
				var li = document.createElement('li');
				MIS.Util.addClass(li, 'DLC_Grid_Details');
				var str = '<span style="width:80px">{0}</span>' +
				'<span style="width:100px">{1}</span>' +
				'<span style="width:100px">{2}</span>' +
				'<span style="width:100px">{3}</span>' +

				'<span style="width:100px" ng-mouseover="showProdName($event);" ng-mouseleave="hideProdName();">{4}</span>' +

				'<span style="width:100px">{5}</span>' +
				'<span style="width:150px">{6}</span>' +
				'<span style="width:100px">{7}</span>' ;
				var htmlStr = MIS.Util.stringFormat(str, [
					phaseIndex,
					obj.prizeName,
					obj.accountId,
					obj.cellphone,
					obj.prodName,
					obj.entrustAmount,
					obj.createdAt.replace('T', ' '),
					obj.prizeLevel,
					obj.prodName
				]);
				li.innerHTML = htmlStr;
				root.appendChild(li);
			}
			that.compile(root)(that.scope)
		}

	})


	MIS.PrizeRecord = new MIS.derive(null, {
		create: function(responseObj){
			this.recordObj = responseObj;
			this.recordObj.createdAt = responseObj.createdAt.replace('T', ' ');
			this.recordObj.prizeType = MIS.getDictName(MIS.dictData.prizeType, responseObj.prizeType-1);
			this.recordObj.phaseIdStr = '第' + responseObj.phaseId + '期';
		}
	}, {});

	MIS.PrizeRecordMgt = new MIS.derive(null, {
		create: function (scope, promise, activityId) {
			// body...
			this.scope = scope;
			this.promise = promise;
			this.currentPageList = [];
			this.total = 0;
			this.pageSize = 10;//default
			this.currentPage = 1;//default
			this.searchStr = '';
			this.activityId = activityId;
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
			var searchStr = MIS.Util.stringFormat('page={0}&pageSize={1}&actId={2}', [page, pageSize, this.activityId]);
			if(this.searchStr != ''){
				searchStr = MIS.Util.stringFormat('{0}{1}', [searchStr, this.searchStr]);
			}
			var urlStr = '{0}/{1}?' + searchStr;
			this.getObjList(urlStr);
		},
		getObjList:function(urlStr){
			var that = this;
			var apiName = 'prizeRecord';
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
				var obj = new MIS.PrizeRecord(item);
				list.push(obj)
			}
			return list;
		},
		exportExcelOnServer:function(actId, phaseId){
			var urlStr = '{0}/{1}';
			var url = '';
			url = MIS.Util.getApiUrl('mgtSettleService', 'exportPrize_A', urlStr);
			var elemIF = document.createElement('iframe');
			var src = url + '?access_token=' +  MIS.currentUser.getToken() + '&actId=' + actId + '&phaseId=' + phaseId;
			elemIF.src = encodeURI(src);
			elemIF.style.display = "none";
			document.body.appendChild(elemIF);
		},
	}, {});
})()