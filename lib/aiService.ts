import { GoogleGenerativeAI } from '@google/generative-ai';
import { Placeholder } from './documentParser';

let genAI: GoogleGenerativeAI | null = null;

function getGemini() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }
  return genAI;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationState {
  messages: ChatMessage[];
  filledPlaceholders: Record<string, string>;
  currentPlaceholderIndex: number;
}

/**
 * Generates a system prompt for the AI assistant
 */
function generateSystemPrompt(
  placeholders: Placeholder[],
  filledPlaceholders: Record<string, string>
): string {
  const remainingPlaceholders = placeholders.filter(
    p => !filledPlaceholders[p.key]
  );

  return `You are a helpful legal document assistant helping to fill out a SAFE (Simple Agreement for Future Equity) agreement.

YOUR TASK:
1. Ask for ONE placeholder value at a time
2. Be conversational, clear, and professional
3. Validate the format of responses (dates, currency amounts, names)
4. Extract the value from the user's response
5. Move to the next placeholder

PLACEHOLDERS TO FILL (${remainingPlaceholders.length} remaining):
${JSON.stringify(remainingPlaceholders, null, 2)}

ALREADY FILLED (${Object.keys(filledPlaceholders).length}):
${JSON.stringify(filledPlaceholders, null, 2)}

RESPONSE FORMAT:
- Keep responses concise and friendly
- Ask clear questions
- Provide examples when helpful (e.g., "Please enter the date in MM/DD/YYYY format")
- After user provides a value, acknowledge it and move to the next field
- When all fields are filled, ask for final confirmation

IMPORTANT:
- Extract values accurately from user responses
- If user provides unclear input, ask for clarification
- Be helpful but efficient`;
}

/**
 * Processes a chat message and returns AI response
 */
export async function processChatMessage(
  userMessage: string,
  placeholders: Placeholder[],
  conversationState: ConversationState
): Promise<{ response: string; updatedState: ConversationState }> {
  const { messages, filledPlaceholders, currentPlaceholderIndex } = conversationState;

  // Build messages array for OpenAI
  const systemPrompt = generateSystemPrompt(placeholders, filledPlaceholders);
  const chatMessages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages,
    { role: 'user', content: userMessage },
  ];

  // Call Gemini API
  let assistantResponse = '';
  
  try {
    console.log('[AI Service] Calling Gemini API...');
    console.log('[AI Service] API Key present:', !!process.env.GEMINI_API_KEY);
    
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    // Simple, direct prompt
    const currentPlaceholder = placeholders[currentPlaceholderIndex];
    const nextPlaceholder = placeholders[currentPlaceholderIndex + 1];
    
    let prompt = '';
    if (currentPlaceholder) {
      prompt = `The user just provided: "${userMessage}"

This answers the field: ${currentPlaceholder.description}

Acknowledge their answer briefly and ${nextPlaceholder ? `ask for the next field: "${nextPlaceholder.description}". Be specific about what you need.` : 'let them know all fields are complete!'}

Keep your response short and friendly.`;
    } else {
      prompt = `All fields are filled! Thank them and let them know they can generate the document.`;
    }

    console.log('[AI Service] Sending prompt for field', currentPlaceholderIndex + 1, 'of', placeholders.length);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    assistantResponse = response.text() || 'I understand. Let me help you with the next field.';
    
    console.log('[AI Service] Got response:', assistantResponse.substring(0, 100) + '...');
  } catch (error: any) {
    console.error('[AI Service] Gemini API error:', error);
    console.error('[AI Service] Full error:', error);
    
    // Fallback response instead of crashing
    assistantResponse = `Got it! I've recorded your answer. Let me continue...`;
  }

  // Extract value from user message - SIMPLIFIED
  let newFilledPlaceholders = { ...filledPlaceholders };
  let newIndex = currentPlaceholderIndex;

  // If we have a current placeholder and user provided a non-empty message
  if (placeholders[currentPlaceholderIndex] && userMessage.trim().length > 0) {
    const currentPlaceholder = placeholders[currentPlaceholderIndex];
    
    // Use the user's message as the value
    newFilledPlaceholders[currentPlaceholder.key] = userMessage.trim();
    newIndex = currentPlaceholderIndex + 1;
    
    console.log(`[AI Service] Captured value for ${currentPlaceholder.key}: "${userMessage.trim()}"`);
    console.log(`[AI Service] Moving to placeholder ${newIndex} of ${placeholders.length}`);
  }

  // Update conversation state
  const updatedState: ConversationState = {
    messages: [
      ...messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantResponse },
    ],
    filledPlaceholders: newFilledPlaceholders,
    currentPlaceholderIndex: newIndex,
  };

  return {
    response: assistantResponse,
    updatedState,
  };
}

/**
 * Extracts a placeholder value from user message
 */
async function extractPlaceholderValue(
  userMessage: string,
  placeholder: Placeholder | undefined,
  aiResponse: string
): Promise<string | null> {
  if (!placeholder) return null;

  // Simple extraction: if the user message looks like a direct answer, use it
  const trimmed = userMessage.trim();
  
  // If AI response indicates acceptance, extract the value
  if (aiResponse.toLowerCase().includes('got it') || 
      aiResponse.toLowerCase().includes('perfect') ||
      aiResponse.toLowerCase().includes('great') ||
      aiResponse.toLowerCase().includes('thank')) {
    return trimmed;
  }

  return null;
}

/**
 * Generates the initial greeting message
 */
export function generateInitialMessage(placeholders: Placeholder[]): string {
  if (placeholders.length === 0) {
    return "I couldn't find any placeholders in this document. Please upload a document with fields to fill.";
  }

  const firstPlaceholder = placeholders[0];
  
  return `Great! I've analyzed your SAFE agreement and found ${placeholders.length} fields that need to be filled in.

Let's start with the first one: **${firstPlaceholder.description}**

Please provide the ${firstPlaceholder.description.toLowerCase()}.`;
}

/**
 * Improves placeholder detection using AI
 */
export async function enhancePlaceholders(
  documentText: string,
  initialPlaceholders: Placeholder[]
): Promise<Placeholder[]> {
  try {
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Analyze this legal document and identify all placeholders that need to be filled in. 
Return ONLY a JSON array of objects with keys: "key", "description", "type".
Focus on brackets like [Company Name], blank lines (______), and any obvious fill-in fields.

Document:
${documentText.substring(0, 8000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (text) {
      const parsed = JSON.parse(text);
      const aiPlaceholders = parsed.placeholders || parsed;
      
      // Merge AI-detected placeholders with regex-detected ones
      return mergeePlaceholders(initialPlaceholders, aiPlaceholders);
    }
  } catch (error) {
    console.error('AI enhancement failed, using regex placeholders:', error);
  }

  return initialPlaceholders;
}

/**
 * Merges AI-detected and regex-detected placeholders
 */
function mergeePlaceholders(initial: Placeholder[], aiDetected: any[]): Placeholder[] {
  const merged = [...initial];
  const existingKeys = new Set(initial.map(p => p.key));

  aiDetected.forEach((ai: any) => {
    if (!existingKeys.has(ai.key)) {
      merged.push({
        key: ai.key,
        description: ai.description,
        type: ai.type || 'text',
        original: `[${ai.key}]`,
        position: 999,
      });
    }
  });

  return merged;
}

