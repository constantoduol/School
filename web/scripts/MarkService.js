var allClasses = [];
var allStreams = [];
var allSubjects = [];
var markData = {};
var headerData = [];
var marksheetData = {};
var listeners = {};
var initData = [];
var latestChange = [];
var currentHandsonId;
var sortedData = [];
var teacherSubjects={};
var handsonInstance;
var lastColumn = "GRADE";
var streamPos = 0;
var namePos = 3;
var totalLowerCol = 3;
var columnOffset = 4;

/*
 * this function is used to sort mark data on a given column in ascending order(smallest to largest)
 * @param col the column we are currently sorting on, this is a integer value
 * @param id this is the id of the header of the column we are sorting on. we need this id in order
 *        to change the onclick handler on the header to sortMarkDataDesc
 */
function sortMarkDataAsc(col,id){
  var length = initData.length;
  var data=cloneArray(initData);
  var marks=data.splice(0,length-4);
  var footers=data;
   marks=marks.sort( function( a, b ){
  // Sort by the 2nd value in each array
   var num1=correctValue(a[col]);
   var num2=correctValue(b[col]);
   if ( num1 === num2 ) return 0;
     return num1 > num2 ? -1 : 1;
  });
  marks=marks.concat(footers);
  initData=marks;
  newHandsOn();
  dom.el(id).attr("onclick","sortMarkDataDesc(\""+col+"\",\""+id+"\")");
}


/*
 * this function is used to sort mark data on a given column in descending order(largest to smallest)
 * @param col the column we are currently sorting on, this is a integer value
 * @param id this is the id of the header of the column we are sorting on. we need this id in order
 *        to change the onclick handler on the header to sortMarkDataAsc
 */
function sortMarkDataDesc(col,id){
  var length=initData.length;
  var data=cloneArray(initData);
  var marks=data.splice(0,length-4);
  var footers=data;
   marks=marks.sort( function( a, b ){
  // Sort by the 2nd value in each array
   var num1=correctValue(a[col]);
   var num2=correctValue(b[col]);
   if ( num1 === num2 ) return 0;
     return num1 < num2 ? -1 : 1;
  });
  marks=marks.concat(footers); //remeber we never sort on the footers, we sort the mark data and then append the footers
  initData=marks;
  newHandsOn(); //create a new instance of the grid
  dom.el(id).attr("onclick","sortMarkDataAsc(\""+col+"\",\""+id+"\")"); //change the onclick handler of the header
}

function schoolDetailView(){
   var mainDiv=dom.newEl("div");
   var buttonDiv=dom.newEl("div");
   var displayDiv=dom.newEl("div");
   displayDiv.attr("id","school_detail_area");
   var saveButton=dom.newEl("input");
   saveButton.attr("type","button");
   saveButton.attr("class","btn btn-primary btn-medium");
   saveButton.attr("onclick","javascript:saveSchoolFields()");
   saveButton.attr("value","Save Fields");
   saveButton.attr("style","margin-left : 5px");
   
   var addButton=dom.newEl("input");
   addButton.attr("type","button");
   addButton.attr("class","btn btn-primary btn-medium");
   addButton.attr("onclick","javascript:addSchoolField()");
   addButton.attr("value","Add Field");
   
   var allButton=dom.newEl("input");
   allButton.attr("type","button");
   allButton.attr("class","btn btn-primary btn-medium");
   allButton.attr("onclick","javascript:allSchoolFields()");
   allButton.attr("value","All Fields");
   allButton.attr("style","margin-left : 5px");
   buttonDiv.add(addButton);
   buttonDiv.add(saveButton);
   buttonDiv.add(allButton);
   mainDiv.add(displayDiv);
   mainDiv.add(buttonDiv);
   var form=new Form(null,"main-view-form");
   setTitle("School Details View");
   form.add(mainDiv);
   form.showForm();
}

function addSchoolField(){
  var inputKey=dom.newEl("input");
  inputKey.attr("type","text");
  var inputValue=dom.newEl("input");
  inputValue.attr("type","text");
  inputValue.attr("class","input-xxlarge");
  var div=dom.newEl("div");
  div.add(inputKey);
  div.add(inputValue);
  CloseDiv(div,"school_detail_area",null);
}

function saveSchoolFields(){
   var elements=dom.el("school_detail_area").children;
   var keys=[];
   var values=[];
   for(var x=0; x<elements.length; x++){
     var key=elements[x].children[1].children[0].value;
     var value=elements[x].children[1].children[1].value;
     if(key.trim()!==""){
        keys.push(key);
        values.push(value);
     }
   }
     var json={
         request_header : {
             request_msg : "save_school_details",
             request_svc :"mark_service"
             },
        request_object : {  
            school_keys : keys,
            school_values : values
         }
     };
    Ajax.run({
        url : serverUrl,
        type : "post",
        data : json,
        loadArea : "load_area",
        error : function(err){
            setInfo("An error occurred when attempting to save school details");
        },
        success : function(json){
             var resp=json.response.data;
             if(resp==="success"){
                 setInfo("School details saved successfully"); 
             }
             else{
                 setInfo("School details saving failed");  
              }
           } 
          }); 
   
}

function allSchoolFields(){
     var json={
         request_header : {
             request_msg : "all_school_details",
             request_svc :"mark_service"
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
            setInfo("An error occurred when attempting to fetch school details");
        },
        success : function(json){
             var resp=json.response.data;
             displaySchoolDetails(resp);
           } 
          }); 
   
}

function displaySchoolDetails(resp){
   var keys=resp["SCHOOL_KEY"];
   var values=resp["SCHOOL_VALUE"];
   var div=dom.newEl("div");
   for(var x=0; x<keys.length; x++){
      var txt=dom.newEl("label");
      txt.innerHTML="<b>"+keys[x]+"</b>";
      var value=document.createTextNode(values[x]);
      var br=dom.newEl("br");
      div.add(txt);
      div.add(value);
      div.add(br);
   }
  CloseDiv(div,"main-view-form",null);
}

function studentReportView(){
  //fetch all students
    var classId=ui.dropdown.getSelected("class_select");
    var streamId=ui.dropdown.getSelected("stream_select");
    var exams=$("#exam_select").val();
    var openAll=dom.el("open_all_report_forms");
    openAll.attr("onclick","javascript:report.openAllReportForms(\""+classId+"\",\""+streamId+"\",\""+exams+"\")");
    var json1={
        request_header : {
            request_msg : "student_report_data",
            request_svc :"mark_service"
           },
       request_object : { 
          stream_id :streamId,
          class_id :classId
        }
     };
              
    Ajax.run({
        url : serverUrl,
        type : "post",
        data : json1,
        loadArea : "load_area",
        error : function(err){
            setInfo("An error occurred when attempting to fetch student report data");
         },
         success : function(json){
             displayStudentReportData(json.response.data);
           } 
       }); 
}

function displayStudentReportData(resp){
  var div = dom.el("report_data_div");
  var container;
  if(div){
     div.innerHTML=""; 
     container=div;
  }
  else{
     container=dom.newEl("div");
     container.attr("id","report_data_div");
    
  }
 
  var names=resp["STUDENT_NAME"];
  var ids=resp["ID"];
  var classes=resp["STUDENT_CLASS"];
  var streams=resp["STUDENT_STREAM"];
  var table=dom.newEl("table");
  var exams=$("#exam_select").val();
  table.attr("class","table table-condensed table-bordered");
  var tr=dom.newEl("tr");
  var no=dom.newEl("th");
  no.innerHTML="No";
  var name=dom.newEl("th");
  name.innerHTML="Name";
  tr.add(no);
  tr.add(name);
  table.add(tr);
  for(var x=0; x<names.length; x++){
     var tr1=dom.newEl("tr");
     var td1=dom.newEl("td");
     var td2=dom.newEl("td");
     var td3=dom.newEl("td");
     td1.innerHTML=(x+1);
     var a=dom.newEl("a");
     a.attr("href","#");
     a.attr("onclick","javascript:report.openReportForm(\""+names[x]+"\",\""+ids[x]+"\",\""+classes[x]+"\",\""+streams[x]+"\",\""+exams+"\",false)");
     a.innerHTML=names[x];
     var a1=dom.newEl("a");
     a1.attr("href","#");
     a1.attr("onclick","javascript:fetchStudentTrend(\""+names[x]+"\",\""+ids[x]+"\")");
     a1.innerHTML="View Trend";
     td3.add(a1);
     td2.add(a);
     tr1.add(td1);
     tr1.add(td2);
     tr1.add(td3);
     table.add(tr1);
  }
 
 container.add(table);
 dom.el("main-view-form").add(container);
}

