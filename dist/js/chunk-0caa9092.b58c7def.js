(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0caa9092"],{1299:function(t,e,s){},"187a":function(t,e,s){"use strict";var a=s("fa4d"),i=s.n(a);i.a},"56b8":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"task-types page fixed-page"},[s("div",{staticClass:"level page-header"},[s("div",{staticClass:"level-left"},[s("page-title",{attrs:{text:t.$t("task_types.title")}})],1),s("div",{staticClass:"level-right"},[s("div",{staticClass:"level-item"},[s("button-link",{staticClass:"level-item",attrs:{icon:"plus",text:t.$t("task_types.new_task_type"),path:"/task-types/new"}})],1)])]),s("task-type-list",{attrs:{entries:t.taskTypes,"is-loading":t.loading.taskTypes,"is-error":t.errors.taskTypes}}),s("edit-task-type-modal",{attrs:{active:t.modals.isNewDisplayed,"is-loading":t.editTaskType.isLoading,"is-error":t.editTaskType.isError,"cancel-route":"/task-types","task-type-to-edit":t.taskTypeToEdit},on:{confirm:t.confirmEditTaskType}}),s("delete-modal",{attrs:{active:t.modals.isDeleteDisplayed,"is-loading":t.deleteTaskType.isLoading,"is-error":t.deleteTaskType.isError,"cancel-route":"/task-types",text:t.deleteText(),"error-text":t.$t("task_types.delete_error")},on:{confirm:t.confirmDeleteTaskType}})],1)},i=[],o=(s("7f7f"),s("cebc")),l=s("2f62"),n=s("e211"),r=s("5f48"),c=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{class:{modal:!0,"is-active":t.active}},[s("div",{staticClass:"modal-background"}),s("div",{staticClass:"modal-content"},[s("div",{staticClass:"box"},[t.isEditing()?s("h1",{staticClass:"title"},[t._v("\n        "+t._s(t.$t("task_types.edit_title"))+" "+t._s(t.taskTypeToEdit.name)+"\n      ")]):s("h1",{staticClass:"title"},[t._v("\n        "+t._s(t.$t("task_types.new_task_type"))+"\n      ")]),s("form",{on:{submit:function(t){t.preventDefault()}}},[s("text-field",{directives:[{name:"focus",rawName:"v-focus"}],ref:"nameField",attrs:{label:t.$t("task_types.fields.name")},on:{enter:t.confirmClicked},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}}),s("combobox",{attrs:{label:t.$t("task_types.fields.priority"),options:t.priorityOptions},on:{enter:t.confirmClicked},model:{value:t.form.priority,callback:function(e){t.$set(t.form,"priority",e)},expression:"form.priority"}}),s("combobox",{attrs:{label:t.$t("task_types.fields.dedicated_to"),options:t.dedicatedToOptions},on:{enter:t.confirmClicked},model:{value:t.form.for_shots,callback:function(e){t.$set(t.form,"for_shots",e)},expression:"form.for_shots"}}),s("combobox",{attrs:{label:t.$t("task_types.fields.allow_timelog"),options:t.allowTimelogOptions},on:{enter:t.confirmClicked},model:{value:t.form.allow_timelog,callback:function(e){t.$set(t.form,"allow_timelog",e)},expression:"form.allow_timelog"}}),s("color-field",{ref:"colorField",attrs:{label:t.$t("task_types.fields.color")},model:{value:t.form.color,callback:function(e){t.$set(t.form,"color",e)},expression:"form.color"}})],1),s("p",{staticClass:"has-text-right"},[s("a",{class:{button:!0,"is-primary":!0,"is-loading":t.isLoading},on:{click:t.confirmClicked}},[t._v("\n          "+t._s(t.$t("main.confirmation"))+"\n        ")]),s("router-link",{staticClass:"button is-link",attrs:{to:t.cancelRoute}},[t._v("\n          "+t._s(t.$t("main.cancel"))+"\n        ")])],1)])])])},d=[],p=s("7bf8"),y=s("992f"),f=s("f865"),m=s("3657"),u={name:"edit-task-type-modal",components:{Combobox:y["a"],TextField:p["a"],ColorField:f["a"]},props:["onConfirmClicked","text","active","cancelRoute","isLoading","isError","errorText","taskTypeToEdit"],watch:{taskTypeToEdit:function(){this.taskTypeToEdit&&(this.form={name:this.taskTypeToEdit.name,color:this.taskTypeToEdit.color,priority:String(this.taskTypeToEdit.priority),for_shots:String(this.taskTypeToEdit.for_shots),allow_timelog:String(this.taskTypeToEdit.allow_timelog||"true")})}},data:function(){return{form:{name:"",color:"$grey999",priority:"",for_shots:"false",allow_timelog:"false"},priorityOptions:Object(m["f"])(1,100).map(function(t){return{label:"".concat(t),value:"".concat(t)}}),dedicatedToOptions:[{label:this.$t("assets.title"),value:"false"},{label:this.$t("shots.title"),value:"true"}],allowTimelogOptions:[{label:this.$t("main.yes"),value:"true"},{label:this.$t("main.no"),value:"false"}]}},computed:Object(o["a"])({},Object(l["c"])(["taskTypes","taskTypeStatusOptions"])),methods:Object(o["a"])({},Object(l["b"])([]),{confirmClicked:function(){this.$emit("confirm",this.form)},isEditing:function(){return this.taskTypeToEdit&&this.taskTypeToEdit.id}})},k=u,T=(s("6302"),s("2877")),h=Object(T["a"])(k,c,d,!1,null,"7b7dc104",null),_=h.exports,b=s("8d07"),v=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"data-list"},[s("div",{staticStyle:{overflow:"hidden"}},[s("table",{ref:"headerWrapper",staticClass:"table table-header"},[s("thead",[s("tr",[s("th",{staticClass:"name"},[t._v(t._s(t.$t("task_types.fields.name")))]),s("th",{staticClass:"priority"},[t._v(t._s(t.$t("task_types.fields.priority")))]),s("th",{staticClass:"allow-timelog"},[t._v("\n            "+t._s(t.$t("task_types.fields.allow_timelog"))+"\n          ")]),s("th",{staticClass:"actions"})])])])]),s("table-info",{attrs:{"is-loading":t.isLoading,"is-error":t.isError}}),s("div",{directives:[{name:"scroll",rawName:"v-scroll",value:t.onBodyScroll,expression:"onBodyScroll"}],staticClass:"table-body"},[s("table",{staticClass:"table splitted-table"},[s("tbody",[s("tr",{staticClass:"type-header"},[s("td",{attrs:{colspan:"30"}},[t._v("\n            "+t._s(t.$t("assets.title"))+"\n          ")])]),t._l(t.assetTaskTypes,function(e){return s("tr",{key:e.id},[s("task-type-name",{staticClass:"name",attrs:{entry:e}}),s("td",{staticClass:"priority"},[t._v(t._s(e.priority))]),s("td",{staticClass:"allow-timelog"},[t._v("\n            "+t._s(e.allow_timelog?t.$t("main.yes"):t.$t("main.no"))+"\n          ")]),s("row-actions",{attrs:{"taskType-id":e.id,"edit-route":{name:"edit-task-type",params:{task_type_id:e.id}},"delete-route":{name:"delete-task-type",params:{task_type_id:e.id}}}})],1)})],2)]),s("table",{staticClass:"table splitted-table"},[s("tbody",[s("tr",{staticClass:"type-header"},[s("td",{attrs:{colspan:"30"}},[t._v("\n            "+t._s(t.$t("shots.title"))+"\n          ")])]),t._l(t.shotTaskTypes,function(e){return s("tr",{key:e.id},[s("task-type-name",{staticClass:"name",attrs:{entry:e}}),s("td",{staticClass:"priority"},[t._v(t._s(e.priority))]),s("td",{staticClass:"allow-timelog"},[t._v("\n            "+t._s(e.allow_timelog?t.$t("main.yes"):t.$t("main.no"))+"\n          ")]),s("row-actions",{attrs:{"taskType-id":e.id,"edit-route":{name:"edit-task-type",params:{task_type_id:e.id}},"delete-route":{name:"delete-task-type",params:{task_type_id:e.id}}}})],1)})],2)])]),s("p",{staticClass:"has-text-centered nb-task-types"},[t._v("\n    "+t._s(t.entries.length)+" "+t._s(t.$tc("task_types.number",t.entries.length))+"\n  ")])],1)},g=[],C=(s("ac6a"),s("03b1")),$=s("e60b"),w=s("58f5"),x={name:"task-type-list",props:["entries","isLoading","isError"],data:function(){return{}},components:{RowActions:C["a"],TableInfo:$["a"],TaskTypeName:w["a"]},computed:Object(o["a"])({},Object(l["c"])([]),{assetTaskTypes:function(){return this.entries.filter(function(t){return!t.for_shots})},shotTaskTypes:function(){return this.entries.filter(function(t){return t.for_shots})}}),methods:Object(o["a"])({},Object(l["b"])([]),{onBodyScroll:function(t,e){this.$refs.headerWrapper.style.left="-".concat(e.scrollLeft,"px")}})},E=x,O=(s("187a"),Object(T["a"])(E,v,g,!1,null,"641d2a32",null)),D=O.exports,j={name:"task-types",components:{ButtonLink:n["a"],DeleteModal:r["a"],EditTaskTypeModal:_,PageTitle:b["a"],TaskTypeList:D},data:function(){return{errors:{taskTypes:!1},loading:{taskTypes:!1},modals:{isNewDisplayed:!1,isDeleteDisplayed:!1},taskTypeToDelete:null,taskTypeToEdit:null}},computed:Object(o["a"])({},Object(l["c"])(["editTaskType","deleteTaskType","getTaskType","taskTypes"])),mounted:function(){var t=this;this.loading.taskTypes=!0,this.errors.taskTypes=!1,this.loadTaskTypes(function(e){e?t.errors.taskTypes=!0:t.handleModalsDisplay(),t.loading.taskTypes=!1})},methods:Object(o["a"])({},Object(l["b"])(["loadTaskTypes"]),{confirmEditTaskType:function(t){var e=this,s="newTaskType";this.taskTypeToEdit&&this.taskTypeToEdit.id&&(s="editTaskType",t.id=this.taskTypeToEdit.id),this.$store.dispatch(s,{data:t,callback:function(t){t||(e.modals.isNewDisplayed=!1,e.$router.push("/task-types"))}})},confirmDeleteTaskType:function(){var t=this;this.$store.dispatch("deleteTaskType",{taskType:this.taskTypeToDelete,callback:function(e){e||(t.modals.isDeleteDisplayed=!1)}})},deleteText:function(){var t=this.taskTypeToDelete;return t?this.$t("task_types.delete_text",{name:t.name}):""},handleModalsDisplay:function(){var t=this.$store.state.route.path,e=this.$store.state.route.params.task_type_id;t.indexOf("new")>0?(this.taskTypeToEdit={color:"#999999"},this.modals.isNewDisplayed=!0):t.indexOf("edit")>0?(this.taskTypeToEdit=this.getTaskType(e),this.modals.isNewDisplayed=!0):t.indexOf("delete")>0?(this.taskTypeToDelete=this.getTaskType(e),this.modals.isDeleteDisplayed=!0):(this.modals.isNewDisplayed=!1,this.modals.isDeleteDisplayed=!1)}}),watch:{$route:function(){this.handleModalsDisplay()}},metaInfo:function(){return{title:"".concat(this.$t("task_types.title")," - Kitsu")}}},B=j,S=Object(T["a"])(B,a,i,!1,null,"157f152e",null);e["default"]=S.exports},"59a3":function(t,e,s){},6302:function(t,e,s){"use strict";var a=s("59a3"),i=s.n(a);i.a},edc6:function(t,e,s){"use strict";var a=s("1299"),i=s.n(a);i.a},f865:function(t,e,s){"use strict";var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"field"},[s("label",{staticClass:"label"},[t._v(t._s(t.label))]),s("div",{staticClass:"control colors"},t._l(t.colors,function(e,a){return s("div",{key:"color-"+a,ref:"color-"+a,refInFor:!0,class:{color:!0,selected:t.value===e},on:{click:function(s){return t.colorChanged(e)}}},[s("span",{style:{background:e}})])}),0)])},i=[],o=s("cebc"),l=s("2f62"),n={name:"text-field",props:{label:{default:"",type:String},value:{default:"$grey999",type:String},placeholder:{default:"",type:String},type:{default:"text",type:String},colors:{default:function(){return["#999999","#8D6E63","#43A047","#7CB342","#009688","#9CCC65","#AFB42B","#F9A825","#F57C00","#ff5252","#F06292","#AB47BC","#5C6BC0","#039BE5","#26C6DA","#64B5F6","#78909C"]}}},data:function(){return{selectedColor:"$grey999"}},computed:Object(o["a"])({},Object(l["c"])([])),methods:Object(o["a"])({},Object(l["b"])([]),{colorChanged:function(t,e){this.$emit("input",t)}})},r=n,c=(s("edc6"),s("2877")),d=Object(c["a"])(r,a,i,!1,null,"69fc363c",null);e["a"]=d.exports},fa4d:function(t,e,s){}}]);
//# sourceMappingURL=chunk-0caa9092.b58c7def.js.map