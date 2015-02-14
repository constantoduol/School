var report={
   templates : {
      basic : {
        template_name : "basic",
        single_report : "report_form_basic_1.html",
        multiple_report : "report_form_basic.htm"
      },
      advanced : {
        template_name : "advanced",
        single_report : "report_form_advanced_1.html",
        multiple_report : "report_form_advanced.htm"
      }
   },
   current_template : "basic",
   mainWin : {},
   populateTemplates : function(){
      var tempNames=Object.keys(report.templates);
      ui.dropdown.add("template_select_area","template_select",tempNames,tempNames);
      ui.dropdown.onselect("template_select","report.setCurrentReportTemplate()");
   },
   setCurrentReportTemplate : function(){
     var tempName=ui.dropdown.getSelected("template_select");
     report.current_template=tempName;
   },
   openAllReportForms : function(clazzId,streamId,examId){
       //to be implemented according to school report form designs
        var json={
                 request_header : {
                     request_msg : "all_students",
                     request_svc :"mark_service"
                  },
                  request_object : {  
                    class_id : clazzId,
                    stream_id : streamId
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all students");
                  },
                  success : function(json){
                    var resp = json.response.data;
                    var ids = resp["ID"];
                    var mainWinHtmlSrc = report.templates[report.current_template].multiple_report;
                    var mainWin = window.open(mainWinHtmlSrc,"win","width=800,height=650,scrollbars=yes,resizable=yes");
                    report.mainWin = mainWin;
                    for(var x=0; x<ids.length; x++){
                        report.openReportForm(ids[x],clazzId,streamId,examId,true);
                        
                    }
                    
                }  
          }); 
    
   },
   generateSingleReportForm: function(resp,examName,multiple){ 
       var rand = Math.floor((Math.random()*100000000));
       var winHtmlSrc = report.templates[report.current_template].single_report;
       if(multiple){
         var win = document.createElement("iframe");
         win.src = winHtmlSrc;
         win.setAttribute("style","display : none");
         $("#main-view-form").append(win);
       }
       else{
         var win = window.open(winHtmlSrc,rand,"width=800,height=650,scrollbars=yes,resizable=yes");
       }
       report.generateHeaderBlock(win,resp,examName,multiple);
       if(report.current_template === "basic"){
          report.generateBasicSubjectBlock(win,resp,multiple);   
       }
       else if(report.current_template === "advanced"){
          report.generateAdvancedSubjectBlock(win,resp,multiple);
       }
       report.generateScoreBlock(win,resp,multiple);
       report.generateClassTeacherBlock(win,resp,multiple);
       report.generatePrincipalBlock(win,resp,multiple);       
   },
   generateHeaderBlock : function(win,resp,examName,multiple){
       var template=resp.report_form_template;
       if(!template.address_block){
          setInfo("Please set the details to appear on the report form under report form design");
          return; 
       }
       var func=function(){
            if(multiple){
               var area=win.contentDocument; 
            }
            else{
              var area=win.document;  
            }
            area.getElementById("sc_name").innerHTML=template.address_block.sc_name;
            area.getElementById("sc_address").innerHTML=template.address_block.sc_address;
            area.getElementById("sc_email").innerHTML=template.address_block.sc_email;
            area.getElementById("sc_web").innerHTML=template.address_block.sc_web;
            area.getElementById("sc_tel").innerHTML=template.address_block.sc_tel;

            var studentTable=area.getElementById("student_detail_table");
            var studentDetails=resp.report_form_template.student_details;
            
            var temp=[];
            for(var detail in studentDetails){
               var theDetail=studentDetails[detail][0];
               theDetail=detail.replace(/_/g," ")+" : "+theDetail;
               temp.push(theDetail);
            }
          // temp.push("EXAM: "+examName);
           temp=temp.concat(template.address_block.sc_extra_details.split(","));
           for(var y=0; y<temp.length; y=y+2){
                  var tr=area.createElement("tr");
                  var td=area.createElement("td");
                  td.setAttribute("style","border : 0px");
                  
                  td.innerHTML=temp[y].toUpperCase();
                  tr.appendChild(td);
                  var td1=area.createElement("td");
                  td1.setAttribute("style","border : 0px");
                  if(temp[y+1]){
                     td1.innerHTML=temp[y+1].toUpperCase();  
                  }
                  tr.appendChild(td1);
                  studentTable.appendChild(tr);
           }
           
       };
      report.waitTillElementReady(win,"student_detail_table",func,multiple);
   },
   generateClassTeacherBlock : function(win,resp,multiple){
       var func=function(){
          if(multiple){
               var area=win.contentDocument; 
            }
            else{
              var area=win.document;  
            }
        var template=resp.report_form_template.class_teacher;
        if(!template){
           setInfo("Please set the details to appear on the report form under report form design");
           return; 
        }
        for(var y=0; y<template.length; y++){
             var tempDetails=template[y].split(",");
             var start=parseFloat(tempDetails[0]);
             var stop=parseFloat(tempDetails[1]);
             var comm=tempDetails[3];
             if(resp.average>=start && resp.average<=stop){
                area.getElementById("class_teacher_comments").innerHTML=comm;
              }  
        }

     };
    report.waitTillElementReady(win,"class_teacher_comments",func,multiple); 
   },
   runLater : function(func,limit){
       return setTimeout(func,limit);      
   },
   generatePrincipalBlock : function(win,resp,multiple){
       var func=function(){
            if(multiple){
               var area=win.contentDocument; 
            }
            else{
              var area=win.document;  
            }
        var template=resp.report_form_template.principal;
        if(!template){
            setInfo("Please set the details to appear on the report form under report form design");
            return;
        }
        for(var y=0; y<template.length; y++){
             var tempDetails=template[y].split(",");
             var start=parseFloat(tempDetails[0]);
             var stop=parseFloat(tempDetails[1]);
             var comm=tempDetails[3];
             if(resp.average>=start && resp.average<=stop){
                area.getElementById("principal_comments").innerHTML=comm;
              }  
         }
       if(multiple){
          var func1=function(){
            report.mainWin.$("#report_area").append(area.getElementById("report_area").innerHTML);   
          };
          report.runLater(func1,1000); 
          var func2=function(){ 
              document.getElementById("main-view-form").removeChild(win);
          };
          report.runLater(func2,30000); 
       }
     };
    report.waitTillElementReady(win,"principal_comments",func,multiple); 
   },
   round : function(num,precision){
        if (!precision) {
            precision = 0;
        }
        precision = parseInt(precision);
        num = parseFloat(num);
        var p = num.toFixed(precision).split(".");
        var chars = p[0].split("").reverse();
        var newstr = '';
        var count = 0;
        for (var x in chars) {
            count++;
            if (count % 3 === 1 && count !== 1) {
                newstr = chars[x] + ',' + newstr;
            } else {
                newstr = chars[x] + newstr;
            }
        }
        return !p[1] ? newstr : newstr + "." + p[1];
   },
   generateScoreBlock : function(win,resp,multiple){
     var precision = resp.formulas.DESIGN[resp.formulas.SUBJECT_ID.indexOf("a_prec")];
     var func=function(){
          if(multiple){
               var area=win.contentDocument; 
            }
            else{
              var area=win.document;  
            }
        area.getElementById("grand_total").innerHTML = Math.round(resp.grand_total)+"/"+resp.max_score; //the grand total
        area.getElementById("mean_score").innerHTML = report.round(resp.average,precision); //the average
        var template=resp.report_form_template.mean_score;
        if(!template){
            setInfo("Please set the details to appear on the report form under report form design");
           return;
        }
        for(var y=0; y<template.length; y++){
             resp.average=Math.round(resp.average);
             var tempDetails=template[y].split(",");
             var start=parseFloat(tempDetails[0]);
             var stop=parseFloat(tempDetails[1]);
             var grade=tempDetails[2];
             if(resp.average >= start && resp.average <= stop){
                area.getElementById("student_grade").innerHTML=grade;
              }  
        }
      area.getElementById("rank_in_stream").innerHTML=resp.stream_rank+"/"+resp.total_in_stream; //the rank in the stream
      area.getElementById("rank_in_class").innerHTML=resp.class_rank+"/"+resp.total_in_class; //the rank in the class
     };
    report.waitTillElementReady(win,"rank_in_class",func,multiple);
   },
   generateAdvancedSubjectBlock : function(win,resp,multiple){
      var subjects=resp.subject_data.SUBJECT_NAME; 
      var func=function(){
          if(multiple){
               var area=win.contentDocument; 
            }
            else{
              var area=win.document;  
            }
        area.getElementById("fee_balance").innerHTML=resp.fee_balance; //set the fee balance
        var subjectTable=area.getElementById("subject_detail_table");
        for(var x=0; x<subjects.length; x++){
          var tr=area.createElement("tr");
          //subject name
          var td=area.createElement("td");;
          td.innerHTML = subjects[x]; //the name of the subject
          tr.appendChild(td);
          
          //-----------------------------------
          //begin subject score value
         var currentSubjectId = resp.subject_data.ID[x];
         var index = resp.student_marks[0].SUBJECT_ID.indexOf(currentSubjectId);
         var len = resp.student_marks.length;
         var markValue = resp.student_marks[len - 1].MARK_VALUE[index];
         if(resp.student_marks[len-2]){ 
             var markValue1 = resp.student_marks[len - 2].MARK_VALUE[index];
         }
         
         if(resp.student_marks[len-3]){
             var markValue2 = resp.student_marks[len-3].MARK_VALUE[index]; 
         }
         
         var meanMark = resp.average_marks[index]; // these are the average marks in the three exams
         var precision = resp.formulas.DESIGN[resp.formulas.SUBJECT_ID.indexOf("a_prec")];
         if(!markValue && !markValue1 && !markValue2){
            continue; 
         }
          var td1=area.createElement("td");
          td1.innerHTML = markValue; //exam one
          
          var td6=area.createElement("td");
          if(markValue1){
            td6.innerHTML = markValue1; //exam two
          }
          var td7=area.createElement("td");
          if(markValue2){
            td7.innerHTML = markValue2; //exam three   
          }
          
          var td8=area.createElement("td"); //the mean score
          td8.innerHTML = report.round(meanMark,precision);
          
          tr.appendChild(td1); //exam one
          tr.appendChild(td6); //exam two
          tr.appendChild(td7); //exam three
          tr.appendChild(td8);
          
          
          //end subject score value
          //----------------------------------
          //begin grade analysis
          
          var td2=area.createElement("td");
          //-------------------------------------
          //begin rank
           var td3=area.createElement("td");
          //----------------------------------------
          //begin comments
          var td4=area.createElement("td");
          //-----------------------------------------
            //begin comments
          var td5=area.createElement("td");
          var teacherIndex=resp.teacher_data.SUBJECT_ID.indexOf(currentSubjectId);
          var teacherName=resp.teacher_data.TEACHER_NAME[teacherIndex];
          if(teacherName){
             td5.innerHTML = teacherName.toUpperCase();
          }
          //-----------------------------------------
           var template = resp.report_form_template.subject_details; //get the comment details
           if( !template ){
              setInfo("Please set the details to appear on the report form under report form design");
              return;
           }
           
           td3.innerHTML = resp.subject_ranks[currentSubjectId]+"/"+resp.total_in_class; //rank per subject
           for(var y = 0; y < template.length; y++){
             var tempDetails = template[y].split(",");
             var subId = tempDetails[0];
             var start = parseFloat(tempDetails[1]);
             var stop = parseFloat(tempDetails[2]);
             var grade = tempDetails[3];
             var comm = tempDetails[4];
             meanMark = Math.round(meanMark);
             if(meanMark >= start && meanMark <= stop && subId === currentSubjectId){
                   td2.innerHTML = grade; //the name of the subject 
                   td4.innerHTML = comm; //these are the remarks
              }  
          }
        
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          subjectTable.appendChild(tr);

        } 
      };
      report.waitTillElementReady(win,"subject_detail_table",func,multiple);
      report.generateTrend(resp,win,multiple);
   },
   generateBasicSubjectBlock : function(win,resp,multiple){
      var subjects=resp.subject_data.SUBJECT_NAME; 
      var func = function(){
          if(multiple){
              var area = win.contentDocument; 
          }
          else{
              var area = win.document;  
          }
          area.getElementById("fee_balance").innerHTML=resp.fee_balance; //set the fee balance
        var subjectTable=area.getElementById("subject_detail_table");
        for(var x=0; x<subjects.length; x++){
          var tr=area.createElement("tr");
          //subject name
          var td=area.createElement("td");;
          td.innerHTML = subjects[x]; //the name of the subject
          tr.appendChild(td);
          
          //-----------------------------------
          //begin subject score value
         var currentSubjectId=resp.subject_data.ID[x];
         var index= resp.student_marks.SUBJECT_ID.indexOf(currentSubjectId);
         var markValue=resp.student_marks.MARK_VALUE[index];
         if(!markValue){
            continue; 
         }
          var td1=area.createElement("td");
          td1.innerHTML = markValue; //the score value of the subject
          tr.appendChild(td1);
          //end subject score value
          //----------------------------------
          //begin grade analysis
          
          var td2=area.createElement("td");
          //-------------------------------------
          //begin rank
           var td3=area.createElement("td");
          //----------------------------------------
          //begin comments
          var td4=area.createElement("td");
          //-----------------------------------------
            //these are the names of the teacher/initials
          var td5=area.createElement("td");
          var teacherIndex=resp.teacher_data.SUBJECT_ID.indexOf(currentSubjectId);
          var teacherName=resp.teacher_data.TEACHER_NAME[teacherIndex];
          if(teacherName){
             td5.innerHTML=teacherName.toUpperCase();
          }
          //-----------------------------------------
          var template=resp.report_form_template.subject_details; //get the comment details
          if(!template){
              setInfo("Please set the details to appear on the report form under report form design");
              return;
          }
         
          td3.innerHTML = resp.subject_ranks[currentSubjectId]+"/"+resp.total_in_class; //rank per subject
          for(var y = 0; y < template.length; y++){
             var tempDetails = template[y].split(",");
             var subId = tempDetails[0];
             var start = parseFloat(tempDetails[1]);
             var stop = parseFloat(tempDetails[2]);
             var grade = tempDetails[3];
             var comm = tempDetails[4];
             markValue = Math.round(markValue);
             if(markValue >= start && markValue <= stop && subId === currentSubjectId){
                   td2.innerHTML = grade; //the name of the subject 
                   td4.innerHTML = comm; //these are the remarks
              }  
           }
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          subjectTable.appendChild(tr);
        } 
      };
      report.waitTillElementReady(win,"subject_detail_table",func,multiple);
      report.generateTrend(resp,win,multiple);
   },
   generateTrend : function(resp,win,multiple){
       var trendFunc = function(){
          if(multiple){
              var area = win.contentDocument; 
          }
          else{
              var area = win.document;  
          }
          var script = area.createElement("script");
          var ykeys = [];
          script.type = "text/javascript";
          var theScript = "";
          theScript+= "Morris.Bar({"+
                  "element: 'average_area',"+
                  "parseTime: false,"+
                  "barSizeRatio : 0.8,"+
                  "barGap : 1,"+
                  "data: [{x: '', ";
          var length = resp.student_trend.exam_names.length > 16 ? 16 : resp.student_trend.exam_names.length;
          for(var x = length; x > -1; x--){
              if(!resp.student_trend.average.average[x]){
                  continue;  
              }
              if(x === 0){
                 theScript+= " E"+(x+1)+"  : "+Math.round(resp.student_trend.average.average[x]*100)/100+" "; 
              }
              else {
                 theScript+= " E"+(x+1)+"  : "+Math.round(resp.student_trend.average.average[x]*100)/100+", "; 
              }
              ykeys.push(" 'E"+(x+1)+"' ");
          }
          theScript+= "}],"+
                  "xkey: 'x',"+
                  "ykeys: ["+ykeys+"],"+
                  "labels: ["+ykeys+"]"+
                  "})";
          script.innerHTML = theScript;
          area.getElementsByTagName("head")[0].appendChild(script);
          var svg = area.getElementsByTagName("svg")[0]
          svg.setAttribute("width","8.5in");
          svg.style.paddingLeft = "40px";
          var labelArea = area.getElementsByClassName("morris-hover")[0];
          var averageArea = area.getElementById("average_area");
          var textAreas = area.getElementsByTagName("text");
          //averageArea.style.width = "8.5in";
          var subjectLength = resp.subject_data.ID.length;
          var zoom = "20%";
          var fontSize;
          if(subjectLength >= 0 && subjectLength <= 5){
             zoom = "60%";
             fontSize = "16px";
             labelArea.style.fontSize = "24px";
             
          } 
          else if(subjectLength >= 6 && subjectLength <= 10){
              zoom = "40%";
              fontSize = "24px";
              labelArea.style.fontSize = "40px";
          }
          else {
             zoom = "25%";
             fontSize = "36px";
             labelArea.style.fontSize = "50px";
          }
          averageArea.style.zoom = zoom;
          for(var y = 0; y < textAreas.length; y++){
             textAreas[y].style.fontSize = fontSize;
          }
      };
      
      report.waitTillElementReady(win,"average_area",trendFunc,multiple); 
   },
   waitTillElementReady : function(win,id,func,multiple){
      var time=setInterval(function(){
        if(multiple){
           if(win.contentDocument.getElementById(id)){
            clearInterval(time); 
            func();
          }  
        }
        else{
          if(win.document.getElementById(id)){
            clearInterval(time); 
            func();
          }
        }
      },5); 
   }
   ,
   openReportForm : function(studentId,clazzId,streamId,examIds,multiple){
      //to be implemented according to school report form design
      var template = ui.dropdown.getSelected("template_select");
      if(template === null || !template){
          template = "basic";
          report.current_template = template;
      }
       if(!examIds || examIds==="null"){
           setInfo("Please select an exam or exams to proceed");
           return;
        }
     
       var json={
         request_header : {
             request_msg : "open_report_form",
             request_svc :"mark_service"
             },
        request_object : { 
           student_id : studentId,
           exam_ids : examIds,
           stream_id : streamId,
           class_id : clazzId,
           template : template
         }
     };
    Ajax.run({
        url : serverUrl,
        type : "post",
        data : json,
        loadArea : "load_area",
        error : function(err){
            setInfo("An error occurred when attempting to open report form");
        },
        success : function(json){
             var resp = json.response.data;
             report.generateSingleReportForm(resp,examIds,multiple);
             
           } 
       });

   },
  reportDesignView : function(){
   var form = new Form(null,"main-view-form");
   setTitle("Report Design View");
   var div = ui.collapsible("main-view-form","Hide/Show Address Block","address_block_area");
   var header=dom.newEl("h3");
   header.innerHTML="Address Block";
   var scAddressLabel=dom.newEl("label");
   scAddressLabel.innerHTML="School Address";
   var scAddress=dom.newEl("select");
   scAddress.attr("id","sc_address");
   
   var scEmailLabel=dom.newEl("label");
   scEmailLabel.innerHTML="School Email";
   var scEmail=dom.newEl("select");
   scEmail.attr("id","sc_email");
   
   var scWebLabel=dom.newEl("label");
   scWebLabel.innerHTML="School Web site";
   var scWeb=dom.newEl("select");
   scWeb.attr("id","sc_web");
   
   var scTelLabel=dom.newEl("label");
   scTelLabel.innerHTML="School Phone";
   var scTel=dom.newEl("select");
   scTel.attr("id","sc_tel");
   
   var scNameLabel=dom.newEl("label");
   scNameLabel.innerHTML="School Name";
   var scName=dom.newEl("select");
   scName.attr("id","sc_name");
   
   var scExtraLabel=dom.newEl("label");
   scExtraLabel.innerHTML="School Extra Details";
   var scExtra=dom.newEl("select");
   scExtra.attr("id","sc_extra_details");
   
   var save=dom.newEl("input");
   save.attr("type","button");
   save.attr("value","Save Details");
   save.attr("onclick","report.saveAddressBlock()");
   save.attr("class","btn btn-primary");
   div.add(header);
   div.add(scAddressLabel);
   div.add(scAddress);
   div.add(scEmailLabel);
   div.add(scEmail);
   div.add(scWebLabel);
   div.add(scWeb);
   div.add(scTelLabel);
   div.add(scTel);
   div.add(scNameLabel);
   div.add(scName);
   div.add(scExtraLabel);
   div.add(scExtra);
   div.add(dom.newEl("br"));
   div.add(save);
   var json={
         request_header : {
             request_msg : "all_school_details",
             request_svc :"edit_mark_service"
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
             var values=resp["SCHOOL_KEY"];
             populateSelect("sc_address",values,values);
             populateSelect("sc_email",values,values);
             populateSelect("sc_web",values,values);
             populateSelect("sc_tel",values,values);
             populateSelect("sc_name",values,values);
             populateSelect("sc_extra_details",values,values);
           } 
       }); 
    //end address block
    //-----------------------------------------------------------------
      var json1={
         request_header : {
             request_msg : "all_fields",
             request_svc :"edit_mark_service"
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
            setInfo("An error occurred when attempting to fetch student fields");
        },
        success : function(json){
             var resp=json.response.data;
             allFields=resp;
           } 
       }); 

   var div1 = ui.collapsible("main-view-form","Hide/Show Student Details","student_details_area");
   var header1=dom.newEl("h3");
   header1.innerHTML="Student Details";
   
   var div2=dom.newEl("div");
   div2.attr("id","all_student_fields");
   
   var add=dom.newEl("input");
   add.attr("type","button");
   add.attr("class","btn btn-primary");
   add.attr("value","Add Student Field");
   add.attr("onclick","javascript:addExtraField()"); 
   
   var saveField=dom.newEl("input");
   saveField.attr("type","button");
   saveField.attr("class","btn btn-primary");
   saveField.attr("style","margin : 5px");
   saveField.attr("value","Save Student Fields");
   saveField.attr("onclick","report.saveStudentDetails()"); 
    
   div1.add(header1);
   div1.add(div2);
   div1.add(dom.newEl("br"));
   div1.add(add);
   div1.add(saveField);
   
   //end student details
   //------------------------------------
   report.generateSubjectScoreGroups();
   report.addScoreDetails();
   report.addClassTeacher();
   report.addPrincipal();
   report.fetchReportFormDetails();
 },
 generateSubjectScoreGroups : function(){
   var div1 = ui.collapsible("main-view-form","Hide/Show Subject Details","subject_view");
   var header1=dom.newEl("h3");
   header1.innerHTML="Subject Details";
   div1.add(header1);
     var json={
              request_header : {
                     request_msg : "all_subjects",
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
                     setInfo("An error occurred when attempting to fetch subjects");
                  },
                  success : function(json){
                     var resp=json.response.data;
                     var sNames=resp["SUBJECT_NAME"];
                     var sIds=resp["ID"];
                     for(var x=0; x<sNames.length; x++){
                        var label=dom.newEl("label");
                        label.innerHTML="<b>"+sNames[x]+"</b>";
                        var id="_subject_"+x;
                        var btn=dom.newEl("input");
                        btn.attr("type","button");
                        btn.attr("class","btn btn-primary");
                        btn.attr("value", "Add Score Group");
                        btn.attr("onclick","report.addScoreGroup(\""+id+"\",\""+sIds[x]+"\")");
                        
                        var div2=dom.newEl("div");
                        div2.attr("style","margin : 5px");

                        div2.attr("id",id);
                        div1.add(label);
                        div1.add(div2);
                        div1.add(btn);
                      }
                         var btn1=dom.newEl("input");
                         btn1.attr("type","button");
                         btn1.attr("class","btn btn-primary");
                         btn1.attr("value", "Save Score Groups");
                         btn1.attr("style","margin : 5px");
                         btn1.attr("onclick","report.saveSubjectScoreGroups()");
                         div1.add(btn1);
                } 
          });    
 },
 
 addScoreGroup : function(id,subId){
    var startIn=dom.newEl("input");
    startIn.attr("type","text");
    startIn.attr("class","input-small");
    startIn.attr("placeholder","Start");
    
    var stopIn=dom.newEl("input");
    stopIn.attr("type","text");
    stopIn.attr("class","input-small");
    stopIn.attr("placeholder","Stop");
    
    var gradeIn=dom.newEl("input");
    gradeIn.attr("type","text");
    gradeIn.attr("class","input-small");
    gradeIn.attr("placeholder","Grade");
    
    var commIn=dom.newEl("input");
    commIn.attr("type","text");
    commIn.attr("class","input-xxlarge");
    commIn.attr("placeholder","Comments");
    
    
    var div=dom.newEl("div");
    div.attr("subject_id",subId);
    div.add(startIn);
    div.add(stopIn);
    div.add(gradeIn);
    div.add(commIn);
    CloseDiv(div,id, null); 
 },
  addScoreDetails : function(){
   var div1 = ui.collapsible("main-view-form","Hide/Show Mean Score Details","score_view");
   var header1=dom.newEl("h3");
   header1.innerHTML="Mean Score Details";
   var id = "_mean_score_";
   var div2 = dom.newEl("div");
   div2.attr("id",id);
   var btn=dom.newEl("input");
   btn.attr("type","button");
   btn.attr("class","btn btn-primary");
   btn.attr("value", "Add Score Group");
   btn.attr("onclick","report.addScoreGroup(\""+id+"\")");
   
   var btn1=dom.newEl("input");
   btn1.attr("type","button");
   btn1.attr("class","btn btn-primary");
   btn1.attr("value", "Save Score Group");
   btn1.attr("style","margin : 5px");
   btn1.attr("onclick","report.saveMeanScoreGroups()");
   div1.add(header1);
   div1.add(div2);
   div1.add(btn);
   div1.add(btn1);
 },     
 addClassTeacher : function(){
   var div1 = ui.collapsible("main-view-form","Hide/Show Class Teacher Comments","class_teacher_view");
   var header1 = dom.newEl("h3");
   header1.innerHTML="Class Teacher Comments";
   var id="_class_teacher_";
   var div2=dom.newEl("div");
   div2.attr("id",id);
   var btn=dom.newEl("input");
   btn.attr("type","button");
   btn.attr("class","btn btn-primary");
   btn.attr("value", "Add Score Group");
   btn.attr("onclick","report.addScoreGroup(\""+id+"\")");
   
   var btn1=dom.newEl("input");
   btn1.attr("type","button");
   btn1.attr("class","btn btn-primary");
   btn1.attr("value", "Save Score Group");
   btn1.attr("style","margin : 5px");
   btn1.attr("onclick","report.saveClassTeacherComments()");
   div1.add(header1);
   div1.add(div2);
   div1.add(btn);
   div1.add(btn1);
 },
 addPrincipal : function(){
   var div1 = ui.collapsible("main-view-form","Hide/Show Principal Comments","principal_view");
   var header1=dom.newEl("h3");
   header1.innerHTML="Principal Comments";
   var id="_principal_";
   var div2=dom.newEl("div");
   div2.attr("id",id);
   var btn=dom.newEl("input");
   btn.attr("type","button");
   btn.attr("class","btn btn-primary");
   btn.attr("value", "Add Score Group");
   btn.attr("onclick","report.addScoreGroup(\""+id+"\")");
   
   var btn1=dom.newEl("input");
   btn1.attr("type","button");
   btn1.attr("class","btn btn-primary");
   btn1.attr("value", "Save Score Group");
   btn1.attr("style","margin : 5px");
   btn1.attr("onclick","report.savePrincipalComments()");
   div1.add(header1);
   div1.add(div2);
   div1.add(btn);
   div1.add(btn1);
 },
 saveAddressBlock : function(){
   var scAddress = dom.el("sc_address").value;
   var scEmail = dom.el("sc_email").value;
   var scWeb = dom.el("sc_web").value;
   var scTel = dom.el("sc_tel").value;
   var scName = dom.el("sc_name").value;
   var scExtra = dom.el("sc_extra_details").value;
   var json = {
                 request_header : {
                     request_msg : "save_address_block",
                     request_svc : "edit_mark_service"
                  },
                  request_object : {  
                    sc_address : scAddress,
                    sc_email : scEmail,
                    sc_web : scWeb,
                    sc_tel : scTel,
                    sc_name : scName,
                    sc_extra_details : scExtra
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save address details");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Address details saved successfully"); 
                    }
                    else{
                      setInfo("Address details not saved");  
                    }
                    
                } 
          });   
   
 },
 saveStudentDetails : function(){
    var fields=[];
    var divs=dom.el("all_student_fields").children;
    for(var x=0; x<divs.length; x++){
       var select=dom.el("all_student_fields").children[x].children[1].firstChild;
       fields.push(select.value);
    }
    var json={
                 request_header : {
                     request_msg : "save_student_fields",
                     request_svc :"edit_mark_service"
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
                     setInfo("An error occurred when attempting to save student fields");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Student details saved successfully"); 
                    }
                    else{
                      setInfo("Student details not saved");  
                    }
                    
                } 
          });   
 },
 saveClassTeacherComments : function(){
     var subArr=[];
     var div=dom.el("_class_teacher_");
     for(var x=0; x<div.children.length; x++){
      var obj={};
      var scoreDiv=div.children[x].children[1];  
      var start=scoreDiv.children[0];
      if(!start.value){
         start.focus();
          return;
      }
      var stop=scoreDiv.children[1];
      if(!stop.value){
         stop.focus(); 
          return;
      }
    
      var comm=scoreDiv.children[4];
       if(!comm.value){
         comm.focus(); 
          return;
      }
     
      obj.start=start.value;
      obj.stop=stop.value;
      obj.comm=comm.value;
      subArr.push(obj);
    }
     var json={
               request_header : {
                     request_msg : "save_class_teacher_details",
                     request_svc :"edit_mark_service"
                  },
                  request_object : {  
                    class_teacher_details : subArr
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save class teacher details");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Class teacher details saved successfully"); 
                    }
                    else{
                      setInfo("Class teacher details not saved");  
                    }
                } 
          });
 },
  saveMeanScoreGroups : function(){
     var subArr=[];
     var div=dom.el("_mean_score_");
     for(var x=0; x<div.children.length; x++){
      var obj={};
      var scoreDiv=div.children[x].children[1];  
      var start=scoreDiv.children[0];
      if(!start.value){
         start.focus();
          return;
      }
      var stop=scoreDiv.children[1];
      if(!stop.value){
         stop.focus(); 
          return;
      }
    
      var grade=scoreDiv.children[2];
       if(!grade.value){
         grade.focus(); 
          return;
      }
     
      obj.start=start.value;
      obj.stop=stop.value;
      obj.grade=grade.value;
      subArr.push(obj);
    }
     var json={
               request_header : {
                     request_msg : "save_mean_score_details",
                     request_svc :"edit_mark_service"
                  },
                  request_object : {  
                    mean_score_details : subArr
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save mean score details");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Mean score details saved successfully"); 
                    }
                    else{
                      setInfo("Mean score details not saved");  
                    }
                } 
          });
 },
 savePrincipalComments : function(){
     var subArr=[];
     var div=dom.el("_principal_");
     for(var x=0; x<div.children.length; x++){
      var obj={};
      var scoreDiv=div.children[x].children[1];  
      var start=scoreDiv.children[0];
      if(!start.value){
         start.focus(); 
          return;
      }
      var stop=scoreDiv.children[1];
      if(!stop.value){
         stop.focus(); 
          return;
      }

      var comm=scoreDiv.children[4];
       if(!comm.value){
         comm.focus(); 
          return;
      }
     
      obj.start=start.value;
      obj.stop=stop.value;
      obj.comm=comm.value;
      subArr.push(obj);
    }
     var json={
               request_header : {
                     request_msg : "save_principal_details",
                     request_svc :"edit_mark_service"
                  },
                  request_object : {  
                    principal_details : subArr
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save principal details");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Principal details saved successfully"); 
                    }
                    else{
                      setInfo("Principal details not saved");  
                    }
                } 
          }); 
 },
 saveSubjectScoreGroups : function(){
   var subLength=allSubjects["SUBJECT_NAME"].length;
   var subArr=[];
   for(var y=0; y<subLength; y++){
     var id="_subject_"+y;
     var div=dom.el(id);
     for(var x=0; x<div.children.length; x++){
      var obj={};
      var scoreDiv=div.children[x].children[1];  
      var subjectId=scoreDiv.getAttribute("subject_id");
      var start=scoreDiv.children[0];
      if(!start.value){
         start.focus();
          return;
      }
      var stop=scoreDiv.children[1];
       if(!stop.value){
         stop.focus(); 
          return;
      }
      var grade=scoreDiv.children[2];
       if(!grade.value){
         grade.focus(); 
          return;
      }
      var comm=scoreDiv.children[4];
       if(!comm.value){
         comm.focus();
         return;
      }
      obj.subject_id=subjectId;
      obj.start=start.value;
      obj.stop=stop.value;
      obj.grade=grade.value;
      obj.comm=comm.value;
      obj.id=id;
      subArr.push(obj);
    }

   }
   
     var json={
               request_header : {
                     request_msg : "save_subject_details",
                     request_svc :"edit_mark_service"
                  },
                  request_object : {  
                    subject_details : subArr
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to save subject details");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Subject details saved successfully"); 
                    }
                    else{
                      setInfo("Subject details not saved");  
                    }
                    
                } 
          });   
  },
  fetchReportFormDetails : function(){
    //fetch address block
    //fetch student details
    //fetch subject details
    //fetch class teacher details
    //fetch principal details
     var json={
               request_header : {
                     request_msg : "fetch_report_form_details",
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
                     setInfo("An error occurred when attempting to fetch report form details");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    var func=function(){
                        report.populateAddressBlock(resp);
                        report.populateStudentFields(resp);
                        report.populateSubjectFields(resp);
                        report.populateTeacherFields(resp);
                        report.populatePrincipalFields(resp);
                        report.populateMeanScoreFields(resp);
                    };
                  dom.waitTillElementReady("_principal_",func);
                } 
          });   
  },
  populateAddressBlock : function(resp){
     var scNameIndex=resp["FIELD_TYPE"].indexOf("sc_name");
     dom.el("sc_name").value=resp["FIELD_VALUE"][scNameIndex];
     var scAddressIndex=resp["FIELD_TYPE"].indexOf("sc_address");
     dom.el("sc_address").value=resp["FIELD_VALUE"][scAddressIndex];
      var scEmailIndex=resp["FIELD_TYPE"].indexOf("sc_email");
     dom.el("sc_email").value=resp["FIELD_VALUE"][scEmailIndex];
      var scWebIndex=resp["FIELD_TYPE"].indexOf("sc_web");
     dom.el("sc_web").value=resp["FIELD_VALUE"][scWebIndex];
      var scTelIndex=resp["FIELD_TYPE"].indexOf("sc_tel");
      dom.el("sc_tel").value=resp["FIELD_VALUE"][scTelIndex];
      var scExtraIndex=resp["FIELD_TYPE"].indexOf("sc_extra_details");
      dom.el("sc_extra_details").value = resp["FIELD_VALUE"][scExtraIndex];
  },
  populateStudentFields : function(resp){
     var fields=resp["FIELD_TYPE"];
     for(var x=0; x<fields.length; x++){
        if(fields[x]==="student_field"){
           var id=addExtraField();
           dom.el(id).value=resp["FIELD_VALUE"][x];
        } 
     }
  },
  populateSubjectFields : function(resp){
     var fields=resp["FIELD_TYPE"];
     for(var x=0; x<fields.length; x++){
        if(fields[x]==="subject_field"){
           var subjectId=resp["FIELD_ID"][x];
           var scores=resp["FIELD_VALUE"][x];
           scores=scores.split(",");
           var start=scores[0];
           var stop=scores[1];
           var grade=scores[2];
           var comm=scores[3];
           var id=scores[4];
           report.addPopulatedScoreGroup(id,subjectId,start,stop,grade,comm);
        } 
     }
  },
  populateTeacherFields : function(resp){
     var fields=resp["FIELD_TYPE"];
     for(var x=0; x<fields.length; x++){
        if(fields[x]==="class_teacher"){
           var scores=resp["FIELD_VALUE"][x];
           scores=scores.split(",");
           var start=scores[0];
           var stop=scores[1];
           var comm=scores[3];
           var id="_class_teacher_";
           report.addPopulatedScoreGroup(id,"",start,stop,"",comm);
        } 
     }  
  },
    populatePrincipalFields : function(resp){
     var fields=resp["FIELD_TYPE"];
     for(var x=0; x<fields.length; x++){
        if(fields[x]==="principal"){
           var scores=resp["FIELD_VALUE"][x];
           scores=scores.split(",");
           var start=scores[0];
           var stop=scores[1];
           var comm=scores[3];
           var id="_principal_";
           report.addPopulatedScoreGroup(id,"",start,stop,"",comm);
        } 
     }  
  },
    populateMeanScoreFields : function(resp){
     var fields=resp["FIELD_TYPE"];
     for(var x=0; x<fields.length; x++){
        if(fields[x]==="mean_score"){
           var scores=resp["FIELD_VALUE"][x];
           scores=scores.split(",");
           var start=scores[0];
           var stop=scores[1];
           var grade=scores[2];
           var id="_mean_score_";
           report.addPopulatedScoreGroup(id,"",start,stop,grade,"");
        } 
     }  
  },
  addPopulatedScoreGroup : function(id,subId,startValue,stopValue,gradeValue,commValue){
    var startIn=dom.newEl("input");
    startIn.attr("type","text");
    startIn.attr("class","input-small");
    startIn.attr("value",startValue);
    startIn.attr("placeholder","Start");
    
    var stopIn=dom.newEl("input");
    stopIn.attr("type","text");
    stopIn.attr("class","input-small");
    stopIn.attr("value",stopValue);
    stopIn.attr("placeholder","Stop");
    
    var gradeIn=dom.newEl("input");
    gradeIn.attr("type","text");
    gradeIn.attr("class","input-small");
    gradeIn.attr("value",gradeValue);
    gradeIn.attr("placeholder","Grade");
    
    var commIn=dom.newEl("input");
    commIn.attr("type","text");
    commIn.attr("class","input-xxlarge");
    commIn.attr("value",commValue);
    commIn.attr("placeholder","Comments");
    
    var div=dom.newEl("div");
    div.attr("subject_id",subId);
    div.add(startIn);
    div.add(stopIn);
    div.add(gradeIn);
    div.add(commIn);
    CloseDiv(div,id, null); 
 }
    
};




