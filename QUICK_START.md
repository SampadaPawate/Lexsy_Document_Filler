# ⚡ Quick Start (5 Minutes)

Get the app running with **FREE AI** in 5 minutes!

---

## Step 1: Get FREE API Key (1 minute)

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy your key (starts with `AIzaSy...`)

✅ **Done! No credit card needed!**

---

## Step 2: Setup Environment (1 minute)

Create `.env.local` file:

```bash
cd lexsy-document-filler
```

**Windows PowerShell**:
```powershell
@"
GEMINI_API_KEY=AIzaSy-paste-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@ | Out-File -FilePath .env.local -Encoding utf8
```

**Manual method**:
- Create new file named `.env.local`
- Add:
  ```
  GEMINI_API_KEY=AIzaSy-your-key-here
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

---

## Step 3: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Wait for:
```
✓ Ready in 2.3s
○ Local:  http://localhost:3000
```

---

## Step 4: Test It! (1 minute)

1. **Open**: http://localhost:3000
2. **Upload**: Any `.docx` file with `[Placeholders]`
3. **Chat**: Answer AI's questions
4. **Download**: Get your completed document

**Working?** ✅ You're done!

---

## 🎉 That's It!

**Total time**: ~5 minutes  
**Cost**: $0 (FREE)  
**Result**: Working AI document filler

---

## 🐛 Not Working?

### Can't find `.env.local`?
```bash
# Check if it exists
dir .env.local

# If not, create it
notepad .env.local
# Add your API key and save
```

### "Missing API Key" error?
- Make sure `.env.local` has `GEMINI_API_KEY=...`
- Restart: Stop server (Ctrl+C) and run `npm run dev` again

### "Invalid API Key" error?
- Go back to https://aistudio.google.com/app/apikey
- Create new key
- Update `.env.local`
- Restart server

### Still stuck?
Check **GEMINI_SETUP.md** for detailed troubleshooting.

---

## 🚀 Next Steps

### For Local Development:
- ✅ You're ready! Start building!

### To Deploy (Vercel):
1. Push to GitHub
2. Import to Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

See **DEPLOYMENT.md** for full instructions.

---

## 📝 Sample Test Data

When testing, use:
```
Company Name: Acme Corporation
Investor: Jane Investor
Amount: $100,000
Valuation Cap: $5,000,000
Date: December 31, 2024
```

---

## ✅ Success Checklist

- [x] Got Gemini API key from https://aistudio.google.com/app/apikey
- [x] Created `.env.local` with API key
- [x] Ran `npm install`
- [x] Started with `npm run dev`
- [x] Opened http://localhost:3000
- [x] Uploaded test document
- [x] AI responded to questions
- [x] Downloaded completed file

**All checked?** Perfect! You're ready to code! 🎉

---

## 💰 Cost?

**$0** - Completely free!
- No credit card
- No trial period
- No expiration
- 60 requests/min forever

---

**Happy coding!** 🚀

