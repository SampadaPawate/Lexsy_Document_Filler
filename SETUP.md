# Quick Setup Guide

Get the Lexsy Document Filler running locally in 5 minutes!

## 🚀 Quick Start

### 1. Prerequisites

Make sure you have installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### 2. Install Dependencies

```bash
cd lexsy-document-filler
npm install
```

This will install:
- Next.js framework
- OpenAI SDK
- Document processing libraries (mammoth, docxtemplater)
- React components (react-dropzone)
- Tailwind CSS

### 3. Configure Environment Variables

**Important**: You need an OpenAI API key for the app to work!

Create a `.env.local` file in the root directory:

```bash
# Windows
copy .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

Edit `.env.local` and add your actual OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to get API key**:
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click "Create new secret key"
4. Copy and paste into `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

### 5. Test the Application

1. Open http://localhost:3000 in your browser
2. Upload the sample SAFE document (provided separately)
3. Follow the AI prompts to fill in fields
4. Download the completed document

## 📝 Sample Test Data

Use this data when testing:

```
Company Name: Acme Corporation
Company Address: 123 Tech Street, San Francisco, CA 94105
Investor Name: Jane Investor
Investor Email: jane@investor.com
Purchase Amount: $100,000
Valuation Cap: $5,000,000
Date: December 31, 2024
State of Incorporation: Delaware
```

## 🔍 Verify Installation

Check that everything is working:

```bash
# Should show no errors
npm run build

# Should start production server
npm start
```

## 🛠️ Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### "OpenAI API error"

- Verify your API key is correct in `.env.local`
- Check you have credits in your OpenAI account
- Ensure no extra spaces in the API key

### "Failed to process document"

- Make sure you're uploading a .docx file (not .doc)
- File should be less than 10MB
- File should contain placeholders like [Company Name]

### Port 3000 already in use

```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

## 📁 Project Structure Overview

```
lexsy-document-filler/
├── app/                    # Next.js app directory
│   ├── api/               # Backend API routes
│   ├── chat/              # Chat page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions & services
├── public/               # Static files
│   └── uploads/          # Uploaded documents (temporary)
├── .env.local            # Environment variables (create this!)
├── package.json          # Dependencies
└── README.md             # Full documentation
```

## 🎯 Next Steps

1. **Test locally** with sample documents
2. **Read README.md** for full documentation
3. **Check DEPLOYMENT.md** for deployment instructions
4. **Customize** the UI/UX as needed
5. **Deploy** to Vercel (see DEPLOYMENT.md)

## 💡 Development Tips

### Hot Reload
Changes to code will automatically reload the browser - no need to restart!

### Check Logs
View API logs in terminal where `npm run dev` is running.

### Debug Mode
Add `console.log()` statements in API routes to debug:
```typescript
console.log('Parsed placeholders:', placeholders);
```

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

## 🚢 Ready to Deploy?

Once everything works locally:

1. Push code to GitHub
2. Deploy to Vercel (easiest)
3. Add OPENAI_API_KEY to Vercel environment variables
4. Your app is live!

See **DEPLOYMENT.md** for detailed instructions.

## 📧 Need Help?

- Check README.md for detailed documentation
- Review API route code in `app/api/`
- Check browser console for errors (F12)
- Verify environment variables are set correctly

---

**You're all set!** 🎉 Start the dev server and begin building!

