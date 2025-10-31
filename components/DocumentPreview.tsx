'use client';

import { useState } from 'react';
import { Placeholder } from '@/lib/documentParser';

interface DocumentPreviewProps {
  documentId: string;
  filledPlaceholders: Record<string, string>;
  placeholders: Placeholder[];
  templateBase64?: string;
}

export default function DocumentPreview({
  documentId,
  filledPlaceholders,
  placeholders,
  templateBase64,
}: DocumentPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          filledPlaceholders,
          placeholders, // Send original placeholder info
          templateBase64, // Provide template to avoid filesystem
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data = await response.json();
      setDownloadUrl(data.downloadUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  const allFieldsFilled = Object.keys(filledPlaceholders).length === placeholders.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Preview</h2>

        {/* Filled Values Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filled Values:</h3>
          <div className="space-y-2">
            {Object.entries(filledPlaceholders).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-900 mt-1">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate/Download Section */}
        <div className="border-t pt-6">
          {!downloadUrl ? (
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={!allFieldsFilled || generating}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
              >
                {generating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Document...
                  </span>
                ) : (
                  'Generate Completed Document'
                )}
              </button>
              {!allFieldsFilled && (
                <p className="mt-2 text-sm text-gray-500">
                  Please complete all fields in the chat to generate the document
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-green-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-semibold text-green-800">
                  Document Generated Successfully!
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold inline-flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Completed Document
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

