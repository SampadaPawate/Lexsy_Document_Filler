# 🤖 AI Service Options

Choose between **FREE** (Gemini) or **Paid** (OpenAI) AI services.

---

## 🆓 **Option 1: Google Gemini (RECOMMENDED - FREE)**

### ✅ Advantages
- **100% FREE** - No credit card required
- **60 requests per minute** free tier
- **Good quality** responses
- **Easy setup** - 2 minutes
- **No expiration** on free tier

### 📝 Setup (2 minutes)

1. **Get API Key**: https://aistudio.google.com/app/apikey
2. **Create `.env.local`**:
   ```env
   GEMINI_API_KEY=AIzaSy-your-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. **Run**: `npm run dev`

### 💰 Cost
- **Free**: 60 requests/min
- **Paid**: $0.00025 per request (if you exceed free tier)
- **Perfect for**: Testing, demos, personal projects, small business

### 📖 Full Guide
See **GEMINI_SETUP.md** for detailed instructions.

---

## 💳 **Option 2: OpenAI GPT-4 (PAID)**

### ✅ Advantages
- **Slightly better** quality
- **More reliable** for complex tasks
- **Faster** response times
- **Better** at following instructions

### 📝 Setup

1. **Get API Key**: https://platform.openai.com/api-keys
   - Requires credit card
   - Minimum $5 credit
2. **Create `.env.local`**:
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. **Switch back to OpenAI**:
   ```bash
   npm install openai
   ```
4. **Restore OpenAI code** (see instructions below)

### 💰 Cost
- **No free tier**
- **GPT-4-mini**: ~$0.02 per document
- **GPT-4**: ~$0.10 per document
- **Perfect for**: Production apps, high volume, critical applications

---

## 📊 Comparison Table

| Feature | Gemini (FREE) | OpenAI (PAID) |
|---------|---------------|---------------|
| **Cost** | 🆓 Free | 💳 $0.02/doc |
| **Setup Time** | 2 minutes | 5 minutes |
| **Credit Card** | ❌ Not required | ✅ Required |
| **Quality** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Speed** | Fast | Faster |
| **Rate Limit** | 60/min | 500/min |
| **Best For** | Testing, demos | Production |

---

## 🎯 **Which Should You Choose?**

### Choose **Gemini** if:
- ✅ You want to test the app for free
- ✅ You're submitting to Lexsy (demo purpose)
- ✅ You don't have a credit card
- ✅ Personal or small projects
- ✅ Learning and experimentation

### Choose **OpenAI** if:
- ✅ You're building for production
- ✅ You need the absolute best quality
- ✅ You have budget for API costs
- ✅ You need very high rate limits
- ✅ Critical business application

---

## 🔄 **Switching Between Services**

### Currently Using: **Gemini** 🆓

To switch to OpenAI:

1. **Install OpenAI**:
   ```bash
   npm install openai
   npm uninstall @google/generative-ai
   ```

2. **Restore OpenAI code in `lib/aiService.ts`**:
   - Replace `import { GoogleGenerativeAI }` with `import OpenAI`
   - Replace Gemini API calls with OpenAI calls
   - (Or request the original OpenAI version)

3. **Update `.env.local`**:
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

4. **Restart**: `npm run dev`

---

## 🆓 **Other Free Alternatives**

### Groq (Fast & Free)
- **Free tier**: 14,400 requests/day
- **Speed**: Very fast
- **Setup**: Similar to OpenAI
- **Website**: https://console.groq.com/

### Hugging Face
- **Free tier**: Limited
- **Quality**: Varies by model
- **Setup**: More complex
- **Website**: https://huggingface.co/

### Cohere
- **Free tier**: 100 requests/min
- **Quality**: Good
- **Setup**: Similar to OpenAI
- **Website**: https://cohere.com/

---

## 📝 **For Lexsy Submission**

**Recommendation**: Use **Gemini (FREE)** for your submission because:

1. ✅ Reviewers can test immediately
2. ✅ No credit card issues
3. ✅ Quality is good enough for demo
4. ✅ Shows you can work with multiple APIs
5. ✅ Demonstrates cost-consciousness

You can always mention in your application:
> "Currently using Google Gemini for free tier, but architected to easily switch to OpenAI GPT-4 for production use."

---

## ⚙️ **Current Configuration**

Your app is currently set up with:

- ✅ **Google Gemini** (FREE)
- ✅ Model: `gemini-pro`
- ✅ No credit card required
- ✅ Ready to use

**API Key needed**: `GEMINI_API_KEY` in `.env.local`

---

## 🚀 **Quick Start (Right Now)**

```bash
# 1. Get free API key
# Visit: https://aistudio.google.com/app/apikey

# 2. Create .env.local
echo "GEMINI_API_KEY=your-key-here" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# 3. Run
npm run dev

# 4. Test at http://localhost:3000
```

---

## ✅ **Environment Variables Checklist**

### For Gemini (Current Setup):
- [ ] `GEMINI_API_KEY` - Get from https://aistudio.google.com/app/apikey

### For OpenAI (If Switching):
- [ ] `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys

### For Both:
- [ ] `NEXT_PUBLIC_APP_URL` - Usually `http://localhost:3000`

---

## 💡 **Pro Tips**

1. **Start with Gemini** - Test everything for free
2. **Switch to OpenAI** - If deploying to production
3. **Use environment variables** - Easy to switch services
4. **Monitor costs** - If using paid services
5. **Rate limiting** - Implement if getting high traffic

---

## 🆘 **Getting Help**

### Gemini Issues:
- Check API key is correct: `AIzaSy...`
- Verify at: https://aistudio.google.com/app/apikey
- Check `.env.local` file exists

### OpenAI Issues:
- Check API key is correct: `sk-proj-...`
- Verify at: https://platform.openai.com/api-keys
- Check you have credits

### General Issues:
- Restart dev server: `npm run dev`
- Check browser console for errors
- Verify environment variables loaded

---

## 🎉 **You're Set!**

Your app is configured with **FREE Google Gemini**.

**Next steps**:
1. Get API key: https://aistudio.google.com/app/apikey
2. Add to `.env.local`
3. Run `npm run dev`
4. Build something amazing! 🚀

---

**Questions?** Check **GEMINI_SETUP.md** for detailed Gemini instructions!

