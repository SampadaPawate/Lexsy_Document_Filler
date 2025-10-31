// List available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  console.log('Checking available models...\n');
  console.log('API Key:', process.env.GEMINI_API_KEY?.substring(0, 20) + '...');
  
  try {
    // Try direct API call
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', response.status, response.statusText);
      console.error('Details:', errorText);
      
      if (response.status === 400) {
        console.log('\n🔧 Your API key might not be enabled yet.');
        console.log('Go to: https://aistudio.google.com/app/apikey');
        console.log('1. Delete the old key');
        console.log('2. Create a new API key');
        console.log('3. Update your .env.local file');
      }
      return;
    }
    
    const data = await response.json();
    console.log('\n✅ Available models:');
    if (data.models && Array.isArray(data.models)) {
      data.models.forEach(model => {
        console.log(`  - ${model.name}`);
      });
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();

