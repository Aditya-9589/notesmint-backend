
const razorpay = require("../config/razorpay");
const User = require("../models/User");

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

exports.verifyPayment = async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bundleId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.envRAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment" });
    }

    const user = await User.findById(req.user.id);

    if (!user.purchasedBundles.includes(bundleId)) {
        user.purchasedBundles.push(bundleId);
        await user.save();
    }

    res.json({ success: true, message: "Payment verified" });

};