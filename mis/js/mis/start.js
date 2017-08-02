var appStart = function (argument) {
	// body...
	var misApp = new MIS.app('misApp',[]).app;
	misApp.run(['$rootScope', '$location', '$window', 'publicService', function($rootScope, $location, $window, publicService){
		$rootScope.showLogin = true;
		//init the MIS User
		var currentUser = MIS.currentUser = new MIS.User(publicService.promise);
		//if not login
		if(!currentUser.hasLogin || !currentUser.roleList){
			$window.location.href = '/login.html';
		}
		// get Access role list
		var roleList = currentUser.roleList.split('|');
		MIS.access = new MIS.Access(roleList);

		// //init navHistory object
		// MIS.navHistoryObj = new MIS.navHistory($rootScope, $location, $window);
		$rootScope.go = function(path){
			MIS.navHistoryObj.goNavigate(path);
		}

		//define failedFn
		MIS.failedFn = function(errorMessage){
            var pWidth = errorMessage.length * 12 + 20;
            pWidth = pWidth > 150? pWidth : 150;
			var errorWindow = new MIS.Popup({
				w: pWidth,
	            h: 115,
	            contentList:[
	                [
	                    {
	                        tag: 'label',
	                        attr: {
	                            innerHTML: errorMessage
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
	                            errorWindow.close();
	                        }
	                    }
	                ]
	            ],
			});
		}

		MIS.successPop = function(popMessage, clickFun){
			var pWidth = popMessage.length * 12 + 20;
            pWidth = pWidth > 150? pWidth : 150;
            var clickFun = clickFun || function(){};
			var successWindow = new MIS.Popup({
				w: pWidth,
	            h: 115,
	            contentList:[
	                [
	                    {
	                        tag: 'label',
	                        attr: {
	                            innerHTML: popMessage
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
	                        	clickFun();
	                            successWindow.close();
	                        }
	                    }
	                ]
	            ],
			});
		}

		MIS.accessPop = function(popMessage){
			var pWidth = popMessage.length * 12 + 20;
            pWidth = pWidth > 150? pWidth : 150;
            var clickFun = clickFun || function(){};
			var successWindow = new MIS.Popup({
				w: pWidth,
	            h: 115,
	            contentList:[
	                [
	                    {
	                        tag: 'label',
	                        attr: {
	                            innerHTML: popMessage
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
	                            successWindow.close();
	                        }
	                    }
	                ]
	            ],
			});
		}

		MIS.selectPop = function(){
			var popWindow = new MIS.Popup({
					w: 200,
					h: 115,
					contentList:[
						[
							{
								tag: 'label',
								attr: {
									innerHTML: '请至少选择一条记录'
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
									popWindow.close();
								}
							}
						]
					]
				});
		}

		MIS.getDictName = function(misDict, input){
			var result = '';
			misDict.forEach(function(item){
				if(item.value == input){
					result = item.name
				}
			});
			return result;
		}

		MIS.TempData = {}; // saving temp data;
	}])
	angular.bootstrap(document, ['misApp']);
}
