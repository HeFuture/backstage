


/* 
操作日志

operation_person   操作者
operation_content   操作内容
operation_level  操作等级
operation_time  操作时间

*/

// 导入数据库连接
const db = require('../db/index')

// 操作日志记录
exports.operation = (req, res) => {
    const { operation_person, operation_content, operation_level } = req.body
    const operation_time = new Date()
    const sql = 'insert into operation_log (operation_person, operation_content, operation_level,operation_time) VALUES (?,?,?,?)'
    db.query(sql, [operation_person, operation_content, operation_level, operation_time], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            status: 0,
            msg: '操作记录成功'
        })
    })
}

// 搜索最近十条操作记录
exports.searchoperationList = (req, res) => {
    const productid = req.body.operation_person && req.body.operation_person.trim();
    if (!productid) {
        return
    }
    number = req.body.page
    const sql = 'select * from operation_log where operation_person like ?  ORDER BY operation_time limit 10'
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${req.body.operation_person}%`];
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send(result)
    })
}

// 返回操作日志列表
exports.operationList = (req, res) => {
    const sql = 'select * from operation_log'
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send(result)
    })
}

// 返回操作日志列表长度
exports.operationLength = (req, res) => {
    const sql = 'select * from operation_log'
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            length: result.length
        })
    })
}

// 监听换页返回数据  操作日志列表
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnOperationListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from operation_log  ORDER BY operation_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

// 清空操作日志列表 truncate
exports.truncateOperationList = (req, res) => {
    const sql = 'truncate table operation_log'
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            status: 0,
            msg: '操作日志清空成功'
        })
    })
}