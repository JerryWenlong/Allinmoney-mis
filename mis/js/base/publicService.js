var serviceModule = new MIS._Angular('serviceModule',[]);

serviceModule.module.factory('webInterceptor', ['$q', '$window',
function($q, $window){
// Dependencies could be：
//   $httpBackend
//   $cacheFactory
//   $rootScope
//   $q
//   $injector
	return{
		 // optional method
	    'request': function(config) {
	      // do something on success
	      return config;
	    },
	    // optional method
	   'requestError': function(rejection) {
	      // do something on error
	      // if (canRecover(rejection)) {
	      //   return responseOrNewPromise
	      // }
	      return $q.reject(rejection);
	    },
	    // optional method
	    'response': function(response) {
	      // do something on success
	      return response;
	    },
	    // optional method
	   'responseError': function(rejection) {
	      // do something on error
	      // if (canRecover(rejection)) {
	      //   return responseOrNewPromise
	      // }
		  var re = /^https:\/\/.*\/user\/signin\/salt/;
		  if(rejection.config && re.test(rejection.config.url)){
				return $q.reject(rejection)
		  }
	      if(rejection.status == 401){
	      	MIS.currentUser.clearUserTemp();
			MIS.currentUser.clearUserLocally();
			var errorWindow = new MIS.Popup({
				w: 200,
	            h: 115,
	            contentList:[
	                [
	                    {
	                        tag: 'label',
	                        attr: {
	                            innerHTML: "登录信息失效, 请重新登录"
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
	                            $window.location.href = '/login.html';
	                        }
	                    }
	                ]
	            ],
			});
	      }else{
	      	var errorWindow = new MIS.Popup({
				w: 150,
	            h: 115,
	            contentList:[
	                [
	                    {
	                        tag: 'label',
	                        attr: {
	                            innerHTML: '系统错误'
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
			})
	      }
	      return $q.reject(rejection);
	    }
	}
}
]);
serviceModule.module.config(['$httpProvider', function($httpProvider){
	//remove get cache 
	if(!$httpProvider.defaults.headers.get){
		$httpProvider.defaults.headers.get = {};
	}
	$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

	$httpProvider.interceptors.push('webInterceptor');
}])
serviceModule.createService('publicService', ['$http', function($http){
	return {
		promise: function(config){
			// serverName, 
			// apiName,
			// method,
			// head,
			// withCredentials
			// data
			// urlStr
			var header = config.head || {};
			if(MIS.currentUser){
				var token = MIS.currentUser.getToken();
				if(token != null){
					header['Authorization'] = 'Bearer ' + token;
				}
			}
			var urlStr = config.urlStr || "{0}/{1}";
			var url = MIS.Util.getApiUrl(config.serverName, config.apiName, urlStr, config.apiParam);
			url = encodeURI(url);
			return $http({
				method:config.method.toString().toUpperCase(),
				url: url,
				headers: header,
				withCredentials: config.withCredentials || false,
				data: config.data,
				cache: false
			});
		},
	}
}]);
