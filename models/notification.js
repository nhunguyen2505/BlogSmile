const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const notiSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    notiTitle : String,
    notiDetail : String,
    faculty : {type: Schema.Types.ObjectId, ref: 'Faculty'},
    time: {type: Date , default: Date.now()}
});


const Notification = mongoose.model('Notification', notiSchema);

module.exports = Notification;