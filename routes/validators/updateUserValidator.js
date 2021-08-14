const {check} = require('express-validator');


module.exports = [
	check('classcode').exists().withMessage('Vui lòng nhập lớp')
	.notEmpty().withMessage('Lớp không được để trống'),
    
    
]