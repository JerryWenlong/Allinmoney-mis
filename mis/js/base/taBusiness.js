(function(){
	'use strict'
	MIS.TaBusiness= MIS.derive(null, {
		create: function(){
			this.init();
		},
		init: function(){
			var obj = {};
			obj.ta_no ={
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
			obj.prod_code = {
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
				list:MIS.dictData.codeTypeList.list,
				checked: false
			};//产品代码
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
			obj.prod_status={
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
				list:MIS.dictData.prodStatusList.list,
				checked: false
			};//产品状态
			obj.en_prod_business_type={
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
				list:MIS.dictData.prodBusinessTypeList,
				checked: false//hard code now
			};//允许业务类型 
			this.prodBusinessObj = obj;
		},
		renderRequestData: function () {
			var requestData = {};
			var obj = this.prodBusinessObj;
			requestData.prodTaNo = obj.ta_no.value();
			requestData.prodCode = obj.prod_code.value();
			requestData.prodType = obj.prod_type.value();
			requestData.prodStatus=obj.prod_status.value();
			requestData.enProdBusinessType=obj.en_prod_business_type.value();
			requestData.modifyTime='0';

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
		}
	}, {})
})()