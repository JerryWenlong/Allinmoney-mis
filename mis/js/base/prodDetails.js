(function(angular){
    'use strict';

    angular.module( 'proddetails', [] ).directive('proddetails',[function(){
        var tpl = '<div><div class="prodDetailPageTitleRow">'+
        '<ul>'+
            '<li ng-repeat="div in productDetailList" ng-class=\'div.actived ? "divActive" : "titleList"\'>'+
                '<div ng-click="showContent()" class="titleContent">{{div.prodInfo? div.prodInfo : "标签"}}</div>'+
                '<div><button ng-click="closeDiv()" class="closeBtn">X</button></div>'+
            '</li>'+
        '</ul>'+
        '<button style="float:left;border:1px solid #CDCDCD;border-radius:3px;color:#2893ee;font-size:26px;display:block;height:52px;margin:0" ng-click="addDiv()" >+</button></div>'+
        '<div id="prodDetailContent" class="prodDetailContent">'+
        '<ul ng-repeat="contentDiv in productDetailList" ng-show="contentDiv.actived">'+
            '<li><label>介绍标题</label><input ng-model="contentDiv.prodInfo" type="text"/></li>'+
            '<li><label>介绍详情</label><textarea ng-disabled="contentDiv.prodInfo == \'\'" ng-model="contentDiv.prodDetail"></textarea></li>'+
            '<li><label>附件</label></li>'+
            '<li style="padding-left:80px;"><div style="height:330px;overflow:auto">'+
                '<ul class="attachList" >'+
                    '<li ng-repeat="attach in contentDiv.attachedLists">'+
                        '<div style="position:relative;display:inline-block;width:100%;height:100px;float:left" class="img-cover">'+
                            '<div style="position:absolute">'+
                                '<img ng-click="enlarge(attach)" src="{{attach.thumbnail}}" alt="{{attach.fileName}}">' +
                                '<span><s ng-click="delImg()"></s></span>' +
                            '</div>'+
                        '</div>'+
                        '<div style="display:inline-block;width:100%;height:50px;line-height:50px;text-align:center">'+
                            '<input type="text" ng-model="attach.fileTitle" style="width:100px;"/>' +
                        '</div>'+
                    '</li>'+
                    '<li>'+
                        '<div style="position:relative;height:90px;width:calc(100% - 10px);border-radius: 3px;border:5px dashed #E7E7E7;">'+
                            '<div class="plus"></div>'+
                            '<input ng-disabled="contentDiv.prodInfo == \'\'"  style="opacity:0;margin:0;padding:0;position:absolute;height:100%;width:100%;" type="file" file-model get-file="getFile" />'+
                    '</li>'+
                '</ul>'+
            '</div>'+
        '</ul>'+
        '</div></div>';
        
    return {
        scope: {
            productDetailList: '=productDetailList',
            createDetail: '=createDetail',
        },
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: tpl,
        replace: true,
        link: function(scope, element, attrs, ngModelCtrl) {
            // if($scope.divList.length>0){
            //  $scope.divList[0].actived = true;
            // }
            scope.productDetailList[0].actived = true;
            scope.current = scope.productDetailList[0];
            scope.showContent = function(){
                var div = scope.current = this.div;
                var divIndex = scope.productDetailList.indexOf(div);
                scope.productDetailList[divIndex].actived = true;

                var divListLen = scope.productDetailList.length;
                for(var i=0;i<divListLen;i++){
                    if(i!=divIndex){
                        scope.productDetailList[i].actived = false;
                    }
                }
            }
            scope.enlarge = function(obj){
                var popWindow = new MIS.Popup({
                w: 800,
                h: 600,
                coverCls: 'fundAuditCover',
                title: {
                    notShow: true
                },
                contentList:[
                    [
                        {
                            tag: 'div',
                            clickEvt: function(){
                                popWindow.close()
                            },
                            attr: {
                                innerHTML: '<p><img src="' + obj.fileUrl + '" /></p>',
                                class: 'prodDetailPopupImgDiv'
                            }
                        }
                    ]
                ]
            })
            }
            scope.closeDiv = function(){
                var div = this.div;
                var divIndex = scope.productDetailList.indexOf(div);
                scope.productDetailList.splice(divIndex,1);
                var divListLen = scope.productDetailList.length;

                for(var i=0;i<divListLen;i++){
                    if(i!=divListLen-1){
                        scope.productDetailList[i].actived = false;
                    }else{
                        scope.productDetailList[i].actived = true;
                        scope.current = scope.productDetailList[i];
                    }
                }
            }
            scope.addDiv = function(){
                var divObj = scope.createDetail();
                scope.productDetailList.push(divObj);
                var divListLen = scope.productDetailList.length;
                for(var i=0;i<divListLen;i++){
                    scope.productDetailList[i].actived = false;
                }
                divObj.actived = true;//set current active
                scope.current = divObj;
            };
            scope.getFile = function(file){
                scope.current.uploadFile(file, function(){
                    // upload success
                }, function(){
                    // upload file error
                })
            };
            scope.delImg = function(){
                var currentImgObj = this.attach;
                var currentImgIndex = scope.current.attachedLists.indexOf(currentImgObj);
                scope.current.attachedLists.splice(currentImgIndex,1);
            }

        }
    };
}])

})(angular)