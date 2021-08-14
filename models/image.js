const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const imageSchema = new Schema({
    img:{
        data: Buffer,
        contentType: String
    },
    link: String
})

const Image = mongoose.model('image',imageSchema);


module.exports = Image;