(function(){
    //report 
    MIS.Report = MIS.derive(null, {
        create: function(report, o){
            this.id = report.id;
            this.name = report.name;
            this.index = report.index;
            this.api = report.api;
            this.searchObj = {};
            this.promise = o.promise;
            this.scope = o.scope;
            this.compile = o.compile;
            this.page = 1;
            this.pageSize = 30;
            this.initSearchObj(report);
        },
        getColumn: function(index){
            var index = index || this.index;
            var columnData = MIS.Config.Report.columnData; //get from config.report.js  
            return columnData[index].column
        },
        getSearchHtml: function(){
            return MIS.Config.Report.searchHtmls[this.index]; //get from config.report.js
        },
        initSearchObj: function(report){
            var searchObj = report.searchObj;
            var obj = {};
            for(var key in searchObj){
                obj[key] = searchObj[key]
            }
            this.searchObj = obj;
        },
        generateUrl: function(){
            var searchParam = [];
            for(var item in this.searchObj){
                var key = item;
                var value = this.searchObj[item];
                searchParam.push(MIS.Util.stringFormat('{0}={1}', [key, value]));
            }
           
            var searchUrl = '{0}/{1}/'+ this.api + '?' + searchParam.join('&');
            return searchUrl
        },
        validateQueryParam: function(){
            for(var item in this.searchObj){
                var key = item;
                var value = this.searchObj[item];
                if(MIS.Util.validationDate(value))
                    continue
                else{
                    value = MIS.Util.reolaceSimbo(value, "[‘, *, /, ;]")
                }
            }
        },
        search: function(page, pageSize){
            var that = this;
            var server = 'metrics';
            //check query search
            var urlStr = this.generateUrl();
            var page = page || this.page;
            var pageSize = pageSize || this.pageSize;
            urlStr += MIS.Util.stringFormat('&page={0}&pageSize={1}', [page, pageSize])
            
            this.promise({
                serverName: server,
                apiName: 'report',
                urlStr: urlStr,
                method: 'GET',
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
                // var pageData = that.randerObjList(response.data['data']);
                var pageData = response.data['data'];
                that.setPage(page, total, pageSize, pageData);
            })
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
        createReportPannel: function(){
            MIS.showPageCover();
            var sHtml = 
            // '<div class="popPannel" ng-show="showPannel">' + 
                '<div class="titleDiv">' +
                    '<div class="misPopupHeader"></div>'+
                    '<div class="closeDiv"> <button class="closeDivBtn" ng-click="closePannel()"></button> </div>'+
                '</div>'+
                '<div class="myGrid" ui-grid="gridOptions" ui-grid-selection style="width: auto;height:600px;overflow-x:auto;overflow-y: hidden"></div>'+
                '<page conf="myConf" click-fn="changePage"></page>';
            // '</div>';

            var node = document.createElement('div')
            node.innerHTML = sHtml;
            node.className = "popPannel";
            node.style.minWidth = "800px";
            // node.setAttribute('ng-show', "showPannel");
            var nodes = this.compile(node)(this.scope);
            this.reportNode = nodes[0];
            document.body.appendChild(this.reportNode)
        },
        closeReportPannel: function(){
            MIS.hidePageCover();
            document.body.removeChild(this.reportNode);
        },
        downloadExcel: function(){
            var url = MIS.Util.getApiUrl('metrics', 'excel', this.generateUrl());
            var elemIF = document.createElement('iframe');
            elemIF.src = url + '&access_token=' +  MIS.currentUser.getToken();
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
    }, {})
})()