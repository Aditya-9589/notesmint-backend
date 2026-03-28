
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        // check if Authorization header exits 
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Textract token from header 
            token = req.headers.authorization.split(" ")[1];

            // verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (without password) 
            // req.user = await User.findById(decoded.id).select("-password");

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            // next();

            re.user = user;
            return next();

        }
        // }   else {
        //     res.status(401).json({ message: "Not authorized, no token" });
        // }

        return res.status(401).json({ message: "Not authorized, no token" });

    }   catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};


const adminOnly = (req, res, next) => {
    // if (req.user && req.user.role === "admin") {
    //     next();
    // }   else {
    //     res.status(403).json({ message: "Admin access only" });
    // }

    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({ message: "Admin access only" });
};


module.exports = { protect, adminOnly };