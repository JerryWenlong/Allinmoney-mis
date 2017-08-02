(function(){
    'use strict'
    MIS.ProdQuota= MIS.derive(null, {
        create: function(){
            this.init();
        },
        init: function(){
            var that = this;
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
            obj.en_entrust_type={
                value: [],
                reg: /^.+$/,
                list: that.randerCheckList(MIS.dictData.entrustType.list),
                checked: true
            };//允许委托方式
            obj.branch_no = {
                value: 8888,
                reg: /^.+$/,
                validateMsg: '不为空,最长64位字符',
                checked: true
            };//营业部号
            obj.prod_branch_zone = {
                value: 8888,
                reg: /^.+$/,
                validateMsg: '不为空,最长64位字符',
                checked: true
            };//营业部号

            obj.used_sub_num = {
                value: '',
                reg: /^\d+$/,
                validateMsg: '不为空,最长64位字符',
                checked: false
            };//小号已使用的认购数
            obj.max_sub_num = {
                value: '',
                reg: /^\d+$/,
                validateMsg: '不为空,最长64位字符',
                checked: false
            };//小号认购数上限
            obj.current_quota = {
                value: '',
                reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
                validateMsg: '不为空,最长64位字符',
                checked: false
            };//已用额度
            obj.enable_quota = {
                value: '',
                reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
                validateMsg: '不为空,最长64位字符',
                checked: false
            };//总份额
            this.prodQuotaObj = obj;
        },
        renderRequestData: function () {
            var requestData = {};
            var obj = this.prodQuotaObj;
            requestData.prodTaNo = obj.ta_no.value();
            requestData.prodCode = obj.prod_code.value();
            requestData.branchNo = obj.branch_no.value;
            requestData.prodBranchZone = obj.prod_branch_zone.value;
            requestData.usedSubNum=obj.used_sub_num.value;
            requestData.maxSubNum=parseInt(obj.max_sub_num.value);
            requestData.enEntrustType=this.getChecked(obj.en_entrust_type.list);
            requestData.currentQuota=parseInt(obj.current_quota.value);
            requestData.enableQuota=parseInt(obj.enable_quota.value);
            requestData.modifyTime='';

            return requestData;
        },

        randerCheckList:function(dictList){
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
    }, {})
})()
