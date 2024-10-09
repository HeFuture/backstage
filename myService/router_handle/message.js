

/* 
message_title 消息主题
message_category 消息类别
message_publish_department 消息发布部门
message_publish_name 消息发布者 
message_receipt_object 消息接收者 
message_click_number 消息查看数量 
message_content 消息内容
message_create_time 消息发布时间 
message_update_time 消息更新时间 
message_Level 消息等级
message_status  默认为0，1在回收站 
message_delete_time 消息删除时间 */

// 导入数据库连接
const db = require('../db/index')



// 发布消息
exports.publishMessage = (req, res) => {
    const {
        message_title,
        message_category,
        message_publish_department,
        message_publish_name,
        message_receipt_object,
        message_content,
        message_Level
    } = req.body
    // 消息发布时间 
    const message_create_time = new Date()
    // message_click_number 消息查看数量 
    let message_click_number = 0;
    // message_status  默认为0，1在回收站 
    let message_status = 0;
    const sql = 'insert into message (message_title,message_category,message_publish_department,message_publish_name,message_receipt_object,message_content,message_Level,message_create_time,message_click_number,message_status) VALUES (?,?,?,?,?,?,?,?,?,?)';
    const VALUES = [
        message_title,
        message_category,
        message_publish_department,
        message_publish_name,
        message_receipt_object,
        message_content,
        message_Level,
        message_create_time,
        message_click_number,
        message_status
    ];
    db.query(sql, VALUES, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            status: 0,
            message: '发布消息成功',
            department: message_receipt_object,
            id: result.insertId
        })
    })
}

