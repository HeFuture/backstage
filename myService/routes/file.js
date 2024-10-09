// 登录注册路由组件
var express = require('express');
// 导入路由
var router = express.Router();
// 导入路由处理模块
const fileHandle = require('../router_handle/file')

// 上传头像
router.post('/uploadFile', fileHandle.uploadFile)
// 绑定上传者
router.post('/bindFileAndUser', fileHandle.bindFileAndUser)
// 更新下载量
router.post('/updateDownLoad', fileHandle.updateDownLoad)
// 下载文件
router.post('/downLoadFile', fileHandle.downLoadFile)
// 获取文件列表
router.post('/fileList', fileHandle.fileList)
// 获取文件列表总数
router.post('/fileListLength', fileHandle.fileListLength)
// 监听换页返回数据  文件列表
router.post('/returnFilesListData', fileHandle.returnFilesListData)

// 搜索文件
router.post('/searchFile', fileHandle.searchFile)
// 删除文件
router.post('/deleteFile', fileHandle.deleteFile)

// 对外暴露
module.exports = router;