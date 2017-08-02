var appStart = function (argument) {
	// body...
	var misApp = new MIS.app('misApp',['ngRoute']).app;
	misApp.run(['$rootScope', '$location', '$window', function($rootScope, $location, $window){
		//init the MIS User
		// var currentUser = MIS.currentUser = new MIS.User(publicService.promise);
	}])
	angular.bootstrap(document, ['misApp']);
}

var login = new MIS._Angular('login', []);
login.createController('loginController', [
	'$rootScope',
	'$scope',
	'$window',
	'$location',
	'publicService',
	function($rootScope, $scope, $window, $location, publicService){
	var currentUser = new MIS.User(publicService.promise);

	$scope.login={
		userName:'',
		password:'',
		userNameError:false,
		passwordError:false,
		loginError:false,
		errorMessage:'',
		responseErrorMessage:'',
	};
	$scope.login.password = '';
	$scope.checkUserName = function(){
		var userNameCorrect = true;
		//TODO
		var userName = $scope.login.userName;
		var regUserName = /^[\w\d_]{4,30}$/;
		userNameCorrect = regUserName.test(userName);
		$scope.login.userNameError = !userNameCorrect;
		errorMessageControl();
		return userNameCorrect;
	};
	$scope.checkPassword = function(){
		var passwordCorrect = true;
		//TODO
		var password = $scope.login.password;
		var regPassword = /(((?=.*[a-zA-Z])(?=.*[0-9]))|((?=.*?[@!#$%^&*()_+\.\-\?<>'|=])(?=.*[0-9]))|((?=.*?[@!#$%^&*()_+\.\-\?<>'|=])(?=.*[a-zA-Z])))\S{8,16}$/;
		passwordCorrect = regPassword.test(password);
		$scope.login.passwordError = !passwordCorrect;
		errorMessageControl();
		return passwordCorrect;
	};
	var errorMessageControl = function(){
		if($scope.login.userNameError || $scope.login.passwordError){
			$scope.login.errorMessage = '用户名或密码格式无效';
		}else{
			$scope.login.errorMessage = ''
		}
	}



	var loginSuccess = function(response){
		$window.location.href='/';
	};
	var loginFailed = function(errorMsg){
		$scope.login.loginError = true;
		$scope.login.responseErrorMessage = errorMsg;
	}



	$scope.loginToServer = function(){
		if($scope.checkUserName() && $scope.checkPassword()){
			$scope.login.loginError = false;
			currentUser.login($scope.login.userName, $scope.login.password, loginSuccess, loginFailed);
		}
	}
}])
