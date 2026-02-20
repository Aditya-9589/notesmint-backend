const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        thumbnailUrl: {
            type: String,
            required: true,
        },
        pdfUrl: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 10,
        },
        downloadCount: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PDF", pdfSchema);