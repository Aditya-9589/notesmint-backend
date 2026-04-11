
const User = require("../models/User");
const user = require("../models/User");

exports.getMyPurchases = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("purchasedBundles");

        res.status(200).json({
            success: true,
            bundles: user.purchasedBundles,
        });

    }   catch (error) {
        console.log("MY PURCHASES ERROR: ", error);
        res.status(500).json({
            message: "Server Error",
        })
    }
}