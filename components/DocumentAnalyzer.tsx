'use client';

import { useState } from 'react';

interface DocumentAnalyzerProps {
  documentId: string;
}

export default function DocumentAnalyzer({ documentId }: DocumentAnalyzerProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <button
        onClick={analyzeDocument}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Document'}
      </button>

      {analysis && (
        <div className="mt-4 space-y-4">
          <div className="bg-white p-4 rounded">
            <h3 className="font-bold mb-2">Found Placeholders:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>In Brackets [...]:</strong>
                <div className="ml-4 text-gray-700">
                  {analysis.foundPlaceholders.brackets.length > 0
                    ? analysis.foundPlaceholders.brackets.join(', ')
                    : 'None found'}
                </div>
              </div>
              <div>
                <strong>In Quotes "...":</strong>
                <div className="ml-4 text-gray-700">
                  {analysis.foundPlaceholders.quotes.length > 0
                    ? analysis.foundPlaceholders.quotes.join(', ')
                    : 'None found'}
                </div>
              </div>
              <div>
                <strong>Total Placeholders:</strong> {analysis.totalCount}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded">
            <h3 className="font-bold mb-2">Document Text Sample:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {analysis.textSample}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

