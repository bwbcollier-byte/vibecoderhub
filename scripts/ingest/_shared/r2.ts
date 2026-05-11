// Cloudflare R2 uploader for raw-dump audit trail (per data-sourcing spec §19).
// Skips silently if R2 env not configured — keeps local dev frictionless.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getEnv } from './env';

let cached: { client: S3Client; bucket: string } | null = null;

function getClient() {
  if (cached) return cached;
  const accountId = getEnv('R2_ACCOUNT_ID');
  const accessKeyId = getEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = getEnv('R2_SECRET_ACCESS_KEY');
  const bucket = getEnv('R2_BUCKET_NAME');
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  cached = {
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
    bucket,
  };
  return cached;
}

// Key pattern: ingest/<source>/<YYYY-MM-DD>/<runId>.json
export function buildR2Key(sourceSlug: string, runId: string, ext = 'json') {
  const day = new Date().toISOString().slice(0, 10);
  return `ingest/${sourceSlug}/${day}/${runId}.${ext}`;
}

export async function uploadRawDump(
  key: string,
  body: string | Uint8Array,
  contentType = 'application/json',
): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  await c.client.send(
    new PutObjectCommand({
      Bucket: c.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return key;
}
