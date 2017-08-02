var home = new MIS._Angular('main', ['treeview','dropDownList', 'searchDownList', 'dropdownCheckList','datetimeView','page','foldingNavBar', 'fileUpload','ngRoute','ngTouch','ui.grid','proddetails']);
home.createController('mainController', ['$rootScope','$scope','$compile', '$window', '$timeout', '$location', 'publicService', 
	function ($rootScope, $scope, $compile, $window, $timeout, $location, publicService) {
	// body...
    // init navHistory object
    var wrap = document.getElementById('navWrap');
    var bar = document.getElementById('navBar');
    MIS.navHistoryObj = new MIS.navHistory($rootScope, $location, $window, $compile, wrap, bar);

    $scope.welcomeMsg = '欢迎 ' + MIS.currentUser.userName;
    
    //page cover
    $scope.pageCover = false;
    MIS.showPageCover = function(){
        $scope.pageCover = true;
    }
    MIS.hidePageCover = function(){
        $scope.pageCover = false;
    }

    $scope.logout = function(){
        // logout
        MIS.currentUser.logout(function(){
            $window.location.href = '/login';
        }, function(){
            $window.location.href = '/login';
        })
    };
    $scope.resetPassword = function(){
        //reset password
        $scope.resetPasswordModel = {
            oldPassword: '',
            password: '',
            confirmPassword: ''
        }
        var popWindow = new MIS.Popup({
            w: 374,
            coverCls: 'misPopupCover',
            cls: 'misPopup popOne',
            title: {
                txt: '修改密码'
            },
            contentList: [
                [
                    {
                        tag: 'label',
                        attr: {
                            innerHTML: '原始密码'
                        }
                    },
                    {
                        tag: 'input',
                        ngModel: 'resetPasswordModel.oldPassword',
                        ngBlur: 'blurCheckPassword(resetPasswordModel.oldPassword, $event)',
                        ngClass: "{'true':'error'}[invalidateOldPassword]",
                        attr:{
                            type: 'password'
                        }
                    }
                ],
                [
                    {
                        tag: 'label',
                        attr: {
                            innerHTML: '新的密码'
                        }
                    },
                    {
                        tag: 'input',
                        ngModel: 'resetPasswordModel.password',
                        ngBlur: 'blurCheckPassword(resetPasswordModel.password, $event)',
                        ngClass: "{'true':'error'}[invalidatePassword]",
                        attr:{
                            type: 'password'
                        }
                    }
                ],
                [
                    {
                        tag: 'label',
                        attr: {
                            innerHTML: '确认密码'
                        }
                    },
                    {
                        tag: 'input',
                        ngBlur: 'blurCheckPassword(resetPasswordModel.confirmPassword, $event)',
                        ngModel: 'resetPasswordModel.confirmPassword',
                        ngClass: "{'true':'error'}[invalidateConfirmPassword]",
                        attr:{
                            type: 'password'
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
                            var checked = true;
                            // validate field
                            if(!MIS.Util.validationPassword($scope.resetPasswordModel.oldPassword)){
                                $scope.invalidateOldPassword = true;
                                checked = false;
                            }else{
                                 $scope.invalidateOldPassword = false;
                            }
                            if(!MIS.Util.validationPassword($scope.resetPasswordModel.password)){
                                $scope.invalidatePassword = true;
                                checked = false; 
                            }else{
                                $scope.invalidatePassword = false;
                            }
                            if(!MIS.Util.validationPassword($scope.resetPasswordModel.confirmPassword)){
                                $scope.invalidateConfirmPassword = true;
                                checked = false;
                            }else{
                                $scope.invalidateConfirmPassword = false;
                            }
                            $scope.$apply();

                            if(checked){
                                var loading = new MIS.Popup({
                                    loadingTxt: 'Loading',
                                });
                                MIS.currentUser.resetPassword(
                                    $scope.resetPasswordModel.oldPassword, 
                                    $scope.resetPasswordModel.password, 
                                    $scope.resetPasswordModel.confirmPassword, 
                                    function(){
                                        MIS.successPop("修改成功", function(){
                                            $window.location.href = '/login';
                                        })
                                    }, 
                                    MIS.failedFn);
                            }  
                        }
                    },
                    {
                        tag: 'button',
                        attr: {
                            innerHTML: '取消'
                        },
                        clickEvt: function(){
                            popWindow.close();
                            $scope.$apply();
                        }
                    }
                ]
            ]
        }, $scope, $compile);
    };
    $scope.blurCheckPassword = function(input, event){
        var tag = event.srcElement || event.currentTarget;
        if(!MIS.Util.validationPassword(input)){
            MIS.Util.addClass(tag, 'error');
        }else{
            MIS.Util.removeClass(tag, 'error');
        }
    }


    $scope.goHome = function(){
        $scope.go('/')
    }

    var treeList = MIS.access.getTreeList();

    $scope.misFnTree = treeList.fnTree;
    $scope.misSysTree = treeList.sysTree;
    
    $scope.misTree = $scope.misFnTree;
    $scope.fnMgt = function(){
        $scope.go('/');
        $scope.misTree = $scope.misFnTree;
    }
    $scope.sysMgt = function(){
        $scope.go('/');
        $scope.misTree = $scope.misSysTree;
    }
    $scope.showSysTree = MIS.access.showSysTree();

	$scope.treeClick = function(selectedNode){
		if(selectedNode.children.length <= 0 || selectedNode.hasView){
			var currentUrl = '/'+ selectedNode.roleId;
			MIS.navHistoryObj.goNavigate(currentUrl);
		}
	}
    $scope.changeTab = function(tab){
        MIS.navHistoryObj.changeTab(tab);
    }
    $scope.closeTab = function(tab){
        MIS.navHistoryObj.deleteTab(tab);
    }
    $rootScope.showScroll = false;
    $scope.moveScroll = function(left){
        left? MIS.navHistoryObj.scrollLeft(): MIS.navHistoryObj.scrollRight();
    }

	
}]);


