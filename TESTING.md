# Testing Guide

Comprehensive testing guide for the Lexsy Document Filler application.

## Pre-Deployment Testing Checklist

Before submitting your application, test all features thoroughly:

### ✅ 1. Upload Functionality

**Test Case 1: Valid Upload**
- [ ] Upload a .docx file
- [ ] File size under 10MB
- [ ] Verify upload progress indicator shows
- [ ] Confirm successful redirect to chat page
- [ ] Check placeholders are detected correctly

**Test Case 2: Invalid Uploads**
- [ ] Try uploading .doc file (should fail)
- [ ] Try uploading .pdf file (should fail)
- [ ] Try uploading file over 10MB (should fail)
- [ ] Verify error messages display correctly

### ✅ 2. Chat Interface

**Test Case 1: Normal Flow**
- [ ] AI sends initial greeting
- [ ] AI asks for first placeholder
- [ ] User response is acknowledged
- [ ] Progress bar updates after each response
- [ ] All placeholders are requested in order
- [ ] Final confirmation message appears

**Test Case 2: Various Input Formats**
- [ ] Short answers: "Acme Corp"
- [ ] Long answers: "123 Main Street, Suite 500, San Francisco, CA"
- [ ] Numbers: "100000"
- [ ] Currency: "$5,000,000"
- [ ] Dates: "12/31/2024"
- [ ] Email: "test@example.com"

**Test Case 3: Edge Cases**
- [ ] Very long response (500+ characters)
- [ ] Empty response (should be prevented)
- [ ] Special characters: & $ % @ #
- [ ] Multiple spaces in response
- [ ] Line breaks in response

### ✅ 3. Document Generation

**Test Case 1: Generate Document**
- [ ] Complete all fields in chat
- [ ] Preview shows all filled values
- [ ] Click "Generate" button
- [ ] Generation completes successfully
- [ ] Download button appears

**Test Case 2: Download**
- [ ] Click download button
- [ ] File downloads successfully
- [ ] File opens in Microsoft Word
- [ ] All placeholders are filled
- [ ] Formatting is preserved
- [ ] No [PLACEHOLDER] text remains

### ✅ 4. UI/UX Testing

**Visual Testing**
- [ ] Upload page displays correctly
- [ ] Drag & drop zone is visible
- [ ] Chat interface is readable
- [ ] Messages are aligned correctly (AI left, user right)
- [ ] Progress bar displays accurately
- [ ] Buttons are styled correctly
- [ ] Loading states show properly

**Responsive Design**
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All elements are accessible
- [ ] No horizontal scrolling
- [ ] Touch targets are adequate

### ✅ 5. Error Handling

**Test Error Scenarios**
- [ ] No API key configured
- [ ] Invalid API key
- [ ] Network timeout
- [ ] OpenAI API rate limit
- [ ] File upload fails
- [ ] Document generation fails
- [ ] Download fails

**Verify Error Messages**
- [ ] Errors display clearly
- [ ] User understands what went wrong
- [ ] Recovery options are provided
- [ ] No cryptic technical errors shown

### ✅ 6. Performance Testing

**Load Time**
- [ ] Home page loads < 2 seconds
- [ ] Upload processes < 5 seconds
- [ ] Chat response time < 3 seconds
- [ ] Document generation < 10 seconds
- [ ] Download starts immediately

**Browser Compatibility**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Automated Testing (Optional)

While not required for submission, here's how to add tests:

### Unit Tests (Jest)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Example test:
```typescript
// __tests__/documentParser.test.ts
import { extractPlaceholders } from '@/lib/documentParser';

test('extracts placeholders correctly', () => {
  const text = 'Company: [Company Name], Amount: [Purchase Amount]';
  const placeholders = extractPlaceholders(text);
  
  expect(placeholders).toHaveLength(2);
  expect(placeholders[0].key).toBe('COMPANY_NAME');
});
```

### Integration Tests

```typescript
// __tests__/upload.test.ts
test('upload API processes document', async () => {
  const formData = new FormData();
  formData.append('file', sampleDocxFile);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  expect(response.ok).toBe(true);
  const data = await response.json();
  expect(data.documentId).toBeDefined();
  expect(data.placeholders).toBeDefined();
});
```

## Manual Testing Script

