//公告
var afficheMgt = new MIS._Angular('afficheMgt', []);
afficheMgt.createRoute('公告管理', '/role91', 'pages/afficheMgt.html', 'afficheMgtController');
var afficheMgtController = afficheMgt.createController('afficheMgtController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		//create affiche manager
		var afficheManager = new MIS.AfficheManger($scope, publicService.promise);
		//init paging
		$scope.myConf = {
			totalItems: 0,
			itemsPerPage: 10,
			currentPage: 1
		};
		$scope.gridOptions = afficheManager.gridOptions;
		$scope.goCreate= function(){
			$scope.go('/role91/create');
		};
		$scope.goEdit=function(){
			if(MIS.currentSelectedAffiche != null)
				$scope.go('/role91/edit');
		}
		//listen data change
		$scope.$on('dataChange', function(event, data){
			$scope.gridOptions.data = data.currentPageList;
			$scope.myConf.totalItems = data.total * data.pageSize;
			$scope.myConf.currentPage = data.currentPage;
		});
		afficheManager.getPage($scope.myConf.currentPage,$scope.myConf.itemsPerPage);

		// paging change function
		$scope.changePage = function(page){
			afficheManager.getPage(page, $scope.myConf.itemsPerPage);
		}
		//default search value
		$scope.searchTitle = "";
		$scope.searchType = {
			value: '-1',
			searchList: MIS.dictData.bulletinType
		}
		$scope.searchClick = function(){
			var search = {};
			if($scope.searchType.value != '-1')
				search.type = $scope.searchType.value;
			search.title = $scope.searchTitle;
			afficheManager.setSearch(search);

			afficheManager.getPage(1, $scope.myConf.itemsPerPage)
		}
		$scope.selectRow = function(row){
			if(row.isSelected){
				MIS.currentSelectedAffiche = row.entity;
			}else{
				MIS.currentSelectedAffiche = null;
				console.log('clear select');
			}
		}
		$scope.gridOptions.onRegisterApi = function(gridApi){
		//set gridApi on scope
			$scope.gridApi = gridApi;
			// gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
			gridApi.selection.on.rowSelectionChanged($scope, $scope.selectRow);
			// gridApi.selection.on.rowSelectionChangedBatch($scope, $scope.selectRowBatch);
			// gridApi.core.on.filterChanged($scope, $scope.filterChanged);
		};
		var doDelete = function(){
			afficheManager.deleteAffiche(MIS.currentSelectedAffiche.afficheObj.bulletinId, function(){
				afficheManager.refresh();
			}, function(){
				//delete failed
			});
		};
		$scope.deleteAffiche = function(){
			if(MIS.currentSelectedAffiche){
				var popWindow = new MIS.Popup({
					w: 400,
					h: 175,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: MIS.Util.stringFormat('确定要删除[{0}, {1}, {2}]',
									[
										MIS.currentSelectedAffiche.afficheObj.bulletinTypeDisplay,
										MIS.currentSelectedAffiche.afficheObj.bulletinId,
										MIS.currentSelectedAffiche.afficheObj.title.value
									])
								}
							}
						],
						[
							{
								tag: 'button',
								attr: {
									innerHTML: '确认'
								},
								clickEvt: function(){
									doDelete();
									popWindow.close();
								}
							},
							{
								tag: 'button',
								attr: {
									innerHTML: '取消'
								},
								clickEvt: function(){
									popWindow.close();
								}
							}
						]
					]
				});
			}
		}
	}
]);
afficheMgtController.filter('bulletinTypeFilter', function(){
	var list = MIS.dictData.bulletinType;
	return function (input) {
		var result = '';
		list.forEach(function(item){
			if(item.value == input){
				result = item.name
			}
		});
		return result;
	}
});
afficheMgtController.filter('bulletinTopFilter', function(){
	return function (input) {
		var result = '';
		if(input == 0)
			result = '不置顶';
		else if(input == 1){
			result = '置顶'
		}
		return result;
	}
});
afficheMgtController.filter('bulletinPublishFilter', function(){
	return function (input) {
		var result = '';
		if(input == 0)
			result = '不发布';
		else if(input == 1){
			result = '发布'
		}
		return result;
	}
});
afficheMgt.createRoute('添加公告', '/role91/create', 'pages/afficheCreate.html', 'afficheCreateController', null, true);
var afficheCreateController = afficheMgt.createController('afficheCreateController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		UE.delEditor('editor');
		var ue = UE.getEditor('editor');

		$scope.submitAffiche = function(){
			var content = UE.getEditor('editor').getContent();
		}
		var affiche = new MIS.Affiche();
		$scope.afficheModel = affiche.afficheObj;

		var afficheManager = new MIS.AfficheManger($scope, publicService.promise);

		$scope.getFile = function(file){
                afficheManager.uploadFile(file, function(thumbnailUrl){
                    // upload success
                    $scope.afficheModel.thumbnailUrl = thumbnailUrl;
                }, function(){
                    // upload file error
                })
            };

		$scope.submit=function(){
			if(!affiche.validate())
				return;
			var content = UE.getEditor('editor').getContent();
			$scope.afficheModel.content.value = content;
			var requestData = affiche.randerRequestObj();
			afficheManager.createAffiche(requestData, function(){
				$scope.go('/role91');
			}, function(){

			})
		}

		$scope.cancel=function(){
			MIS.currentSelectedAffiche = null;
			$scope.go('/role91');
		}

		$scope.checkKeyWord = function(){
			affiche.validate($scope.afficheModel.keyWord);
		}
	}
]);

afficheMgt.createRoute('修改公告', '/role91/edit', 'pages/afficheCreate.html', 'afficheEditorController', null, true);
var afficheEditorController = afficheMgt.createController('afficheEditorController', ['$scope', '$compile', 'publicService',
	function($scope, $compile, publicService){
		UE.delEditor('editor');
		
		var affiche = MIS.currentSelectedAffiche;
		$scope.afficheModel = affiche.afficheObj;
		var content = $scope.afficheModel.content.value;

		var ue = UE.getEditor('editor', {onready: function(){
			this.setContent(content);
		}});

		var afficheManager = new MIS.AfficheManger($scope, publicService.promise);

		$scope.getFile = function(file){
                afficheManager.uploadFile(file, function(thumbnailUrl){
                    // upload success
                    $scope.afficheModel.thumbnailUrl = thumbnailUrl;
                }, function(){
                    // upload file error
                })
            };

		$scope.submit=function(){
			if(!affiche.validate())
				return;
			var content = UE.getEditor('editor').getContent();
			$scope.afficheModel.content.value = content;
			var requestData = affiche.randerRequestObj();
			afficheManager.updateAffiche(requestData, function(){
				MIS.currentSelectedAffiche = null;
				$scope.go('/role91');
			}, function(){

			})
		}

		$scope.cancel=function(){
			MIS.currentSelectedAffiche = null;
			$scope.go('/role91');
		}

		$scope.checkKeyWord = function(){
			affiche.validate($scope.afficheModel.keyWord);
		}
	}
]);