// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();

// 导入路由处理模块
const openrationHandler = require('../router_handle/openration_log')


// 操作日志记录
router.post('/operation', openrationHandler.operation)
// 返回操作日志列表
router.post('/operationList', openrationHandler.operationList)
// 搜索最近十条操作记录
router.post('/searchoperationList', openrationHandler.searchoperationList)

// 返回操作日志列表长度
router.post('/operationLength', openrationHandler.operationLength)
// 监听换页返回数据  操作日志列表
router.post('/returnOperationListData', openrationHandler.returnOperationListData)
// 清空操作日志列表 truncate
router.post('/truncateOperationList', openrationHandler.truncateOperationList)

// 对外暴露
module.exports = router;