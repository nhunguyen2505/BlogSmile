const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userID :  String,
    username : String,
    img : String,
    commentDetail: String,
    postId : {type: Schema.Types.ObjectId, ref: 'Post'},
    time: {type: Date , default: Date.now()}
},{timestamps:true});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;