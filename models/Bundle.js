
const mongoose = require("mongoose");

const bundleSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnailUrl: {
            type: String, 
            required: true,
        },
        pdfs: [
            {
                title: { type: String, required: true },
                pdfUrl: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bundle", bundleSchema);