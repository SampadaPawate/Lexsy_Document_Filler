import { NextRequest, NextResponse } from 'next/server';
import { readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generateDocument } from '@/lib/documentGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, filledPlaceholders, placeholders, templateBase64 } = body;

    console.log('[Generate API] Request received');
    console.log('[Generate API] Document ID:', documentId);
    console.log('[Generate API] Filled placeholders:', JSON.stringify(filledPlaceholders, null, 2));
    console.log('[Generate API] Original placeholders:', placeholders?.map((p: any) => p.original).join(', '));
    console.log('[Generate API] templateBase64 present:', !!templateBase64, 'len:', templateBase64?.length || 0);

    if (!documentId || !filledPlaceholders) {
      return NextResponse.json(
        { error: 'Missing documentId or filledPlaceholders' },
        { status: 400 }
      );
    }

    // Get original template buffer
    let buffer: Buffer;
    if (templateBase64 && typeof templateBase64 === 'string') {
      console.log('[Generate API] Using template from request (base64)');
      buffer = Buffer.from(templateBase64, 'base64');
    } else {
      // Fallback to /tmp (same instance) - best effort only
      const filePath = join('/tmp', 'uploads', `${documentId}.docx`);
      console.log('[Generate API] Reading original from:', filePath);
      buffer = await readFile(filePath);
    }
    console.log('[Generate API] Original file size:', buffer.length);

    // Generate filled document with original placeholder info
    console.log('[Generate API] Calling document generator...');
    const filledBuffer = await generateDocument(buffer, filledPlaceholders, placeholders || []);
    console.log('[Generate API] Generated file size:', filledBuffer.length);

    // Ensure /tmp/uploads exists (functions may run on different instances)
    const outDir = join('/tmp', 'uploads');
    try {
      await mkdir(outDir, { recursive: true });
    } catch {}

    // Save filled document to /tmp
    const outputPath = join(outDir, `${documentId}-filled.docx`);
    await require('fs/promises').writeFile(outputPath, filledBuffer);
    console.log('[Generate API] Saved to:', outputPath);

    // Return download URL and base64 inline for client-side download fallback
    const filledBase64 = filledBuffer.toString('base64');
    return NextResponse.json({
      success: true,
      downloadUrl: `/api/download/${documentId}`,
      filledBase64,
      fileName: 'completed-document.docx',
    });
  } catch (error: any) {
    console.error('[Generate API] Error:', error);
    console.error('[Generate API] Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to generate document', details: error.message },
      { status: 500 }
    );
  }
}

