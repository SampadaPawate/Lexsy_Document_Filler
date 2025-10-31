import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { generateDocument } from '@/lib/documentGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, filledPlaceholders, placeholders } = body;

    console.log('[Generate API] Request received');
    console.log('[Generate API] Document ID:', documentId);
    console.log('[Generate API] Filled placeholders:', JSON.stringify(filledPlaceholders, null, 2));
    console.log('[Generate API] Original placeholders:', placeholders?.map((p: any) => p.original).join(', '));

    if (!documentId || !filledPlaceholders) {
      return NextResponse.json(
        { error: 'Missing documentId or filledPlaceholders' },
        { status: 400 }
      );
    }

    // Read original document
    const filePath = join(process.cwd(), 'public', 'uploads', `${documentId}.docx`);
    console.log('[Generate API] Reading original from:', filePath);
    const buffer = await readFile(filePath);
    console.log('[Generate API] Original file size:', buffer.length);

    // Generate filled document with original placeholder info
    console.log('[Generate API] Calling document generator...');
    const filledBuffer = await generateDocument(buffer, filledPlaceholders, placeholders || []);
    console.log('[Generate API] Generated file size:', filledBuffer.length);

    // Save filled document
    const outputPath = join(process.cwd(), 'public', 'uploads', `${documentId}-filled.docx`);
    await require('fs/promises').writeFile(outputPath, filledBuffer);
    console.log('[Generate API] Saved to:', outputPath);

    // Return download URL
    return NextResponse.json({
      success: true,
      downloadUrl: `/api/download/${documentId}`,
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

