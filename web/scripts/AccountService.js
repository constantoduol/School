var account={
   autoSuggestData: {},
   accountView : function(){
     var names=["<img src='img/operations.png'/> Account Operations",
        "<img src='img/teacher.png'/> Create Account",
        "<img src='img/history.png'/> Account History",
        "<img src='img/teacher.png'/> Batch Operations"
     ];
     var links=["javascript:account.accountView()","javascript:account.editAccount()","javascript:account.accountHistory()","javascript:account.batchView()"];    
     var menu=new Menu(names,links);
     menu.showMenu();
     var form=new Form(null,"main-view-form");
      setTitle("Account Operations");
     var func="account.upperAutoSuggest()";
     account.addAccountSearch(form,"select_account_1","auto_suggest_container_1","search_param_1","auto_suggest_1",func);  //select_account_1, auto_suggest_container_1,search_param_1,auto_suggest_1
  
     var acName=dom.newEl("input");
     acName.attr("class","input-xxlarge");
     acName.attr("type","text");
     acName.attr("readonly","readonly");
     acName.attr("id","account_name");
     var acNameLabel=dom.newEl("label");
     acNameLabel.innerHTML="Account Name";
     
     var acNo=dom.newEl("input");
     acNo.attr("type","text");
     acNo.attr("class","input-xxlarge");
     acNo.attr("readonly","readonly");
     acNo.attr("id","account_no");
     var acNoLabel=dom.newEl("label");
     acNoLabel.innerHTML="Account No";
     
     var acBalance=dom.newEl("input");
     acBalance.attr("type","text");
     acBalance.attr("class","input-xxlarge");
     acBalance.attr("readonly","readonly");
     acBalance.attr("id","account_balance");
     var acBalanceLabel=dom.newEl("label");
     acBalanceLabel.innerHTML="Account Balance";
     
     var amount=dom.newEl("input");
     amount.attr("type","number");
     amount.attr("class","input-xxlarge");
     amount.attr("id","tran_amount");
     var amountLabel=dom.newEl("label");
     amountLabel.innerHTML="Amount";
     
     var tranId=dom.newEl("input");
     tranId.attr("type","text");
     tranId.attr("class","input-xxlarge");
     tranId.attr("id","tran_id");
     tranId.attr("disabled","true");
     var tranIdLabel=dom.newEl("label");
     tranIdLabel.innerHTML="Transaction ID";
     
     var narr=dom.newEl("input");
     narr.attr("type","text");
     narr.attr("class","input-xxlarge");
     narr.attr("id","narration");
     var narrLabel=dom.newEl("label");
     narrLabel.innerHTML="Narration";
     
     var doubleEntry=dom.newEl("input");
     doubleEntry.attr("type","text");
     doubleEntry.attr("class","input-xxlarge");
     doubleEntry.attr("id","double_entry");
     var doubleEntryLabel=dom.newEl("label");
     doubleEntryLabel.innerHTML="Double Entry Account";
     
     
     var linkEntry=dom.newEl("input");
     linkEntry.attr("type","text");
     linkEntry.attr("class","input-xxlarge");
     linkEntry.attr("id","narration");
     var linkEntryLabel=dom.newEl("label");
     linkEntryLabel.innerHTML="Link Student";
        
     var debit=dom.newEl("input");
     debit.attr("type","button");
     debit.attr("value","Debit");
     debit.attr("class","btn btn-primary");
     debit.attr("onclick","account.transact(0)");
     debit.attr("style","margin : 10px;");
     
     var credit=dom.newEl("input");
     credit.attr("type","button");
     credit.attr("value","Credit");
     credit.attr("class","btn btn-primary");
     credit.attr("onclick","account.transact(1)");
     credit.attr("style","margin : 10px;");
         
     form.add(dom.newEl("hr"));
     form.add(acNameLabel);
     form.add(acName);
     form.add(acNoLabel);
     form.add(acNo);
     form.add(acBalanceLabel);
     form.add(acBalance);
     form.add(amountLabel);
     form.add(amount);
     form.add(narrLabel);
     form.add(narr);
     form.add(doubleEntryLabel);
     var func="account.lowerAutoSuggest()";
     account.addAccountSearch(form,"select_account_2","auto_suggest_container_2","search_param_2","auto_suggest_2",func);
     form.add(tranIdLabel);
     form.add(tranId);
     form.add(dom.newEl("br"));
     form.add(dom.newEl("br"));
     form.add(debit);
     form.add(credit);
      $(function() {
            $("#tran_date").datepicker({ 
                dateFormat: "yy-mm-dd",
                showButtonPanel: true,
                changeMonth: true,
                changeYear: true
             });
         }); 
   },
   
   editAccount : function(){
     var form=new Form(null,"main-view-form");
      setTitle("Create Account");
     var func="account.editAutoSuggest()";
     account.addAccountSearch(form,"select_account_2","auto_suggest_container_2","search_param_2","auto_suggest_2",func);
     var acName=dom.newEl("input");
     acName.attr("class","input-xxlarge");
     acName.attr("type","text");
     acName.attr("id","account_name");
     var acNameLabel=dom.newEl("label");
     acNameLabel.innerHTML="Account Name";
     
     var acNo=dom.newEl("input");
     acNo.attr("type","text");
     acNo.attr("class","input-xxlarge");
     acNo.attr("disabled");
     acNo.attr("id","account_no");
     var acNoLabel=dom.newEl("label");
     acNoLabel.innerHTML="Account No";
     
     var initialAmount=dom.newEl("input");
     initialAmount.attr("type","number");
     initialAmount.attr("class","input-xxlarge");
     initialAmount.attr("id","initial_amount");
     var initialAmountLabel=dom.newEl("label");
     initialAmountLabel.innerHTML="Account Balance";
     
     var acDescrip=dom.newEl("input");
     acDescrip.attr("type","text");
     acDescrip.attr("class","input-xxlarge");
     acDescrip.attr("id","account_descrip");
     var acDescripLabel=dom.newEl("label");
     acDescripLabel.innerHTML="Account Description";
     
     var create=dom.newEl("input");
     create.attr("type","button");
     create.attr("value","Create");
     create.attr("onclick","account.createAccount()");
     create.attr("class","btn btn-primary");
     create.attr("style","margin : 10px;");
     
     var edit=dom.newEl("input");
     edit.attr("type","button");
     edit.attr("value","Update");
     edit.attr("class","btn btn-primary");
     edit.attr("style","margin : 10px;");
     edit.attr("onclick","account.accountEdit()");
     
     var delet=dom.newEl("input");
     delet.attr("type","button");
     delet.attr("value","Delete");
     delet.attr("class","btn btn-primary");
     delet.attr("style","margin : 10px;");
     delet.attr("onclick","account.deleteAccount()");
     
     form.add(dom.newEl("hr"));
     form.add(acNameLabel);
     form.add(acName);
     form.add(acNoLabel);
     form.add(acNo);
     form.add(initialAmountLabel);
     form.add(initialAmount);
     form.add(acDescripLabel);
     form.add(acDescrip);
     form.add(dom.newEl("br"));
     form.add(dom.newEl("br"));
     form.add(create);
     form.add(edit);
     form.add(delet);
     
     
   },
   createAccount : function (){
     var acName=dom.el("account_name").value;  
     var acDescrip=dom.el("account_descrip").value; 
     var initialAmount= dom.el("initial_amount");
     if(acName.trim()===""){
       setInfo("Please provide a valid account name");
       return;
     }
      if(initialAmount.value.trim()===""){
        setInfo("Please set some initial amount");
        initialAmount.focus();
        return;  
      }
        var json={
                 request_header : {
                     request_msg : "create_account",
                     request_svc : "account_service"
                  },
                  
                  request_object : {  
                    account_name : acName,
                    account_descrip : acDescrip,
                    initial_amount : initialAmount.value
                  }
              };
          
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to create account");
                  },
                  success : function(json){
                    var id=json.response.data;
                    setInfo("Account created successfully");
                    dom.el("account_no").value=id;
                } 
          });
     
   },
   addAccountSearch : function (form,id1,id2,id3,id4,func){ //select_account_1, auto_suggest_container_1,search_param_1,auto_suggest_1
     var select=dom.newEl("select");
     select.attr("id",id1);
     var opt1=dom.newEl("option");
     opt1.innerText="Account No";
     opt1.text="Account No";
     opt1.value="account_no";
     var opt2=dom.newEl("option");
     opt2.innerText="Account Name";
     opt2.text="Account Name";
     opt2.value="account_name";
     var ul1=dom.newEl("ul");
     ul1.attr("style","margin-left : 0px");
     var li1=dom.newEl("li");
     li1.attr("style","list-style-type : none");
     li1.attr("class","dropdown");
     li1.attr("id",id2);
     ul1.add(li1);
     var input2=dom.newEl("input");
     input2.attr("type","text");
     input2.attr("id",id3);
     input2.attr("data-toggle","dropdown");
     input2.attr("placeholder","Search Accounts");
     input2.attr("class","dropdown-toggle input-xxlarge");
     input2.attr("search_type","account");
     input2.attr("onkeyup","javascript:account.accountAutoSuggest(\""+id1+"\",\""+id2+"\",\""+id3+"\",\""+id4+"\",\""+func+"\")");
     li1.add(input2);
     var ul2=dom.newEl("ul");
     ul2.attr("class","dropdown-menu");
     ul2.attr("id",id4);
     ul2.attr("style","display : none");
     li1.add(ul2);
     li1.add(select);
     select.add(opt2);
     select.add(opt1);
     form.add(ul1); 
   },
   accountAutoSuggest : function(id1,id2,id3,id4,func){ //select_account_1, auto_suggest_container_1,search_param_1,auto_suggest_1
    var input=dom.el(id3);
    if(input.value.trim()===""){
       return;
    }
    var fieldName=dom.el(id1).value;
    var json={
               request_header : {
                     request_msg : "account_auto_suggest",
                     request_svc : "account_service"
                  },
                  request_object : { 
                    field_name : fieldName,
                    like : input.value
                  }
              };
              
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
                    var values=resp["ACCOUNT_NAME"];
                    var ids=resp["ID"];
                    dom.el(id4).innerHTML="";
                    for(var x=0; x<values.length; x++){
                      var li=ui.element({
                            tag : "li",
                            parent : id4
                        });
                      ui.element({
                       tag : "a",
                       parent : li,
                       href : "#",
                       onclick : "javascript:account.completeAutoSuggest(\""+ids[x]+"\",\""+values[x]+"\",\""+id1+"\",\""+id2+"\",\""+id3+"\",\""+id4+"\",\""+func+"\")",
                       content : values[x]
                    });
                    ui.element({
                       tag : "li",
                       "class" :"divider",
                       parent : id4
                    });
                  }
                  if(values.length>0){
                      dom.el(id4).style.display="block";
                  }
                } 
          }); 
  
   },
   completeAutoSuggest : function (id,value,id1,id2,id3,id4,func){ //select_account_1, auto_suggest_container_1,search_param_1,auto_suggest_1
        dom.el(id3).value=value;
        dom.el(id3).attr("current_id",id);
        dom.el(id4).style.display="none";
        var json={
                 request_header : {
                     request_msg : "account_complete_auto_suggest",
                     request_svc : "account_service"
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
                     setInfo("An error occurred when attempting to complete auto suggest");
                  },
                  success : function(json){
                     account.autoSuggestData=json.response.data;
                     eval(func);
                } 
          });
     },
    accountEdit : function (){
      var search= dom.el("search_param_2"); 
      var currId=search.getAttribute("current_id");
      var acName=dom.el("account_name").value;
      var acDescrip= dom.el("account_descrip").value;
      var initialAmount= dom.el("initial_amount");
      if(currId===""){
        setInfo("No account selected to update");
        return;
      }
      if(initialAmount.value.trim()===""){
        setInfo("Please set some initial amount");
        initialAmount.focus();
        return;  
      }
         var json={
                 request_header : {
                     request_msg : "edit_account",
                     request_svc : "account_service"
                  },
                  request_object : {  
                    id : currId,
                    account_name : acName,
                    account_descrip : acDescrip,
                    initial_amount : initialAmount.value
                  }
              };
        Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to edit account");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Account updated successfully"); 
                    }
                } 
          });
    },
    
    deleteAccount : function(){
      var search= dom.el("search_param_2"); 
      var currId=search.getAttribute("current_id");
      var conf=confirm("Warning : deleting an account will delete its entire transaction history ");
      if(!conf){
         return; 
      }
      if(currId===""){
        setInfo("No account selected to delete");
        return;
      }
         var json={
                 request_header : {
                     request_msg : "delete_account",
                     request_svc : "account_service"
                  },
                  request_object : {  
                    id : currId
                  }
              };
        Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to delete account");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="success"){
                       setInfo("Account deleted successfully"); 
                    }
                } 
          });  
    },
  editAutoSuggest : function(){
      var resp=account.autoSuggestData;
      dom.el("account_name").value=resp["ACCOUNT_NAME"];
      dom.el("account_no").value=resp["ID"];
      dom.el("account_descrip").value=resp["ACCOUNT_DESCRIP"];  
      dom.el("initial_amount").value=account.formatMoney(resp["ACCOUNT_BALANCE"][0]);
  },
  upperAutoSuggest : function(){
     var resp=account.autoSuggestData;
     dom.el("account_name").value=resp["ACCOUNT_NAME"];
     dom.el("account_no").value=resp["ID"]; 
     dom.el("account_balance").value=account.formatMoney(resp["ACCOUNT_BALANCE"][0]);
  },
  lowerAutoSuggest : function(){
    var resp=account.autoSuggestData;
    var search= dom.el("search_param_2");
    search.value=resp["ACCOUNT_NAME"]+" | "+resp["ID"];
  },
   batchAutoSuggest : function(){
     var resp=account.autoSuggestData;
     var search= dom.el("search_param_2");
     search.value=resp["ACCOUNT_NAME"]+" | "+resp["ID"];
     dom.el("account_balance").value=account.formatMoney(resp["ACCOUNT_BALANCE"][0]);
  },
  transact : function (type){
     var search=dom.el("search_param_1");
     var acId=search.getAttribute("current_id");
     var amount=dom.el("tran_amount");
     var narr=dom.el("narration").value;
     var dEntry=dom.el("search_param_2");
     var dEntryId=dEntry.getAttribute("current_id");
     if(!acId){
        setInfo("Please specify an account to transact from"); 
        search.focus();
        return;
     }
     if(isNaN(amount.value) || amount.value.trim()===""){
       setInfo("Please provide a valid amount"); 
       amount.focus();
       return;  
     }
     if(!dEntryId){
        setInfo("Please specify an account for double entry"); 
        dEntry.focus();
        return;
     }
     if(acId===dEntryId){
        setInfo("Originating account same as double entry account"); 
        dEntry.focus();
        return;
     }
     
     var json={
                 request_header : {
                     request_msg : "transact",
                     request_svc : "account_service"
                  },
                  request_object : {  
                    account_id : acId,
                    double_entry_id : dEntryId,
                    amount : amount.value,
                    narration : narr,
                    tran_type : type
                  }
              };
        Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to transact");
                  },
                  success : function(json){
                    var resp=json.response.data;
                    if(resp==="fail"){
                       setInfo(json.response.reason); 
                    }
                    else{
                        dom.el("tran_id").value=resp;
                        setInfo("Transaction completed successfully");
                        dom.el("tran_amount").value="";
                    }
                } 
          }); 
     
     

     
  },
  accountHistory : function(){
     var form=new Form(null,"main-view-form");
      setTitle("Account History");
     var func="account.lowerAutoSuggest()";
     account.addAccountSearch(form,"select_account_2","auto_suggest_container_2","search_param_2","auto_suggest_2",func);  //select_account_1, auto_suggest_container_1,search_param_1,auto_suggest_1
     var bgnTxt=dom.newEl("label"); 
     bgnTxt.innerHTML="Begin Date";
     var date=dom.newEl("input");
     date.attr("type","text");  
     date.attr("data_type","datetime");
     date.attr("readonly","readonly");
     date.attr("style","cursor : pointer;");
     date.attr("id","begin_date");
     
     var endTxt=dom.newEl("label"); 
     endTxt.innerHTML="End Date";
     var date1=dom.newEl("input");
     date1.attr("type","text");  
     date1.attr("data_type","datetime");
     date1.attr("readonly","readonly");
     date1.attr("style","cursor : pointer;");
     date1.attr("id","end_date");
     
     var classLabel=dom.newEl("label");
     classLabel.innerHTML="Class";
     var classSelect=dom.newEl("select");
     classSelect.attr("id","class_select");
     var opt=dom.newEl("option");
     opt.innerHTML="All";
     opt.value="all";
     classSelect.add(opt);
  
     var streamLabel=dom.newEl("label");
     streamLabel.innerHTML="Stream";
     var streamSelect=dom.newEl("select");
     streamSelect.attr("id","stream_select");
     var opt1=dom.newEl("option");
     opt1.innerHTML="All";
     opt1.value="all";
     streamSelect.add(opt1);
     

     var open=dom.newEl("input");
     open.attr("type","button");  
     open.attr("class","btn btn-primary"); 
     open.attr("style","margin : 10px;");
     open.attr("value","Open History");
     open.attr("onclick","account.openHistory()");
     
    
     

     form.add(bgnTxt);
     form.add(date);
     form.add(endTxt);
     form.add(date1);
     form.add(classLabel);
     form.add(classSelect);
     form.add(streamLabel);
     form.add(streamSelect);
     form.add(dom.newEl("br"));
     form.add(open);
     $(function() {
            $("#begin_date").datepicker({ 
                dateFormat: "yy-mm-dd",
                showButtonPanel: true,
                changeMonth: true,
                changeYear: true
             });
         });
       $(function() {
            $("#end_date").datepicker({ 
                dateFormat: "yy-mm-dd",
                showButtonPanel: true,
                changeMonth: true,
                changeYear: true
             });
         });
       var json1={
                 request_header : {
                     request_msg : "all_streams",
                     request_svc :"account_service"
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
                    var func=function(){
                       populateSelect("stream_select", resp["STREAM_NAME"],resp["ID"]);
                    };
                    dom.waitTillElementReady("stream_select", func);
                } 
          }); 
      
          
             var json4={
                 request_header : {
                     request_msg : "all_classes",
                     request_svc :"account_service"
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
  addStudentSearch : function (form){
    var ul=dom.newEl("ul");
    ul.attr("style","margin-left : 0px");
    var li=dom.newEl("li");
    li.attr("style","list-style-type : none");
    li.attr("class","dropdown");
    li.attr("id","auto_suggest_container");
    ul.add(li);
    var input=dom.newEl("input");
    input.attr("type","text");
    input.attr("id","search_param");
    input.attr("data-toggle","dropdown");
    input.attr("placeholder","Search Students");
    input.attr("class","dropdown-toggle input-xxlarge");
    input.attr("search_type","student");
    input.attr("onkeyup","javascript:autoSuggest('account_service')");
    li.add(input);
    var ul1=dom.newEl("ul");
    ul1.attr("class","dropdown-menu");
    ul1.attr("id","auto_suggest");
    ul1.attr("style","display : none");
    li.add(ul1);
    var select=dom.newEl("select");
    select.attr("id","search_filter");
    li.add(select);
    form.add(ul);
     var json={
                 request_header : {
                     request_msg : "all_fields",
                     request_svc : "account_service"
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
                      populateSelect("search_filter",fieldNames,fieldNames);
                } 
          });
  },
  openHistory : function(){
     var startDate=dom.el("begin_date");
     var endDate=dom.el("end_date");
     var accountId=dom.el("search_param_2").getAttribute("current_id");
     if(!accountId){
        setInfo("Please select an account to open history"); 
        dom.el("search_param_2").focus();
        return;  
     }
     if(startDate.value===""){
        setInfo("Select a starting date"); 
        startDate.focus();
        return;
     }
     if(endDate.value===""){
        setInfo("Select an ending date"); 
        endDate.focus();
        return;
     }
     if(new Date(startDate.value).getTime()>new Date(endDate.value).getTime()){
        setInfo("Starting date cannot be greater than end date"); 
        startDate.focus();
        return; 
     }
     
      var json={
                 request_header : {
                     request_msg : "open_history",
                     request_svc : "account_service"
                  },
                  
                  request_object : {  
                    start_date : startDate.value,
                    end_date : endDate.value,
                    account_id : accountId,
                    class_id : dom.el("class_select").value,
                    stream_id : dom.el("stream_select").value,
                    type : account.autoSuggestData.ACCOUNT_TYPE[0]
                  }
              };
          
            Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to fetch account history ");
                  },
                  success : function(json){
                      var resp=json.response.data;
                      var arr=["No","Transaction ID","Cash In","Cash Out","Narration","Date"];
                      account.generateAccountsWindow(resp,arr,"Account History | "+accountId);
                } 
          });
     
  },
  generateAccountsWindow : function(resp,arr,title){
    var win=window.open("","win","width=500,height=650,scrollbars=yes,resizable=yes");
    win.document.write("<html><head>");
    win.document.write("<title>"+title+"</title>");
    win.document.write(" <link href='scripts/bootstrap.min.css' rel='stylesheet'>"+
              "<link href='scripts/bootstrap-responsive.min.css' rel='stylesheet'>");
    win.document.write("</head>");
    win.document.write(
    "<div align='center'>"+
     "<table class='table table-striped table-condensed'>"
     );
    win.document.write("<tr>");
   for(var x=0; x<arr.length; x++){
     win.document.write("<th>"+arr[x].replace(/_/g," ")+"</th>");
    }
   win.document.write("</tr>");  
   var totalCashIn=0;
   var totalCashOut=0;
   for(var y=0; y<resp.ID.length; y++){
       win.document.write("<tr>");
       writeCol(y+1);
       writeCol(resp.DOUBLE_ENTRY_ID[y]);
       if(resp.TRAN_TYPE[y]==="1"){
           var cashIn=parseFloat(resp.TRAN_AMOUNT[y]);
           writeCol(account.formatMoney(cashIn));
           writeCol("");  
           totalCashIn=totalCashIn+cashIn;
       }
       else {
          var cashOut=parseFloat(resp.TRAN_AMOUNT[y]);
          writeCol("");  
          writeCol(account.formatMoney(cashOut));
          totalCashOut=totalCashOut+cashOut;
       }
       writeCol(resp.TRAN_NARRATION[y]);
       writeCol(new Date(resp.TRAN_DATE[y]).toGMTString());
       win.document.write("</tr>");
   }
   win.document.write("<tr>");
   writeCol("");
   writeCol("Totals");
   writeCol(account.formatMoney(totalCashIn));
   writeCol(account.formatMoney(totalCashOut));
   win.document.write("</tr>");
   win.document.write("</table>");
   win.document.write("</div>");
   win.document.write("<html>");
   
   function writeCol(val){
       win.document.write("<td>");
       win.document.write(val);
       win.document.write("</td>"); 
   }
    
  },
