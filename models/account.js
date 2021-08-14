const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username : String,
    password: String,
    name: String,
    img: {type:String, default: "images/avatar_default.png"},
    role: String,
    arrFaculty:[
        {type: Schema.Types.ObjectId , ref: 'Faculty'}
    ],
    arrNoti : [{type: Schema.Types.ObjectId , ref: 'Notification'}]
});


const account =  mongoose.model('account', accountSchema);

module.exports = account;
