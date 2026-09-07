const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const getClient = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials are not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey }
  });
};

const getPublicBaseUrl = () => {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error('R2_PUBLIC_BASE_URL is not configured');
  }
  return baseUrl.replace(/\/$/, '');
};

const uploadScheduleFile = async ({ key, buffer, contentType }) => {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error('R2_BUCKET_NAME is not configured');

  const client = getClient();
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=3600'
  }));

  return `${getPublicBaseUrl()}/${encodeURI(key)}`;
};

const deleteScheduleFile = async (key) => {
  if (!key) return;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error('R2_BUCKET_NAME is not configured');

  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

module.exports = { uploadScheduleFile, deleteScheduleFile };
