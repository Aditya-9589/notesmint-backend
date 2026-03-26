
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const uploadToS3 = async (file) => {
    
    const fileContent = fs.readFileSync(file.path);

    const key = `notesmint/pdfs/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: fileContent,
        ContentType: file.mimetype,
    });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { fileUrl, key };
}

module.exports = uploadToS3;