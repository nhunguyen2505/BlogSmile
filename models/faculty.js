const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facultySchema = new Schema({
    nameFaculty: String,
    arrNoti : [{type: Schema.Types.ObjectId, ref: "Notification"}]
});

const faculty = mongoose.model('Faculty', facultySchema)
module.exports = faculty