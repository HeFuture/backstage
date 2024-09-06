
const joi = require('joi')


// 规则 string：只允许为string
//  alphanum：只允许小写的a-z  A-Z  0-9
// min max 最小和最大长度
// required：必填项
// pattern：必须要传入一个值，可以是正则表达式
const name = joi.string().pattern(/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/).required()
const email = joi.string().pattern(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/).required()
const id = joi.required()

const oldPassword = joi.string().pattern(/^[a-z0-9]+$/i).min(6).max(12).required()
const newPassword = joi.string().pattern(/^[a-z0-9]+$/i).min(6).max(12).required()


exports.name_limit = {
    // 表示对req.body里面的数据进行验证
    body: {
        id,
        name
    }
}
exports.email_limit = {
    // 表示对req.body里面的数据进行验证
    body: {
        id,
        email
    }
}
exports.password_limit = {
    // 表示对req.body里面的数据进行验证
    body: {
        id,
        oldPassword,
        newPassword
    }
}
