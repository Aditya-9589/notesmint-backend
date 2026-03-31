
const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");

exports.handleRazorpayWebhook = async (req, res) => {
    try {

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const signature = req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(req.body)   // raw body
            .digest("hex");

        if (signature !== expectedSignature) {
            console.log("Invalid webhook signature");
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = JSON.parse(req.body.toString());

        console.log("Webhook Event: ", event.event);

        // Handle payment success 
        if (event.event === "payment.captured") {
            const paymentData = event.payment.entity;

            const orderId = paymentData.order_id;
            const paymentId = paymentData.id;

            const payment = await Payment.findOne({ orderId });

            if (!payment) {
                console.log("Payment not found in DB");
                return res.status(404).json({ message: "Payment not found" });
            }

            // update payment 
            payment.status = "success";
            payment.paymentId = paymentId;
            await payment.save();

            // Grant access 
            const user = await User.findById(payment.userId);

            if (!user.purchasedBundles.includes(payment.userId)) {
                user.purchasedBundles.push(payment.bundleId);
                await user.save();
            }

            console.log("Payment processed via webhook");
        }

        res.json({ status: "ok" });

    }   catch (error) {
        console.log("WEBHOOK ERROR: ", error);
        res.status(500).json({ message: "Webhook error" });
    }
};