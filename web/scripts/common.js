  function completeAutoSuggest(type,id,value,svc){
    dom.el("search_param").value=value;
    dom.el("search_param").attr("current_id",id);
    dom.el("auto_suggest").style.display="none";
    var json={
                 request_header : {
                     request_msg : "complete_auto_suggest",
                     request_svc :svc
                  },
                  request_object : {  
                    type : type,
                    id : id
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch field values");
                  },
                  success : function(json){
                    finishAutoSuggest(json,type);
                } 
          }); 
  }
  
  
function cloneArray(arr){
  var clone=[];
  for(var x=0; x<arr.length; x++){
    clone[x]=arr[x];
  }
  return clone;
}
  
    
  function autoSuggest(svc){
    var input=dom.el("search_param");
    if(input.value.trim()===""){
       return;
    }
    var fieldName=ui.dropdown.getSelected("search_filter").replace(/ /g,"_");
    var type=input.getAttribute("search_type");
    var json={
               request_header : {
                     request_msg : "auto_suggest",
                     request_svc :svc
                  },
                  request_object : { 
                    field_name : fieldName,
                    like : input.value,
                    type : type
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch data");
                  },
                  success : function(json){ 
                    var resp=json.response.data;
                    var values=resp[fieldName];
                    var ids=resp["ID"];
                    dom.el("auto_suggest").innerHTML="";
                    for(var x=0; x<values.length; x++){
                      var li=ui.element({
                            tag : "li",
                            parent : "auto_suggest"
                        });
                      ui.element({
                       tag : "a",
                       parent : li,
                       href : "#",
                       onclick : "javascript:completeAutoSuggest(\""+type+"\",\""+ids[x]+"\",\""+values[x]+"\",\""+svc+"\")",
                       content : values[x]
                    });
                    ui.element({
                       tag : "li",
                       "class" :"divider",
                       parent : "auto_suggest"
                    });
                  }
                  if(values.length>0){
                      dom.el("auto_suggest").style.display="block";
                  }
                } 
          }); 
  }
  
  function finishAutoSuggest(json,type){
    var resp=json.response.data.data;
    var relations=json.response.data.relation;
    var key=json.response.data.key;
    if(type==="student"){
        finishStudentAutoSuggest(resp);
    }
    else if(type==="exam"){
        finishExamAutoSuggest(resp);   
    }
    else{
        if(type==="teacher"){
           key="SUBJECT_NAME"; //Special case for teachers since we need to know subjects taught and streams
        }
        var names=allFields["FIELD_NAME"];
        for(var x=0; x<names.length; x++){
            var name=names[x].replace(/ /g,"_"); 
            var value=resp[name][0];
            dom.el("student_display_text"+x).value=value;
     } 
     var relationDiv=document.getElementById("relation_display_area");
     if(relationDiv){
       relationDiv.innerHTML="";  
     }
     else{
        var div=dom.newEl("div");
        relationDiv=div;
        div.attr("id","relation_display_area");
        dom.el("main-view-display").add(div);
     }
        var h3=dom.newEl("h3");
        var header="";
        if(type==="teacher"){
           header="Subjects Taught"; 
        }
        else if(type==="class"){
           header="Streams in Class";
        }
        else if(type==="subject"){
           header="Papers under Subject";
        }
        else if(type==="stream"){
           header="Subjects in Stream";
        }
        h3.innerHTML=header;
        relationDiv.add(h3);
       for(var x=0; x<relations[key].length; x++){
         div=dom.el("relation_display_area");
         var div1=dom.newEl("div");
         if(type==="teacher"){
            //we need this because we display two items for teachers
            //the subject and where it is taught
            div1.innerHTML=relations[key][x]+"  -  "+relations.STREAM_NAME[x]; 
         }
         else{
            div1.innerHTML=relations[key][x]; 
         }
         
         var id=relations.ID[x];
         CloseDiv(div1,"relation_display_area","confirmRemoveChildOfObject('"+type+"')","removeChildOfObject('"+type+"','"+id+"','"+resp.ID[0]+"')");
     }
     
     //special case populate the privileges of the teacher
     if(type === "teacher"){
        var teacherPrivHeader=dom.newEl("h3");
        teacherPrivHeader.innerHTML = "Teacher Privileges";
        relationDiv.add(teacherPrivHeader);
        var teacherPrivs = Object.keys(json.response.data.teacher_privs);
        for(var x=0; x<teacherPrivs.length; x++){
            var div1=dom.newEl("div");
            var index = privilegeKeys.indexOf(teacherPrivs[x]);
            if(index === -1){
                continue;
            }
            div1.innerHTML = privileges[index];
            CloseDiv(div1,"relation_display_area","confirmRemoveChildOfObject('"+type+"')","removeTeacherPrivilege('"+teacherPrivs[x]+"','"+resp.ID[0]+"')");
        }
     }
    }
  }
  
  function confirmRemoveChildOfObject(type){
     var conf=confirm("Remove this child object from "+type+" ");
     if(!conf){
         return false;
     } 
     return true;
  }
  
  function removeTeacherPrivilege(priv,teacherId){
   var json={
                 request_header : {
                     request_msg : "remove_teacher_privilege",
                     request_svc : "student_service"
                  },
                  request_object : {
                    priv_name : priv,
                    teacher_id : teacherId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to remove teacher privilege");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Privilege removed successfully"); 
                    }
                } 
          });     
  }
  
  function removeChildOfObject(type,id,parentId){
     var json={
                 request_header : {
                     request_msg : "remove_child_object",
                     request_svc : "student_service"
                  },
                  request_object : {
                    type : type,
                    id : id,
                    parent_id : parentId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to remove child of "+type+"");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Child object removed successfully"); 
                    }
                } 
          });  
  }
  
  function finishStudentAutoSuggest(resp){
     if(!allFields){
        return; 
     }
     var names=allFields["FIELD_NAME"];
     for(var x=0; x<names.length; x++){
        var name=names[x].replace(/ /g,"_"); 
        var value=resp[name][0];
        if(name==="STUDENT_NAME"){
           var nameArea=dom.el("student_name_text");
           if(nameArea){
              nameArea.value=value; 
           }
           else{
              return;
           }
        }
        else if(name==="STUDENT_CLASS"){
          var className=allClasses.CLASS_NAME[allClasses.ID.indexOf(value)];
          dom.el("student_class_select").value=className;
        }
        else if(name==="STUDENT_STREAM"){
           dom.el("student_stream_select").value=value; 
           if(value===""){
              dom.el("student_class_select").value="This is an archived record"; 
           }
        }
        else{
         dom.el("student_display_text"+x).value=value;   
        }
        
     }
  }
  
    function finishExamAutoSuggest(resp){
     var names=allFields["FIELD_NAME"];
     for(var x=0; x<names.length; x++){
        var name=names[x].replace(/ /g,"_"); 
        var value=resp[name][0];
        dom.el("student_display_text"+x).value=value;   
     }
  }
  
  
 function CloseDiv(el,areaId,funcBefore,funcAfter){
    var div=dom.newEl("div");
    var otherId=Math.floor((Math.random()*100000000));
    var id=new Date().getTime()+"_"+otherId;
    div.attr("id",id);
    div.style.border="2px solid #90DBF4";
    div.style.padding="10px";
    div.style.margin="10px";
    var button=dom.newEl("button");
    button.attr("class","close");
    button.innerHTML="&times";
    button.attr("onclick","javascript:closeDiv(\""+id+"\",\""+areaId+"\",\""+funcBefore+"\",\""+funcAfter+"\")");
    div.appendChild(button);
    div.appendChild(el);
    var area=dom.el(areaId);
    if(area){
      area.add(div);    
    }  
    return id;
  }
    
  function closeDiv(id,areaId,funcBefore,funcAfter){
    var returned=true;
    if(funcBefore){
      returned=eval(funcBefore);
    }
    if(funcBefore==="null" || funcBefore==="undefined" || returned){
      var area=dom.el(areaId);
      var el=dom.el(id);
      area.removeChild(el); 
    }
    if(funcAfter){
      funcAfter=eval(funcAfter);  
    }
  }
  
  
 
   
  function displayViewFields(json,form,buttonNames,buttonLinks){
     var fields=json.response.data;
     allFields=fields;
     var fieldNames=fields["FIELD_NAME"];
     var required=fields["FIELD_REQUIRED"];
     var data=fields["FIELD_DATA"];
     var displayDiv=dom.newEl("div");
     displayDiv.attr("id","main-view-display");  
     var buttonDiv=dom.newEl("div");
     buttonDiv.attr("id","main-view-button");
     form.add(displayDiv);
     form.add(buttonDiv);
     var dateFields=[];
     for(var x=0; x<fieldNames.length; x++){
         var label=dom.newEl("label");
         var name=fieldNames[x];
         var txt=dom.newEl("input");
         label.innerHTML=name;
         if( name==="STUDENT STREAM"){
             txt=dom.newEl("select");
             txt.attr("id",name.toLowerCase().replace(" ","_")+"_select");
             txt.attr("data_type","text");
             displayDiv.appendChild(label);
             displayDiv.appendChild(txt);
             continue;
         }
         else if(name==="STUDENT CLASS"){
             txt.attr("id","student_class_select");
             txt.attr("data_type","text");
             txt.attr("type","text");
             txt.attr("class","input-xxlarge");
             txt.attr("disabled","true");
             displayDiv.appendChild(label);
             displayDiv.appendChild(txt);
             continue;  
         }
         else if(name==="STUDENT NAME"){
             txt.attr("id","student_name_text");
             txt.attr("data_type","text");
             txt.attr("type","text");
             txt.attr("class","input-xxlarge");
             txt.attr("placeholder",name);
             displayDiv.appendChild(label);
             displayDiv.appendChild(txt);
             continue;
         }
         
         var dataType=data[x].toLowerCase();
         if(dataType==="long"){
           txt.attr("type","number");  
           txt.attr("data_type","long");
         }
         else if(dataType==="datetime"){
           txt.attr("type","text");  
           txt.attr("data_type","datetime");
           txt.attr("readonly","readonly");
           txt.attr("style","cursor : pointer;");
           dateFields.push("#student_display_text"+x);
         }
         else if(dataType==="unique"){
           txt.attr("type","text");  
           txt.attr("data_type","unique");
         }
          else if(dataType==="text"){
           txt.attr("type","text");  
           txt.attr("data_type","text");
         }
         else {
            txt.attr("type","text");  
         }
         
         txt.attr("class","input-xxlarge");
         txt.attr("placeholder",name);
         txt.attr("id","student_display_text"+x);
         txt.attr("field_name",name);
         if(required[x]==="1"){
           txt.attr("required",true);   
         }
         displayDiv.appendChild(label);
         displayDiv.appendChild(txt);
        
     }
     
     for(var y=0; y<dateFields.length; y++){
          $(function() {
            $(dateFields[y]).datepicker({ 
                dateFormat: "yy-mm-dd",
                showButtonPanel: true,
                changeMonth: true,
                changeYear: true
             });
         }); 
     }
     

     var br=dom.newEl("br");
     buttonDiv.appendChild(br);
     for(var x=0; x<buttonNames.length; x++){
            var button=dom.newEl("input");
            button.attr("type","button");
            button.attr("class","btn btn-medium btn-primary");
            button.attr("value",buttonNames[x]);
            button.attr("onclick",buttonLinks[x]);
            button.attr("style","margin-left : 5px");
            buttonDiv.appendChild(button);
     }
     form.showForm();
     
  }
  
  
   function allObjects(type,selectId){
     var msg;
     var svc="student_service";
     if(type==="teacher"){
       msg="all_teachers_and_relations";    
     }
     else if(type==="class"){
        msg="all_classes_and_relations"; 
     }
     else if(type==="subject"){
       msg="all_subjects_and_relations";  
     }
     else if(type==="stream"){
       msg="all_streams_and_relations";  
     }
     else if(type==="paper"){
       msg="all_papers_and_relations";  
     }
     else if(type==="exam"){
       msg="all_exams_and_relations";  
       svc="mark_service";
     }
    else if(type==="archive exam"){
       msg="all_archive_exams_and_relations";  
       svc="mark_service";
     }
    var fields=$("#"+selectId).val();
    var json={
                 request_header : {
                     request_msg : msg,
                     request_svc :svc
                  },
                  request_object : {  
                    fields : fields
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all "+type+"");
                  },
                  success : function(json){
                   var resp=json.response.data;
                   generateTableWindow(resp,type,Object.keys(resp));
                } 
          }); 
    
  }
  
  
   function showAllObjects(type){
    if(dom.el("all_students_div")){
      return;
    }
    
    var table=dom.newEl("table");
    table.attr("id","all_students_div");
    
    var tr=dom.newEl("tr");
    var td1=dom.newEl("td");
    var td2=dom.newEl("td");
    td1.attr("id","all_student_fields");
    tr.add(td1);
    tr.add(td2);
    table.add(tr);
    
    CloseDiv(table,"main-view-form", null);
    var selectId=addField(type,allFields["FIELD_NAME"],allFields["FIELD_NAME"]);
    var button=dom.newEl("input");
    button.attr("type","button");
    button.attr("class","btn btn-primary btn-medium");
    button.attr("style","margin-left: 5px");
    button.attr("value","Open");
    button.attr("onclick","javascript:allObjects(\""+type+"\",\""+selectId+"\")");
    td2.add(button);
  }
  
  
  function addField(type,options,values){
     var select=dom.newEl("select");
     select.attr("class","multiselect");
     select.attr("multiple","multiple");
     var id=Math.floor(Math.random()*1000000)+"_select";
     select.attr("id",id);
     dom.el("all_student_fields").add(select);
     populateSelect(id, options, values);
     $('.multiselect').multiselect({
             buttonText : function(options,select){
                 return options.length+" "+type+" FIELDS";
            }
      });
     return id;
  }
  
  function addExtraField(){
     var div1=dom.newEl("div");
     div1.attr("id",new Date().getTime()+"_div");
     var select=dom.newEl("select");
     var id=Math.floor(Math.random()*1000000)+"_select";
     select.attr("id",id);
     div1.add(select);
     CloseDiv(div1, "all_student_fields", null);
     populateSelect(id, allFields["FIELD_NAME"], allFields["FIELD_NAME"]);
     return id;
  }
 
 function generateTableWindow(data,title,headers){
    var name = Math.floor(Math.random()*1000000);
    var win=window.open("",name,"width=500,height=650,scrollbars=yes,resizable=yes");
    win.document.write("<html><head>");
    win.document.write("<title>"+title+"</title>");
    win.document.write("<link href='scripts/bootstrap.min.css' rel='stylesheet'>"+
              "<link href='scripts/bootstrap-responsive.min.css' rel='stylesheet'>"+
              "<script src='scripts/ui.js'></script>"+
              "<script type='text/javascript' src='scripts/StudentService.js'></script>"+
              "<script type='text/javascript' src='scripts/AccountService.js'></script>"+
              "<script type='text/javascript' src='scripts/MarkService.js'></script>"+
              "<script type='text/javascript' src='scripts/ActivationService.js'></script>"+
              "<script type='text/javascript' src='scripts/InternetMessageService.js'></script>"+
              "<script type='text/javascript' src='scripts/common.js'></script>"
  );
    win.document.write("</head>");
    win.document.write(
        "<div align='center'>"+
        "<table class='table table-striped table-condensed table-bordered'>"
     );
   
    win.document.write("<tr>");
    win.document.write("<th>NO</th>");
   for(var x=0; x<headers.length; x++){
     win.document.write("<th>"+headers[x].replace(/_/g," ")+"</th>");
    }
   win.document.write("</tr>");
   var keys=headers;
   for(var x=0;x<data[keys[0]].length; x++){
      win.document.write("<tr>");  
      win.document.write("<td>"+(x+1)+"</td>");
      for(var y=0; y<keys.length; y++){
        win.document.write("<td>"+data[keys[y]][x]+"</td>");  
      }
      win.document.write("</tr>");
   }
   
   win.document.write("</table>");
   win.document.write("</div>");
  win.document.write("<html>");
   
   
}  



  