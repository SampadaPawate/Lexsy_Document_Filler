import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/documentParser';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  console.log('[Upload API] Request received');
  console.log('[Upload API] Environment:', process.env.NODE_ENV);
  console.log('[Upload API] GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload API] No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('[Upload API] File received:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Validate file type
    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only .docx files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique document ID
    const documentId = randomUUID();

    // Use /tmp directory (writable on Vercel)
    const uploadsDir = join('/tmp', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Save file to /tmp (Vercel allows writing here)
    const filePath = join(uploadsDir, `${documentId}.docx`);
    await writeFile(filePath, buffer);
    console.log('[Upload API] File saved to:', filePath);

    // Parse document and extract placeholders
    console.log('[Upload API] Parsing document...');
    const parsedDocument = await parseDocument(buffer, documentId);
    console.log('[Upload API] ✅ Document parsed successfully');
    console.log('[Upload API] Found placeholders:', parsedDocument.placeholders.length);

    // Return parsed data and base64 for stateless generation
    const templateBase64 = buffer.toString('base64');
    return NextResponse.json({
      success: true,
      documentId,
      placeholders: parsedDocument.placeholders,
      fileName: file.name,
      templateBase64,
    });
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════');
    console.error('❌ [Upload API] ERROR:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('═══════════════════════════════════════════════════');
    
    // Check if it's an environment variable error
    if (error?.message?.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { 
          error: 'Missing API Configuration',
          details: 'GEMINI_API_KEY environment variable is not set. Please configure it in Vercel settings and redeploy.',
          fix: 'Go to Vercel → Settings → Environment Variables → Add GEMINI_API_KEY'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process document',
        details: error?.message || 'Unknown error',
        type: error?.name || 'UnknownError'
      },
      { status: 500 }
    );
  }
}

