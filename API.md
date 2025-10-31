# API Documentation

Complete reference for all API endpoints in the Lexsy Document Filler.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-app.vercel.app`

## Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload` | Upload and parse document |
| POST | `/api/chat` | Process chat messages |
| POST | `/api/generate` | Generate filled document |
| GET | `/api/download/[id]` | Download completed document |

---

## 1. Upload Document

Upload a .docx document and extract placeholders.

### Endpoint
```
POST /api/upload
```

### Request
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with file

```javascript
const formData = new FormData();
formData.append('file', fileObject);

fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "documentId": "123e4567-e89b-12d3-a456-426614174000",
  "fileName": "safe-agreement.docx",
  "placeholders": [
    {
      "key": "COMPANY_NAME",
      "description": "Company Name",
      "type": "text",
      "original": "[Company Name]",
      "position": 245
    },
    {
      "key": "PURCHASE_AMOUNT",
      "description": "Purchase Amount",
      "type": "currency",
      "original": "[Purchase Amount]",
      "position": 512
    }
  ]
}
```

**Error (400)**:
```json
{
  "error": "Only .docx files are supported"
}
```

**Error (500)**:
```json
{
  "error": "Failed to process document"
}
```

### Validation Rules
- File must be `.docx` format
- Maximum file size: 10MB
- File must contain valid content

---

## 2. Chat with AI

Send a chat message and get AI response.

### Endpoint
```
POST /api/chat
```

### Request
- **Content-Type**: `application/json`

**Initial Message** (to get greeting):
```json
{
  "placeholders": [...],
  "conversationState": null
}
```

**Subsequent Messages**:
```json
{
  "message": "Acme Corporation",
  "placeholders": [...],
  "conversationState": {
    "messages": [...],
    "filledPlaceholders": {},
    "currentPlaceholderIndex": 0
  }
}
```

### Response

**Success (200)**:
```json
{
  "response": "Great! I've recorded Acme Corporation. Now, what's the purchase amount?",
  "conversationState": {
    "messages": [
      {
        "role": "user",
        "content": "Acme Corporation"
      },
      {
        "role": "assistant",
        "content": "Great! I've recorded..."
      }
    ],
    "filledPlaceholders": {
      "COMPANY_NAME": "Acme Corporation"
    },
    "currentPlaceholderIndex": 1
  }
}
```

**Error (400)**:
```json
{
  "error": "Invalid placeholders data"
}
```

**Error (500)**:
```json
{
  "error": "Failed to process chat message"
}
```

### Conversation State Structure

```typescript
interface ConversationState {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  filledPlaceholders: Record<string, string>;
  currentPlaceholderIndex: number;
}
```

---

## 3. Generate Document

Generate a filled .docx document with all values.

### Endpoint
```
POST /api/generate
```

### Request
- **Content-Type**: `application/json`

```json
{
  "documentId": "123e4567-e89b-12d3-a456-426614174000",
  "filledPlaceholders": {
    "COMPANY_NAME": "Acme Corporation",
    "PURCHASE_AMOUNT": "$100,000",
    "VALUATION_CAP": "$5,000,000",
    "DATE": "12/31/2024"
  }
}
```

### Response

**Success (200)**:
```json
{
  "success": true,
  "downloadUrl": "/api/download/123e4567-e89b-12d3-a456-426614174000"
}
```

**Error (400)**:
```json
{
  "error": "Missing documentId or filledPlaceholders"
}
```

**Error (500)**:
```json
{
  "error": "Failed to generate document"
}
```

### Processing Steps
1. Load original document from `/public/uploads/[documentId].docx`
2. Replace placeholders using docxtemplater
3. Save filled document as `[documentId]-filled.docx`
4. Return download URL

---

## 4. Download Document

Download the completed document.

### Endpoint
```
GET /api/download/[documentId]
```

### Request
No body required - simple GET request.

```javascript
fetch('/api/download/123e4567-e89b-12d3-a456-426614174000')
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'completed-document.docx';
    a.click();
  });
```

### Response

