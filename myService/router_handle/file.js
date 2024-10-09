
/* 
file_name  文件名
file_url    文件地址
file_size    文件大小
upload_person    上传者
upload_time     上传时间
downLoad_number   下载次数

*/

// 导入数据库连接
const db = require('../db/index')
// Node.js的fs模块，即文件系统（File System）模块
// 包括但不限于文件的创建、删除、读取、写入、重命名以及文件权限的修改等
fs = require('fs')

// 上传头像
exports.uploadFile = (req, res) => {
    // console.log(req.files); 里面包含以下对象
    /* 
        {
            fieldname: undefined,
            originalname: '33.png',
            encoding: '7bit',
            mimetype: 'image/png',
            destination: './public/upload',
            filename: 'b728959e6fb731f3a5881a3920901632',
            path: 'public\\upload\\b728959e6fb731f3a5881a3920901632',
            size: 3066
        }
    */
    // 老名字
    let oldName = req.files[0].filename
    // 新名字
    let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf-8')
    // 上传时间
    let upload_time = new Date()
    const sql1 = 'select * from files where file_name=?'
    db.query(sql1, newName, (err, result) => {
        if (result.length > 0) {
            res.send({
                status: 1,
                msg: '文件名已存在'
            })
        }
        else {
            // renameSync 同步重命名和移动
            fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
            const sql = 'insert into files set ?'
            db.query(sql, {
                file_url: `http://localhost:3000/upload/${newName}`,
                file_name: newName,
                file_size: req.files[0].size * 1 * 1024,
                upload_time,
                downLoad_number: 0
            }, (err, results) => {
                if (err) return res.cc(err)
                res.send({
                    status: 0,
                    url: `http://localhost:3000/upload/` + newName
                })
            })
        }
    })
}

// 绑定上传者
exports.bindFileAndUser = (req, res) => {
    const { name, url } = req.body
    const sql = 'update files set upload_person=? where file_url=?'
    db.query(sql, [name, url], (err, result) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            msg: '绑定成功'
        })
    })
}

// 更新下载量
exports.updateDownLoad = (req, res) => {
    const { downLoad_number, id } = req.body
    number = downLoad_number * 1 + 1
    const sql = 'update files set downLoad_number=? where id=?'
    db.query(sql, [number, id], (err, result) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            msg: '下载量增加'
        })
    })
}

// 下载文件
exports.downLoadFile = (req, res) => {
    const sql = 'select * from files where id=?'
    db.query(sql, req.body.id, (err, result) => {
        if (err) return res.cc(err)
        res.send(result[0].file_url)
    })
}

// 获取文件列表
exports.fileList = (req, res) => {
    const sql = 'select * from files'
    db.query(sql, req.body.id, (err, result) => {
        if (err) return res.cc(err)
        res.send(result)
    })
}

// 获取文件列表总数
exports.fileListLength = (req, res) => {
    const sql = 'select * from files'
    db.query(sql, req.body.id, (err, result) => {
        if (err) return res.cc(err)
        res.send({
            length: result.length
        })
    })
}

// 监听换页返回数据  文件列表
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnFilesListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from files  ORDER BY upload_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

// 搜索文件
exports.searchFile = (req, res) => {
    const productid = req.body.file_name && req.body.file_name.trim();
    if (!productid) {
        return
    }
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${req.body.file_name}%`];
    const sql = 'select * from files where file_name like ?'
    db.query(sql, params, (err, result) => {
        if (err) return res.cc(err)
        res.send(result)
    })
}

// 删除文件
exports.deleteFile = (req, res) => {
    const sql = 'delete from files where id=?'
    db.query(sql, req.body.id, (err, result) => {
        // 使用 fs 的 unlink 对public存储的文件也进行删除
        fs.unlink(`./public/upload/${req.body.file_name}`, (err) => {
            if (err) return res.cc(err)
        })
        if (err) return res.cc(err)
        res.send({
            status: 0,
            msg: '删除成功'
        })
    })
}

