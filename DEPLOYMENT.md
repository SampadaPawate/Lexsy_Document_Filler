# Deployment Guide

Complete guide to deploying the Lexsy Document Filler application.

## Prerequisites

- GitHub account
- Vercel account (recommended) or Railway/Render account
- OpenAI API key

## Option 1: Deploy to Vercel (Recommended)

Vercel is the best option for Next.js applications and offers a generous free tier.

### Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
cd lexsy-document-filler
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Lexsy Document Filler"

# Create repository on GitHub (via web interface)
# Then add remote and push
git remote add origin https://github.com/your-username/lexsy-document-filler.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Sign up/Login**: Go to [vercel.com](https://vercel.com) and sign up with GitHub

2. **Import Project**:
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     Name: OPENAI_API_KEY
     Value: sk-your-actual-openai-key
     ```
   - Add to: Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-app.vercel.app`

### Step 3: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS according to Vercel's instructions

### Step 4: Configure File Upload Limits

By default, Vercel has a 4.5MB request limit. For larger documents:

1. Create `vercel.json` in root:
```json
{
  "functions": {
    "app/api/upload/route.ts": {
      "maxDuration": 60
    }
  }
}
```

2. Commit and push to trigger redeployment

## Option 2: Deploy to Railway

Railway is another excellent option with generous free tier.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Link to existing project or create new
railway link
```

### Step 3: Set Environment Variables

```bash
# Set OpenAI API key
railway variables set OPENAI_API_KEY=sk-your-actual-key

# Set app URL (Railway will provide this after first deploy)
railway variables set NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
```

### Step 4: Deploy

```bash
# Deploy to Railway
railway up

# Your app will be available at the URL shown
```

### Step 5: Enable Public Networking

1. Go to Railway dashboard
2. Select your project
3. Go to Settings → Networking
4. Generate domain

## Option 3: Deploy to Render

### Step 1: Create Render Account

Sign up at [render.com](https://render.com)

### Step 2: Create New Web Service

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: lexsy-document-filler
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables

In the "Environment" section:
```
OPENAI_API_KEY = sk-your-actual-key
NEXT_PUBLIC_APP_URL = https://your-app.onrender.com
```

### Step 4: Deploy

Click "Create Web Service" - deployment will start automatically.

## Post-Deployment Checklist

- [ ] Test document upload
- [ ] Test chat functionality
- [ ] Test document generation and download
- [ ] Verify all placeholders are detected
- [ ] Test with sample SAFE document
- [ ] Check mobile responsiveness
- [ ] Monitor error logs

## Testing Your Deployed App

1. **Upload Test**:
   - Visit your app URL
   - Upload the sample SAFE document
   - Verify upload completes successfully

2. **Chat Test**:
   - Answer AI questions
   - Check progress bar updates
   - Verify all fields are captured

3. **Download Test**:
   - Generate completed document
   - Download and open in Microsoft Word
   - Verify all placeholders filled correctly

## Monitoring & Logs

### Vercel
- View logs: `vercel logs [deployment-url]`
- Or via dashboard: Project → Deployments → Select deployment → Logs

### Railway
- View logs: `railway logs`
- Or via dashboard: Project → Deployments → View logs

### Render
- Dashboard → Your Service → Logs

## Troubleshooting

### Issue: Build Fails

**Solution**: Check that all dependencies are in `package.json`:
```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: Environment Variables Not Working

**Solution**: 
1. Verify variables are set in deployment platform
2. Redeploy after adding variables
3. Check variable names match exactly

### Issue: File Upload Fails

**Solution**:
1. Check deployment platform's file size limits
2. Verify `/public/uploads` directory permissions
3. Consider using cloud storage (S3, Cloudinary) for production

### Issue: OpenAI API Errors

**Solution**:
1. Verify API key is valid
2. Check OpenAI account has credits
3. Monitor rate limits
4. Consider implementing retry logic

## Performance Optimization

### 1. Enable Caching
```typescript
// In API routes
export const revalidate = 3600; // Cache for 1 hour
```

### 2. Optimize Images
Already handled by Next.js Image component

### 3. Add Loading States
Already implemented in all components

### 4. Monitor Bundle Size
```bash
npm run build
# Check output for bundle sizes
```

## Security Best Practices

### 1. Rate Limiting
Consider adding rate limiting to API routes:
```bash
npm install @upstash/ratelimit
```

### 2. File Cleanup
Implement cron job to clean old uploads:
```typescript
// Create /app/api/cleanup/route.ts
// Use Vercel Cron Jobs or similar
```

### 3. Input Validation
Already implemented - validates file type and size

### 4. CORS Configuration
Add if needed for specific domains:
```typescript
// In API routes
headers: {
  'Access-Control-Allow-Origin': 'your-domain.com'
}
```

## Cost Estimates

### Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ Unlimited API requests
- ✅ Automatic HTTPS
- **Cost**: Free

### Railway Free Tier
- ✅ $5 credit/month
- ✅ Sufficient for moderate usage
- **Cost**: Free (with limits)

### OpenAI API
- GPT-4-mini: ~$0.15 per 1M input tokens
- Estimated: ~$0.02 per document processing
- **Cost**: Pay-as-you-go

### Total Monthly Cost
- **Low usage** (100 documents): ~$2-3
- **Medium usage** (500 documents): ~$10-15
- **High usage** (2000 documents): ~$40-50

## Scaling Considerations

When your app grows:

1. **Move to Vercel Pro** ($20/month) for better performance
2. **Implement Redis caching** for faster responses
3. **Use S3 for file storage** instead of local filesystem
4. **Add database** (PostgreSQL) for tracking documents
5. **Implement user authentication** for security
6. **Add analytics** to track usage

## Support

If you encounter issues during deployment:

1. Check deployment logs first
2. Verify all environment variables
3. Test locally with production build: `npm run build && npm start`
4. Contact platform support (Vercel/Railway/Render)

---

**Ready to deploy?** Start with Vercel - it's the easiest and most reliable option for Next.js apps!