**Success (200)**:
- Binary file stream (.docx)
- Headers:
  ```
  Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
  Content-Disposition: attachment; filename="completed-document.docx"
  ```

**Error (400)**:
```json
{
  "error": "Missing documentId"
}
```

**Error (500)**:
```json
{
  "error": "Failed to download document"
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Not Found (document doesn't exist) |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});
```

Suggested limits:
- Upload: 5 requests per minute
- Chat: 30 requests per minute
- Generate: 10 requests per minute
- Download: 20 requests per minute

## Authentication

Currently no authentication is required. For production, consider:

- API keys for external access
- Session-based auth for users
- OAuth for enterprise

## CORS Policy

Same-origin policy applies. To enable CORS:

```typescript
// In API routes
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

## Example: Complete Flow

```javascript
// 1. Upload document
const uploadFormData = new FormData();
uploadFormData.append('file', fileInput.files[0]);

const uploadRes = await fetch('/api/upload', {
  method: 'POST',
  body: uploadFormData,
});
const { documentId, placeholders } = await uploadRes.json();

// 2. Initialize chat
let conversationState = null;
const initChatRes = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ placeholders, conversationState }),
});
const initData = await initChatRes.json();
conversationState = initData.conversationState;

// 3. Send user messages
const chatRes = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Acme Corp',
    placeholders,
    conversationState,
  }),
});
const chatData = await chatRes.json();
conversationState = chatData.conversationState;

// 4. Generate document (when all filled)
const generateRes = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    documentId,
    filledPlaceholders: conversationState.filledPlaceholders,
  }),
});
const { downloadUrl } = await generateRes.json();

// 5. Download
window.location.href = downloadUrl;
```

## TypeScript Types

### Request/Response Types

```typescript
// Upload
interface UploadRequest {
  file: File;
}

interface UploadResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  placeholders: Placeholder[];
}

// Chat
interface ChatRequest {
  message?: string;
  placeholders: Placeholder[];
  conversationState: ConversationState | null;
}

interface ChatResponse {
  response: string;
  conversationState: ConversationState;
}

// Generate
interface GenerateRequest {
  documentId: string;
  filledPlaceholders: Record<string, string>;
}

interface GenerateResponse {
  success: boolean;
  downloadUrl: string;
}

// Types
interface Placeholder {
  key: string;
  description: string;
  type: string;
  original: string;
  position: number;
}

interface ConversationState {
  messages: ChatMessage[];
  filledPlaceholders: Record<string, string>;
  currentPlaceholderIndex: number;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

## Testing APIs

### Using cURL

```bash
# Upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/document.docx"

# Chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"placeholders":[],"conversationState":null}'

# Generate
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"documentId":"abc123","filledPlaceholders":{}}'

# Download
curl http://localhost:3000/api/download/abc123 \
  --output completed.docx
```

### Using Postman

1. **Upload**:
   - Method: POST
   - URL: `http://localhost:3000/api/upload`
   - Body: form-data, key: "file", type: File

2. **Chat**:
   - Method: POST
   - URL: `http://localhost:3000/api/chat`
   - Body: raw JSON
   
3. **Generate**:
   - Method: POST
   - URL: `http://localhost:3000/api/generate`
   - Body: raw JSON

4. **Download**:
   - Method: GET
   - URL: `http://localhost:3000/api/download/[id]`
   - Send and Save Response

---

## Environment Variables

Required for APIs to work:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-...

# App URL (optional, for CORS)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Monitoring

To monitor API performance:

```typescript
// Add to API routes
const startTime = Date.now();
// ... process request ...
const duration = Date.now() - startTime;
console.log(`[${endpoint}] ${duration}ms`);
```

## Future API Enhancements

Planned improvements:

1. **Pagination** for large document lists
2. **Webhooks** for async processing
3. **Batch processing** for multiple documents
4. **Document templates** endpoint
5. **User management** endpoints
6. **Analytics** endpoints
7. **Export formats** (PDF, HTML)
8. **Version history** tracking
9. **Sharing** capabilities
10. **Audit logs** endpoint

---

For implementation details, see the source code in `/app/api/` directory.

