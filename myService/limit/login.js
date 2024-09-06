
const joi = require('joi')


// 规则 string：只允许为string
//  alphanum：只允许小写的a-z  A-Z  0-9
// min max 最小和最大长度
// required：必填项
// 账号验证
const account = joi.string().alphanum().min(6).max(12).required()
// pattern：必须要传入一个值，可以是正则表达式
// 密码的验证
const password = joi.string().pattern(/^[a-z0-9]+$/i).min(6).max(12).required()

exports.login_limit = {
    // 表示对req.body里面的数据进行验证
    body: {
        account,
        password
    }
}