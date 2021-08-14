const userModels =  require('../models/user');
const accountModels = require('../models/account')
const facultyModels = require('../models/faculty');
const commentModels = require('../models/comment');
const imageModels = require('../models/image');
const fs = require('fs');
const {validationResult} = require('express-validator'); 

exports.update_user = async (req,res) => {
    let {name,classcode,faculty} = req.body;
    let result = validationResult(req);
    if(result.errors.length === 0) {
        //trim faculty id -> remove space 
        let fac = await facultyModels.findOne({_id :faculty.trim()});
        await userModels.findByIdAndUpdate(req.cookies.idGmail, {
            activeProfile: "1",
            name : name,
            classcode : classcode,
            faculty : fac
        }, { new: true },(err,data) => {
            if(err){
                req.flash('msgError', err);
            }else{
                req.flash('msgSuccess', "Cập nhật thành công")
            }
        })
        //update comment username
        await commentModels.updateMany({'userID':req.cookies.idGmail}, {"$set":{"username": name}});
        res.redirect('/profile');
        
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

exports.update_avatar= async (req,res) =>{
    const file = req.file
    
    let {image_name,action} = req.body;
    
    /* const image = new imageModels({
        img:{
            data: fs.readFileSync("public/images/"+image_name),
            contentType: "image/png"
        }, 
        link: "images/"+image_name
    })
    image.save();
    let link = image._id.toString(); */
    
    let link = "images/"+image_name;
    //update in user
    if(action === "student"){
        await userModels.findByIdAndUpdate(req.cookies.idGmail, {
            img : link
        }, { new: true },(err,data) => {
            if(err){
                console.log(err)
                req.flash('msgError', err);
            }else{
                req.flash('msgSuccess', "Cập nhật ảnh đại diện thành công")
            }
            
        })

        //update img comment
        await commentModels.updateMany({'userID':req.cookies.idGmail}, {"$set":{"img": link}});
        res.redirect('/profile');
    }else{
        let accountID ;
        await accountModels.findOneAndUpdate({username: req.cookies.username}, {
            img : link
        }, { new: true },(err,data) => {
            if(err){
                console.log(err)
                req.flash('msgError', err);
            }else{
                accountID = data._id;
                req.flash('msgSuccess', "Cập nhật ảnh đại diện thành công")
            }
            
        })

        await commentModels.updateMany({'userID':accountID}, {"$set":{"img": link}});
        res.redirect('/profile');
    }
   
}