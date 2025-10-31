import mammoth from 'mammoth';

export interface Placeholder {
  key: string;
  description: string;
  type: string;
  original: string;
  position: number;
}

export interface ParsedDocument {
  documentId: string;
  text: string;
  html: string;
  placeholders: Placeholder[];
}

/**
 * Parses a .docx file and extracts placeholders
 */
export async function parseDocument(buffer: Buffer, documentId: string): Promise<ParsedDocument> {
  // Extract text and HTML from docx
  const textResult = await mammoth.extractRawText({ buffer });
  const htmlResult = await mammoth.convertToHtml({ buffer });

  const text = textResult.value;
  const html = htmlResult.value;

  // Extract placeholders using various patterns
  const placeholders = extractPlaceholders(text);

  return {
    documentId,
    text,
    html,
    placeholders,
  };
}

/**
 * Extracts placeholders from text using regex patterns
 */
function extractPlaceholders(text: string): Placeholder[] {
  const placeholders: Placeholder[] = [];
  const seen = new Set<string>();

  // Define patterns to match different placeholder formats
  const patterns = [
    { regex: /\[([^\]]+)\]/g, format: 'brackets' },      // [Company Name]
    { regex: /"([A-Z][A-Z0-9\s_-]{1,50})"/g, format: 'quotes-caps' }, // "INVESTOR", "FGH"
    { regex: /"([^"]+)"/g, format: 'quotes' },           // "Company Name"
    { regex: /\{\{([^\}]+)\}\}/g, format: 'double-braces' }, // {{investor}}
    { regex: /_+(?:\s|$)/g, format: 'underscores' },     // _______ (blank lines)
  ];

  patterns.forEach(({ regex, format }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const original = match[0];
      const content = match[1] || 'blank';
      
      // Skip if we've already seen this placeholder
      const key = normalizeKey(content);
      if (seen.has(key)) continue;
      
      seen.add(key);

      const placeholder = {
        key,
        description: generateDescription(content),
        type: inferType(content),
        original,
        position: match.index,
      };
      
      console.log(`[Parser] Found placeholder: "${original}" -> key: "${key}"`);
      placeholders.push(placeholder);
    }
  });

  // Sort by position in document
  const sorted = placeholders.sort((a, b) => a.position - b.position);
  console.log(`[Parser] Total placeholders found: ${sorted.length}`);
  return sorted;
}

/**
 * Normalizes a placeholder key (removes special chars, converts to uppercase)
 */
function normalizeKey(text: string): string {
  const cleaned = text
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  // If the original text was already uppercase and short (like "INVESTOR", "FGH"),
  // keep it as-is for better matching
  if (text.trim() === text.trim().toUpperCase() && text.trim().length < 20) {
    return text.trim();
  }
  
  return cleaned;
}

/**
 * Generates a human-readable description for a placeholder
 */
function generateDescription(content: string): string {
  const cleaned = content.trim();
  
  // If it's already descriptive, return it
  if (cleaned.length > 3) {
    return cleaned;
  }
  
  return `Fill in: ${cleaned}`;
}

/**
 * Infers the data type of a placeholder based on its name
 */
function inferType(content: string): string {
  const lower = content.toLowerCase();
  
  if (lower.includes('date') || lower.includes('day')) return 'date';
  if (lower.includes('amount') || lower.includes('price') || lower.includes('cap') || lower.includes('$')) return 'currency';
  if (lower.includes('email')) return 'email';
  if (lower.includes('number') || lower.includes('qty')) return 'number';
  if (lower.includes('address')) return 'address';
  if (lower.includes('name')) return 'text';
  
  return 'text';
}

/**
 * Replaces placeholders in text with filled values
 */
export function fillDocument(originalText: string, filledValues: Record<string, string>): string {
  let result = originalText;
  
  Object.entries(filledValues).forEach(([key, value]) => {
    // Try to find and replace the original placeholder
    const patterns = [
      new RegExp(`\\[${key}\\]`, 'gi'),
      new RegExp(`\\[${key.replace(/_/g, ' ')}\\]`, 'gi'),
      new RegExp(`\\{\\{${key}\\}\\}`, 'gi'),
    ];
    
    patterns.forEach(pattern => {
      result = result.replace(pattern, value);
    });
  });
  
  return result;
}

