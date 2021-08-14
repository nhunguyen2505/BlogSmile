const userModels =  require('../models/user');
const accountModels = require('../models/account');
const postModels = require('../models/post')
const notiModels = require('../models/notification');
exports.index = async (req,res) => {
	let title = "Trang chủ";
    if(req.session.passport){
		let id = req.session.passport.user

		let user = await userModels.findById(id)
		let posts = await postModels.find().sort({'createdAt':-1}).populate('user').populate('comments').limit(10);
		let notis = await notiModels.find().sort({'time': -1}).populate('faculty').limit(4);
		//luu id vao cookie 
		res.cookie('idGmail',id,{ maxAge: (1000 * 3600 * 24 * 30 * 2), httpOnly: true });

		if(user.activeProfile == "0" ){
			res.redirect('/profile');
		}
		res.render('home',{user,posts,notis,title});
	}
	else if(req.cookies.idGmail){
        let user = await userModels.findById(req.cookies.idGmail)
		let posts = await postModels.find().sort({'createdAt':-1}).populate('user').populate('comments').limit(10);
		let notis = await notiModels.find().sort({'time': -1}).populate('faculty').limit(4);
		if(user.activeProfile == "0" ){
			res.redirect('/profile');
		}
		res.render('home',{user,posts,notis,title});
	}
	else if(req.cookies.username){
       	let user = await  accountModels.findOne({username:req.cookies.username } , (err,user) =>{
			if(err){
				console.log(err);
			}
    	})
		let posts = await postModels.find().sort({'createdAt':-1}).populate('user').populate('comments').limit(10);
		let notis = await notiModels.find().sort({'time': -1}).populate('faculty').limit(4);
		res.render('home',{user,posts,notis,title});
	}
	else{
		res.redirect('/login')
	}
}

exports.login = (req,res) => {
    let error = req.flash('error') || '' ;
    if(req.cookies.idGmail || req.cookies.username){
        res.redirect("/")
    }
    res.render('login',{error})
}

exports.logout = (req,res) => {
    res.clearCookie('idGmail');
    res.clearCookie('username');
	req.session.destroy(err => {
		console.log(err)
		res.redirect('/login')
	})
}