const accountmodels = require('../models/account');
const loginValidator = require('../routes/validators/loginValidator');
const passwordHash = require('password-hash');
const {validationResult} = require('express-validator'); 

exports.login_account = (req,res) => {
    let result = validationResult(req);
	if(result.errors.length === 0) {
		let {username, password} =  req.body;
		accountmodels.findOne({username : username} , (err,data) => {
			if(data){
				if(passwordHash.verify(password, data.password)){
					//thanh cong
					
					res.cookie('username',username,{ maxAge: (1000 * 3600 * 24 * 30 * 2), httpOnly: true });
					res.cookie('name', data.name,{ maxAge: 900000, httpOnly: true });
					res.cookie('role', data.role,{ maxAge: 900000, httpOnly: true });
					res.redirect('/');
				}else{
					req.flash('error' ,"Mật khẩu không chính xác");
					res.redirect('/login');
				}
			}else{
				req.flash('error' ,"Tài khoản không tồn tại");
				res.redirect('/login');
			}
		})			
	}else{
		result = result.mapped();
		let error ;
		for(fields in result){
			error = result[fields].msg;
			break;
		}

		req.flash('error',error);
		res.redirect('/login');
	}
}


exports.register_account = (req,res) => {
    
	let result = validationResult(req);
	if(result.errors.length === 0){
		let {username,password,name,faculty} = req.body;
		let hashedPassword = passwordHash.generate(password); 

		const account = new accountmodels({
			username : username,
			password : hashedPassword,
			name: name,
			role: 1,
			arrFaculty:faculty
		});
		account.save()
			.then( (result) => {
				req.flash('msg',"Đăng kí tài khoản thành công");
				res.redirect('/add_user')
			})
			.catch((err) => console.log(err));
	}else{
		result = result.mapped();
		let msg ;
		for(fields in result){
			msg = result[fields].msg;
			break;
		}

		req.flash('msg',msg);
		res.redirect('/add_user');
	}
}

exports.update_password = (req,res) => {
	let result = validationResult(req);
	if(result.errors.length === 0){
		let {password,repassword} = req.body;
		if(password === repassword){
			let hashedPassword = passwordHash.generate(password); 
			accountmodels.findOneAndUpdate({username:req.cookies.username},
				 {password:hashedPassword },
				 { new: true },(err,data) => {
					if(err){
						req.flash('msgError', err);
					}else{
						req.flash('msgSuccess', "Cập nhật thành công")
					}
					res.redirect('/profile');
				})
		}else{
			req.flash('msgError',"Mật khẩu xác nhận không khớp");
			res.redirect('/profile');
		}
	}else{
		result = result.mapped();
        let msgError ;
		for(fields in result){
			msgError = result[fields].msg;
			break;
		}

		req.flash('msgError',msgError);
        res.redirect('/profile');
	}
}

