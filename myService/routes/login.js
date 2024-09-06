
// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
// 导入joi验证
const joi = require('joi');
// 导入express-joi
const expressJoi = require('@escook/express-joi')
// 导入joi验证规则
const { login_limit } = require('../limit/login')
// 导入路由处理模块
const loginHandler = require('../router_handle/login')

router.get('/', function (req, res, next) {
    res.send("1111")
});

router.get('/ok', function (req, res, next) {
    res.send("222")
});

// 注册路由
router.post('/register', expressJoi(login_limit), loginHandler.register)
// 登录路由
router.post('/login', expressJoi(login_limit), loginHandler.login)

// 对外暴露
module.exports = router;
