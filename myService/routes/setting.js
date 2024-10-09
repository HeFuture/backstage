
// 系统设置路由组件
var express = require('express');
// 导入路由
var router = express.Router();

// 导入路由处理模块
const settingHandler = require('../router_handle/setting')



// 上传轮播图 set_value  set_name
router.post('/uploadSwiper', settingHandler.uploadSwiper)
// 获取轮播图 
router.post('/getSwiper', settingHandler.getSwiper)
// 获取公司名称
router.post('/getCompanyName', settingHandler.getCompanyName)
// 修改公司名称
router.post('/changeCompanyName', settingHandler.changeCompanyName)
// 编辑公司介绍  set_value   set_name
router.post('/changeCompanyIntroduce', settingHandler.changeCompanyIntroduce)
// 获取公司介绍  set_name
router.post('/getCompanyIntroduce', settingHandler.getCompanyIntroduce)
// 获取所有公司信息
router.post('/getAllCompanyIntroduce', settingHandler.getAllCompanyIntroduce)
// 部门设置
router.post('/setDepartment', settingHandler.setDepartment)
// 获取部门
router.post('/getDepartment', settingHandler.getDepartment)
// 产品设置
router.post('/setProduct', settingHandler.setProduct)
// 获取产品
router.post('/getProduct', settingHandler.getProduct)

// 对外暴露
module.exports = router;
