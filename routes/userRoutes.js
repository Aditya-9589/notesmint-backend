
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getMyPurchases } = require("../controllers/userController");

router.get("/my-purchases", protect, getMyPurchases);

module.exports = router;