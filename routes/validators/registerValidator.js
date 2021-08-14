const {check} = require('express-validator');


module.exports = [
    check('username').exists().withMessage('Vui lòng nhập username')
	.notEmpty().withMessage('Username không được để trống'),

	check('password').exists().withMessage('Vui lòng nhập mật khẩu')
	.notEmpty().withMessage('Mật khẩu không được để trống'),

	check('name').exists().withMessage('Vui lòng nhập tên tổ chức')
	.notEmpty().withMessage('Tên không được để trống')
]