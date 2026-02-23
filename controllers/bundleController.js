
const Bundle = require("../models/Bundle");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// temp testing 
        // console.log("BODY: 1", req.body);
        // console.log("FILES: 1", req.files);

// ADMIN: Create Bundle 
exports.createBundle = async (req, res) => {

    // temp testing 
        // console.log("BODY: 2", req.body);
        // console.log("FILES: 2", req.files);


    try {
        const { title, description, price } = req.body;

        // Upload thumbnail
        const thumbnailResult = await cloudinary.uploader.upload(
            req.files.thumbnail[0].path,
            { folder: "notesmint/thumbnail" }
        );

        // Upload PDFs 
        const uploadedPDFs = [];

        for (let file of req.files.pdfs) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "notesmint/pdfs",
                resource_type: "auto",
            });

            uploadedPDFs.push({
                title: file.originalname,
                pdfUrl: result.secure_url,
            });

            fs.unlinkSync(file.path);   // delete temp
        }

        fs.unlinkSync(req.files.thumbnail[0].path);

        const bundle = await Bundle.create({
            title,
            description,
            price,
            thumbnailUrl: thumbnailResult.secure_url,
            pdfs: uploadedPDFs
        });

        res.status(201).json(bundle);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUBLIC: Get all bundles
exports.getBundles = async (req, res) => {
    const bundles = await Bundle.find();
    res.json(bundles);
}