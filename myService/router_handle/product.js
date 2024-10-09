/*
产品表product字段：
*product_id入库编号int
*product_name产品名称varchar
*product_category产品类别varchar
*product_unit产品单位varchar
*product_inwarehouse_number产品入库数量库存int
*product_single_price产品入库单价int
*product_all_price产品入库总价int
*product_status库存状态100-300为正常100以下为库存告急300以上为过剩va
*product_create_person入库操作人varchar
*product_create_time产品新建时间varchar
*product_update_time产品最新编辑时间varchar
*in_memo入库备注

*product_out_id出库idint
*product_out_number出库数量int
*product_out_price出库总价int
*product_out_apply_person出库申请人varchar
*product_apply_time申请出库时间varchar
*apply_memo申请备注varchar
*product_out_status出库状态申请出库or同意or否决varchar
*product_audit_time审核时间varchar
*product_out_audit_person审核人varchar
*apply_memo出库申请备注varchar
*/
// 导入数据库连接
const db = require('../db/index')

// 创建产品
exports.createProduct = (req, res) => {
    const sql2 = 'select * from product where product_id=?'
    db.query(sql2, req.body.product_id, (err, result) => {
        if (result.length) {
            return res.send({
                message: '入库编号已存在',
                status: 2,
            })
        }
        else {
            const {
                product_id,
                product_name,
                product_category,
                product_unit,
                product_inwarehouse_number,
                product_single_price,
                product_create_person,
                in_memo
            } = req.body;
            // 创建时间
            const product_create_time = new Date()
            // 计算总价
            const product_all_price = product_inwarehouse_number * 1 * product_single_price * 1
            const sql = 'INSERT INTO product (product_id, product_name, product_category, product_unit, product_inwarehouse_number, product_single_price, product_all_price, product_create_person, product_create_time, in_memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [
                product_id,
                product_name,
                product_category,
                product_unit,
                product_inwarehouse_number,
                product_single_price,
                product_all_price,
                product_create_person,
                product_create_time,
                in_memo
            ];
            db.query(sql, values, (err, result) => {
                if (err) {
                    return res.send(err)
                }
                res.send({
                    status: 0,
                    message: '添加产品成功'
                })
            })
        }
    })

}

// 删除产品 product_id
exports.deleteProduct = (req, res) => {
    const sql = 'delete from product where id=?'
    db.query(sql, req.body.id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            res.send({
                message: '删除产品成功',
                status: 0
            })
        }
    })
}
//-------------------------------------------------- select查询是 {}  update是 []

// 编辑产品信息
exports.editProduct = (req, res) => {
    const {
        product_name,
        product_category,
        product_unit,
        product_inwarehouse_number,
        product_single_price,
        in_memo,
        id
    } = req.body
    // 编辑时间
    const product_update_time = new Date()
    // 计算总价
    const product_all_price = product_inwarehouse_number * 1 * product_single_price * 1
    const sql = 'update product set product_name=?, product_category=?, product_unit=?,product_inwarehouse_number=?, product_single_price=?, product_all_price=?, product_update_time=?, in_memo=? where id=?'
    db.query(sql, [
        product_name,
        product_category,
        product_unit,
        product_inwarehouse_number,
        product_single_price,
        product_all_price,
        product_update_time,
        in_memo,
        id
    ], (err, result) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '编辑产品信息成功'
        })
    })
}

// 获取产品列表
exports.getProductList = (req, res) => {
    const sql = 'select * from product where product_inwarehouse_number>=0'
    db.query(sql, (err, result) => {
        if (err) return res.cc(err)
        res.send(result)
    })
}

// 产品申请出库
exports.applyOutProduct = (req, res) => {
    const sql2 = 'select * from product where product_out_id=?'
    db.query(sql2, req.body.product_out_id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        result.forEach((e) => {
            if (e.product_out_id == req.body.product_out_id) {
                return res.send({
                    message: '出库编号已存在',
                    status: 2,
                })
            }
        })
        const product_out_status = '申请出库'
        const {
            id,
            product_out_id,
            product_single_price,
            product_out_number,
            product_out_apply_person,
            apply_memo,
        } = req.body
        // 出库状态
        const product_status = '申请出库'
        // 申请出库时间
        const product_apply_time = new Date()
        // 出库总价
        const product_out_price = product_out_number * 1 * product_single_price * 1
        // select查询是 {}  update是 []
        const sql = 'update product set product_out_status=?, product_out_id=?, product_out_number=?, product_out_price=?, product_out_apply_person=?, apply_memo=?, product_apply_time=?,product_status=? where id=?'
        db.query(sql, [
            product_out_status,
            product_out_id,
            product_out_number,
            product_out_price,
            product_out_apply_person,
            apply_memo,
            product_apply_time,
            product_status,
            id
        ], (err, result) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '产品申请出库成功'
            })
        })

    })

}

// 产品审核列表
exports.applyProductList = (req, res) => {
    const sql = 'select * from product where product_out_status not in ("同意")'
    db.query(sql, (err, result) => {
        if (err) return res.cc(err)
        res.send(result)
    })
}

// 产品出库列表
exports.auditProductList = (req, res) => {
    const sql = 'select * from outproduct'
    db.query(sql, (err, result) => {
        if (err) return res.cc(err)
        res.send(result)
    })
}

