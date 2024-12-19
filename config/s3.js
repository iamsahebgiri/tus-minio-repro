const {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} = require("@aws-sdk/client-s3");

const s3ClientConfig = {
  endpoint: process.env.MINIO_END_POINT,
  region: process.env.MINIO_REGION,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
  tls: process.env.MINIO_USE_SSL,
};

const s3Client = new S3Client(s3ClientConfig);

const initializeBuckets = async () => {
  const buckets = [process.env.UPLOAD_BUCKET, process.env.PROCESSED_BUCKET];

  for (const bucket of buckets) {
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
      console.log(`Bucket "${bucket}" already exists.`);
    } catch (err) {
      if (err.name === "NotFound") {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
        console.log(`Bucket "${bucket}" created successfully.`);
      } else {
        console.error(`Error checking or creating bucket "${bucket}":`, err);
        throw err;
      }
    }
  }
};

module.exports = { s3ClientConfig, s3Client, initializeBuckets };
