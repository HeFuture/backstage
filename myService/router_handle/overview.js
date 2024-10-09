
// 导入数据库连接
const db = require('../db/index')
// 使用moment来处理日期
const moment = require('moment')

// 获取产品类别和总价
exports.getCategoryAndNumber = (req, res) => {
    // 获取产品类别数组
    const CategoryArr = () => {
        return new Promise((resolve, reject) => {
            // 查询产品设置里有几个分类
            const sql = 'select set_value from setting where set_name="产品设置"'
            db.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                let str = result[0].set_value
                // eval()  JSON格式字符串转化为 JSON对象
                // const arr = eval('(' + str + ')')
                // 使用eval()来解析JSON字符串是不推荐的，因为它存在严重的安全风险。
                // 使用JSON.parse()来解析JSON字符串是推荐的做法，因为它既安全又高效。
                const arr = JSON.parse(str)
                resolve(arr)
            })
        })
    }
    // 获取价格
    const getNumber = product_category => {
        return new Promise((resolve, reject) => {
            // 通过product_category分类查询 产品总价product_all_price
            const sql = 'select product_all_price from product where product_category=?'
            db.query(sql, product_category, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                let total = 0
                for (let i = 0; i < result.length; i++) {
                    total += result[i]['product_all_price']
                }
                resolve(total)
            })
        })
    }
    // 调用获取产品类别数组 和 获取价格
    async function getAll() {
        // 先调用查询分类
        const category = await CategoryArr()
        const price = []
        for (let i = 0; i < category.length; i++) {
            // 将查到的分类循环查找总价
            price[i] = await getNumber(category[i])
        }
        res.send({
            category: category,
            price: price
        })
    }
    getAll()
}

// 获取不同角色与数量
exports.getAdminAndNumber = (req, res) => {
    // 获取不同角色的数量
    const getNumber = identity => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from users where identity=?'
            db.query(sql, identity, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length)
            })
        })
    }
    // 根据name循环去获取角色的数量
    async function getAll() {
        const data = [
            {
                value: 0,
                name: '超级管理员'
            },
            {
                value: 0,
                name: '产品管理员'
            },
            {
                value: 0,
                name: '用户管理员'
            },
            {
                value: 0,
                name: '消息管理员'
            },
            {
                value: 0,
                name: '用户'
            },
        ]
        for (let i = 0; i < data.length; i++) {
            // 根据name循环去获取角色的数量 获取成功后再添加给 data[i]['value']
            data[i]['value'] = await getNumber(data[i]['name'])
        }
        res.send({
            data: data
        })
    }
    getAll()
}

// 获取不同消息等级和数量
exports.getLevelAndNumber = (req, res) => {
    // 获取不同消息等级的数量
    const getNumber = message_Level => {
        return new Promise((resolve, reject) => {
            const sql = 'select * from message where message_Level=?'
            db.query(sql, message_Level, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.length)
            })
        })
    }
    // 根据name循环去获取角色的数量
    async function getAll() {
        const data = [
            {
                value: 0,
                name: '一般'
            },
            {
                value: 0,
                name: '重要'
            },
            {
                value: 0,
                name: '必要'
            }
        ]
        for (let i = 0; i < data.length; i++) {
            // 根据name循环去获取角色的数量 获取成功后再添加给 data[i]['value']
            data[i]['value'] = await getNumber(data[i]['name'])
        }
        res.send({
            data: data
        })
    }
    getAll()
}

// 返回每天登录人数
exports.getDayAndNumber = (req, res) => {
    // 获取最近七天日期
    const getDay = () => {
        let day = new Date()
        let week = []
        for (let i = 0; i < 7; i++) {
            // day.getDate() 返回当前的一天，比如 2024年9月28日，会返回28，为了获取前7天的数据，这里减一
            day.setDate(day.getDate() - 1)
            // 需要将日期格式转换 使用 moment.js
            // 2024/9/28  ->  2024-09-28
            week.push(moment(day.toLocaleDateString().replace(/\//g, '-'), 'YYYY-MM-DD').format('YYYY-MM-DD'))
        }
        return week
    }
    // 获取每天登录的人数
    const getNumber = login_time => {
        return new Promise((resolve, reject) => {
            const sql = `select * from login_log where login_time like ?`
            // 使用通配符和参数值组合来准备传递给 SQL 查询的参数  
            const params = [`${login_time}%`];
            db.query(sql, params, (err, result) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(result.length)
            })
        })
    }

    async function getAll() {
        let week = getDay()
        let number = []
        for (let i = 0; i < week.length; i++) {
            number[i] = await getNumber(week[i])
        }
        res.send({
            number: number,
            week: week
        })
    }
    getAll()
}