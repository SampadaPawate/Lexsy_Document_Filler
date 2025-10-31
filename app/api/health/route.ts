import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  try {
    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY is not set in environment variables',
        message: 'Please add GEMINI_API_KEY to Vercel environment variables',
      }, { status: 500 });
    }

    // Test Gemini API connection
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent('Say "API is working!" in exactly 3 words.');
      const response = result.response.text();

      return NextResponse.json({
        success: true,
        message: 'All systems operational',
        apiKeyPresent: true,
        apiKeyLength: apiKey.length,
        geminiResponse: response,
        timestamp: new Date().toISOString(),
      });
    } catch (geminiError: any) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API test failed',
        details: geminiError.message,
        apiKeyPresent: true,
        apiKeyLength: apiKey.length,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      details: error.message,
    }, { status: 500 });
  }
}

