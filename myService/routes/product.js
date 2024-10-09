// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
const productHandle = require('../router_handle/product')

// 创建产品
router.post('/createProduct', productHandle.createProduct)
// 删除产品 product_id
router.post('/deleteProduct', productHandle.deleteProduct)
// 编辑产品信息
router.post('/editProduct', productHandle.editProduct)
// 获取产品列表
router.post('/getProductList', productHandle.getProductList)
// 产品申请出库
router.post('/applyOutProduct', productHandle.applyOutProduct)
// 产品审核列表
router.post('/applyProductList', productHandle.applyProductList)
// 产品出库列表
router.post('/auditProductList', productHandle.auditProductList)

// 对产品撤回申请 id
router.post('/withDrawApplyProduct', productHandle.withDrawApplyProduct)
// 产品审核
router.post('/auditProduct', productHandle.auditProduct)
// 通过用户编号对产品进行搜索 product_id
router.post('/searchProductForId', productHandle.searchProductForId)
// 通过出库编号对产品进行搜索 product_out_id
router.post('/searchProductForOutId', productHandle.searchProductForOutId)
// 通过出库申请编号 对产品进行搜索 product_out_id
router.post('/searchProductForApplyId', productHandle.searchProductForApplyId)
// 获取产品的总数 
router.post('/getProductLength', productHandle.getProductLength)
// 获取申请出库产品总数
router.post('/getApplyProductLength', productHandle.getApplyProductLength)
// 获取出库产品总数
router.post('/getOutProductLength', productHandle.getOutProductLength)
// 监听换页返回数据  产品页面
router.post('/returnProductListData', productHandle.returnProductListData)
// 监听换页返回数据  申请出库页面
router.post('/returnApplyProductListData', productHandle.returnApplyProductListData)
// 监听换页返回数据  出库页面
router.post('/returnoutProductListData', productHandle.returnoutProductListData)
module.exports = router