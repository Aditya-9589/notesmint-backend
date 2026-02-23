

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
// const pdfRoutes = require("./routes/pdf");

const bundleRoutes = require("./routes/bundle");


const app  = express();

// middleware 
app.use(cors());
app.use(express.json());


// connect Database 
connectDB();


// Test Route 
app.get("/", (req, res) => {
    res.send("NotesMint API Running ");
});

// User registration and Login :-
app.use("/api/auth", authRoutes);

// pdf uploading
// app.use("/api/pdfs", pdfRoutes);
app.use("/api/bundles", bundleRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
