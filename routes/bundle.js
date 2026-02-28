
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    getBundles,
    createBundle,
    updateBundle,
    patchBundle,
    deleteBundle,
} = require("../controllers/bundleController");


// used for testing bundle upload 
// router.get("/test", (req, res) => {
//     res.send("Bundle route working");
// });

router.get("/", getBundles);

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

router.put(
    "/:id",
    protect,
    adminOnly,
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "pdfs", maxCount: 10 },
    ]),
    updateBundle
);

router.patch("/:id", protect, adminOnly, patchBundle);

router.delete("/:id", protect, adminOnly, deleteBundle);

module.exports = router;