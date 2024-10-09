// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();

// 导入路由处理模块
const loginLogHandler = require('../router_handle/login_log')


// 登录记录
router.post('/loginLog', loginLogHandler.loginLog)
// 返沪登录日志列表
router.post('/loginLogList', loginLogHandler.loginLogList)
// 搜索最近十条登录记录
router.post('/searchloginLogList', loginLogHandler.searchloginLogList)
// 返沪登录日志列表长度
router.post('/loginLoglength', loginLogHandler.loginLoglength)
// 监听换页返回数据  登录日志列表
router.post('/returnLoginListData', loginLogHandler.returnLoginListData)
// 清空登录日志列表 truncate
router.post('/truncateLoginLogList', loginLogHandler.truncateLoginLogList)

// 对外暴露
module.exports = router;