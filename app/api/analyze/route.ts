import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import PizZip from 'pizzip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
    }

    // Read the document
    const filePath = join(process.cwd(), 'public', 'uploads', `${documentId}.docx`);
    const buffer = await readFile(filePath);
    
    const zip = new PizZip(buffer);
    const documentXml = zip.file('word/document.xml');
    
    if (!documentXml) {
      return NextResponse.json({ error: 'Could not read document' }, { status: 500 });
    }

    let xmlContent = documentXml.asText();
    
    // Extract all text from the document
    const textContent = xmlContent
      .replace(/<w:t[^>]*>/g, '')
      .replace(/<\/w:t>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Find all potential placeholders with different patterns
    const patterns = {
      brackets: /\[([^\]]+)\]/g,
      quotes: /"([^"]+)"/g,
      doubleBraces: /\{\{([^\}]+)\}\}/g,
      underscores: /_{3,}/g,
    };

    const found: any = {};
    
    Object.entries(patterns).forEach(([name, regex]) => {
      const matches = [...textContent.matchAll(regex)];
      found[name] = matches.map(m => m[0]);
    });

    // Also show a sample of the raw text
    const textSample = textContent.substring(0, 500);

    return NextResponse.json({
      success: true,
      analysis: {
        totalTextLength: textContent.length,
        textSample,
        foundPlaceholders: found,
        totalCount: Object.values(found).flat().length,
      },
    });
  } catch (error: any) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze document', details: error.message },
      { status: 500 }
    );
  }
}