function generateStudentTrend(name,resp){
  var id=Math.floor(Math.random()*10000000);
  var win=window.open("",id,"width=800,height=650,scrollbars=yes,resizable=yes");
  win.document.write("<html><head>");
  win.document.write("<title>"+name+"</title>");
  win.document.write("<script src='scripts/jquery-1.9.1.js'></script>");
  win.document.write("<script type='text/javascript' src='scripts/raphael-min.js'></script>");
  win.document.write("<script type='text/javascript' src='scripts/morris.min.js'></script>");
  win.document.write("<script type='text/javascript' src='scripts/ui.js'></script>");
  win.document.write("<link href='scripts/morris.css' rel='stylesheet'>");
  win.document.write("</head>");
  win.document.write("<h3>AVERAGE</h3>");
  win.document.write("<div id='average'></div>"); 
  win.document.write("<div id='graph_area'></div>");
  var func=function(){
    win.document.write("<script>");
    win.document.write("Morris.Line({"+
        "element: 'average',"+
        "parseTime: false,"+
        "data: [");
            for(var x=resp.exam_names.length-1; x>-1; x--){
                if(!resp.average.average[x]){
                  continue;  
                }
                win.document.write("{x: '"+resp.exam_names[x]+"', y: "+resp.average.average[x]+"},"); 
            }
    win.document.write("],"+
         "xkey: 'x',"+
         "ykeys: ['y'],"+
         "labels: ['Marks']"+
         "})");
   win.document.write("</script>");
   ui.table("average",["Exams","Average","Grade","Deviation"],[resp.exam_names,resp.average.average],false);
  };
   
   setTimeout(func,1000);
   var ids=[];
   var func2=function(){
   var area=win.document.getElementById("graph_area");
   for(var subject in resp.subject_data[0]){
        var hr=win.document.createElement("hr");
        hr.setAttribute("style","height : 5px; background : #ADD8E6; margin-bottom : 30px");
        area.appendChild(hr);
        var header=win.document.createElement("h3");
        header.innerHTML=subject;
        area.appendChild(header);
        var id=Math.floor(Math.random()*1000000)
        var div=win.document.createElement("div");
        id="subject_"+id;
        div.setAttribute("id",id);
        area.appendChild(div); 
        ids.push(id);
   }
   };
   setTimeout(func2,500);
   var func1=function(){
   var count=0;
   for(var subject in resp.subject_data[0]){
        win.document.write("<script>");
        win.document.write("Morris.Line({"+
                "element: '"+ids[count]+"',"+
                "parseTime: false,"+
                "data: [");
        for(var x=resp.subject_data[0][subject].length-1; x>-1; x--){
            if(!resp.subject_data[0][subject][x]){
               continue;
            }
            win.document.write("{x: '"+resp.exam_names[x]+"', y: "+resp.subject_data[0][subject][x]+"},"); 
        }
        win.document.write("],"+
                 "xkey: 'x',"+
                 "ykeys: ['y'],"+
                 "labels: ['Marks']"+
                 "})");
         win.document.write("</script>");
         count++;
     }
   };
   setTimeout(func1,1000);
  }
 


function fetchStudentTrend(name,id){
  var json={
                 request_header : {
                     request_msg : "student_trend",
                     request_svc : "mark_service"
                  },
                  request_object : { 
                     student_id : id    
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch student trend");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    generateStudentTrend(name,resp);
                } 
          }); 
            
}

function reportView(){
  var form=new Form(null,"main-view-form");
  setTitle("Report Form View");
  var buttonDiv=dom.newEl("div");
  buttonDiv.attr("id","button_area");
  var controlTable=dom.newEl("table");
  controlTable.attr("style","border: solid #DDD 2px;padding: 10px;background: #F5F5DC;");
  controlTable.attr("id","control_div");
  controlTable.attr("class","table");

  var examSelect=dom.newEl("select");
  examSelect.attr("id","exam_select");
  examSelect.attr("class","multiselect");
  examSelect.attr("multiple","multiple");
  
 var openAll=dom.newEl("input");
 openAll.attr("type","button");
 openAll.attr("style","margin-left : 5px");
 openAll.attr("class","btn btn-primary btn-medium");
 openAll.attr("value","Open All");
 openAll.attr("id","open_all_report_forms");
 var tr=dom.newEl("tr");
 var th1=dom.newEl("th");
 var th2=dom.newEl("th");
 var th3=dom.newEl("th");
 var th4=dom.newEl("th");
 th1.innerHTML="Exam";
 th2.innerHTML="Class";
 th3.innerHTML="Stream";
 th4.innerHTML="Template";
 tr.add(th1);
 tr.add(th2);
 tr.add(th3);
 tr.add(th4);
 var tr1=dom.newEl("tr");
 var td1=dom.newEl("td");
 var td2=dom.newEl("td");
 td2.attr("id","class_select_area");
 var td3=dom.newEl("td");
 td3.attr("id","stream_select_area");
 var td4=dom.newEl("td");
 td4.attr("id","template_select_area");
 td1.add(examSelect);
 ui.dropdown.add("class_select_area","class_select",[],[]);
 ui.dropdown.onselect("class_select","studentReportView()");
 ui.dropdown.add("stream_select_area","stream_select",[],[]);
 ui.dropdown.onselect("stream_select","studentReportView()");
 tr1.add(td1);
 tr1.add(td2);
 tr1.add(td3);
 tr1.add(td4);
 var td5=dom.newEl("td");
 td5.add(openAll);
 tr1.add(td5);
 controlTable.add(tr);
 controlTable.add(tr1);
  
  var main=dom.el("main-view-form");
  main.add(controlTable);
  main.add(buttonDiv);
 
           var json1={
                 request_header : {
                     request_msg : "all_streams,all_exams,all_classes",
                     request_svc :"mark_service,mark_service,mark_service"
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
                    var streams = json.response.mark_service_all_streams;
                    allStreams = streams;
                    var func=function(){
                          streams["STREAM_NAME"].unshift("All");
                          streams["ID"].unshift("all");
                          ui.dropdown.add("stream_select_area","stream_select",streams["STREAM_NAME"],streams["ID"]);
                    };
                    dom.waitTillElementReady("stream_select", func);
                    
                    
                    var exams = json.response.mark_service_all_exams;
                    var func=function(){
                        populateSelect("exam_select", exams["EXAM_NAME"],exams["ID"]);
                        $('.multiselect').multiselect({
                           buttonText : function(options,select){
                              return options.length+" EXAMS";
                           },
                             onChange: function(element, checked) {
                                 studentReportView();
                            }
                        }); //initialise multiselects
                    };
                    dom.waitTillElementReady("exam_select", func);
                    
                    var classes = json.response.mark_service_all_classes;
                    allClasses = classes;
                    var func=function(){
                       ui.dropdown.add("class_select_area","class_select",classes["CLASS_NAME"],classes["ID"]);
                    };
                    dom.waitTillElementReady("class_select", func);
                    
                } 
          }); 
          
     report.populateTemplates(); //populate report form templates select
}

function schoolView(){
    var form=new Form(null,"main-view-form");
    form.showForm();
    setTitle("School Analysis");
    var classSelect = dom.newEl("select");
    classSelect.attr("id", "class_select");
    classSelect.attr("style","width : 200px");
    classSelect.attr("onchange", "javascript:studentsAndMarks()");
    var opt2 = dom.newEl("option");
    opt2.innerHTML = "All";
    opt2.value = "all";
    classSelect.add(opt2);

    var streamSelect = dom.newEl("select");
    streamSelect.attr("id", "stream_select");
    streamSelect.attr("style","width : 200px");
    streamSelect.attr("onchange", "javascript:studentsAndMarks()");
    var opt1 = dom.newEl("option");
    opt1.innerHTML = "All";
    opt1.value = "all";
    streamSelect.add(opt1);

    var subjectSelect = dom.newEl("select");
    subjectSelect.attr("id", "subject_select");
    subjectSelect.attr("style","width : 200px");
    subjectSelect.attr("onchange", "javascript:studentsAndMarks()");
    var opt = dom.newEl("option");
    opt.innerHTML = "All";
    opt.value = "all";
    subjectSelect.add(opt);

    ui.table("main-view-form",
            ["Class","Stream","Subject"],
            [[classSelect],[streamSelect],[subjectSelect]],
            false,
            "background : #F5F5DC;border: 2px solid #F5F5DC; position : fixed; width : auto;z-index :2;zoom:84%"
        ); 
}

