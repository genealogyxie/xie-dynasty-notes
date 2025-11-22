import { useState, useEffect } from 'react';
import { X, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DictionaryResult } from '../lib/dictionary/types';

interface DictionaryPanelProps {
  open: boolean;
  onClose: () => void;
  initialWord?: string;
  onLookup: (word: string) => Promise<DictionaryResult | null>;
}

export function DictionaryPanel({ open, onClose, initialWord, onLookup }: DictionaryPanelProps) {
  const [word, setWord] = useState(initialWord || '');
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialWord) {
      setWord(initialWord);
      handleLookup(initialWord);
    }
  }, [initialWord]);

  const handleLookup = async (searchWord: string) => {
    if (!searchWord.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const lookupResult = await onLookup(searchWord);
      setResult(lookupResult);

      if (lookupResult && lookupResult.entries.length === 0) {
        setError('Word not found in dictionary');
      }
    } catch (err) {
      setError('Failed to look up word');
      console.error('Dictionary lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(word);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Dictionary</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a word to look up..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Look Up
            </Button>
          </form>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="text-center text-gray-500 py-8">
              Looking up word...
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              {result?.suggestions && result.suggestions.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Did you mean:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWord(suggestion);
                          handleLookup(suggestion);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && result && result.entries.length > 0 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-900">{result.word}</h3>
              </div>

              {result.entries.map((entry, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600 uppercase">
                      {entry.partOfSpeech}
                    </span>
                    {entry.phonetic && (
                      <span className="text-sm text-gray-500">
                        {entry.phonetic}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Definitions:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {entry.definitions.map((def, defIndex) => (
                        <li key={defIndex} className="text-gray-700">
                          {def}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {entry.examples && entry.examples.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Examples:</h4>
                      <ul className="space-y-1">
                        {entry.examples.map((example, exIndex) => (
                          <li key={exIndex} className="text-gray-600 italic pl-4 border-l-2 border-gray-300">
                            "{example}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entry.synonyms && entry.synonyms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Synonyms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.synonyms.map((synonym) => (
                          <Button
                            key={synonym}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setWord(synonym);
                              handleLookup(synonym);
                            }}
                            className="text-xs"
                          >
                            {synonym}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.antonyms && entry.antonyms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Antonyms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.antonyms.map((antonym) => (
                          <Button
                            key={antonym}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setWord(antonym);
                              handleLookup(antonym);
                            }}
                            className="text-xs"
                          >
                            {antonym}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.etymology && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Etymology:</h4>
                      <p className="text-gray-600 text-sm">{entry.etymology}</p>
                    </div>
                  )}

                  {index < result.entries.length - 1 && (
                    <div className="border-t pt-4" />
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && !result && (
            <div className="text-center text-gray-500 py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Enter a word to look up its definition</p>
              <p className="text-sm mt-2">Works completely offline!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
