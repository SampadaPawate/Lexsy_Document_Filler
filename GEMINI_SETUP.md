# 🆓 FREE Setup with Google Gemini

This app now uses **Google Gemini** which is **completely FREE** - no credit card required!

## ✅ Why Gemini?

- **FREE** - 60 requests per minute at no cost
- **No credit card** required
- **Good quality** AI responses
- **Easy setup** - just 2 steps

---

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get Your FREE API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Click **"Create API Key in New Project"**
5. Copy your API key (starts with `AIzaSy...`)

**Done! No credit card needed!** 🎉

### Step 2: Add API Key to Your Project

Create a `.env.local` file in your project root:

```bash
cd lexsy-document-filler

# Windows PowerShell
New-Item -Path .env.local -ItemType File
notepad .env.local
```

Add this to `.env.local`:

```env
GEMINI_API_KEY=AIzaSy-your-actual-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace with your actual key!**

---

## ▶️ Run the App

```bash
npm install
npm run dev
```

Open http://localhost:3000 and test it! 🎉

---

## 🌐 Deploy to Vercel (FREE)

### Add Environment Variable

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (`AIzaSy...`)
   - **Environments**: Check all boxes
3. Click **Save**
4. **Redeploy** your app

That's it! Your app is live and FREE! 🚀

---

## 💰 Cost Comparison

| Service | Free Tier | Cost After Free |
|---------|-----------|-----------------|
| **Google Gemini** | ✅ 60 req/min forever | Still free! |
| OpenAI | ❌ None | $0.50 per 1M tokens |
| Claude | ~$5 credits | $15 per 1M tokens |

**Winner: Gemini! 🏆**

---

## 🧪 Test That It Works

1. **Start dev server**: `npm run dev`
2. **Open**: http://localhost:3000
3. **Upload** a .docx file with placeholders like `[Company Name]`
4. **Chat** with the AI
5. **Download** your completed document

If AI responds, it's working! ✅

---

## 🐛 Troubleshooting

### "Missing API Key" Error

**Fix**:
```bash
# Check .env.local exists
dir .env.local

# Check it has your key
type .env.local

# Should show:
# GEMINI_API_KEY=AIzaSy...

# Restart server
npm run dev
```

### "API Key Invalid" Error

**Fix**:
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update `.env.local` with new key
4. Restart server

### Works Locally but Not on Vercel

**Fix**:
1. Vercel Dashboard → Settings → Environment Variables
2. Add `GEMINI_API_KEY` with your key
3. Redeploy the app

---

## 📊 Free Tier Limits

**Google Gemini Free Tier:**
- ✅ **60 requests per minute**
- ✅ **Unlimited for personal use**
- ✅ **No expiration**

This is MORE than enough for:
- Testing and development
- Personal projects
- Demo applications
- Small business use

---

## 🎯 Quick Reference

### Local Development:

```env
# .env.local
GEMINI_API_KEY=AIzaSy-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

### Vercel Deployment:

1. Add `GEMINI_API_KEY` in Vercel settings
2. Redeploy
3. Done!

---

## ✅ Checklist

Before running:
- [ ] Got Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Created `.env.local` file
- [ ] Added `GEMINI_API_KEY=...` to `.env.local`
- [ ] Ran `npm install`
- [ ] Started with `npm run dev`
- [ ] Tested at http://localhost:3000

Before deploying:
- [ ] Pushed code to GitHub
- [ ] Connected to Vercel
- [ ] Added `GEMINI_API_KEY` environment variable
- [ ] Deployed successfully
- [ ] Tested live URL

---

## 🎉 You're All Set!

Your app now uses **100% FREE AI** with no credit card required!

**Enjoy building!** 🚀

---

## 💡 Pro Tips

1. **Rate Limits**: 60 requests/min is plenty for most use cases
2. **Quality**: Gemini Pro performs very well for this use case
3. **Free Forever**: Google's free tier has no expiration
4. **Upgrade**: If you need more, Gemini has paid tiers too

---

## 🆘 Need Help?

If you see any errors:

1. Check `.env.local` has the correct key
2. Make sure you copied the key correctly (no spaces)
3. Restart the dev server
4. Check browser console for errors

Still stuck? The AI key is the most common issue - double-check it's set correctly!

