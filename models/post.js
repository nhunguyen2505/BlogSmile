const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    data :[{
        postType: String,
        postDetail : String,
    }],
    likes : {type: Number, default: 0},
    comments :[{type: Schema.Types.ObjectId, ref: 'Comment'}],
    user : {type: Schema.Types.ObjectId, ref: 'User'},
    time: {type: Date , default: Date.now()}
},{timestamps:true});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;