
// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
// 导入路由处理模块
const departmentHandle = require('../router_handle/department')

// 获取部门消息id列表 id, department
router.post('/getDepartmentMsg', departmentHandle.getDepartmentMsg)
// 获取部门消息
router.post('/getDepartmentMsgList', departmentHandle.getDepartmentMsgList)
// 返回用户的阅读列表
router.post('/getReadListAndStatus', departmentHandle.getReadListAndStatus)
// 用户点击消息后对 read_list 内的数据进行删减  参数：消息id、用户id
router.post('/clickDelete', departmentHandle.clickDelete)
// 把新发布文章的 id 插入到当前所属部门的用户的 read_list 中  参数：新发布文章的id、对应部门的 department
router.post('/changeUserReadList', departmentHandle.changeUserReadList)
// 把删除文章的 id 从当前所属部门的用户的 read_list 中删除  参数：新发布文章的id、对应部门的 department
router.post('/changeUserReadListButDelete', departmentHandle.changeUserReadListButDelete)

// 对外暴露
module.exports = router;