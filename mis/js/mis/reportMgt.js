var reportMgt = new MIS._Angular('reportMgt', []);
reportMgt.createRoute('报表查询', '/role_12_1', 'pages/report.html', 'reportController', null, false);
var reportController = reportMgt.createController('reportController', ['$scope', '$compile', 'publicService', 
    function($scope, $compile, publicService){
        $scope.reports = MIS.Config.Report.reports; //get from config.report.js
        $scope.currentSelect = null;
        var currentReport = null;
        $scope.searchPannel = '';
        $scope.searchObj = null;
        $scope.showPannel = false;
        $scope.selectLists = null;
        var reportList = []
        var searchPannel = document.getElementById('searchPannel')

        $scope.selectReport = function(){
            //clear searchPannel
            MIS.Util.removeChild(searchPannel);
            var childNode = document.createElement('ul');
            var _index = this.currentSelect.index;
            this.selectLists = $scope.reports[_index].list || {};
            var report = currentReport = new MIS.Report($scope.reports[_index], {
                    scope: $scope,
                    promise: publicService.promise,
                    compile: $compile
                });
            this.searchObj = report.searchObj;
            childNode.innerHTML = report.getSearchHtml();
            var searchNodes = $compile(childNode)(this);
            searchPannel.appendChild(searchNodes[0]);
            $scope.gridOptions.columnDefs = report.getColumn();
            initPageConf();
        }

        $scope.search = function(){
            if(currentReport){
                currentReport.validateQueryParam()
                currentReport.search();
                currentReport.createReportPannel()
            }else{
                ///alert select pop
            }
        }
        $scope.closePannel = function(){
            currentReport.closeReportPannel()
        }
        function initPageConf(){
            $scope.myConf.totalItems = 0;
            $scope.myConf.itemsPerPage=30;
            $scope.myConf.currentPage=1;
        }
        $scope.myConf = {
            totalItems:0,
            itemsPerPage: 30,
            currentPage: 1
        }
        $scope.gridOptions = {
            enableRowSelection: false,
            enableSelectAll:false,
            multiSelect:false,
            enableFiltering:false,
            enableSorting: false,
        };

        $scope.$on('dataChange', function(event, data){
            $scope.gridOptions.data = data.currentPageList;
            $scope.myConf.totalItems = data.total * data.pageSize;
            $scope.myConf.currentPage = data.currentPage;
        })
        $scope.changePage=function(page){
            currentReport.search(page)
        }
        $scope.download=function(){
            if(currentReport){
                currentReport.downloadExcel()
            }else{
                //
            }
        }
    }
])