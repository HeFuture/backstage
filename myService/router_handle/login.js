
// 导入数据库连接
const db = require('../db/index')
// 导入加密中间件
const bcrtpt = require('bcrypt')
// 导入JWT，用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密和解密
const jwtconfig = require('../jwt-config/index')
// const { query } = require('express')

/* 注册接口 */
exports.register = (req, res) => {
    const register = req.body
    console.log(register);

    // 1，判断前端传过来的数据是否为空
    if (!register.account || !register.password) {
        return res.send({
            status: 1,
            message: '账号或密码不能为空'
        })
    }
    // 2，判断前端的账号是否已存在在数据库中
    // sql执行语句，sql参数，函数用于处理结果
    const sql = 'select * from users where account=?'
    db.query(sql, [register.account], (err, results) => {
        if (results.length > 0) {
            return res.send({
                status: 1,
                message: '账号已存在'
            })
        }
        // 3，对账号密码进行加密
        // 使用中间件 bcrypt.js
        // bcrtpt.hashSync 第一个参数是要加密的密码，10是加密后的长度
        register.password = bcrtpt.hashSync(register.password, 10);
        // 将账号密码插入到users表中
        const sql1 = 'insert into users set ?';
        // 注册身份
        const identity = '用户';
        // 创建时间
        const create_time = new Date();
        db.query(sql1, {
            account: register.account,
            password: register.password,
            // 身份
            identity,
            // 创建时间
            create_time,
            // 初始未冻结状态为0
            status: 0,
        }, (err, results) => {
            // 插入失败
            // affectedRows 为影响的函数，如果插入失败，行数不为1
            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '注册账号失败'
                })
            }
            res.send({
                status: 1,
                message: '注册成功'
            })
        })
    })
}


/* 登录接口 */
exports.login = (req, res) => {
    const loginfo = req.body;
    // 1，查看数据表中有没有前端传递的账号
    const sql = 'select * from users where account=?'
    db.query(sql, [loginfo.account], (err, result) => {
        // 执行sql语句失败的情况（在数据库断开的情况会执行失败）
        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('登录失败')
        // 2，对前端传回数据解密
        const compareResult = bcrtpt.compareSync(loginfo.password, result[0].password)
        if (!compareResult) return res.cc('登录失败')
        // 3,对账号是否冻结做判定
        if (result[0].status == 1) return res.cc('账号被冻结')
        // 4，生成返回给前端的token
        // 删除加密后的密码，头像，创建时间，更新时间
        const user = {
            ...result[0],
            password: '',
            imgeUrl: '',
            create_time: '',
            update_time: ''
        }
        // 设置token的有效时长
        const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
            expiresIn: '7h'
        })
        res.send({
            result: result[0],
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}