
// 导入数据库连接
const db = require('../db/index')
// 导入加密中间件
const bcrtpt = require('bcrypt')
// 引入crypto库生成uuid
const crypto = require('crypto')
// 导入fs处理文件
fs = require('fs')

// 上传头像
exports.uploadAvatar = (req, res) => {
    // res.send(req.files[0])
    const onlyId = crypto.randomUUID()
    let oldName = req.files[0].filename
    let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf-8')
    fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
    const sql = 'insert into image set ?'
    db.query(sql, {
        image_url: `http://localhost:3000/upload/${newName}`,
        onlyId
    }, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            onlyId,
            status: 0,
            url: `http://localhost:3000/upload/` + newName
        })
    })
}

// 绑定账号的接口 onlyId  account url
exports.bingAccound = (req, res) => {
    const { onlyId, account, url } = req.body
    const sql = 'update image set account=? where onlyId=?'
    db.query(sql, [account, onlyId, url], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows == 1) {
            const sql1 = 'update users set image_url=? where account=?'
            db.query(sql1, [url, account], (err, results) => {
                if (err) return res.cc(err)
                res.send({
                    status: 0,
                    message: '修改成功'
                })
            })
        }
    })
}

// 修改用户密码,先输入旧密码 oldPassword 新密码 newPassword 参数：id
exports.changePassword = (req, res) => {
    const sql = 'select password from users where id=?'
    db.query(sql, req.body.id, (err, results) => {
        if (err) return res.cc(err)
        // 使用bcrtpt的方法来比较新旧密码
        const compareResult = bcrtpt.compareSync(req.body.oldPassword, results[0].password)
        if (!compareResult) {
            res.send({
                status: 1,
                message: '原密码错误'
            })
        }
        // bcrtpt.hashSync 第一个参数是要加密的密码，10是加密后的长度
        req.body.newPassword = bcrtpt.hashSync(req.body.newPassword, 10);
        const sql1 = 'update users set password=? where id=?'
        db.query(sql1, [req.body.newPassword, req.body.id], (err, results) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '修改成功'
            })
        })

    })
}



// 获取用户信息 接收参数id
exports.getUserInfo = (req, res) => {
    // console.log(req.body);

    const sql = 'select * from users where id=?'
    db.query(sql, req.body.id, (err, resluts) => {
        if (err) return res.cc(err)
        res.send({ resluts })
    })
}

// 修改姓名 接收参数 id name
exports.changeName = (req, res) => {
    const { id, name } = req.body

    const sql = 'update users set name=? where id=?'
    db.query(sql, [name, id], (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}

// 修改性别 接收参数 id sex
exports.changeSex = (req, res) => {
    const { id, sex } = req.body

    const sql = 'update users set sex=? where id=?'
    db.query(sql, [sex, id], (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}

// 修改邮箱 接收参数 id email
exports.changeEmail = (req, res) => {
    const { id, email } = req.body

    const sql = 'update users set email=? where id=?'
    db.query(sql, [email, id], (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}
 