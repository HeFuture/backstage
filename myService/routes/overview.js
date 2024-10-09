
// 系统设置路由组件
var express = require('express');
// 导入路由
var router = express.Router();

// 导入路由处理模块
const overviewHandler = require('../router_handle/overview')


// 获取产品类别和总价
router.post('/getCategoryAndNumber', overviewHandler.getCategoryAndNumber)
// 获取不同角色与数量
router.post('/getAdminAndNumber', overviewHandler.getAdminAndNumber)

// 获取不同消息等级和数量
router.post('/getLevelAndNumber', overviewHandler.getLevelAndNumber)

// 返回每天登录人数
router.post('/getDayAndNumber', overviewHandler.getDayAndNumber)

// 对外暴露
module.exports = router;