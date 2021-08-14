const userModels =  require('../models/user');
const accountModels = require('../models/account');
const postModels = require('../models/post')
const commentModels = require('../models/comment');
const facultyModels = require('../models/faculty');

exports.index = async function(req, res, next) {
	let msgError = req.flash('msgError') || '' ;
	let msgSuccess = req.flash('msgSuccess') || '' ;
	let per = 1; //permission between user and another user
	let postId = [];
	if(req.query.query){
		let id =  req.query.query;
		if(id !== req.cookies.idGmail ){per = 0;}
		// change user = account when login is admin || teacher
		let user ;
		if(req.cookies.username){
			user = await accountModels.findOne({username:req.cookies.username});
		}else{
			user = await userModels.findById(req.cookies.idGmail)
			.populate('faculty').populate('arrPost');
		}
		let another = await userModels.findById(id)
					.populate('faculty').populate('arrPost');
		let faculties = await facultyModels.find();
		another.arrPost.forEach(p => {
			postId.push(p._id);
		})
		
		let posts = await postModels.find().where('_id').in(postId).sort({'createdAt':-1}).populate('user').populate('comments').limit(10);
		
		res.render('profile',{user,another,faculties,msgError,msgSuccess,per,posts})
	}
	if(req.cookies.idGmail){
		//get user
		let user = await userModels.findById(req.cookies.idGmail)
					.populate('faculty').populate('arrPost');
	
		//get all faculties -> fill to selected option
		let faculties = await facultyModels.find();
		

		//get posts of user
		user.arrPost.forEach(p => {
			postId.push(p._id);
		})
		let posts = await postModels.find().where('_id').in(postId).sort({'createdAt':-1}).populate('user').populate('comments').limit(10);
		
		res.render('profile',{user,faculties,msgError,msgSuccess,per,posts})
	}else if(req.cookies.username){
        accountModels.findOne({username:req.cookies.username } , (err,user) =>{
            res.render('profile',{user,msgError,msgSuccess ,per})
        })
	}else{
		res.redirect('/login')
	}
}