Follow this step-by-step testing script:

### Session 1: Happy Path (10 minutes)

1. **Start**: Open http://localhost:3000
2. **Upload**: Drag sample SAFE document onto upload zone
3. **Wait**: Confirm upload completes and redirects
4. **Chat**: Answer AI questions with valid data:
   - Company Name: "Acme Corp"
   - Purchase Amount: "$100,000"
   - Valuation Cap: "$5,000,000"
   - Date: "12/31/2024"
   - (Continue for all fields)
5. **Review**: Check preview shows correct values
6. **Generate**: Click generate button
7. **Download**: Download and open document
8. **Verify**: Confirm all fields filled correctly

### Session 2: Error Testing (10 minutes)

1. **Invalid File**: Try uploading a .txt file
2. **Large File**: Try uploading 15MB file
3. **Empty Input**: Try sending empty chat messages
4. **Invalid API Key**: Temporarily break API key, test error
5. **Network Error**: Test with network throttling
6. **Browser Refresh**: Refresh page mid-chat, check recovery

### Session 3: Edge Cases (10 minutes)

1. **Special Characters**: Use &, <, >, " in responses
2. **Very Long Text**: Enter 1000+ character response
3. **Multiple Uploads**: Upload 3 documents in sequence
4. **Concurrent Users**: Open 2 browser windows, test simultaneously
5. **Mobile Testing**: Test on phone browser

## Sample Test Documents

### Test Document 1: Simple SAFE
- 5 placeholders
- Standard format
- Small file size

### Test Document 2: Complex SAFE
- 15+ placeholders
- Nested fields
- Larger file size

### Test Document 3: Edge Case
- Unusual placeholder formats
- Special characters
- Complex formatting

## Performance Benchmarks

Target performance metrics:

| Operation | Target Time | Acceptable | Poor |
|-----------|-------------|------------|------|
| Page Load | < 1s | < 2s | > 3s |
| Upload | < 3s | < 5s | > 10s |
| AI Response | < 2s | < 4s | > 6s |
| Generate Doc | < 5s | < 10s | > 15s |
| Download | < 1s | < 2s | > 3s |

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Error messages announced

## Security Testing

- [ ] No sensitive data in URLs
- [ ] Files stored securely
- [ ] API routes authenticated (if applicable)
- [ ] No XSS vulnerabilities
- [ ] No SQL injection risks
- [ ] File upload restrictions enforced
- [ ] Rate limiting considered

## Pre-Submission Checklist

Before submitting your application:

- [ ] All tests pass
- [ ] No console errors
- [ ] No linter warnings
- [ ] README.md is complete
- [ ] Environment variables documented
- [ ] Code is commented
- [ ] Git repository is clean
- [ ] Deployment successful
- [ ] Live URL works
- [ ] Demo video recorded

## Testing Tools

### Browser DevTools
- **Console**: Check for errors
- **Network**: Monitor API calls
- **Performance**: Check load times
- **Lighthouse**: Run audit

### Online Tools
- **WebPageTest**: Performance testing
- **WAVE**: Accessibility testing
- **GTmetrix**: Speed testing

## Common Issues & Fixes

### Issue: Chat not responding
**Fix**: Check OpenAI API key is valid

### Issue: Document not downloading
**Fix**: Check file was generated in /public/uploads/

### Issue: Placeholders not detected
**Fix**: Ensure document has placeholders in [brackets]

### Issue: Upload fails
**Fix**: Check file is .docx and < 10MB

## Documentation to Prepare

For your submission, prepare:

1. **README.md** ✅ (Already created)
2. **Setup instructions** ✅ (SETUP.md created)
3. **API documentation** (List of endpoints)
4. **Known limitations** (What doesn't work)
5. **Future improvements** (What you'd add with more time)

---

## Final Pre-Submission Test

Run through this complete flow one final time before submission:

1. ✅ Fresh browser window
2. ✅ Navigate to live URL
3. ✅ Upload sample document
4. ✅ Complete full chat flow
5. ✅ Generate document
6. ✅ Download and verify
7. ✅ No errors in console
8. ✅ Works on mobile
9. ✅ Demo video recorded
10. ✅ Repository link ready

**If all ✅ - you're ready to submit!** 🚀

