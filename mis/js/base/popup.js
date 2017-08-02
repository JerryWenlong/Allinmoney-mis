(function(){
    'use strict'
    MIS.popupWindow = MIS.popupWindow || [];

    MIS.DiyWindow = MIS.derive(null, {
        create: function(params){
            this.content = params.content;
            this.root = params.root? params.root : document.getElementsByTagName('body')[0];
            this.createCover();
            this.show();
        },
        createCover:　function(){
            var that = this;
            var coverDiv = that.coverDiv = document.createElement('div');
            coverDiv.setAttribute('class', 'misPopupCover'); 
            coverDiv.style.height = '100%';//window.innerHeight + 'px';
            coverDiv.style.width = '100%';//window.innerWidth + 'px';
            this.root.appendChild(coverDiv);
        },
        show:function(){
            var that = this;
            var myDiv = that.myDiv = document.createElement('div');
            myDiv.innerHTML = this.content;
            // var divMarginLeft = '-' + that.width / 2;
            // var divMarginTop = '-' + that.height / 2;
            // myDiv.style.width = that.width + 'px';
            // myDiv.style.height = that.height + 'px';
            // myDiv.style.marginLeft = divMarginLeft + 'px';
            // myDiv.style.marginTop = divMarginTop + 'px';
            this.root.appendChild(myDiv);
            MIS.popupWindow.push(this);
        },
        close: function(){
            if(MIS.popupWindow && MIS.popupWindow.length > 0){
                for (var i=MIS.popupWindow.length; i>0;i--){
                    var popup = MIS.popupWindow[i-1];
                    popup.root.removeChild(popup.coverDiv);
                    popup.root.removeChild(popup.myDiv);
                    MIS.popupWindow.pop(popup);
                }
            }
        }
    }, {})

    MIS.Popup = MIS.derive(null, {
        //options
        create:function(params,scope,compile){
            this.compile = compile;
            this.scope = scope;
            this.root = params.root? params.root : document.getElementsByTagName('body')[0];
            this.height = params.h;
            this.width = params.w;
            this.title = params.title;
            this.coverCls = params.coverCls;
            this.contentList = params.contentList;
            this.cls = params.cls;
            if(!params.notShow){
                this.popup();
            }
        },
        close:function(){
            if(MIS.popupWindow && MIS.popupWindow.length > 0){
                for (var i=MIS.popupWindow.length; i>0;i--){
                    var popup = MIS.popupWindow[i-1];
                    popup.root.removeChild(popup.coverDiv);
                    popup.root.removeChild(popup.myDiv);
                    MIS.popupWindow.pop(popup);
                }
            }
        },
        popup:function() {
            var that = this;
            that.close();
            var myDiv = that.myDiv = document.createElement('div');
            var coverDiv = that.coverDiv = document.createElement('div');
            if(that.coverCls){
                coverDiv.setAttribute('class',that.coverCls);
            }else{
                coverDiv.setAttribute('class', 'misPopupCover');
            }
            if(that.contentList){
                if(that.cls){
                    myDiv.setAttribute('class',that.cls);
                }else{
                    myDiv.setAttribute('class','misPopup');
                }
                var contentLength = that.contentList.length;
                var titleContent = "";
                
                var titleDiv = document.createElement('div');
                var titleObj = document.createElement('div');
                var titleObjHeight = "35px";
                titleObj.setAttribute('class', 'misPopupHeader');
                titleDiv.setAttribute('class', 'titleDiv')
                if(that.title){
                    if(that.title.class){
                        titleObj.setAttribute('class', that.title.class)
                    }
                    if(that.title.notShow){
                        titleDiv.style.display = 'none';
                    }else{
                        titleDiv.style.display = 'inline-block';
                    }
                    if(that.title.height){
                        titleObjHeight = that.title.height;
                    }
                    if(that.title.txt){
                        titleContent = that.title.txt;
                    }
                    if(that.title.attr){
                        var ttAttr = that.title.attr;
                        for(var t in ttAttr){
                            titleObj.setAttribute(t,ttAttr[t]);
                        }
                    }
                    if(that.title.titleDivCls){
                        titleDiv.setAttribute('class', that.title.titleDivCls)
                    }
                }
                titleObj.style.position = 'absolute';
                titleObj.style.width = '100%';
                titleObj.style.height = titleObjHeight;
                titleObj.style.lineHeight = titleObjHeight;
                titleDiv.style.width = that.width + 'px';
                titleDiv.style.height = titleObjHeight;
                
                titleObj.innerHTML = titleContent;
                titleDiv.appendChild(titleObj);
                var closeDivObj = document.createElement('div');
                var closeBtnObj = document.createElement('button');
                closeDivObj.setAttribute('class', 'closeDiv')

                closeBtnObj.setAttribute('class', 'closeDivBtn')
                MIS.Util.bind(closeBtnObj, 'click', that.close);
                
                closeDivObj.appendChild(closeBtnObj);
                titleDiv.appendChild(closeDivObj);
                myDiv.appendChild(titleDiv);

                var ulObj = that.ulObj = document.createElement('ul');
                for(var i=0;i<contentLength;i++){
                    var liObj = that.liObj = document.createElement('li');
                    var lineObj = that.contentList[i];
                    var lineLen = lineObj.length;
                    for(var j=0;j<lineLen;j++){
                        var eleTag = lineObj[j];
                        var eleObj = document.createElement(eleTag.tag);
                        if(eleTag.tag == 'self'){
                            eleObj = liObj;
                        }
                        if(eleTag.attr){
                            var attrObj = eleTag.attr;
                            for(var k in attrObj){
                                if(k == 'innerHTML'){
                                    if(MIS.Util.isArray(attrObj[k])){
                                        var htmlStr = ""
                                        for(var i=0;i<attrObj[k].length;i++){
                                            var obj = attrObj[k][i];
                                            for(var j in obj){
                                                htmlStr += "<li>" +obj[j] +"</li>"
                                            }
                                        }
                                        eleObj.innerHTML = htmlStr;
                                    }else{
                                        eleObj.innerHTML = attrObj[k].toString();
                                    }
                                }else{
                                    eleObj.setAttribute(k, attrObj[k])
                                }
                            }
                        }
                        if(eleTag.clickEvt){
                            MIS.Util.bind(eleObj, 'click', eleTag.clickEvt);
                        }
                        if((eleTag.tag == 'button' && !eleTag.attr.class) || (eleTag.tag == 'input' && eleTag.attr && eleTag.attr.type == 'button' && !eleTag.attr.class)){
                            eleObj.setAttribute('class', 'misPopupBtn');
                        }
                        if(eleTag.datetime){
                            var dtObj = eleTag.datetime
                            eleObj.setAttribute('my-datetime','')
                            if(dtObj.datetimeId){
                                eleObj.setAttribute('datetime-id',dtObj.datetimeId)
                            }
                            if(dtObj.datetimeModel){
                                eleObj.setAttribute('datetime-model',dtObj.datetimeModel)
                            }
                            if(dtObj.datetimeValue){
                                eleObj.setAttribute('datetime-value',dtObj.datetimeValue)
                            }
                            if(dtObj.datetimeCallback){
                                eleObj.setAttribute('datetime-callback',dtObj.datetimeCallback)
                            }
                            if(dtObj.hasTime){
                                eleObj.setAttribute('has-time',dtObj.hasTime)
                            }
                        }
                        for(var key in eleTag){
                            if(key.match(/^ng[A-Z]/)){
                                var valueObj = eleTag[key]
                                var keyChar = key.split("")
                                var angularAttrName = ""
                                for(var kIndex=2;kIndex<keyChar.length;kIndex++){
                                    angularAttrName += keyChar[kIndex].toLowerCase()
                                }
                                angularAttrName = "ng-" + angularAttrName
                                eleObj.setAttribute(angularAttrName, eleTag[key])
                            }
                        }
                        if(eleTag.tag == 'self'){
                            
                        }else{
                            liObj.appendChild(eleObj);
                        }
                    }
                    ulObj.appendChild(liObj);
                }
                if(that.compile && that.scope){
                    var TempStr = that.compile(ulObj)(that.scope)
                    myDiv.appendChild(TempStr[0]);
                }else{
                    myDiv.appendChild(ulObj);
                }
            }else{
                myDiv.setAttribute('class','misPopupLoading');
                if(that.loadingTxt){
                    myDiv.innerHTML = that.loadingTxt;
                }
            }
            
            
            myDiv.style.width = that.width + 'px';
            myDiv.style.height = that.height + 'px';
            // myDiv.style.display = 'none';
            coverDiv.style.height = '100%';//window.innerHeight + 'px';
            coverDiv.style.width = '100%';//window.innerWidth + 'px';
            this.root.appendChild(coverDiv);
            this.root.appendChild(myDiv);

            var divMarginLeft = '-' + myDiv.offsetWidth / 2;
            var divMarginTop = '-' + myDiv.offsetHeight / 2;
            myDiv.style.marginLeft = divMarginLeft + 'px';
            myDiv.style.marginTop = divMarginTop + 'px';

            // myDiv.style.display = 'block';
            MIS.popupWindow.push(this);
        }
    },{
        close:function(){
            if(MIS.popupWindow1 && MIS.popupWindow.length > 0){
                for (var i=MIS.popupWindow.length; i>0;i--){
                    var popup = MIS.popupWindow[i-1];
                    popup.root.removeChild(popup.coverDiv);
                    popup.root.removeChild(popup.myDiv);
                    MIS.popupWindow.pop(popup);
                }
            }
        }
    });


    
})()
