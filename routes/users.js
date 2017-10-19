var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var token = '';
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'food'
});

connection.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

var md5 = function(data) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}



router.post("/register", function(req, res, next) {

    var info = {};
    var flag = 0;
    // console.log(req.body);
    if (!req.body.username) {
        info = {
            code: 2000,
            message: "注册失败,用户名不能为空",
            data: []
        }
    } else {
        var userAddSql = "INSERT INTO `user`(`username`, `password`, `phone`) VALUES('" + req.body.username + "' , '" + md5(req.body.password) + "' ,  '" + req.body.phone + "')";
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
});

router.post("/login", function(req, res, next) {
    var info = {};
    var flag = 0;

    if (!req.body.username) {
        info = {
            code: 3001,
            message: "登录失败,用户名不能为空",
            data: []
        }
    } else {
        var userSelectSql = "SELECT * FROM `user` WHERE `username`='" + req.body.username + "'";
        // 查询
        connection.query(userSelectSql, function(err, result) {
            if (err) {
                info = {
                    code: 3002,
                    message: "登录失败，系统错误",
                    data: err
                }
                console.log('============SELECT============');
                console.log('[SELECT ERROR] - ', err.message);
                console.log('==============================');
                res.send(info);
                // return;
            } else {
                console.log('============SELECT============');
                console.log('SELECT:', result);
                console.log('==============================');
                if (result && result.length === 1) {
                    if (result[0].password === md5(req.body.password)) {

                        info = {
                            code: 0,
                            message: "登录成功",
                            data: {
                                userId: result[0].userid,
                                username: result[0].username,
                                phone: result[0].phone,
                                token: token
                            }
                        }
                    } else {
                        info = {
                            code: 3004,
                            message: "登录失败,密码不正确",
                            data: []
                        }
                    }

                } else {
                    info = {
                        code: 3003,
                        message: "登录失败,用户不存在",
                        data: []
                    }
                }
                res.send(info);
            }
        });
    }
});




router.get("/message/search", function(req, res, next) {
    var info = {};

    var messageSelectSql = "SELECT * FROM `message` ";
    // 查询
    connection.query(messageSelectSql, function(err, result) {
        if (err) {
            info = {
                code: 4000,
                message: "系统错误",
                data: err
            }
            console.log('============SELECT============');
            console.log('[SELECT ERROR] - ', err.message);
            console.log('==============================');
            res.send(info);
            // return;
        } else {
            console.log('============SELECT============');
            console.log('SELECT:', result);
            console.log('==============================');

            info = {
                code: 0,
                message: "success",
                data: result
            }

            res.send(info);
        }
    });

});
router.get("/message/add", function(req, res, next) {
    var info = {};
    var messageAddSql = "INSERT INTO `message`(`mTitle`, `mContent`, `mUserName`) VALUES('" + req.query.mTitle + "' , '" + req.query.mContent + "' ,  '" + req.query.mUserName + "')";
    //增 add
    connection.query(messageAddSql, function(err, result) {
        if (err) {
            info = {
                code: 4000,
                message: "留言失败，系统错误",
                data: err
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
                message: "留言成功",
                data: [{
                    userid: result.insertId,
                }]
            }
            res.send(info)
        }

    });

});










// connection.end();
module.exports = router;