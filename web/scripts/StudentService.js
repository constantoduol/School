         var serverUrl="/web/server";
         var allFields;
         var fieldCount=0;
         var allSubjects=[];
         var allStreams=[];
         var allPapers=[];
         var allClasses=[];
         var allTeachers=[];
         var privileges=["sms service","mark analysis","mark analysis admin","school records","school records admin","school accounts"];
         var privilegeKeys=["message_service","mark_service","edit_mark_service","student_service","edit_student_service","account_service"];
         
   function editFields(type,svc){
       var json={
                 request_header : {
                     request_msg : "all_fields",
                     request_svc : svc
                  },
                  
                  request_object : {  
                     type : type
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                   loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch student fields ",false);
                  },
                  success : function(json){
                   if(json.response.type==="exception"){
                      setInfo(json.response.ex_reason,false);  
                    }
                   else{
                    displayEditFields(json,type,svc);
                   }
                } 
          });
   }
   
   
   function addEditField(fieldReq,fieldName, fieldData,type,svc){
         var x=fieldCount;
         var area=dom.el("main-view-display");
         var div=dom.newEl("div");
          var id="student_form_div"+x;
          div.setAttribute("id",id);
          div.style.border="2px solid #eee";
          div.style.padding="10px";
          div.style.margin="10px";
          var input=dom.newEl("input");
          input.attr("type","text");
          input.attr("class","input-xxlarge");
          input.attr("required",fieldReq);
          input.attr("id","student_form_text"+x);
          input.attr("value",fieldName);
          input.attr("old_name",fieldName);
          var select=dom.newEl("select");
          var option1=dom.newEl("option");
          var option2=dom.newEl("option");
          option1.attr("value","1");
          option2.attr("value","0");
          option1.innerHTML="Required";
          option2.innerHTML="Not required";

          select.appendChild(option1);
          select.appendChild(option2);
          select.value=fieldReq;
          select.attr("id","student_form_select"+x);
          
          var select1=dom.newEl("select");
          var option3=dom.newEl("option");
          var option4=dom.newEl("option");
          var option5=dom.newEl("option");
          var option6=dom.newEl("option");
          
          option3.attr("value","text");
          option4.attr("value","long");
          option5.attr("value","datetime");
          option6.attr("value","unique");
          
          option3.innerHTML="Text";
          option4.innerHTML="Number";
          option5.innerHTML="Date";
          option6.innerHTML="Unique";
          
          select1.appendChild(option3);
          select1.appendChild(option4);
          select1.appendChild(option5);
          select1.appendChild(option6);
          
          select1.attr("id","student_form_data"+x);
          select1.value=fieldData;
          
          if( (fieldName==="STUDENT STREAM" || fieldName==="STUDENT CLASS" || fieldName==="STUDENT NAME") && type==="student"){
             
          }
          else if(fieldName==="TEACHER NAME" && type==="teacher"){
              
          }
          else if(fieldName==="CLASS NAME" && type==="class"){
              
          }
          else if(fieldName==="SUBJECT NAME" && type==="subject"){
              
          }
          else if(fieldName==="STREAM NAME" && type==="stream"){
              
          }
          else if(fieldName==="PAPER NAME" && type==="paper"){
              
          }
          else if( (fieldName==="EXAM NAME" || fieldName==="EXAM DEADLINE") && type==="exam"){
             
          }
          else{
            var button=dom.newEl("button");
            button.attr("class","close");
            button.attr("type","button");
            button.attr("title","remove field");
            button.innerHTML="&times";
            button.attr("onclick","removeField(\""+id+"\",\""+fieldName+"\",\""+type+"\",\""+svc+"\")");
            div.appendChild(input);
            div.appendChild(select);
            div.appendChild(select1);
            div.appendChild(button);
            area.appendChild(div);
            fieldCount++;
          }
                  
   }
   
   function displayEditFields(json,type,svc){
       allFields=json.response.data; 
       var displayDiv=dom.newEl("div");
       displayDiv.attr("id","main-view-display");
       var form=new Form(null,"main-view-form");
        
       form.add(displayDiv);
       var buttonDiv=dom.newEl("div");
       buttonDiv.attr("id","main-view-button");
       form.add(buttonDiv);
       
        var add=dom.newEl("button");
        add.attr("type","button");
        add.attr("id","add_button");
        add.attr("class","btn btn-medium btn-primary");
        add.innerHTML="Add Field";
        add.attr("onclick","javascript:addEditField('','')");
        
        var save=dom.newEl("button");
        save.attr("type","button");
        save.attr("style","margin-left:5px");
        save.attr("class","btn btn-medium btn-primary");
        save.innerHTML="Save Fields";
        save.attr("onclick","saveFields(\""+type+"\",\""+svc+"\")");
        
       
        buttonDiv.appendChild(add);
        buttonDiv.appendChild(save);
        form.showForm();
      for(var x in allFields["FIELD_NAME"]){
         var fieldReq=allFields["FIELD_REQUIRED"][x];
         var fieldName=allFields["FIELD_NAME"][x];
         var fieldData=allFields["FIELD_DATA"][x];
         addEditField(fieldReq,fieldName,fieldData,type,svc);
      }
      
        
        
   }
   
 function addSearchField(type,area,fieldNames){
   var form=dom.el(area);
   var ul=dom.newEl("ul");
   ul.attr("style","margin-left : 0px");
   form.add(ul);
   var li=dom.newEl("li");
   li.attr("style","list-style-type : none");
   li.attr("class","dropdown");
   li.attr("id","auto_suggest_container");
   ul.add(li);
   var searchDiv=dom.newEl("div");
   searchDiv.attr("class","input-prepend input-append");
   var searchSpan=dom.newEl("span");
   searchSpan.attr("class","add-on");
   searchSpan.attr("style","height : auto; padding: 3px;");
   
   var searchIcon=dom.newEl("img");
   searchIcon.attr("src","img/search.png");
   
   var filterSpan=dom.newEl("span");
   filterSpan.attr("class","add-on");
   filterSpan.attr("id","filter_span");
   filterSpan.attr("style","height : auto;");
   
   searchSpan.add(searchIcon);
   searchDiv.add(searchSpan);
   
   var input=dom.newEl("input");
   input.attr("type","text");
   input.attr("id","search_param");
   input.attr("style"," padding: 10px;font-size: 20px;box-shadow: inset rgba(0,0,0,0.75) 0 1px 3px;border : none");
   input.attr("data-toggle","dropdown");
   input.attr("placeholder","Search");
   input.attr("class","dropdown-toggle input-xxlarge");
   input.attr("search_type",type);
   input.attr("onkeyup","javascript:autoSuggest('student_service')");
   searchDiv.add(input);
   searchDiv.add(filterSpan);
   li.add(searchDiv);
   var ul1=dom.newEl("ul");
   ul1.attr("class","dropdown-menu");
   ul1.attr("id","auto_suggest");
   ul1.attr("style","display : none ; margin-left : 37px; width : 550px; font-size : 16px;top : 60%");
   li.add(ul1);

   var hr=dom.newEl("hr");
   hr.attr("style","height : 2px; ");
   li.add(hr);
   ui.dropdown.add("filter_span","search_filter",fieldNames,fieldNames);
 }
 
 
  
 function viewFields(type,buttonNames,buttonLinks,svc,form,subView){
    var json={
                 request_header : {
                     request_msg : "all_fields",
                     request_svc : svc
                  },
                  
                  request_object : {  
                    type : type
                  }
              };
          
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch "+type+" fields ");
                  },
                  success : function(json){
                    var fields=json.response.data;
                    var fieldNames=fields["FIELD_NAME"];
                    addSearchField(type,"main-view-form",fieldNames);
                    if(subView){
                      form.add(subView);
                    }
                    displayViewFields(json,form,buttonNames,buttonLinks);
                } 
          });
       
  }
  


  

  
  function showAllStudents(){
    //append the selects
    if(dom.el("all_students_div")){
       return;
    }
    
    var table=dom.newEl("table");
    table.attr("id","all_students_div");
    
    var th=dom.newEl("th");
    var th1=dom.newEl("th");
    var th2=dom.newEl("th");
    th.innerHTML="Fields";
    th1.innerHTML="Class";
    th2.innerHTML="Stream";
    var tr=dom.newEl("tr");
    tr.add(th);
    tr.add(th1);
    tr.add(th2);
    table.add(tr);
    var tr1=dom.newEl("tr");
    var td=dom.newEl("td");
    td.attr("id","all_student_fields");
    var td1=dom.newEl("td");
    var td2=dom.newEl("td");
    var td3=dom.newEl("td");
    tr1.add(td);
    tr1.add(td1);
    tr1.add(td2);
    tr1.add(td3);
    table.add(tr1);
    
    CloseDiv(table,"main-view-form", null);
    var fields = [];
    for(var x=0; x<allFields["FIELD_NAME"].length; x++){
       var value = allFields["FIELD_NAME"][x];
       if(value==="STUDENT NAME" || value==="STUDENT CLASS" || value==="STUDENT STREAM"){
          
       }
       else{
          fields.push(value);  
       }
    }
    var selectId=addField('STUDENT',fields,fields);
    
    var button=dom.newEl("input");
    button.attr("type","button");
    button.attr("class","btn btn-primary btn-medium");
    button.attr("style","margin-left: 5px");
    button.attr("value","Open");
    button.attr("onclick","javascript:allStudents('"+selectId+"')");
   
    var streamNames=cloneArray(allStreams["STREAM_NAME"]);
    var streamIds=cloneArray(allStreams["ID"]);
    var classNames=cloneArray(allClasses["CLASS_NAME"]);
    var classIds=cloneArray(allClasses["ID"]);
    
    classIds.unshift("all");
    classNames.unshift("All");
    streamNames.unshift("All");
    streamIds.unshift("all");
    ui.dropdown.add(td1,"all_classes_select",classNames,classIds);
    ui.dropdown.add(td2,"all_streams_select",streamNames,streamIds);
    td3.add(button);
    tr1.add(td1);
    tr1.add(td2);
    tr1.add(td3);
    table.add(tr1);
  }
  
 
  
 
  function allStudents(selectId){
    var classId=ui.dropdown.getSelected("all_classes_select");
    var streamId=ui.dropdown.getSelected("all_streams_select");
    var fields=$("#"+selectId).val();
    if(!fields){
       fields=[];
    }
    var json={
                 request_header : {
                     request_msg : "all_students",
                     request_svc :"student_service"
                  },
                  request_object : {  
                    class_id : classId,
                    stream_id : streamId,
                    fields : fields
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all students");
                  },
                  success : function(json){
                    var data=json.response.data;
                    var orderArr=["STUDENT_NAME","CLASS_NAME","STREAM_NAME"];
                    for(var x=0; x<fields.length; x++){
                            orderArr.push(fields[x].replace(/ /g,"_")); 
                         }
                    var orderedData=orderData(data,orderArr);
                    generateTableWindow(orderedData,"Students",orderArr);
                    
                } 
          }); 
    
  }
  
  function orderData(data,arr){
    var object={};
    for(var x=0; x<arr.length; x++){
       object[arr[x]]=data[arr[x]];
       delete data[arr[x]];
    }
   for(var x in data){
     object[x]=data[x];  
   }
   return object;
    
  }
  
 /*
  * 
  * this function provides the ui for student graduation
  */
 function studentGraduate(){
   var form=new Form(null,"main-view-form");
   setTitle("Student Graduation");
   var json={
                 request_header : {
                     request_msg : "all_streams",
                     request_svc : "student_service"
                  },
                  
                  request_object : {  
                    
                  }
              };
          
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all streams");
                  },
                  success : function(json){
                  generateStudentGraduation(json,form);
                } 
          });
   
 }
 
 /*
  * 
  * @param {type} json data to populate 
  * @param {type} form where to add the ui for student graduation
  * @returns an array containing select ids and class ids
  */
 function generateStudentGraduation(json,form){
     var resp = json.response.data;
     var streamNames = resp["STREAM_NAME"];
     var streamIds = resp["ID"];
     var newStreamNames = cloneArray(streamNames);
     newStreamNames.push("Archive");
     streamIds.push("archive");
     for(var x = 0; x < streamNames.length; x++){
        if(streamIds[x].indexOf("AR_") > -1){
           streamIds.splice(x,1);
           newStreamNames.splice(x,1);
        }
     }
    for(var x = 0; x < newStreamNames.length; x++){
        if(newStreamNames[x].indexOf("Archive") > -1){
           continue;
        }
        var label=dom.newEl("label");
        label.innerHTML=newStreamNames[x];
        var select =dom.newEl("select");
        var id = Math.floor(Math.random()*10000000);
        select.attr("previous_stream",streamIds[x]);
        select.attr("id",id);
        form.add(label);
        form.add(select);
        form.add(dom.newEl("br"));
        populateSelect(id,newStreamNames,streamIds); 
        select.value = streamIds[x];
     }
     var gradBtn=dom.newEl("input");
     gradBtn.attr("type","button");
     gradBtn.attr("class","btn btn-primary");
     gradBtn.attr("value","Graduate Students");
     gradBtn.attr("onclick","javascript:graduateStudents()");
     form.add(gradBtn);
 }
 
 /*
  * this function graduates students in classes to the next level
  * @returns {undefined}
  */
 function graduateStudents(){
   var conf = confirm("This will transfer the students to the specified streams, continue ?");
   if(!conf){
      return;
   }
   var selects = $("#main-view-form").find("select")
   var streamIds = [];
   var selectValues = [];
   for(var x = 0; x < selects.length; x++){
      selectValues.push(selects[x].value);
      streamIds.push(selects[x].getAttribute("previous_stream"));
   }
   var json={
                 request_header : {
                     request_msg : "graduate_students",
                     request_svc : "edit_student_service"
                  },
                  
                  request_object : {  
                     stream_ids : streamIds,
                     new_stream_ids : selectValues
                  }
              };
          
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to graduate students ");
                  },
                  success : function(json){
                   if(json.response.data==="success"){
                      setInfo("Students graduated successfully"); 
                   }
                } 
          });
 }
 
 
  /*
   * this function provides the ui for the student
   * history feature
   */
 function studentHistory(){
   var form=new Form(null,"main-view-form");
   setTitle("Student History");
   var json={
                 request_header : {
                     request_msg : "all_fields",
                     request_svc : "student_service"
                  },
                  
                  request_object : {  
                    type : "student"
                  }
              };
          
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch student fields ");
                  },
                  success : function(json){
                    var fields=json.response.data;
                    var fieldNames=fields["FIELD_NAME"];
                   // populateSelect("search_filter",fieldNames,fieldNames);
                   // ui.dropdown.add("control_div","search_filter",fieldNames,fieldNames);
                    var contDiv = dom.newEl("div");
                    contDiv.attr("style", "border : 2px solid lightgray; padding : 20px");
                    contDiv.attr("id", "control_div");
                    form.add(contDiv);
                    addSearchField("student", "control_div",fieldNames,fieldNames);

                    var txt = dom.newEl("textarea");
                    txt.attr("id", "history_entry");
                    txt.attr("style", "width : 800px; height : 100px");
                    var saveBtn = dom.newEl("input");
                    saveBtn.attr("type", "button");
                    saveBtn.attr("class", "btn btn-primary");
                    saveBtn.attr("value", "Save Entry");
                    saveBtn.attr("onclick", "saveStudentHistory()");
                    var allBtn = dom.newEl("input");
                    allBtn.attr("type", "button");
                    allBtn.attr("class", "btn btn-primary");
                    allBtn.attr("style", "margin : 10px");
                    allBtn.attr("value", "All Entries");
                    allBtn.attr("onclick", "allStudentHistory()");
                    var historyDiv = dom.newEl("div");
                    historyDiv.attr("id", "history_area");
                    contDiv.add(txt);
                    contDiv.add(dom.newEl("br"));
                    contDiv.add(saveBtn);
                    contDiv.add(allBtn);
                    form.add(historyDiv);
                } 
          });

   

  }
  
  /*
   * this function saves a single student history entry
   */
  function saveStudentHistory(){
     var hist=dom.el("history_entry").value;
     var studentSearch=dom.el("search_param");
     var studentId=studentSearch.getAttribute("current_id");
     if(!studentId || studentId===""){
        setInfo("No student specified to make new entry");
        return;
     }
     if(hist.trim()===""){
        setInfo("Nothing to save!");
        return;
     }
     var json={
                 request_header : {
                     request_msg : "save_student_history",
                     request_svc :"student_service"
                  },
                  request_object : {
                    history : hist,
                    student_id : studentId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save student history entry");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                      setInfo("Entry saved successfully");   
                    }
                } 
          }); 
  }
  
  function allStudentHistory(){
     var studentSearch=dom.el("search_param");
     var studentId=studentSearch.getAttribute("current_id");
     if(!studentId || studentId===""){
        setInfo("No student specified to view entries, specify and retry");
        return;
     } 
     var json={
                 request_header : {
                     request_msg : "all_student_entries",
                     request_svc :"student_service"
                  },
                  request_object : {
                    student_id : studentId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch student history entries");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    displayStudentHistory(resp);
                    
                } 
          }); 
  }
  
  function displayStudentHistory(resp){
     var ownerNames=resp.data["USER_NAME"];
     var historyArea=dom.el("history_area");
     historyArea.innerHTML="";
     var userId=resp.userid;
     for(var x=0; x<ownerNames.length; x++){
        var div=dom.newEl("div");
        var date=new Date(resp.data["CREATED"][x]).toLocaleString();
        var currentUserId=resp.data["USER_ID"][x];
        var id=Math.floor(Math.random()*1000000);
        div.attr("id",id);
        var borderColor;
        if(userId===currentUserId){
            borderColor = "cyan";
            var recId=resp.data["ID"][x];
            var button=dom.newEl("button");
            button.attr("class","close");
            button.attr("type","button");
            button.attr("title","remove field");
            button.innerHTML="&times";
            button.attr("onclick","removeStudentHistory(\""+id+"\",\""+recId+"\")");
            div.add(button);
        }
        else{
           borderColor = "#eee";
        }
        div.attr("style","background : white ; border : solid 2px "+borderColor+"; margin-top : 10px; margin-left: 10px; font-size : 16px; width : auto; height:auto");
        var label=dom.newEl("label");
        label.attr("style","float : left; font-size : 10px;color : #808080; margin-left : 5px;");
        label.innerHTML=resp.data["USER_NAME"][x]+"  "+date;
        var p=dom.newEl("p");
        p.innerHTML=resp.data["HISTORY"][x];
        p.attr("style","padding : 20px;");
        div.add(label);
        div.add(p);
        historyArea.add(div);
     }
  }
  
  function removeStudentHistory(divId,recId){
     var conf=confirm("Remove this student entry?");
     if(!conf){
       return;
     }
     dom.el(divId).remove();
     var json={
                 request_header : {
                     request_msg : "remove_student_history",
                     request_svc :"student_service"
                  },
                  request_object : { 
                   record_id : recId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to remove student history");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                        setInfo("student history entry removed successfully");
                    }
                } 
          }); 
  }
  
  function studentView(){
    var names=["<img src='img/student.png'/> Student View",
        "<img src='img/teacher.png'/> Teacher View", 
        "<img src='img/class.png'/> Class View", 
        "<img src='img/subject.png'/> Subject View",
        "<img src='img/stream.png'/> Stream View",
        "<img src='img/paper.png'/> Paper View",
        "<img src='img/history.png'/> Student History"
     ];
    var links=["javascript:studentView()",
        "javascript:teacherView()",
        "javascript:classView()",
        "javascript:subjectView()",
        "javascript:streamView()",
        "javascript:paperView()",
        "javascript:studentHistory()"
    ];    
    var adNames=["<img src='img/edit.png'/> Edit Student Fields",
        "<img src='img/edit.png'/> Edit Teacher Fields",
        "<img src='img/edit.png'/> Edit Class Fields",
        "<img src='img/edit.png'/> Edit Subject Fields",
        "<img src='img/edit.png'/> Edit Stream Fields",
        "<img src='img/edit.png'/> Edit Paper Fields",
        "<img src='img/graduate.png'/> Student Graduation"
      ];
    var adLinks=["javascript:editFields('student','edit_student_service')",
        "javascript:editFields('teacher','edit_student_service')",
        "javascript:editFields('class','edit_student_service')",
        "javascript:editFields('subject','edit_student_service')",
        "javascript:editFields('stream','edit_student_service')",
        "javascript:editFields('paper','edit_student_service')",
        "javascript:studentGraduate()"
    ];
    var menu=new Menu(names,links,adNames,adLinks);
    menu.showMenu();
    var buttonNames=["Create Student","Update Student","Delete Student","All Students"];
    var buttonLinks=["javascript:createStudent()","javascript:updateStudent()","javascript:deleteObject('delete_student','student')","javascript:showAllStudents()"];
    var form=new Form(null,"main-view-form");
    setTitle("Student View");
    viewFields('student',buttonNames,buttonLinks,"student_service",form);
          var json={
                 request_header : {
                     request_msg : "all_classes",
                     request_svc :"student_service"
                  },
                  request_object : {  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all classes");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    allClasses=resp;
                } 
          }); 
      
      var json1={
                 request_header : {
                     request_msg : "all_streams",
                     request_svc :"student_service"
                  },
                  request_object : {  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json1,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all streams");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    allStreams=resp;
                    var streamNames = []; //dont show archived records
                    var streamIds = [];
                    for(var x=0; x<resp["ID"].length; x++){
                       if(resp["ID"][x].indexOf("AR_") === -1){
                         streamNames.push(resp["STREAM_NAME"][x]); 
                         streamIds.push(resp["ID"][x]);
                       }  
                    }
                    var func=function(){
                       populateSelect("student_stream_select", streamNames,streamIds);
                    };
                    dom.waitTillElementReady("student_stream_select", func);
                } 
          }); 
     
  }
  
  function teacherView(){
    var buttonNames=["Create Teacher","Update Teacher","Delete Teacher","Add Subject","Add Privilege","All Teachers"];
    var buttonLinks=["javascript:createTeacher()","javascript:updateTeacher()","javascript:deleteObject('delete_teacher','teacher')","javascript:addTeacherSubject()","javascript:addUserPrivilege()","javascript:showAllObjects('teacher')"];
    var form=new Form(null,"main-view-form");
    setTitle("Teacher View");
    var subView=dom.newEl("div");
    subView.attr("id","subject_view");
    var privView=dom.newEl("div");
    privView.attr("id","privilege_view");
    subView.add(privView);
    viewFields('teacher',buttonNames,buttonLinks,"student_service",form,subView);  
    
  }
  
  function addUserPrivilege(){
    var div = dom.newEl("div");
    var select = dom.newEl("select");
    var id = new Date().getTime() + "_privilege";
    select.attr("id", id);
    div.add(select);
    CloseDiv(div, "privilege_view", null);
    populateSelect(id,privileges,privileges); 
  }
  
  function paperView(){
    var buttonNames=["Create Paper","Update Paper","Delete Paper","All Papers"];
    var buttonLinks=["javascript:createPaper()","javascript:updatePaper()","javascript:deleteObject('delete_paper','paper')","javascript:showAllObjects('paper')"];
    var form=new Form(null,"main-view-form");
    setTitle("Paper View");
    viewFields('paper',buttonNames,buttonLinks,"student_service",form,null);     
  }
  
  function classView(){
    var buttonNames=["Create Class","Update Class","Delete Class","Add Stream","All Classes"];
    var buttonLinks=["javascript:createClass()","javascript:updateClass()","javascript:deleteObject('delete_class','class')","javascript:addStream()","javascript:showAllObjects('class')"];
    var form=new Form(null,"main-view-form");
    setTitle("Class View");
    var subView=dom.newEl("div");
    subView.attr("id","stream_view");
    viewFields('class',buttonNames,buttonLinks,"student_service",form,subView);  
  }
  
  function deleteObject(msg,type){
     var prompt="";
     if(type==="stream"){
        prompt="Warning : deleting a stream will delete all students in the stream and any exam marks for this stream, proceed?";
     }
     else if(type==="class"){
       prompt="Warning : deleting a class will delete all students in the class and any exam marks for this class, proceed?"; 
     }
     else{
       prompt="Delete "+type+"?";
     }
     var conf=confirm(prompt);
     if(!conf){
        return; 
     }
     var id=dom.el("search_param").getAttribute("current_id");
     var json={
                 request_header : {
                     request_msg :msg,
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                    object_id : id
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to delete "+type+"");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo(""+type+" deleted successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("deleting "+type+" failed: "+json.response.reason);
                    }
                } 
          });        
  }
  
  function updateClass(){
    //field names,class id,fieldvalues,stream ids
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var streamIds=[];
   var search=dom.el("search_param");
   var classId=search.getAttribute("current_id");
   var className;
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No class specified for updating");  
     search.focus();
     return;
   }
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName=="CLASS NAME"){
         className=txt.value; 
         continue;
      }
      if( (required && txt.value=="") || (dataType=="unique" && txt.value=="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   }
   
    if(className.trim()==""){
      return; 
   }
    var streamView=dom.el("stream_view");
    if(streamView){
    var streamSelects=streamView.children;
    var allNames=allStreams["STREAM_NAME"];
    var allIds=allStreams["ID"];

    for(var x=0; x<streamSelects.length; x++){
       var select=streamSelects[x].children[1];
       var stream=select.value;
       if(stream.trim()=="" || stream==null){
         continue  
       }
       var streamId=allIds[allNames.indexOf(stream)];
       streamIds.push(streamId);
    }
    }
   var json={
                 request_header : {
                     request_msg : "update_class",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   class_id :classId,
                   class_name : className,
                   stream_ids : streamIds
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update class");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("class updated successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("class updating failed: "+json.response.reason);
                    }
                } 
          });        
  }
  
  function updateTeacher(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var subjectIds=[];
   var streamIds=[];
   var teacherPrivs=[];
   var teacherName;
   var search=dom.el("search_param");
   var teacherId=search.getAttribute("current_id");
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No teacher specified for updating");  
     search.focus();
     return;
   }
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="TEACHER NAME"){
         teacherName=txt.value; 
         continue;
      }
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      } 
   }
    if(teacherName.trim()===""){
      return; 
   }
    var subjectView=dom.el("subject_view");
    if(subjectView){
      var subjectSelects=subjectView.children;
      for(var x=1; x<subjectSelects.length; x++){
       var select=subjectSelects[x].children[1].children[0];
       var subjectId=select.value;
       subjectIds.push(subjectId);
       var select1=subjectSelects[x].children[1].children[1];
       var streamId=select1.value;
       streamIds.push(streamId);
      }
    }
    var privilegeView=dom.el("privilege_view");
    if(privilegeView){
      var privilegeSelects=privilegeView.children;
      for(var x=0; x<privilegeSelects.length; x++){
       var select=privilegeSelects[x].children[1].children[0];
       var priv=select.value;
       teacherPrivs.push(priv);
      }
    }

    var json={
                 request_header : {
                     request_msg : "update_teacher",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   subject_ids: subjectIds,
                   teacher_name :teacherName,
                   teacher_id : teacherId,
                   stream_ids : streamIds,
                   teacher_privs : teacherPrivs
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update teacher");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    console.log(resp);
                    if(resp==="success"){
                     setInfo("teacher updated successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("teacher updating failed: "+json.response.reason);
                    }
                } 
          });  
  }
  

  
  function createClass(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var streamIds=[];
   var className;
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName=="CLASS NAME"){
         className=txt.value; 
         continue;
      }
      if( (required && txt.value=="") || (dataType=="unique" && txt.value=="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   }
    if(className.trim()==""){
      return; 
   }
    var streamView=dom.el("stream_view");
    if(streamView){
    var streamSelects=streamView.children;
    var allNames=allStreams["STREAM_NAME"];
    var allIds=allStreams["ID"];

    for(var x=0; x<streamSelects.length; x++){
       var select=streamSelects[x].children[1];
       var stream=select.value;
       if(stream.trim()=="" || stream==null){
         continue  
       }
       var streamId=allIds[allNames.indexOf(stream)];
       streamIds.push(streamId);
    }
    }
   var json={
                 request_header : {
                     request_msg : "create_class",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   class_name :className,
                   stream_ids : streamIds
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create class");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp=="success"){
                     setInfo("class created successfully ");   
                    }
                    else if(resp=="fail"){
                       setInfo("class creation failed: "+json.response.reason);
                    }
                } 
          });        
  }
  
  function updatePaper(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var paperName;
   var search=dom.el("search_param");
   var paperId=search.getAttribute("current_id");
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No paper specified for updating");  
     search.focus();
     return;
   }
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName=="PAPER NAME"){
         paperName=txt.value; 
         continue;
      }
      if( (required && txt.value=="") ||(dataType=="unique" && txt.value=="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   }
    if(paperName.trim()==""){
      return; 
   }
     
   var json={
                 request_header : {
                     request_msg : "update_paper",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   paper_name :paperName,
                   paper_id :paperId

                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update paper");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp=="success"){
                     setInfo("paper updated successfully ");   
                    }
                    else if(resp=="fail"){
                       setInfo("paper updating failed: "+json.response.reason);
                    }
                } 
          });   
  }
  
  function createPaper(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var paperName;
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName=="PAPER NAME"){
         paperName=txt.value; 
         continue;
      }
      if( (required && txt.value=="") || (dataType=="unique" && txt.value=="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   }
    if(paperName.trim()==""){
      return; 
   }
   var json={
                 request_header : {
                     request_msg : "create_paper",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   paper_name :paperName

                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create paper");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp=="success"){
                     setInfo("paper created successfully ");   
                    }
                    else if(resp=="fail"){
                       setInfo("paper creation failed: "+json.response.reason);
                    }
                } 
          });   
  }
  
  
  
  function addStream(){ 
     var json={
              request_header : {
                     request_msg : "all_streams",
                     request_svc :"student_service"
                  },
                  
                  request_object : {  
                      
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                   loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch streams");
                  },
                  success : function(json){
                     var resp=json.response.data;
                     allStreams=resp;
                     var select=dom.newEl("select");
                     var id=new Date().getTime()+"select";
                     select.attr("id",id);
                     CloseDiv(select,"stream_view",null);
                     populateSelect(id, resp["STREAM_NAME"], resp["STREAM_NAME"]);
                } 
          });
       
    
  }
  
  function subjectView(){
    var buttonNames=["Create Subject","Update Subject","Delete Subject","Add Paper","All Subjects"];
    var buttonLinks=["javascript:createSubject()","javascript:updateSubject()","javascript:deleteObject('delete_subject','subject')","javascript:addPaper()","javascript:showAllObjects('subject')"];
    var form=new Form(null,"main-view-form");
    setTitle("Subject View");
    var subView=dom.newEl("div");
    subView.attr("id","paper_view");
    viewFields('subject',buttonNames,buttonLinks,"student_service",form,subView);  
  }
  
 function addPaper(){
     var json={
              request_header : {
                     request_msg : "all_papers",
                     request_svc :"student_service"
                  },
                  
                  request_object : {  
                      
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                   loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch papers");
                  },
                  success : function(json){
                     var resp=json.response.data;
                     allPapers=resp;
                     var select=dom.newEl("select");
                     var id=new Date().getTime()+"select";
                     select.attr("id",id);
                     CloseDiv(select,"paper_view",null,null);
                     populateSelect(id, resp["PAPER_NAME"], resp["PAPER_NAME"]);
                } 
          });   
 }
  
  function updateSubject(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var paperIds=[];
   var subjectName;
   var search=dom.el("search_param");
   var subjectId=search.getAttribute("current_id");
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No subject specified for updating");  
     search.focus();
     return;
   }
