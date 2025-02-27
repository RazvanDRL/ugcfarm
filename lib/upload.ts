import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Initialize S3 client with Cloudflare R2 credentials
const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_AWS_SECRET_ACCESS_KEY!,
    },
});

export interface UploadResult {
    key: string;
}

export async function uploadToR2(
    file: File | Blob | Buffer,
    key: string,
    bucket: string = "upload-bucket",
    contentType?: string
): Promise<UploadResult> {
    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucket,
                Key: key,
                Body: file,
                ContentType: contentType || (file instanceof File ? file.type : 'application/octet-stream'),
            },
        });

        await upload.done();

        return {
            key: key,
        };
    } catch (error) {
        console.error('Upload failed:', error);
        throw new Error('Failed to upload file to R2');
    }
}
