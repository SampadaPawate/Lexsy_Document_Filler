# 🚀 Vercel Deployment Guide

## Prerequisites
- [Vercel account](https://vercel.com/signup) (free)
- [GitHub account](https://github.com/signup) (free)
- Git installed on your computer

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Project

First, let's make sure everything builds correctly:

```bash
cd lexsy-document-filler
npm run build
```

If the build succeeds, you're ready to deploy! ✅

---

### Step 2: Initialize Git Repository (if not done)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "Initial commit - Lexsy Document Filler"
```

---

### Step 3: Push to GitHub

**Option A: Using GitHub CLI (recommended)**
```bash
# Install GitHub CLI if you haven't: https://cli.github.com/
gh auth login
gh repo create lexsy-document-filler --public --source=. --remote=origin --push
```

**Option B: Using GitHub Website**
1. Go to https://github.com/new
2. Create a new repository named `lexsy-document-filler`
3. **DON'T** initialize with README
4. Copy the commands and run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/lexsy-document-filler.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 4: Deploy to Vercel

**Option A: Using Vercel CLI (fastest)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd lexsy-document-filler
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **What's your project's name?** → lexsy-document-filler
- **In which directory is your code located?** → ./
- **Want to modify settings?** → No

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository `lexsy-document-filler`
4. Click **"Import"**
5. Vercel will auto-detect Next.js settings ✅
6. Click **"Deploy"**

---

### Step 5: Configure Environment Variables

**CRITICAL:** You need to add your Gemini API key!

#### Via Vercel Dashboard:
1. Go to your project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add the following:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | `AIzaSyC8PYtOCMHOwDIfILF71SMWDFJANcKSrf4` |

4. Click **"Save"**
5. Go to **"Deployments"** → Click the three dots on latest deployment → **"Redeploy"**

#### Via Vercel CLI:
```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted: AIzaSyC8PYtOCMHOwDIfILF71SMWDFJANcKSrf4

# Redeploy
vercel --prod
```

---

### Step 6: Test Your Deployment

Once deployed, Vercel will give you a URL like:
```
https://lexsy-document-filler.vercel.app
```

**Test the application:**
1. Visit the URL
2. Upload a `.docx` document
3. Complete the chat conversation
4. Download the filled document

---

## 🛠️ Troubleshooting

### Build Fails on Vercel
**Error:** `Type error: ... cannot be assigned to type 'never'`
**Fix:** Add this to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
```

### Environment Variables Not Working
- Make sure you clicked **"Redeploy"** after adding env vars
- Check the variable name is exactly `GEMINI_API_KEY` (case-sensitive)
- Verify in Vercel Dashboard → Settings → Environment Variables

### File Upload Fails (413 Payload Too Large)
Vercel has a 4.5MB body size limit. For larger files, add this to `vercel.json`:
```json
{
  "functions": {
    "app/api/upload/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### API Route Timeout
If document generation is slow, increase timeout in `vercel.json`:
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

---

## 🎯 Custom Domain (Optional)

Want a custom domain like `lexsy-document-filler.com`?

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel: **Settings** → **Domains** → **Add Domain**
3. Follow the DNS configuration instructions
4. Wait 24-48 hours for DNS propagation

---

## 📊 Monitoring Your App

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### Vercel Dashboard
- **Analytics:** Track visitors and performance
- **Deployments:** View all deployment history
- **Functions:** Monitor API route performance
- **Error Tracking:** Automatic error logging

---

## 🔄 Updating Your App

After making changes:

```bash
# Commit changes
git add .
git commit -m "Update: [describe changes]"
git push

# Vercel will auto-deploy!
```

Or manually redeploy:
```bash
vercel --prod
```

---

## 🎉 You're Live!

Share your app:
```
🔗 https://lexsy-document-filler.vercel.app
```

---

## 💡 Pro Tips

1. **Enable Preview Deployments**: Every branch gets its own URL for testing
2. **Add GitHub Protection**: Go to GitHub → Settings → Branches → Add rule for `main`
3. **Monitor API Usage**: Check Gemini API quotas at https://aistudio.google.com/
4. **Set Up Alerts**: Vercel can notify you if deployments fail

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Support**: https://vercel.com/support

---

**Ready to deploy? Let's do this! 🚀**

