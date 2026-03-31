
const express = require("express");
const router = express.Router();

// ####  Debugging :- ####
// console.log("Payment routes loaded");

const {
    createOrder,
    verifyPayment
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);


// Test Route :-
// router.get("/test", (req, res) => {
//     res.send("Payment route working");
// })


module.exports = router;