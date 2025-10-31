import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  try {
    console.log('Test API called');
    console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));

    // Test Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    console.log('Sending test prompt to Gemini...');
    const result = await model.generateContent('Say "API is working!" in one sentence');
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response:', text);

    return NextResponse.json({
      success: true,
      message: 'API is working!',
      geminiResponse: text,
      apiKeyPresent: !!process.env.GEMINI_API_KEY,
    });
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
    }, { status: 500 });
  }
}

