
const  { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const generateSignedUrl = async (key) => {

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 300,     // 5 minutes
    });

    return signedUrl;
}

module.exports = generateSignedUrl;