for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName=="SUBJECT NAME"){
         subjectName=txt.value; 
         continue;
      }
      if( (required && txt.value=="") || (dataType=="unique" && txt.value=="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   }
    if(subjectName.trim()==""){
      return; 
   }
  
    var paperView=dom.el("paper_view");
    if(paperView){
    var paperSelects=paperView.children;
    var allNames=allPapers["PAPER_NAME"];
    var allIds=allPapers["ID"];
    
    for(var x=0; x<paperSelects.length; x++){
       var select=paperSelects[x].children[1];
       var paper=select.value;
       if(paper.trim()=="" || paper==null){
         continue  
       }
       var paperId=allIds[allNames.indexOf(paper)];
       paperIds.push(paperId);
    }
    }
   var json={
                 request_header : {
                     request_msg : "update_subject",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   subject_name :subjectName,
                   paper_ids : paperIds,
                   subject_id :subjectId
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update subject");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp=="success"){
                     setInfo("subject updated successfully ");   
                    }
                    else if(resp=="fail"){
                       setInfo("subject updating failed: "+json.response.reason);
                    }
                } 
          });      
  }
  
  function createSubject(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var paperIds=[];
   var subjectName;
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="SUBJECT NAME"){
         subjectName=txt.value; 
         continue;
      }
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   }
    if(subjectName.trim()===""){
      return; 
    }
    var paperView=dom.el("paper_view");
    if(paperView){
    var paperSelects=paperView.children;
    var allNames=allPapers["PAPER_NAME"];
    var allIds=allPapers["ID"];
    for(var x=0; x<paperSelects.length; x++){
       var select=paperSelects[x].children[1];
       var paper=select.value;
       if(paper.trim()==="" || paper===null){
         continue  
       }
       var paperId=allIds[allNames.indexOf(paper)];
       paperIds.push(paperId);
    }
    }
   var json={
                 request_header : {
                     request_msg : "create_subject",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   subject_name :subjectName,
                   paper_ids : paperIds
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create subject");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp=="success"){
                     setInfo("subject created successfully ");   
                    }
                    else if(resp=="fail"){
                       setInfo("subject creation failed: "+json.response.reason);
                    }
                } 
          });      
  }
  
  function streamView(){
    var buttonNames=["Create Stream","Update Stream","Delete Stream","Add Subject","All Streams"];
    var buttonLinks=["javascript:createStream()","javascript:updateStream()","javascript:deleteObject('delete_stream','stream')","javascript:addStreamSubject()","javascript:showAllObjects('stream')"];
    var form=new Form(null,"main-view-form");
     setTitle("Stream View");
    var subView=dom.newEl("div");
    subView.attr("id","subject_view");
    viewFields('stream',buttonNames,buttonLinks,"student_service",form,subView);  
   
  }
  
  
 function createTeacher(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var subjectIds=[];
   var streamIds=[];
   var teacherPrivs=[];
   var teacherName;
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="TEACHER NAME"){
         teacherName=txt.value; 
         continue;
      }
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   
   }
    if(teacherName.trim()===""){
      return; 
   }
    var subjectView=dom.el("subject_view");
    if(subjectView){
      var subjectSelects=subjectView.children;
      for(var x=1; x<subjectSelects.length; x++){
       var select=subjectSelects[x].children[1].children[0];
       var subjectId=select.value;
       subjectIds.push(subjectId);
       var select1=subjectSelects[x].children[1].children[1];
       var streamId=select1.value;
       streamIds.push(streamId);
      }
    }
    
    var privilegeView=dom.el("privilege_view");
    if(privilegeView){
      var privilegeSelects=privilegeView.children;
      for(var x=0; x<privilegeSelects.length; x++){
       var select=privilegeSelects[x].children[1].children[0];
       var priv=select.value;
       teacherPrivs.push(priv);
      }
    }
    var json={
                 request_header : {
                     request_msg : "create_teacher",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   subject_ids: subjectIds,
                   teacher_name :teacherName,
                   stream_ids : streamIds,
                   teacher_privs : teacherPrivs
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create teacher");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("teacher created successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("teacher creation failed: "+json.response.reason);
                    }
                } 
          });  
  }
  
  function createStream(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var subjectIds=[];
   var streamName;
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="STREAM NAME"){
         streamName=txt.value; 
         continue;
      }
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      } 
   }
    if(streamName.trim()===""){
      return; 
    }
    var subjectView=dom.el("subject_view");
    if(subjectView){
        var subjectSelects=subjectView.children;
        var allNames=allSubjects["SUBJECT_NAME"];
        var allIds=allSubjects["ID"];
        for(var x=0; x<subjectSelects.length; x++){
         var select=subjectSelects[x].children[1];
         var subject=select.value;
        if(subject.trim()==="" || subject===null){
         continue  
        }
         var subjectId=allIds[allNames.indexOf(subject)];
         subjectIds.push(subjectId);
     }
    }
   
    var json={
                 request_header : {
                     request_msg : "create_stream",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   subject_ids: subjectIds,
                   stream_name :streamName
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create stream");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("stream created successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("stream creation failed: "+json.response.reason);
                    }
                } 
          });   
  }
  
  function addStreamSubject(){
     var json={
              request_header : {
                     request_msg : "all_subjects",
                     request_svc :"student_service"
                  },
                  
                  request_object : {  
                      
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                   loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch subjects");
                  },
                  success : function(json){
                     var resp=json.response.data;
                     allSubjects=resp;
                     var select=dom.newEl("select");
                     var id=new Date().getTime()+"select";
                     select.attr("id",id);
                     CloseDiv(select,"subject_view",null);
                     populateSelect(id, resp["SUBJECT_NAME"], resp["SUBJECT_NAME"]);
                } 
          });      
  }
  