function markView(){
     var names=[
         "<img src='img/grid.png'> MarkSheet View",
         "<img src='img/report_form.png'> Report View"
        
     ];
    // var links=["javascript:markView()","javascript:reportView()","javascript:schoolView()"];
     var links=["javascript:markView()","javascript:reportView()"];
     var adminNames=[
          "<img src='img/exam.png'> Exams",
          "<img src='img/marksheet_design.png'> MarkSheet Design",
          "<img src='img/edit.png'> ReportForm Design",
          "<img src='img/edit.png'> Edit School Details",
          "<img src='img/edit.png'> Edit Exam Fields"
      ];
     var adminLinks=[
         "javascript:examView()",
         "javascript:marksheetDesignView()",
         "javascript:report.reportDesignView()",
         "javascript:schoolDetailView()",
         "javascript:editFields('exam','edit_mark_service')"
      ];
     var menu=new Menu(names,links,adminNames,adminLinks);
     var form=new Form(menu,"main-view-form");
     form.showForm();
     setTitle("Marksheet Grid View");
     var markDiv=dom.newEl("div");
     currentHandsonId = new Date().getTime() + "_handson";
     markDiv.attr("id", currentHandsonId);
     markDiv.attr("style","margin-top: 90px; margin-bottom : 100px; z-index : 1");
      
    var classSelect = dom.newEl("select");
    classSelect.attr("id", "class_select");
    classSelect.attr("style","width : 200px");
    classSelect.attr("onchange", "javascript:studentsAndMarks()");

    var streamSelect = dom.newEl("select");
    streamSelect.attr("id", "stream_select");
    streamSelect.attr("style","width : 200px");
    streamSelect.attr("onchange", "javascript:studentsAndMarks()");
    var opt1 = dom.newEl("option");
    opt1.innerHTML = "All";
    opt1.value = "all";
    streamSelect.add(opt1);

    var subjectSelect = dom.newEl("select");
    subjectSelect.attr("id", "subject_select");
    subjectSelect.attr("style","width : 200px");
    subjectSelect.attr("onchange", "javascript:studentsAndMarks()");

    var examSelect = dom.newEl("select");
    examSelect.attr("id", "exam_select");
    examSelect.attr("style","width : 200px");
    examSelect.attr("onchange", "javascript:studentsAndMarks()");
    var opt = dom.newEl("option");
    opt.innerHTML = "All";
    opt.value = "all";
    subjectSelect.add(opt);

    var orderSelect = dom.newEl("input");
    orderSelect.attr("type", "checkbox");
    orderSelect.attr("id", "order_select");
    orderSelect.attr("style", "margin : 15px");
    orderSelect.attr("title", "check to sort alphabetically, uncheck to sort by order of creation");
    orderSelect.attr("onchange", "javascript:studentsAndMarks()");

    var hideSelect = dom.newEl("input");
    hideSelect.attr("type", "checkbox");
    hideSelect.attr("id", "hide_select");
    hideSelect.attr("style", "margin : 15px");
    hideSelect.attr("title", "check to hide papers, uncheck to show papers");
    hideSelect.attr("onchange", "javascript:studentsAndMarks()");
    
    
   var btn=dom.newEl("input");
   btn.attr("type","button");
   btn.attr("class","btn btn-primary btn-medium");
   btn.attr("value","Save");
   btn.attr("onclick","javascript:saveMarkSheet()");
   
   var btn1=dom.newEl("input");
   btn1.attr("type","button");
   btn1.attr("class","btn btn-primary btn-medium");
   btn1.attr("value","Print");
   btn1.attr("style","margin-left : 4px;");
   btn1.attr("onclick","javascript:lauchMarksheetPrintView()");
   ui.table("main-view-form",
            ["Exam","Class","Stream","Subject","Order","Hide papers","Save","Print"],
            [[examSelect],[classSelect],[streamSelect],[subjectSelect],[orderSelect],[hideSelect],[btn],[btn1]],
            false,
            "background: #F5F5DC;border: 2px solid #F5F5DC; position:fixed; width : auto;z-index :2;zoom:84%;border-collapse:separate;border-radius:10px"
        );
    var main = dom.el("main-view-form");
    main.add(markDiv);
    
           var json1={
                 request_header : {
                     request_msg : "all_streams,all_subjects,all_exams,all_classes",
                     request_svc :"mark_service,mark_service,mark_service,mark_service"
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
                    var streams = json.response.mark_service_all_streams;
                    allStreams = streams;
                    var func=function(){
                       populateSelect("stream_select", streams["STREAM_NAME"],streams["ID"]);
                    };
                    dom.waitTillElementReady("stream_select", func);
                    
                    
                    var subjects = json.response.mark_service_all_subjects;
                    
                    allSubjects = subjects;
                    var func=function(){
                       populateSelect("subject_select", subjects["SUBJECT_NAME"],subjects["ID"]);
                    };
                    dom.waitTillElementReady("subject_select", func);
                    
                    var exams = json.response.mark_service_all_exams;
                    var func = function(){
                       populateSelect("exam_select", exams["EXAM_NAME"],exams["ID"]);
                    };
                    dom.waitTillElementReady("exam_select", func);
                    
                    var classes = json.response.mark_service_all_classes;
                    allClasses = classes;
                    var func = function(){
                       populateSelect("class_select", classes["CLASS_NAME"],classes["ID"]);
                    };
                    dom.waitTillElementReady("class_select", func);
                } 
          }); 
            
}


function studentsAndMarks(){
    var streamId=dom.el("stream_select").value;
    var subjectId=dom.el("subject_select").value;
    var examId=dom.el("exam_select").value;
    var clazz=dom.el("class_select").value;
    var order=dom.el("order_select").checked;
    var hidePapers=dom.el("hide_select").checked;
    var userName=window.cookieStorage.getItem("user");
    var json={
                 request_header : {
                     request_msg : "students_and_marks",
                     request_svc :"mark_service"
                  },
                  request_object : { 
                    exam_id : examId,
                    stream_id : streamId,
                    subject_id :subjectId,
                    class_id : clazz,
                    current_user : userName,
                    order : order,
                    hide_papers : hidePapers
                }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch mark data");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    initData=[];
                    marksheetData = {}; //this is important to clear the previous entries after grid refreshes
                    markData = resp;
                    var handson=dom.el(currentHandsonId);
                    currentHandsonId=new Date().getTime()+"_handson_new";
                    handson.attr("id",currentHandsonId);
                    generateGrid(resp);
                } 
          });  
}

function addSpaces(length){
  var space="";
  for(var x=0; x<length; x++){
     space=space+" "; 
  }
  return space;
}

/*
 * this function creates a multidimensional array that is used to populate the mark grid
 */
function createInitialArray(resp){
   var ids=resp.students["ID"];
   var students=resp.students["STUDENT_NAME"];
   //the length of the initial array is given by the number of students plus 4(an empty row, the totals row, the average row,the grade row)
   var length=students.length+4;
   var subjects=resp.subjects["SUBJECT_NAME"];
   var studentStreams=resp.students["STUDENT_STREAM"];
   var papers=resp.papers;
   var width;
   var arr=students;
   //this was added to support functionality of hiding papers in case of many papers
   if(papers["PAPER_NAME"]){
     width=subjects.length+papers["PAPER_NAME"].length+3; //if papers are to be displayed the width
     //of the grid is given by the number of subjects plus the number of papers plus 3(G.total, average and grade)
   }
   else{
      width=subjects.length+3;
      //if we are hiding papers then the width is given by the number of subjects plus 3(G.total, average and grade)
   }
  for(var x=0; x<length; x++){
    for(var y=0; y<width; y++){
        if(y===streamPos){ //when y=0 it means we are populating the first column which is the stream name
           var streamName=allStreams["STREAM_NAME"][allStreams["ID"].indexOf(studentStreams[x])];
           if(initData[x]){
             initData[x][0]=streamName;  
           }
           else{
              initData[x]=[]; 
              initData[x][0]=streamName;
           }
           marksheetData[ids[x]]=[];
        }
        else if(y===namePos){
           initData[x][namePos]=arr[x]; 
        }
        else{
          //slave.push(" ");  //push an empty space for every other thing
           initData[x][y]=" "; 
        }
    }
  }
 
    populateSubjectAndPaperCols(resp);
    calculateInitTotals();
    populateExtraCols(resp);
    
    initData[length-3][totalLowerCol]="Totals";
    initData[length-2][totalLowerCol]="Average";
    initData[length-1][totalLowerCol]="Grade";
    return initData;
}


function populateSubjectAndPaperCols(resp){
  var subjectLengths={};
  var marks = resp.marks;
  for(var x=0; x<marks.student_id.length; x++){ //populate the grid with previous values
     var studentId=marks.student_id[x];
     var paperId=marks.paper_id[x];
     var subjectId=marks.subject_id[x];
     if(resp.subjects.ID.indexOf(subjectId)===-1){
        //only populate subjects that currently belong to this stream
        //marks that exist but are of previously removed subjects will not be populated
        continue;
     }
     var row = markData.students["ID"].indexOf(studentId); //shift the 
     var col = headerData[2].indexOf(paperId);
     var markValue = paperId === subjectId ?  round(correctValue(marks.mark_value[x]),col) : correctValue(marks.mark_value[x]); //round for subjects only
     //-------------------------------------
     if(row<0 || col<0){
        //the row does not exist;
        continue;
     }
     //-----------------------------------------------------this was added to keep track of subject lower averages
     initData[row][col+columnOffset]=markValue; //col+4 because the first column is stream and second is sp, cp and name
  }
  
  for(var x = 0; x < marks.student_id.length; x++){
     var paperId = marks.paper_id[x];
     var studentId = marks.student_id[x];
     var subjectId = marks.subject_id[x];
     if(resp.subjects.ID.indexOf(subjectId)===-1){
        //only populate subjects that currently belong to this stream
        //marks that exist but are of previously removed subjects will not be populated
        continue;
     }
     var col = headerData[2].indexOf(paperId);
     var row = markData.students["ID"].indexOf(studentId); 
     var markValue = round(correctValue(marks.mark_value[x]), col );
     if(!subjectLengths[paperId]){
       subjectLengths[paperId]=0;  
     }
     if(row < 0 || col < 0){
        continue;
     }
     subjectLengths[paperId]=++subjectLengths[paperId];
     var result = evaluateChanges(col,row);
     calculateLowerTotals(result,markValue,0, col+columnOffset ,subjectLengths[paperId],true); 
  } 
}

function populateExtraCols(resp){
     //here we populate the grid with extra column values
  var col=headerData[4].indexOf(lastColumn)+1; //we start from the column immediately after lastColumn to populate the extra columns
  for(var key in resp.extra_col_data ){
      if(key==="ID"){
         continue; //dont show the ID column it is only used to order the data correctly
      }
      for(var x=0; x<resp.extra_col_data[key].length; x++){
        var studentId=resp.extra_col_data["ID"][x];
        var row=markData.students["ID"].indexOf(studentId);
        initData[row][col]=resp.extra_col_data[key][x];  
        row++;
      }  
      col++;
  } 
}

function marksheetDesignView(){
    var form = new Form(null,"main-view-form");
    setTitle("Marksheet Design View");
    var select=dom.newEl("select");
    select.attr("id","design_class_select");
    var btn=dom.newEl("input");
    btn.attr("type","button");
    btn.attr("class","btn btn-primary btn-medium");
    btn.attr("value","Open Design");
    btn.attr("style","margin-left : 5px; margin-bottom : 10px");
    btn.attr("onclick","javascript:fetchMarkSheetDesign()"); 
    form.add(select);
    form.add(btn);
       var json1={
                 request_header : {
                     request_msg : "all_classes,all_fields,all_subjects",
                     request_svc :"edit_mark_service,edit_mark_service,edit_mark_service"
                  },
                  request_object : { 
                     type : "student"  
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json1,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all classes");
                  },
                  success : function(json){
                     var classes=json.response.edit_mark_service_all_classes;
                     var classNames = []; //dont show archived records
                     var classIds = [];
                     for(var x=0; x<classes["ID"].length; x++){
                       if(classes["ID"][x].indexOf("AR_") === -1){
                         classNames.push(classes["CLASS_NAME"][x]); 
                         classIds.push(classes["ID"][x]);
                       }  
                    }
                    populateSelect("design_class_select",classNames,classIds);
                    
                    allFields = json.response.edit_mark_service_all_fields;
                    
                    var subjects = json.response.edit_mark_service_all_subjects;
                    allSubjects = subjects;
                    generateMarksheetDesign(form);
                } 
          }); 
        
}

