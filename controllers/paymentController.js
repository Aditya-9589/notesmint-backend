
const razorpay = require("../config/razorpay");

exports.createOrder = async (req, res) => {
    const { bundleId, amount } = req.body;

    const options = {
        amount: amount * 100,   // in paise
        currency: "INR",
        receipt: `receipt_${bundleId}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
        success: true,
        order,
    });
};