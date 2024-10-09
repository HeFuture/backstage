var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 导入cors代理
var cors = require('cors')
// 导入body-parser 解析器
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// 导入配置路由
const loginRouter = require('./routes/login');
const userRouter = require('./routes/userinfo')
const setRouter = require('./routes/setting')
const productRouter = require('./routes/product')
const messageRouter = require('./routes/message')
const fileRouter = require('./routes/file')
const loginLog = require('./routes/login_log')
const openRouter = require('./routes/openration_log')
const overviewRouter = require('./routes/overview')
const departmentRouter = require('./routes/department')
// 导入JWT
const jwtconfig = require('./jwt-config/index')
// ES6的解构赋值语法
const { expressjwt: jwt } = require("express-jwt");
// 导入joi验证
const joi = require('joi');
//  multer 用来上传文件
const multer = require('multer')
// 在public下的upload文件夹存储
const upload = multer({ dest: './public/upload' })


var app = express();


// 全局挂载cors
app.use(cors())
app.use(upload.any())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// parse application/x-www-form-urlencoded
// 当 extended 为false时，值为数组或者字符串，当为true时，值可以为任意类型
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
// 用于处理json格式
app.use(bodyParser.json())

app.use((req, res, next) => {
  // status=0为成功，=1为失败，默认设为1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      // 判断error是错误对象还是字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 排除不需要加密的路由
// app.use(jwt({
//   // secret：这是用于验证JWT签名的密钥
//   // algorithms：这个选项指定了用于验证JWT签名的算法
//   secret: jwtconfig.jwtSecretKey, algorithms: ['HS256']
//   // unless：这是一个条件选项，用于指定哪些请求不应该被JWT中间件处理
// }).unless({
//   path: [/^\/api\//]
// }))



// 注册路由
app.use('/api', loginRouter)
app.use('/user', userRouter)
app.use('/set', setRouter)
app.use('/pro', productRouter)
app.use('/msg', messageRouter)
app.use('/file', fileRouter)
app.use('/llog', loginLog)
app.use('/olog', openRouter)
app.use('/ov', overviewRouter)
app.use('/dm', departmentRouter)


// 对不符合joi验证规则的情况进行报错
app.use((req, res, next) => {
  if (err instanceof joi.ValidationError) {
    console.log('joi');

    return res.cc(err)
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
