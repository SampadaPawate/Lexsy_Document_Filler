# 🔍 Debug Guide for Production

This guide explains how to debug issues in production (Vercel) using the comprehensive debugging features built into the application.

---

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to process document" (500 Error)

**Symptoms:**
- Upload fails with internal server error
- Error message: "Failed to process document"

**Most Common Cause:** Missing `GEMINI_API_KEY` environment variable

**How to Fix:**

1. **Go to Vercel Environment Variables:**
   - Visit: https://vercel.com/your-project/settings/environment-variables
   
2. **Add the API Key:**
   ```
   Name: GEMINI_API_KEY
   Value: AIzaSyC8PYtOCMHOwDIfILF71SMWDFJANcKSrf4
   ```
   
3. **Check ALL environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **CRITICAL: Redeploy!**
   - Go to: Deployments → Click (...) on latest → Redeploy
   - Environment variables only apply after redeployment!

---

## 🧪 Health Check Endpoint

### Test API Configuration

Visit: `https://your-app.vercel.app/api/health`

**Expected Success Response:**
```json
{
  "success": true,
  "message": "All systems operational",
  "apiKeyPresent": true,
  "apiKeyLength": 39,
  "geminiResponse": "API is working!",
  "timestamp": "2025-10-31T..."
}
```

**If API Key is Missing:**
```json
{
  "success": false,
  "error": "GEMINI_API_KEY is not set in environment variables",
  "message": "Please add GEMINI_API_KEY to Vercel environment variables"
}
```

**If Gemini API Fails:**
```json
{
  "success": false,
  "error": "Gemini API test failed",
  "details": "Error message here",
  "apiKeyPresent": true,
  "apiKeyLength": 39
}
```

---

## 📊 Viewing Logs in Vercel

### Method 1: Vercel Dashboard

1. Go to: https://vercel.com/your-project
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"Functions"** or **"Runtime Logs"**
5. Try the failing action (upload document)
6. Watch for red error messages

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# View real-time logs
vercel logs --follow

# View recent logs
vercel logs
```

---

## 🔍 Debug Log Messages

The application now outputs detailed debug information:

### Upload API (`/api/upload`)

**Success Logs:**
```
[Upload API] Request received
[Upload API] Environment: production
[Upload API] GEMINI_API_KEY present: true
[Upload API] File received: { name: 'document.docx', size: 25463, type: 'application/...' }
[Upload API] Parsing document...
[Upload API] ✅ Document parsed successfully
[Upload API] Found placeholders: 8
```

**Error Logs (Missing API Key):**
```
═══════════════════════════════════════════════════
❌ [Upload API] ERROR: Error: GEMINI_API_KEY environment variable is not set
Error name: Error
Error message: GEMINI_API_KEY environment variable is not set. Please configure it in Vercel settings.
Error stack: [full stack trace]
═══════════════════════════════════════════════════
```

### AI Service (`lib/aiService.ts`)

**Success Logs:**
```
[AI Service] Environment check: {
  nodeEnv: 'production',
  hasApiKey: true,
  apiKeyLength: 39,
  apiKeyPrefix: 'AIzaSyC8...'
}
[AI Service] Initializing Google Generative AI client...
[AI Service] ✅ Client initialized successfully
```

**Error Logs (Missing API Key):**
```
╔═══════════════════════════════════════════════════════════╗
║ ❌ MISSING ENVIRONMENT VARIABLE: GEMINI_API_KEY          ║
╠═══════════════════════════════════════════════════════════╣
║ The GEMINI_API_KEY environment variable is not set.      ║
║                                                           ║
║ 🔧 TO FIX THIS IN VERCEL:                                ║
║                                                           ║
║ 1. Go to: vercel.com/your-project/settings/              ║
║    environment-variables                                  ║
║                                                           ║
║ 2. Add:                                                   ║
║    Name: GEMINI_API_KEY                                   ║
║    Value: Your API key from ai.google.dev                ║
║                                                           ║
║ 3. Check ALL environments:                                ║
║    ✅ Production                                          ║
║    ✅ Preview                                             ║
║    ✅ Development                                         ║
║                                                           ║
║ 4. REDEPLOY your application!                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Chat API (`/api/chat`)

**Success Logs:**
```
[Chat API] Request received
[Chat API] GEMINI_API_KEY present: true
[Chat API] Message: John Smith
[Chat API] Placeholders count: 8
```

---

## 🛠️ Frontend Error Display

The frontend now shows detailed error messages with fix instructions:

**Error Example:**
```
❌ Upload Failed

Missing API Configuration: GEMINI_API_KEY environment variable is not set. 
Please configure it in Vercel settings and redeploy.

💡 Fix: Go to Vercel → Settings → Environment Variables → Add GEMINI_API_KEY
```

---

## ✅ Verification Checklist

After fixing environment variables:

- [ ] Environment variable `GEMINI_API_KEY` is added in Vercel
- [ ] All three environments are checked (Production, Preview, Development)
- [ ] Application has been **redeployed** (critical!)
- [ ] Deployment shows "Ready" status
- [ ] Health check endpoint returns `"success": true`
- [ ] Document upload works without errors

---

## 🔗 Quick Links

- **Vercel Project:** https://vercel.com/your-project
- **Environment Variables:** https://vercel.com/your-project/settings/environment-variables
- **Deployments:** https://vercel.com/your-project/deployments
- **Health Check:** https://your-app.vercel.app/api/health
- **Test Endpoint:** https://your-app.vercel.app/api/test

---

## 📞 Still Having Issues?

If you've:
1. ✅ Added the `GEMINI_API_KEY`
2. ✅ Checked all three environments
3. ✅ Redeployed the application
4. ✅ Waited for "Ready" status
5. ✅ Tested the health endpoint

And it still doesn't work:

1. **Check the health endpoint response** - copy the full JSON
2. **View Vercel logs** - copy any error messages
3. **Check browser console** - press F12, copy errors from Console tab
4. **Share these details** for further debugging

---

## 🎯 Debug Workflow

```
1. Issue Occurs
   ↓
2. Check Health Endpoint (/api/health)
   ↓
3. If apiKeyPresent: false
   → Add GEMINI_API_KEY in Vercel
   → Redeploy
   ↓
4. If apiKeyPresent: true but still fails
   → Check Vercel Function Logs
   → Look for red error messages
   → Check error stack traces
   ↓
5. If Gemini API fails
   → Verify API key is correct
   → Check quota at ai.google.dev
   ↓
6. Test again after fixes
```

---

**Remember:** Environment variables require a **redeploy** to take effect! 🚀

