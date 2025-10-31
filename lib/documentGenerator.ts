import PizZip from 'pizzip';

/**
 * Generates a filled document from template and values
 * Uses direct XML text replacement for maximum compatibility
 */
export async function generateDocument(
  templateBuffer: Buffer,
  filledValues: Record<string, string>,
  originalPlaceholders: Array<{key: string, original: string}> = []
): Promise<Buffer> {
  try {
    console.log('[Generator] Starting document generation...');
    console.log('[Generator] Values to fill:', JSON.stringify(filledValues, null, 2));
    
    const zip = new PizZip(templateBuffer);
    
    // Get the main document XML
    const documentXml = zip.file('word/document.xml');
    if (!documentXml) {
      throw new Error('Could not find document.xml in .docx file');
    }
    
    let xmlContent = documentXml.asText();
    console.log('[Generator] Original XML length:', xmlContent.length);
    
    // SAFE REPLACEMENT: Only replace text inside <w:t> tags
    console.log('[Generator] Starting safe text replacement...');
    
    // Create a map of keys to their original placeholder formats
    const keyToOriginal = new Map<string, string>();
    originalPlaceholders.forEach(p => {
      keyToOriginal.set(p.key, p.original);
      console.log(`[Generator] Mapping: ${p.key} → ${p.original}`);
    });
    
    Object.entries(filledValues).forEach(([key, value]) => {
      console.log(`[Generator] Processing ${key} = "${value}"`);
      
      // Get the ORIGINAL placeholder format if available
      const originalFormat = keyToOriginal.get(key);
      if (originalFormat) {
        console.log(`[Generator]   Using original format: ${originalFormat}`);
      }
      
      // Create variations of the key
      const keyWithSpaces = key.replace(/_/g, ' ');
      const keyCapitalized = keyWithSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // All possible placeholder formats - ORIGINAL FORMAT FIRST!
      const placeholderVariations = originalFormat 
        ? [
            originalFormat, // Use the EXACT original format first!
            `"${key}"`,
            `[${key}]`,
            `{{${key}}}`,
            `"${keyWithSpaces}"`,
            `"${keyCapitalized}"`,
            `[${keyWithSpaces}]`,
            `[${keyCapitalized}]`,
            key,
          ]
        : [
            `"${key}"`,
            `[${key}]`,
            `{{${key}}}`,
            `"${keyWithSpaces}"`,
            `"${keyCapitalized}"`,
            `[${keyWithSpaces}]`,
            `[${keyCapitalized}]`,
            `{{${keyWithSpaces}}}`,
            `{{${keyCapitalized}}}`,
            key,
            keyWithSpaces,
          ];
      
      let totalReplaced = 0;
      
      // Replace only within <w:t>...</w:t> tags to avoid breaking XML
      xmlContent = xmlContent.replace(
        /(<w:t[^>]*>)(.*?)(<\/w:t>)/g,
        (match, openTag, textContent, closeTag) => {
          let newText = textContent;
          
          placeholderVariations.forEach(placeholder => {
            const regex = new RegExp(escapeRegex(placeholder), 'gi');
            if (regex.test(newText)) {
              console.log(`[Generator] ✓ Found "${placeholder}" in text element`);
              newText = newText.replace(regex, value);
              totalReplaced++;
            }
          });
          
          return openTag + newText + closeTag;
        }
      );
      
      if (totalReplaced > 0) {
        console.log(`[Generator] ✓ Replaced ${totalReplaced} occurrences of ${key}`);
      } else {
        console.log(`[Generator] ⚠️ No matches found for ${key}`);
      }
    });
    
    // CLEANUP: Remove any remaining placeholder labels (like [JKL], [Manager] in signature section)
    // These often appear as italicized labels and should be removed
    console.log('[Generator] Cleaning up remaining placeholder labels...');
    const remainingPlaceholders = xmlContent.match(/\[([A-Z][A-Za-z\s]{1,20})\]/g);
    if (remainingPlaceholders) {
      console.log('[Generator] Found remaining placeholders:', remainingPlaceholders.join(', '));
      remainingPlaceholders.forEach(placeholder => {
        // Remove these label placeholders
        const regex = new RegExp(escapeRegex(placeholder), 'g');
        xmlContent = xmlContent.replace(regex, '');
        console.log(`[Generator] Removed label: ${placeholder}`);
      });
    }
    
    // Update the XML in the zip
    zip.file('word/document.xml', xmlContent);
    
    // Generate the new document
    const buffer = zip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    
    console.log('[Generator] Document generated successfully, size:', buffer.length);
    return buffer;
  } catch (error: any) {
    console.error('[Generator] Error generating document:', error);
    throw new Error(`Failed to generate document: ${error.message}`);
  }
}

/**
 * Escapes special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalizes Word XML by merging adjacent text elements
 * Word often splits text like [Company Name] across multiple <w:t> tags
 */
function normalizeWordXML(xml: string): string {
  // Merge consecutive <w:t> elements
  // Pattern: </w:t></w:r><w:r><w:t> (and variations with attributes)
  
  let normalized = xml;
  
  // Remove formatting runs that split text unnecessarily
  // This merges: <w:t>Hello</w:t></w:r><w:r><w:t>World</w:t> -> <w:t>HelloWorld</w:t>
  normalized = normalized.replace(
    /<\/w:t><\/w:r><w:r[^>]*><w:t[^>]*>/g,
    ''
  );
  
  // Also merge adjacent w:t tags within the same w:r
  normalized = normalized.replace(
    /<\/w:t><w:t[^>]*>/g,
    ''
  );
  
  console.log('[Generator] XML normalized (merged split text elements)');
  return normalized;
}

/**
 * Prepares filled values for docxtemplater format
 */
function prepareDataForTemplate(filledValues: Record<string, string>): Record<string, string> {
  const prepared: Record<string, string> = {};
  
  Object.entries(filledValues).forEach(([key, value]) => {
    // Use the key as-is
    prepared[key] = value;
    
    // Also create variations for common formats
    const variations = [
      key.replace(/_/g, ' '),           // COMPANY_NAME -> COMPANY NAME
      key.replace(/_/g, ''),             // COMPANY_NAME -> COMPANYNAME
      key.toLowerCase(),                 // COMPANY_NAME -> company_name
      key.replace(/_/g, ' ').toLowerCase(), // COMPANY_NAME -> company name
    ];
    
    variations.forEach(variation => {
      prepared[variation] = value;
    });
  });
  
  return prepared;
}

/**
 * Simple replacement in text (fallback method)
 */
export function simpleReplacement(
  originalText: string,
  filledValues: Record<string, string>
): string {
  let result = originalText;
  
  Object.entries(filledValues).forEach(([key, value]) => {
    // Try various replacement patterns
    const patterns = [
      new RegExp(`\\[${key}\\]`, 'gi'),
      new RegExp(`\\[${key.replace(/_/g, ' ')}\\]`, 'gi'),
      new RegExp(`\\{\\{${key}\\}\\}`, 'gi'),
      new RegExp(`__{${key}}__`, 'gi'),
      new RegExp('_{5,}', 'g'), // Replace long underscores
    ];
    
    patterns.forEach(pattern => {
      result = result.replace(pattern, value);
    });
  });
  
  return result;
}

