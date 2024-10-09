// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
// 导入路由处理模块
const messageHandle = require('../router_handle/message')


// 发布消息
router.post('/publishMessage', messageHandle.publishMessage)
// 获取公司公告列表
router.post('/companyMessageList', messageHandle.companyMessageList)
// 获取系统消息列表
router.post('/systemMessageList', messageHandle.systemMessageList)
// 编辑公告
router.post('/editMessage', messageHandle.editMessage)
// 根据发布部门获取消息
router.post('/searchMessageByDepartment', messageHandle.searchMessageByDepartment)
// 根据发布等级获取消息
router.post('/searchMessageByLevel', messageHandle.searchMessageByLevel)
// 获取公告/系统消息
router.post('/getMessage', messageHandle.getMessage)
// 更新点击率
router.post('/updateclick', messageHandle.updateclick)

// 初次删除
router.post('/fisrtDelete', messageHandle.fisrtDelete)
// 还原初次删除操作
router.post('/recover', messageHandle.recover)
// 删除操作
router.post('/deleteMessage', messageHandle.deleteMessage)

// 获取回收站的列表
router.post('/recycleList', messageHandle.recycleList)
// 获取回收站总数
router.post('/getRecycleMessageLength', messageHandle.getRecycleMessageLength)
// 监听换页返回数据  回收站
router.post('/returnRecycleListData', messageHandle.returnRecycleListData)

// 获取公司公告总数
router.post('/getCompanyMessageLength', messageHandle.getCompanyMessageLength)
// 获取系统消息总数
router.post('/getSystemMessageLength', messageHandle.getSystemMessageLength)
// 监听换页返回数据  公司公告
router.post('/returnCompanyListData', messageHandle.returnCompanyListData)
// 监听换页返回数据  系统消息
router.post('/returnSystemListData', messageHandle.returnSystemListData)

// 对外暴露
module.exports = router;