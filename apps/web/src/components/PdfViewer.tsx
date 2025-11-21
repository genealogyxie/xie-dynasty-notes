import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfUrl: string;
  onPageRendered?: (pageNumber: number, canvas: HTMLCanvasElement) => void;
}

export function PdfViewer({ pdfUrl, onPageRendered }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);

        if (containerRef.current) {
          containerRef.current.innerHTML = '';

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) continue;

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.className = 'border border-gray-300 mb-4 shadow-md';

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
              canvas: canvas,
            };

            await page.render(renderContext).promise;

            const pageContainer = document.createElement('div');
            pageContainer.className = 'relative mb-4';
            pageContainer.appendChild(canvas);

            const pageLabel = document.createElement('div');
            pageLabel.className = 'text-sm text-gray-600 mb-2';
            pageLabel.textContent = `Page ${pageNum} of ${pdf.numPages}`;
            
            const wrapper = document.createElement('div');
            wrapper.appendChild(pageLabel);
            wrapper.appendChild(pageContainer);

            containerRef.current?.appendChild(wrapper);

            if (onPageRendered) {
              onPageRendered(pageNum, canvas);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please check the URL and try again.');
        setLoading(false);
      }
    };

    if (pdfUrl) {
      loadPdf();
    }
  }, [pdfUrl, onPageRendered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading PDF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 bg-white flex items-center gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(numPages, prev + 1))}
          disabled={currentPage === numPages}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto p-4 bg-gray-50" />
    </div>
  );
}