function generateMarksheetDesign(form){
  var subjects = allSubjects["SUBJECT_NAME"];
  var subjectIds = allSubjects["ID"];
  var x = 0;
  for(;x < subjects.length; x++){
     var input = dom.newEl("input");
     var label = dom.newEl("label");
     var select = dom.newEl("select");
     select.attr("id",subjectIds[x]);
     select.attr("style","width : 50px");
     label.innerHTML = subjects[x];
     input.attr("type","text");
     input.attr("class","input-xxlarge");
     input.attr("id","mark_sheet_text"+x);
     input.attr("subject_id",subjectIds[x]);
     form.add(label);
     form.add(input);
     form.add(select);
     populateSelect(subjectIds[x],[0,1,2,3,4],[0,1,2,3,4]);
  }
 
  var br = dom.newEl("br");
  var btn = dom.newEl("input");
  btn.attr("type","button");
  btn.attr("class","btn btn-primary btn-medium");
  btn.attr("value","Save Design");
  btn.attr("onclick","javascript:saveMarkSheetDesign()");
  
  var gprecision = dom.newEl("select");
  gprecision.attr("style","width : 50px");
  gprecision.attr("id","g_precision");
  
  var glabel = dom.newEl("label");
  glabel.innerHTML="Grand Total Formula";
  var gtotal=dom.newEl("textarea");
  gtotal.attr("style","width : 800px; height : 100px");
  gtotal.attr("placeholder","Grand total formula");
  gtotal.attr("id","gtotal_formula");
  
  var aprecision = dom.newEl("select");
  aprecision.attr("style","width : 50px");
  aprecision.attr("id","a_precision");
   
  var alabel=dom.newEl("label");
  alabel.innerHTML="Average Formula";
  var atotal=dom.newEl("textarea");
  atotal.attr("style","width : 800px; height : 100px");
  atotal.attr("placeholder","Average formula");
  atotal.attr("id","average_formula");
  

  form.add(glabel);
  form.add(gtotal);
  form.add(gprecision);
  form.add(alabel);
  form.add(atotal);
  form.add(aprecision);
  form.add(br);
  form.add(btn);
  
  populateSelect("g_precision",[0,1,2,3,4],[0,1,2,3,4]);
  populateSelect("a_precision",[0,1,2,3,4],[0,1,2,3,4]);
  
  form.add(dom.newEl("hr"));
  var div=dom.newEl("div");
  var h3=dom.newEl("h3");
  var add=dom.newEl("input");
  add.attr("class","btn btn-primary");
  add.attr("value","Add Student Field");
  add.attr("onclick","javascript:addExtraField()");
  
  var save=dom.newEl("input");
  save.attr("class","btn btn-primary");
  save.attr("value","Save Student Fields");
  save.attr("onclick","javascript:saveExtraMarkSheetColumns()");
  save.attr("style","margin-left : 10px");
  
  var div1=dom.newEl("div");
  div1.attr("id","all_student_fields");
  h3.innerHTML="Extra Marksheet Columns";
  div.attr("style","border : 2px solid #ddd; padding : 10px");
  div.add(h3);
  div.add(div1);
  div.add(add);
  div.add(save);
  
  form.add(div);
  form.showForm();
  fetchExtraMarkSheetColumns(); //fetch any extra marksheet fields
  
}

function fetchExtraMarkSheetColumns(){
  var json={
          request_header : {
             request_msg : "fetch_extra_mark_sheet_columns",
             request_svc :  "mark_service"
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
                setInfo("An error occurred when attempting to fetch extra marksheet columns");
              },
              success : function(json){
                var resp=json.response.data;
                var fields=resp.split(",");
                for(var x=0; x<fields.length; x++){
                   var id=addExtraField(); 
                   dom.el(id).value=fields[x];
                }
              } 
          });    
}

function saveExtraMarkSheetColumns(){
    var fields=[];
    var divs=dom.el("all_student_fields").children;
    for(var x=0; x<divs.length; x++){
       var select=dom.el("all_student_fields").children[x].children[1].firstChild;
       if(fields.indexOf(select.value)===-1){
          fields.push(select.value);  
       }
    }
    var json={
          request_header : {
             request_msg : "save_extra_mark_sheet_columns",
             request_svc :  "edit_mark_service"
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
                setInfo("An error occurred when attempting to save extra marksheet columns");
              },
              success : function(json){
                var resp=json.response.data;
                if(resp==="success"){
                   setInfo("Extra marksheet columns saved");  
                }
                else{
                  setInfo("Saving extra marksheet columns failed");   
                }
              } 
          });  
}


function fetchMarkSheetDesign(){
  var classId=dom.el("design_class_select").value;
  var json={
                 request_header : {
                     request_msg : "fetch_mark_sheet_design",
                     request_svc :"mark_service"
                  },
                 request_object : {
                    class_id : classId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch mark sheet designs");
                  },
                  success : function(json){
                    var resp = json.response.data;
                    var ids = allSubjects["ID"];
                    var subIds = resp["SUBJECT_ID"];
                    var designs = resp["DESIGN"];
                    for(var x = 0; x < ids.length; x++){
                       var txt = dom.el("mark_sheet_text"+x); 
                       var id = txt.getAttribute("subject_id");
                       var value=designs[subIds.indexOf(id)];
                       txt.value=value;
                       var precId = "pre_" + ids[x].substring(0, 4);
                       var subPrec = designs[subIds.indexOf(precId)];
                       dom.el(ids[x]).value = subPrec;
                    }
                   var grandFormula=designs[subIds.indexOf("grand")];
                   var averageFormula=designs[subIds.indexOf("average")];
                   var a_prec = designs[subIds.indexOf("a_prec")];
                   var g_prec = designs[subIds.indexOf("g_prec")];
                   dom.el("gtotal_formula").value=grandFormula;
                   dom.el("average_formula").value=averageFormula;
                   dom.el("a_precision").value = a_prec;
                   dom.el("g_precision").value = g_prec;
                } 
          });  
}

function saveMarkSheetDesign(){
  var subjects = allSubjects["SUBJECT_NAME"];
  var classId = dom.el("design_class_select").value;
  var gtotal = encodeURIComponent(dom.el("gtotal_formula").value.replace(/\n|\r/g,""));
  var average = encodeURIComponent(dom.el("average_formula").value.replace(/\n|\r/g,""));
  var aprecision = dom.el("a_precision").value;
  var gprecision = dom.el("g_precision").value;
  var subjectIds = [];
  var designValues = [];
  var subjectPrecisions = [];
  for(var x = 0; x < subjects.length; x++){
     var id = "mark_sheet_text"+x;
     var input = dom.el(id);
     var subjectId = input.getAttribute("subject_id");
     var designValue = encodeURIComponent(input.value.replace(/\n|\r/g,""));
     subjectIds.push(subjectId);
     designValues.push(designValue);
     var sPrecision = dom.el(subjectId).value;
     subjectPrecisions.push(sPrecision);
  }
   var json={
                 request_header : {
                     request_msg : "save_mark_sheet_design",
                     request_svc :"edit_mark_service"
                  },
                 request_object : {
                    class_id : classId,
                    subject_ids : subjectIds,
                    design_values : designValues,
                    average_formula : average,
                    grand_formula : gtotal,
                    a_precision : aprecision,
                    g_precision : gprecision,
                    subject_precisions : subjectPrecisions
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save mark sheet design");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Mark sheet design saved successfully"); 
                    }
                    else{
                       setInfo("Mark sheet design saving failed");  
                    }
                } 
          });
}

function saveMarkSheet(){
  var examId = dom.el("exam_select").value;
  var stream = dom.el("stream_select").value;
  var clazz = dom.el("class_select").value;
  var json={
                 request_header : {
                     request_msg : "save_mark_sheet",
                     request_svc :"mark_service"
                  },
                  request_object : { 
                    mark_data : marksheetData,
                    exam_id : examId,
                    stream_id : stream,
                    class_id : clazz
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save marksheet");
                  },
                  success : function(json){
                   var resp=json.response.data;
                   if(resp==="success"){
                      setInfo("Mark sheet saved successfully"); 
                   }
                  else{
                    setInfo("Mark sheet saving failed");   
                  }
                } 
          });     
}

/*
 * here we create a new instance of the mark grid
 */
