import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // For MVP, generate a mock URL
    // In production, integrate with Vercel Blob: https://vercel.com/docs/storage/vercel-blob
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const mockUrl = `/uploads/${fileName}`;

    // TODO: Replace with Vercel Blob upload
    // const blob = await put(fileName, file, { access: 'public' });
    // return NextResponse.json({ url: blob.url });

    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
