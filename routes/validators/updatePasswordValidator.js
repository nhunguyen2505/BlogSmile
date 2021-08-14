const {check} = require('express-validator');

module.exports  = [
    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
	.notEmpty().withMessage('Mật khẩu không được để trống'),
    check('repassword').exists().withMessage('Vui lòng nhập mật khẩu')
	.notEmpty().withMessage('Mật khẩu không được để trống'),
]