function newHandsOn(){
   var $container = $("#"+currentHandsonId);
   handsonInstance=$container;
   $container.handsontable({
      data: initData,
      rowHeaders :true,
      colHeaders : headerData[0],
      contextMenu : false,
      columns: headerData[1],
      width : maxWidth,
      manualColumnResize : true,
      allowInvalid : false,
      
      afterChange : function(changes,source){
         if(!changes){
           return;  
         }
         if(source==="loadData"){
           //these are not edit changes  
         }
         else{
           for(var y=0; y<changes.length; y++){
             var latestRow=latestChange[0];
             var latestCol=latestChange[1];
             var latestValue=latestChange[3];
             var row = changes[y][0];
             var col = changes[y][1];
             var oldValue=correctValue(changes[y][2]);
             var newValue=correctValue(changes[y][3]);
             if(latestRow===row && latestCol===col && latestValue===newValue){
               continue;
             }
             
             if(newValue===oldValue){
                continue;
             }
             saveChanges(newValue,col,row); //2
             var result = evaluateChanges(col,row);
             calculateRightTotals(row);
             calculateLowerTotals(result,newValue,oldValue,col,false);
             $container.handsontable("render");
             latestChange=changes[y];
          }
         }
       },
      cells: function (row, col, prop) {
          var cellProperties = {};
          var length=initData.length;
         // var colLength=headerData[3].length+7; //+7 due to columns stream,name,g.total,average,grade,sp,cp
          var lastColIndex = headerData[4].indexOf(lastColumn)+1;
         
          
          if (col===0 || col===3 || col >= lastColIndex) {
             cellProperties.readOnly = true; 
             cellProperties.renderer = firstColRenderer; //this is the rendering on stream and student name and any extra columns
          }
          else if( col=== (lastColIndex - 3) || col===(lastColIndex -1 ) || col=== (lastColIndex -2) ){
            cellProperties.readOnly = true; 
            cellProperties.renderer = rightMarkRenderer;  //rendering of G.total, average and grade
          }
          else if(col===1 || col=== 2){
            cellProperties.readOnly = true; 
            cellProperties.renderer = positionsRenderer;  //rendering of SP and CP
          }
          else if(allSubjects["ID"].indexOf(headerData[2][col-columnOffset]) > -1){
             cellProperties.renderer = subjectsRenderer; //these is the rendering of subject columns -4 because of the first four columns
          }
          else{
            cellProperties.renderer = normalMarkRenderer; //this is the rendering of normal mark columns
          }
          
          if(row < length && row > (length-5)){
             cellProperties.readOnly = true; 
             cellProperties.renderer = lowerMarkRenderer; //this is the rendering on the lower totals
          }
          return cellProperties;
        },
        afterColumnResize : function(col,newSize){
             headerData[1][col].width = newSize;
        }
    });   
}

function marksheetPrintViewUI(){
   var titleLabel = dom.newEl("label");
   titleLabel.innerHTML = "Title";
   var title=dom.newEl("input");
   title.attr("type","text");
   title.attr("placeholder","Mark sheet title");
   title.attr("class","input-xxlarge");
   title.attr("style","margin-left : 4px;");
   title.attr("id","mark_sheet_title");
   
   var fontSizeLabel = dom.newEl("label");
   fontSizeLabel.innerHTML = "Font size";
   var selectFontSize=dom.newEl("select");
   selectFontSize.attr("id","mark_sheet_font");
   
   var fontFaceLabel = dom.newEl("label");
   fontFaceLabel.innerHTML = "Font type";
   var selectFontFace=dom.newEl("select");
   selectFontFace.attr("id","mark_sheet_font_face");
   var modalArea = dom.el("modal-content");
   modalArea.add(titleLabel);
   modalArea.add(title);
   modalArea.add(fontSizeLabel);
   modalArea.add(selectFontSize);
   modalArea.add(fontFaceLabel);
   modalArea.add(selectFontFace);
   populateSelect("mark_sheet_font",["small font","medium font","large font","very large font"],[12,16,20,24]);
   populateSelect("mark_sheet_font_face",["Arial","Verdana","Calibri"],["arial","verdana","calibri"]);
}

function lauchMarksheetPrintView(){
  ui.modal("Print Marksheet","marksheetPrintViewUI()","marksheetPrintView()");
}

function marksheetPrintView(){
  var title=dom.el("mark_sheet_title").value;
  var fontSize=dom.el("mark_sheet_font").value;
  var fontFace=dom.el("mark_sheet_font_face").value;
  var name=Math.floor(Math.random()*1000000);
  var win=window.open("",name,"width=1200,height=650,scrollbars=yes,resizable=yes");
  with(win.document){
    write("<html>");
    write("<head><title>"+title+"</title>");
    write("<script src='scripts/jquery-1.9.1.js'></script>");
    write("<script src='scripts/jquery.handsontable.full.js'></script>");
    write("<link href='scripts/jquery.handsontable.full.css' rel='stylesheet'>");
    write("<style>");
    write("a {text-decoration : none; }  "+
                      ".handsontable td {font-size : "+fontSize+"px; font-family : "+fontFace+"; } "+
                      ".handsontable th {font-size : "+(parseInt(fontSize)+2)+"px; font-family : "+fontFace+"; }");
    write("</style>");
    write("</head>");
    write("<body>");
    write("<div id='title_area' align='center' style='margin-bottom : 10px;"+
                     "font-size:"+(parseInt(fontSize)+10)+"px;font-family : "+fontFace+"; font-weight:bold'></div>");
    write("<div id='print_show_area' class='handsontable'>");
    write("</body>");
    write("</html>");
  }
  var func=function(){
   var $container = win.$("#print_show_area");
   $container.handsontable({
      data: initData,
      colHeaders : headerData[0],
      contextMenu : false,
      columns: headerData[1],
      width : maxWidth,
      manualColumnResize : true,
      allowInvalid : false,
      cells: function (row, col, prop) {
          var cellProperties = {};
          var length=initData.length;
         // var colLength=headerData[3].length+7; //+7 due to columns stream,name,g.total,average,grade,sp,cp
          var lastColIndex = headerData[4].indexOf(lastColumn)+1;
          if(row<(length-1) && row>(length-5)){
             cellProperties.readOnly = true; 
             cellProperties.renderer = lowerMarkRenderer; //this is the rendering on the lower totals
          }
          
          if (col===0 || col===3 || col >= lastColIndex) {
             cellProperties.readOnly = true; 
             cellProperties.renderer = firstColRenderer; //this is the rendering on stream and student name and any extra columns
          }
          else if( col=== (lastColIndex - 3) || col===(lastColIndex -1 ) || col=== (lastColIndex -2) ){
            cellProperties.readOnly = true; 
            cellProperties.renderer = rightMarkRenderer;  //rendering of G.total, average and right grade
          }
          else if(col===1 || col=== 2){
            cellProperties.readOnly = true; 
            cellProperties.renderer = positionsRenderer;  //rendering of SP and CP
          }
          else if(allSubjects["ID"].indexOf(headerData[2][col-columnOffset]) > -1){
             cellProperties.renderer = subjectsRenderer; //these is the rendering of subject columns -4 because of the first four columns
          }
          else{
            cellProperties.renderer = normalMarkRenderer; //this is the rendering of normal mark columns
          }
          return cellProperties;
        }  
    });   
    var newHeight = parseInt(win.$(".wtHider")[0].style.height)+100+"px";
    win.$(".wtHider")[0].style.height = newHeight;
    win.$("#title_area").html(title);
    win.print();
    win.close();
     
  };
    (function(){
       var time=setInterval(function(){
          if(win.document.getElementById("print_show_area")){
            clearInterval(time); 
            func();
          }  
      },5); 
      
   })();  
}

function generateGrid(resp){
   listeners={};
   latestChange=[];
   var cols=generateColHeaders(resp);
   headerData=cols;
   initData=createInitialArray(resp);
   newHandsOn();
}

function firstColRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.TextCell.renderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  td.style.color = 'black';
  td.style.fontStyle='normal';
}

function rightMarkRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.TextCell.renderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  td.style.color = 'brown';
  td.style.textAlign = 'right';
  td.style.fontStyle='normal';
  td.style.background="#eee";
  cellProperties.type='numeric';
  cellProperties.format='0,0.00';
  return cellProperties;
}

function subjectsRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.TextCell.renderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  td.style.color = 'black';
  td.style.textAlign = 'right';
  td.style.fontStyle='normal';
  td.style.background="#eee";
  cellProperties.type='numeric';
  cellProperties.format='0,0.00';
  return cellProperties;
}

function positionsRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.TextCell.renderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  td.style.color = 'blue';
  td.style.textAlign = 'right';
  td.style.fontStyle='normal';
  td.style.background="#eee";
  cellProperties.type='numeric';
  return cellProperties;
}

function lowerMarkRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.TextCell.renderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  td.style.color = 'black';
  td.style.textAlign = 'right';
  td.style.fontStyle='normal';
  td.style.background="#eee";
  cellProperties.type='numeric';
  cellProperties.format='0,0.00';
  return cellProperties;
}

function normalMarkRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.TextCell.renderer.apply(this, arguments);
  td.style.textAlign = 'right';
  td.style.fontStyle='normal';
  td.style.color="#333333";
  cellProperties.type='numeric';
  return cellProperties;
}



function saveChanges(newValue,col,row){
      //keep track of changes occurring in the grid
      //if this is a new change then note it in the marksheet data
      //if we are changing something that changed before,just update it
      //observers watching -->
      var studentId = markData.students["ID"][row];
      var paperId = headerData[2][col-columnOffset]; //subtract columnOffset because of the name,sp,cp and stream column
      var subjectId = headerData[3][col-columnOffset];
      var data=[paperId,subjectId ,newValue];
           //store this data
      var exists = false;
      for(var x=0; x<marksheetData[studentId].length; x++){
          if(marksheetData[studentId][x][0]===paperId && marksheetData[studentId][x][1]===subjectId){
                 //this is the second edit that is being made so update the previous entry
                 marksheetData[studentId][x][2]=newValue;
                 exists=true;
              }  
      }
      if(!exists){
         marksheetData[studentId].push(data);
     }
}

