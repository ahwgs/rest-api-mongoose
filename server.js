const fs = require('fs')
const path = require('path')
const express = require('express');
const app = express();
const mongoose = require('mongoose');  //MongoDB连接驱动
const bodyParser = require('body-parser');  //获取post body中的数据
const passport = require('passport');
const TokenUtil = require('./utils/tokenUtil')

//引入user.js
const users = require("./routers/api/user");

// db config
const db = require('./config/keys').mogoURI


// // CORS
// app.use((req, res, next) => {
//     if (req.path !== '/' && !req.path.includes('.')) {
//         res.header({
//             'Access-Control-Allow-Credentials': true,
//             'Access-Control-Allow-Origin': req.headers.origin || '*',
//             'Access-Control-Allow-Headers': 'X-Requested-With',
//             'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
//             'Content-Type': 'application/json; charset=utf-8'
//         })
//     }
//     next()
// })

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())


//connect db
mongoose.connect(db)
    .then(() => console.log('mongoose connecting...'))
    .catch((err) => console.log(err))


// public
app.use(express.static(path.join(__dirname, 'public')))

//验证token
app.use((req, rsp, next) => TokenUtil.verifyToken(req, rsp, next))

// passport 初始化
// app.use(passport.initialize());

// require('./config/passport')(passport)

// routers
app.use('/api/user', users)


const port = process.env.PORT || 3000

app.server = app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`)
})
module.exports = app