import { NextRequest, NextResponse } from 'next/server';
import { processChatMessage, generateInitialMessage } from '@/lib/aiService';
import { Placeholder } from '@/lib/documentParser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, placeholders, conversationState } = body;

    if (!placeholders || !Array.isArray(placeholders)) {
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
    console.error('Chat error:', error);
    console.error('Error details:', error?.message || 'Unknown error');
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