function evaluateChanges(col,row){
   //this function is responsible for evaluating changes in the grid
   //based on formulas entered in mark sheet design
   //formulas entered are evaluated on the following criteria
   //if a paper name has spaces the spaces are replaced with underscores
   //formulas use only lower case characters
   if(!col){
     return; 
   }
   var listenData = listeners[col];
   if(!listenData){
      return; 
   }
   var headerNames = headerData[4];
   var subjectCol = listenData["subject_col"];
   var formula = listenData["formula_value"];
   var paperNames = listenData["paper_names"];
   for(var x = 0; x < paperNames.length; x++){
      var paperCol = headerNames.indexOf(paperNames[x]);
      var value = correctValue(initData[row][paperCol]);
      var str = "var "+paperNames[x].toLowerCase().replace(/ /g,"_")+" = "+value+" ";
      eval(str);
    }
    var result = eval(formula);
    var oldValue=correctValue(initData[row][subjectCol]);
    result = round(result,subjectCol - columnOffset);
    initData[row][subjectCol] = result;
    saveChanges(result,subjectCol,row); //this is a subject change //1
    return [result,oldValue];
}

/**
 * 
 * @param {int} row the row on the grid
 * @param {boolean} notEntered this is true if we want the length including values that have
 *                  not been entered otherwise it is false to exclude them
 * @returns {Number} the total count of subjects in a row
 */
function getStudentSubjectLength(row,notEntered){
   var count=0;
   var gradeIndex=headerData[4].indexOf(lastColumn); 
   for(var x=columnOffset; x<gradeIndex; x++){
       var val=initData[row][x];
       var subId=headerData[3][x-columnOffset];
       var papId=headerData[2][x-columnOffset];
       if(val && val.toString().trim()===""  || isNaN(val)){
          if(notEntered && subId && subId===papId){ //this means count even mark values for subjects not entered
            count++;  
          }
       } 
       else if(subId && subId===papId){
          count++; //count for subjects only
       }
   }
  return count;
}
/*
 * @param row a row in the grid starting from 0 onwards
 */
function calculateGrandAndAverage(row){
   //get the formula for grand total
    var grandFormula = markData.formulas.DESIGN[markData.formulas.SUBJECT_ID.indexOf("grand")];
    var averageFormula = markData.formulas.DESIGN[markData.formulas.SUBJECT_ID.indexOf("average")];
    var select = dom.el("stream_select");
    var streamName = select.options[select.selectedIndex].innerHTML.toLowerCase().split(" ").join("_");
    if(!grandFormula){
       setInfo("No formula defined for grand total!");
       return;
    }
   //go through the formula looking for the values in the grid
   for(var x=0; x<allSubjects.ID.length; x++){ //we are going to go through all the subjects repl
      var subName = allSubjects.SUBJECT_NAME[x];
      var col = headerData[4].indexOf(subName);
      var subValue = col === -1 || !initData[row][col] || initData[row][col] === " " ? 0 : initData[row][col];
      subName = subName.toLowerCase().split(" ").join("_"); // formulas are subject names in lowercase with spaces replaced with underscores
      grandFormula = grandFormula.split(subName).join(subValue);
      averageFormula = averageFormula.split(subName).join(subValue);
   }
 
   //there is a variable called num that is the number of subjects currently on the grid
   var enteredSubjectsLength= getStudentSubjectLength(row,false);
   var allSubjectsLength =getStudentSubjectLength(row,true);
   grandFormula = grandFormula.split("enteredSubjectsLength").join(enteredSubjectsLength);
   grandFormula = grandFormula.split("allSubjectsLength").join(allSubjectsLength);
   grandFormula = grandFormula.split("currentStream").join("'"+streamName+"'");
   averageFormula = averageFormula.split("enteredSubjectsLength").join(enteredSubjectsLength);
   averageFormula = averageFormula.split("allSubjectsLength").join(allSubjectsLength);
   averageFormula = averageFormula.split("currentStream").join("'"+streamName+"'");
  
   var grandTotal = eval(grandFormula);
   var average=eval(averageFormula);
   return [grandTotal,average];
}


function calculateInitTotals(){
   //here we populate stream and class ranks and grand totals and average
    var studentCount = markData.students.ID.length;
    var rowLength = initData.length;
    var colLength = headerData[3].length + 6; //+6 due to columns stream,name,g.total,average,grade,sp,cp note we dont make it +7 because we count from 0
    var averagePos = colLength - 1; //-1 beacuse it is 1 columns from the end
    var classRankPos = 2; //this is because it is the third column
    var streamRankPos = 1; //this is because it is the second column
    var totalPos = colLength - 2; //-2 because it is 2 columns from the end
    var gradePos = colLength; // because the grade is the last column
    var grandTotalPos = rowLength-3; //-3 because it is 3 rows from the bottom of the grid
    var subjectAveragePos= rowLength-2; //-2 because the average of subjects is on the 2nd row from bottom of grid
    var subjectGradePos = rowLength-1; //the subject grades are on the bottom row of the grid
    var grandTotal = 0;
    var grandAverage = 0;
    var activeRowCount = 0; //this is used in cases where marks entered are less than the student count
    for (var y = 0; y < studentCount; y++) {
        var studentId = markData.students.ID[y];
        var theStudent = markData.student_rank_data[studentId];
        var row = markData.students.ID.indexOf(studentId);
         //if we have one subject selected then we populate the subject ranks and correct subject totals!
        if (theStudent) {
           if(markData.subjects.ID.length===1){
              var totals=calculateGrandAndAverage(row);
              var currentSubjectId=markData.subjects.ID[0];
              if(!isNaN(totals[1])){
                initData[row][classRankPos]= theStudent.subject_ranks[currentSubjectId]; 
                initData[row][totalPos] = round(totals[0],"g"); //subject G.total
                initData[row][averagePos] = round(totals[1],"a");  //subject Average 
                grandTotal=grandTotal+totals[0];
                grandAverage=grandAverage+totals[1];
                activeRowCount++;
                if (markData.grades) {
                    initData[row][gradePos] = getGrade(totals[1]);
                }
              }
           }
           else{
            if(theStudent.grand_total){
                initData[row][streamRankPos] = theStudent.stream_rank ;
                initData[row][classRankPos] = theStudent.class_rank ;
                initData[row][totalPos] = round(theStudent.grand_total,"g"); //student G.total
                initData[row][averagePos] = round(theStudent.average,"a");  //student Average 
                activeRowCount++;
                grandTotal=grandTotal+theStudent.grand_total;
                grandAverage=grandAverage+theStudent.average;
                 if (markData.grades) {
                    initData[row][gradePos] = getGrade(theStudent.average);
                }
            }
           }
        }
       
     }
            
      initData[grandTotalPos][totalPos]=round(grandTotal,"g"); //The total of grand totals
      initData[subjectAveragePos][totalPos]=round(grandTotal/activeRowCount,"a");  //stream average mark out of the total score
      
      initData[grandTotalPos][averagePos]=round(grandAverage,"g"); //The sum of all averages
      initData[subjectAveragePos][averagePos]=round(grandAverage/activeRowCount,"a");  //the average of all averages
      if(markData.grades){
         initData[subjectGradePos][averagePos] = getGrade(grandAverage/activeRowCount);
      }
}

/*
 * @param row{int} the row is an integer on the grid for which we want to evaluate totals
 * @param studentId{string} this is an id representing a student
 * @param len{integer} this is the number of students we are going to use to evaluate the stream average
 *                     this number can be less than the number of total students
 */
function calculateRightTotals(row,len){
      //calculate grand total
      //calculate average
      var colLength=headerData[3].length+6; //+6 due to columns stream,name,g.total,average,grade,sp,cp note we dont make it +7 because we count from 0
      var rowLength=initData.length;
      var averagePos=colLength-1; //-1 beacuse it is 1 column from the end
      var totalPos=colLength-2; //-2 because it is 2 columns from the end
      var gradePos=colLength; // because the grade is the last column
      var grandTotalPos = rowLength-3; //-3 because it is 3 rows from the bottom of the grid
      var subjectAveragePos= rowLength-2; //-2 because the average of subjects is on the 2nd row from bottom of grid
      var subjectGradePos = rowLength-1; //the subject grades are on the bottom row of the grid
      var studentCount = !len ? rowLength-4 : len;  //this is the number of students on the grid, it is the number of rows minus 4 because of, if len is defined we use it instead
      // of student count
      //the totals, average, grade and empty rows
     //we are dealing with changes in subjects only  
     //a change on the grid  way after initialisation of the grid
       
      //read the current values before setting the new ones 
      var currentStudentTotal=correctValue(initData[row][totalPos]); //current student G.Total 
      var currentStudentAverage=correctValue(initData[row][averagePos]);  //current average 
      var currentGrandTotal=correctValue([initData[grandTotalPos][totalPos]]); //current overrall grand total
      var currentAverageTotal=correctValue([initData[grandTotalPos][averagePos]]);
      
      //set new values after reading the old ones
      var totals=calculateGrandAndAverage(row);
      var newStudentTotal = totals[0];
      var newStudentAverage = totals[1]; 
      initData[row][totalPos]=round(newStudentTotal,"g"); //student G.total
      initData[row][averagePos]=round(newStudentAverage,"a");  //student Average 
      
      currentGrandTotal = currentGrandTotal + newStudentTotal - currentStudentTotal;
      currentAverageTotal = currentAverageTotal + newStudentAverage - currentStudentAverage;
      
      initData[grandTotalPos][totalPos]=round(currentGrandTotal,"g"); //The total of grand totals e.g 45,677
      initData[subjectAveragePos][totalPos]=round(currentGrandTotal/studentCount,"a");  //stream average mark out of the total score e.g 320/500
      
      initData[grandTotalPos][averagePos]=round(currentAverageTotal,"g"); //The sum of all averages
      initData[subjectAveragePos][averagePos]=round(currentAverageTotal/studentCount,"a");  //the average of all averages
      if(markData.grades){
         initData[row][gradePos]=getGrade(newStudentAverage); 
         initData[subjectGradePos][averagePos]=getGrade(currentAverageTotal/studentCount);
      }
}

