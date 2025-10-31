'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import DocumentPreview from '@/components/DocumentPreview';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [documentData, setDocumentData] = useState<any>(null);
  const [filledPlaceholders, setFilledPlaceholders] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Load document data from sessionStorage
    const storedData = sessionStorage.getItem('documentData');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.documentId === documentId) {
        setDocumentData(data);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [documentId, router]);

  const handleComplete = (filled: Record<string, string>) => {
    setFilledPlaceholders(filled);
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem('documentData');
    router.push('/');
  };

  if (!documentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {showPreview ? 'Review & Download' : 'Fill Your Document'}
              </h1>
              <p className="text-gray-600 mt-1">
                Document: {documentData.fileName}
              </p>
            </div>
            <button
              onClick={handleStartOver}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-200px)]">
          {showPreview ? (
            <div>
              <button
                onClick={handleBack}
                className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chat
              </button>
              <DocumentPreview
                documentId={documentId}
                filledPlaceholders={filledPlaceholders}
                placeholders={documentData.placeholders}
              />
            </div>
          ) : (
            <ChatInterface
              documentId={documentId}
              placeholders={documentData.placeholders}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </main>
  );
}

