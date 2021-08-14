//connect to mongo db
const mongoose = require('mongoose');
const multer = require("multer");

//create database
var url = "mongodb+srv://quocsanh:sanhnhonhoi@chatapp.w3ioz.mongodb.net/final_web";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('Connect DB !'))
    .catch((err) => console.log(err));


mongoose.set('useFindAndModify', false);
/* const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
});
     
const upload = multer({ storage: storage }); */