function addTeacherSubject(){
     var id1=new Date().getTime()+"teacher";
     var json={
              request_header : {
                     request_msg : "all_subjects",
                     request_svc :"student_service"
                  },
                  
                  request_object : {  
                      
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                   loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch subjects");
                  },
                  success : function(json){
                     var resp=json.response.data;
                     allSubjects=resp;
                     var div=dom.newEl("div");
                     
                     var select=dom.newEl("select");
                     var id=new Date().getTime()+"select";
                     select.attr("id",id);
                     
                     var select1=dom.newEl("select");
                     select1.attr("id",id1);
                     
                     div.add(select);
                     div.add(select1);
                     
                     CloseDiv(div,"subject_view",null);
                     populateSelect(id, resp["SUBJECT_NAME"], resp["ID"]);
                } 
          });   
          
         var json1={
              request_header : {
                     request_msg : "all_streams",
                     request_svc :"student_service"
                  },
                  
                  request_object : {  
                      
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json1,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all streams");
                  },
                  success : function(json){
                     var resp=json.response.data;
                     allStreams=resp;
                     var streamNames = []; //dont show archived records
                     var streamIds = [];
                     for(var x=0; x<resp["ID"].length; x++){
                       if(resp["ID"][x].indexOf("AR_") === -1){
                         streamNames.push(resp["STREAM_NAME"][x]); 
                         streamIds.push(resp["ID"][x]);
                       }  
                    }
                     var func=function(){
                        populateSelect(id1,streamNames, streamIds);   
                     };
                     dom.waitTillElementReady(id1,func);
                } 
          });
  }
  
  

  
  function updateStream(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var subjectIds=[];
   var teacherIds=[];
   var streamName;
   var search=dom.el("search_param");
   var streamId=search.getAttribute("current_id");
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No stream specified for updating");  
     search.focus();
     return;
   }
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="STREAM NAME"){
         streamName=txt.value; 
         continue;
      }
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
   

   }
    if(streamName.trim()===""){
      return; 
   }
   
    var subjectView=dom.el("subject_view");
    if(subjectView){
        var subjectSelects=subjectView.children;
        var allNames=allSubjects["SUBJECT_NAME"];
        var allIds=allSubjects["ID"];
        for(var x=0; x<subjectSelects.length; x++){
         var select=subjectSelects[x].children[1];
         var subject=select.value;
         if(subject.trim()==="" || subject===null){
          continue  
         }
         var subjectId=allIds[allNames.indexOf(subject)];
         subjectIds.push(subjectId);
     }
    }
   
    var json={
                 request_header : {
                     request_msg : "update_stream",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   subject_ids: subjectIds,
                   stream_name :streamName,
                   stream_id :streamId
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update stream");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp=="success"){
                     setInfo("stream updated successfully ");   
                    }
                    else if(resp=="fail"){
                       setInfo("stream updating failed: "+json.response.reason);
                    }
                } 
          });    
  }
  
  function updateStudent(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var studentName=dom.el("student_name_text").value;
   var studentStreamId=dom.el("student_stream_select").value;
   var search=dom.el("search_param");
   var studentId=search.getAttribute("current_id");
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No student specified for updating");  
     search.focus();
     return;
   }
   if(studentName.trim()===""){
      return; 
   }
   for(var x=3; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
      
   } 
   
      var json={
                 request_header : {
                     request_msg : "update_student",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   student_name :studentName.replace(/[^a-zA-Z ]/g, ""),
                   student_stream_id : studentStreamId,
                   student_id : studentId
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update student");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("student updated successfully ");   
                     dom.el("student_name_text").value="";
                    }
                    else if(resp==="fail"){
                       setInfo("student updating failed : "+json.response.reason);
                    }
                } 
          });   
  }
  
   
 function createStudent(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var studentName=dom.el("student_name_text").value;
   var studentStreamId=dom.el("student_stream_select").value;
   if(studentName.trim()===""){
      setInfo("Student name is required");
      dom.el("student_name_text").focus();
      return; 
   }
   for(var x=3; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if( (required && txt.value==="") || (dataType==="unique" && txt.value==="")){
        setInfo("Field is required");
        txt.focus();
        return;
      }
      else{
        fieldNames.push(fieldName);
        fieldValues.push(txt.value);
        fieldData.push(dataType);
      }
      
   } 
   
      var json={
                 request_header : {
                     request_msg : "create_student",
                     request_svc :"student_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   student_name :studentName.replace(/[^a-zA-Z ]/g, ""),
                   student_stream_id : studentStreamId
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create student");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                        setInfo("student created successfully ");   
                        dom.el("student_name_text").value="";
                        dom.el("student_name_text").focus();
                    }
                    else if(resp==="fail"){
                       setInfo("student creation failed : "+json.response.reason);
                    }
                } 
          });
 }
 
 
 
   
 function addOption(selectbox,text,value){
   var optn=document.createElement("OPTION");
   optn.innerText=text;
   optn.text=text;
   optn.value=value;
   var box=document.getElementById(selectbox);
   box.appendChild(optn);
}
//populate a select box from an array
function populateSelect(selectbox,arrayoptions,arrayvalues){
    if(!arrayvalues)
      return;  
    for(var y = 0; y < arrayvalues.length; ++y){
       addOption(selectbox,arrayoptions[y],arrayvalues[y]);
    }

}
  
  
  function saveFields(type,svc){
    var arrReq=[];
    var arrInp=[];
    var arrOld=[];
    var arrData=[];
    var div=dom.el("main-view-display");
    var children=div.children;
    for(var x=0; x<children.length; x++){
       var child=children[x];
       var input=child.children[0];
       var oldName=input.getAttribute("old_name");
       var required=child.children[1].value;  
       var data=child.children[2].value; 
       if(input.value.trim()!==""){
         arrReq.push(required);
         arrInp.push(input.value.replace(/[^a-zA-Z ]/g, ""));
         setInfo("special characters and numbers ignored in field names");
         arrOld.push(oldName);
         arrData.push(data);  
       }
       
    }
     
     var json={
                 request_header : {
                     request_msg : "save_fields",
                     request_svc : svc
                  },
                  
                  request_object : {  
                    required : arrReq,
                    field_names : arrInp,
                    old_field_names : arrOld,
                    field_data : arrData,
                    type : type
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                   loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save "+type+" fields ",false);
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo(type+" fields saved successfully ",false);   
                    }
                } 
          });
  }
   
  function removeField(id,name,type,svc){
    var conf=confirm("Remove this field?, this action cannot be undone");
    if(!conf){
      return; 
    }
    var div=dom.el(id);
    var form=dom.el("main-view-display");
    form.removeChild(div);
    if(name===""){
      return;  
    }
    var json={
                 request_header : {
                     request_msg : "remove_field",
                     request_svc : svc
                  },
                  
                  request_object : { 
                    name : name,
                    type : type
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to remove field ");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("field removed successfully");   
                    }
                } 
          });
    
  }
  
  
  
      
   