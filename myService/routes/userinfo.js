

// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
// 导入express-joi
const expressJoi = require('@escook/express-joi')
// 导入joi验证规则
const { name_limit, email_limit, password_limit } = require('../limit/user')
// 导入userinfo路由处理模块
const userinfoHandler = require('../router_handle/userinfo')

// 上传头像
router.post('/uploadAvatar', userinfoHandler.uploadAvatar)

// 绑定账号
router.post('/bingAccound', userinfoHandler.bingAccound)
// 修改密码
router.post('/changePassword', expressJoi(password_limit), userinfoHandler.changePassword)
// 获取用户信息
router.post('/getUserInfo', userinfoHandler.getUserInfo)
// 修改用户姓名
router.post('/changeName', expressJoi(name_limit), userinfoHandler.changeName)
// 修改用户性别
router.post('/changeSex', userinfoHandler.changeSex)
// 修改用户邮箱
router.post('/changeEmail', expressJoi(email_limit), userinfoHandler.changeEmail)
module.exports = router; 