# 🧪 Testing Guide

Quick guide to test the Lexsy Document Filler application.

## 📝 Create a Sample Document

### Method 1: Use Microsoft Word (Recommended)

1. **Open Microsoft Word**
2. **Copy this text** and paste into Word:

```
SAFE AGREEMENT
(Simple Agreement for Future Equity)

THIS CERTIFIES THAT in exchange for the payment by [Investor Name] of $[Purchase Amount] 
on [Date of SAFE], [Company Name], a [State of Incorporation] corporation, issues to the 
Investor the right to certain shares of the Company's Capital Stock.

The Post-Money Valuation Cap is $[Valuation Cap].

COMPANY INFORMATION:
Company Name: [Company Name]
Company Address: [Company Address]
Company Email: [Company Email]

INVESTOR INFORMATION:
Investor Name: [Investor Name]
Investor Address: [Investor Address]
Investor Email: [Investor Email]

INVESTMENT DETAILS:
Purchase Amount: $[Purchase Amount]
Valuation Cap: $[Valuation Cap]
Date: [Date of SAFE]
State: [State of Incorporation]
Governing Law: [Governing Law Jurisdiction]

SIGNATURES:
Company Representative: [Company Representative Name]
Title: [Company Representative Title]
```

3. **Save as** `test-safe.docx` (Word Document format)
4. **Upload** to http://localhost:3000

---

## 🎯 Sample Test Data

When the AI asks questions, use these values:

| Field | Value |
|-------|-------|
| Company Name | Acme Corporation |
| Company Address | 123 Tech Street, San Francisco, CA 94105 |
| Company Email | info@acmecorp.com |
| Investor Name | Jane Investor |
| Investor Address | 456 Investment Ave, New York, NY 10001 |
| Investor Email | jane@investor.com |
| Purchase Amount | 100000 |
| Valuation Cap | 5000000 |
| Date of SAFE | December 31, 2024 |
| State of Incorporation | Delaware |
| Governing Law Jurisdiction | Delaware |
| Company Representative Name | John Smith |
| Company Representative Title | CEO |

---

## ✅ Expected Results

### During Upload:
```
✓ File uploaded successfully
✓ Found 11 placeholders
✓ Redirected to chat page
```

### During Chat:
```
AI: "What is the company name?"
You: "Acme Corporation"
AI: "Great! Now, what is the investor name?"
... (continues for all fields)
Progress bar: 1/11 → 2/11 → ... → 11/11
```

### After Generation:
```
✓ All 11 fields filled
✓ Document generated
✓ Download ready
```

### In Downloaded Document:
- All `[Placeholder Name]` should be replaced with your values
- No `[...]` should remain
- Formatting should be preserved

---

## 🐛 Troubleshooting Test

### If AI doesn't detect placeholders:

**Make sure your placeholders are in this format:**
- ✅ `[Company Name]` - Correct
- ✅ `[Investor Name]` - Correct
- ❌ `Company Name` - Wrong (no brackets)
- ❌ `{Company Name}` - Wrong (curly braces)

### If values aren't filled in downloaded document:

**Check terminal logs after clicking Generate:**
```
[Generator] Processing COMPANY_NAME = "Acme Corporation"
[Generator] ✓ Replaced 1 occurrences of COMPANY_NAME
```

Should see `✓ Replaced` for each field. If you see `⚠️ No matches found`, there's a format mismatch.

---

## 📊 Quick Test Checklist

- [ ] Created .docx file with placeholders
- [ ] Started dev server (`npm run dev`)
- [ ] Opened http://localhost:3000
- [ ] Uploaded document
- [ ] Saw correct number of placeholders detected
- [ ] Answered all AI questions
- [ ] Progress reached 100%
- [ ] Clicked "Generate Document"
- [ ] Downloaded completed file
- [ ] Opened in Word
- [ ] All placeholders filled correctly
- [ ] No errors in terminal

---

## 🎨 Advanced Test: Different Placeholder Formats

Create a document with various formats to test:

```
Test Document

Brackets: [Company Name]
Quotes: "Investor Name"
Mixed: [Purchase Amount] and "Date"
```

The app should detect and fill ALL formats!

---

## 📁 Sample Files Location

After running the app, sample template is at:
```
lexsy-document-filler/public/SAMPLE_TEMPLATE.txt
```

---

## 💡 Tips

1. **Keep it simple**: Start with 3-5 placeholders for first test
2. **Use clear names**: `[Company Name]` is better than `[CN]`
3. **Test incrementally**: Upload → Check detection → Chat → Generate → Download
4. **Check logs**: Terminal shows exactly what's happening
5. **Use consistent format**: Stick to `[Placeholder Name]` format throughout

---

## 🚀 Ready to Test!

1. Create your `.docx` file
2. Run `npm run dev`
3. Go to http://localhost:3000
4. Upload and test!

**Good luck!** 🎉

