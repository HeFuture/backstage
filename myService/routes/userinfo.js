

// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
// 导入express-joi
const expressJoi = require('@escook/express-joi')
// 导入joi验证规则
const { name_limit, email_limit, password_limit, forgetPassword_limit } = require('../limit/user')
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
// 登录页面忘记密码验证账号邮箱
router.post('/verifyAccountAndEmail', userinfoHandler.verifyAccountAndEmail)
// 登录页面修改密码
router.post('/changePasswordInLogin', expressJoi(forgetPassword_limit), userinfoHandler.changePasswordInLogin)

// 添加管理员
router.post('/createAdmin', userinfoHandler.createAdmin)
// 获取管理员列表 identity
router.post('/getAdminList', userinfoHandler.getAdminList)
// 编辑管理员信息账号
router.post('/editAdmin', userinfoHandler.editAdmin)
// 对管理员取消赋权   id
router.post('/changeIdentitytoUser', userinfoHandler.changeIdentitytoUser)
// 对用户进行赋权 id  identity
router.post('/changeIdentityToAdmin', userinfoHandler.changeIdentityToAdmin)
// 通过账号对用户进行搜索 account
router.post('/searchUser', userinfoHandler.searchUser)
// 通过部门对用户进行搜索 department
router.post('/searchUserbyDepartment', userinfoHandler.searchUserbyDepartment)
// 冻结用户 把 status 变成 1  id
router.post('/banUser', userinfoHandler.banUser)
// 解冻用户 id
router.post('/hotUser', userinfoHandler.hotUser)
// 获取冻结用户列表
router.post('/getBanList', userinfoHandler.getBanList)
// 删除用户 id
router.post('/delUser', userinfoHandler.delUser)
// 获取对应身份的总人数 identity
router.post('/getAdminListLength', userinfoHandler.getAdminListLength)
// 监听换页返回数组 页码 page  identity
router.post('/getAdminListData', userinfoHandler.getAdminListData)
module.exports = router;  