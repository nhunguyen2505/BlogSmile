const express = require('express');
const router = express.Router();
const passport = require('passport')
const passwordHash = require('password-hash');
const {validationResult} = require('express-validator'); 
const uuid = require('short-uuid')
const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname )
	}
});
 
const upload = multer({ storage: storage });



//models
const facultyModels = require('../models/faculty');
const userModels = require('../models/user')
const accountModels = require('../models/account');
const postModels = require('../models/post');
const commentModels = require('../models/comment')
const notiModels = require('../models/notification');

//validator
const registerValidator = require('../routes/validators/registerValidator');
const loginValidator = require('../routes/validators/loginValidator');
const updateUserValidator = require('../routes/validators/updateUserValidator');
const updatePasswordValidator = require('../routes/validators/updatePasswordValidator');
const notiValidator = require('../routes/validators/notiValidator');

//controller
const accountController = require('../controllers/accountController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const multipleUploadController = require("../controllers/multiUploadController");
const profileController = require('../controllers/profileController');
const notificationController = require('../controllers/notificationController');


/* GET login page. */
router.get('/login', authController.login)

/*post login gg*/
router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
})
)


/*	register account  */
router.post('/register_account',registerValidator, accountController.register_account);

router.post('/login_username',loginValidator, accountController.login_account);

router.get('/', authController.index);

/*logout */
router.get('/logout', authController.logout)

/* GET profile page. */
router.get('/profile',profileController.index);

router.get('/department',async function(req, res, next) {
	let faculties = await facultyModels.find();
	let title = "Danh sách phòng ban";
	if(req.cookies.idGmail){
		let id = req.cookies.idGmail
		let user = await userModels.findById(id)
		res.render('department',{title,user,faculties})
	}else if(req.cookies.username){
        accountModels.findOne({username:req.cookies.username } , (err,user) =>{
            res.render('department',{title,user,faculties})
        })
	}
	else{
		res.redirect('/login')
	}
});
router.get('/notification',notificationController.index);
router.get('/detail', notificationController.detail);

router.get('/add_user', async function(req, res, next) {
	let msg = req.flash('msg') || '';
	let title = "Tạo tài khoản";
	if(req.cookies.username){
		let faculties = await facultyModels.find();
		await accountModels.findOne({username : req.cookies.username}, (err,user) => {
			res.render('add_user', {title,user , msg,faculties})
		})
	}
	else{
		res.redirect('/login')
	}
});

/*	update infomation user */
router.post('/update_user',updateUserValidator,userController.update_user);
router.post('/update_avatar',upload.single('file_name'),userController.update_avatar);

/*	update password department || admin */
router.post('/update_password',updatePasswordValidator,accountController.update_password);

/*create post */
router.post("/multiple-upload",upload.array('myfile',10),(req,res) => {
	res.send("OK");
});
router.post('/create_post', postController.create_post)
router.delete('/delete_post', postController.delete_post);
router.post('/get_post', postController.get_post);
router.post('/update_post', postController.update_post);

//add comment
router.post('/add_comment', postController.add_comment);
router.delete('/delete_comment', postController.delete_comment);

router.get('/test',  async (req,res) => {
	/* let post =await postModels.findOne({_id :"60741426247abd24c0d3b33a"})
			.populate({
				path:"user",
				populate:{path:"faculty"}
			});

	res.send(post.user.faculty); */
});

//get more post
router.post('/get_more_post', postController.get_more_post);

//get dashboard page
router.get('/dashboard', async function(req,res,next){
	let msgSuccess = req.flash('msgSuccess') || '' ;
	let msgError = req.flash('msgError') || '' ;
	if(req.cookies.username){
		let user = await accountModels.findOne({username : req.cookies.username}).populate('arrFaculty').populate('arrNoti');
		res.render('dashboard', {user,msgSuccess,msgError})
	}
	else{
		res.redirect('/login')
	}
})
//create noti
router.post('/create_noti',notiValidator,notificationController.create_noti);

//delete noti
router.delete('/delete_noti', notificationController.delete_noti);
//get noti
router.post('/get_noti',notificationController.get_noti);
//update noti
router.post('/update_noti', notificationController.update_noti);
router.get('/404', (req,res) => {
	res.render('404');
})
router.get('/500', (req,res) => {
	res.render('500');
})
router.get('/auth/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login', failureFlash : 'Vui lòng chọn mail sinh viên'}), (req, res) => {
	res.redirect('/')
});

module.exports = router;