// 对产品撤回申请 id
exports.withDrawApplyProduct = (req, res) => {
    // 出库状态
    const product_status = '正常'
    const sql = 'update product set product_out_id=NULL, product_out_status=NULL, product_out_number=NULL, product_out_apply_person=NULL, apply_memo=NULL, product_out_price=NULL, product_apply_time=NULL,product_status=? where id=?'
    db.query(sql, [product_status, req.body.id], (err, result) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '撤回申请成功'
        })
    })
}

// 产品审核
exports.auditProduct = (req, res) => {
    // 出库状态
    const product_status = '正常'
    // 审核同意后，更新库存数量，库存总价，计算出库总价
    // 同时把出库的数据插入outProduct表，把审核的数据置为NULL，类似于撤回申请
    const {
        id,
        product_out_id,
        product_out_status,
        audit_memo,
        product_out_price,
        product_out_audit_person,
        product_out_apply_person,
        product_inwarehouse_number,
        product_single_price,
        product_out_number,
        product_apply_time,
    } = req.body
    // 审核时间
    const product_audit_time = new Date()
    if (product_out_status == '同意') {
        // 计算剩余库存：库存数量-出库数量
        const newWarehouseNumber = product_inwarehouse_number * 1 - product_out_number * 1
        // 库存总价
        const product_all_price = newWarehouseNumber * 1 * product_single_price * 1
        // 插入出库记录
        const sql = 'INSERT INTO outproduct (product_out_id, product_out_number, product_out_price, product_out_audit_person, product_out_apply_person, product_audit_time, audit_memo,product_apply_time) VALUES (?, ?, ?, ?, ?, ?, ?,?)';
        db.query(sql, [
            product_out_id,
            product_out_number,
            product_out_price,
            product_out_audit_person,
            product_out_apply_person,
            product_audit_time,
            audit_memo,
            product_apply_time
        ], (err, result) => {
            if (err) return res.cc(err)
            // 更新产品信息 
            const sql1 = 'UPDATE product SET product_inwarehouse_number = ?,product_out_status=NULL, product_all_price = ?, product_out_id = NULL, product_out_number = NULL, product_out_apply_person = NULL, audit_memo = NULL, product_out_price = NULL, product_audit_time = NULL,product_status=? WHERE id = ?';
            db.query(sql1, [newWarehouseNumber, product_all_price, product_status, req.body.id], (err, result) => {
                if (err) return res.cc(err)
                res.send({
                    status: 0,
                    message: '产品出库成功'
                })
            })

        })
    }
    if (product_out_status == '否决') {
        const sql = 'update product set audit_memo=?,product_out_status=?,product_audit_time=?,product_apply_time=?,product_status="申请出库" where id=?'
        db.query(sql, [audit_memo, product_out_status, product_audit_time, product_apply_time, id], (err, result) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '产品被否决'
            })
        })
    }
}

// 通过入库编号对产品进行搜索 product_id
exports.searchProductForId = (req, res) => {
    const number = (req.body.page - 1) * 10
    const productid = req.body.product_id && req.body.product_id.trim();
    if (!productid) {
        return
    }
    // const sql = 'select * from product where product_id like ? '
    const sql = 'select * from product where product_id like ? LIMIT 10 OFFSET ?'
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${productid}%`, number];
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send(
                result
            )
        }
    })
}

// 通过出库申请编号 对产品进行搜索 product_out_id
exports.searchProductForApplyId = (req, res) => {
    const number = (req.body.page - 1) * 10
    const productid = req.body.product_out_id && req.body.product_out_id.trim();
    if (!productid) {
        return
    }
    const sql = 'select * from product where product_out_id like ? LIMIT 10 OFFSET ?'
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${productid}%`, number];
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send(
                result
            )
        }
    })
}

// 通过出库编号对产品进行搜索 product_out_id
exports.searchProductForOutId = (req, res) => {
    const number = (req.body.page - 1) * 10
    const productid = req.body.product_out_id && req.body.product_out_id.trim();
    if (!productid) {
        return
    }
    const sql = 'select * from outproduct where product_out_id like ? LIMIT 10 OFFSET ?'
    // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
    const params = [`${productid}%`, number];
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        else {
            return res.send(
                result
            )
        }
    })
}

// 获取产品的总数 
exports.getProductLength = (req, res) => {
    const sql = 'select * from product where product_inwarehouse_number>=0'
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

// 获取申请出库产品总数
exports.getApplyProductLength = (req, res) => {
    const sql = 'select * from product where product_out_status="申请出库" || product_out_status="否决"'
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

// 获取出库产品总数
exports.getOutProductLength = (req, res) => {
    const sql = 'select * from outproduct'
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

// 监听换页返回数据  产品页面
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnProductListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from product where product_inwarehouse_number>=0 ORDER BY product_create_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

// 监听换页返回数据  申请出库页面
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnApplyProductListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from product where product_out_status="申请出库" || product_out_status="否决" ORDER BY product_apply_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}

// 监听换页返回数据  出库页面
// limit 要获取多少条数据，offset 要跳过多少条数据
exports.returnoutProductListData = (req, res) => {
    const number = (req.body.page - 1) * 10
    const sql = `select * from outproduct ORDER BY product_audit_time limit 10 offset ? `
    db.query(sql, number, (err, result) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send(result)
        }
    })
}
