const util = require("util");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	filename: (req, file, cb) => {
		console.log(file)
		cb(null, file.originalname )
	}
});
 

let uploadManyFiles = multer({storage: storage}).array("uploadedImages", 10);
let multipleUploadMiddleware = util.promisify(uploadManyFiles);
module.exports = multipleUploadMiddleware;