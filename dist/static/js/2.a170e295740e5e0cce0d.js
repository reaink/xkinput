webpackJsonp([2],{GOkW:function(t,s){},GfrP:function(module,__webpack_exports__,__webpack_require__){"use strict";var __WEBPACK_IMPORTED_MODULE_0_jquery__=__webpack_require__("7t+N"),__WEBPACK_IMPORTED_MODULE_0_jquery___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);__webpack_exports__.a={name:"Contribution",data:function(){return{vertion:"1.7",oldTerms:"",newsTerms:"",oldAttr:"请输入原词库\n格式： 词条 [tab] 编码",newAttr:"请输入新加词库\n格式： 编码 [tab] +/-/* [tab] 词条",btnClass:"btn my-2",btnInfo:"开始处理",outTerms:"",successInfo:"",errorInfo:"",oldTermsData:{},newsTermsData:{},newTermsData:"",successInfoData:"",errorInfoData:"",demoOldData:"剥壳\tblkeav\n静力学\tjlxhv\n动力学\taaaaa\n万夫\twfmk\n折子戏\tfzxki",demoNewData:"blkeav\t+\t剥壳\njlxhv\t-\t静力学\ndlxhva\t*\t动力学\nwfmk\t!m\t万夫莫开\nfzxki\t+\t折子",updates:!1,showMessageData:{cont:"",s:!1,e:!1,show:!1},historyArrow:">",isHover:!1}},methods:{handleTerms:function handleTerms(){this.TermsHandle("oldTermsData"),this.TermsHandle("newsTermsData");var wordNum=this.newsTermsData.obj.word.length,modifyNum=this.newsTermsData.obj.modify.length,codeNum=this.newsTermsData.obj.code.length;if(0!=wordNum+modifyNum+codeNum)if(wordNum==modifyNum&&modifyNum==codeNum&&wordNum==codeNum){var __this=this,thisNewData=this.newsTermsData.obj,thisOldData=this.oldTermsData.obj,reg,out,SuccessAll,ErrorAll,AddNum,ModifyNum,DelNum,ErrorNum,NoNum,ErrorAttr,SuccessAll=ErrorAll=AddNum=ModifyNum=DelNum=ErrorNum=NoNum=ErrorAttr=0;for(var y in thisOldData.word)this.newTermsData+=thisOldData.word[y]+"\t"+thisOldData.code[y]+"\r";for(var x in thisNewData.word)thisNewData.add[x]?(reg=new RegExp("[\\b\\u4e00-\\u9fa5\\b]+\\t\\b"+thisNewData.code[x]+"\\b","g"),out=thisNewData.word[x]+"\t"+thisNewData.code[x],-1==this.newTermsData.search(reg)?(this.newTermsData+=out+"\n",this.successInfoData+=out+"\t成功\t[ + 第"+(parseFloat(x)+1)+"行]\n",SuccessAll++,AddNum++):(this.errorInfoData+=out+"\t已有编码\t[ + 第"+(parseFloat(x)+1)+"行]\n",ErrorAll++,ErrorNum++)):thisNewData.modify[x]?(reg=new RegExp("[\\b\\u4e00-\\u9fa5\\b]+\\t\\b"+thisNewData.code[x]+"\\b","g"),out=thisNewData.word[x]+"\t"+thisNewData.code[x],-1!=this.newTermsData.search(reg)?(this.newTermsData=this.newTermsData.replace(reg,out),this.successInfoData+=out+"\t成功\t[ * 第"+(parseFloat(x)+1)+"行]\n",SuccessAll++,ModifyNum++):(this.errorInfoData+=out+"\t未找到编码\t[ * 第"+(parseFloat(x)+1)+"行]\n",ErrorAll++,NoNum++)):thisNewData.delete[x]?(reg=new RegExp("[\\b\\u4e00-\\u9fa5\\b]+\\t\\b"+thisNewData.code[x]+"\\b","g"),out=thisNewData.word[x]+"\t"+thisNewData.code[x],-1!=this.newTermsData.indexOf(thisNewData.code[x])?-1!=this.newTermsData.indexOf(thisNewData.word[x])?(this.newTermsData=this.newTermsData.replace(eval(reg),""),this.successInfoData+=out+"\t成功\t[ - 第"+(parseFloat(x)+1)+"行]\n",SuccessAll++,DelNum++):(this.errorInfoData+=out+"\t词组编码不同，已放弃删除\t[ - 第"+(parseFloat(x)+1)+"行]\n",ErrorAll++,NoNum++):(this.errorInfoData+=out+"\t未找到编码\t[ - 第"+(parseFloat(x)+1)+"行]\n",ErrorAll++,NoNum++)):(out=thisNewData.word[x]+"\t"+thisNewData.code[x],this.errorInfoData+=out+"\t未知操作符号\t[第"+(parseFloat(x)+1)+"行]\n",ErrorAll++,ErrorAttr++);this.successInfoData+="成功统计：\n共 "+SuccessAll+"个, 添加 "+AddNum+" 个,\n修改 "+ModifyNum+" 个, 删除 "+DelNum+" 个。\n",this.errorInfoData+="失败统计：\n共 "+ErrorAll+"个, 错误 "+ErrorNum+" 个,\n没找到 "+NoNum+" 个, 没操作符 "+ErrorAttr+" 个。\n",this.clearSpace(),this.successInfo=this.successInfoData,this.errorInfo=this.errorInfoData,this.outTerms=this.newTermsData,this.showMessage({show:!0,s:!0,cont:"处理完毕！共成功"+SuccessAll+"个、失败"+ErrorAll+"个！详细内容请看输出表格。"}),this.backHandingBtn(),this.successInfoData=this.errorInfoData=this.newTermsData=""}else this.showMessage({show:!0,e:!0,cont:"请检查新增表内容，编码"+codeNum+"个、操作符"+modifyNum+"个、词组"+wordNum+"个！"});else this.showMessage({show:!0,s:!0,cont:"工作表为空！"})},TermsHandle:function(t){for(var s in this.allToHalf(),this[t].test="newsTermsData"==t?this.newsTerms.split(/[\t\r\n]/g):this.oldTerms.split(/[\t\r\n]/g),this[t].add=[],this[t].obj={},this[t].obj.word=[],this[t].obj.code=[],this[t].obj.add=[],this[t].obj.modify=[],this[t].obj.delete=[],this[t].test){var e=/[\u4e00-\u9fa5]+/.test(this[t].test[s]),a=/\+|\-|\*/.test(this[t].test[s]),o=/[a-z]+/.test(this[t].test[s])&&/^[^\!]+/.test(this[t].test[s]);if(e)this[t].obj.word.push(this[t].test[s]);else if(a)switch(this[t].test[s]){case"+":this[t].obj.add.push(!0),this[t].obj.modify.push(!1),this[t].obj.delete.push(!1);break;case"*":this[t].obj.add.push(!1),this[t].obj.modify.push(!0),this[t].obj.delete.push(!1);break;case"-":this[t].obj.add.push(!1),this[t].obj.modify.push(!1),this[t].obj.delete.push(!0)}else o&&this[t].obj.code.push(this[t].test[s])}},createDemo:function(){this.oldTerms=this.demoOldData,this.newsTerms=this.demoNewData},clearContent:function(){this.oldTerms=this.newsTerms=this.outTerms=this.AkeyTerms=""},allToHalf:function(){this.newsTerms=this.newsTerms.replace(/\＋/g,"+"),this.newsTerms=this.newsTerms.replace(/\-/g,"-"),this.newsTerms=this.newsTerms.replace(/\!m|\！m|\！M|\!M|\＊/g,"*")},showMessage:function(t){this.showMessageData=t,this.closeMessge()},clickPlay:function(){this.btnInfo="处理中…",this.btnClass="btn btn-primary my-2"},clearSpace:function(){this.newTermsData=this.newTermsData.replace(/[\r\n]\s/g,"\r")},clickHistory:function(){this.updates=!this.updates,this.isHover=!this.isHover},closeMessge:function(t){var s=this;t?setTimeout(function(){s.showMessageData.show=!1},t):setTimeout(function(){s.showMessageData.show=!1},3e3)},backHandingBtn:function(){var t=this;setTimeout(function(){t.btnInfo="开始处理",t.btnClass="btn my-2"},500)},oldTermsInput:function(){this.oldTerms=this.oldTerms+="\t"},newsTermsInput:function(){this.newsTerms=this.newsTerms+="\t"},outTermsInput:function(){this.outTerms=this.outTerms+="\t"},AkeyTermsInput:function(){this.AkeyTerms=this.AkeyTerms+="\t"}}}},zyUd:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var a=e("GfrP"),o={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"container text-center"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-6 p-0"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.oldTerms,expression:"oldTerms"}],staticClass:"form-control position-relative",attrs:{cols:"30",rows:"8",placeholder:"词条 [tab] 编码"},domProps:{value:t.oldTerms,innerHTML:t._s(t.oldAttr)},on:{keydown:function(s){if(!("button"in s)&&t._k(s.keyCode,"tab",9,s.key))return null;s.preventDefault(),t.oldTermsInput(s)},input:function(s){s.target.composing||(t.oldTerms=s.target.value)}}}),t._v(" "),e("span",{staticClass:"position-absolute font-weight-light textarea-title"},[t._v("原词库数据")])]),t._v(" "),e("div",{staticClass:"col-6 p-0"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.newsTerms,expression:"newsTerms"}],staticClass:"form-control position-relative",attrs:{cols:"30",rows:"8",placeholder:"词条 [tab] 编码 [tab] +/-/m"},domProps:{value:t.newsTerms,innerHTML:t._s(t.newAttr)},on:{keydown:function(s){if(!("button"in s)&&t._k(s.keyCode,"tab",9,s.key))return null;s.preventDefault(),t.newsTermsInput(s)},input:function(s){s.target.composing||(t.newsTerms=s.target.value)}}}),t._v(" "),e("span",{staticClass:"position-absolute font-weight-light textarea-title"},[t._v("更正表数据")])]),t._v(" "),e("div",{staticClass:"col-4 p-0"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.outTerms,expression:"outTerms"}],staticClass:"form-control position-relative",attrs:{readonly:"",cols:"30",rows:"8",placeholder:"输出转换后内容"},domProps:{value:t.outTerms},on:{keydown:function(s){if(!("button"in s)&&t._k(s.keyCode,"tab",9,s.key))return null;s.preventDefault(),t.outTermsInput(s)},input:function(s){s.target.composing||(t.outTerms=s.target.value)}}}),t._v(" "),e("span",{staticClass:"position-absolute font-weight-light textarea-title"},[t._v("输出转换后内容")])]),t._v(" "),e("div",{staticClass:"col-4 p-0"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.successInfo,expression:"successInfo"}],staticClass:"form-control position-relative",attrs:{readonly:"",cols:"30",rows:"8",placeholder:"输出成功信息"},domProps:{value:t.successInfo},on:{input:function(s){s.target.composing||(t.successInfo=s.target.value)}}}),t._v(" "),e("span",{staticClass:"position-absolute font-weight-light textarea-title"},[t._v("输出成功信息")])]),t._v(" "),e("div",{staticClass:"col-4 p-0"},[e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.errorInfo,expression:"errorInfo"}],staticClass:"form-control position-relative",attrs:{readonly:"",cols:"30",rows:"8",placeholder:"输出错误信息"},domProps:{value:t.errorInfo},on:{input:function(s){s.target.composing||(t.errorInfo=s.target.value)}}}),t._v(" "),e("span",{staticClass:"position-absolute font-weight-light textarea-title"},[t._v("输出错误信息")])])]),t._v(" "),e("button",{class:t.btnClass,on:{click:t.handleTerms,mousedown:t.clickPlay}},[t._v(t._s(t.btnInfo))]),t._v(" "),e("button",{staticClass:"btn",on:{click:t.createDemo}},[t._v("测试内容")]),t._v(" "),e("button",{staticClass:"btn btn-danger",on:{click:t.clearContent}},[t._v("清空内容")]),t._v(" "),e("a",{staticClass:"btn btn-light",attrs:{href:"https://739497722.docs.qq.com/ipGva4mn5bo",target:"_black"}},[t._v("键道6加词")]),t._v(" "),e("p",{staticClass:"alert alert-secondary mb-1"},[t._v("申请表词库处理工具v"+t._s(t.vertion))]),t._v(" "),t._m(0),t._v(" "),e("div",{staticClass:"text-left bg-light p-1 mb-1 rounded fzx history-card",on:{click:t.clickHistory}},[e("p",[e("button",{staticClass:"btn"},[t._v("更新历史")]),e("i",{staticClass:"fa fa-arrow-right btn fzb float-right history-arrow",class:{"history-active":t.isHover}})]),t._v(" "),t.updates?e("div",{staticClass:"mt-1"},[e("p",[t._v("更新"+t._s(t.vertion)+"：新增查看编码所在行数，新增提示处理表的操作符 编码 词条的数量。")]),t._v(" "),e("p",[t._v("更新1.6.1：改进成功信息提示时间。")]),t._v(" "),e("p",[t._v("更新1.6：升级添加细节优化处理。")]),t._v(" "),e("p",[t._v("更新1.5：升级删除时确定编码词条才删除，改善提示内容。")]),t._v(" "),e("p",[t._v("更新1.4：修复主动修改!m为*的步骤错误问题。")]),t._v(" "),e("p",[t._v("更新1.3：使用*操作符作用主修改操作符，兼容!m修改符。")]),t._v(" "),e("p",[t._v("更新1.2：新增*操作符，等同于!m，自动解决，全角半角问题。")]),t._v(" "),e("p",[t._v("更新1.1：自动解决，全角半角问题。")]),t._v(" "),e("p",[t._v("更新1.0：正常使用，发布版本。")])]):t._e()]),t._v(" "),e("transition",{attrs:{name:"translateRotate"}},[t.showMessageData.show?e("div",{staticClass:"container alert fixed-top mt-5",class:{"alert-success":t.showMessageData.s,"alert-danger":t.showMessageData.e}},[t._v(t._s(t.showMessageData.cont))]):t._e()])],1)},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("p",{staticClass:"bg-light p-1 rounded mb-1"},[s("span",{staticClass:"d-block"},[this._v("转换后词组，顺序会错乱，可以使用BashShell中sort工具进行排序，也可以使用编写好的sh工具进行排序。"),s("a",{attrs:{href:"https://gitee.com/nmlixa/Rime_JD/tree/master/Tools/TermsTools",target:"_black"}},[this._v("工具1sortTerms.sh")])]),this._v(" "),s("span",[this._v("请注意！本工具不支持单字、英文（含英文）、重码、操作！！！修改后编码会出现混乱！")])])}]};var r=function(t){e("GOkW")},i=e("VU/8")(a.a,o,!1,r,null,null);s.default=i.exports}});
//# sourceMappingURL=2.a170e295740e5e0cce0d.js.map