// 获取公司公告列表
exports.companyMessageList = (req, res) => {
    const sql = 'select * from message where message_category="公司公告" and message_status="0" ORDER BY message_create_time DESC LIMIT 5'
    db.query(sql, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 获取系统消息列表
exports.systemMessageList = (req, res) => {
    const sql = 'select * from message where message_category="系统消息" and message_status="0" ORDER BY message_create_time DESC LIMIT 5'
    db.query(sql, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 编辑公告
exports.editMessage = (req, res) => {
    const {
        message_title,
        message_publish_department,
        message_publish_name,
        message_content,
        message_receipt_object,
        message_Level,
        id
    } = req.body
    // 通过id返回消息之前的部门
    const returnOldDepartment = id => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT message_receipt_object from message where id=?'
            db.query(sql, id, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result[0].message_receipt_object)
            })
        })
    }
    // 对消息更改之后的接收部门的read_list进行一个添加id的操作 参数：newDepartment newid
    const pushIdInReadList = (newDepartment, newId) => {
        // 查出用户的 阅读列表和阅读状态
        const sql = 'select read_list,read_status,id from users where department=?'
        db.query(sql, newDepartment, (err, result) => {
            if (err) {
                return res.send(err)
            } else {
                result.forEach((e) => {
                    // 将获取了阅读状态为1的阅读列表，添加新的文章id
                    if (e.read_status == 1 && e.read_list) {
                        let arr = JSON.parse(e.read_list)
                        arr.push(newId)
                        arr = JSON.stringify(arr)
                        const sql2 = 'update users set read_list=? where id=?'
                        db.query(sql2, [arr, e.id], (err, result) => {
                            if (err) {
                                return res.send(err)
                            }
                        })
                    }
                })
            }
        })
    }
    // 把之前的接收部门的用户的read_list里面的id删除  参数：oldDepartment deleteId
    const deleteIdInReadList = (oldDepartment, deleteId) => {
        // 查出用户的 阅读列表和阅读状态
        const sql = 'select read_list,read_status,id from users where department=?'
        db.query(sql, oldDepartment, (err, result) => {
            if (err) {
                return res.send(err)
            } else {
                result.forEach((e) => {
                    // 将获取了阅读状态为1的阅读列表，添加新的文章id
                    if (e.read_status === 1 && e.read_list) {
                        let arr = JSON.parse(e.read_list)
                        arr = arr.filter(item => {
                            return item != deleteId
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
            }
        })
    }
    // 执行整个流程的更新操作
    async function change() {
        // 通过id查询到数据库里用户的原消息接收部门message_receipt_object
        const receiptObj = await returnOldDepartment(id)
        // 如果返回的部门与修改后的部门不同，并且也不是全体成员
        if (receiptObj !== '全体成员' && receiptObj !== message_receipt_object) {
            // 将新的消息接收部门添加
            pushIdInReadList(message_receipt_object, id)
            // 将老的消息接收部门删除
            deleteIdInReadList(receiptObj, id)
        }
        // 如果要把消息从原来的部门修改为全体成员
        if (message_receipt_object == '全体成员' && receiptObj !== message_receipt_object) {
            // 将老的消息接收部门删除
            deleteIdInReadList(receiptObj, id)
        }
        // 如果原来的接收部门是全体成员，就需要对新的接收部门的用户的read_list加上id
        if (receiptObj == '全体成员' && receiptObj !== message_receipt_object) {
            // 将新的消息接收部门添加
            pushIdInReadList(message_receipt_object, id)
        }
        // 消息发布时间 
        const message_update_time = new Date()
        const sql = 'update message set message_title=?,message_publish_department=?,message_publish_name=?, message_receipt_object=? ,message_content=? ,message_Level=? ,message_update_time=?  where id=? ';
        const VALUES = [
            message_title,
            message_publish_department,
            message_publish_name,
            message_receipt_object,
            message_content,
            message_Level,
            message_update_time,
            id
        ];
        db.query(sql, VALUES, (err, result) => {
            if (err) {
                return res.send(err)
            }
            res.send({
                status: 0,
                message: '编辑消息成功'
            })
        })
    }

    change()
}

// 根据发布部门获取消息
exports.searchMessageByDepartment = (req, res) => {
    const sql = 'select * from message where message_publish_department=? and message_status="0"';
    db.query(sql, req.body.message_publish_department, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 根据发布等级获取消息
exports.searchMessageByLevel = (req, res) => {
    const sql = 'select * from message where message_Level=? and message_status="0"';
    db.query(sql, req.body.message_Level, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 获取公告/系统消息
exports.getMessage = (req, res) => {
    const sql = 'select * from message where id=?';
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}

// 更新点击率
exports.updateclick = (req, res) => {
    const { message_click_number, id } = req.body
    let number = message_click_number * 1 + 1
    const sql = 'update message set message_click_number=? where id=?'
    db.query(sql, [number, id], (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            status: 0,
            message: '点击率增加'
        })
    })
}

// 初次删除
exports.fisrtDelete = (req, res) => {
    // 默认为0，1在回收站 
    let message_status = 1;
    let message_delete_time = new Date();
    const sql = 'update message set message_status=?,message_delete_time=? where id=?';
    db.query(sql, [message_status, message_delete_time, req.body.id], (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            status: 0,
            message: '初次删除成功'
        })
    })
}

// 获取回收站的列表
exports.recycleList = (req, res) => {
    const sql = 'select * from message where message_status="1" ';
    db.query(sql, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send(result)
    })
}
// 获取回收站总数
exports.getRecycleMessageLength = (req, res) => {
    const sql = 'select * from message where message_status="1"'
    db.query(sql, (err, result) => {
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
// 监听换页返回数据  回收站
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnRecycleListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from message where message_status='1' ORDER BY message_delete_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}


// 还原初次删除操作
exports.recover = (req, res) => {
    // 默认为0，1在回收站 
    let message_status = 0;
    let message_update_time = new Date();
    const sql = 'update message set message_status=?,message_update_time=? where id=?';
    db.query(sql, [message_status, message_update_time, req.body.id], (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            status: 0,
            message: '还原成功'
        })
    })
}

// 删除操作
exports.deleteMessage = (req, res) => {
    const sql = 'delete from message where id=?'
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.send(err)
        }
        res.send({
            status: 0,
            message: '删除消息成功'
        })
    })
}

// 获取公司公告总数
exports.getCompanyMessageLength = (req, res) => {
    const sql = 'select * from message where message_category="公司公告" AND message_status="0" '
    db.query(sql, (err, result) => {
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

// 获取系统消息总数
exports.getSystemMessageLength = (req, res) => {
    const sql = 'select * from message where message_category="系统消息" AND message_status="0" '
    db.query(sql, (err, result) => {
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

// 监听换页返回数据  公司公告
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnCompanyListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from message where message_category="公司公告" AND message_status='0' ORDER BY message_create_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

// 监听换页返回数据  系统消息
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnSystemListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from message where message_category="系统消息" AND message_status='0' ORDER BY message_create_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}