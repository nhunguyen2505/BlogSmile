const userModels =  require('../models/user');
const accountModels = require('../models/account');
const postModels = require('../models/post')
const commentModels = require('../models/comment');
const facultyModels = require('../models/faculty');
const notiModels = require('../models/notification');
const {validationResult} = require('express-validator'); 
const socket = require('../app'); //import socket  from app.js

exports.index = async function(req, res, next) {
	let title = "Thông báo"
	let perPage = 10; // số lượng sản phẩm xuất hiện trên 1 page
  	let page = req.query.page || 1; 
	let facultyID = req.query.faculty || "all";
	let notis ;
	let count = await notiModels.countDocuments();
	if(facultyID !== "all"){
		
		notis = await notiModels.find({'faculty': facultyID}).sort({'time':-1}).populate('faculty')
		.skip((perPage * page) - perPage).limit(perPage);
		count = await notiModels.find({'faculty': facultyID}).countDocuments();
	}else{
		notis = await notiModels.find().sort({'time':-1}).populate('faculty')
		.skip((perPage * page) - perPage).limit(perPage);
	}
	
	let faculties = await facultyModels.find();
	if(req.cookies.idGmail){
		let id = req.cookies.idGmail
		let user = await userModels.findById(id)
		
		res.render('list-notification',{title,user,faculties,notis, current: page,pages: Math.ceil(count / perPage)})
	}
	else if(req.cookies.username){
		
        accountModels.findOne({username:req.cookies.username } , (err,user) =>{
            res.render('list-notification',{title,user,faculties,notis,current: page,pages: Math.ceil(count / perPage)})
        })
	}else{
		res.redirect('/login')
	}
}

exports.detail = async (req,res)=> {
	
	let idNoti = req.query.id;
	
	let noti = await notiModels.findById(idNoti).populate('faculty');
	let title = noti.notiTitle;
	if(req.cookies.idGmail){
		let id = req.cookies.idGmail
		let user = await userModels.findById(id)
		res.render('detail-noti',{title,user,noti})
	}
	else if(req.cookies.username){
        accountModels.findOne({username:req.cookies.username } , (err,user) =>{
            res.render('detail-noti',{title,user,noti})
        })
	}else{
		res.redirect('/login')
	}
	
}

exports.create_noti = async (req,res)=>{
	
	let result = validationResult(req);
	if(result.errors.length === 0){
		let {faculty, notiTitle,notiDetail,userID} = req.body;
		let user = await accountModels.findById(userID);
		let fac = await facultyModels.findById(faculty);
		let facultyName = fac.nameFaculty;
		const noti = new notiModels({
			user: user._id,
			notiTitle : notiTitle,
			notiDetail : notiDetail,
			faculty : faculty
		})
		noti.save()
		.then(noti => {
			console.log(noti)
			let idNoti = noti._id;
			user.arrNoti.push(idNoti);
			fac.arrNoti.push(idNoti);
	
			user.save();
			fac.save();
	
			req.flash('msgSuccess', 'Đăng thông báo thành công')
			//emit socket io
			socket.ioObject.sockets.in("_room" + req.body.id).emit("newNoti",{
				facultyName:facultyName,
				notiTitle : notiTitle,
				notiID : noti._id
			});
			res.redirect('/dashboard')
		})
		.catch(err => console.log(err));
	}else{
		result = result.mapped();
		let msg ;
		for(fields in result){
			msg = result[fields].msg;
			break;
		}
		req.flash('msgError', msg)
		
		res.redirect('/dashboard');
	}
	
	
}

exports.delete_noti = async (req,res)=>{
	let id = req.body.id;
    let noti = await notiModels.findById(id);
    //let userid 
    let userID = noti.user;
    let facultyID = noti.faculty;
	await notiModels.findByIdAndDelete(id);

    //remove arrNoti in user
    let user = await accountModels.findById(userID);
    user.arrNoti.pull(id);
    user.save();

    //remove arrNoti in faculty
    let faculty = await facultyModels.findById(facultyID);
    faculty.arrNoti.pull(id);
    faculty.save();
    
	res.send("deleted noti");
}

exports.get_noti =  async (req,res)=>{
	let id = req.body.id;
	let noti = await notiModels.findById(id).populate('faculty');
	res.send(noti);
}

exports.update_noti = async (req,res)=>{
	let {id,notiTitle,notiDetail} = req.body;

	let noti = await notiModels.findById(id);
	noti.notiTitle = notiTitle;
	noti.notiDetail = notiDetail;

	noti.save();
	res.send("success");
}