
// 导入数据库连接
const db = require('../db/index')

// 上传轮播图 set_value  set_name
exports.uploadSwiper = (req, res) => {
    // console.log(req.files,"11111");

    let oldName = req.files[0].filename
    let newName = Buffer.from(req.files[0].originalname, 'latin1').toString('utf-8')
    fs.renameSync('./public/upload/' + oldName, './public/upload/' + newName)
    const sql = 'UPDATE setting SET set_value =? WHERE set_name = ?'

    db.query(sql, [`http://localhost:3000/upload/${newName}`, req.body.name], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '上传图片成功'
        })
    })
}

// 获取所有轮播图 
exports.getSwiper = (req, res) => {
    const sql = "SELECT * FROM setting WHERE set_name LIKE 'swiper%' "
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        // 创建了一个数组，存放所有的set_value
        let array = []
        results.forEach((e) => {
            array.push(e.set_value)
        })
        res.send(array)
    })
}

// 获取公司名称 
exports.getCompanyName = (req, res) => {
    // console.log(req.body);

    const sql = "SELECT * FROM setting where set_name='公司名称'"
    db.query(sql, (err, resluts) => {
        if (err) return res.cc(err)
        res.send(resluts[0].set_value)
    })
}

// 修改公司名称  set_value
exports.changeCompanyName = (req, res) => {
    // console.log(req.body);

    const sql = "UPDATE setting SET set_value =? WHERE set_name='公司名称' "
    db.query(sql, req.body.set_value, (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}

// 编辑公司介绍  set_text   set_name
exports.changeCompanyIntroduce = (req, res) => {
    // console.log(req.body);

    const sql = "UPDATE setting SET set_text =? WHERE set_name=? "
    db.query(sql, [req.body.set_text, req.body.set_name], (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '修改成功'
        })
    })
}

// 获取公司介绍  set_name
exports.getCompanyIntroduce = (req, res) => {
    // console.log(req.body);

    const sql = "SELECT * FROM setting where set_name=?"
    db.query(sql, req.body.set_name, (err, resluts) => {
        if (err) return res.cc(err)
        res.send(resluts[0].set_text)
        // console.log(resluts[0].set_text);
    })
}

// 获取所有公司信息 
exports.getAllCompanyIntroduce = (req, res) => {
    // console.log(req.body);

    const sql = "SELECT * FROM setting where set_name like '公司%'"
    db.query(sql, (err, resluts) => {
        if (err) return res.cc(err)
        res.send(resluts)
    })
}


// ----------------------其他设置
// 部门设置  set_value
exports.setDepartment = (req, res) => {
    const sql = "UPDATE setting SET set_value =? WHERE set_name='部门设置' "
    db.query(sql, req.body.set_value, (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '设置成功'
        })
    })
}

// 获取部门
exports.getDepartment = (req, res) => {
    const sql = "SELECT set_value FROM setting where set_name='部门设置'"
    db.query(sql, (err, resluts) => {
        if (err) return res.cc(err)
        res.send(resluts)
    })
}

// 产品设置  set_value
exports.setProduct = (req, res) => {
    const sql = "UPDATE setting SET set_value =? WHERE set_name='产品设置' "
    db.query(sql, req.body.set_value, (err, resluts) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '设置成功'
        })
    })
}

// 获取产品
exports.getProduct = (req, res) => {
    const sql = "SELECT set_value FROM setting where set_name='产品设置'"
    db.query(sql, (err, resluts) => {
        if (err) return res.cc(err)
        res.send(resluts)
    })
}