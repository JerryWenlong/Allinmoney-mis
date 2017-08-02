var orderMgt = new MIS._Angular('orderMgt', []);
orderMgt.createRoute('订单管理', '/role41', 'pages/orderMgt.html', 'orderMgtController');
var orderMgtController = orderMgt.createController('orderMgtController', ['$scope', '$compile','publicService',
	function ($scope, $compile,publicService) {
		$scope.gridOptions = {}
		$scope.myConf = {}
		$scope.query = function(){
			alert('查询')
		}
		$scope.dtObj1 = {
			datetimeId: 'a',
			dataModel:'aa',
			datetimeValue:'aaa',
			dataCallback:'aaaa'
		}
		$scope.dtObj2 = {
			datetimeId: 'b',
			dataModel:'bb',
			datetimeValue:'bbb',
			dataCallback:'bbbb'
		}
		$scope.dtObj3 = {
			datetimeId: 'c',
			dataModel:'cc',
			datetimeValue:'ccc',
			dataCallback:'cccc'
		}
		$scope.dtObj4 = {
			datetimeId: 'd',
			dataModel:'dd',
			datetimeValue:'ddd',
			dataCallback:'dddd'
		}
		$scope.test = 'aaaaa';
		$scope.advanceQuery =function(){
			var popWindow = new MIS.Popup({
				w: 498,
				h: 448,
				coverCls: 'fundAuditCover',
				cls: 'orderMgtPop',
				title: {
					notShow: true
				},
				contentList:[
					[
						{
							tag: 'label',
							attr: {
								innerHTML: '产品名称',
								class: 'orderMgtPopLabel1',
							}
						},
						{
							tag: 'input',
							ngModel: 'test',
							attr: {
								type: 'text',
								class: 'orderMgtPopInput1',
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '订单状态',
							}
						},
						{
							tag: 'select',
							options: [
								{
									label: '正常',
									value: '0'
								},
								{
									label: '异常',
									value: '1'
								}
							]
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '发行机构',
							}
						},
						{
							tag: 'input',
							attr: {
								class: 'orderMgtPopInput1',
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '订单总额',
							}
						},
						{
							tag: 'input',
							attr: {
								type: 'text',
								class: 'orderMgtPopInput2',
							}
						},
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel2',
								innerHTML: '~',
							}
						},
						{
							tag: 'input',
							attr: {
								class: 'orderMgtPopInput2',
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '购买日期',
							}
						},
						{
							tag: 'input',
							datetime: {
								data: 'dtObj1',
							},
							attr: {
								class: 'orderMgtPopInput2 orderMgtPopInput3',
								type: 'text'
							}
						},
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel2',
								innerHTML: '~',
							}
						},
						{
							tag: 'input',
							datetime: 'dtObj2',
							attr: {
								class: 'orderMgtPopInput2 orderMgtPopInput3',
								type: 'text'
							}
						}
					],
					[
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel1',
								innerHTML: '最后更新日期',
							}
						},
						{
							tag: 'input',
							datetime: 'dtObj3',
							attr: {
								class: 'orderMgtPopInput2 orderMgtPopInput3',
								type: 'text'
							}
						},
						{
							tag: 'label',
							attr: {
								class: 'orderMgtPopLabel2',
								innerHTML: '~',
							}
						},
						{
							tag: 'input',
							datetime: 'dtObj4',
							attr: {
								class: 'orderMgtPopInput2 orderMgtPopInput3',
								type: 'text',
							}
						}
					],
					[
						{
							tag: 'button',
							attr: {
								innerHTML: '查询',
								class: 'popupBtn1 orderMgtBtn'
							},
							clickEvt: function(){
								console.log($scope.test)
								popWindow.close();
							}
						},
						{
							tag: 'button',
							attr: {
								class: 'popupBtn1 orderMgtBtn',
								innerHTML: '重置',
								style: 'margin-left:55px'
							},
							clickEvt: function(){
								popWindow.close();
							}
						}
					],
				]
			},$scope,$compile)
		}
}])