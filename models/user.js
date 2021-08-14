const mongoose = require('mongoose') 
const Schema = mongoose.Schema
const userSchema = new Schema({
    id : String,
    name: String,
    email : String,
    password: String,
    img: String,
    classcode: {type:String,default:""},
    role: String,
    activeProfile: {type: String, default : 0},
    faculty:{ type: Schema.Types.ObjectId, ref: "Faculty"},
    arrPost:[{type: Schema.Types.ObjectId, ref: "Post"}]
})

const user = mongoose.model('User', userSchema)
module.exports = user