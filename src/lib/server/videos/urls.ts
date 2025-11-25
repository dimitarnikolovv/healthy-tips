import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../storage/s3';

const DEFAULT_EXPIRATION_SECONDS = 60 * 60; // 1 hour

export async function getSignedVideoUrl(
	bucket: string,
	objectKey: string,
	expiresInSeconds = DEFAULT_EXPIRATION_SECONDS
) {
	if (!bucket) {
		throw new Error('Cannot build signed URL without a bucket name.');
	}

	if (!objectKey) {
		throw new Error('Cannot build signed URL without an object key.');
	}

	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: objectKey
	});

	return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}
