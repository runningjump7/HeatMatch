import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file in formData');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Upload request:', { fileName: file.name, size: file.size, type: file.type, hasBlobStoreId: !!process.env.BLOB_STORE_ID });

    // Try to upload to Vercel Blob (auto-authenticates on Vercel)
    // On local dev without BLOB_STORE_ID, fall back to base64
    if (!process.env.BLOB_STORE_ID) {
      console.log('No BLOB_STORE_ID, using base64 fallback');
      // Fallback for local development: convert file to base64 data URL
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({ url: dataUrl });
    }

    // Upload to Vercel Blob
    console.log('Attempting Vercel Blob upload');
    const timestamp = Date.now();
    const blobName = `leads/${timestamp}-${file.name}`;

    let blob;
    try {
      // Convert File to Buffer for upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      blob = await put(blobName, buffer, {
        access: 'public',
        contentType: file.type || 'image/jpeg',
      });
      console.log('Blob upload successful:', { url: blob.url });
    } catch (blobError) {
      const blobErrorMsg = blobError instanceof Error ? blobError.message : String(blobError);
      console.error('Vercel Blob upload failed:', blobErrorMsg, blobError);
      // On production, if Blob fails, return an error (don't use huge base64 URLs)
      return NextResponse.json(
        {
          error: 'Photo upload failed',
          details: `Cloud storage error: ${blobErrorMsg}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: 'Failed to upload photo',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
