
// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({
//     storage,
//     limits: { fileSize: 60 * 1024 * 1024 },     // limit
// });

// export default upload;

// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

const multer = require("multer");
const path = require("path");

const storage  = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,    // 100MB limit
    },
});

module.exports = upload;