import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
import {
	PRIVATE_MINIO_ACCESS_KEY,
	PRIVATE_MINIO_BUCKET,
	PRIVATE_MINIO_ENDPOINT,
	PRIVATE_MINIO_REGION,
	PRIVATE_MINIO_SECRET_KEY
} from '$env/static/private';

const missing = [
	['PRIVATE_MINIO_ACCESS_KEY', PRIVATE_MINIO_ACCESS_KEY],
	['PRIVATE_MINIO_SECRET_KEY', PRIVATE_MINIO_SECRET_KEY],
	['PRIVATE_MINIO_BUCKET', PRIVATE_MINIO_BUCKET],
	['PRIVATE_MINIO_REGION', PRIVATE_MINIO_REGION],
	['PRIVATE_MINIO_ENDPOINT', PRIVATE_MINIO_ENDPOINT]
].filter(([, value]) => !value);

if (missing.length) {
	throw new Error(`Missing S3/MinIO configuration: ${missing.map(([key]) => key).join(', ')}`);
}

const config: S3ClientConfig = {
	region: PRIVATE_MINIO_REGION,
	endpoint: PRIVATE_MINIO_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: PRIVATE_MINIO_ACCESS_KEY,
		secretAccessKey: PRIVATE_MINIO_SECRET_KEY
	}
};

export const s3Client = new S3Client(config);
export const VIDEO_BUCKET = PRIVATE_MINIO_BUCKET;