function getGrade(markValue){
    markValue = Math.round(markValue);
    for(var m = 0; m < markData.grades.length; m++){ //set the students grade
        var tempDetails = markData.grades[m].split(",");
        var start = parseFloat(tempDetails[0]);
        var stop = parseFloat(tempDetails[1]);
        var grade = tempDetails[2];
        if(markValue >= start && markValue <= stop){
            return grade;
        }  
    }
    return "X";
}

function round(num,col){ //col a is average and g is grand
   var precId;
   if(col === "a"){
       //this is average
       precId = "a_prec";
   }
   else if(col === "g"){
       precId = "g_prec";
   }
   else {
       precId =  "pre_" + headerData[2][col].substring(0, 4);
   }
   var precision = markData.formulas.DESIGN[markData.formulas.SUBJECT_ID.indexOf(precId)];
   if(!precision){
      precision = 0;
   }
    precision = parseInt(precision);
    num=parseFloat(num);
    var p = num.toFixed(precision).split(".");
    var chars = p[0].split("").reverse();
    var newstr = '';
    var count = 0;
    for (var x in chars) {
        count++;
        newstr = chars[x] + newstr;
    }
   return !p[1] ? newstr : newstr + "." + p[1];
}

function correctValue(value){
    if(value===null || value===undefined || value.toString().trim()===""){
        value=0;   
     }  
    return parseFloat(value);
}

/**
 * 
 * @param {type} result 
 * @param {type} newValue
 * @param {type} oldValue
 * @param {type} col
 * @param {type} len
 * @param {boolean} init this tells us if the grid is being loaded for the first time or not
 * @returns {undefined}
 */
function calculateLowerTotals(result,newValue,oldValue,col,len,init){ //the length part was added to make sure the correct averages are calculated
    //result has two values at 0 is the result from a formula evaluation
    //the second is the old value
    var rowLength = initData.length;
    var grandTotalPos = rowLength-3; //-3 because it is 3 rows from the bottom of the grid
    var subjectAveragePos = rowLength-2; //-2 because the average of subjects is on the 2nd row from bottom of grid
    var subjectGradePos = rowLength-1; //the subject grades are on the bottom row of the grid
    var studentCount = rowLength-4;  //this is the number of students on the grid, it is the number of rows minus 4 because of 
    var currentTotal=correctValue(initData[grandTotalPos][col]);
    oldValue = correctValue(oldValue); 
    newValue = correctValue(newValue); 
    if(newValue===0){
       oldValue=0; 
    } 
    var subjectCol=headerData[3].lastIndexOf(headerData[3][col-columnOffset]); 
    if(result && subjectCol && !init){
       //here we calculate the new total for a subject in case of a change in paper value
       //this is not necessary when we are initialising the grid!
       var subjectCurrentTotal=correctValue(initData[grandTotalPos][subjectCol+columnOffset]);
       var subjectNewTotal=subjectCurrentTotal+parseFloat(result[0])-parseFloat(result[1]);
       
       var subjectAverage;
       if(len){
          subjectAverage=subjectNewTotal/len;  
       }
       else{
          subjectAverage=subjectNewTotal/studentCount;
       }
       initData[grandTotalPos][subjectCol+columnOffset]=round(subjectNewTotal,"g");
       initData[subjectAveragePos][subjectCol+columnOffset] = round(subjectAverage,"a");
       if(markData.grades){
          initData[subjectGradePos][subjectCol+columnOffset] = getGrade(subjectAverage);
       }
    }
    
    var newPaperTotal=currentTotal+newValue-oldValue; 
    var paperAverage;
    if(len){
       paperAverage=newPaperTotal/(len);   
    }
    else{
       paperAverage=newPaperTotal/(studentCount);
    }

    initData[grandTotalPos][col]= round(newPaperTotal,"g"); //the total for the paper
    initData[subjectAveragePos][col]= round(paperAverage,"a"); //this is the average of the paper
    //calculate grades for subjects only i.e. a subject has paper id == subject id
    var papId = headerData[2][col-columnOffset]; //col-4 because the first four columns are stream,sp,cp and name
    var subId = headerData[3][col-columnOffset];
    if(markData.grades && papId === subId){
        initData[subjectGradePos][col] = getGrade(paperAverage);
    }
}

function isReadOnly(teacherSubjects,teacherStreams,subjectId,examDeadline,currentDate){
   var readOnly=false;
   var currStream = dom.el("stream_select").value;
   if(teacherSubjects.indexOf(subjectId)=== -1 || teacherStreams.indexOf(currStream)===-1 ){
    //this teacher does not have access to this subject or stream
	readOnly=true;
   }
    if(currentDate > examDeadline){
      readOnly=true;
    }
    return readOnly;
}

function generateColHeaders(resp){
   var subjectData=resp.subjects;
   var papers=resp.papers;
   var formulas=resp.formulas;
   var teacherSubjects=resp.teacher_subjects["SUBJECT_ID"];
   var teacherStreams=resp.teacher_subjects["STREAM_ID"];
   var examDeadLine=new Date(resp.exam_deadline["EXAM_DEADLINE"]).getTime();
   var headers=[];
   var headerNames=[];
   var columnTypes=[];
   var headerSubjectIds=[];
   var headerPaperIds=[];
   var subNames=papers["SUBJECT_NAME"];
   var paperNames=papers["PAPER_NAME"];
   var paperIds=papers["PAPER_ID"];
   var subjectPaperIds=papers["SUBJECT_ID"];
   var subjects=subjectData["SUBJECT_NAME"];
   var subjectIds=subjectData["ID"];
   var formulaValues=formulas["DESIGN"];
   var formulaSubjectIds=formulas["SUBJECT_ID"];
   var currentColor=0;
   var currentDate=new Date().getTime();
   var colors=["red","green","blue","green","purple","brown","orange"];
   
   headers.push("<b>STREAM</b>"); //the first column is stream column
   headerNames.push("STREAM");
   columnTypes[0]={ 
         type : "text",
         readOnly : true,
         width : 50
   }; 
   headers.push("<b>SP</b>"); 
   headerNames.push("SP");
   columnTypes[1]={
          type: 'text',
          readOnly : readOnly,
          width :40
     };
     
   headers.push("<b>CP</b>"); 
   headerNames.push("CP");
   columnTypes[2]={
          type: 'text',
          readOnly : readOnly,
          width :40
     };
   headers.push("<b>NAME</b>");
   headerNames.push("NAME");
   columnTypes[3]={ 
         type : "text",
         readOnly : true,
         width : 200
   }; 
   if(!subjects){
      setInfo("Error : No subjects added to stream");
   }
   for(var x=subjects.length-1; x>=0; x--){
      if(!subNames){
       //this was added to aid in hide paper functionality, to
       //hide papers we assume that the subject has no other paper at all
       //it is convenient for a large grid with many subjects just before printing
        index=-1; //manually indicate that this subject has no papers
      }
      else{
           var index=subNames.indexOf(subjects[x]); 
           var lastIndex=subNames.lastIndexOf(subjects[x]);
           var formulaValue=formulaValues[formulaSubjectIds.indexOf(subjectIds[x])];
      }
      if(index===-1){
        headers.push("<b><a href='#' id=\"_sortable_"+headers.length+"\" onclick='sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")'>"+subjects[x]+"</a></b>"); 
        headerNames.push(subjects[x]);
          //this subject has no papers so the subject id and paper id are just the same
        headerPaperIds.push(subjectIds[x]);
        headerSubjectIds.push(subjectIds[x]);
        var readOnly=isReadOnly(teacherSubjects,teacherStreams,subjectIds[x],examDeadLine,currentDate);
        columnTypes[headers.length-1]={
          type: 'numeric',
          readOnly : readOnly,
          width : 70
        };
      
      }
      else if(index!==lastIndex){
         //this subject has more than one paper
        var listenData={};
        listenData["paper_cols"]=[];
        listenData["paper_names"]=[];
        listenData["formula_value"]=formulaValue;
        for(var y=index; y<=lastIndex; y++){
           headers.push("<a href='#' id=\"_sortable_"+headers.length+"\" onclick='sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")'><font color='"+colors[currentColor]+"'>"+paperNames[y]+"</font></a>");
           headerNames.push(paperNames[y]);
           headerPaperIds.push(paperIds[y]);
           headerSubjectIds.push(subjectPaperIds[y]);
           listenData["paper_cols"].push(headers.length-1); //save the associated columns
           listenData["paper_names"].push(paperNames[y]); //save the associated column names for evaluating formulas
           var readOnly=isReadOnly(teacherSubjects,teacherStreams,subjectPaperIds[y],examDeadLine,currentDate);
           columnTypes[headers.length-1]={
            type: 'numeric',
            readOnly : readOnly,
            width : 70
           };
          listeners[headers.length-1] = listenData; //register the listener for all papers
        }
        
        currentColor++;
        headers.push("<b><a href='#' id=\"_sortable_"+headers.length+"\" onclick='sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")'>"+subjects[x]+"</a></b>");   
        headerNames.push(subjects[x]);
        headerPaperIds.push(subjectIds[x]);
        headerSubjectIds.push(subjectIds[x]);
        //this subject is disabled and marks cannot be entered directly
        listenData["subject_col"]=headers.length-1;
        columnTypes[headers.length-1]={
          type: 'numeric',
          width :70,
          readOnly : true
        };
      }
      else{
         //this subject has one paper
        var listenData={};
        listenData["paper_cols"]=[];
        listenData["paper_names"]=[];
        listenData["formula_value"]=formulaValue;
        headers.push("<a href='#' id=\"_sortable_"+headers.length+"\" onclick='sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")'><font color='"+colors[currentColor]+"'>"+paperNames[index]+"</font></a>");
        headerNames.push(paperNames[index]);
        listenData["paper_cols"].push(headers.length-1); //save the associated columns
        listenData["paper_names"].push(paperNames[index]);
        listeners[headers.length-1]=listenData;
        headerPaperIds.push(paperIds[index]);
        headerSubjectIds.push(subjectPaperIds[index]);
        var readOnly=isReadOnly(teacherSubjects,teacherStreams,subjectPaperIds[index],examDeadLine,currentDate);
        columnTypes[headers.length-1]={
          type: 'numeric',
          readOnly : readOnly,
          width :70
        };
        headers.push("<b><a href='#' id=\"_sortable_"+headers.length+"\" onclick='sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")'>"+subjects[x]+"</a></b>");  
        headerNames.push(subjects[x]);
        headerPaperIds.push(subjectIds[x]);
        headerSubjectIds.push(subjectIds[x]);
        listenData["subject_col"]=headers.length-1;
        columnTypes[headers.length-1]={
          type: 'numeric',
          width :70,
          readOnly : true
        };
        currentColor++;
        if(currentColor===colors.length-1){
           currentColor=0;
        }
      }
   }
   headers.push("<b><a href='#' id=\"_sortable_"+headers.length+"\" onclick=sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")>G.TOTAL</a></b>"); 
   headerNames.push("G.TOTAL");
   columnTypes[headers.length-1]={
          type: 'numeric',
          width :70,
          readOnly : true
      };
   headers.push("<b><a href='#' id=\"_sortable_"+headers.length+"\" onclick='sortMarkDataAsc("+headers.length+",\"_sortable_"+headers.length+"\")'>AVERAGE</a></b>"); 
   headerNames.push("AVERAGE");
   columnTypes[headers.length-1]={
          type: 'numeric',
          width :70,
          format: '0,0.00',
          readOnly : true
     };
     
   headers.push("<b>GRADE</b>"); 
   headerNames.push("GRADE");
   columnTypes[headers.length-1]={
          type: 'text',
          readOnly : readOnly,
          width :40
     };

    
   //add the extra column headers
   for(var key in resp.extra_col_data){
       if(key==="ID"){
          continue; //dont show the ID extra column
       }
       key=key.replace(/_/g," ");
       headers.push("<b>"+key+"<b>"); 
       headerNames.push(key);
       columnTypes[headers.length-1]={
          type: 'text',
          readOnly : readOnly,
          width : 100
     };  
   }
   
   
   var all=new Array(headers,columnTypes,headerPaperIds,headerSubjectIds,headerNames);
   return all;
}




