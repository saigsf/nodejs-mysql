# nodejs+mysql 服务端搭建
## 手动创建nodejs项目

#### 1、创建项目文件
```
1、在指定目录下，右击创建文件夹（myapp项目名称）
2、通过命令行创建
    a、在指定目录下，右击打开 git bash here ,这里默认安装了命令（Git-2.12.0-64-bit.exe）
    b、创建项目文件夹,进入文件夹
        mkdir myapp
        cd myapp
    c、创建package.json文件，初始化
        npm init -y # -y表示自动创建完成
    d、安装express并保存到以来文件中package.json
        npm install express -S # 国外资源
        或cnpm install express -S # 淘宝镜像，如果网络不行建议选择这一个
```
### 2、进入 myapp 目录，创建一个名为 app.js 的文件，然后将下列代码复制进去：
```
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
```
### 3、通过如下命令启动此应用：
```
node app.js
```

## 通过脚手架创建项目
通过应用生成器工具 express 可以快速创建一个应用的骨架。

### 1、全局安装express-generator
```
npm install express-generator -g 或 cnpm install express-generator -g
```
### 2、创建一个命名为 myapp 的应用：
```
express myapp
```
### 3、然后安装所有依赖包：
```
cd myapp
npm install或cnpm install
```
### 4、启动项目
```
npm start
```
### 5、项目结构
```
.
├── app.js
├── bin
│   └── www
├── node_modules/ # 依赖包
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.jade
    ├── index.jade
    └── layout.jade
```
## 创建路由，在routes文件夹中创建register.js文件，内容如下：
```
var express = require("express");
var router = express.Router();

router.post("/", function(req, res) {
    res.send("我是register")
});
connection.end();
module.exports = router; # 导出路由
```

## 路由配置，在app.js文件中

### 1、路由导入
```
var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
```
### 2、创建路由路径
```
app.use('/', index);
app.use('/users', users);
app.use('/WWW/register', register);
```
### 3、测试访问
```
http://localhost:3000/···
```
## 链接数据库
这里我使用的是MySQL
```
var mysql = require('mysql')    # 导入模块
var connection = mysql.createConnection({   # 
    host: '····', # 主机名
    user: '···',   # 用户名
    password: '···',   # 用户密码
    database: '···' # 数据库名称
});

connection.connect(); #创建链接
```
## 数据库操作
http://www.cnblogs.com/yunf/archive/2011/04/12/2013448.html


## 遇到的问题
1、在一面中打开http://localhost:3000/时，浏览器显示出一段字符串：
```
<!DOCTYPE html><html><head><title>Express</title><link rel="stylesheet"  href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p></body><html>
```
说明页面没有解析出html标签
### 解决
在工程文件中找到 view/layout.jade文件 在里面添加一句：
```
<meta http-equiv="content-type" content="text/html;charset=utf-8">
```

## 启动优化

### 方案一使用nodemon
[nodemon](https://www.npmjs.com/package/nodemon)
#### 安装
全局安装
```
$ npm install -g nodemon/cnpm install -g nodemon
```
本地安装
```
$ npm install --save-dev nodemon
```
#### 使用
```
nodemon ./bin/www
```
#### 配置package.json
在package.json文件的"scripts"选项中添加"dev": "nodemon ./bin/www"
```
"scripts": {
        "start": "node ./bin/www",
        "dev": "nodemon ./bin/www"
    },
```
#### 启动
```
npm run dev
```


### 方案二使用supervisor
[supervisor](https://www.npmjs.com/package/supervisor)
#### 安装
```
$ npm install supervisor -g
```
#### 使用
```
supervisor ./bin/www
```
#### 配置package.json
```
"scripts": {
        "start": "node ./bin/www",
        "sup": "supervisor ./bin/www"
    },
```
#### 启动
```
npm run sup
```
### 方案三使用pm2
[pm2](https://www.npmjs.com/package/pm2)
#### 安装
```
$ npm install pm2 -g
```
#### 使用
```
$ pm2 start ./bin/www
```
#### 配置package.json
```
"scripts": {
        "start": "node ./bin/www",
        "pmStart": "pm2 start ./bin/www"
    },
```
#### 启动
```
npm run pmStart
```

待续···





