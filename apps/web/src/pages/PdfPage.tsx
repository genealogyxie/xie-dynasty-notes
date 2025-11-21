import { useState } from 'react';
import { PdfViewer } from '../components/PdfViewer';

export function PdfPage() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [showPdf, setShowPdf] = useState(false);

  const handleLoadPdf = () => {
    if (pdfUrl.trim()) {
      setShowPdf(true);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-white">
        <h2 className="text-lg font-semibold mb-2">PDF Printout (Experimental)</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="Enter PDF URL..."
            className="flex-1 px-3 py-2 border rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadPdf();
            }}
          />
          <button
            onClick={handleLoadPdf}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load PDF
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter a PDF URL to insert as a printout. You can annotate on top of the pages.
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        {showPdf && pdfUrl ? (
          <PdfViewer pdfUrl={pdfUrl} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p>Enter a PDF URL above to load a printout</p>
              <p className="text-sm mt-2">
                Example: https://example.com/document.pdf
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
