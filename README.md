# Lexsy Document Filler

An AI-powered web application that automates legal document completion using conversational AI. Built specifically for SAFE (Simple Agreement for Future Equity) agreements.

## ✨ Features

- **Drag & Drop Upload**: Easy document upload with .docx support
- **AI-Powered Chat**: Conversational interface to guide users through filling document fields
- **Smart Placeholder Detection**: Automatically identifies fields that need to be filled
- **Real-time Progress Tracking**: Visual progress bar showing completion status
- **Document Generation**: Creates a completed .docx file ready for download
- **Clean UI/UX**: Professional, modern interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **AI**: OpenAI GPT-4
- **Document Processing**: 
  - mammoth.js (parsing .docx files)
  - pizzip + docxtemplater (generating filled documents)
- **File Upload**: react-dropzone
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🏃 Quick Start

### 1. Clone the Repository

```bash
git clone [your-repo-url]
cd lexsy-document-filler
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the Application

1. Upload the  document
2. Follow the AI assistant's prompts to fill in the fields
3. Review and download the completed document

## 📁 Project Structure

```
lexsy-document-filler/
├── app/
│   ├── api/
│   │   ├── upload/         # Document upload endpoint
│   │   ├── chat/           # AI chat endpoint
│   │   ├── generate/       # Document generation endpoint
│   │   └── download/       # Download endpoint
│   ├── chat/[documentId]/  # Chat page
│   └── page.tsx            # Home/upload page
├── components/
│   ├── FileUpload.tsx      # Drag & drop upload component
│   ├── ChatInterface.tsx   # Chat UI component
│   └── DocumentPreview.tsx # Preview and download component
├── lib/
│   ├── documentParser.ts   # .docx parsing and placeholder extraction
│   ├── aiService.ts        # OpenAI integration
│   └── documentGenerator.ts # Document generation logic
├── public/
│   └── uploads/            # Temporary document storage
└── README.md
```


## 🔧 Configuration

### Supported Document Formats

Currently supports `.docx` files with placeholders in these formats:
- `[Placeholder Name]`
- `{{placeholder}}`
- `______` (blank lines)

### API Configuration

All API routes are serverless functions that run on-demand:

- **POST /api/upload** - Accepts .docx file, returns parsed placeholders
- **POST /api/chat** - Processes chat messages and updates conversation state
- **POST /api/generate** - Generates filled document
- **GET /api/download/[documentId]** - Downloads completed document

## 📝 How It Works

### 1. Document Upload
- User uploads .docx file
- Server parses document using mammoth.js
- Regex patterns identify placeholders
- Placeholders are returned to frontend

### 2. Conversational Filling
- AI generates first question based on placeholders
- User responds to each question
- AI extracts values and asks next question
- Progress tracked in real-time

### 3. Document Generation
- All placeholder values sent to server
- docxtemplater fills in values
- New .docx generated and saved
- Download link provided to user

## 🔒 Security Considerations

- Documents stored temporarily in `/public/uploads/`
- Files should be cleaned up after download (implement cleanup cron)
- API routes should be rate-limited in production
- Consider implementing user authentication for production use

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Failed to process document"
- **Solution**: Ensure the file is a valid .docx file (not .doc)

**Issue**: "OpenAI API error"
- **Solution**: Check that your API key is valid and has credits

**Issue**: "Document download fails"
- **Solution**: Ensure the `/public/uploads/` directory exists and is writable

## 📄 License

MIT License - feel free to use this for your projects!

## 👤 Author

Sampada
- Email: sampadapawate@gmail.com
- GitHub: https://github.com/SampadaPawate/Lexsy_Document_Filler




