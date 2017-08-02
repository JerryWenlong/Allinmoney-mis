(function(){
	'use strict'
	MIS.TaTrade = MIS.derive(null, {
		create: function(){
			this.init();
		},
		init: function(){
			var obj={};
			var that = this;
			obj.ta_no = {
				value:function(){
					if(this.item.hasOwnProperty('value')){
						return this.item.value;
					}
					else{
						return '';
					}
				},
				item:{},
				reg: /^.+$/,
				list: MIS.dictData.taNoList.list,
				checked: false
			};//TA 编号
			obj.ta_name={
				value:'',
				reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
				checked: false
			};//TA 名称
			obj.ta_short_name={
				value:'',
				reg: /^\w{4}$/,
				checked: false
			};//TA 简称
			obj.prod_ta_status={
				value:function(){
					if(this.item.hasOwnProperty('value')){
						return this.item.value;
					}
					else{
						return '';
					}
				},
				item:{},
				reg: /^.+$/,
				list:MIS.dictData.taStatusList.list,
				checked: false
			};//TA 状态
			obj.prod_ta_ctrlstr={
				value:[],
				reg: /^.+$/,
				list: that.randerCodeCtrlList(MIS.dictData.taCtrlList.list),
				checked: true
			};//TA控制串
			obj.prod_type={
				value:function(){
					if(this.item.hasOwnProperty('value')){
						return this.item.value;
					}
					else{
						return '';
					}
				},
				item:{},
				reg: /^.+$/,
				list:MIS.dictData.prodTypeList.list,
				checked: false
			};//产品类别
			obj.agency_no={
				value:'',
				reg: /^(\w|[\u4e00-\u9fa5]){1,10}$/,
				checked: false
			};//销售商代码
			obj.agency_name={
				value:'',
				reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
				checked: false
			};//销售商名
			obj.init_date={
				value:'',
				reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
				checked: false
			};//交易日期
			obj.fbackup_time={
				value:'',
				reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
				checked: false
			};//系统备份前日期
			obj.bbackup_time={
				value:'',
				reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
				checked: false
			};//系统备份后日期

			this.prodTradeObj = obj;
		},
		renderRequestData: function () {
			// body...
			var requestData = {};
			var obj = this.prodTradeObj;
			requestData.prodTaNo = obj.ta_no.value();
			requestData.prodTaName = obj.ta_name.value;
			requestData.prodTaShortName=obj.ta_short_name.value;
			requestData.prodTaStatus=obj.prod_ta_status.value();
			requestData.prodTaCtrlstr=this.getChecked(obj.prod_ta_ctrlstr.list);
			requestData.prodType=obj.prod_type.value();
			requestData.agencyNo=obj.agency_no.value;
			requestData.agencyName=obj.agency_name.value;
			requestData.initDate=obj.init_date.value;
			requestData.fbackupTime=obj.fbackup_time.value;
			requestData.bbackupTime=obj.bbackup_time.value;
			
			return requestData;
		},
		validate: function(obj){
			//obj.value, obj.reg
			var result = true;
			var reg = obj.reg;
			if(typeof(obj.value) == 'function'){
				if(reg.test(obj.value())){
					result = true;
					obj.checked = true;
				}else{
					result = false;
					obj.checked = false;
				}
			}else{
				if(reg.test(obj.value)){
					result = true;
					obj.checked = true;
				}else{
					result = false;
					obj.checked = false;
				}
			}
			return result;
		},

		randerCodeCtrlList:function(dictList){
			var len = dictList.length;
			var list = [];
			if(len <= 0) return list;
			for(var i=0;i<len;i++){
				var obj = dictList[i];
				obj.checked = false;
				list.push(obj);
			}
			return list;
		},
		getChecked:function(list){
			var result = [];
			list.forEach(function(item){
				if(item.checked){
					result.push(item.value);
				}
			});
			var resultStr = result.join(',');
			return resultStr;
		}
	}, {});
})()