import { createWorker, Worker } from 'tesseract.js';
import { AIProvider, SummarizeOptions } from './types';

/**
 * OfflineAIProvider implements basic AI features using client-side algorithms
 * - Text summarization using TextRank algorithm
 * - Keyword extraction using RAKE (Rapid Automatic Keyword Extraction)
 * - OCR using Tesseract.js
 */
export class OfflineAIProvider implements AIProvider {
  name = 'Offline AI (Basic)';
  private ocrWorker: Worker | null = null;

  async isAvailable(): Promise<boolean> {
    return true; // Always available offline
  }

  /**
   * Summarize text using extractive summarization (TextRank-inspired)
   */
  async summarize(text: string, options?: SummarizeOptions): Promise<string> {
    const maxLength = options?.maxLength || 200;
    const style = options?.style || 'brief';

    const sentences = this.splitIntoSentences(text);
    
    if (sentences.length === 0) {
      return '';
    }

    if (sentences.length <= 3) {
      return sentences.join(' ');
    }

    const scores = this.scoreSentences(sentences);
    
    const numSentences = style === 'brief' ? Math.min(3, sentences.length) : 
                        style === 'detailed' ? Math.min(5, sentences.length) :
                        Math.min(7, sentences.length);
    
    const topIndices = scores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentences)
      .map(item => item.index)
      .sort((a, b) => a - b); // Maintain original order

    let summary = topIndices.map(i => sentences[i]).join(' ');

    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + '...';
    }

    if (style === 'bullet-points') {
      const bullets = topIndices.map(i => `• ${sentences[i]}`);
      return bullets.join('\n');
    }

    return summary;
  }

  /**
   * Extract keywords using RAKE-inspired algorithm
   */
  async extractKeywords(text: string, limit: number = 10): Promise<string[]> {
    const normalized = text.toLowerCase();
    
    const words = normalized.match(/\b[a-z]{3,}\b/g) || [];
    
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
      'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
      'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
      'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
      'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
      'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
      'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
      'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
      'were', 'said', 'did', 'having', 'may', 'should', 'could', 'would',
    ]);
    
    const filteredWords = words.filter(word => !stopWords.has(word));
    
    const wordFreq = new Map<string, number>();
    filteredWords.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    const keywords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
    
    return keywords;
  }

  /**
   * Perform OCR on an image using Tesseract.js
   */
  async recognizeText(image: Blob | string): Promise<string> {
    if (!this.ocrWorker) {
      this.ocrWorker = await createWorker('eng');
    }

    const result = await this.ocrWorker.recognize(image);
    return result.data.text;
  }

  /**
   * Cleanup OCR worker
   */
  async cleanup(): Promise<void> {
    if (this.ocrWorker) {
      await this.ocrWorker.terminate();
      this.ocrWorker = null;
    }
  }


  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private scoreSentences(sentences: string[]): number[] {
    const wordFreq = new Map<string, number>();
    const allWords: string[] = [];
    
    sentences.forEach(sentence => {
      const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      words.forEach(word => {
        allWords.push(word);
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
    });

    return sentences.map((sentence, index) => {
      const words = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      
      const freqScore = words.reduce((sum, word) => sum + (wordFreq.get(word) || 0), 0);
      
      const positionScore = 1 / (index + 1);
      
      const lengthPenalty = words.length < 5 || words.length > 30 ? 0.5 : 1;
      
      return (freqScore / words.length) * positionScore * lengthPenalty;
    });
  }
}

/**
 * OnlineAIProvider for enhanced AI features using cloud APIs
 * This would connect to OpenAI, Azure, or other cloud providers
 */
export class OnlineAIProvider implements AIProvider {
  name = 'Online AI (Enhanced)';
  private apiKey: string | null = null;
  private apiUrl: string;

  constructor(apiUrl: string = '/api/ai') {
    this.apiUrl = apiUrl;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    if (!navigator.onLine) return false;
    if (!this.apiKey) return false;
    
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async summarize(text: string, options?: SummarizeOptions): Promise<string> {
    const response = await fetch(`${this.apiUrl}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ text, options }),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize text');
    }

    const data = await response.json();
    return data.summary;
  }

  async extractKeywords(text: string, limit: number = 10): Promise<string[]> {
    const response = await fetch(`${this.apiUrl}/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ text, limit }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract keywords');
    }

    const data = await response.json();
    return data.keywords;
  }

  async recognizeText(image: Blob | string): Promise<string> {
    const formData = new FormData();
    if (typeof image === 'string') {
      formData.append('image_url', image);
    } else {
      formData.append('image', image);
    }

    const response = await fetch(`${this.apiUrl}/ocr`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to recognize text');
    }

    const data = await response.json();
    return data.text;
  }

  async semanticSearch(query: string, documents: string[]): Promise<number[]> {
    const response = await fetch(`${this.apiUrl}/semantic-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ query, documents }),
    });

    if (!response.ok) {
      throw new Error('Failed to perform semantic search');
    }

    const data = await response.json();
    return data.indices;
  }
}
