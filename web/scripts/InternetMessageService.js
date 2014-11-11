var message={
 recipientFields :{},
 listRecipients :{},
 messageView : function(){
   var names=["<img src='img/sms.png'/> Send Message",
        "<img src='img/teacher.png'/> Message Templates",
        "<img src='img/list.png'/> Message Lists"
     ];
   var links=["javascript:message.messageView()","javascript:message.templates()","javascript:message.listView()"];    
   var menu=new Menu(names,links);
   menu.showMenu();
   var form=new Form(null,"main-view-form");
   setTitle("Send Message");
   var txt=dom.newEl("textarea");
   txt.attr("class","input-xxlarge");
   txt.attr("id","message_area");
   txt.attr("style","width : 900px; height : 200px");
   txt.attr("placeholder","Enter Message");
   txt.attr("onkeyup","message.countChars()");
   
   
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
   
   var btn5=dom.newEl("input");
   btn5.attr("type","button");
   btn5.attr("class","btn btn-primary btn-medium");
   btn5.attr("style","margin-left : 5px;");
   btn5.attr("value","Stop Sending Messages");
   btn5.attr("onclick","message.stopSendingMessages()");
   
   var infoDiv=dom.newEl("div");
   infoDiv.attr("style","border : 2px solid #eee; padding : 15px");
   var charLabel=dom.newEl("span");
   charLabel.innerHTML="Characters :";
   charLabel.attr("style","margin-right: 5px;padding: 5px;background: lightgray;border-radius: 5px;text-decoration : none;");
   var charArea=dom.newEl("b");
   charArea.attr("id","char_area");
   charArea.innerHTML="0";
   
   var recLabel=dom.newEl("span");
   recLabel.attr("style","margin-right: 5px;margin-left: 10px;padding: 5px;background: lightgray;border-radius: 5px;text-decoration : none;");
   recLabel.innerHTML="Target Reach :";
   var recArea=dom.newEl("b");
   recArea.attr("id","reach_area");
   recArea.innerHTML="0";
   
   var sentLabel=dom.newEl("span");
   sentLabel.attr("style","margin-right: 5px;margin-left: 10px;padding: 5px;background: lightgray;border-radius: 5px;text-decoration : none;");
   sentLabel.innerHTML="Sent :";
   var sentArea=dom.newEl("b");
   sentArea.attr("id","sent_area");
   sentArea.innerHTML="0";
   
   var failLabel=dom.newEl("span");
   failLabel.attr("style","margin-right: 5px;margin-left: 10px;padding: 5px;background: lightgray;border-radius: 5px;text-decoration : none;");
   failLabel.innerHTML="Failed :";
   var failArea=dom.newEl("b");
   failArea.attr("id","fail_area");
   failArea.innerHTML="0";
   
   var balLabel=dom.newEl("span");
   balLabel.attr("style","margin-right: 5px;margin-left: 10px;padding: 5px;background: lightgray;border-radius: 5px;text-decoration : none;");
   balLabel.innerHTML="SMS Balance :";
   var balArea=dom.newEl("b");
   balArea.attr("id","bal_area");
   balArea.innerHTML="0";
   
   var accLabel=dom.newEl("span");
   accLabel.attr("style","margin-right: 5px;margin-left: 10px;padding: 5px;background: lightgray;border-radius: 5px;text-decoration : none;");
   accLabel.innerHTML="Account Type :";
   var accArea=dom.newEl("b");
   accArea.attr("id","acc_area");
   accArea.innerHTML="";
   
   var preview=dom.newEl("a");
   preview.attr("href","#");
   preview.innerHTML="Preview Message";
   preview.attr("style","margin-right: 5px;margin-left: 10px;padding: 5px;background: #51CBEE;border-radius: 5px;text-decoration : none;");
   preview.attr("onclick","message.previewMessage()");
   
   
   infoDiv.add(charLabel);
   infoDiv.add(charArea);
   infoDiv.add(recLabel);
   infoDiv.add(recArea);
   infoDiv.add(sentLabel);
   infoDiv.add(sentArea);
   infoDiv.add(failLabel);
   infoDiv.add(failArea);
   infoDiv.add(balLabel);
   infoDiv.add(balArea);
   infoDiv.add(accLabel);
   infoDiv.add(accArea);
   infoDiv.add(preview);
   
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
   
   var templateLabel=document.createTextNode(" Template ");
   var templateSelect=dom.newEl("select");
   templateSelect.attr("id","template_select");
   templateSelect.attr("onchange","javascript:message.fetchTemplate()");

   
   var recDiv=dom.newEl("div");
   recDiv.attr("id","recipients_div");
   
   filters.add(classLabel);
   filters.add(classSelect);
   filters.add(streamLabel);
   filters.add(streamSelect);
   filters.add(templateLabel);
   filters.add(templateSelect);
   
   form.add(txt);
   form.add(infoDiv);
   form.add(filters);
   form.add(recDiv);
   form.add(dom.newEl("br"));
   form.add(dom.newEl("br"));
   form.add(btn);
   form.add(btn1);
   form.add(btn3);
   form.add(btn4);
   form.add(btn5);
   message.fetchTemplateNames();
   message.smsData();
    var json1={
                 request_header : {
                     request_msg : "all_streams,recipient_fields,all_classes,all_message_lists",
                     request_svc :"message_service,message_service,message_service,message_service"
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
                    allStreams = json.response.message_service_all_streams;
                    var func = function(){
                       populateSelect("stream_select", allStreams["STREAM_NAME"],allStreams["ID"]);
                    };
                    dom.waitTillElementReady("stream_select", func);
                    
                    var classes = json.response.message_service_all_classes;
                    var func = function(){
                       populateSelect("class_select", classes["CLASS_NAME"],classes["ID"]);
                    };
                    dom.waitTillElementReady("class_select", func);
                    
                    
                    message.recipientFields = json.response.message_service_recipient_fields.student_fields.FIELD_NAME;
                    
                    message.listRecipients = json.response.message_service_all_message_lists;
                     
                } 
          }); 
          
   
   },
   smsData : function(){
         var json={
                 request_header : {
                     request_msg : "sms_data",
                     request_svc :"message_service"
                  },
                  request_object : {  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch sms data");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    dom.el("acc_area").innerHTML=resp.sms_account_type;
                    dom.el("bal_area").innerHTML=resp.sms_balance;
                } 
          });  
   },
   listView : function(){
        var form=new Form(null,"main-view-form");
        setTitle("Message Lists");
           
        var btn=dom.newEl("input");
        btn.attr("type","button");
        btn.attr("class","btn btn-primary btn-medium");
        btn.attr("value","Create List");
        btn.attr("onclick","ui.modal('Create List','message.createListUI()','message.saveMessageList()')");
        
        var btn2=dom.newEl("input");
        btn2.attr("type","button");
        btn2.attr("style","margin-left : 5px;");
        btn2.attr("class","btn btn-primary btn-medium");
        btn2.attr("value","All Lists");
        btn2.attr("onclick","message.allMessageLists()");
   
        var div=dom.newEl("div");
        div.attr("id","all_lists_view");
       
       form.add(btn);
       form.add(btn2);
       form.add(div);
      
   },
   createListUI : function(){
        var createDiv=dom.newEl("div");
        var name=dom.newEl("input");
        name.attr("placeholder","List Name");
        name.attr("type","text");
        name.attr("class","input-xxlarge");
        name.attr("id","list_name");
        
        var btn=dom.newEl("input");
        btn.attr("type","button");
        btn.attr("style","margin-left : 5px;");
        btn.attr("class","btn btn-primary btn-medium");
        btn.attr("value","Add Person");
        btn.attr("onclick","message.addEditPersonToList('','','person_list')");
        
        var div=dom.newEl("div");
        div.attr("id","person_list");
        
        createDiv.add(name);
        createDiv.add(dom.newEl("br"));
        createDiv.add(btn);
        createDiv.add(div);
        dom.el("modal-content").add(createDiv);
   },
   editListUI : function(){
        var createDiv=dom.newEl("div");
        var name=dom.newEl("input");
        name.attr("placeholder","List Name");
        name.attr("type","text");
        name.attr("class","input-xxlarge");
        name.attr("id","list_name");
        
        var btn=dom.newEl("input");
        btn.attr("type","button");
        btn.attr("style","margin-left : 5px;");
        btn.attr("class","btn btn-primary btn-medium");
        btn.attr("value","Add Person");
        btn.attr("onclick","message.addEditPersonToList('','','person_list')");
        
        var div=dom.newEl("div");
        div.attr("id","person_list");
        
        createDiv.add(name);
        createDiv.add(dom.newEl("br"));
        createDiv.add(btn);
        createDiv.add(div);
        dom.el("modal-content").add(createDiv);
   },
   selectSingleRecipient : function(checkId){
      var check = dom.el(checkId);
      var checked = check.checked;
      var name = check.nextSibling;
      var phone = name.nextSibling;
      if(checked){
         name.setAttribute("class","namechecked");
         phone.setAttribute("class","phonechecked");
      }
      else{
         name.removeAttribute("class"); 
         phone.removeAttribute("class"); 
      }
   },
   selectAllRecipients : function(divId){
      var elements = $("#"+divId).find("input:checkbox");
      var current=$("#_select_"+divId).attr("current");
      for(var x=0; x<elements.length; x++){
         var checked = elements[x].checked;
         var name = elements[x].nextSibling;
         var phone = name.nextSibling;
         // if current === none that means we need to select everything
         if(checked){
           if(current === "all"){
              elements[x].checked = false;   
              name.removeAttribute("class");
              phone.removeAttribute("class");
           } 
         }
         else{
            if(current === "none"){
              elements[x].checked = true; 
              name.setAttribute("class","namechecked");
              phone.setAttribute("class","phonechecked");
            }
         }
      }
      current = current === "none" ? "all" : "none";
      $("#_select_"+divId).attr("current",current);
   },
   addSelectPersonToList : function(personName,personPhone,divId){
        var editArea = dom.el(divId);
        var div = dom.newEl("div");
        var check = dom.newEl("input");
        check.attr("type", "checkbox");
        check.attr("style", "margin : 10px");
        var extraId = Math.floor(Math.random()*100000000);
        var id = divId+"_"+extraId;
        check.attr("onclick","message.selectSingleRecipient('"+id+"')");
        check.attr("id",id);
        var name = dom.newEl("input");
        name.attr("type", "text");
        name.attr("class", "input-large");
        name.attr("placeholder", "Name");
        name.attr("value",personName);
        name.attr("class","name");
        var phone = dom.newEl("input");
        phone.attr("type", "text");
        phone.attr("class", "input-large");
        phone.attr("style", "margin-left : 5px");
        phone.attr("placeholder", "Phone No");
        phone.attr("value",personPhone);
        phone.attr("class","phone");
        div.add(check);
        div.add(name);
        div.add(phone);
        editArea.add(div); 
        
   },
   addEditPersonToList : function(personName,personPhone,area){
        var contDiv=dom.newEl("div");
        var name=dom.newEl("input");
        name.attr("placeholder","Person Name");
        name.attr("type","text");
        name.attr("class","input-large");
        name.attr("id","person_name"); 
        name.attr("style"," margin-right : 5px;margin-top : 5px");
        if(personName){
          name.attr("value",personName);   
        }
        
        var phone=dom.newEl("input");
        phone.attr("placeholder","Phone No");
        phone.attr("type","text");
        phone.attr("class","input-large");
        phone.attr("id","person_phone");
        phone.attr("style","margin-top : 5px");
        if(personPhone){
          phone.attr("value",personPhone);   
        }
    
        contDiv.add(name);
        contDiv.add(phone);
        contDiv.add(dom.newEl("br"));
        CloseDiv(contDiv,area);
   },
   addPersonToList : function(){
        var name=dom.newEl("input");
        name.attr("placeholder","Person Name");
        name.attr("type","text");
        name.attr("class","input-large");
        name.attr("id","person_name"); 
        name.attr("style"," margin-right : 5px;margin-top : 5px");
        
        var phone=dom.newEl("input");
        phone.attr("placeholder","Phone No");
        phone.attr("type","text");
        phone.attr("class","input-large");
        phone.attr("id","person_phone");
        phone.attr("style","margin-top : 5px");
        
        var area=dom.el("person_list");
        area.add(name);
        area.add(phone);
        area.add(dom.newEl("br"));
   },
   saveMessageList : function(){
     var area=dom.el("person_list");
     var names=[];
     var phones=[];
     var listName=dom.el("list_name");
     if(listName.value.trim()===""){
        listName.focus();
        return;
     }
     for(var x=0; x<area.children.length;x++){
        var name=area.children[x].children[1].children[0];
        var phone=area.children[x].children[1].children[1];
        if(name.value.trim()===""){
           name.focus();
           return;
        }
        if(phone.value.trim()===""){
           phone.focus(); 
           return;
        }
        names.push(name.value);
        phones.push(phone.value);
     }
     
     
       var json={
                 request_header : {
                     request_msg : "create_message_list",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    names : names,
                    phones : phones,
                    list_name : listName.value
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create message list");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="fail"){
                       setInfo(json.response.reason);
                    }
                    else if(resp==="success"){
                       setInfo("List created successfully"); 
                    }
                } 
          });
    
     $("#alert-window").modal('hide');
   },
   saveEditMessageList : function(listId,oldListName){
     var area=dom.el("person_list");
     var names=[];
     var phones=[];
     var listName=dom.el("list_name");
     if(listName.value.trim()===""){
        listName.focus();
        return;
     }
     for(var x=0; x<area.children.length;x++){
        var name=area.children[x].children[1].children[0];
        var phone=area.children[x].children[1].children[1];
        if(name.value.trim()===""){
           name.focus();
           return;
        }
        if(phone.value.trim()===""){
           phone.focus(); 
           return;
        }
        names.push(name.value);
        phones.push(phone.value);
     } 
       var json={
                 request_header : {
                     request_msg : "edit_message_list",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    names : names,
                    phones : phones,
                    id : listId,
                    list_name : listName.value,
                    old_list_name : oldListName
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to edit message list");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="fail"){
                       setInfo(json.response.reason);
                    }
                    else if(resp==="success"){
                       setInfo("List edited successfully"); 
                    }
                } 
          });
    
     $("#alert-window").modal('hide');
   },
   allMessageLists : function (){
    var json={
                 request_header : {
                     request_msg : "all_message_lists",
                     request_svc :"message_service"
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
                     setInfo("An error occurred when attempting to fetch all message lists");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    var table=dom.newEl("table");
                    table.attr("class","table table-condensed")
                    var tr=dom.newEl("tr");
                    var th=dom.newEl("th");
                    var th1=dom.newEl("th");
                    var th2=dom.newEl("th");
                    th.innerHTML="List Name";
                    th1.innerHTML="Created";
                    th2.innerHTML="Delete";
                    tr.add(th);
                    tr.add(th1);
                    tr.add(th2);
                    table.add(tr);
                    for(var x=0; x<resp.LIST_NAME.length; x++){
                       var tr1=dom.newEl("tr");
                       var td=dom.newEl("td");
                       var td1=dom.newEl("td");
                       var td2=dom.newEl("td");
                       var aEdit=dom.newEl("a");
                       aEdit.attr("href","#");
                       aEdit.attr("onclick","message.editMessageList(\""+resp.ID[x]+"\",\""+resp.LIST_NAME[x]+"\")");
                       aEdit.innerHTML=resp.LIST_NAME[x];
                       td.add(aEdit);
                       td1.innerHTML=new Date(resp.CREATED[x]).toLocaleString();
                       var aDelete=dom.newEl("a");
                       aDelete.attr("href","#");
                       aDelete.attr("onclick","message.deleteMessageList(\""+resp.ID[x]+"\")");
                       aDelete.innerHTML="Delete";
                       td2.add(aDelete);
                       tr1.add(td);
                       tr1.add(td1);
                       tr1.add(td2);
                       table.add(tr1);
                    }
                   var form= dom.el("all_lists_view");
                   form.innerHTML="";
                   form.add(dom.newEl("br"));
                   form.add(table);
                } 
          });   
   },
   deleteMessageList : function(id){
      var conf=confirm("Delete message list, you will lose all contacts in this list, proceed?");
      if(!conf){
         return;
      }
      var json={
                 request_header : {
                     request_msg : "delete_message_list",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    id : id
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to delete message list");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("List deleted successfully");
                    }
                } 
          });      
   },
   editMessageList : function(listId,name){
      ui.modal('Edit List','message.editListUI()',"message.saveEditMessageList(\""+listId+"\",\""+name+"\")");
      dom.el("list_name").value=name;
      var json={
                 request_header : {
                     request_msg : "all_list_members",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    id : listId
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to edit message list");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    for(var x=0; x<resp.ID.length; x++){
                       message.addEditPersonToList(resp.PERSON_NAME[x],resp.PERSON_PHONE[x],'person_list');  
                    }    
                } 
          });  
   },
   templates : function(){
        var form=new Form(null,"main-view-form");
         setTitle("Message Templates");
        var txt=dom.newEl("textarea");
        txt.attr("class","input-xxlarge");
        txt.attr("id","message_area");
        txt.attr("style","width : 900px; height : 200px");
        txt.attr("placeholder","Enter Message");
        txt.attr("onkeyup","message.countChars()");
        
         var charLabel=document.createTextNode("Characters : ");
         var charArea=dom.newEl("b");
         charArea.attr("id","char_area");
         charArea.innerHTML="0";
   
        var btn=dom.newEl("input");
        btn.attr("type","button");
        btn.attr("class","btn btn-primary btn-medium");
        btn.attr("value","Create Template");
        btn.attr("onclick","message.createTemplate()");
   
        var btn1=dom.newEl("input");
        btn1.attr("type","button");
        btn1.attr("class","btn btn-primary btn-medium");
        btn1.attr("style","margin-left : 5px;");
        btn1.attr("value","Update Template");
        btn1.attr("onclick","message.updateTemplate()");
        
        var btn2=dom.newEl("input");
        btn2.attr("type","button");
        btn2.attr("class","btn btn-primary btn-medium");
        btn2.attr("style","margin-left : 5px;");
        btn2.attr("value","Delete Template");
        btn2.attr("onclick","message.deleteTemplate()");
        
        var name=dom.newEl("input");
        name.attr("placeholder","Template Name");
        name.attr("type","text");
        name.attr("class","input-xxlarge");
        name.attr("id","template_name");
        
        var templateLabel=document.createTextNode(" Template ");
        var templateSelect=dom.newEl("select");
        templateSelect.attr("id","template_select");
        templateSelect.attr("onchange","javascript:message.fetchTemplate()");
        
        form.add(txt);
        form.add(dom.newEl("br"));
        form.add(charLabel);
        form.add(charArea);
        form.add(dom.newEl("br"));
        form.add(dom.newEl("br"));
        form.add(name);
        form.add(templateLabel);
        form.add(templateSelect);
        form.add(dom.newEl("br"));
        form.add(btn);
        form.add(btn1);
        form.add(btn2);
        message.fetchTemplateNames();
   
   },
    createTemplate : function(){
      var tempName=dom.el("template_name");
      var tempValue=dom.el("message_area");
      if(tempName.value.trim()===""){
         setInfo("A name for the template is required");
         tempName.focus();
         return;
      }
       if(tempValue.value.trim()===""){
         setInfo("What is the template you are saving ?");
         tempValue.focus();
         return;
      }
      var json5={
                 request_header : {
                     request_msg : "create_template",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    template_name : tempName.value,
                    template_value : tempValue.value
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json5,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create template");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Template created successfully"); 
                    }
                    else{
                      setInfo(json.response.reason);   
                    }
                } 
          });      
   },
   updateTemplate : function(){
      var tempName=dom.el("template_name");
      var tempValue=dom.el("message_area");
      if(tempName.value.trim()===""){
         setInfo("A name for the template is required");
         tempName.focus();
         return;
      }
       if(tempValue.value.trim()===""){
         setInfo("What is the template you are saving ?");
         tempValue.focus();
         return;
      }
      var json5={
                 request_header : {
                     request_msg : "update_template",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    template_id : dom.el("template_select").value,
                    template_name : tempName.value,
                    template_value : tempValue.value
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json5,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to update template");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Template updated successfully"); 
                    }
                } 
          });      
   },
   fetchTemplate : function(){
     var json5={
                 request_header : {
                     request_msg : "fetch_template",
                     request_svc :"message_service"
                  },
                  request_object : {  
                    template_id : dom.el("template_select").value
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json5,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch template");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(dom.el("template_name")){
                      dom.el("template_name").value=resp["TEMPLATE_NAME"][0];  
                    }
                    dom.el("message_area").value=resp["TEMPLATE_VALUE"][0];
                } 
          });    
   },
   fetchTemplateNames : function (){
     var json5={
                 request_header : {
                     request_msg : "fetch_template_names",
                     request_svc :"message_service"
                  },
                  request_object : {  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json5,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch all template names");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    var func=function(){
                       populateSelect("template_select", resp["TEMPLATE_NAME"],resp["ID"]);
                    };
                    dom.waitTillElementReady("template_select", func);
                } 
          });  
   },
   editRecipients : function(id,divId){
       var classId=dom.el("class_select").value;
       var streamId=dom.el("stream_select").value;
       var select=dom.el(id);
       var value=select.value;
       var option=select.selectedOptions[0].innerHTML;
       var type;
       if(value===option){
          type="student";
       }
       else{
         type="list";  
       }
       var json5={
                 request_header : {
                     request_msg : "all_recipients",
                     request_svc :"message_service"
                  },
                  request_object : {
                    class_id : classId,
                    stream_id : streamId,
                    field_type : type,
                    field_value : value
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json5,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to edit recipients");
                  },
                  success : function(json){
                       var resp=json.response.data;
                       var selectAll = dom.newEl("input");
                       selectAll.attr("type", "checkbox");
                       selectAll.attr("style", "margin : 10px");
                       selectAll.attr("id","_select_"+divId);
                       selectAll.attr("current","none");
                       selectAll.attr("onclick","message.selectAllRecipients('"+divId+"')");
                       var allSpan = dom.newEl("span");
                       allSpan.innerHTML = "Select All";
                       var editArea = dom.el(divId);
                       editArea.add(dom.newEl("br"));
                       editArea.add(selectAll);
                       editArea.add(allSpan);
                       if(type==="list"){
                            var len=resp.PERSON_NAME.length;
                            if(len>50){
                                var conf=confirm("This list has many recipients, are you sure you want to edit it?"); 
                                if(!conf){
                                 return;
                                }
                            }
                            for(var x=0; x<resp.PERSON_NAME.length; x++){
                                message.addSelectPersonToList(resp.PERSON_NAME[x],resp.PERSON_PHONE[x],divId);
                            }
                      
                    }
                   else if(type==="student"){
                      var len=resp.STUDENT_NAME.length;
                      if(len>50){
                         var conf=confirm("There are very many recipients, are you sure you want to edit them?"); 
                         if(!conf){
                            return;
                         }
                      }
                      for(var x=0; x<resp.STUDENT_NAME.length; x++){
                           message.addSelectPersonToList(resp.STUDENT_NAME[x],resp[value.replace(/ /g,"_")][x],divId);
                       }
                   }
                } 
          });  
   },
   addRecipients : function (){
      var contDiv=dom.newEl("div");
      var divId=new Date().getTime()+"_recipient_cont";
      contDiv.attr("id",divId);
      var select=dom.newEl("select");
      var id=new Date().getTime()+"_select";
      select.attr("id",id);
      select.attr("onchange","message.targetReach()");
      
      var edit=dom.newEl("a");
      edit.attr("style","margin-left : 10px");
      edit.attr("class","btn btn-primary");
      edit.attr("onclick","message.editRecipients(\""+id+"\",\""+divId+"\")");
      edit.attr("href","#");
      edit.innerHTML="Edit";
      
      contDiv.add(select);
      contDiv.add(edit);
      
      var func="message.targetReach()";
      CloseDiv(contDiv,"recipients_div",null,func);
      var studentFields=message.recipientFields;
      populateSelect(id,studentFields,studentFields);
   
      var listNames=message.listRecipients.LIST_NAME;
      var listIds=message.listRecipients.ID;
      populateSelect(id,listNames,listIds);  
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
       var listIds=[];
       for(var x=0; x<fields.children.length; x++){
           var select=fields.children[x].children[1].firstChild;
           var value=select.value;
           var option=select.selectedOptions[0].innerHTML;
           if(option===value && studentFields.indexOf(value)===-1){
              //this is a student field 
              studentFields.push(value);
           }
           else if(option!==value && listIds.indexOf(value)===-1){
              //this is a list
             listIds.push(value);
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
                   stream_id : streamId,
                   list_ids : listIds
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
      previewMessage : function(){
         var msg=dom.el("message_area"); 
         var classId=dom.el("class_select").value;
         var streamId=dom.el("stream_select").value;
         if(msg.value.trim()===""){
          setInfo("No message to preview!");
          msg.focus();
          return;
        }
        var json={
                 request_header : {
                     request_msg : "preview_message",
                     request_svc :"message_service"
                  },
                  request_object : {
                   msg : encodeURIComponent(msg.value),
                   class_id : classId,
                   stream_id : streamId
                }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to preview message");
                  },
                  success : function(json){
                    var resp=json.response.data;
                     if(json.response.type==="exception"){
                      setInfo(json.response.ex_reason);  
                    }
                    resp.message_preview = resp.message_preview.replace(/\n/g,"<br/>");
                    ui.modal("Message Preview : Messages : "+resp.count+"","message.previewMessageUI('"+resp.message_preview+"')",'message.dismissModal()');
                } 
          });
       
      },
      dismissModal : function(){
       $("#alert-window").modal('hide');   
      },
      previewMessageUI: function(txt){
        dom.el("modal-content").innerHTML = txt;   
      },
      sendMessage : function(){
       var msg=dom.el("message_area");
       var fields=dom.el("recipients_div");
       var classId=dom.el("class_select").value;
       var streamId=dom.el("stream_select").value;
       var names=[];
       var phones=[];
       var studentFields=[];
       var listIds=[];
       if(msg.value.trim()===""){
          setInfo("No message to send!");
          msg.focus();
          return;
       }
       for(var x=0; x<fields.children.length; x++){
           var select=fields.children[x].children[1].firstChild;
           var value=select.value;
           var option=select.selectedOptions[0].innerHTML;
           var len=fields.children[x].children[1].children.length;
           if(option===value && studentFields.indexOf(value)===-1){
              //this is a student field 
              if((len-2)===0){
                //this means nobody clicked the edit button
                 studentFields.push(value);
              }
           }
           else if(option!==value && listIds.indexOf(value)===-1){
              //this is a list
              if((len-2)===0){
                //this means nobody clicked the edit button
                 listIds.push(value);
              }
           }
       }
       var phoneElements = $("#recipients_div").find(".phonechecked");
       var nameElements = $("#recipients_div").find(".namechecked")
       for(var y=0 ; y<phoneElements.length; y++){
          names.push(nameElements[y].value);
          phones.push(phoneElements[y].value);
       }

       if(studentFields.length===0 && listIds.length===0 && phones.length===0){
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
                   msg : encodeURIComponent(msg.value),
                   names : names,
                   phones : phones,
                   list_ids : listIds
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
                   message.generateFailedRecipients(resp);
                   
                } 
          });  
   },
   generateFailedRecipients : function(resp){
     var id=Math.floor(Math.random()*10000000);
     var win=window.open("",id,"width=800,height=650,scrollbars=yes,resizable=yes");
     win.document.write("<html><head>");
     win.document.write("<title>Failed Recipients</title>");
     win.document.write("<script type='text/javascript' src='scripts/ui.js'></script>");
     win.document.write("<link href='scripts/bootstrap.min.css' rel='stylesheet'>");
     win.document.write("<link href='scripts/bootstrap-responsive.min.css' rel='stylesheet'>");
     win.document.write("</head>");
     win.document.write("<div id='fail_area'></div>"); 
     var func=function(){
       win.ui.table("fail_area",["Name","Phone No"],[resp.failed_rcp_names,resp.failed_rcp_phones],true);   
     };
     setTimeout(func,1000);
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
                    if(resp==="fail"){
                       setInfo(json.response.reason);   
                    }
                    else if(resp==="success"){
                      setInfo("The server has received your request to send a message and might take some time to finish");    
                    }
                    
                   dom.el("sent_area").innerHTML=resp.message_sent;
                   dom.el("fail_area").innerHTML=resp.message_fail;
                    
                } 
          });  
   },
   stopSendingMessages : function(){
        var conf=confirm("This will interrupt any messages that have not been sent,continue?");
        if(!conf){
           return; 
        }
          var json3={
                 request_header : {
                     request_msg : "stop_sending_messages",
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
                     setInfo("An error occurred when attempting to stop sending messages");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                      setInfo("Sending of messages has been terminated");  
                    }
                    
                } 
          });   
   },
   deleteTemplate : function(){
        var conf=confirm("This will delete this template,continue?");
        if(!conf){
           return; 
        }
          var json3={
                 request_header : {
                     request_msg : "delete_template",
                     request_svc :"message_service"
                  },
                  request_object : {
                     template_id : dom.el("template_select").value
                   }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json3,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to delete template");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                      setInfo("Template deleted successfully");  
                    }
                    else{
                      setInfo(json.response.reason);  
                    }
                    
                } 
          });   
   }
};