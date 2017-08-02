(function(){
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}


if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}




Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "H+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
}

MIS.Util = {
	stringFormat: function(str, args){
		return str.replace(/\{(\d+)\}/g,                
	        function(m,i){
	            return args[i];
	        });
	},
  isArray:function(obj){
      return Object.prototype.toString.call(obj) === '[object Array]';
  },
	encrypt:{
		// encrypt for bscript, RSA,MD5
		_round:10, // set salt round
		//encrypt password 
		//params:
		//  pw: user password.
		//  callback: encrypt success function. 
		//  progress: progress function(optional)
		cryptPasswordSync: function(pw, salt){
			if(!salt || salt==""){
				var salt = jBcrypt.genSaltSync(this._round);
			}
			var hash_str = jBcrypt.hashSync(pw, salt);
			return [hash_str, salt];
		},
		generateMD5Sync: function(pw, salt, random_key){
			var hash_str = this.cryptPasswordSync(pw, salt)[0];
			var md5_result = MD5(hash_str + random_key);
			return md5_result;
		},
		encryptRSA: function(publicKey){
			var encrypt = new JSEncrypt();
			encrypt.setPublicKey(publicKey);
			return encrypt.encrypt(publicKey);
		},
	},
	getApiUrl: function(serverName, apiName, urlStr, apiParam){
		var service = MIS.Config[serverName];
    if(!apiName){
      return this.stringFormat('{0}/{1}', [service.host, urlStr])
    }
    var api = service[apiName];
    if(apiParam && apiParam.length>0){
      api = this.stringFormat(api, apiParam);
    }
    var s = urlStr? urlStr : "{0}/{1}";
		var url = this.stringFormat(s, [service.host, api]);
		return url;
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
  bind: function(target, type, listener){
    if(target.addEventListener){
      target.addEventListener(type, listener, false)
    }else if(target.attachEvent){
      target.attachEvent('on'+type, listener)
    }else{
      target["on"+type] = listener;
    }
  },
  unbind:function(target, type, listener){
    if(target.removeEventListener){
      target.removeEventListener(type, listener, false)
    }else if(target.detachEvent){
      target.detachEvent("on"+type, listener);
    }else{
      target["on"+type]=null;
    }
  },
  dateFormat:function(timeString, formatStr){
    // var formatStr = formatStr || "yyyy-mm-dd";
    // var date = new Date();
    // date.setTime(timeStamp);
    // return date.format(formatStr);
    var timeString = timeString.split('T');
    return timeString[0];
  },
  toPercent:function(num){
    var numStr = num.toString()
    var dotIndex = numStr.indexOf('.')
    var numWithoutDotStr = numStr.replace('.','')
    var numStrList = numStr.split('')
    var result = ''
    if(dotIndex == 1){
      result = '0.0' + numWithoutDotStr
    }else if(dotIndex == 2){
      result =  '0.' + numWithoutDotStr
    }else if(dotIndex == -1){
      if(numStr.length == 1){
        result = '0.0' + numStr
      }else if(numStr.length == 2){
        result = '0.' + numStr
      }else if(numStr.length > 2){
        var numStrListLen = numStrList.length
        var intergerPartList = numStrList.splice(0,numStrListLen-2)
        var intergerPart = intergerPartList.join('')
        var decimalPartList = numStrList
        var decimalPart = decimalPartList.join('')
        result = intergerPart + '.' + decimalPart
      }
    }else{
      intergerPart= numStrList.splice(0,dotIndex-2).join('')
      for(var i=0;i<numStrList.length;i++){
        if(numStrList[i] == '.'){
          numStrList.splice(i,1)
        }
      }
      decimalPart = numStrList.join('')
      result = intergerPart + '.' + decimalPart
    }

    if(/^[1-9]\d*\.[1-9]+0+$/.test(result)){
      result = result.replace(/0+$/, '')
    }else if(/^[1-9]\d*\.0+$/.test(result)){
      result = result.replace(/\.0+$/, '')
    }
    return result
  },
  parsePercent: function(num){
    var numStr = num.toString()
    var dotIndex = numStr.indexOf('.')
    var numWithoutDotStr = numStr.replace('.','')
    var numStrList = numStr.split('')
    var result = ''
    if(dotIndex == -1){
      result = parseInt(numStr * 100).toString()
    }else{
      var newDotIndex = dotIndex + 2
      oldDecimalPartList = numStrList.slice(dotIndex+1,numStrList.length)
      if(oldDecimalPartList.length == 1){
        numStrList.push('0')
      }
      numStrList.splice(dotIndex,1)
      numStrList.splice(newDotIndex,0,'.')
      if(numStrList[numStrList.length-1] == '.'){
        numStrList.splice(numStrList.length-1,1)
      }
      result = numStrList.join('')
    }
    if(/^[1-9]\d*\.[1-9]+0+$/.test(result)){
      result = result.replace(/0+$/, '')
    }else if(/^[1-9]\d*\.0+$/.test(result)){
      result = result.replace(/\.0+$/, '')
    }
    return result
  },
  strToTimestamp: function(str){
    formatedStr = str.replace(/^\s+/, '')
    formatedStr = str.replace(/\s+$/, '')
    result = 0;
    if(formatedStr == ''){
      return
    }
    if(formatedStr.indexOf(' ') != -1){
      mainList = formatedStr.split(' ')
      dateList = mainList[0].split('-')
      timeList = mainList[1].split(':')
    }
    if(formatedStr.indexOf('T') != -1){
      mainList = formatedStr.split('T')
      dateList = mainList[0].split('')
      timeList = mainList[1].split(':')
    }
    result = Date.UTC(parseInt(dateList[0]),parseInt(dateList[1]),parseInt(dateList[2]),parseInt(timeList[0]),parseInt(timeList[1]),parseInt(timeList[2]),0)
    return result
  },
  dateDiff: function(beginDateStr, endDateStr){
    var beginTimestamp = new Date(beginDateStr).getTime()
    var endTimestamp = new Date(endDateStr).getTime()
    return Math.floor((endTimestamp-beginTimestamp)/(24*3600*1000)+1).toString();
  },
  validationDate: function(str){
    var reg = /(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)/
    return reg.test(str);
  },
  validationDateTime: function(str){
    // [\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$/
    var reg = /(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)[\s](0[0-9]|1[0-9]|2[0-4])[\-\:]([0-5][0-9])[\-\:]([0-5][0-9])$)/
    return reg.test(str);
  },
  validationPassword: function(str){
    var reg = /(((?=.*[a-zA-Z])(?=.*[0-9]))|((?=.*?[@!#$%^&*()_+\.\-\?<>'|=])(?=.*[0-9]))|((?=.*?[@!#$%^&*()_+\.\-\?<>'|=])(?=.*[a-zA-Z])))\S{8,16}$/;
    return reg.test(str);
  },
  reolaceSimbo: function(s, arr){
    var arrStr = arr || "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]";
    var pattern = new RegExp(arrStr,'gm')        
    var rs = "";
    for (var i = 0; i < s.length; i++){
         rs = rs + s.substr(i, 1).replace(pattern, '');  
      }  
    return rs;
  },
  getTimeStamp: function(){
    return  (new Date()).valueOf(); 
  },
  listInsert: function(list, item, index){
    list.splice(index, 0, item);
  },
  uniquelize: function(list){//不重复数组集合
      var ra = new Array();
      for(var i=0; i<list.length; i++){
        if(ra.indexOf(list[i]) == -1){
          ra.push(list[i]);
        }
      }
      return ra;
  },
  intersect: function(a, b){//交集
    var list = [];
    this.uniquelize(a).forEach(function(o){
      if(b.indexOf(o) != -1){
        list.push(o)
      }
    });
    return list;
  },
  union: function(a, b){//数组并集
    return this.uniquelize(a.concat(b));
  },
  checkUnique: function(arr){//检查集合是否有重复
    var _ra = new Array();
    for(var i=0;i<arr.length;i++){
      if(_ra.indexOf(arr[i]) == -1){
        _ra.push(arr[i])
      }else{
        return false
      }
    }
    delete _ra;
    return true
  },
  showText: function(X, Y, displayStr){
    var domroot = document.getElementsByTagName('body')[0];
    //create fargment
    var f = document.createElement('div');
    var scrollTop = document.body.scrollTop;
    var scrollLeft = document.body.scrollLeft;
    f.style.zIndex = 100;
    f.style.position = 'absolute';
    f.style.left = X + scrollLeft +'px';
    f.style.top = Y + scrollTop +'px';
    f.style.background = '#FFF';
    f.style.border = '1px solid #000';
    f.innerHTML = displayStr;
    f.id = 'MIS_textShow';
    domroot.appendChild(f)
  },
  hideText: function(){
    var domroot = document.getElementsByTagName('body')[0];
    var f = document.getElementById('MIS_textShow');
    domroot.removeChild(f);
  },
  //remove all child nodes
  removeChild: function(node){
    while(node.hasChildNodes()){
      node.removeChild(node.firstChild)
    }
  }
}
})()


