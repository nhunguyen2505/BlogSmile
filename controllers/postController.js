const userModels =  require('../models/user');
const accountModels = require('../models/account');
const postModels = require('../models/post')
const commentModels = require('../models/comment');
const socket = require('../app'); //import socket  from app.js
exports.create_post = async ( req,res) => {
    let data = req.body;
    let user = await userModels.findById(req.cookies.idGmail);

    let post = new postModels({
        data : data,
        user : user
    })
    post.save()
    .then(post => {
        user.arrPost.push(post);
        user.save();
        res.json(post);
    })
    .catch(err => console.log(err));
	
	//emit socket io
    socket.ioObject.to("_room" + req.body.id).emit("createPost",post);
}

exports.delete_post = async (req, res) => {
    let postId = req.body.id;
    console.log(postId);
    let post = await postModels.findById(postId);
    //get arrComment id
    let arrComment = post.comments ;
    await postModels.deleteOne({_id: postId})
    
    //remove all comments in post
    await commentModels.deleteMany({_id: arrComment})
    res.send("Deleted");
}

exports.get_post = async (req,res) => {
    let postId = req.body.id;

    let post = await postModels.findById(postId);

    res.json(post)
}

exports.update_post = async (req,res) => {
    let postId = req.body.id
    let dataForClent = req.body.data
    console.log(req.body);
    let post = await postModels.findById(postId);
    post.data = [];
    dataForClent.forEach(d => {
        post.data.push(d)
    })
    post.save()
    .then(post =>{
        console.log(post);
        res.json(post)
    })
    .catch(err=> console.log(err))

}

exports.add_comment = async (req,res)=>{
    
    let {userID,commentDetail,postId, optionComment} = req.body;
    let error =[];
    let post = await postModels.findById(postId, (err, post)=>{
        // neu khong lay duoc post => send res err
        if(err){
            error.push(err);
        }
    });
    let user ;
    if(optionComment === "teacher"){
        user = await accountModels.findById(userID, (err, user)=>{
            if(err){
                error.push(err);
            }
        })
    }else{
        user = await userModels.findById(userID, (err, user)=>{
            if(err){
                error.push(err);
            }
        });
    }
    
    if(error.length > 0){
        res.send("error");
    }else{
        let comment = new commentModels({
            userID: userID,
            username : user.name,
            img:user.img,
            commentDetail: commentDetail,
            postId : postId,
        });
        comment.save()
        .then(comment => {
            // add comment id to postId
            post.comments.push(comment)
            post.save();
            user.save();
            
            //emit socket io
			socket.ioObject.to("_room" + req.body.id).emit("newComment",{comment:comment});

            res.json(comment)
        })
        .catch(err => {
            console.log(err)
            res.send("error");
        });
    }
    
}

exports.delete_comment = async (req,res) => {
   
    //comment id
    let {commendID} = req.body;
    
    //get postId 
    let comment = await commentModels.findById(commendID);
    let postId = comment.postId;

    //delete comment
    await commentModels.findByIdAndDelete(commendID);

    // remove comments array in post
    let post = await  postModels.findById(postId);
    post.comments.pull(commendID);
    post.save();

    //emit socket io
    socket.ioObject.to("_room" + req.body.id).emit("deleteComment",
    {
        postId:postId,
        commentId: commendID
    });

    res.send(postId);

}

exports.get_more_post = async (req,res) => {
    let skip = req.body.skip;
    let profileId = req.body.profileId;

    //let user info
    let user;
    if(req.cookies.idGmail){
        //get user
		user = await userModels.findById(req.cookies.idGmail)
        .populate('faculty').populate('arrPost');
    }else{
        user = await accountModels.findOne({username:req.cookies.username })
    }

    // let post 
    // check profildID
    let postId = [];
    let posts;
    if(profileId !== "all"){
        // let list post of profile
        let another = await userModels.findById(profileId)
					.populate('faculty').populate('arrPost');
		
		another.arrPost.forEach(p => {
			postId.push(p._id);
		})
		
		posts = await postModels.find().where('_id').in(postId).sort({'createdAt':-1}).populate('user').populate('comments')
                .limit(10).skip(parseInt(skip));
    }else{
        //nothing
        posts = await postModels.find().sort({'createdAt':-1}).populate('user').populate('comments').limit(10).skip(parseInt(skip));
    }
    
    if(posts.length == 0){
        res.json("nodata");
    }else{
        let data = {
            'posts': posts,
            'user': user
        }
        res.json(data);
    }
}