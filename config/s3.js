
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});


// Debugging consoles, later to be removed 
// console.log("AWS_REGION:", process.env.AWS_REGION);
// console.log("AWS_ACCESS_KEY:", process.env.AWS_ACCESS_KEY);
// console.log("AWS_SECRET_KEY:", process.env.AWS_SECRET_KEY ? "Present" : "Missing");



const uploadToS3 = async (file) => {

    const fileContent = fs.readFileSync(file.path);

    const key = `notesmint/pdfs/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: fileContent,
        ContentType: file.mimetype,
    });

    // const command = new PutObjectCommand({
    // Bucket: process.env.AWS_BUCKET,
    // Key: key,
    // Body: fileContent,
    // ContentType: file.mimetype,
    // ACL: "public-read", //   ADD THIS
// });

    await s3.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { fileUrl, key };
}

module.exports = uploadToS3;