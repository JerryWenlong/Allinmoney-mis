
(function(){
	'use strict'
	var $=function(id){return document.getElementById(id);}
	// MIS.DateTimeViews = [];
	var closeFn= function(e){
		var e=window.event||e;
		var len = MIS.DateTimeViews.length;
		if(len > 0){
			for(var i=len;i>0;i--){
				var _method = MIS.DateTimeViews[i-1];
				var dateDivMap=_method.offset($(_method.id),e).out,
				objMap=_method.offset(_method.obj,e).out,
				evsMap=!_method.evs?true:_method.offset(_method.evs,e).out;
				// console.log('dateDivMap:' + dateDivMap + ' , objMap:' + objMap + ' , evsMap:' + evsMap);
				if(dateDivMap&&objMap&&evsMap){
					_method.close(e);
					
				}
				
			}
		}
	}
	MIS.DateTime = MIS.derive(null, {
		create: function(obj, id, callback, evs){
			this.callback = callback;
			this.initDateTime(obj, id, evs);
			this.init();
			MIS.DateTimeViews.push(this);
		},
		initDateTime:function(obj,id,evs){
			if(!obj) return false;
			this.obj=obj;
			this.selectDay = null;
			this.evs=evs?evs:null;
			this.id=id;
			this.date=isNaN(+new Date(this.obj.value.replace(/-/g,'/').replace('T', ' ')))?new Date():new Date(this.obj.value.replace(/-/g,'/').replace('T', ' '));
			this.dayNum=42;
			this.year=this.date.getFullYear();
			this.month=this.date.getMonth();
			this.day = this.date.getDay();
			this.today=this.date.getDate();
			this.tempDate = this.date.getFullYear()+'-'+this.formatNum(this.date.getMonth()+1)+'-'+this.formatNum(this.date.getDate());

			//+date.getFullYear()+'-'+this.formatNum(date.getMonth()+1)+'-'+this.formatNum(date.getDate())+
			var timeStrs = this.date.toTimeString().split(' ')[0].split(':');

			this.hours = timeStrs[0];
			this.minutes = timeStrs[1];
			this.seconds = timeStrs[2];
			this.timeCheck = true;

			this.week=['日','一','二','三','四','五','六'];

			this._check=this.id+'_check';
			this._checkB=this.id+'_check_blur';
			this._year=this.id+'_year';
			this._yearPre=this.id+'_yearPre';
			this._yearNex=this.id+'_yearNex';
			this._yearMore=this.id+'_yearMore';
			this._month=this.id+'_month';
			this._monthPre=this.id+'_monthPre';
			this._monthNex=this.id+'_monthNex';
			this._monthMore=this.id+'_monthMore';
			this._newDays=this.id+'_newDays';
			this._today=this.id+'_today';
			this._close=this.id+'_close';
			this._set = this.id+'_set';
			this._hours = this.id+'_hours';
			this._minutes = this.id+'_minutes';
			this._seconds = this.id+'_seconds';
		},
		init:function(){
			if(!this.obj) return false;
			this.createCss();
			this.createCheck();
			this.createDate();
			this.createFn();
		},
		formatNum:function(v){
			return (!isNaN(parseFloat(v))&&parseFloat(v)<10)?'0'+parseFloat(v):v;
		},
		offset:function(obj,event){
			if(!obj || obj == 'undefiend') return false;
			var top=0,left=0,width=obj.offsetWidth||0,height=obj.offsetHeight||0,ev=window.event||event,outs;
			while(obj!= null){
				top+=obj.offsetTop||0;
				left+=obj.offsetLeft||0;
				obj=obj.offsetParent;
			}
			var scrollTop = document.body.scrollTop;
			var scrollLeft = document.body.scrollLeft;

			// if window has scroll we need cut the scroll value.

			if(ev) outs=ev.clientX<(left - scrollLeft)||
				ev.clientX>(left - scrollLeft + width)||
			ev.clientY<(top - scrollTop)||
			ev.clientY>(top - scrollTop + height);
			return {top:top,left:left,width:width,height:height,out:outs};
		},
		createCheck:function(){
			if(!$(this._check)){
				var inp=document.createElement('input');
				inp.type='hidden';
				inp.id=this._check;
				document.body.appendChild(inp);
			}
		},
		createDate:function(){
			if(!$(this.id)){
				var dateDiv=document.createElement('div');
				dateDiv.id=this.id;
				dateDiv.style.display='none';
				dateDiv.innerHTML=this.createHead();
				dateDiv.innerHTML+=this.createWeek();
				dateDiv.innerHTML+='<ul id="'+this._newDays+'">'+this.createDays()+'</ul>';
				dateDiv.innerHTML+=this.createFoot();
				document.body.appendChild(dateDiv);
				dateDiv.style.cssText='';
				dateDiv.setAttribute('style', 'width:210px; background:#fff; border:1px solid #0CF; font-size:12px; line-height:20px; position:absolute; text-align:center; top:'+(this.offset(this.obj).top+this.offset(this.obj).height)+'px; left:'+this.offset(this.obj).left+'px; z-index:9999;');
			}
		},
		createHead:function(){
			var text='<ul>';
			text+='<li class="change"><a href="javascript:;" id="'+this._yearPre+'">&lt;&lt;</a></li>';
			text+='<li class="change"><a href="javascript:;" id="'+this._monthPre+'">&lt;</a></li>';
			text+='<li class="sel_time"><a href="javascript:;" id="'+this._year+'">'+this.date.getFullYear()+'</a>'+this.createMore('year')+'</li>';
			text+='<li class="sel_time"><a href="javascript:;" id="'+this._month+'">'+this.formatNum((this.date.getMonth()+1))+'</a>'+this.createMore('month')+'</li>';
			text+='<li class="change"><a href="javascript:;" id="'+this._monthNex+'">&gt;</a></li>';
			text+='<li class="change"><a href="javascript:;" id="'+this._yearNex+'">&gt;&gt;</a></li>';
			text+='</ul>';
			return text;
		},
		createMore:function(YM){
			var text='';
			if(YM=='year'){
				text+='<ul id="'+this._yearMore+'" class="sel_more">';
				for(var i=1950;i<=this.year+20;i++){
					text+='<li><a href="javascript:;">'+i+'</a></li>';
				}
			}else{
				text+='<ul id="'+this._monthMore+'" class="sel_more">';
				for(var i=1;i<13;i++){
					text+='<li><a href="javascript:;">'+this.formatNum(i)+'</a></li>';
				}
			}
			text+='</ul>';
			return text;
		},
		createWeek:function(){
			var text='<ul class="week">',style='';
			for(var i = 0; i<this.week.length; i++){
				style=(i==0||i==6)?' class="bg"':'';
				text+='<li'+style+'>'+this.week[i]+'</li>';
			}
			text+='</ul>'
			return text;
		},
		createDays:function(){
			this.date.setDate(1);
			var text='',dayOn='',YMOn=(this.date.getFullYear()==this.year&&this.date.getMonth()==this.month)?' class="on"':'',num=0;
			for(var i=0,l=this.date.getDay();i<l;i++){
				text+='<li></li>';
				num++;
			}
			for(var d=1,ds=this.checkDays();d<=ds;d++){
				dayOn=(d==this.today)?YMOn:'';
				text+='<li'+dayOn+'><a href="javascript:;">'+d+'</a></li>';
				num++;
			}
			for(var c=0,cn=this.dayNum-num;c<cn;c++){text+='<li></li>'}
			return text;
		},
		checkDays:function(){
			var days=(this.date.getMonth()==3||this.date.getMonth()==5||this.date.getMonth()==8||this.date.getMonth()==10)?30:(this.date.getMonth()==1)?(this.date.getFullYear()%4!=0)?28:29:31;
			return days;
		},
		createFoot:function(){
			var text='<ul class="bg">',
			date=new Date();
			text+='<li class="time"><span>时间</span><input id="'+this.id+'_hours" class="hours" value="'+this.hours+'" /><b></b><input id="'+this.id+'_minutes" class="minutes" value="'+this.minutes+'" /><b></b><input id="'+this.id+'_seconds" class="seconds" value="'+this.seconds+'" /><button id="'+this.id+'_set">确定</button></li>'
			text+='<li class="today"><a href="javascript:;" id="'+this.id+'_today">今天 '+date.getFullYear()+'-'+this.formatNum(date.getMonth()+1)+'-'+this.formatNum(date.getDate())+'</a></li>';
			text+='<li><a href="javascript:;" id="'+this._close+'">&times;</a></li>';
			text+='</ul>';
			return text;
		},
		createCss:function(){
			if(!$(this.id+'_check')){
				var css,style='';
				// style+='#'+this.id+'{width:210px; background:#fff; border:1px solid #0CF; font-size:12px; line-height:20px; position:fixed; text-align:center; top:'+(this.offset(this.obj).top+this.offset(this.obj).height)+'px; left:'+this.offset(this.obj).left+'px; z-index:9999;}';
				style+='#'+this.id+' a{width:100%; height:20px; color:#000; display:block; outline:none; text-decoration:none;}';
				style+='#'+this.id+' a:hover{background:#d9fafc;}';
				style+='#'+this.id+' ul{clear:both; margin:0; padding:0;}';
				style+='#'+this.id+' li{width:30px; height:20px; list-style:none; float:left;}';
				style+='#'+this.id+' li.on{background:#ebfeff;}';
				style+='#'+this.id+' li .select{background:#7EDDDD;}';
				style+='#'+this.id+' .bg li{background:#fbfbfb;}';
				style+='#'+this.id+' .change{width:20px;}';
				style+='#'+this.id+' .sel_time{width:65px; position:relative;}';
				style+='#'+this.id+' .sel_more{width:63px; height:120px; background:#fff; border:1px solid #0FF; display:none; position:absolute; top:0px; left:0px; overflow:auto; overflow-x:hidden;}';
				style+='#'+this.id+' .sel_more li{width:100%; background:#FFF;}';
				style+='#'+this.id+' .sel_more a.on{background:#ebfeff;}';
				style+='* html #'+this.id+' .sel_more li{width:80%;}';
				style+='#'+this.id+' .week li{background:#d9fafc; font-weight:bold;}';
				style+='#'+this.id+' .week li.bg{background:#fdfdde;}';
				style+='#'+this.id+' .today{width:180px;}';
				style+='#'+this.id+' .time{float:none;width:100%}';
				style+='#'+this.id+' .time input{width:20px;float:left;}';
				style+='#'+this.id+' .time span{float: left}';
				style+='#'+this.id+' .time .error{box-shadow: 1px 1px 5px red}';
				style+='#'+this.id+" .time input + b:after{content:':';float:left;padding:1px;line-height:17px;height:19px;}";
				if(!-[1,]){
					css=document.createStyleSheet();
					css.cssText=style;
				}else{
					css=document.createElement('style');
					css.type='text/css';
					css.innerHTML=style;
					document.getElementsByTagName("head")[0].appendChild(css); 
				}
			}
		},
		addClass: function(obj,claN){
			var reg = new RegExp('(^|\\s)'+claN+'(\\s|$)');
			if (!reg.test(obj.className)){
				obj.className += ' '+claN;
			}
		},
		removeClass: function(obj,claN){
			var cla=obj.className,reg="/\\s*"+claN+"\\b/g";
			obj.className=cla?cla.replace(eval(reg),''):''
		},
		createFn:function(){
			if(!$(this.id)) return false;
			var _method=this;
			this.chooseYM('year');
			this.chooseYM('month');
			$(this._set).onclick=function(e){
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}

				if(!_method.timeCheck) return;
				var dateValue=_method.tempDate;
				var timeValue=$(_method.id + '_hours').value+':'+$(_method.id + '_minutes').value+':'+$(_method.id+'_seconds').value;
				var value = dateValue + ' ' + timeValue;
				_method.close(e);
				_method.setDate(value);
			}
			$(this._hours).onblur=function(){
				// check hours 00-24
				var reg = /^([0-1][0-9]|2[0-3])$/;
				if(!reg.test(this.value)){
					_method.timeCheck = false;
					_method.addClass(this, 'error')
				}else{
					_method.timeCheck = true;
					_method.removeClass(this, 'error')
				}
			}
			$(this._minutes).onblur=function(){
				// check minutes 00-59
				var reg = /^([0-5][0-9])$/;
				if(!reg.test(this.value)){
					_method.timeCheck = false;
					_method.addClass(this, 'error')
				}else{
					_method.timeCheck = true;
					_method.removeClass(this, 'error')
				}
			}
			$(this._seconds).onblur=function(){
				// check seconds 00-59
				var reg = /^([0-5][0-9])$/;
				if(!reg.test(this.value)){
					_method.timeCheck = false;
					_method.addClass(this, 'error')
				}else{
					_method.timeCheck = true;
					_method.removeClass(this, 'error')
				}
			}
			$(this._today).onclick=function(e){
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
				var ev=e.target||e.srcElement;
				if(ev.tagName!='A') return false;
				var lastSelectDayTag = _method.selectDay;
				if(lastSelectDayTag) lastSelectDayTag.className = '';
				_method.selectDay = ev;
				ev.className = 'select';
				var value = this.innerHTML.replace('今天 ','');
				_method.saveDate(value);
			}
			$(this._close).onclick=function(e){
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
				_method.close(e);
			}
			$(this._newDays).onclick=function(e){
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
				var ev=e.target||e.srcElement;
				if(ev.tagName!='A') return false;

				var lastSelectDayTag = _method.selectDay;
				if(lastSelectDayTag) lastSelectDayTag.className = '';
				_method.selectDay = ev;
				ev.className = 'select';
				var value=$(_method._year).innerHTML+'-'+$(_method._month).innerHTML+'-'+_method.formatNum(ev.innerHTML);
				_method.saveDate(value);
			}
			MIS.Util.bind(document, 'click', closeFn);
				
		},
		
		close:function(e){
			var _method = this;
			var e=window.event||e;
			if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
			if(!$(_method.id)) return false;
			MIS.DateTimeViews.pop(_method);
			MIS.Util.unbind(document, 'click', closeFn);
			_method.removeDate();

		},
		chooseYM:function(YM){
			var _method=this,
			nows=YM=='year'?this._year:this._month,
			nowPre=YM=='year'?this._yearPre:this._monthPre,
			nowNex=YM=='year'?this._yearNex:this._monthNex,
			nowMore=YM=='year'?this._yearMore:this._monthMore;
			$(nows).onclick=function(e){
				$(_method._yearMore).style.display='none';
				$(_method._monthMore).style.display='none';
				$(nowMore).style.display='block';
				var moreA=$(nowMore).getElementsByTagName('a');
				for(var i=0,l=moreA.length;i<l;i++){
					if(moreA[i].innerHTML==$(nows).innerHTML){
						$(nowMore).scrollTop=i*20;
						moreA[i].className='on';
					}else{
						moreA[i].className='';
					}
				}
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
			}
			$(nowMore).onmouseleave=function(e){
				var e=window.event||event;
				var moreMap=_method.offset(this,e).out;
				if(moreMap) this.style.display='none';
			}
			$(nowMore).onclick=function(event){
				var e=window.event||event;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
				var ev=e.target||e.srcElement;
				$(nows).innerHTML=ev.innerHTML;
				_method.newDays();
				this.style.display='none';

			}
			$(nowPre).onclick=function(e){
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
				if(YM=='month'){
					if(parseFloat($(nows).innerHTML)==1){
						$(nows).innerHTML=13;
						$(_method._year).innerHTML=parseFloat($(_method._year).innerHTML)-1;
					}
				}
				$(nows).innerHTML=_method.formatNum(parseFloat($(nows).innerHTML)-1);
				_method.newDays();
				this.blur();
			}
			$(nowNex).onclick=function(e){
				var e=window.event||e;
				if (e.stopPropagation) { 
				// this code is for Mozilla and Opera 
					e.stopPropagation(); 
				} else if (window.event) { 
					// this code is for IE 
					window.event.cancelBubble = true; 
				}
				if(YM=='month'){
					var month=parseFloat($(nows).innerHTML)+1;
					if(parseFloat($(nows).innerHTML)==12){
						$(nows).innerHTML=0;
						$(_method._year).innerHTML=parseFloat($(_method._year).innerHTML)+1;
					}
				}
				$(nows).innerHTML=_method.formatNum(parseFloat($(nows).innerHTML)+1);
				_method.newDays();
				this.blur();

			}
		},
		newDays:function(){
			this.date.setFullYear(parseFloat($(this._year).innerHTML));
			this.date.setMonth(parseFloat($(this._month).innerHTML)-1);
			$(this.id+'_newDays').innerHTML=this.createDays();
		},
		saveDate: function(value){
			this.tempDate = value;
		},
		setDate:function(value){
			this.obj.value = value;
			this.callback(value);
		},
		removeDate:function(){
			if($(this.id)) document.body.removeChild($(this.id));
		}
	}, {});
})()