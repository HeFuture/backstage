
// 导入mysql数据库
const mysql=require('mysql2')

// 创建数据库连接
const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'back_system'
})

// 对外暴露数据库
module.exports = db


