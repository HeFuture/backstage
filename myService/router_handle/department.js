

// message_receipt_object   消息接收者 
// read_list  阅读列表
// read_status  阅读状态

// 导入数据库连接
const db = require('../db/index')

// 获取部门消息id列表 id, department
exports.getDepartmentMsg = (req, res) => {
    const { id, department } = req.body
    // 根据发布消息时的接收部门获取到用户的部门消息，并返回数组
    const sql = "select * from message where message_receipt_object=? AND message_status='0' "
    db.query(sql, department, (err, result) => {
        if (err) {
            return res.send(err)
        }
        else {
            let msgArr = []
            result.forEach((e) => {
                msgArr.push(e.id)
            })
            // 更新用户的未读列表 read_list 以及 read_status
            const sql2 = 'update users set read_list=?,read_status=1 where id=?'
            db.query(sql2, [JSON.stringify(msgArr), id], (err, result) => {
                if (err) {
                    return res.send(err)
                }
                res.send({
                    status: 0,
                    id: id,
                    read_list: msgArr
                })
            })
        }

    })
}

// 获取部门消息
exports.getDepartmentMsgList = (req, res) => {
    const { department } = req.body
    // 根据发布消息时的接收部门获取到用户的部门消息，并返回数组
    const sql = "select * from message where message_receipt_object=? AND message_status='0'"
    db.query(sql, department, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 返回用户的阅读列表
exports.getReadListAndStatus = (req, res) => {
    const sql = 'select read_list,read_status from users where id=?'
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 用户点击消息后对 read_list 内的数据进行删减  参数：消息id、用户id
exports.clickDelete = (req, res) => {
    const sql = 'select read_list from users where id=?'
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.send(err)
        } else {
            // 1.将获取到的 read_list 变成 JSON对象
            // 2.将这个 read_list 进行一个过滤
            // 3.使用JSON.stringfly 变回原样，同时 update 这个用户的 read_list

            // 检查是否有结果返回  
            if (!result || result.length === 0) {
                return res.status(404).send({ status: 1, msg: '用户未找到' });
            }

            const user = result[0];

            // 检查read_list是否存在  
            if (!user.read_list) {
                return res.status(400).send({ status: 1, msg: '用户没有阅读列表' });
            }

            // 如果item不等于req.body.readid，则item会被包含在.filter()方法返回的新数组中。
            list = JSON.stringify(JSON.parse(result[0].read_list).filter(item => item != req.body.readid))
            const sql2 = 'update users set read_list =? where id=?'
            db.query(sql2, [list, req.body.id], (err, result) => {
                if (err) {
                    return res.send(err)
                }
                res.send({
                    status: 0,
                    msg: '删减成功'
                })
            })
        }
    })
}

// 把新发布文章的 id 插入到当前所属部门的用户的 read_list 中  参数：新发布文章的id、对应部门的 department
exports.changeUserReadList = (req, res) => {
    // 查出用户的 阅读列表和阅读状态
    const sql = 'select read_list,read_status,id from users where department=?'
    db.query(sql, req.body.department, (err, result) => {
        if (err) {
            return res.send(err)
        } else {
            result.forEach((e) => {
                // 将获取了阅读状态为1的阅读列表，添加新的文章id
                if (e.read_status == 1 && e.read_list) {
                    let arr = JSON.parse(e.read_list)
                    arr.push(req.body.newId)
                    arr = JSON.stringify(arr)
                    const sql2 = 'update users set read_list=? where id=?'
                    db.query(sql2, [arr, e.id], (err, result) => {
                        if (err) {
                            return res.send(err)
                        }
                    })
                }
            })
            res.send({
                status: 0,
                msg: '更新成功'
            })
        }
    })

}

// 把删除文章的 id 从当前所属部门的用户的 read_list 中删除  参数：新发布文章的id、对应部门的 department
exports.changeUserReadListButDelete = (req, res) => {
    // 查出用户的 阅读列表和阅读状态
    const sql = 'select read_list,read_status,id from users where department=?'
    db.query(sql, req.body.department, (err, result) => {
        if (err) {
            return res.send(err)
        } else {
            result.forEach((e) => {
                // 将获取了阅读状态为1的阅读列表，添加新的文章id
                if (e.read_status === 1 && e.read_list) {
                    let arr = JSON.parse(e.read_list)
                    arr = arr.filter(item => {
                        return item != req.body.deleteId
                    })
                    arr = JSON.stringify(arr)
                    const sql2 = 'update users set read_list=? where id=?'
                    db.query(sql2, [arr, e.id], (err, result) => {
                        if (err) {
                            return res.send(err)
                        }
                    })
                }
            })
            res.send({
                status: 0,
                msg: '删除成功'
            })
        }
    })

}