function deleteExam(){
     var id=dom.el("search_param").getAttribute("current_id");
     if(!id){
        setInfo("No exam specified!");
        return;
     }
     var conf=confirm("Archive Exam?");
     if(!conf){
        return; 
     }
     var json={
                 request_header : {
                     request_msg : "delete_exam",
                     request_svc :"edit_mark_service"
                  },
                  
                  request_object : { 
                    exam_id : id
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to delete exam");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("Exam archived successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("Archiving exam failed: "+json.response.reason);
                    }
                } 
          });  
}


function undeleteExam(examId){
     var conf=confirm("Restore Exam?");
     if(!conf){
        return; 
     }
     var json={
                 request_header : {
                     request_msg : "undelete_exam",
                     request_svc :"edit_mark_service"
                  },
                  
                  request_object : { 
                    exam_id : examId
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  error : function(err){
                    alert("An error occurred when attempting to delete exam");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                      alert("Exam restored successfully ");   
                    }
                    else if(resp==="fail"){
                      alert("Restoring exam failed: "+json.response.reason);
                    }
                } 
          });  
}

 //this function is not in use
 function generateMarkTable(){
   var table=dom.newEl("table");
   table.attr("class","table table-condensed table-bordered");
   var subjectNames=allSubjects["SUBJECT_NAME"];
   var subjectIds=allSubjects["ID"];
   var headers=["SUBJECT","SCORE","GRADE","COMMENTS","SIGN"];
   var colHeader=dom.newEl("tr");
   for(var y=0; y<headers.length; y++){
     var th=dom.newEl("th");
     th.innerHTML=headers[y];
     colHeader.add(th);
   }
   table.add(colHeader);
   for(var x=subjectNames.length-1; x>=0; x--){
       var tr=dom.newEl("tr");
       var subject=dom.newEl("td");
       var mark=dom.newEl("td");
       var grade=dom.newEl("td");
       var comments=dom.newEl("td");
       var sign=dom.newEl("td");
       subject.innerHTML=subjectNames[x];
       subject.attr("id","report_subjects_"+subjectIds[x]);
       tr.add(subject);
       tr.add(mark);
       tr.add(grade);
       tr.add(comments);
       tr.add(sign);
       table.add(tr);
    }
   return table;
 }
 


 //this function is not in use
 function reportDesignView(){
   var div=dom.newEl("div");
   div.attr("id","report_design_view");
   div.attr("style","border: 4px solid black; height : "+(maxHeight-20)+"px; float : left; width : "+(0.8*maxWidth)+"px");
   var div1=dom.newEl("div");
   div1.attr("id","element_design_view");
   div1.attr("style","border: 4px solid black; height : "+(maxHeight-20)+"px; float : right; width : "+(0.2*maxWidth-80)+"px; overflow : auto");

   var markArea=dom.newEl("div");
   markArea.attr("id","mark_design_view");
   markArea.attr("style","border: 2px solid black; height : "+(0.5*maxHeight)+"px; width : "+(0.4*maxWidth)+"px; ");
   var table=generateMarkTable();
   markArea.add(table);
   var form=new Form(null,"main-view-form");
   div.add(markArea);
   form.add(div);
   form.add(div1);
   hideSideMenu();
   $(function() {
         $("#mark_design_view" ).draggable({containment : "parent"});
    });
    var json={
         request_header : {
             request_msg : "all_school_details",
             request_svc :"mark_service"
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
            setInfo("An error occurred when attempting to fetch school details");
        },
        success : function(json){
             var resp=json.response.data;
             displaySchoolDetailsDesign(resp);
           } 
       }); 
 }
 
  //this function is not in use
 function displaySchoolDetailsDesign(resp){
   var keys=resp["SCHOOL_KEY"];
   var area=dom.el("element_design_view");

   for(var x=0; x<keys.length; x++){
      var div=dom.newEl("div");
      var id="element_"+x;
      div.attr("id",id);
      div.attr("style","border : 2px solid lightgray; margin : 2px;width : "+(0.2*maxWidth-100)+"px; position : absolute");
      var txt=dom.newEl("label");
      txt.innerHTML="<b>"+keys[x]+"</b>";
      var br=dom.newEl("br");
      var br1=dom.newEl("br");
      div.add(txt);
      area.add(div);
      area.add(br);
      area.add(br1);
      $(function() {
         $( "#"+id ).draggable();
      });
   }
  
 }

 function examView(){
    var buttonNames=["Create Exam","Update Exam","Archive Exam","All Active Exams","All Archived Exams"];
    var buttonLinks=["javascript:createExam()","javascript:updateExam()","javascript:deleteExam()","javascript:showAllObjects('exam')","javascript:showAllObjects('archive exam')"];
    var subView=dom.newEl("div");
    subView.attr("id","subject_view");
    var form=new Form(null,"main-view-form");
    setTitle("Exam View");
    viewFields('exam',buttonNames,buttonLinks,"mark_service",form,subView);
    var func=function(){
        var search=dom.el("search_param");
        search.attr("onkeyup","javascript:autoSuggest('mark_service')");
    };
    dom.waitTillElementReady("search_param",func);
  }
  
  function updateExam(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var examName;
   var examDeadline;
   var search=dom.el("search_param");
   var examId=search.getAttribute("current_id");
   var currentSearch=search.value;
   if(currentSearch===""){
     setInfo("No exam specified for updating");  
     search.focus();
     return;
   }
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="EXAM NAME"){
         examName=txt.value; 
         continue;
      }
      else if(fieldName==="EXAM DEADLINE"){
         examDeadline=txt.value; 
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
    if(examName.trim()===""){
      return; 
   }
   var json={
                 request_header : {
                     request_msg : "update_exam",
                     request_svc : "edit_mark_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   exam_name :examName,
                   exam_deadline : examDeadline,
                   exam_id : examId
                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update exam");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("exam updated successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("exam updating failed: "+json.response.reason);
                    }
                } 
          });     
  }
  
  function createExam(){
   var names=allFields["FIELD_NAME"];
   var fieldNames=[];
   var fieldValues=[];
   var fieldData=[];
   var examName;
   var examDeadline;
   for(var x=0; x<names.length; x++){
      var txt=dom.el("student_display_text"+x);
      var required=txt.getAttribute("required");
      var dataType=txt.getAttribute("data_type");
      var fieldName=txt.getAttribute("field_name");
      if(fieldName==="EXAM NAME"){
         examName=txt.value; 
         continue;
      }
      else if(fieldName==="EXAM DEADLINE"){
         examDeadline=txt.value; 
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
    if(examName.trim()===""){
      return; 
   }
   var json={
                 request_header : {
                     request_msg : "create_exam",
                     request_svc : "edit_mark_service"
                  },
                  
                  request_object : { 
                   field_names : fieldNames,
                   field_values : fieldValues,
                   field_data : fieldData,
                   exam_name :examName,
                   exam_deadline : examDeadline

                  }
              }
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create exam");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                     setInfo("exam created successfully ");   
                    }
                    else if(resp==="fail"){
                       setInfo("exam creation failed: "+json.response.reason);
                    }
                } 
          });   
  }
  
  