import { NextRequest, NextResponse } from 'next/server';
import { processChatMessage, generateInitialMessage } from '@/lib/aiService';
import { Placeholder } from '@/lib/documentParser';

export async function POST(request: NextRequest) {
  console.log('[Chat API] Request received');
  console.log('[Chat API] GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY);
  
  try {
    const body = await request.json();
    const { message, placeholders, conversationState } = body;
    
    console.log('[Chat API] Message:', message);
    console.log('[Chat API] Placeholders count:', placeholders?.length);

    if (!placeholders || !Array.isArray(placeholders)) {
      console.error('[Chat API] Invalid placeholders data');
      return NextResponse.json(
        { error: 'Invalid placeholders data' },
        { status: 400 }
      );
    }

    // If this is the first message (no conversation state), generate initial greeting
    if (!conversationState || !message) {
      const initialMessage = generateInitialMessage(placeholders);
      return NextResponse.json({
        response: initialMessage,
        conversationState: {
          messages: [
            { role: 'assistant', content: initialMessage },
          ],
          filledPlaceholders: {},
          currentPlaceholderIndex: 0,
        },
      });
    }

    // Process the chat message
    const result = await processChatMessage(
      message,
      placeholders,
      conversationState
    );

    // Ensure we have a valid response structure
    if (!result || !result.response || !result.updatedState) {
      console.error('Invalid result from processChatMessage:', result);
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: result.response,
      conversationState: result.updatedState,
    });
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════');
    console.error('❌ [Chat API] ERROR:', error);
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
        error: 'Failed to process chat message',
        details: error?.message || 'Unknown error',
        type: error?.name || 'UnknownError'
      },
      { status: 500 }
    );
  }
}

