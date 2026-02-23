
import express from "express";
import upload from "../middleware/uploadMiddleware";
import cloudinary from "../config/cloudinary";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload_stream(
            {
                folder: "notesmint",
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }

                res.json({
                    message: "File uploaded successfully",
                    url: result.secure_url,
                });
            }
        );

        result.end(req.file.buffer);
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;