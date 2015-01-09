var activate={
  copyright : "Quest Shule is a copyright of Quest in Nairobi, Kenya. <a href='https://quest-access.appspot.com'>Quest Online</a>",
  activateView : function(){
     var form=new Form(null,"main-view-form");
     setTitle("Activation Details");
     var schoolLabel=dom.newEl("label");
     schoolLabel.innerHTML="School Name";
     
     var schoolKey=dom.newEl("input");
     schoolKey.attr("type","text");
     schoolKey.attr("class","input-xxlarge");
     schoolKey.attr("id","email_address");
     
     var activeLabel=dom.newEl("label");
     activeLabel.innerHTML="Activation Key";
     
     var activeKey=dom.newEl("input");
     activeKey.attr("type","text");
     activeKey.attr("class","input-xxlarge");
     activeKey.attr("id","active_key");
     
     var smsLabel=dom.newEl("label");
     smsLabel.innerHTML="SMS Account";
     
     var smsKey=dom.newEl("input");
     smsKey.attr("type","text");
     smsKey.attr("class","input-xxlarge");
     smsKey.attr("id","sms_account");
     
     var btn=dom.newEl("input");
     btn.attr("type","button");
     btn.attr("class","btn btn-primary");
     btn.attr("value","Activate Application");
     btn.attr("onclick","activate.validateApplication()");
     
     form.add(schoolLabel);
     form.add(schoolKey);
     form.add(activeLabel);
     form.add(activeKey);
     form.add(smsLabel);
     form.add(smsKey);
     form.add(dom.newEl("br"));
     form.add(btn);
     form.add(dom.newEl("br"));
     activate.fetchActivationDetails();
  },
  fetchActivationDetails : function(){
      var json={
                 request_header : {
                     request_msg : "activation_details",
                     request_svc : "activation_service"
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
                     setInfo("An error occurred when attempting to fetch activation details");
                  },
                  success : function(json){
                    var aKey=json.response.data.ACTIVATION_KEY[0];
                    var email=json.response.data.USER_EMAIL[0];
                    var smsAcc=json.response.data.SMS_ACCOUNT[0];
                    dom.el("active_key").value=aKey;
                    dom.el("email_address").value=email;
                    dom.el("sms_account").value=smsAcc;
                    activate.validateApplication();
                    dom.el("active_key").value="";
                    dom.el("sms_account").value="";
               }
          });  
  },
  validateApplication : function(){
        var email=dom.el("email_address");
        var key=dom.el("active_key");
        var smsAcc=dom.el("sms_account").value;
        if(email.value.trim()===""){
           setInfo("Enter the gmail email address you used to obtain the activation key");
           email.focus();
           return;
        }
         if(key.value.trim()===""){
           setInfo("Enter the activation key you obtained from quest-access.appspot.com");
           key.focus();
           return;
        }
        var json={
                 request_header : {
                     request_msg : "validate_key",
                     request_svc : "activation_service"
                  },
                  request_object : {  
                    email_address : email.value,
                    activation_key : key.value,
                    sms_account : smsAcc
                  }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to activate application");
                  },
                  success : function(json){
                        if(!dom.el("active_div")){
                           var activeDiv=dom.newEl("div");
                           activeDiv.attr("style","border : 2px solid lightgray; padding : 20px");
                           activeDiv.attr("id","active_div");
                           var msg=dom.newEl("label");
                           msg.attr("id","msg_area");
                           var exp=dom.newEl("label");
                           exp.attr("id","exp_area");
                           var svc=dom.newEl("label");
                           svc.attr("id","svc_area");
                           var version = json.response.data.version_name +" " +  json.response.data.version_no;
                           var copyRight=dom.newEl("label");
                           copyRight.attr("id","copyright_area");
                           copyRight.attr("style","padding-top : 50px");
                           copyRight.innerHTML= activate.copyright + "<br/>" + version;
                           activeDiv.add(msg);
                           activeDiv.add(exp);
                           activeDiv.add(svc);
                           dom.el("main-view-form").add(dom.newEl("br"));
                           dom.el("main-view-form").add(activeDiv);
                           dom.el("main-view-form").add(copyRight);
                         }
                     if(json.response.data==="fail"){
                       dom.el("msg_area").innerHTML="Application is not activated,key is invalid"; 
                       dom.el("exp_area").innerHTML="";
                       dom.el("svc_area").innerHTML="";
                     }
                     else{
                           var expiry=new Date(parseInt(json.response.data.expiry)).toDateString();
                           dom.el("msg_area").innerHTML="Application is Activated,Restart application for changes to take effect";
                           dom.el("exp_area").innerHTML="Expiry Date: "+expiry;
                           dom.el("svc_area").innerHTML="Subscribed Services: "+json.response.data.services;
                     }
                } 
          });
  }
};


