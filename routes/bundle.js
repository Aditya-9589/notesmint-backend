
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    createBundle,
    getBundles
} = require("../controllers/bundleController");

router.get("/", getBundles);


// used for testing bundle upload 
// router.get("/test", (req, res) => {
//     res.send("Bundle route working");
// });


router.post(
    "/",
    protect,
    adminOnly,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "pdfs", maCount: 10 },
    ]),

    createBundle
);

module.exports = router;