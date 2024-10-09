

/* 
登录日志字段

account 账号
name  名字
email  邮箱/联系方式
login_time  登录时间

*/
// 导入数据库连接
const db = require('../db/index')

// 登录记录
exports.loginLog = (req, res) => {
    const { account, name, email } = req.body
    const login_time = new Date()
    const sql = 'insert into login_log (account, name, email,login_time) VALUES (?,?,?,?)'
    db.query(sql, [account, name, email, login_time], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            status: 0,
            msg: '登录记录成功'
        })
    })
}

// 返回登录日志列表
exports.loginLogList = (req, res) => {
    const sql = 'select * from login_log'
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send(result)
    })
}

// 搜索最近十条登录记录
exports.searchloginLogList = (req, res) => {
    const productid = req.body.account && req.body.account.trim();
    if (!productid) {
        return
    }
    number = req.body.page
    const sql = 'select * from login_log where account like ?  ORDER BY login_time limit 10'
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${req.body.account}%`];
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send(result)
    })
}



// 返回登录日志列表长度
exports.loginLoglength = (req, res) => {
    const sql = 'select * from login_log'
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            length: result.length
        })
    })
}

// 监听换页返回数据  登录日志列表
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnLoginListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from login_log  ORDER BY login_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

// 清空登录日志列表 truncate
exports.truncateLoginLogList = (req, res) => {
    const sql = 'truncate table login_log'
    db.query(sql, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        res.send({
            status: 0,
            msg: '数据表清空成功'
        })
    })
}