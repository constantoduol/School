 var QQL = {
    run : function(dbName,qql,callback){
     var json={
        request_header : {
           request_msg : "qql"
         },
        request_object : {  
           qql : qql,
           db_name : dbName
         }
      };
      Ajax.run({
        url : "/web/server",
        type : "post",
        data : json,
        error : function(err){
            console.log(err);
        },
        success : function(json){
           callback(json.response.data);
        } 
      });
     }
  };
  
 
  
 


