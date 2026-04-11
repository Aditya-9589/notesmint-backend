

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
// const pdfRoutes = require("./routes/pdf");
const bundleRoutes = require("./routes/bundle");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

// middleware 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// ------  OR -> Pro Version -------- 

// const allowedOrigins = [
//     process.env.FRONTEND_URL,
//     "http://localhost:5173"
// ];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true
// }));

// RAW BODY REQUIRED FOR WEBHOOK 
app.use(
    "/api/webhook",
    express.raw({ type: "application/json" })
);

app.use("/api/webhook", webhookRoutes);
app.use(express.json());


// connect Database 
connectDB();


// Test Route 
app.get("/", (req, res) => {
    res.send("NotesMint API Running ");
});

// User registration and Login :-
app.use("/api/auth", authRoutes);
// app.use("/api/auth", require("./routes/auth"));


// pdf uploading
// app.use("/api/pdfs", pdfRoutes);
app.use("/api/bundles", bundleRoutes);
// app.use("/api/bundle", bundleRoutes);


// Razorpay Payment :-
app.use("/api/payment", paymentRoutes);

// My purchases routes 
app.use("/api/user", userRoutes); 


// global error handler 
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message || "Server Error",
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
