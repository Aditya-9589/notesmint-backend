
const express = require("express");
const router = express.Router();

const PDF =require("../models/PDF");

// GET all PDFs (public) 
router.get("/", async (req, res) => {
    try {
        const pdfs = await PDF.find();
        res.json(pdfs);
    }   catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;