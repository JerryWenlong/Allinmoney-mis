(function(){

	var viewList = MIS._viewList || [];
	function createTab(path){
		var tab = {};
		viewList.forEach(function(item){
			if(!item.notTab && item.viewPath ==  path){
				tab.currentUrl = path;
				tab.name = item.viewName;
				return
			}
		});
		return tab;
	}

	MIS.navHistory = MIS.derive(null, {
		history:null,
		create:function($rootScope, $location, $window, compile, wrap, bar){
			this.$rootScope = $rootScope;
			this.$window = $window;
			this.$location = $location;
			this.tabList=[];
			this.currentTab = null;
			this.navigateHistory=[];
			this.compile = compile;
			this.wrap = wrap;
			this.bar = bar;
			this.scrollPix = 20;

			var that = this;
			// add route change handling
			$rootScope.$on($rootScope.$on("$routeChangeStart", function(evt, current, previous){
				//
				if(current.$$route){
					// debugger;
					var path = current.$$route.originalPath;
					var params = current.pathParams;
					// find path in viewList
					var tab = createTab(path);
					if(tab && tab.hasOwnProperty('name')){
						that.addTab(tab);
					}
				}
			}));

			// $rootScope.$on($rootScope.$on("$routeChangeSuccess", function(){
			// 	if($rootScope.scrollBar){
			// 		$rootScope.scrollBar();
			// 	}
			// }));
		},
		goNavigate: function(path){
			if (path === 'back') { // Allow a 'back' keyword to go to previous page
	            this.$window.history.back();
	        }else { // Go to the specified path
	        	this.$location.path(path);
	        }
		},
		prevNavigate:function(){
			this.$window.history.back();
		},
		nextNavigate:function(){
			this.$window.history.forward();
		},
		getTabIndex:function(list, tab){
			var navIdx = -1;
			list.forEach(function(element,index,array){
				if(element === tab){
					navIdx = index;
				}
			})
			return navIdx;
		},
		getHistoryIndex:function(list, tab){
			var navIdx = -1;
			var historyObj = {};
			list.forEach(function(element,index,array){
				if(element.tab.currentUrl == tab.currentUrl){
					navIdx = index;
					historyObj = element;
				}
			})
			return [navIdx, historyObj];
		},
		_createTab: function(tab){
			var that = this;
			var new_tab = document.createElement('li');
			var name = document.createElement('a');
			var name_value = document.createElement('span');
			name_value.innerHTML =tab.name;
			name.appendChild(name_value);
			var close_btn = document.createElement('a');
			close_btn.className = 'close-btn';
			new_tab.appendChild(name);
			new_tab.appendChild(close_btn);
			this.bar.appendChild(new_tab);
			var tab_width = new_tab.offsetWidth;

			var tabObj = new_tab;
			MIS.Util.bind(new_tab, 'click', function(){
				that.changeTab(tab);
			});
			MIS.Util.bind(close_btn, 'click', function(e){
				var e=window.event||e;

				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}

				that.deleteTab(tabObj, tab);
			})
			return tabObj
		},
		setCurrentSelect: function(historyObj){
			if(this.currentTab){
				// clear last current tab select
				MIS.Util.removeClass(this.currentTab.tabObj, 'active');
			}
			this.currentTab = historyObj;
			MIS.Util.addClass(this.currentTab.tabObj, 'active');
		},
		clearCurrentSelect: function(){
			this.currentTab = null;
		},
		calculatorScroll: function(index){
			var barWidth = this.bar.offsetWidth;
	        var t = this.wrap.clientWidth - barWidth;
			if(index == -1){ // -1 means add new tab at last
				
		        if(t < 0){
		            this.$rootScope.showScroll = true;
		            this.bar.style.left = t+'px';
		        }else{
		            this.$rootScope.showScroll = false;
		            this.bar.style.left = 0+'px';
		        }
			}else{// calculate the tab position
				var tabPosition = 0;
				var len = index - 1; // calculate all tab width before the current tab
				if(t < 0){
					for(var i=0; i<len; i++){
						var tabObj = this.tabList[i];
						tabPosition += tabObj.offsetWidth;
					}
					if (tabPosition > -t){
						this.bar.style.left = t + 'px';
					}else{
						// left = tabPosition
						this.bar.style.left = -tabPosition + 'px';
					}
				}else{
					// no need move position
					this.bar.style.left = tabPosition + 'px';
				}
			}

		},
		scrollLeft: function(){
			var offsetLeft = this.bar.offsetLeft;
			var currentLeft = 0;
			if((offsetLeft + this.scrollPix) <= 0){
				currentLeft = offsetLeft + this.scrollPix;
			}else{
				currentLeft = 0;
			}
			this.bar.style.left = currentLeft + 'px';
		},
		scrollRight: function(){
			var offsetLeft = this.bar.offsetLeft;
			var barWidth = this.bar.offsetWidth;
			var offsetWidth = this.wrap.clientWidth - barWidth;
			var currentLeft = 0;
			if((offsetLeft - this.scrollPix) <= offsetWidth){
				currentLeft = offsetWidth;
			}else{
				currentLeft = offsetLeft - this.scrollPix;
			}
			this.bar.style.left = currentLeft + 'px';
		},
		addTab:function(tab){
			var tabExist = false;
			var result = this.getHistoryIndex(this.navigateHistory, tab);
			var navIdx = result[0];
			var historyObj = result[1];
			if(navIdx == -1){
				// this.$rootScope.tabList.push(tab);
				var tabObj = this._createTab(tab);
				var historyObj = {tab: tab, tabObj: tabObj};
				this.navigateHistory.push(historyObj);
				this.tabList.push(tabObj);
			}else{
				this.navigateHistory.splice(navIdx, 1);
				this.navigateHistory.push(historyObj);
			}
			// this.$rootScope.currentTab = tab;
			this.setCurrentSelect(historyObj);
			this.calculatorScroll(navIdx);
		},
		showLastTab:function(){
			var url='/';
			var len = this.tabList.length;
			if(len > 0){
				this.$rootScope.currentTab = this.navigateHistory[len - 1];
				url = this.$rootScope.currentTab.tab.currentUrl;
			}else{
				// this.$rootScope.currentTab = null;
				this.clearCurrentSelect();
			}
			this.goNavigate(url);
		},
		deleteTab:function(tabObj, tab){
			//remove the idx tab in navigateHistory
			var idx = this.getTabIndex(this.tabList, tabObj);
			if(idx >= 0){
				this.tabList.splice(idx, 1);
				this.bar.removeChild(tabObj);
			}
			var historyResult = this.getHistoryIndex(this.navigateHistory, tab);
			var navIdx = historyResult[0];
			var historyObj = historyResult[1];
			if(navIdx >=0){
				this.navigateHistory.splice(navIdx, 1);
			}
			//show the last tab in navigateHistory
			this.showLastTab();
			this.$rootScope.$apply();
		},
		changeTab:function(tab){
			//delete the tab in navigateHistory
			var historyResult = this.getHistoryIndex(this.navigateHistory, tab);
			var idx = historyResult[0];
			var historyObj = historyResult[1];
			//add the tab again to last one
			this.navigateHistory.splice(idx, 1);
			this.navigateHistory.push(historyObj);

			this.goNavigate(historyObj.tab.currentUrl);
			this.$rootScope.$apply();
		},
	},{})
})()