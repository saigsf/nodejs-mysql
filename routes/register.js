var express = require("express");
var router = express.Router();
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'food'
});

connection.connect();

router.post("/", function(req, res) {

    var info = {};
    var flag = 0;
    console.log(req.body);
    if (!req.body.username) {
        info = {
            code: 1,
            message: "注册失败,用户名不能为空",
            data: []
        }
    } else {
        var userSelectSql = "SELECT * FROM user";
        // 查询
        connection.query(userSelectSql, function(err, result, fields) {
            if (err) {
                console.log('============SELECT============');
                console.log('[SELECT ERROR] - ', err.message);
                console.log('==============================');
                return;
            } else {
                if (result) {
                    console.log('============SELECT============');
                    console.log('SELECT:', result);
                    console.log('==============================');
                    for (var i = 0; i < result.length; i++) {
                        if (req.body.username == result[0].username) {
                            flag = 1;
                        }
                    }
                }
            }
        });
        if (flag == 0) {
            var userAddSql = "INSERT INTO `user`(`username`, `password`, `phone`) VALUES('" + req.body.username + "' , '" + req.body.password + "' ,  '" + req.body.phone + "')";
            //增 add
            connection.query(userAddSql, function(err, result) {
                if (err) {
                    switch (err.sqlState) {
                        case "23000":
                            info = {
                                code: 2001,
                                message: "注册失败,用户名或手机号已存在",
                                data: err.sqlMessage
                            }
                            break;
                        default:
                            break;
                    }
                    console.log('============INSERT============');
                    console.log('[INSERT ERROR] - ', err.message);
                    console.log('==============================');
                    res.send(info);
                    // return;
                } else {
                    console.log('============INSERT============');
                    //console.log('INSERT ID:',result.insertId);       
                    console.log('INSERT:', result);
                    console.log('==============================');
                    info = {
                        code: 0,
                        message: "注册成功",
                        data: [{
                            userid: result.insertId,
                            username: req.body.username
                        }]
                    }
                    res.send(info)
                }

            });



        }
    }



});
connection.end();
module.exports = router;