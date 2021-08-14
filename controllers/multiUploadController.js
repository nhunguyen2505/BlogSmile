const multipleUploadMiddleware = require("../middlewares/multerUploadMiddleware");

let multipleUpload = async (req, res) => {
    console.log(req)
    await multipleUploadMiddleware(req, res);
};

module.exports = {
    multipleUpload: multipleUpload
};
