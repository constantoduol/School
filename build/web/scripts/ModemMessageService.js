var message={
 recipientFields :{},
 messageView : function(){
   var form=new Form(null,"main-view-form");
   var txt=dom.newEl("textarea");
   txt.attr("class","input-xxlarge");
   txt.attr("id","message_area");
   txt.attr("style","width : 900px; height : 200px");
   txt.attr("placeholder","Enter Message");
   txt.attr("onkeyup","message.countChars()");
   
   var com=dom.newEl("input");
   com.attr("type","text");
   com.attr("id","modem_com");
   com.attr("class","input-xxlarge");
   com.attr("placeholder","COM port e.g look in device manager");
   
   var pin=dom.newEl("input");
   pin.attr("type","text");
   pin.attr("id","modem_pin");
   pin.attr("class","input-xxlarge");
   pin.attr("placeholder","Modem Pin");
   
   var man=dom.newEl("input");
   man.attr("type","text");
   man.attr("id","modem_manuf");
   man.attr("class","input-xxlarge");
   man.attr("placeholder","Modem Manufacturer");
   
   var model=dom.newEl("input");
   model.attr("type","text");
   model.attr("id","modem_model");
   model.attr("class","input-xxlarge");
   model.attr("placeholder","Modem Model");
   
   var btn=dom.newEl("input");
   btn.attr("type","button");
   btn.attr("class","btn btn-primary btn-medium");
   btn.attr("value","Add Recipients");
   btn.attr("onclick","message.addRecipients()");
   
   var btn1=dom.newEl("input");
   btn1.attr("type","button");
   btn1.attr("class","btn btn-primary btn-medium");
   btn1.attr("style","margin-left : 5px;");
   btn1.attr("value","Send Message");
   btn1.attr("onclick","message.sendMessage()");
   
   var btn2=dom.newEl("input");
   btn2.attr("type","button");
   btn2.attr("class","btn btn-primary btn-medium");
   btn2.attr("style","margin-left : 5px;");
   btn2.attr("value","Start Message Service");
   btn2.attr("onclick","message.startMessageService()");
   
   var btn3=dom.newEl("input");
   btn3.attr("type","button");
   btn3.attr("class","btn btn-primary btn-medium");
   btn3.attr("style","margin-left : 5px;");
   btn3.attr("value","Check Message Progress");
   btn3.attr("onclick","message.checkMessageProgress()");
   
   var btn4=dom.newEl("input");
   btn4.attr("type","button");
   btn4.attr("class","btn btn-primary btn-medium");
   btn4.attr("style","margin-left : 5px;");
   btn4.attr("value","Resend Failed Messages");
   btn4.attr("onclick","message.resendFailedMessages()");
   
   var infoDiv=dom.newEl("div");
   infoDiv.attr("style","border : 2px solid #eee; padding : 5px");
   var charLabel=document.createTextNode("Characters : ");
   var charArea=dom.newEl("b");
   charArea.attr("id","char_area");
   charArea.innerHTML="0";
   
   var recLabel=dom.newEl("span");
   recLabel.innerHTML="Target Reach :";
   var recArea=dom.newEl("b");
   recArea.attr("id","reach_area");
   recLabel.attr("style","margin-left : 20px");
   recArea.innerHTML="0";
   
   var sentLabel=dom.newEl("span");
   sentLabel.innerHTML="Sent :";
   var sentArea=dom.newEl("b");
   sentArea.attr("id","sent_area");
   sentLabel.attr("style","margin-left : 20px");
   sentArea.innerHTML="0";
   
   var failLabel=dom.newEl("span");
   failLabel.innerHTML="Failed :";
   var failArea=dom.newEl("b");
   failArea.attr("id","fail_area");
   failLabel.attr("style","margin-left : 20px");
   failArea.innerHTML="0";
   
   
   infoDiv.add(charLabel);
   infoDiv.add(charArea);
   infoDiv.add(recLabel);
   infoDiv.add(recArea);
   infoDiv.add(sentLabel);
   infoDiv.add(sentArea);
   infoDiv.add(failLabel);
   infoDiv.add(failArea);
   
   var filters=dom.newEl("div");
   filters.attr("style","border : 2px solid #eee; padding : 5px");
   filters.attr("id","filters_div");
   var classLabel=document.createTextNode(" Class ");
   var classSelect=dom.newEl("select");
   classSelect.attr("id","class_select");
   classSelect.attr("onchange","javascript:message.targetReach()");
   var opt=dom.newEl("option");
   opt.innerHTML="All";
   opt.value="all";
   classSelect.add(opt);
   
   var streamLabel=document.createTextNode(" Stream ");
   var streamSelect=dom.newEl("select");
   streamSelect.attr("id","stream_select");
   streamSelect.attr("onchange","javascript:message.targetReach()");
   var opt1=dom.newEl("option");
   opt1.innerHTML="All";
   opt1.value="all";
   streamSelect.add(opt1);
   
   var recDiv=dom.newEl("div");
   recDiv.attr("id","recipients_div");
   
   filters.add(classLabel);
   filters.add(classSelect);
   filters.add(streamLabel);
   filters.add(streamSelect);
   
   form.add(txt);
   form.add(infoDiv);
   form.add(filters);
   form.add(recDiv);
   form.add(dom.newEl("br"));
   var comLabel=dom.newEl("label");
   comLabel.innerHTML="Modem COM";
   form.add(comLabel);
   form.add(com);
   var pinLabel=dom.newEl("label");
   pinLabel.innerHTML="Modem Pin";
   form.add(pinLabel);
   form.add(pin);
   var manLabel=dom.newEl("label");
   manLabel.innerHTML="Modem Manufacturer";
   form.add(manLabel);
   form.add(man);
   var modelLabel=dom.newEl("label");
   modelLabel.innerHTML="Modem Model";
   form.add(modelLabel);
   form.add(model);
   form.add(dom.newEl("br"));
   form.add(btn);
   form.add(btn1);
   form.add(btn2);
   form.add(btn3);
   form.add(btn4);
    var json1={
                 request_header : {
                     request_msg : "all_streams",
                     request_svc :"message_service"
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
                    var func=function(){
                       populateSelect("stream_select", resp["STREAM_NAME"],resp["ID"]);
                    };
                    dom.waitTillElementReady("stream_select", func);
                } 
          }); 
          
            var json3={
                 request_header : {
                     request_msg : "recipient_fields",
                     request_svc :"message_service"
                  },
                  request_object : {  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch recipient fields");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    message.recipientFields=resp;
                } 
          });
          
             var json4={
                 request_header : {
                     request_msg : "all_classes",
                     request_svc :"message_service"
                  },
                  request_object : {  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json4,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all classes");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    var func=function(){
                       populateSelect("class_select", resp["CLASS_NAME"],resp["ID"]);
                    };
                    dom.waitTillElementReady("class_select", func);
                } 
          }); 
   
   
   },
   
   addRecipients : function (){
      var select=dom.newEl("select");
      var id=new Date().getTime()+"_select";
      select.attr("id",id);
      select.attr("onchange","message.targetReach()");
      var func="message.targetReach()";
      CloseDiv(select,"recipients_div",null,func);
      var studentFields=message.recipientFields.student_fields.FIELD_NAME;
      populateSelect(id,studentFields,studentFields);
      message.targetReach();
   },
  countChars : function() {
        var val=dom.el("message_area");
        var len = val.value.length;
        $('#char_area').text(160 - len);
      },
  targetReach : function() {
       var fields=dom.el("recipients_div");
       var classId=dom.el("class_select").value;
       var streamId=dom.el("stream_select").value;
       var studentFields=[];
       for(var x=0; x<fields.children.length; x++){
           var value=fields.children[x].children[1].value;
           if(studentFields.indexOf(value)===-1){
              studentFields.push(value); 
           }
       }
          var json3={
                 request_header : {
                     request_msg : "target_reach",
                     request_svc :"message_service"
                  },
                  request_object : {
                   student_fields : studentFields,
                   class_id :classId,
                   stream_id : streamId
                }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to retrieve target reach");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    dom.el("reach_area").innerHTML=resp.TARGET_REACH;
                } 
          });
      },
      sendMessage : function(){
       var fields=dom.el("recipients_div");
       var classId=dom.el("class_select").value;
       var streamId=dom.el("stream_select").value;
       var msg=dom.el("message_area").value;
       var studentFields=[];
       for(var x=0; x<fields.children.length; x++){
           var value=fields.children[x].children[1].value;
           if(studentFields.indexOf(value)===-1){
              studentFields.push(value); 
           }
       }
       if(studentFields.length===0){
          setInfo("No recipients specified"); 
          return;
       }
         var json3={
                 request_header : {
                     request_msg : "send_message",
                     request_svc :"message_service"
                  },
                  request_object : {
                   student_fields : studentFields,
                   class_id :classId,
                   stream_id : streamId,
                   msg :msg
                }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to send message");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(json.response.type==="exception"){
                      setInfo(json.response.ex_reason);  
                    }
                    if(resp==="fail"){
                       setInfo(json.response.reason);   
                    }
                    else if(resp==="success"){
                     setInfo("The server has received your request to send a message and might take some time to finish");    
                    }
                } 
          });
      },
    startMessageService :function(){
        var json3={
                 request_header : {
                     request_msg : "start_message_service",
                     request_svc :"message_service"
                  },
                 request_object : {
                   modem_com : dom.el("modem_com").value,
                   modem_pin : dom.el("modem_pin").value,
                   modem_manuf : dom.el("modem_manuf").value,
                   modem_model : dom.el("modem_model").value
                   }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to start message service");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(json.response.type==="exception"){
                      setInfo(json.response.ex_reason);  
                    }
                    if(resp==="success"){
                       setInfo("Message service started successfully");   
                    }
                    else if(resp==="fail"){
                        setInfo("Starting Message service failed");  
                    }
                    
                } 
          });  
    },
   checkMessageProgress : function(){
       var json3={
                 request_header : {
                     request_msg : "check_message_progress",
                     request_svc :"message_service"
                  },
                  request_object : {
                
                }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to check message progress");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(json.response.type==="exception"){
                      setInfo(json.response.ex_reason);  
                    }
                   dom.el("sent_area").innerHTML=resp.message_sent;
                   dom.el("fail_area").innerHTML=resp.message_fail;
                    
                } 
          });  
   },
   resendFailedMessages : function(){
       var json3={
                 request_header : {
                     request_msg : "resend_failed_messages",
                     request_svc :"message_service"
                  },
                  request_object : {
                
                }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to resend failed messages");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(json.response.type==="exception"){
                      setInfo(json.response.ex_reason);  
                    }
                   dom.el("sent_area").innerHTML=resp.message_sent;
                   dom.el("fail_area").innerHTML=resp.message_fail;
                    
                } 
          });  
   }
};