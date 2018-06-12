const mysql = require('mysql');
const conn = {
    host:'localhost',
    user:'root',
    password:'micro',
    database:'monolithic'
};

/**
 * 회원 관리의 각 기능별 분리
 */

exports.onRequest = function(res,method,pathname,params,cb){
    switch(method){
        case "POST":
        return register(method,pathname,params,(response)=>{
            process.nextTick(cb,res,response);
        });
        
        case "GET":
        return inquiry(method,pathname,params,(response)=>{
            process.nextTick(cb,res,response);
        });

        default:
        return process.nextTick(cb,res,null);
    }
};

function register(method,pathname,params,cb){
    var response ={
        key:params.key,
        errorcode:1,
        errormessage:"success"
    };

    if(params.userid == null || params.goodsid == null){
        response.errorcode = 1;
        response.errormessage = "invalid parameters";
        cb(response);
    }else{
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("insert into purcharses(userid, goodsid) valuse(?,?)",[params.userid, params.goodsid],(error,results,fields)=>{
            if(error){
                response.errorcode = 1;
                response.errormessage = error;
            }
            cb(response);
        });
        connection.end();
    }
}

function inquiry(method,pathname,params,cb){
    var response ={
        key:params.key,
        errorcode:1,
        errormessage:"success"
    };

    if(params.userid == null){
        response.errorcode = 1;
        response.errormessage = "invalid parameters";
        cb(response);
    }else{
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("select id, goodsid, date from purchases where userid = ?",[params.userid],(error,results,fields)=>{
            if(error){
                response.errorcode =1;
                response.errormessage = error;
            }else{
                response.results = results;
            }
            cb(response);
        });
        connection.end();
    }
}