formatMoney: function (num) {
    num=parseFloat(num);
    var p = num.toFixed(2).split(".");
    var chars = p[0].split("").reverse();
    var newstr = '';
    var count = 0;
    for (x in chars) {
        count++;
        if(count%3 === 1 && count !== 1) {
            newstr = chars[x] + ',' + newstr;
        } else {
            newstr = chars[x] + newstr;
        }
    }
    return newstr + "." + p[1];
},
batchView : function(){
    var func="account.batchAutoSuggest()";
    var form=new Form(null,"main-view-form");
    setTitle("Batch Operations");
    account.addAccountSearch(form,"select_account_2","auto_suggest_container_2","search_param_2","auto_suggest_2",func);
     var classLabel=dom.newEl("label");
     classLabel.innerHTML="Class";
     var classSelect=dom.newEl("select");
     classSelect.attr("id","class_select");
     var opt=dom.newEl("option");
     opt.innerHTML="All";
     opt.value="all";
     classSelect.add(opt);
  
     var streamLabel=dom.newEl("label");
     streamLabel.innerHTML="Stream";
     var streamSelect=dom.newEl("select");
     streamSelect.attr("id","stream_select");
     var opt1=dom.newEl("option");
     opt1.innerHTML="All";
     opt1.value="all";
     streamSelect.add(opt1);
     form.add(classLabel);
     form.add(classSelect);
     form.add(streamLabel);
     form.add(streamSelect);
     
     var balLabel=dom.newEl("label");
     balLabel.innerHTML="Account Balance";
     var bal=dom.newEl("input");
     bal.attr("type","text");
     bal.attr("readonly","readonly");
     bal.attr("class","input-xxlarge");
     bal.attr("id","account_balance");
     
     var amountLabel=dom.newEl("label");
     amountLabel.innerHTML="Batch Amount";
     var amount=dom.newEl("input");
     amount.attr("type","text");
     amount.attr("class","input-xxlarge");
     amount.attr("id","amount");
     var narrLabel=dom.newEl("label");
     narrLabel.innerHTML="Batch Narration";
     var narr=dom.newEl("input");
     narr.attr("type","text");
     narr.attr("class","input-xxlarge");
     narr.attr("id","narration");
     
     var debit=dom.newEl("input");
     debit.attr("type","button");
     debit.attr("value","Batch Debit");
     debit.attr("class","btn btn-primary");
     debit.attr("style","margin : 5px");
     debit.attr("onclick","account.batchTransact(0)");
     
     var credit=dom.newEl("input");
     credit.attr("type","button");
     credit.attr("value","Batch Credit");
     credit.attr("class","btn btn-primary");
     credit.attr("style","margin : 5px");
     credit.attr("onclick","account.batchTransact(1)");
     
     form.add(balLabel);
     form.add(bal);
     form.add(amountLabel);
     form.add(amount);
     form.add(narrLabel);
     form.add(narr);
     form.add(dom.newEl("br"));
     form.add(debit);
     form.add(credit);
     
      var json1={
                 request_header : {
                     request_msg : "all_streams",
                     request_svc :"account_service"
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
                    var func=function(){
                       populateSelect("stream_select", resp["STREAM_NAME"],resp["ID"]);
                    };
                    dom.waitTillElementReady("stream_select", func);
                } 
          }); 
      
          
             var json4={
                 request_header : {
                     request_msg : "all_classes",
                     request_svc :"account_service"
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
batchTransact : function(type){
     var narr=dom.el("narration");
     var amount=dom.el("amount");
     var classId=dom.el("class_select").value;
     var streamId=dom.el("stream_select").value;
     var accountId=dom.el("search_param_2").getAttribute("current_id");
     if(!accountId){
        setInfo("Please select an account to perform a batch operation"); 
        dom.el("search_param_2").focus();
        return;  
     }
     if(narr.value===""){
        setInfo("Please set a narration for the batch operation"); 
        narr.focus();
        return;
     }
     if(amount.value===""){
        setInfo("Please set an amount for the batch operation"); 
        amount.focus();
        return;
     }
       var json4={
                 request_header : {
                     request_msg : "batch_transact",
                     request_svc :"account_service"
                  },
                  request_object : { 
                   account_id : accountId,
                   amount : amount.value,
                   narration : narr.value,
                   tran_type : type,
                   class_id : classId,
                   stream_id : streamId
                 }
              };
              
               Ajax.run({
                  url : serverUrl,
                  type : "post",
                  data : json4,
                  loadArea : "load_area",
                  error : function(err){
                     setInfo("An error occurred when attempting to perform the batch operation");
                  },
                  success : function(json){
                    
                } 
          });
}
    
};


