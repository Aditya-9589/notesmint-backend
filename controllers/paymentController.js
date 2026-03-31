
const razorpay = require("../config/razorpay");
const User = require("../models/User");
const Bundle = require("../models/Bundle");
const crypto = require("crypto");
const Payment = require("../models/Payment");


exports.createOrder = async (req, res) => {

    try {
        // const { bundleId, amount } = req.body;

        // const options = {
        //     amount: amount * 100,
        //     currency: "INR",
        //     // receipt: `receipt_${bundleId}_${Date.now()}`
        //     receipt: `receipt_${Date.now()}`
        // };

        const { bundleId } = req.body;

        // Fetch bundle from DB :-
        const bundle = await Bundle.findById(bundleId);

        if (!bundle) {
            return res.status(404).json({ message: "Bundle not found" });
        }

        // Use price from DB (secure) 
        const options = {
            amount: bundle.price * 100,
            currency: "INR",
            receipt: `order_${Date.now()}`,
        }

        // const order = await razorpay.orders.create(options);

        // STORE PAYMENT 
        await Payment.create({
            userId: req.user.id,
            bundleId,
            orderId: order.id,
            amount: bundle.price,
            status: "created",
        });

        res.json({
            success: true,
            order,
        });

    } catch (error) {
        console.log("CREATE ORDER ERROR:", error);      // IMPORTANT

        return res.status(400).json({
            message: error.message,
            error
        });
    }
};

// const { bundleId, amount } = req.body;

// const options = {
//     amount: amount * 100,   // in paise
//     currency: "INR",
//     receipt: `receipt_${bundleId}_${Date.now()}`
// };

// const order = await razorpay.orders.create(options);

// res.json({
//     success: true,
//     order,
// });


exports.verifyPayment = async (req, res) => {

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bundleId,
        } = req.body;

        // Step 1: Verify Signature 
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment" });
        }

        // ----------------------------------------------------------------------------------------------------
        // OLD CODE :-

        // const user = await User.findById(req.user.id);
        // if (!user.purchasedBundles.includes(bundleId)) {
        //     user.purchasedBundles.push(bundleId);
        //     await user.save();
        // }
        // res.json({ success: true, message: "Payment verified" });
        // -----------------------------------------------------------------------------------------------------

        // Step 2 : Find Payment in DB 
        const payment = await Payment.findOne({
            orderid: razorpay_order_id,
        });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Step 3: Update Payment 
        payment.paymentId = razorpay_payment_id;
        payment.status = "success";
        await payment.save();

        // Step 4: Grant Access (IDEMPOTENT) 
        const user = await User.findById(req.user.id);

        if (!user.purchasedBundles.includes(bundleId)) {
            user.purchasedBundles.push(bundleId);
            await user.save();
        }

        res.json({
            success: true,
            message: "Payment verified & access granted",
        });

    } catch (error) {
        console.log("VERIFY PAYMENT ERROR: ", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};