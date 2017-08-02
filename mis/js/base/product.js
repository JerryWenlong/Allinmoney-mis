(function(){
	'use strict'
	MIS.Product = MIS.derive(null, {
		create: function(){
			this.init();
		},
		init: function(){
			var obj = {};
            var that = this;
			//
			// obj.prod_code_id = {
			// 	value:''
			// },

			obj.code = {
				value:'',
				reg: /^(\w|[\u4e00-\u9fa5]){1,32}$/,
				validateMsg: '产品代码不能为空,最长32位字符',
				checked: true,
				required: false
			};//产品代码
			obj.prod_code_id = {
				value:'',
				reg: /^(\w|[\u4e00-\u9fa5]){1,32}$/,
				validateMsg: '产品代码不能为空,最长32位字符',
				checked: true,
				required: false
			};//产品ID
			obj.prod_full_name = {
				value:'',
				reg: /^([A-Za-z0-9_ \-\u4e00-\u9fa5]){1,32}$/,
				validateMsg: '产品代码不能为空,最长32位字符',
				checked: true,
				required: false
			};//产品全称
			obj.name = {
				value:'',
				reg: /^([A-Za-z0-9_ \-\u4e00-\u9fa5]){1,64}$/,
				validateMsg: '产品名称不能为空,最长64位字符',
				checked: false,
				required: true
			};//产品名称
			// obj.spell_code = {
			// 	value:'',
			// 	reg: /^(\w|[\u4e00-\u9fa5]){1,32}$/,
			// 	validateMsg: '拼音代码不能为空,最长32位字符',
			// 	checked: false
			// };//拼音代码
			obj.issuer_name = {
				value:'',
				reg: /^([A-Za-z0-9_ \-\u4e00-\u9fa5]){1,32}$/,
				validateMsg: '产品全称不能为空,最长32位字符',
				checked: true,
				required: false
			};//产品全称
			// obj.ta_no = {
			// 	value:function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
   //              validateMsg: '产品TA编号未选择',
			// 	reg: /^.+$/,
			// 	list: MIS.dictData.taNoList.list,
			// 	checked: false
			// };//产品TA编号
            //obj.en_pay_type = {
            //    value:function(){
            //        if(this.item.hasOwnProperty('value')){
            //            return this.item.value;
            //        }
            //        else{
            //            return '';
            //        }
            //    },
            //    item:{},
            //    reg: /^.+$/,
            //    list: MIS.dictData.payTypeList.list,
            //    checked: false
            //};//允许支付方式
			// obj.trustee_bank = {
			// 	value:'',
			// 	reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
			// 	validateMsg: '托管银行不能为空,最长64位字符',
			// 	checked: false
			// };//托管银行
			// obj.manager = {
			// 	value:'',
			// 	reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
			// 	validateMsg: '产品管理人不能为空,最长64位字符',
			// 	checked: false
			// };//产品管理人
			obj.type = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				reg: /^.+$/,
				validateMsg: '请选择产品类型',
				list: MIS.dictData.prodType,
				checked: true,
				required: false
			};//产品类型
			// obj.type = {
			// 	value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
   //              validateMsg: '产品类型未选择',
			// 	reg: /^.+$/,
			// 	list: MIS.dictData.prodTypeList.list,
			// 	checked: false
			// };//产品类型
			// obj.code_type = {
			// 	value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
   //              validateMsg: '产品代码类型未选择',
			// 	reg: /^.+$/,
			// 	list: MIS.dictData.codeTypeList.list,
			// 	checked: false
			// };//产品代码类型
			obj.risk_level = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				reg: /^.+$/,
				validateMsg: '风险等级未选择',
				list: MIS.dictData.riskLevelList,
				checked: true,
				required: false
			};//风险等级

			// obj.fund_charge_type = {
			// 	value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
			// 	reg: /^.+$/,
			// 	validateMsg: '基金收费方式未选择',
			// 	list: MIS.dictData.fundChargeType.list,
			// 	checked: false
			// };//基金收费方式
			obj.raise_begin_date = {
                value: '',
                reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
                validateMsg: '募集开始日期不能为空',
                checked: true,
				required: false
            };//募集开始日期
			obj.build_begin_date={
                value: '',
                reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
                validateMsg: '产品成立日期不能为空',
                checked: true,
				required: false
            };//产品成立日期
			//
			// obj.alias_name={
   //              value:'',
   //              reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
   //              validateMsg: '产品别名不能为空,最长64位字符',
   //              checked: false
   //          };//产品别名
			obj.company_name={
				value:'',
				reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
				validateMsg: '产品公司不能为空,最长64位字符',
				checked: true,
				required: false
			};//产品公司
			// obj.sponsor={
			// 	value:'',
			// 	reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
			// 	validateMsg: '产品发起人不能为空,最长64位字符',
			// 	checked: false
			// };//产品发起人
			// obj.trustee={
			// 	value:'',
			// 	reg: /^(\w|[\u4e00-\u9fa5]){1,64}$/,
			// 	validateMsg: '产品托管人不能为空,最长64位字符',
			// 	checked: false
			// };//产品托管人
			// obj.type_ass= {
			// 	value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
			// 	reg: /^.+$/,
			// 	validateMsg: '产品辅助类别未选择',
			// 	list: MIS.dictData.prodTypeAssList.list,
			// 	checked: false
			// };//产品辅助类别
			obj.status={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				reg: /^.+$/,
				validateMsg: '产品状态未选择',
				list: MIS.dictData.prodStatusList,
				checked: true,
				required: false
			};//产品状态
			obj.review_status={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				reg: /^.+$/,
				validateMsg: '产品状态未选择',
				list: MIS.dictData.reviewStatus,
				checked: true,
				required: false
			};//审核状态
			// obj.currency_type={
   //              value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
   //              validateMsg: '货币种类未选择',
   //              reg: /^.+$/,
   //              list: MIS.dictData.currencyTypeList.list,
   //              checked: false
   //          };//货币种类
			// obj.dividend_type={
			// 	value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
			// 	reg: /^.+$/,
			// 	validateMsg: '分红方式未选择',
   //              list: MIS.dictData.dividendTypeList.list,
			// 	checked: false
			// };//分红方式
			obj.raise_end_date={
                value: '',
                reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
                validateMsg: '募集结束日期不能为空',
                checked: true,
				required: false
            };//募集结束日期
			obj.build_end_date= {
                value: '',
                reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
                validateMsg: '产品结束日期不能为空',
                checked: true,
				required: false
            };//产品结束日期
			//
			// obj.issue_time={
   //              value: '',
   //              id: 'issue_time',
   //              reg: /^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])$/,
   //              validateMsg: '发行日期不能为空',
   //              checked: false
   //          };//发行日期
			obj.prod_period={
				value: '',
				reg: /^\d+$/,
				validateMsg: '产品期限为数字',
				checked: true,
				required: false
			};//产品期限
			obj.period_type={
				value:'0',
				reg: /^\d+$/,
				validateMsg: '期限类型为定值',
				checked: true,
				required: false
			};//期限类型
			obj.max_raised_amount={
				value: '',
				reg: /^(\d+|\d+\.\d{1,8})$/,
				validateMsg: '募集金额为数字',
				checked: false,
				required: true
			};//募集金额
			obj.profit_type={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				reg: /^.+$/,
				validateMsg: '收益类型未选择',
				list: MIS.dictData.incomeType,
				checked: true,
				required: false
			};//收益类型
			obj.expect_year_return={
				value:'',
				reg: /^(\d+|\d+\.\d{1,8})$/,
				validateMsg: '预期年收益率不能为空',
				checked: true,
				required: false
			};//预期年收益率
			obj.contract_year_return={
				value:'',
				reg: /^(\d+|\d+\.\d{1,8})$/,
				validateMsg: '合同年收益率不能为空',
				checked: true,
				required: false
			};//合同年收益率

			obj.year_days={
				value:'',
				reg: /^\d+$/,
				validateMsg: '年化天数不为空且为数字',
				checked: true,
				required: false
			};//年化天数
			// obj.per_myriad_income={
			// 	value:'',
			// 	reg: /^(\d{1,5}|\d{1,5}\.\d{1,4})$/,
			// 	validateMsg: '万份单位收益不能为空',
			// 	checked: false
			// };//万份单位收益
			// obj.prod_put_price={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '回售价格不能为空',
			// 	checked: false
			// };//回售价格
			// obj.nav = {
			// 	value:'',
			// 	reg: /^(\d{1,5}|\d{1,5}\.\d{1,4})$/,
			// 	validateMsg: '净值不能为空',
			// 	checked: false
			// };//净值
			obj.assess_level={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				validateMsg: '评估等级未选择',
				reg: /^.+$/,
				list: MIS.dictData.assessLevel,
				checked: true,
				required: false
			};//评估等级
			// obj.prod_issue_price={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '发行价格不能为空',
			// 	checked: false
			// };//发行价格
			obj.invest_area={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				validateMsg: '投资类型未选择',
				reg: /^.+$/,
				list: MIS.dictData.investArea,
				checked: true,
				required: false
			};//投资类型
			// obj.interest_freq = {
			// 	value:'',
			// 	reg: /^(\w|[\u4e00-\u9fa5]){1,32}$/,
			// 	validateMsg: '付息频率不能为空,最长32位字符',
			// 	checked: false
			// };//付息频率
			// obj.interest_freq = {
			// 	value: function(){
   //                  if(this.item.hasOwnProperty('value')){
   //                      return this.item.value;
   //                  }
   //                  else{
   //                      return '';
   //                  }
   //              },
   //              item:{},
			// 	validateMsg: '请选择付息频率',
			// 	reg: /^.+$/,
			// 	list: MIS.dictData.interestMethod.list,
			// 	checked: false
			// }
			// obj.seven_income_ratio = {
			// 	value:'',
			// 	reg: /^(\d|\d\.\d{1,8})$/,
			// 	validateMsg: '七日年收益率不能为空',
			// 	checked: false
			// };//七日年收益率
			// obj.prod_interest={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '应计利息不能为空',
			// 	checked: false
			// };//应计利息
			// obj.prod_par_value={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '面值不能为空',
			// 	checked: false
			// };//面值
			// obj.nav_total={
			// 	value:'',
			// 	reg: /^(\d{1,5}|\d{1,5}\.\d{1,4})$/,
			// 	validateMsg: '累计净值不能为空',
			// 	checked: false
			// };//累计净值
			// obj.en_entrust_type={
			// 	value: [],
			// 	reg: /^.+$/,
			// 	validateMsg: '允许委托方式未选择',
			// 	list: that.randerCheckList(MIS.dictData.entrustType.list),
			// 	checked: true
			// };//允许委托方式
			// //
			// obj.person_open_share={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '个人首次最低金额不能为空',
			// 	checked: false
			// };//个人首次最低金额
			// obj.max_pdshare={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '客户单日申购最高金额不能为空',
			// 	checked: false
			// };//客户单日申购最高金额
			// obj.person_min_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '个人最低认购金额不能为空',
			// 	checked: false
			// };//个人最低认购金额
			// obj.person_append_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '个人追加认购金额不能为空',
			// 	checked: false
			// };//个人追加认购金额
			// obj.person_min_allot_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '个人最低申购金额不能为空',
			// 	checked: false
			// };//个人最低申购金额
			// obj.person_append_allot_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '个人追加申购金额不能为空',
			// 	checked: false
			// };//个人追加申购金额
			// obj.prod_min_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最低募集金额不能为空',
			// 	checked: false
			// };//最低募集金额
			// obj.redeem_min_share={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '赎回最低份额不能为空',
			// 	checked: false
			// };//赎回最低份额
			// obj.min_asset_need={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最低资产要求不能为空',
			// 	checked: false
			// };//最低资产要求
			// obj.sub_unit={
			// 	value:'',
			// 	reg: /^\d{1,20}$/,
			// 	validateMsg: '单位不能为空',
			// 	checked: false
			// };//认购/申购de单位
			// obj.max_allot_ratio={
			// 	value:'',
			// 	reg: /^(\d|\d\.\d{1,8})$/,
			// 	validateMsg: '每次最大可申购比例不能为空',
			// 	checked: false
			// };//每次最大可申购比例
   //          obj.en_change_code={
   //              value:'',
   //              reg: /^(\w|[\u4e00-\u9fa5]){1,500}$/,
   //              validateMsg: '允许转换代码不能为空,最长500位字符',
   //              checked: false
   //          };//允许转换代码
			// //
			// obj.org_open_share={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '机构首次最低金额不能为空',
			// 	checked: false
			// };//机构首次最低金额
			// obj.person_sum_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '个人累计最高金额不能为空',
			// 	checked: false
			// };//个人累计最高金额
			// obj.org_min_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '机构最低认购金额不能为空',
			// 	checked: false
			// };//机构最低认购金额
			// obj.org_append_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '机构追加认购金额不能为空',
			// 	checked: false
			// };//机构追加认购金额
			// obj.org_min_allot_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '机构最低申购金额不能为空',
			// 	checked: false
			// };//机构最低申购金额
			// obj.prod_max_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最高募集金额不能为空',
			// 	checked: false
			// };//最高募集金额
			// obj.inventory_min_amount={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '持仓量最低值不能为空',
			// 	checked: false
			// };//持仓量最低值
			// obj.precisions={
			// 	value:'',
			// 	reg: /^\d+$/,
			// 	validateMsg: '份额精确小数位数不能为空',
			// 	checked: false
			// };//份额精确小数位数
			// obj.redeem_unit={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '赎回最小单位不能为空',
			// 	checked: false
			// };//赎回最小单位
			// obj.huge_ratio={
			// 	value:'',
			// 	reg: /^(\d|\d\.\d{1,8})$/,
			// 	validateMsg: '巨额比例不能为空',
			// 	checked: false
			// };//巨额比例
			// obj.min_trans_share={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最少转换份额不能为空',
			// 	checked: false
			// };//最少转换份额
   //          obj.org_append_allot_balance={
   //              value:'',
   //              reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
   //              validateMsg: '机构追加申购金额不能为空',
   //              checked: false
   //          };//机构追加申购金额
			// //
			// obj.switch_unit={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '转换单位不能为空',
			// 	checked: false
			// };//转换单位
			// obj.min_split_amount={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最低拆分数量不能为空',
			// 	checked: false
			// };//最低拆分数量
			// obj.min_timer_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最小定投金额不能为空',
			// 	checked: false
			// };//最小定投金额
			// obj.max_sub_num={
			// 	value:'',
			// 	reg: /^\d{1,20}$/,
			// 	validateMsg: '认购人数上限不能为空',
			// 	checked: false
			// };//认购人数上限
			// obj.min_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '小号下限金额不能为空',
			// 	checked: false
			// };//小号下限金额
			// obj.risk_des_url={
			// 	value:'',
			// 	reg: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/,
			// 	validateMsg: '风险揭示书链接不能为空',
			// 	checked: false
			// };//风险揭示书链接
			// //
			// obj.en_split_code = {
			// 	value:'',
			// 	reg: /^.{1,500}$/,
			// 	validateMsg: '允许拆分代码不能为空',
			// 	checked: false
			// };//允许拆分代码
			// obj.min_merge_amount={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最低合并数量不能为空',
			// 	checked: false
			// };//最低合并数量
			// obj.max_timer_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '最大定投金额不能为空',
			// 	checked: false
			// };//最大定投金额
			// obj.max_sub_balance={
			// 	value:'',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '小号金额上限不能为空',
			// 	checked: false
			// };//小号金额上限
			// obj.quota_valid_term={
			// 	value:'',
			// 	reg: /^\d+$/,
			// 	validateMsg: '额度申领有效期不能为空',
			// 	checked: false
			// };//额度申领有效期
			// //
			// obj.prod_code_ctrlstr={
			// 	value: [],//set default value
   //              reg: /^.+$/,
			// 	validateMsg: '产品业务控制串未选择',
			// 	list: that.randerCheckList(MIS.dictData.prodCodeCtrlList.list, ['38','5','8']),
			// 	checked: true
			// };//产品业务控制串
			obj.min_apply_amount={
				value: null,
				reg: /^(\d+|\d+\.\d+)$/,
				validateMsg: '额度申领有效期不能为空',
				checked: true,
				required: false
			};//起投金额
			obj.min_add_amount={
				value: null,
				reg: /^(\d+|\d+\.\d+)$/,
				validateMsg: '额度申领有效期不能为空',
				checked: true,
				required: false
			};//追加金额
			obj.max_total_amount={
				value: null,
				reg: /^(\d+|\d+\.\d+)$/,
				validateMsg: '额度申领有效期不能为空',
				checked: true,
				required: false
			};//累计最高投资金额
			obj.first_min_amount={
				value: null,
				reg: /^(\d+|\d+\.\d+)$/,
				validateMsg: '额度申领有效期不能为空',
				checked: true,
				required: false
			};//首次最小投资金额
			obj.daily_max_amount={
				value: null,
				reg: /^(\d+|\d+\.\d+)$/,
				validateMsg: '额度申领有效期不能为空',
				checked: true,
				required: false
			};//每日最高投资金额


			obj.back_days={
				value: '',
				reg: /^\d+$/,
				validateMsg: '"T+N天"不能为空',
				checked: true,
				required: false
			};//T+N天
			obj.tags={
				value: '',
				reg: /^.*$/,
				validateMsg: 'Tags',
				checked: true,
				required: false
			};//tags
			// obj.enable_quota={
			// 	value: '',
			// 	reg: /^(\d{1,16}|\d{1,16}\.\d{1,3})$/,
			// 	validateMsg: '总份额不能为空',
			// 	checked: false
			// };//总份额
			// obj.prod_detail = {
			// 	value:'',
			// 	reg: /^.{1,2000}$/,
			// 	validateMsg: '产品细节介绍不能为空,最长2000位字符',
			// 	checked: false
			// };//产品细节介绍
			// obj.prod_risk_measure = {
			// 	value:'',
			// 	reg: /^.{1,2000}$/,
			// 	validateMsg: '产品风险措施不能为空,最长2000位字符',
			// 	checked: false
			// };//产品风险措施
			obj.interest_type = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
                item:{},
				validateMsg: '请选择付息方式',
				reg: /^.+$/,
				list: MIS.dictData.interestType,
				checked: true,
				required: false
			};//付息方式
			// obj.profit_platform = {
			// 	value: '',
			// 	reg: /^(\d|\d\.\d{1,8})$/,
			// 	validateMsg: '请正确输入合同收益率',
			// 	checked: false
			// }//合同收益率

			obj.details = []; // 产品详情 MIS.ProductDetail
			obj.fares = []; // 产品费率
			//template add
			// obj.en_pay_type = "0";
			// obj.withdraw_end_time = "0";
			// obj.prod_real_balance = 0;
			// obj.prom_begin_time = "0";
			// obj.prom_end_time="0";
			// obj.prom_fare_rate = 0;
			// obj.prom_scale=0;
			// obj.sub_confirm_end_time = "0";
			// obj.prod_sub_fare_rate = 0;
			// obj.interest_end_time = "0";
			// obj.redeem_available_flag = 0;
			// obj.rebuy_property=0;
			// obj.total_share=0;
			// obj.total_asset=0;
			// obj.modify_time=0;

			obj.issuedAt = {
				value: '',
				reg: 'DATETIME',
				validateMsg: '产品上线日期不能为空',
                checked: false,
				required: true
			}
			this.productObj = obj;
		},
		renderServerObjToProduct: function(responseObj){
			// console.log(responseObj)
			// set all field checked true?
			this.productObj.prod_code_id.value = responseObj.prodCodeId;
			// this.productObj.ta_no.item.value = responseObj.prodTaNo;
			this.productObj.issuer_name.value = responseObj.issuerName;
			this.productObj.max_raised_amount.value = responseObj.maxRaisedAmount;
			this.productObj.code.value = responseObj.prodCode;
			this.productObj.prod_full_name.value = responseObj.prodFullName;
			// this.productObj.code_type.item.value = responseObj.prodCodeType;
			this.productObj.type.item.value = responseObj.prodType;
			// this.productObj.type_ass.item.value = responseObj.prodTypeAss;
			this.productObj.name.value = responseObj.prodName;
			this.productObj.period_type.value = responseObj.periodType;
			this.productObj.min_apply_amount.value = responseObj.minApplyAmount;
			this.productObj.min_add_amount.value = responseObj.minAddAmount;
			this.productObj.max_total_amount.value = responseObj.maxTotalAmount;
			this.productObj.first_min_amount.value = responseObj.firstMinAmount;
			this.productObj.daily_max_amount.value = responseObj.dailyMaxAmount;
			this.productObj.tags.value = responseObj.tags.join();
			// this.productObj.alias_name.value = responseObj.prodAliasName;
			this.productObj.company_name.value = responseObj.prodCompanyName;
			// this.productObj.spell_code.value = responseObj.prodSpellCode;
			this.productObj.status.item.value = responseObj.prodStatus;
			// this.productObj.currency_type.item.value = responseObj.currencyType;
			// this.productObj.en_pay_type = responseObj.enPayType;
			this.productObj.raise_begin_date.value = responseObj.raiseBeginDate ? MIS.Util.dateFormat(responseObj.raiseBeginDate) : ""; // format to datetime str
			// this.productObj.raise_end_date.value = MIS.Util.dateFormat(responseObj.raisedEndDate); 
			this.productObj.raise_end_date.value = responseObj.raiseEndDate ? MIS.Util.dateFormat(responseObj.raiseEndDate) : ""; 
			// this.productObj.withdraw_end_time = MIS.Util.dateFormat(responseObj.withdrawEndTime);
			this.productObj.build_begin_date.value = responseObj.buildBeginDate ? MIS.Util.dateFormat(responseObj.buildBeginDate) : "";
			this.productObj.build_end_date.value = responseObj.buildEndDate ? MIS.Util.dateFormat(responseObj.buildEndDate) : "";
			// this.productObj.prod_min_balance.value = responseObj.prodMinBalance;
			// this.productObj.prod_max_balance.value = responseObj.prodMaxBalance;
			// this.productObj.prod_real_balance = responseObj.prodRealBalance;
			// this.productObj.prod_put_price.value = responseObj.prodPutPrice;
			// this.productObj.prom_begin_time = MIS.Util.dateFormat(responseObj.promBeginTime);
			// this.productObj.prom_end_time = MIS.Util.dateFormat(responseObj.promEndTime);
			// this.productObj.prom_fare_rate = responseObj.promFareRate;
			// this.productObj.prom_scale = responseObj.promScale;
			// this.productObj.sub_confirm_end_time = MIS.Util.dateFormat(responseObj.subConfirmEndTime);
			this.productObj.risk_level.item.value = responseObj.riskLevel;
			this.productObj.assess_level.item.value  = responseObj.assessLevel
			this.productObj.review_status.item.value = responseObj.reviewStatus;
			// this.productObj.prod_issue_price.value = responseObj.prodIssuePrice;
			// this.productObj.prod_par_value.value = responseObj.prodParValue;
			this.productObj.expect_year_return.value = responseObj.expectYearReturn;
			this.productObj.contract_year_return.value = responseObj.contractYearReturn;
			// this.productObj.sponsor.value = responseObj.prodSponsor;
			// this.productObj.manager.value = responseObj.prodManager;
			// this.productObj.trustee.value = responseObj.prodTrustee;
			// this.productObj.trustee_bank.value = responseObj.prodTrusteeBank;
			// this.productObj.prod_sub_fare_rate = responseObj.prodSubFareRate;
			// this.productObj.min_sub_balance.value = responseObj.minSubBalance;
			// this.productObj.max_sub_balance.value = responseObj.maxSubBalance;
			// this.productObj.max_sub_num.value = responseObj.maxSubNum;
			// this.productObj.en_entrust_type.list = this.setChecked(responseObj.enEntrustType, this.productObj.en_entrust_type.list);
			// this.productObj.prod_code_ctrlstr.list = this.setChecked(responseObj.prodCodeCtrlstr, this.productObj.prod_code_ctrlstr.list);
			this.productObj.prod_period.value = responseObj.prodPeriod;
			this.productObj.invest_area.item.value = responseObj.investArea;
			this.productObj.profit_type.item.value = responseObj.profitType;
			// this.productObj.interest_freq.value = responseObj.interestFreq;
			// this.productObj.interest_freq.item.value = responseObj.interestType;
			// this.productObj.prod_interest.value = responseObj.prodInterest;
			// this.productObj.interest_end_time = MIS.Util.dateFormat(responseObj.interestEndTime);
			// this.productObj.sub_unit.value = responseObj.subUnit;
			// this.productObj.issue_time.value = MIS.Util.dateFormat(responseObj.issueTime);
			// this.productObj.person_open_share.value = responseObj.personOpenShare;
			// this.productObj.org_open_share.value = responseObj.orgOpenShare;
			// this.productObj.max_pdshare.value = responseObj.maxPdshare;
			// this.productObj.precisions.value = responseObj.precisions;
			// this.productObj.person_min_sub_balance.value = responseObj.personMinSubBalance;
			// this.productObj.person_append_sub_balance.value = responseObj.personAppendSubBalance;
			// this.productObj.person_sum_sub_balance.value = responseObj.personSumSubBalance;
			// this.productObj.org_min_sub_balance.value = responseObj.orgMinSubBalance;
			// this.productObj.org_append_sub_balance.value = responseObj.orgAppendSubBalance;
			// this.productObj.person_min_allot_balance.value = responseObj.personMinAllotBalance;
			// this.productObj.person_append_allot_balance.value = responseObj.personAppendAllotBalance;
			// this.productObj.org_min_allot_balance.value = responseObj.orgMinAllotBalance;
			// this.productObj.org_append_allot_balance.value = responseObj.orgAppendAllotBalance;
			// this.productObj.max_allot_ratio.value = responseObj.maxAllotRatio;
			// this.productObj.redeem_unit.value = responseObj.redeemUnit;
			// this.productObj.redeem_min_share.value = responseObj.redeemMinShare;
			// this.productObj.redeem_available_flag = responseObj.redeemAvailableFlag;
			this.productObj.back_days.value = responseObj.backDays;
			// this.productObj.enable_quota.value = responseObj.enableQuota;
			// this.productObj.en_change_code.value = responseObj.enChangeCode;
			// this.productObj.en_split_code.value = responseObj.enSplitCode;
			// this.productObj.min_trans_share.value = responseObj.minTransShare;
			// this.productObj.min_merge_amount.value = responseObj.minMergeAmount;
			// this.productObj.min_split_amount.value = responseObj.minSplitAmount;
			// this.productObj.nav.value = responseObj.nav;
			// this.productObj.nav_total.value = responseObj.navTotal;
			// this.productObj.per_myriad_income.value = responseObj.perMyriadIncome;
			// this.productObj.min_asset_need.value = responseObj.minAssetNeed;
			// this.productObj.switch_unit.value = responseObj.switchUnit;
			// this.productObj.fund_charge_type.item.value = responseObj.fundChargeType;
			// this.productObj.dividend_type.item.value = responseObj.dividendType;
			// this.productObj.min_timer_balance.value = responseObj.minTimerBalance;
			// this.productObj.max_timer_balance.value = responseObj.maxTimerBalance;
			// this.productObj.huge_ratio.value = responseObj.hugeRatio;
			// this.productObj.quota_valid_term.value = responseObj.quotaValidTerm;
			// this.productObj.inventory_min_amount.value = responseObj.inventoryMinAmount;
			this.productObj.year_days.value = responseObj.yearDays;
			// this.productObj.rebuy_property = responseObj.rebuyProperty;
			// this.productObj.total_share = responseObj.totalShare;
			// this.productObj.total_asset = responseObj.totalAsset;
			// this.productObj.risk_des_url.value = responseObj.riskDesUrl;
			// this.productObj.seven_income_ratio.value = responseObj.sevenIncomeRatio;
			// this.productObj.modify_time = MIS.Util.dateFormat(responseObj.modifyTime);
			// this.productObj.prod_detail.value = responseObj.prodDetail;
			// this.productObj.prod_risk_measure.value = responseObj.prodRiskMeasure;
			this.productObj.details = responseObj.details;
			this.productObj.fares = this.randerFares(responseObj.fares);
			// this.productObj.interest_type.item.value = responseObj.interestType;
			this.productObj.interest_type.item.value = responseObj.interestType;
			// this.productObj.profit_platform.value = responseObj.profitPlatform;

			this.productObj.issuedAt.value = responseObj.issuedAt?responseObj.issuedAt.replace('T', ' '):responseObj.issuedAt;

			for(var item in this.productObj){
				if(this.productObj[item].hasOwnProperty('checked'))
					this.productObj[item].checked = true;
			}
		},
		renderRequestCodeData: function(){
			var requestData = {};
			var obj = this.productObj;
			requestData.prodCodeId = obj.prod_code_id.value;
			// requestData.prodTaNo = obj.ta_no.value();
			requestData.issuerName = obj.issuer_name.value;
			requestData.maxRaisedAmount = obj.max_raised_amount.value;
			requestData.prodCode = obj.code.value;
			requestData.prodFullName = obj.prod_full_name.value;
			// requestData.prodCodeType = obj.code_type.value();
			requestData.prodType=obj.type.value();
			requestData.periodType = obj.period_type.value;
			// requestData.prodTypeAss=obj.type_ass.value();
			requestData.prodName=obj.name.value;
			// requestData.prodAliasName=obj.alias_name.value;
			requestData.prodCompanyName = obj.company_name.value;
			requestData.minApplyAmount = obj.min_apply_amount.value;
			requestData.minAddAmount = obj.min_add_amount.value;
			requestData.maxTotalAmount = obj.max_total_amount.value;
			requestData.firstMinAmount = obj.first_min_amount.value;
			requestData.dailyMaxAmount = obj.daily_max_amount.value;
			requestData.tags = obj.tags.value.split(',');
			// requestData.prodSpellCode=obj.spell_code.value;
			requestData.prodStatus=parseInt(obj.status.value());
			// requestData.currencyType = obj.currency_type.value();
			// requestData.enPayType=obj.en_pay_type;// ? page has no options for set pay type
			requestData.raiseBeginDate = obj.raise_begin_date.value;
			requestData.raiseEndDate=obj.raise_end_date.value;
			// requestData.withdrawEndTime = obj.withdraw_end_time;// ? page has no option for set withdrawendtime
			requestData.buildBeginDate=obj.build_begin_date.value;
			requestData.buildEndDate=obj.build_end_date.value;
			// requestData.prodMinBalance=parseFloat(obj.prod_min_balance.value);
			// requestData.prodMaxBalance=parseFloat(obj.prod_max_balance.value);
			// requestData.prodRealBalance=obj.prod_real_balance;// ?
			// requestData.prodPutPrice=parseFloat(obj.prod_put_price.value);
			// requestData.promBeginTime=obj.prom_begin_time;// ?
			// requestData.promEndTime=obj.prom_end_time;//?
			// requestData.promFareRate=obj.prom_fare_rate;
			// requestData.promScale=obj.prom_scale;//?
			// requestData.subConfirmEndTime=obj.sub_confirm_end_time;//?
			requestData.riskLevel=parseInt(obj.risk_level.value());
			requestData.assessLevel=parseInt(obj.assess_level.value());
			requestData.reviewStatus=parseInt(obj.review_status.value());
			// requestData.prodIssuePrice=parseInt(obj.prod_issue_price.value);
			// requestData.prodParValue=parseFloat(obj.prod_par_value.value);
			requestData.expectYearReturn = parseFloat(obj.expect_year_return.value);
			requestData.contractYearReturn = parseFloat(obj.contract_year_return.value);
			// requestData.prodSponsor=obj.sponsor.value;
			// requestData.prodManager=obj.manager.value;
			// requestData.prodTrustee=obj.trustee.value;
			// requestData.prodTrusteeBank=obj.trustee_bank.value;
			// requestData.prodSubFareRate =obj.prod_sub_fare_rate;//?
			// requestData.minSubBalance=parseFloat(obj.min_sub_balance.value);
			// requestData.maxSubBalance=parseFloat(obj.max_sub_balance.value);
			// requestData.maxSubNum = parseFloat(obj.max_sub_num.value);
			// requestData.enEntrustType=this.getChecked(obj.en_entrust_type.list);
			// requestData.prodCodeCtrlstr = this.getChecked(obj.prod_code_ctrlstr.list);
			if(obj.build_begin_date.value != '' && obj.build_end_date.value != ''){
				// console.log(MIS.Util.dateDiff(obj.build_begin_date.value, obj.build_end_date.value))
				requestData.prodPeriod = MIS.Util.dateDiff(obj.build_begin_date.value, obj.build_end_date.value)
			}else{
				requestData.prodPeriod = parseInt(obj.prod_period.value);
			}
			requestData.investArea = parseInt(obj.invest_area.value());
			requestData.profitType = parseInt(obj.profit_type.value());
			// requestData.interestFreq = obj.interest_freq.value;
			// console.log(obj.interest_freq.list[obj.interest_freq.item.value].name)
			// requestData.interestFreq = obj.interest_freq.list[obj.interest_freq.item.value].name;
			// requestData.prodInterest = parseFloat(obj.prod_interest.value);
			// requestData.interestEndTime=obj.interest_end_time;//?
			// requestData.subUnit=parseFloat(obj.sub_unit.value);
			// requestData.issueTime = obj.issue_time.value;
			// requestData.personOpenShare=parseFloat(obj.person_open_share.value);
			// requestData.orgOpenShare=parseFloat(obj.org_open_share.value);
			// requestData.maxPdshare=parseFloat(obj.max_pdshare.value);
			// requestData.precisions=parseFloat(obj.precisions.value);
			// requestData.personMinSubBalance=parseFloat(obj.person_min_sub_balance.value);
			// requestData.personAppendSubBalance=parseFloat(obj.person_append_sub_balance.value);
			// requestData.personSumSubBalance=parseFloat(obj.person_sum_sub_balance.value);
			// requestData.orgMinSubBalance=parseFloat(obj.org_min_sub_balance.value);
			// requestData.orgAppendSubBalance=parseFloat(obj.org_append_sub_balance.value);
			// requestData.personMinAllotBalance=parseFloat(obj.person_min_allot_balance.value);
			// requestData.personAppendAllotBalance=parseFloat(obj.person_append_allot_balance.value);
			// requestData.orgMinAllotBalance = parseFloat(obj.org_min_allot_balance.value);
			// requestData.orgAppendAllotBalance = parseFloat(obj.org_append_allot_balance.value);
			// requestData.maxAllotRatio = parseFloat(obj.max_allot_ratio.value);
			// requestData.redeemUnit=parseFloat(obj.redeem_unit.value);
			// requestData.redeemMinShare=parseFloat(obj.redeem_min_share.value);
			// requestData.redeemAvailableFlag=obj.redeem_available_flag;//?
			requestData.backDays=parseFloat(obj.back_days.value);//?
			// requestData.enableQuota=parseFloat(obj.enable_quota.value);//?
			// requestData.enChangeCode=obj.en_change_code.value;
			// requestData.enSplitCode = obj.en_split_code.value;
			// requestData.minTransShare=parseFloat(obj.min_trans_share.value);
			// requestData.minMergeAmount=parseFloat(obj.min_merge_amount.value);
			// requestData.minSplitAmount=parseFloat(obj.min_split_amount.value);
			// requestData.nav=parseFloat(obj.nav.value);
			// requestData.navTotal=parseFloat(obj.nav_total.value);
			// requestData.perMyriadIncome=parseFloat(obj.per_myriad_income.value);
			// requestData.minAssetNeed=parseFloat(obj.min_asset_need.value);
			// requestData.switchUnit=parseFloat(obj.switch_unit.value);
			// requestData.fundChargeType=parseFloat(obj.fund_charge_type.value());
			// requestData.dividendType=parseFloat(obj.dividend_type.value());
			// requestData.minTimerBalance=parseFloat(obj.min_timer_balance.value);
			// requestData.maxTimerBalance=parseFloat(obj.max_timer_balance.value);
			// requestData.hugeRatio=parseFloat(obj.huge_ratio.value);
			// requestData.quotaValidTerm=parseFloat(obj.quota_valid_term.value);
			// requestData.inventoryMinAmount=parseFloat(obj.inventory_min_amount.value);
			requestData.yearDays=parseFloat(obj.year_days.value);//?
			// requestData.rebuyProperty=obj.rebuy_property ;//?
			// requestData.totalShare=obj.total_share;//?
			// requestData.totalAsset=obj.total_asset;//?
			// requestData.riskDesUrl=obj.risk_des_url.value;
			// requestData.sevenIncomeRatio=parseFloat(obj.seven_income_ratio.value);
			// requestData.modifyTime=obj.modify_time;
			// requestData.prodDetail = obj.prod_detail.value;
			// requestData.prodRiskMeasure = obj.prod_risk_measure.value;
	            requestData.prodContract="0";
				requestData.details = obj.details;
	            for(var i=0;i<requestData.details.length;i++)
	            {
	                if(requestData.details[i].prodInfo.trim()=="合同范本")
	                {
	                    requestData.prodContract="1";
	                    break;
	                }
	            }
			requestData.fares = obj.fares;
			// requestData.interestType = parseInt(obj.interest_type.value());
			requestData.interestType = parseInt(obj.interest_type.value());
			// requestData.profitPlatform = parseFloat(obj.profit_platform.value);

			requestData.issuedAt = obj.issuedAt.value?obj.issuedAt.value.replace(' ', 'T'):obj.issuedAt.value;
			return requestData;
		},
		validate: function(obj){
			//obj.value, obj.reg
			var result = true;
			var reg = obj.reg;
			
			if(reg == 'DATETIME'){
				result = obj.checked = MIS.Util.validationDateTime(obj.value);
			}else if(typeof(obj.value) == 'function'){
				if(!obj.required && !obj.value()){
					result = true;
                    obj.checked = true;
				}else if(reg.test(obj.value())){
                    result = true;
                    obj.checked = true;
                }else{
                    result = false;
                    obj.checked = false;
                }
            }else{
            	if(!obj.required && !obj.value){
            		result = true;
                    obj.checked = true;
            	}else if(reg.test(obj.value)){
                    result = true;
                    obj.checked = true;
                }else{
                    result = false;
                    obj.checked = false;
                }
            }
			
			return result;
		},
        randerCheckList:function(dictList, defaultCheck){
            var len = dictList.length;
            var list = [];
            if(len <= 0) return list;
            for(var i=0;i<len;i++){
                var obj = dictList[i];
                obj.checked = false;
                if(defaultCheck){
                	defaultCheck.forEach(function(defaultValue){
                		if(defaultValue == obj.value){
                			obj.checked = true;
                		}
                	})
                }
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
        },
        setChecked: function(checkedStr, list){
        	var checkedList = checkedStr.split(',');
        	for(var i=0;i<checkedList.length; i++){
        		var checkedValue = checkedList[i];
        		list.forEach(function(item){
        			if(item.value == checkedValue){
        				item.checked = true;
        			}
        		})
        	}
        	return list;
        },
        addFare: function(productFare){
        	this.productObj.fares.push(productFare);
        },
        removeFare: function(index){
        	this.productObj.fares.splice(index, 1);
        },
        checkDuplicateFare: function(){
        	var list = [];
        	var that = this;
        	var fareList = this.productObj.fares;
        	var len = fareList.length;
        	for(var i=0;i<len;i++){
        		for(var j=0;j<len;j++){
        			if(i != j){
        				if(fareList[i].fareMode == fareList[j].fareMode && fareList[i].fareType == fareList[j].fareType){
        					list.push(fareList[i]);
        				}
        			}
        		}
        	}
        	return list;
        },
        randerFares: function(responseObjList){
        	var that = this;
        	var list = [];
        	responseObjList.forEach(function(responseObj){
        		var fareItem = new MIS.ProductFare();
        		fareItem.randerResponseObj(responseObj);
        		list.push(fareItem.randerRequestData());
        	});
        	return list;

        },
	},{});


	MIS.ProductDetail = MIS.derive(null, {
		create: function(promise, $q, scope){
			this.prodInfo = "";
			this.prodDetail = "";
			this.attachedLists = [];
			this.promise = promise;
			this.$q = $q;
			this.scope = scope;
		},
		uploadFile: function(file, successFn, failedFn){
			//callback overwrite fileName fileUrl
			var that = this;
			var fData = new FormData();
			fData.append('uploadFile', file)
			this.promise({
				serverName: 'utilService',
				apiName:'upload',
				method: 'post',
				head: {
					'Content-Type': undefined
				},
				data: fData
			}).then(function(response){
				var errorCode = response.data['error'];
				if(errorCode == 0){
					var data = response.data['data'];
					that.attachedLists.push({
						fileName: data['fileName'],
						fileUrl: data['fileUrl'],
						thumbnail: data['thumbnailUrl'],
						fileTitle: data['fileTitle'],
					});
					successFn(data['thumbnailUrl']);
				}else{
					failedFn();
				}
			})
		},
		removeUploadFile: function(attachedItem){
			this.attachedLists.forEach(function(item, index){
				if(item.fileName == attachedItem.fileName){
					this.attachedLists.splice(index, 1);
				}
			})
		},
		randerRequestData: function(){
			var requestObj = {};
			requestObj.prodInfo = this.prodInfo;
			requestObj.prodDetail = this.prodDetail;
			requestObj.attacheds = [];
			var len = this.attachedLists.length;
			if(len>0){
				for(var i=0;i<this.attachedLists.length;i++){
					var item = this.attachedLists[i];
					requestObj.attacheds.push({
						fileName: item.fileName,
						fileUrl: item.fileUrl,
						thumbnailUrl: item.thumbnail,
						fileTitle: item.fileTitle
					})
				}
			}
			return requestObj;
		},
		randerResponseObj: function(responseObj){
			this.prodInfo = responseObj.prodInfo;
			this.prodDetail = responseObj.prodDetail;
			var that = this;
			responseObj.attacheds.forEach(function(attahced){
				that.attachedLists.push({
					fileName: attahced.fileName,
					fileUrl: attahced.fileUrl,
					thumbnail: attahced.thumbnailUrl,
					fileTitle: attahced.fileTitle
				})
			});
		},
	}, {});

	MIS.ProductFare = MIS.derive(null, {
		create:function(){
			this.fareMode ={
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
				list: MIS.dictData.fareMode,
				item: {},
				reg: /^.+$/,
				validateMsg: '收费模式未选择',
				checked: false,	
			};
			this.fareType = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
				list: MIS.dictData.fareType,
				item: {},
				reg: /^.+$/,
				validateMsg: '收费类型未选择',
				checked: false,		
			};
			this.fareMethod = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
				list: MIS.dictData.fareMethod,
				item: {},
				reg: /^.+$/,
				validateMsg: '收费类型未选择',
				checked: false,		
			};
			this.fareDivideSection = {
				value: function(){
                    if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
                },
				list: MIS.dictData.fareDivideSection,
				item: {},
				reg: /^.+$/,
				validateMsg: '分段级别未选择',
				checked: true,		
			};
			this.ratioFixedType = {
				value: function(){
					if(this.item.hasOwnProperty('value')){
                        return this.item.value;
                    }
                    else{
                        return '';
                    }
				},
				list: MIS.dictData.productRateType.list,
				item: {},
				reg: /^.+$/,
				validateMsg: '费率类型未选择',
				checked: true,	
			};
			this.fareRatio = "";
			this.fixedFare = "";
			this.maxFare = "";
		},
		showType: function(type){
			var result = '';
			this.fareType.list.forEach(function(item){
				if(item.value == type){
					result = item.name;
				}
			});
			return result
		},
		showMode: function(mode){
			var result = '';
			this.fareMode.list.forEach(function(item){
				if(item.value == mode){
					result = item.name;
				}
			});
			return result
		},
		randerRequestData: function(){
			var requestObj = {};
			requestObj.fareMode = parseInt(this.fareMode.value());
			requestObj.fareType = parseInt(this.fareType.value());
			requestObj.fareMethod = parseInt(this.fareMethod.value());
			// var fareRatio = this.fareRatio ? MIS.Util.toPercent(this.fareRatio) : null;
			var fareRatio = this.fareRatio ? parseFloat(this.fareRatio) : null;
			var fixedFare = this.fixedFare ? parseFloat(this.fixedFare) : null;
			var maxFare = this.maxFare ? parseFloat(this.maxFare) : null;
			var minInvest = parseInt(this.fareDivideSection.value());
			requestObj.fareRatio = isNaN(fareRatio)? null:fareRatio;
			requestObj.fixedFare = isNaN(fixedFare)? null:fixedFare;
			requestObj.minInvest = isNaN(minInvest)? null:minInvest;
			requestObj.maxFare = isNaN(maxFare)? null:maxFare;
			return requestObj;
		},
		randerResponseObj: function(responseObj){
			this.fareMode.item.value = responseObj.fareMode;
			this.fareMethod.item.value = responseObj.fareMethod;
			this.fareType.item.value = responseObj.fareType;
			this.ratioFixedType.item.value = responseObj.ratioFixedType;
			this.fareDivideSection.item.value = responseObj.minInvest;
			// this.fareRatio = MIS.Util.parsePercent(responseObj.fareRatio);
			this.fareRatio = responseObj.fareRatio;
			this.fixedFare = responseObj.fixedFare;
			this.maxFare = responseObj.maxFare;
		}
	}, {})

})()
