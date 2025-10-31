// Quick test to verify Gemini API is working
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  console.log('Testing Gemini API...');
  console.log('API Key present:', !!process.env.GEMINI_API_KEY);
  console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('\nSending test prompt...');
    const result = await model.generateContent('Say hello in one sentence');
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ SUCCESS! Gemini responded:');
    console.log(text);
    console.log('\nYour Gemini API is working correctly!');
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n🔧 FIX: Your API key is invalid. Get a new one at:');
      console.log('https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.log('\n🔧 FIX: You hit the rate limit. Wait a minute and try again.');
    } else {
      console.log('\n🔧 FIX: Check your internet connection and API key.');
    }
  }
}

testGemini();

