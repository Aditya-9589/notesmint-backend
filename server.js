const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
