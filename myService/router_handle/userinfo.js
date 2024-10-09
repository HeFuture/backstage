
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
            return res.send({
                status: 1,
                message: '原密码错误'
            })
        }
        else {
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
        }

    })
}



// 获取用户信息 接收参数id
exports.getUserInfo = (req, res) => {
    // console.log(req.body);

    const sql = 'select * from users where id=?'
    db.query(sql, req.body.id, (err, resluts) => {
        if (err) return res.cc(err)
        resluts[0].password = ''
        res.send(resluts[0])
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

// 前端忘记密码时需要验证邮箱
// 验证账号和邮箱是否一致  email  account
exports.verifyAccountAndEmail = (req, res) => {
    const { account, email } = req.body
    const sql = 'select * from users where account=?'
    db.query(sql, account, (err, results) => {
        if (err) return res.cc(err)
        // res.send(results[0].email)
        if (email == results[0].email) {
            res.send({
                status: 0,
                message: '查询成功',
                id: results[0].id
            })
        } else {
            res.send({
                status: 1,
                message: '查询失败'
            })
        }
    })
}

// 登录页面修改密码 newPassword id
exports.changePasswordInLogin = (req, res) => {
    const user = req.body
    // console.log(newPassword,id);
    // bcrtpt.hashSync 第一个参数是要加密的密码，10是加密后的长度
    user.newPassword = bcrtpt.hashSync(user.newPassword, 10);
    const sql = 'update users set password=? where id=?'
    db.query(sql, [user.newPassword, user.id], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}


// ----------------用户管理
// 创建账号
exports.createAdmin = (req, res) => {
    const {
        account,
        password,
        name,
        sex,
        department,
        email,
        identity,
    } = req.body
    // 判断账号是否存在于数据库中
    const sql = 'select * from users where account=?'
    db.query(sql, account, (err, results) => {
        // 判断账号是否存在
        if (results.length > 0) {
            return res.send({
                status: 1,
                message: '账号已存在'
            })
        } else {
            // bcrtpt.hashSync 第一个参数是要加密的密码，10是加密后的长度
            const hashpassword = bcrtpt.hashSync(password, 10);
            // 插入数据
            const sql1 = 'INSERT INTO users SET ?';
            // 创建时间
            const create_time = new Date()
            db.query(sql1, {
                account,
                password: hashpassword,
                name,
                sex,
                department,
                email,
                identity,
                create_time,
                status: 0
            }, (err, results) => {
                if (err) {
                    console.error('数据库查询错误:', err);
                    // 如果在 Express 环境中，你可以发送错误信息给客户端  
                    // res.status(500).send({ status: 1, message: '数据库错误' });  
                    return; // 退出回调函数，防止进一步执行  
                }

                if (results === undefined) {
                    console.error('查询结果未定义');
                    // 如果在 Express 环境中，你可以发送错误信息给客户端  
                    // res.status(500).send({ status: 1, message: '查询结果未定义' });  
                    return; // 退出回调函数，防止进一步执行  
                }
                if (results.affectedRows !== 1) {
                    return res.send({
                        status: 1,
                        message: '添加管理员失败'
                    })
                } else {
                    return res.send({
                        status: 0,
                        message: '添加管理员成功'
                    })
                }
            })
        }
    })
}


// 获取管理员列表 identity
exports.getAdminList = (req, res) => {
    const sql = 'select * from users where identity=?'
    db.query(sql, req.body.identity, (err, results) => {
        if (err) {
            console.error('数据库查询错误:', err);
            // 如果在 Express 环境中，你可以发送错误信息给客户端  
            // res.status(500).send({ status: 1, message: '数据库错误' });  
            return; // 退出回调函数，防止进一步执行  
        }
        if (results.length > 0) {
            results.forEach((e) => {
                e.password = ''
                e.create_time = ''
                e.image_url = ''
                e.status = ''
            })
            return res.send(results)
        }
    })
}

// 编辑管理员信息账号
exports.editAdmin = (req, res) => {
    const { id, name, sex, email, department } = req.body
    // 修改时间
    const data = new Date()
    // 查询要修改的管理员信息的部门是否相同，如果不相同则修改 read_status  read_list
    const sql0 = 'select department from users where id=?'
    db.query(sql0, req.body.id, (err, result) => {
        if (result[0].department == department) {
            // 修改的内容
            const updateContent = {
                id, name, sex, email, department, update_time: data
            }
            const sql = 'update users set ? where id=?'
            db.query(sql, [updateContent, updateContent.id], (err, results) => {
                if (err) {
                    return res.cc(err)
                }
                else {
                    return res.send({
                        status: 0,
                        message: '修改管理员成功'
                    })
                }
            })
        } else {
            // 修改的内容
            const updateContent = {
                id, name, sex, email, department,
                update_time: data,
                read_status: 0,
                read_list: null
            }
            const sql = 'update users set ? where id=?'
            db.query(sql, [updateContent, updateContent.id], (err, results) => {
                if (err) {
                    return res.cc(err)
                }
                else {
                    return res.send({
                        status: 0,
                        message: '修改管理员成功'
                    })
                }
            })
        }
    })

}

// 对管理员取消赋权  id
exports.changeIdentitytoUser = (req, res) => {
    const identity = '用户'
    const sql = 'update users set identity=? where id=?'
    db.query(sql, [identity, req.body.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send({
                status: 0,
                message: '降级成功'
            })
        }
    })
}

// 对用户进行赋权 id  identity
exports.changeIdentityToAdmin = (req, res) => {
    // 添加一个更新时间
    const date = new Date()
    const sql = 'update users set identity=?,update_time=? where id=?'
    db.query(sql, [req.body.identity, date, req.body.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send({
                status: 0,
                message: '赋权成功'
            })
        }
    })
}

// 通过账号对用户进行搜索 account identity
exports.searchUser = (req, res) => {
    const account = req.body.account && req.body.account.trim();
    if (!account) {
        return
    }
    const sql = 'select * from users where account like ? AND identity=?'
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${req.body.account}%`];
    db.query(sql, [params, req.body.identity], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            result.forEach((e) => {
                e.password = ''
                e.create_time = ''
                e.image_url = ''
                e.status = ''
            })
            return res.send(
                result
            )
        }
    })
}

// 通过部门对用户进行搜索 department
exports.searchUserbyDepartment = (req, res) => {
    const sql = 'select * from users where department=? AND identity="用户"'
    db.query(sql, req.body.department, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            result.forEach((e) => {
                e.password = ''
                e.image_url = ''
            })
            return res.send(
                result
            )
        }
    })
}

// 冻结用户 把 status 变成 1  id
exports.banUser = (req, res) => {
    const status = 1
    const sql = 'update users set status=? where id=?'
    db.query(sql, [status, req.body.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send({
                status: 0,
                message: '用户已冻结'
            })
        }
    })
}

// 解冻用户 id
exports.hotUser = (req, res) => {
    const status = 0
    const sql = 'update users set status=? where id=?'
    db.query(sql, [status, req.body.id], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send({
                status: 0,
                message: '用户已解除冻结'
            })
        }
    })
}

// 获取冻结用户列表
exports.getBanList = (req, res) => {
    const sql = 'select * from users where status="1" '
    db.query(sql, (err, results) => {
        if (results.length > 0) {
            return res.send(results)
        }
    })
}

// 删除用户 id account
exports.delUser = (req, res) => {
    const sql = 'delete from users where id=?'
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            const sql1 = 'delete from image where account=?'
            db.query(sql, req.body.account, (err, result) => {
                if (err) {
                    return res.cc(err)
                }
                else {
                    return res.send({
                        status: 0,
                        message: '删除成功'
                    })
                }
            })

        }
    })
}

// 获取对应身份的总人数 identity
exports.getAdminListLength = (req, res) => {
    const sql = 'select * from users where identity=?'
    db.query(sql, req.body.identity, (err, result) => {
        // console.log(result);

        if (err) {
            return res.cc(err)
        }
        else {
            res.send({
                length: result.length
            })
        }
    })
}

// 监听换页返回数组 页码 page  identity
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.getAdminListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from users where identity=? ORDER BY create_time limit 10 offset ? `
    db.query(sql, [req.body.identity, number], (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

