const {check} = require('express-validator');

module.exports = [
    check('notiTitle').exists().withMessage('Vui lòng nhập tiêu đề')
	.notEmpty().withMessage('Tiêu đề không được để trống')
	,

	check('notiDetail').exists().withMessage('Vui lòng nhập nội dung')
	.notEmpty().withMessage('Nội dung không được để trống')
]