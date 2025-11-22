import { useState } from 'react';
import { X, Sparkles, FileText, Tag, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AIProvider } from '../lib/ai/types';

interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
  aiProvider: AIProvider;
  selectedText?: string;
}

export function AIAssistantPanel({ open, onClose, aiProvider, selectedText }: AIAssistantPanelProps) {
  const [text, setText] = useState(selectedText || '');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'summarize' | 'keywords' | 'ocr' | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setActiveFeature('summarize');
    setResult('');

    try {
      const summary = await aiProvider.summarize(text, { style: 'brief' });
      setResult(summary);
    } catch (error) {
      setResult('Failed to summarize text. Please try again.');
      console.error('Summarization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setActiveFeature('keywords');
    setResult('');

    try {
      const keywords = await aiProvider.extractKeywords(text, 10);
      setResult('Keywords: ' + keywords.join(', '));
    } catch (error) {
      setResult('Failed to extract keywords. Please try again.');
      console.error('Keyword extraction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOCR = async (file: File) => {
    setLoading(true);
    setActiveFeature('ocr');
    setResult('');

    try {
      const recognizedText = await aiProvider.recognizeText(file);
      setResult(recognizedText);
      setText(recognizedText);
    } catch (error) {
      setResult('Failed to recognize text from image. Please try again.');
      console.error('OCR error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleOCR(file);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <span className="text-xs text-gray-500">({aiProvider.name})</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <Textarea
              placeholder="Enter or paste text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              variant="outline"
            >
              {loading && activeFeature === 'summarize' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Summarize
            </Button>

            <Button
              onClick={handleExtractKeywords}
              disabled={loading || !text.trim()}
              variant="outline"
            >
              {loading && activeFeature === 'keywords' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Tag className="h-4 w-4 mr-2" />
              )}
              Extract Keywords
            </Button>

            <label>
              <Button
                disabled={loading}
                variant="outline"
                asChild
              >
                <span>
                  {loading && activeFeature === 'ocr' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Image className="h-4 w-4 mr-2" />
                  )}
                  OCR from Image
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {result && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Result:</h3>
              <div className="text-gray-700 whitespace-pre-wrap">{result}</div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 border-t pt-4">
            <p className="font-semibold mb-2">Available Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Summarize:</strong> Generate a brief summary of your text (works offline)</li>
              <li><strong>Extract Keywords:</strong> Identify key terms and concepts (works offline)</li>
              <li><strong>OCR from Image:</strong> Extract text from images (works offline using Tesseract.js)</li>
            </ul>
            <p className="mt-3 text-purple-600">
              ✨ All features work completely offline!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
